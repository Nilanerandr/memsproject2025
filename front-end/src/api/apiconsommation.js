import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
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
