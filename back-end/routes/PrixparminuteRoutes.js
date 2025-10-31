import express from 'express';
import { Updateprix ,getPrix } from '../controllers/Prixparminute_controllers.js';

const router = express.Router();

// Route pour mettre à jour le prix d'un utilisateur
router.put('/prixparminute/:id_user', Updateprix);
//  Route pour récupérer le prix d'un utilisateur
router.get('/prixparminute/:id_user', getPrix);

export default router;
