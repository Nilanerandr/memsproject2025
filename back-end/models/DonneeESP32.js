// models/DonneeESP32.js
import db from '../config/db.js';

// Créer une nouvelle ligne de données (nouvelle session)
// Remarque: duree_actif_poste et duree_actif_pc démarrent à 0 (DEFAULT côté SQL)
export const createDonnee = (poste, nom_esp32, puissance_consommee, etat_du_poste, etat_pc, duree_actif_poste = 0, id_user) => new Promise((resolve, reject) => {
  const q = `
    INSERT INTO DonneesESP32
      (poste, nom_esp32, id_user, puissance_consommee, etat_du_poste, etat_pc, duree_actif_poste)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(q, [poste, nom_esp32, id_user, puissance_consommee, etat_du_poste, etat_pc, duree_actif_poste], (err, result) => {
    if (err) return reject(err);
    resolve({
      id_donnee: result.insertId,
      poste,
      nom_esp32,
      id_user,
      puissance_consommee,
      etat_du_poste,
      etat_pc,
      duree_actif_poste,
      // duree_actif_pc = 0 côté SQL par défaut
    });
  });
});

// Dernière ligne pour un poste et un admin (utile pour session en cours)
export const getLastDonneeByUserAndPoste = (id_user, poste) => new Promise((resolve, reject) => {
  const q = `
    SELECT *
    FROM DonneesESP32
    WHERE id_user = ? AND poste = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `;
  db.query(q, [id_user, poste], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
});

// Historique d'un poste pour un admin
export const getDonneesByPosteAndUser = (id_user, poste) => new Promise((resolve, reject) => {
  const q = `
    SELECT *
    FROM DonneesESP32
    WHERE id_user = ? AND poste = ?
    ORDER BY timestamp DESC
    LIMIT 500
  `;
  db.query(q, [id_user, poste], (err, rows) => err ? reject(err) : resolve(rows));
});

// Toutes les données d'un admin
export const getAllDonneesByUser = (id_user) => new Promise((resolve, reject) => {
  const q = `
    SELECT *
    FROM DonneesESP32
    WHERE id_user = ?
    ORDER BY timestamp DESC
    LIMIT 1000
  `;
  db.query(q, [id_user], (err, rows) => err ? reject(err) : resolve(rows));
});

// Sessions actives pour un admin
export const getSessionsActivesByUser = (id_user) => new Promise((resolve, reject) => {
  const q = `
    SELECT *
    FROM DonneesESP32
    WHERE id_user = ? AND etat_du_poste = 1
    ORDER BY timestamp DESC
    LIMIT 500
  `;
  db.query(q, [id_user], (err, rows) => err ? reject(err) : resolve(rows));
});

// Récupérer une donnée par id
export const getDonneeById = (id_donnee) => new Promise((resolve, reject) => {
  const q = `SELECT * FROM DonneesESP32 WHERE id_donnee = ?`;
  db.query(q, [id_donnee], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
});

// Mises à jour ponctuelles (poste)
export const updateDureeActifPoste = (id_donnee, duree_actif_poste) => new Promise((resolve, reject) => {
  const q = `UPDATE DonneesESP32 SET duree_actif_poste = ? WHERE id_donnee = ?`;
  db.query(q, [duree_actif_poste, id_donnee], (err, result) => err ? reject(err) : resolve(result.affectedRows > 0));
});

export const updateEtatPC = (id_donnee, etat_pc) => new Promise((resolve, reject) => {
  const q = `UPDATE DonneesESP32 SET etat_pc = ? WHERE id_donnee = ?`;
  db.query(q, [etat_pc, id_donnee], (err, result) => err ? reject(err) : resolve(result.affectedRows > 0));
});

export const updatePuissance = (id_donnee, puissance_consommee) => new Promise((resolve, reject) => {
  const q = `UPDATE DonneesESP32 SET puissance_consommee = ? WHERE id_donnee = ?`;
  db.query(q, [puissance_consommee, id_donnee], (err, result) => err ? reject(err) : resolve(result.affectedRows > 0));
});

export const updateEtatPoste = (id_donnee, etat_du_poste, etat_pc) => new Promise((resolve, reject) => {
  const q = `UPDATE DonneesESP32 SET etat_du_poste = ?, etat_pc = ? WHERE id_donnee = ?`;
  db.query(q, [etat_du_poste, etat_pc, id_donnee], (err, result) => err ? reject(err) : resolve(result.affectedRows > 0));
});

// Nouvelle: durée d’activité du PC
export const updateDureeActifPC = (id_donnee, duree_actif_pc) => new Promise((resolve, reject) => {
  const q = `UPDATE DonneesESP32 SET duree_actif_pc = ? WHERE id_donnee = ?`;
  db.query(q, [duree_actif_pc, id_donnee], (err, result) => err ? reject(err) : resolve(result.affectedRows > 0));
});
