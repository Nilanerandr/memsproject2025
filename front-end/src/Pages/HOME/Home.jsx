import img1 from '../../../public/images/img1.jpg'
import CardNav from "../../BACKGROUND/navbar2/Nav";
import HeroText from '../../BACKGROUND/textrotate/texte';
import { createPortal } from "react-dom";
import { useState, useEffect } from 'react';
import './Home.css'
import './Style.css'
import LoginModal from '../modal/Login';
import RegisterModal from '../modal/Register';
import SuccessToast from '../modal/succes';
import '../modal/succes.css';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 état d'authentification

  // État du toast global
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Vérifie la présence du token dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
    <div style={{ position: "absolute", zIndex: 10, width: "100%", display: "flex", justifyContent: "center", top: "14vw" }}>
      <CardNav
        items={items}
        baseColor="#ffffff49"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
       className='crn'/>

      <div className="home-container">
        <div className="welcome-banner">
          <h1 className="welcome-title">Bienvenue sur CyberManager</h1>
          <p className="welcome-subtitle">
            Gérez votre cybercafé intelligemment avec notre système de monitoring en temps réel
          </p>

          {/* 👇 Les boutons ne s’affichent que si l’utilisateur n’est pas connecté */}
          {!isAuthenticated && (
            <div className="button-group">
              <button className="get-started-btn" onClick={() => setLoginOpen(true)}>
                Login
              </button>

              <button className="get-register-btn" onClick={() => setRegisterOpen(true)}>
                Inscription
              </button>
            </div>
          )}

          {/* Modales */}
          <LoginModal
            open={loginOpen}
            onClose={() => setLoginOpen(false)}
            onSuccess={(msg = "Connexion réussie") => {
              setToastMsg(msg);
              setShowToast(true);
              setIsAuthenticated(true); // 👈 maj de l’état après connexion
              setTimeout(() => setShowToast(false), 3000);
            }}
          />

          <RegisterModal
            open={registerOpen}
            onClose={() => setRegisterOpen(false)}
            onSuccess={(msg = "Inscription réussie") => {
              setToastMsg(msg);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          />

          {/* Toast global via Portal */}
          {createPortal(
            <SuccessToast
              show={showToast}
              onClose={() => setShowToast(false)}
              message={toastMsg || "Connexion réussie"}
              duration={3000}
            />,
            document.body
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
