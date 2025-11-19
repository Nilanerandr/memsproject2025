import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, HOST, CORS_ORIGIN } from './config/env.js'; // ⬅️ Ajout de HOST

// Import des routes
import usersRoutes from './routes/UsersRoutes.js';
import payementRoutes from './routes/Payementroutes.js';
import esp32Routes from './routes/ESP32routes.js';
import prixRoutes from './routes/PrixparminuteRoutes.js';
import deviceOwnerRoutes from './routes/Owneroutes.js';
import consommationroutes from './routes/consopcroute.js'
// Import MQTT (démarre la connexion)
import './config/mqtt.js';

// Configurer __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer l'application Express
const app = express();

// Créer le serveur HTTP
const httpServer = createServer(app);

// ⬅️ Convertir CORS_ORIGIN en tableau pour gérer plusieurs origines
const corsOrigins = CORS_ORIGIN.split(',').map(origin => origin.trim());

// Créer Socket.IO avec les origines multiples
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins, // ⬅️ Utiliser le tableau d'origines
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Export io pour utilisation dans les controllers
export { io };

// ========== MIDDLEWARES ==========

// CORS avec origines multiples
app.use(cors({
  origin: corsOrigins, // ⬅️ Utiliser le tableau d'origines
  credentials: true
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== ROUTES ==========

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Cyber Café', 
    status: 'running',
    timestamp: new Date()
  });
});

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api', payementRoutes);
app.use('/api', esp32Routes);
app.use('/api', prixRoutes);
app.use('/api', deviceOwnerRoutes);
app.use('/api', consommationroutes);

// ========== SOCKET.IO ==========

io.on('connection', (socket) => {
  console.log('✅ Client connecté:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté:', socket.id);
  });

  // Événement personnalisé (optionnel)
  socket.on('requestData', async () => {
    // Envoyer les dernières données si demandé
    console.log('📡 Client demande les données');
  });
});

// ========== GESTION DES ERREURS ==========

// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: err.message
  });
});

// ========== DÉMARRAGE DU SERVEUR ==========

httpServer.listen(PORT, HOST, () => { // ⬅️ Ajout de HOST comme paramètre
  console.log('=================================');
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔌 Écoute sur: ${HOST}`); // ⬅️ Ajout
  console.log(`📡 URL locale: http://localhost:${PORT}`);
  console.log(`🌐 URL réseau: http://192.168.8.102:${PORT}`); // ⬅️ Ajout
  console.log(`🌐 Socket.IO prêt`);
  console.log(`📊 MQTT connecté`);
  console.log('=================================');
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  httpServer.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});
