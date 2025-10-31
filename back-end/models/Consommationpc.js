// models/ConsommationPC.js
import db from '../config/db.js';

// Créer une ligne de consommation (à appeler au passage etat_du_poste: 1 -> 0)
export const createConsommation = (id_user, id_donnee, poste, nom_esp32, duree_actif_pc, puissance_moyenne_w, consommation_Wh) =>
  new Promise((resolve, reject) => {
    const q = `
      INSERT INTO ConsommationPC
      (id_user, id_donnee, poste, nom_esp32, duree_actif_pc, puissance_moyenne_w, consommation_Wh)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(q, [id_user, id_donnee, poste, nom_esp32, duree_actif_pc, puissance_moyenne_w, consommation_Wh], (err, result) => {
      if (err) return reject(err);
      resolve({
        id: result.insertId,
        id_user,
        id_donnee,
        poste,
        nom_esp32,
        duree_actif_pc,
        puissance_moyenne_w,
        consommation_Wh
      });
    });
  });

// Lister les consommations d’un admin avec filtres optionnels (start/end au format 'YYYY-MM-DD' ou Date)
export const listByUser = (id_user, { start = null, end = null, limit = 100, offset = 0 } = {}) =>
  new Promise((resolve, reject) => {
    const where = ['id_user = ?'];
    const params = [id_user];

    if (start) { where.push('datedecreation >= ?'); params.push(start); }
    if (end)   { where.push('datedecreation <= ?'); params.push(end); }

    const q = `
      SELECT id, id_user, id_donnee, poste, nom_esp32, duree_actif_pc, puissance_moyenne_w, consommation_Wh, datedecreation
      FROM ConsommationPC
      WHERE ${where.join(' AND ')}
      ORDER BY datedecreation DESC
      LIMIT ? OFFSET ?
    `;
    params.push(Number(limit), Number(offset));

    db.query(q, params, (err, rows) => err ? reject(err) : resolve(rows));
  });

// Totaux (Wh et secondes) par admin, sur période optionnelle
export const getTotalsByUser = (id_user, { start = null, end = null } = {}) =>
  new Promise((resolve, reject) => {
    const where = ['id_user = ?'];
    const params = [id_user];

    if (start) { where.push('datedecreation >= ?'); params.push(start); }
    if (end)   { where.push('datedecreation <= ?'); params.push(end); }

    const q = `
      SELECT
        COALESCE(SUM(consommation_Wh), 0) AS total_Wh,
        COALESCE(SUM(duree_actif_pc), 0) AS total_sec,
        COUNT(*) AS sessions
      FROM ConsommationPC
      WHERE ${where.join(' AND ')}
    `;
    db.query(q, params, (err, rows) => err ? reject(err) : resolve(rows[0]));
  });
