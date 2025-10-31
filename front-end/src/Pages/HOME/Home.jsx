import img1 from '../../../public/images/img1.jpg'
import CardNav from "../../BACKGROUND/navbar2/Nav";
import HeroText from '../../BACKGROUND/textrotate/texte';
import { useState, useEffect } from 'react';
import './Home.css'
import './Style.css'
import LoginModal from '../modal/Login';
import RegisterModal from '../modal/Register';

const Home = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

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
    <div style={{ position: "absolute", zIndex: 10, width: "100%", display: "flex", justifyContent: "center", top: "10vw" }}>
      <CardNav
        items={items}
        baseColor="#ffffff49"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />

      <div className="home-container">
        <div className="welcome-banner">
          <h1 className="welcome-title">Bienvenue sur CyberManager</h1>
          <p className="welcome-subtitle">
            Gérez votre cybercafé intelligemment avec notre système de monitoring en temps réel
          </p>

          <div className="button-group">
            <button className="get-started-btn" onClick={() => setLoginOpen(true)}>
              Login
            </button>

            <button className="get-register-btn" onClick={() => setRegisterOpen(true)}>
              Inscription
            </button>
          </div>

          {/* Modales */}
          <LoginModal 
            open={loginOpen} 
            onClose={() => setLoginOpen(false)} 
            onSubmit={(data) => console.log("login", data)} 
          />

          <RegisterModal 
            open={registerOpen} 
            onClose={() => setRegisterOpen(false)} 
            onSubmit={(data) => console.log("register", data)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
