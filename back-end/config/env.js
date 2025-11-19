import dotenv from 'dotenv';

dotenv.config();

// Serveur
export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const HOST = process.env.HOST || '0.0.0.0';
// Base de données
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || 'basededonnee';

// MQTT
export const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
export const MQTT_TOPIC = process.env.MQTT_TOPIC || 'esp32/data';

// Authentification
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// Upload
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
export const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5242880; // 5MB
// Frontend
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
