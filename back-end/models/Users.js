import db from '../config/db.js';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../config/env.js';
// Créer un utilisateur
export const createUser = async (name, email, password, img = null) => {
  return new Promise((resolve, reject) => {
    // Vérifier si email existe déjà
    const checkQuery = 'SELECT id_user FROM Users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) return reject(new Error('Email déjà utilisé'));

      try {
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        // Insérer l'utilisateur
        const insertQuery = 'INSERT INTO Users (name, email, password, img) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [name, email, hashedPassword, img], (err, result) => {
          if (err) return reject(err);
          
          const newUserId = result.insertId;

          // ✅ CRÉER UN PRIX PAR DÉFAUT (100 FCFA/min)
          const prixQuery = 'INSERT INTO PrixParMinute (id_user, value) VALUES (?, ?)';
          db.query(prixQuery, [newUserId, 10], (prixErr) => {
            if (prixErr) return reject(prixErr);

            // ✅ Retourner l'utilisateur créé
            resolve({ id_user: newUserId, name, email, img });
          });
        });
      } catch (hashError) {
        reject(hashError);
      }
    });
  });
};


// Mettre à jour seulement le nom
// Mettre à jour un utilisateur
export const updateUser = async (id_user, name, email, img = null) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE Users SET name = ?, email = ?, img = ? WHERE id_user = ?';
    db.query(query, [name, email, img, id_user], (err, result) => {
      if (err) reject(err);
      resolve({ id_user, name, email, img });
    });
  });
};
// Récupérer un utilisateur par ID
export const getUser = async (id_user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id_user, name, email, img, created_at FROM Users WHERE id_user = ?';
    db.query(query, [id_user], (err, results) => {
      if (err) reject(err);
      resolve(results[0] || null);
    });
  });
};
// Se connecter (vérifier email et mot de passe)
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    // Trouver l'utilisateur par email
    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) return reject(err);
      
      if (results.length === 0) {
        return reject(new Error('Email ou mot de passe incorrect'));
      }

      const user = results[0];

      try {
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return reject(new Error('Email ou mot de passe incorrect'));
        }

        // Retourner les infos de l'utilisateur (sans le mot de passe)
        resolve({
          id_user: user.id_user,
          name: user.name,
          email: user.email,
          img: user.img
        });
      } catch (bcryptError) {
        reject(bcryptError);
      }
    });
  });
};
