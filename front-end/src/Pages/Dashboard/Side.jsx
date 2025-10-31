import { RiLayout2Line, RiNotification3Line, RiTeamLine, RiShieldKeyholeLine, RiSettings3Line, RiMenu3Line, RiFlashlightFill,RiBarChart2Fill } from "react-icons/ri";

// Ajoute une prop onSelect pour notifier le parent
export default function Sidebar({
  open=false, collapsed=false, onClose=()=>{}, onToggleCollapse=()=>{},
  active="dash",
  onSelect = ()=>{},                 // <-- nouveau
  user={ name:"Jane Doe", avatar:"https://i.pravatar.cc/100?img=1" }
}){
  // ...
  const links = [
    { key:"energie", label:"Énergie",     icon:<RiFlashlightFill className="cm-ic" /> }, // <-- nouveau
    { key:"revenus",   label:"Revenus",icon:<RiBarChart2Fill className="cm-ic" /> },
    // { key:"",   label:"Utilisateurs", icon:<RiTeamLine className="cm-ic" /> },
    { key:"Work-Space",     label:"Surveillance",     icon:<RiShieldKeyholeLine className="cm-ic" /> },
    // { key:"sett",    label:"Paramètres",   icon:<RiSettings3Line className="cm-ic" /> },
  ];

  return (
    <>
      {open && <div className="cm-overlay" onClick={onClose} />}

      <aside className={`cm-sidebar ${open ? "open":""} ${collapsed ? "collapsed":""}`}>
        <button className="cm-side-toggle" onClick={onToggleCollapse} title={collapsed ? "Ouvrir" : "Réduire"}>
          {collapsed ? <span>&rsaquo;</span> : <span>&lsaquo;</span>}
        </button>

        <div className="cm-brand">
          <div className="cm-logo" />
          <span className="cm-title">CyberManager</span>
        </div>

        <nav className="cm-nav">
          <span className="cm-sec">menu</span>
          {links.map(l => (
            <a
              key={l.key}
              href="#"
              className={`cm-link ${active===l.key ? "active":""}`}
              onClick={(e)=>{ e.preventDefault(); onSelect(l.key); }}
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
