import express from 'express';
import {
  getAllPaymentByUserId,
  getPayementById,
  validerPayement,
  getAllPayements
} from '../controllers/Payementcontrollers.js';

const router = express.Router();

// Tous les paiements d’un admin
router.get('/payements/user/:id_user', getAllPaymentByUserId);

// Un paiement par ID
router.get('/payements/:id_payement', getPayementById);

// Valider un paiement
router.put('/payements/:id_payement/valider', validerPayement);

// Tous les paiements (global)
router.get('/payements', getAllPayements);

export default router;
