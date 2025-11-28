// api.js
import axios from 'axios';

// Détection automatique de l'URL selon l'environnement
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080/api/users';
  } else {
    return `http://${window.location.hostname}:8080/api/users`;
  }
};

// Base URL de ton API (détection automatique)
const API_BASE_URL = getApiUrl();

// Ajouter un header par défaut si tu utilises JWT
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`  --> tu peux ajouter dynamiquement
  },
});

// export const registerUser = async (formData) => {
//   try {
//     const response = await axiosInstance.post('/register', formData); // laisse Axios gérer le Content-Type
//     return response.data; 
//   } catch (error) {
//     console.error('Erreur registerUser :', error.response?.data || error.message);
//     throw error;
//   }
// };
export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // obligatoire pour l'image
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur registerUser :', error.response?.data || error.message);
    throw error;
  }
};


export const LoginUser = async (data) => {
  try {
    const response = await axiosInstance.post('/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // retourne la réponse du backend
  } catch (error) {
    console.error('Erreur loginUser :', error.response?.data || error.message);
    throw error;
  }
};
export const getUserProfile = async (id_user, token) => {
  try {
    const response = await axiosInstance.get(`/users/${id_user}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur getUserProfile :', error.response?.data || error.message);
    throw error;
  }
};
