import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, CORS_ORIGIN } from './config/env.js';

// Import des routes
import usersRoutes from './routes/UsersRoutes.js';
import payementRoutes from './routes/Payementroutes.js';
import esp32Routes from './routes/ESP32routes.js';
import prixRoutes from './routes/PrixparminuteRoutes.js';
import deviceOwnerRoutes from './routes/Owneroutes.js';
// Import MQTT (démarre la connexion)
import './config/mqtt.js';

// Configurer __dirname pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer l'application Express
const app = express();

// Créer le serveur HTTP
const httpServer = createServer(app);

// Créer Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Export io pour utilisation dans les controllers
export { io };

// ========== MIDDLEWARES ==========

// CORS
app.use(cors({
  origin: CORS_ORIGIN,
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

httpServer.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 URL API: http://localhost:${PORT}`);
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

