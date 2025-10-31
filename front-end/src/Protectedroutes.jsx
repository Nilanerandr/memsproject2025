import React from "react";
import { Navigate } from "react-router-dom";

// Vérifie si l'utilisateur est connecté
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // ou ton système d'auth
  if (!token) {
    // si pas connecté, redirige vers Home
    return <Navigate to="/" replace />;
  }
  // si connecté, affiche le composant enfant
  return children;
};

export default ProtectedRoute;
