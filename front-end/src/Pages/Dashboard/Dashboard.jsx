import { useState } from "react";
import Sidebar from "./Side";
import Menubar from "./Menubar";
import Mainbar from "./Mainbar";
import "./Dashboard.css";
import PowerChart from "./graphe1/Graphe1";
import RevenueBar from "./graphe2/Graphe2";
import Utilisateurs from "./Work-space/Workspace1";

export default function App() {
  const [active, setActive] = useState("energie");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // fonction toggle mobile sidebar
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  return (
    <div className="dash-wrap">
      <Sidebar
        open={mobileOpen}
        collapsed={collapsed}
        active={active}
        onSelect={setActive}
        onClose={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="cm-stack">
        <header className="cm-top">
          {/* Bouton menu visible sur mobile */}
          <button className="cm-menu" onClick={toggleMobileSidebar}>
            ☰
          </button>
        </header>

        <main className="cm-main">
          <section className="cm-content">
            {active === "energie" && <PowerChart />}
            {active === "revenus" && <RevenueBar />}
            {active === "Work-Space" && <Utilisateurs />}
          </section>
        </main>
      </div>
    </div>
  );
}
