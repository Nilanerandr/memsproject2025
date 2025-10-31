// routes/deviceOwnerRoutes.js
import express from 'express';
import { linkDeviceToCurrentUser, getDeviceOwner, getMyDevices } from '../controllers/Ownercontrollers.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// Lier un device à l'admin connecté
router.post('/devices/link', linkDeviceToCurrentUser);

// Voir le propriétaire d'un device
router.get('/devices/:nom_esp32/owner', requireAuth, getDeviceOwner);

// Lister mes devices
router.get('/devices/mine', requireAuth, getMyDevices);

export default router;
