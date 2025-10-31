import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const auth = (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const token = req.headers.authorization?.split(' ')[1];
    
    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({ error: "Token manquant. Authentification requise." });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter les infos de l'utilisateur à la requête
    req.user = decoded;
    
    // Passer au middleware/contrôleur suivant
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expiré. Reconnectez-vous." });
    }
    return res.status(401).json({ error: "Token invalide." });
  }
};

export default auth;
