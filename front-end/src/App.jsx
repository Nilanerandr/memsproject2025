import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { 
  FaHome, 
  FaChartBar, 
  FaBell, 
  FaBars, 
  FaUserCircle, 
  FaSignOutAlt 
} from "react-icons/fa";

import Hyperspeed from "./BACKGROUND/Hyperspeed";
import "./navbar.css";

import Home from "./Pages/HOME/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import HistoriqueNotification from "./Pages/Notification/Notification";
function App() {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <Router>
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" ,background: "radial-gradient(circle at center, #0c1e42ff, #000000)"
}}>
        {/* <Hyperspeed /> */}

        <div
          style={{
            position: "absolute",
          
            width: "100%",
            display: "flex",
            justifyContent: "center",
            
          }}
        >
          <div className="header"><div className="imgdiv"><img src="/images/img1.jpg" alt="" className="img1"/></div><h2 className="title" >CyberManager</h2></div>
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
              <FaBell className="nav-icon" />
              <span>Notification</span>
            </Link>

            <div className="nav-item menu" onClick={toggleMenu}>
              <FaBars className="nav-icon" />
              <span>Menu</span>
              {openMenu && (
                <div className="submenu">
                 

                  <div className="submenu-item">
                    <FaSignOutAlt className="submenu-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* 🔹 Les routes (pages affichées selon l’URL) */}
        <div style={{ position: "relative", zIndex: 5 }}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/notifications" element={<HistoriqueNotification/>} />
          
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
