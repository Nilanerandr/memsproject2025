import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api'; // change selon ton backend

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
    const response = await axiosInstance.put(`/prixparminute/${id_user}`, {});
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prix par minute :', error);
    throw error;
  }}








