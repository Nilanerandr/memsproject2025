// models/DeviceOwner.js
import db from '../config/db.js';

// Lier (ou relier) un device à un admin
export const setOwner = (nom_esp32, id_user) => new Promise((resolve, reject) => {
  const q = `
    INSERT INTO DeviceOwner (nom_esp32, id_user)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE id_user = VALUES(id_user), updated_at = CURRENT_TIMESTAMP
  `;
  db.query(q, [nom_esp32, id_user], (err) => err ? reject(err) : resolve({ nom_esp32, id_user }));
});

// Récupérer l'admin propriétaire d'un device
export const getOwnerByDevice = (nom_esp32) => new Promise((resolve, reject) => {
  const q = `SELECT nom_esp32, id_user, updated_at FROM DeviceOwner WHERE nom_esp32 = ?`;
  db.query(q, [nom_esp32], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
});

// Optionnel: lister les devices d'un admin
export const listDevicesByUser = (id_user) => new Promise((resolve, reject) => {
  const q = `SELECT nom_esp32, id_user, updated_at FROM DeviceOwner WHERE id_user = ? ORDER BY updated_at DESC`;
  db.query(q, [id_user], (err, rows) => err ? reject(err) : resolve(rows));
});
