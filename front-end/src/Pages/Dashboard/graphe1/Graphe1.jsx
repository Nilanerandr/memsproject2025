import { useMemo, useRef, useState } from "react";
import { RiFlashlightFill, RiCalendar2Line, RiArrowDropDownLine} from "react-icons/ri";
import "./Graphe1.css";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

// Données démo (kW)
const DATA = {
  2023: [320,290,360,405,430,470,515,495,460,430,395,360],
  2024: [300,310,370,420,450,495,540,520,485,455,410,375],
  2025: [310,300,365,410,445,490,540,525,495,470,440,420],
};

export default function PowerChart() {
  const years = Object.keys(DATA).map(Number).sort((a,b)=>a-b);
  const [year, setYear] = useState(years.at(-1));
  const series = DATA[year];

  // Mise à l’échelle et chemins
  const { view, scaleX, scaleY, yTicks, pathLine, pathArea, points } = useChart(series);

  // Interaction
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null); // {i,x,y,val}

  const onMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM().inverse());
    // Trouver l’index de mois le plus proche
    let nearest = 0;
    let minDist = Infinity;
    points.forEach((p, i) => {
      const dx = Math.abs(p.x - x);
      if (dx < minDist) { minDist = dx; nearest = i; }
    });
    const p = points[nearest];
    setHover({ i: nearest, x: p.x, y: p.y, val: p.v });
  };

  const onLeave = () => setHover(null);

  const sum = series.reduce((a,b)=>a+b,0);
  const max = Math.max(...series);
  const avg = Math.round(sum/series.length);

  return (
    <div className="pc-wrap">
      <header className="pc-head">
        <div className="pc-title">
          <RiFlashlightFill className="pc-ic" />
          <div>
            <h2>Puissance consommée</h2>
            <p>Consommation mensuelle en kW pour l’année sélectionnée</p>
          </div>
        </div>

        <div className="pc-actions">
          <div className="pc-select" role="button" aria-label="Choisir une année">
            <RiCalendar2Line />
            <select value={year} onChange={(e)=>setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <RiArrowDropDownLine className="pc-caret" />
          </div>
        </div>
      </header>

      <section className="pc-grid">
        <div className="pc-card glass">
          <div className="pc-card-head">
            <span>Tendance annuelle</span>
            <strong>{year}</strong>
          </div>

          <svg
            ref={svgRef}
            className="pc-chart"
            viewBox={`0 0 ${view.w} ${view.h}`}
            preserveAspectRatio="none"
            onMouseMove={onMouseMove}
            onMouseLeave={onLeave}
          >
            <defs>
              <linearGradient id="yFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f6d365" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fda085" stopOpacity="0.06" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Axes et ticks */}
            <g className="pc-axes">
              <line x1={view.padL} y1={view.h - view.padB} x2={view.w - view.padR} y2={view.h - view.padB}/>
              <line x1={view.padL} y1={view.padT} x2={view.padL} y2={view.h - view.padB}/>
              {yTicks.map((t,i)=>(
                <g key={i}>
                  <line
                    x1={view.padL} x2={view.w - view.padR}
                    y1={scaleY(t)} y2={scaleY(t)}
                    className="pc-gridline"
                  />
                  <text x={view.padL - 8} y={scaleY(t)} className="pc-y" dominantBaseline="middle">
                    {t.toLocaleString("fr-FR")} kW
                  </text>
                </g>
              ))}
            </g>

            {/* Area + line */}
            <path d={pathArea} className="pc-area"/>
            <path d={pathLine} className="pc-line" filter="url(#glow)"/>

            {/* X labels */}
            {MONTHS.map((m,i)=>(
              <text key={m} x={scaleX(i)} y={view.h - view.padB + 18} className="pc-x" textAnchor="middle">
                {m}
              </text>
            ))}

            {/* Points */}
            {points.map((p,i)=>(
              <circle key={i} cx={p.x} cy={p.y} r="4" className="pc-dot"/>
            ))}

            {/* Interaction: repère + tooltip */}
            {hover && (
              <>
                <line
                  x1={hover.x} x2={hover.x}
                  y1={view.padT} y2={view.h - view.padB}
                  className="pc-marker"
                />
                <circle cx={hover.x} cy={hover.y} r="6" className="pc-dot active"/>
                <g transform={`translate(${hover.x + 10}, ${hover.y - 28})`} className="pc-tip">
                  <rect rx="8" ry="8" width="130" height="44"/>
                  <text x="10" y="18" className="pc-tip-title">
                    {MONTHS[hover.i]} {year}
                  </text>
                  <text x="10" y="34" className="pc-tip-value">
                    {hover.val.toLocaleString("fr-FR")} kW
                  </text>
                </g>
              </>
            )}
          </svg>
        </div>

        <aside className="pc-side">
          <div className="pc-mini glass">
            <span className="pc-mini-title">Somme annuelle</span>
            <strong className="pc-mini-value">{sum.toLocaleString("fr-FR")} kW</strong>
          </div>
          <div className="pc-mini glass">
            <span className="pc-mini-title">Pic mensuel</span>
            <strong className="pc-mini-value">{max.toLocaleString("fr-FR")} kW</strong>
          </div>
          <div className="pc-mini glass">
            <span className="pc-mini-title">Moyenne</span>
            <strong className="pc-mini-value">{avg.toLocaleString("fr-FR")} kW</strong>
          </div>
        </aside>
      </section>
    </div>
  );
}

/* Hook utilitaire pour calculs de tracé */
function useChart(series){
  const w = 980, h = 360;
  const padL = 56, padR = 20, padT = 26, padB = 44;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const maxVal = Math.max( ...series, 600 );
  const niceMax = niceCeil(maxVal);          // arrondi “joli” pour l’axe
  const yTicks = niceTicks(5, niceMax);      // 5 graduations

  const scaleX = (i)=> padL + (innerW/(series.length-1)) * i;
  const scaleY = (v)=> padT + innerH - (v/niceMax) * innerH;

  // Points
  const points = series.map((v,i)=>({ x: scaleX(i), y: scaleY(v), v }));

  // Catmull-Rom lissé via segments Quadratic
  const dLine = points.map((p,i,arr)=>{
    if(i===0) return `M ${p.x} ${p.y}`;
    const p0 = arr[i-1];
    const cx = (p0.x + p.x)/2;
    return `Q ${cx} ${p0.y}, ${p.x} ${p.y}`;
  }).join(" ");

  const dArea = `${dLine} L ${padL + innerW} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  return {
    view: { w, h, padL, padR, padT, padB },
    scaleX, scaleY, yTicks,
    pathLine: dLine,
    pathArea: dArea,
    points
  };
}

/* Helpers pour des axes “propres” */
function niceCeil(v){
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / p) * p;
}
function niceTicks(n, max){
  const step = max / n;
  const arr = [];
  for(let i=0;i<=n;i++) arr.push(Math.round(step*i));
  return arr;
}

