// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FaHome, FaChartBar, FaBell, FaBars, FaSignOutAlt } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";

import { getpaymentbyid } from "./api/apipayment";
import "./navbar.css";
import ProtectedRoute from "./Protectedroutes.jsx";
import Home from "./Pages/HOME/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import HistoriqueNotification from "./Pages/Notification/Notification";
import Hyperspeed from "./BACKGROUND/Hyperspeed";
import { useAuth } from "./AuthContext.jsx";

export default function App() {
  const [notifCount, setNotifCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // 🔹 Récupération paiements non validés
  const fetchUnvalidatedPayments = async () => {
    try {
      const id_user = localStorage.getItem("id_user");
      if (!id_user) {
        setNotifCount(0);
        return;
      }
      const data = await getpaymentbyid(id_user);
      if (data && Array.isArray(data.paiements)) {
        const nonValides = data.paiements.filter(p => Number(p.validation_du_payement) === 0);
        setNotifCount(nonValides.length);
      } else {
        setNotifCount(0);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
      setNotifCount(0);
    }
  };

  useEffect(() => {
    fetchUnvalidatedPayments();
    const interval = setInterval(fetchUnvalidatedPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload() // navigation SPA
  };

  const checkAuthAndNavigate = (path) => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    navigate(path);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "radial-gradient(circle at center, #0c1e42ff, #000000)",
      }}
    >
      {/* <Hyperspeed /> */}

      <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "center" }}>
        <div className="header">
          <div className="imgdiv">
            <img src="/images/img1.jpg" alt="" className="img1" />
          </div>
          <h2 className="title">CyberManager</h2>
        </div>

        <nav className="navbar">
          <Link to="/" className="nav-item">
            <FaHome className="nav-icon" />
            <span className="spnav">Accueil</span>
          </Link>

          <div className="nav-item" onClick={() => checkAuthAndNavigate("/dashboard")} style={{ cursor: "pointer" }}>
            <FaChartBar className="nav-icon" />
            <span className="spnav">Dashboard</span>
          </div>

          <div className="nav-item" onClick={() => checkAuthAndNavigate("/notifications")} style={{ cursor: "pointer", position: "relative" }}>
            {notifCount > 0 && <div className="notif">{notifCount}</div>}
            <FaBell className="nav-icon" />
            <span className="spnav">Historique</span>
          </div>

          {/* Menu ou Logout */}
          {!isAuthenticated ? (
            <div className="nav-item" style={{ cursor: "default" }}>
              <FaBars className="nav-icon" />
              <span className="spnav">Menu</span>
            </div>
          ) : (
            <div className="nav-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <FaSignOutAlt className="nav-icon" />
              <span className="spnav">Logout</span>
            </div>
          )}
        </nav>
      </div>

      {/* 🔹 Routes */}
      <div style={{ position: "relative", zIndex: 5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><HistoriqueNotification /></ProtectedRoute>} />
        </Routes>
      </div>

      {/* 🔹 Modal connexion requise */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RiErrorWarningLine size={40} color="#ff4d4f" />
            <h3>Connexion requise</h3>
            <button className="btn-close" onClick={() => setShowModal(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
