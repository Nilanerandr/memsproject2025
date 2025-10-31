import express from 'express';
import * as userController from '../controllers/Users_controllers.js';
import upload from '../config/multer.js';

const router = express.Router();

// Route pour créer un utilisateur (Register)
router.post('/register', upload.single('img'), userController.register);

// Route pour mettre à jour un utilisateur
router.put('/users/:id_user', upload.single('img'), userController.updateUser);

// Route pour récupérer un utilisateur
router.get('/users/:id_user', userController.getUser);

// Route pour se connecter
router.post('/login', userController.login);


export default router;
