// import axios from "axios";

// // Détection automatique de l'URL selon l'environnement
// const getApiUrl = () => {
//   if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//     return 'http://localhost:8080/api';
//   } else {
//     return `http://${window.location.hostname}:8080/api`;
//   }
// };

// const API_BASE_URL = getApiUrl(); // ⬅️ Utiliser la détection automatique

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const updateHeureRelais = async (nom_esp32, heureOn, heureOff) => {
//   try {
//     // Convertir "HH:MM" → nombre
//     const [hOn, mOn] = heureOn.split(":").map(Number);
//     const [hOff, mOff] = heureOff.split(":").map(Number);

//     const response = await axiosInstance.put(
//       `/relais/heure`,
//       {
//         nom_esp32: "esp32-1", 
//         heureOn: hOn,
//         minuteOn: mOn,
//         heureOff: hOff,
//         minuteOff: mOff,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour des heures du relais :", error);
//     throw error;
//   }
// };
import axios from "axios";

// Détection automatique de l'URL selon l'environnement
const getApiUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8080/api";
  } else {
    return `http://${window.location.hostname}:8080/api`;
  }
};

const API_BASE_URL = getApiUrl();

// Instance Axios avec baseURL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Met à jour les horaires d'activation/extinction du relais pour esp32-1
 * @param {string} heureOn - Heure d'activation "HH:MM"
 * @param {string} heureOff - Heure d'extinction "HH:MM"
 * @returns {Promise<Object>} - Réponse du backend
 */
export const updateHeureRelais = async (heureOn, heureOff) => {
  try {
    // Convertir "HH:MM" en heures et minutes numériques
    const [hOn, mOn] = heureOn.split(":").map(Number);
    const [hOff, mOff] = heureOff.split(":").map(Number);

    // Requête PUT vers le backend
    const response = await axiosInstance.put("/relais/heure", {
      nom_esp32: "esp32-1", // forcé ici
      heureOn: hOn,
      minuteOn: mOn,
      heureOff: hOff,
      minuteOff: mOff,
    });

    console.log("✅ Horaires envoyés avec succès :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des heures du relais :", error);
    throw error;
  }
};
