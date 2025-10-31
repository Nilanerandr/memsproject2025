// controllers/esp32Controller.js
import * as DonneesModel from '../models/DonneeESP32.js';
import * as PayementModel from '../models/Payement.js';
import * as PrixModel from '../models/PrixParminutes.js';
import * as DeviceOwnerModel from '../models/DeviceOwner.js';
import * as ConsModel from '../models/Consommationpc.js';

// Puissance moyenne (W) configurable via .env, sinon 60W par défaut
const PUISSANCE_MOYENNE_W = Number(process.env.PC_POWER_W || 60);

// Traiter les messages MQTT (ESP32 -> MQTT -> Backend)
export const handleMqttMessage = async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    // Attendus: nom_esp32, poste, puissance_consommee, etat_du_poste, etat_pc, duree_actif_poste, duree_actif_pc
    const { nom_esp32, poste, puissance_consommee, etat_du_poste, etat_pc, duree_actif_poste, duree_actif_pc } = data;

    if (!poste || !nom_esp32) {
      console.error('❌ Poste ou nom_esp32 manquant dans le message MQTT');
      return null;
    }

    // 1) Résoudre l'admin propriétaire de ce device
    const owner = await DeviceOwnerModel.getOwnerByDevice(nom_esp32);
    if (!owner) {
      console.warn(`⚠️ Aucun owner pour ${nom_esp32} → liez le device via /api/devices/link`);
      return null;
    }
    const id_user = owner.id_user;

    // 2) Récupérer la dernière entrée de ce poste pour cet admin
    const last = await DonneesModel.getLastDonneeByUserAndPoste(id_user, poste);
    let result = null;

    // 🪑 CAS 1: nouvelle session (etat 0 → 1)
    if (!last || last.etat_du_poste === 0) {
      if (etat_du_poste === 1) {
        result = await DonneesModel.createDonnee(
          poste,
          nom_esp32,
          typeof puissance_consommee === 'number' ? puissance_consommee : 0,
          1,
          typeof etat_pc === 'number' ? etat_pc : 0,
          0,
          id_user
        );
        console.log('🪑 Nouvelle session démarrée:', poste);
      }
    }
    // ⏱️ CAS 2: session en cours (etat 1 → 1)
    else if (etat_du_poste === 1) {
      if (typeof duree_actif_poste === 'number') {
        await DonneesModel.updateDureeActifPoste(last.id_donnee, duree_actif_poste);
      }
      if (typeof duree_actif_pc === 'number') {
        await DonneesModel.updateDureeActifPC(last.id_donnee, duree_actif_pc);
      }
      if (typeof etat_pc === 'number') {
        await DonneesModel.updateEtatPC(last.id_donnee, etat_pc);
      }
      if (typeof puissance_consommee === 'number') {
        await DonneesModel.updatePuissance(last.id_donnee, puissance_consommee);
      }

      result = {
        ...last,
        duree_actif_poste: typeof duree_actif_poste === 'number' ? duree_actif_poste : last?.duree_actif_poste ?? 0,
        duree_actif_pc: typeof duree_actif_pc === 'number' ? duree_actif_pc : last?.duree_actif_pc ?? 0,
        etat_pc: typeof etat_pc === 'number' ? etat_pc : last?.etat_pc ?? 0,
        puissance_consommee: typeof puissance_consommee === 'number' ? puissance_consommee : last?.puissance_consommee ?? 0
      };
      console.log('⏱️ Session mise à jour:', poste, 'duree_poste=', result.duree_actif_poste, 's', 'duree_pc=', result.duree_actif_pc ?? 0, 's');
    }
    // 🚶 CAS 3: fin de session (etat 1 → 0)
    else if (etat_du_poste === 0 && last.etat_du_poste === 1) {
      const finalDureePoste = typeof duree_actif_poste === 'number' ? duree_actif_poste : last?.duree_actif_poste ?? 0;
      const finalDureePc = typeof duree_actif_pc === 'number' ? duree_actif_pc : last?.duree_actif_pc ?? 0;

      // Figer les durées
      await DonneesModel.updateDureeActifPoste(last.id_donnee, finalDureePoste);
      await DonneesModel.updateDureeActifPC(last.id_donnee, finalDureePc);

      // Consommation (Wh) basée sur la durée PC
      const consoWh = Number(((PUISSANCE_MOYENNE_W * finalDureePc) / 3600).toFixed(3));
      await ConsModel.createConsommation(
        id_user,
        last.id_donnee,
        poste,
        nom_esp32,
        finalDureePc,
        PUISSANCE_MOYENNE_W,
        consoWh
      );

      // Etat poste + paiement (basé sur la durée poste)
      await DonneesModel.updateEtatPoste(last.id_donnee, 0, typeof etat_pc === 'number' ? etat_pc : last?.etat_pc ?? 0);

      const prixInfo = await PrixModel.getPrixByUser(id_user);
      const prixParMinute = prixInfo ? Number(prixInfo.value) : 100;
      const montant = Math.ceil((finalDureePoste / 60) * prixParMinute);

      const paiement = await PayementModel.createPayement(
        id_user,
        prixInfo?.id_prix || null,
        last.id_donnee,
        montant,
        finalDureePoste
      );
      console.log('💰 Paiement créé:', { id_payement: paiement.id_payement, montant, duree: finalDureePoste });

      // Remise à 0 des durées pour le prochain cycle
      await DonneesModel.updateDureeActifPoste(last.id_donnee, 0);
      await DonneesModel.updateDureeActifPC(last.id_donnee, 0);
      console.log('🔄 Durées réinitialisées (poste et PC)');

      result = {
        ...last,
        duree_actif_poste: 0,
        duree_actif_pc: 0,
        etat_du_poste: 0,
        paiement
      };
    }

    // 3) Émettre vers le frontend (Socket.IO)
    const { io } = await import('../server.js');
    io.emit('esp32Data', {
      nom_esp32,
      poste,
      id_user,
      puissance_consommee,
      etat_du_poste,
      etat_pc,
      duree_actif_poste: result?.duree_actif_poste ?? duree_actif_poste ?? last?.duree_actif_poste ?? 0,
      duree_actif_pc: result?.duree_actif_pc ?? duree_actif_pc ?? last?.duree_actif_pc ?? 0,
      timestamp: new Date()
    });

    return result;
  } catch (err) {
    console.error('❌ Erreur traitement MQTT:', err.message);
    return null;
  }
};

// ======== Contrôleurs API de lecture (REST) ========

// GET /api/donnees/poste/:poste? id_user=#
export const getDonneesByPoste = async (req, res) => {
  try {
    const { poste } = req.params;
    const id_user = Number(req.query.id_user);
    if (!poste || !id_user) return res.status(400).json({ error: 'poste et id_user requis' });

    const rows = await DonneesModel.getDonneesByPosteAndUser(id_user, poste);
    res.json({ count: rows.length, donnees: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/donnees/poste/:poste/last? id_user=#
export const getLastDonnee = async (req, res) => {
  try {
    const { poste } = req.params;
    const id_user = Number(req.query.id_user);
    if (!poste || !id_user) return res.status(400).json({ error: 'poste et id_user requis' });

    const row = await DonneesModel.getLastDonneeByUserAndPoste(id_user, poste);
    res.json({ donnee: row || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/donnees? id_user=#
export const getAllDonnees = async (req, res) => {
  try {
    const id_user = Number(req.query.id_user);
    if (!id_user) return res.status(400).json({ error: 'id_user requis' });

    const rows = await DonneesModel.getAllDonneesByUser(id_user);
    res.json({ count: rows.length, donnees: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/donnees/actives? id_user=#
export const getSessionsActives = async (req, res) => {
  try {
    const id_user = Number(req.query.id_user);
    if (!id_user) return res.status(400).json({ error: 'id_user requis' });

    const rows = await DonneesModel.getSessionsActivesByUser(id_user);
    res.json({ count: rows.length, sessions: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/donnees/:id_donnee
export const getDonneeById = async (req, res) => {
  try {
    const { id_donnee } = req.params;
    const row = await DonneesModel.getDonneeById(Number(id_donnee));
    res.json({ donnee: row || null });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
