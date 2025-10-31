import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { FaCalendarAlt, FaClock, FaHourglassHalf, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import "./Notification.css";

export default function HistoriqueNotification() {
  const [rows, setRows] = useState([
    { id: 1, dateDepart: "2025-10-13", heureDepart: "14:20", tempsPasse: "1h 30min", prix: "2.50 €", valide: false },
    { id: 2, dateDepart: "2025-10-13", heureDepart: "14:20", tempsPasse: "1h 30min", prix: "2.50 €", valide: false },
    { id: 3, dateDepart: "2025-10-13", heureDepart: "16:45", tempsPasse: "2h 10min", prix: "3.80 €", valide: true },
    { id: 4, dateDepart: "2025-10-13", heureDepart: "16:45", tempsPasse: "2h 10min", prix: "3.80 €", valide: true },
    { id: 5, dateDepart: "2025-10-13", heureDepart: "16:45", tempsPasse: "2h 10min", prix: "3.80 €", valide: true },
    { id: 6, dateDepart: "2025-10-13", heureDepart: "16:45", tempsPasse: "2h 10min", prix: "3.80 €", valide: true },
    { id: 6, dateDepart: "2025-10-13", heureDepart: "16:45", tempsPasse: "2h 10min", prix: "3.80 €", valide: true },
    
  ]);

  const handleValidation = (id) => {
    setRows(prev =>
      prev.map(item => item.id === id ? { ...item, valide: true } : item)
    );
  };

  const columns = [
    {
      field: "dateDepart",
      headerName: "Date de départ",
      flex: 1,
      renderHeader: () => <div className="header-icon"><FaCalendarAlt /> Date de départ</div>
    },
    {
      field: "heureDepart",
      headerName: "Heure de départ",
      flex: 1,
      renderHeader: () => <div className="header-icon"><FaClock /> Heure de départ</div>
    },
    {
      field: "tempsPasse",
      headerName: "Temps passé",
      flex: 1,
      renderHeader: () => <div className="header-icon"><FaHourglassHalf /> Temps passé</div>
    },
    {
      field: "prix",
      headerName: "Prix",
      flex: 1,
      renderHeader: () => <div className="header-icon"><FaMoneyBillWave /> Prix</div>,
      renderCell: (params) => <span className="prix-cell">{params.value}</span>,
    },
    {
      field: "valide",
      headerName: "Validation",
      flex: 1.2,
      renderHeader: () => <div className="header-icon"><FaCheckCircle /> Validation</div>,
      renderCell: (params) => (
        <button
          className={`btn-valide ${params.row.valide ? "valide" : ""}`}
          onClick={() => handleValidation(params.row.id)}
          disabled={params.row.valide}
        >
          {params.row.valide ? "Validé" : "Valider"}
        </button>
      ),
    },
  ];

  return (
    <div className="historique-wrapper">
      <h1 className="titre-page">Historique des Notifications</h1>
      <p className="sous-titre">Consultez les sessions et validez les paiements effectués.</p>

      <div className="data-grid-container">
        <DataGrid
   rows={rows}
  columns={columns}
  pagination
  pageSize={5}
  rowsPerPageOptions={[5]}
  disableSelectionOnClick
  autoHeight={false} 
          sx={{
            height: 400,
            backgroundColor: "#0f0f0f",
            border: "none",
            color: "#f5f5f5",
            "& .MuiDataGrid-cell": { borderColor: "#2a2a2a" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1a1a1a !important", // ⚠️ important pour forcer fond noir
              color: "#0c0b0bff",
              borderBottom: "1px solid #2b2b2b",
              fontWeight: "600",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "#1e1e1e" },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "#1e1e1e !important",
              color: "#fff !important",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#1a1a1a",
              borderTop: "1px solid #2b2b2b",
              color: "#cfcfcf",
            },
            "& .MuiTablePagination-root": { color: "#cfcfcf" },
          }}
        />
      </div>
    </div>
  );
}
