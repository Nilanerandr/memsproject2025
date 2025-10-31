import mysql from 'mysql2';
import { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } from './env.js';

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL :", err.message);
  } else {
    console.log("✅ Connecté à la base MySQL !");
  }
});

export default db;
