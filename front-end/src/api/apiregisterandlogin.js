// api.js
import axios from 'axios';

// Base URL de ton API
const API_BASE_URL = 'http://localhost:8000/api/users'; // change selon ton backend

// Ajouter un header par défaut si tu utilises JWT
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`  --> tu peux ajouter dynamiquement
  },
});

export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // obligatoire pour envoyer un fichier
      },
    });
    return response.data; // retourne la réponse du backend
  } catch (error) {
    console.error('Erreur registerUser :', error.response?.data || error.message);
    throw error;
  }
};



export const LoginUser = async (data) => {
    try{
        const response = await axiosInstance.post('/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // retourne la réponse du backend
    }catch (error) {
        console.error('Erreur loginUser :', error.response?.data || error.message);
        throw error;
    }
};

