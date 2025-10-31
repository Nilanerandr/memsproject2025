import * as UserModel from '../models/Users.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

// Créer un utilisateur (Register)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const img = req.file ? `/uploads/users/${req.file.filename}` : null;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email et password requis" });
    }

    // Créer l'utilisateur
    const user = await UserModel.createUser(name, email, password, img);

    // Générer token JWT
    const token = jwt.sign({ id: user.id_user, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const { name, email } = req.body;
    const img = req.file ? `/uploads/users/${req.file.filename}` : null;

    // Validation
    if (!id_user) {
      return res.status(400).json({ error: "id_user requis" });
    }

    // Mettre à jour
    const updatedUser = await UserModel.updateUser(id_user, name, email, img);

    res.json({
      message: "Utilisateur mis à jour",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Récupérer les infos d'un utilisateur
export const getUser = async (req, res) => {
  try {
    const { id_user } = req.params;

    // Validation
    if (!id_user) {
      return res.status(400).json({ error: "id_user requis" });
    }

    // Récupérer l'utilisateur
    const user = await UserModel.getUser(id_user);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      message: "Utilisateur trouvé",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Se connecter (Login)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "email et password requis" });
    }

    // Vérifier les identifiants
    const user = await UserModel.loginUser(email, password);

    // Générer token JWT
    const token = jwt.sign({ id: user.id_user, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      message: "Connexion réussie",
      user,
      token
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
