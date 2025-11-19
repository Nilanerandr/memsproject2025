import axios from 'axios';

// Détection automatique de l'URL selon l'environnement
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  } else {
    return `http://${window.location.hostname}:8080/api`;
  }
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(), // ⬅️ Utiliser la détection automatique
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getconsommationsByUser = async (id_user) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`/consommations/user/${id_user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des consommations:', error);
    throw error;
  }
};
