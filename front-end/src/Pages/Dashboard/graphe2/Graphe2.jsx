import { useMemo, useRef, useState } from "react";
import { RiBarChart2Fill, RiCalendar2Line, RiArrowDropDownLine, RiCashLine } from "react-icons/ri";
import "./Graphe2.css";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

// Données démo (revenus en milliers, ex: 35 => 35 000)
const DATA = {
  2023: [32,28,35,38,42,45,49,52,47,44,41,39],
  2024: [30,31,36,40,43,48,53,55,50,46,43,40],
  2025: [33,30,38,42,46,51,57,60,54,49,45,42],
};

export default function RevenueBar(){
  const years = Object.keys(DATA).map(Number).sort((a,b)=>a-b);
  const [year, setYear] = useState(years.at(-1));
  const values = DATA[year];

  // Mise à l’échelle et barres
  const { view, scaleX, scaleY, yTicks, bars, maxNice } = useBar(values);

  // Tooltip
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null); // {i,x,y,val}

  const onMove = (e)=>{
    const svg = svgRef.current; if(!svg) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM().inverse());
    // Trouver la barre la plus proche du curseur
    let idx = 0, min = Infinity;
    bars.forEach((b,i)=>{ const cx = b.x + b.w/2; const d = Math.abs(cx - x); if(d<min){min=d; idx=i;}});
    const b = bars[idx];
    setHover({ i: idx, x: b.x + b.w/2, y: scaleY(values[idx]), val: values[idx] });
  };
  const onLeave = ()=> setHover(null);

  const sum = values.reduce((a,b)=>a+b,0);
  const max = Math.max(...values);
  const avg = Math.round(sum/values.length);

  return (
    <div className="rb-wrap">
      <header className="rb-head">
        <div className="rb-title">
          <RiBarChart2Fill className="rb-ic" />
          <div>
            <h2>Revenus mensuels</h2>
            <p>Histogramme dynamique des revenus par mois (k€)</p>
          </div>
        </div>

        <div className="rb-actions">
          <div className="rb-select">
            <RiCalendar2Line />
            <select value={year} onChange={(e)=>setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <RiArrowDropDownLine className="rb-caret" />
          </div>
        </div>
      </header>

      <section className="rb-grid">
        <div className="rb-card glass">
          <div className="rb-card-head">
            <span>Vue annuelle</span>
            <strong>{year}</strong>
          </div>

          <svg
            ref={svgRef}
            className="rb-chart"
            viewBox={`0 0 ${view.w} ${view.h}`}
            preserveAspectRatio="none"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            {/* Axes + ticks */}
            <g className="rb-axes">
              <line x1={view.padL} y1={view.h - view.padB} x2={view.w - view.padR} y2={view.h - view.padB}/>
              <line x1={view.padL} y1={view.padT} x2={view.padL} y2={view.h - view.padB}/>
              {yTicks.map((t,i)=>(
                <g key={i}>
                  <line x1={view.padL} x2={view.w - view.padR} y1={scaleY(t)} y2={scaleY(t)} className="rb-gridline" />
                  <text x={view.padL - 8} y={scaleY(t)} className="rb-y" dominantBaseline="middle">{t} k€</text>
                </g>
              ))}
            </g>

            {/* Barres */}
            <defs>
              <linearGradient id="barFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3ab4ff" />
                <stop offset="100%" stopColor="#7a5cff" />
              </linearGradient>
            </defs>

            {bars.map((b,i)=>(
              <g key={i}>
                <rect
                  x={b.x} y={b.y} width={b.w} height={b.h}
                  className={`rb-bar ${hover?.i===i ? "active":""}`}
                  rx="6" ry="6"
                />
                <text x={b.x + b.w/2} y={view.h - view.padB + 18} className="rb-x" textAnchor="middle">
                  {MONTHS[i]}
                </text>
              </g>
            ))}

            {/* Ligne de base 0 */}
            <text x={view.padL - 8} y={scaleY(0)} className="rb-y" dominantBaseline="middle">0 k€</text>

            {/* Tooltip */}
            {hover && (
              <>
                <line x1={hover.x} x2={hover.x} y1={view.padT} y2={view.h - view.padB} className="rb-marker" />
                <g transform={`translate(${hover.x + 10}, ${hover.y - 36})`} className="rb-tip">
                  <rect rx="8" ry="8" width="120" height="40"/>
                  <text x="10" y="18" className="rb-tip-title">{MONTHS[hover.i]} {year}</text>
                  <text x="10" y="32" className="rb-tip-value">{hover.val} k€</text>
                </g>
              </>
            )}
          </svg>
        </div>

        <aside className="rb-side">
          <div className="rb-mini glass">
            <div className="rb-mini-title"><RiCashLine /> Total annuel</div>
            <div className="rb-mini-value">{sum.toLocaleString("fr-FR")} k€</div>
          </div>
          <div className="rb-mini glass">
            <div className="rb-mini-title"><RiCashLine /> Pic mensuel</div>
            <div className="rb-mini-value">{max} k€</div>
          </div>
          <div className="rb-mini glass">
            <div className="rb-mini-title"><RiCashLine /> Moyenne</div>
            <div className="rb-mini-value">{avg} k€</div>
          </div>
        </aside>
      </section>
    </div>
  );
}

/* Utilitaire de calcul des barres */
function useBar(values){
  const w = 980, h = 360;
  const padL = 56, padR = 20, padT = 26, padB = 44;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const max = Math.max(...values, 60);
  const maxNice = niceCeil(max);
  const yTicks = niceTicks(5, maxNice);

  const band = innerW / values.length;
  const barGap = 12;
  const barW = Math.max(8, band - barGap);

  const scaleX = (i)=> padL + i*band + (band - barW)/2;
  const scaleY = (v)=> padT + innerH - (v/maxNice)*innerH;

  const bars = values.map((v,i)=>{
    const x = scaleX(i);
    const y = scaleY(v);
    const hBar = padT + innerH - y;
    return { x, y, w: barW, h: hBar, v };
  });

  return { view:{w,h,padL,padR,padT,padB}, scaleX, scaleY, yTicks, bars, maxNice };
}

/* Helpers pour axes propres */
function niceCeil(v){ const p = Math.pow(10, Math.floor(Math.log10(v))); return Math.ceil(v/p)*p; }
function niceTicks(n,max){ const step = Math.round(max/n); return Array.from({length:n+1},(_,i)=>i*step); }
