import { RiMenu3Line } from "react-icons/ri";
import "./Dashboard.css";

export default function Menubar({ onOpenMenu=()=>{} }){
  return (
    <header className="cm-top">
      <button className="cm-menu" onClick={onOpenMenu} aria-label="Ouvrir le menu">
        <RiMenu3Line />
      </button>

      <div className="cm-top-right">
        <div className="cm-chip">
          <span>Bienvenue</span>
        </div>
      </div>
    </header>
  );
}
