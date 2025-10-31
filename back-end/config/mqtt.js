import mqtt from 'mqtt';
import { MQTT_BROKER, MQTT_TOPIC } from './env.js';
import { handleMqttMessage } from '../controllers/Esp32controllers.js';

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT');
  
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('❌ Erreur d\'abonnement au topic:', err);
    } else {
      console.log(`📡 Abonné au topic: ${MQTT_TOPIC}`);
    }
  });
});

// Quand un message MQTT arrive
mqttClient.on('message', async (topic, message) => {
  console.log(`📩 Message reçu sur topic ${topic}`);
  
  // Traiter et sauvegarder dans MySQL
  // ✅ handleMqttMessage s'occupe déjà d'émettre vers Socket.IO
  await handleMqttMessage(topic, message);
  
  console.log('✅ Message traité');
});

mqttClient.on('error', (err) => {
  console.error('❌ Erreur MQTT:', err);
});

export default mqttClient;
