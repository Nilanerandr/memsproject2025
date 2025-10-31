// Utilisateurs.jsx
import React from "react";
import ComputerGrid from "./Workspace";
import "./Workspace.css";

const mockMachines = [
  { id: "PC-01", active: true, usedMinutes: 73, watts: 92 },
  { id: "PC-02", active: false, usedMinutes: 0, watts: 0 },
  { id: "PC-03", active: true, usedMinutes: 18, watts: 70 },
  { id: "PC-04", active: true, usedMinutes: 201, watts: 110 },
];

async function fetchPowerRealtime(id) {
  // Exemple: remplacer par un appel fetch vers l’API du cyber
  // return (await fetch(`/api/power/${id}`)).json();
  // Démo: valeur pseudo-aléatoire 60–120 W si actif
  return 60 + Math.round(Math.random() * 60);
}

export default function Utilisateurs() {
  return (
    <div className="content-wrapper">
      <ComputerGrid machines={mockMachines} onRefreshPower={fetchPowerRealtime} />
    </div>
  );
}
