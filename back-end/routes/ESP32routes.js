// routes/ESP32routes.js
import express from 'express';
import {
  getDonneesByPoste,
  getLastDonnee,
  getAllDonnees,
  getSessionsActives,
  getDonneeById
} from '../controllers/Esp32controllers.js';

const router = express.Router();

// Historique d'un poste (admin requis)
router.get('/donnees/poste/:poste', getDonneesByPoste);

// Dernière donnée d'un poste (admin requis)
router.get('/donnees/poste/:poste/last', getLastDonnee);

// Toutes les données de l'admin
router.get('/donnees', getAllDonnees);

// Sessions actives (etat_du_poste = 1) pour l'admin
router.get('/donnees/actives', getSessionsActives);

// Une donnée par ID (lecture directe)
router.get('/donnees/:id_donnee', getDonneeById);

export default router;
