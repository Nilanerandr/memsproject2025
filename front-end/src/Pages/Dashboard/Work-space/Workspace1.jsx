import React, { useEffect, useState } from "react";
import ComputerGrid from "./Workspace";
import { io } from "socket.io-client"; // ⚡ import Socket.IO client
import "./Workspace.css";

export default function Utilisateurs() {
  // Initialiser avec une machine "fantôme" pour afficher le message
  const [machines, setMachines] = useState([
    {
      id: "none",
      active: false,
      usedMinutes: 0,
      watts: 0,
      message: "ESP32 non connectée"
    }
  ]);

  useEffect(() => {
    // Connexion au serveur Socket.IO
    const socket = io("http://localhost:8080"); // 🔹 URL du backend

    // Écouter l'événement 'esp32Data' envoyé par le serveur
    socket.on("esp32Data", (data) => {
      console.log("📡 Données reçues :", data);

      // Transformer les données pour ComputerGrid
      const newMachine = {
        id: data.poste, // id = poste
        active: data.etat_pc === 1, // active = etat du PC
        usedMinutes: data.duree_actif_poste ?? 0, // usedMinutes = duree_actif_poste
        watts: data.puissance_consommee ?? 0, // watts = puissance_consommee
      };

      setMachines((prev) => {
        // Supprimer le message initial si c’est le premier vrai message
        const filteredPrev = prev.filter((m) => m.id !== "none");

        // Remplacer ou ajouter la machine
        const index = filteredPrev.findIndex((m) => m.id === newMachine.id);
        if (index !== -1) {
          const updated = [...filteredPrev];
          updated[index] = newMachine;
          return updated;
        } else {
          return [...filteredPrev, newMachine];
        }
      });
    });

    // Déconnexion propre
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="content-wrapper">
      {machines.length === 1 && machines[0].id === "none" ? (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
          {machines[0].message}
        </p>
      ) : (
        <ComputerGrid machines={machines} />
      )}
    </div>
  );
}
