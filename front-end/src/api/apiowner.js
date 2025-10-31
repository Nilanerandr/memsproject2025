import axios from "axios";

// Base URL pour ton API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // juste /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour créer le lien device
export const createDeviceLink = async (data) => {
  try {
    // Ici on appelle la route POST /devices/link
    const response = await axiosInstance.post('/devices/link', data);
    return response.data;
  } catch (error) {
    console.error('Erreur createDeviceLink :', error.response?.data || error.message);
    throw error;
  }
};
