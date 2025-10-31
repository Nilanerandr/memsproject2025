import * as PayementModel from '../models/Payement.js';

// Tous les paiements d'un utilisateur
export const getAllPaymentByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;
    if (!id_user) return res.status(400).json({ error: 'id_user requis' });
    const paiements = await PayementModel.getAllPaymentByUserId(id_user);
    res.json({ count: paiements.length, paiements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Un paiement spécifique
export const getPayementById = async (req, res) => {
  try {
    const { id_payement } = req.params;
    if (!id_payement) return res.status(400).json({ error: 'id_payement requis' });
    const paiement = await PayementModel.getPayementById(id_payement);
    if (!paiement) return res.status(404).json({ error: 'Paiement non trouvé' });
    res.json({ paiement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Valider un paiement
export const validerPayement = async (req, res) => {
  try {
    const { id_payement } = req.params;
    if (!id_payement) return res.status(400).json({ error: 'id_payement requis' });
    const result = await PayementModel.validerPayement(id_payement);
    res.json({ message: 'Paiement validé', paiement: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tous les paiements (global)
export const getAllPayements = async (req, res) => {
  try {
    const paiements = await PayementModel.getAllPayements();
    res.json({ count: paiements.length, paiements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
