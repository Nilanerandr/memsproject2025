
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // juste /api
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