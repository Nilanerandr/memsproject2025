import db from '../config/db.js';

// Créer un paiement automatique
export const createPayement = async (id_user, id_prix, id_donnee, value, duree_utilisation) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Payement
      (id_user, id_prix, id_donnee, value, duree_utilisation, validation_du_payement)
      VALUES (?, ?, ?, ?, ?, 0)
    `;
    db.query(query, [id_user, id_prix, id_donnee, value, duree_utilisation], (err, result) => {
      if (err) return reject(err);
      resolve({
        id_payement: result.insertId,
        id_user,
        id_prix,
        id_donnee,
        value,
        duree_utilisation,
        validation_du_payement: 0
      });
    });
  });
};

// Tous les paiements d'un utilisateur
export const getAllPaymentByUserId = async (id_user) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Payement WHERE id_user = ? ORDER BY date_creation DESC';
    db.query(query, [id_user], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Un paiement par ID
export const getPayementById = async (id_payement) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Payement WHERE id_payement = ?';
    db.query(query, [id_payement], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

// Valider un paiement
export const validerPayement = async (id_payement) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE Payement SET validation_du_payement = 1 WHERE id_payement = ?';
    db.query(query, [id_payement], (err) => {
      if (err) return reject(err);
      resolve({ id_payement, validation_du_payement: 1 });
    });
  });
};

// Tous les paiements (global)
export const getAllPayements = async () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Payement ORDER BY date_creation DESC';
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
