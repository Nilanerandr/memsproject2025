// controllers/consommationPCController.js
import { createConsommation, listByUser, getTotalsByUser } from '../models/Consommationpc.js';

// POST /api/consommations
// body: { id_user, id_donnee, poste, nom_esp32, duree_actif_pc, puissance_moyenne_w, consommation_Wh }
export const createCons = async (req, res) => {
  try {
    const {
      id_user,
      id_donnee = null,
      poste,
      nom_esp32,
      duree_actif_pc,
      puissance_moyenne_w,
      consommation_Wh
    } = req.body || {};

    if (!id_user || !poste || !nom_esp32) {
      return res.status(400).json({ error: 'id_user, poste et nom_esp32 sont requis' });
    }
    if (typeof duree_actif_pc !== 'number' || typeof puissance_moyenne_w !== 'number' || typeof consommation_Wh !== 'number') {
      return res.status(400).json({ error: 'duree_actif_pc, puissance_moyenne_w et consommation_Wh doivent être numériques' });
    }

    const row = await createConsommation(
      Number(id_user),
      id_donnee ? Number(id_donnee) : null,
      String(poste),
      String(nom_esp32),
      Number(duree_actif_pc),
      Number(puissance_moyenne_w),
      Number(consommation_Wh)
    );

    res.json({ message: 'Consommation créée', consommation: row });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/consommations/user/:id_user?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=100&offset=0
export const getConsByUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    if (!id_user) return res.status(400).json({ error: 'id_user requis' });

    const { start = null, end = null, limit = 100, offset = 0 } = req.query || {};
    const rows = await listByUser(Number(id_user), { start, end, limit: Number(limit), offset: Number(offset) });

    res.json({ count: rows.length, consommations: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /api/consommations/user/:id_user/totals?start=YYYY-MM-DD&end=YYYY-MM-DD
export const getTotals = async (req, res) => {
  try {
    const { id_user } = req.params;
    if (!id_user) return res.status(400).json({ error: 'id_user requis' });

    const { start = null, end = null } = req.query || {};
    const totals = await getTotalsByUser(Number(id_user), { start, end });

    res.json({ totals });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
