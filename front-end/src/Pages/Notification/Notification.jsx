import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  FaCalendarAlt,
  FaClock,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import "./Notification.css";
import { getpaymentbyid, validerpayment } from "../../api/apipayment.js";

export default function HistoriqueNotification() {
  const [rows, setRows] = useState([]);

  // Charger les paiements de l'utilisateur connecté
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const id_user = localStorage.getItem("id_user");
        if (!id_user) return console.error("Aucun id_user dans le localStorage");

        const data = await getpaymentbyid(id_user);
        console.log("✅ Paiements récupérés:", data);

        const paiements = Array.isArray(data.paiements) ? data.paiements : [];

        const formatted = paiements.map((p) => ({
          id: p.id_payement,
          dateDepart: new Date(p.date_creation).toLocaleDateString(),
          heureDepart: new Date(p.date_creation).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          tempsPasse: `${Math.floor(p.duree_utilisation / 60)} min`,
          prix: `${p.value} Ar`,
          valide: p.validation_du_payement === 1,
        }));

        setRows(formatted);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des paiements:", error);
      }
    };

    fetchPayments();
  }, []);

  // Fonction pour valider un paiement
  const handleValidation = async (id_payement) => {
    try {
      await validerpayment(id_payement);
      setRows((prev) =>
        prev.map((item) =>
          item.id === id_payement ? { ...item, valide: true } : item
        )
      );
    } catch (error) {
      console.error("❌ Erreur lors de la validation du paiement:", error);
    }
  };

  const columns = [
    {
      field: "dateDepart",
      headerName: "Date de départ",
      flex: 1,
      renderHeader: () => (
        <div className="header-icon">
          <FaCalendarAlt /> Date de départ
        </div>
      ),
    },
    {
      field: "heureDepart",
      headerName: "Heure de départ",
      flex: 1,
      renderHeader: () => (
        <div className="header-icon">
          <FaClock /> Heure de départ
        </div>
      ),
    },
    {
      field: "tempsPasse",
      headerName: "Temps passé",
      flex: 1,
      renderHeader: () => (
        <div className="header-icon">
          <FaHourglassHalf /> Temps passé
        </div>
      ),
    },
    {
      field: "prix",
      headerName: "Prix",
      flex: 1,
      renderHeader: () => (
        <div className="header-icon">
          <FaMoneyBillWave /> Prix
        </div>
      ),
      renderCell: (params) => (
        <span className="prix-cell">{params.value}</span>
      ),
    },
    {
      field: "valide",
      headerName: "Validation",
      flex: 1.2,
      renderHeader: () => (
        <div className="header-icon">
          <FaCheckCircle /> Validation
        </div>
      ),
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
      <h1 className="titre-page">Historique des Paiements</h1>
      <p className="sous-titre">
        Consultez vos sessions et validez les paiements effectués.
      </p>

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
              backgroundColor: "#1a1a1a !important",
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
