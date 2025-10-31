import { useState } from "react";
import Sidebar from "./Side";
import Menubar from "./Menubar";
import Mainbar from "./Mainbar";
import "./Dashboard.css";
import PowerChart from "./graphe1/Graphe1";
import RevenueBar from "./graphe2/Graphe2";
import Utilisateurs from "./Work-space/Workspace1";




export default function App(){
  const [active, setActive] = useState("energie");
  const [mobileOpen,setMobileOpen] = useState(false);
  const [collapsed,setCollapsed] = useState(false);

  return (
    <div className="dash-wrap">
      <Sidebar
        open={mobileOpen}
        collapsed={collapsed}
        active={active}
        onSelect={setActive}
        onClose={()=>setMobileOpen(false)}
        onToggleCollapse={()=>setCollapsed(v=>!v)}
      />
      <div className="cm-stack">
        <header className="cm-top">
          <button className="cm-menu" onClick={()=>setMobileOpen(true)}>☰</button>
        </header>
        <main className="cm-main">
          <section className="cm-content">
            {active === "energie" && <PowerChart />}
            {active === "revenus" && <RevenueBar />}
            {active === "Work-Space" && <Utilisateurs />}
            {active !== "energie" && active !== "revenus" }
          </section>
        </main>
      </div>
    </div>
  );
}

