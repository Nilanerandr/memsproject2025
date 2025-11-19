import axios from "axios";

// Détection automatique de l'URL selon l'environnement
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  } else {
    return `http://${window.location.hostname}:8080/api`;
  }
};

const API_BASE_URL = getApiUrl(); // ⬅️ Utiliser la détection automatique

// Ajouter un header par défaut si tu utilises JWT
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`  --> tu peux ajouter dynamiquement
  },
});

export const updatePrix = async (id_user, newPrix) => {
  try {
    const response = await axiosInstance.put(
      `/prixparminute/${id_user}`,
      { value: newPrix }  // <-- le nom que le backend attend
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prix par minute :', error);
    throw error;
  }
};
