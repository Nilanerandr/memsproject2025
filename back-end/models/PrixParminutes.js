import db from '../config/db.js';

// Mettre à jour le prix d'un utilisateur
export const UpdatePrix = async (id_user, value) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE PrixParMinute SET value = ? WHERE id_user = ?';
    db.query(query, [value, id_user], (err, result) => {
      if (err) reject(err);
      resolve({ id_user, value });
    });
  });
};


// ✅ Récupérer le prix d'un utilisateur
export const getPrixByUser = async (id_user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM PrixParMinute WHERE id_user = ?';
    db.query(query, [id_user], (err, results) => {
      if (err) reject(err);
      resolve(results[0] || null);
    });
  });
};