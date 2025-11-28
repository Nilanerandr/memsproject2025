import React, { useEffect, useState } from "react";
import {
  RiFlashlightFill,
  RiBarChart2Fill,
  RiShieldKeyholeLine,
} from "react-icons/ri";
import { getUserProfile } from "../../api/apiregisterandlogin";

// Sidebar avec affichage dynamique de l'utilisateur connecté
export default function Sidebar({
  open = false,
  collapsed = false,
  onClose = () => {},
  onToggleCollapse = () => {},
  active = "dash",
  onSelect = () => {},
  user: initialUser = { name: "Jane Doe", avatar: "https://i.pravatar.cc/100?img=1" },
}) {
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const id_user = localStorage.getItem("id_user");
        const token = localStorage.getItem("token");

        if (!id_user) return;

        const res = await getUserProfile(id_user, token);

        console.log(res); // Affiche la réponse du backend

        if (mounted && res && res.user) {
          // Générer l'URL complète vers le backend Node.js
          const avatarUrl = res.user.img
            ? `http://localhost:8080${res.user.img}` // <-- utilise le port du backend
            : initialUser.avatar;

          setUser({
            name: res.user.name ?? initialUser.name,
            avatar: avatarUrl,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []); // exécuté une seule fois au montage

  const links = [
    { key: "energie", label: "Énergie", icon: <RiFlashlightFill className="cm-ic" /> },
    { key: "revenus", label: "Revenus", icon: <RiBarChart2Fill className="cm-ic" /> },
    { key: "Work-Space", label: "Surveillance", icon: <RiShieldKeyholeLine className="cm-ic" /> },
  ];

  return (
    <>
      {open && <div className="cm-overlay" onClick={onClose} />}

      <aside className={`cm-sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
        <button
          className="cm-side-toggle"
          onClick={onToggleCollapse}
          title={collapsed ? "Ouvrir" : "Réduire"}
        >
          {collapsed ? <span>&rsaquo;</span> : <span>&lsaquo;</span>}
        </button>

        <div className="cm-brand">
          <div className="cm-logo" />
          <span className="cm-title">CyberManager</span>
        </div>

        <nav className="cm-nav">
          <span className="cm-sec">menu</span>
          {links.map((l) => (
            <a
              key={l.key}
              href="#"
              className={`cm-link ${active === l.key ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(l.key);
              }}
            >
              {l.icon}
              <span className="cm-lb">{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="cm-userbox">
          <img src={user.avatar} alt={user.name} className="cm-avatar" />
          <div className="cm-usertext">
            <div className="cm-username">{user.name}</div>
            <div className="cm-userrole">Administrateur</div>
          </div>
        </div>
      </aside>
    </>
  );
}
