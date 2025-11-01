// routes/consommationPCRoutes.js
import express from 'express';
import  auth  from '../middlewares/auth.js';
import {
  createCons,
  getConsByUser,
  getTotals
} from '../controllers/Consommationpccpntrollers.js';

const router = express.Router();

// Créer une ligne de consommation (usage admin/test; en prod c'est créé par handleMqttMessage)
router.post('/consommations', createCons);

// Lister les consommations d'un admin, avec filtres start/end/limit/offset
router.get('/consommations/user/:id_user', getConsByUser);

// Totaux (Wh et secondes) d'un admin, avec filtres start/end
router.get('/consommations/user/:id_user/totals', getTotals);

export default router;
