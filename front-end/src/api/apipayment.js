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

export const getpaymentbyid = async (id_user) => {
  try {
    const response = await axiosInstance.get(`/payements/user/${id_user}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements par ID utilisateur:', error);
    throw error;
  }
}

export const validerpayment = async (id_payement) => {
  try {
    const response = await axiosInstance.put(`/payements/${id_payement}/valider`, {});
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation du paiement:', error);
    throw error;
  }
}
