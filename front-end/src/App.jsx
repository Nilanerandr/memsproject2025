import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaBell,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { getpaymentbyid } from "./api/apipayment";
import "./navbar.css";
import ProtectedRoute from "./Protectedroutes";
import Home from "./Pages/HOME/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import HistoriqueNotification from "./Pages/Notification/Notification";
import Hyperspeed from "./BACKGROUND/Hyperspeed";

function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  // 🔹 Fonction pour récupérer les paiements non validés
  const fetchUnvalidatedPayments = async () => {
    try {
      const id_user = localStorage.getItem("id_user");
      if (!id_user) {
        console.warn("⚠️ Aucun id_user trouvé dans le localStorage");
        setNotifCount(0);
        return;
      }

      const data = await getpaymentbyid(id_user);
      console.log("✅ Paiements récupérés:", data);

      if (data && Array.isArray(data.paiements)) {
        const nonValides = data.paiements.filter(
          (p) => Number(p.validation_du_payement) === 0
        );
        setNotifCount(nonValides.length);
      } else {
        setNotifCount(0);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des paiements:", error);
      setNotifCount(0);
    }
  };

  // 🔹 Rafraîchissement toutes les 5 secondes
  useEffect(() => {
    fetchUnvalidatedPayments();
    const interval = setInterval(fetchUnvalidatedPayments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_user");
    setOpenMenu(false);
    window.location.href = "/";
  };

  const toggleMenu = () => setOpenMenu((prev) => !prev);

  return (
    <Router>
      <div
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          background: "radial-gradient(circle at center, #0c1e42ff, #000000)",
        }}
      >
        {/* <Hyperspeed /> */}

        <div
          style={{
            position: "absolute",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="header">
            <div className="imgdiv">
              <img src="/images/img1.jpg" alt="" className="img1" />
            </div>
            <h2 className="title">CyberManager</h2>
          </div>

          <nav className="navbar">
            <Link to="/" className="nav-item">
              <FaHome className="nav-icon" />
              <span>Accueil</span>
            </Link>

            <Link to="/dashboard" className="nav-item">
              <FaChartBar className="nav-icon" />
              <span>Dashboard</span>
            </Link>

            <Link to="/notifications" className="nav-item">
              {/* 🔹 Affiche la pastille seulement s’il y a des paiements non validés */}
              {notifCount > 0 && (
                <div className="notif">{notifCount}</div>
              )}
              <FaBell className="nav-icon" />
              <span>Notification</span>
            </Link>

            <div className="nav-item menu" onClick={toggleMenu}>
              <FaBars className="nav-icon" />
              <span>Menu</span>
              {openMenu && (
                <div className="submenu">
                  <div className="submenu-item" onClick={handleLogout}>
                    <FaSignOutAlt className="submenu-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* 🔹 Routes */}
        <div style={{ position: "relative", zIndex: 5 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <HistoriqueNotification />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
