import mqtt from 'mqtt';
import { MQTT_BROKER, MQTT_TOPIC } from './env.js';

// Exemple d'env.js
// export const MQTT_BROKER = "mqtt://localhost:1883";
// export const MQTT_TOPIC = "esp32/data";

const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('✅ Connecté au broker MQTT');

  setInterval(() => {
    const message = {
      nom_esp32: "esp32-1",
      poste: "PC-01",
      puissance_consommee: Math.floor(Math.random() * 120),
      etat_du_poste: 1,
      etat_pc: 1,
      duree_actif_poste: Math.floor(Math.random() * 300),
      duree_actif_pc: Math.floor(Math.random() * 300)
    };
    client.publish(MQTT_TOPIC, JSON.stringify(message));
    console.log('📡 Message MQTT envoyé:', message);
  }, 5000); // toutes les 5 secondes
});
