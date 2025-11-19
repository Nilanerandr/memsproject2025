import axios from "axios";

// Détection automatique de l'URL selon l'environnement
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  } else {
    return `http://${window.location.hostname}:8080/api`;
  }
};

// Base URL pour ton API
const axiosInstance = axios.create({
  baseURL: getApiUrl(), // ⬅️ Utiliser la détection automatique
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour créer le lien device
export const createDeviceLink = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post('/devices/link', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur createDeviceLink :', error.response?.data || error.message);
    throw error;
  }
};
