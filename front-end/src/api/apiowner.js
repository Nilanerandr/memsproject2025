import axios from "axios";

// Base URL pour ton API
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // juste /api
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
