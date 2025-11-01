// PowerChart.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { RiFlashlightFill, RiCalendar2Line, RiArrowDropDownLine } from "react-icons/ri";
import "./Graphe1.css";
import { getconsommationsByUser } from '../../../api/apiconsommation.js'

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

export default function PowerChart() {
  const [dataByYear, setDataByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);

  // 🔹 Charger et agréger les consommations
  useEffect(() => {
    let mounted = true;

    const fetchAndAggregate = async () => {
      setLoading(true);
      try {
        const id_user = localStorage.getItem("id_user");
        if (!id_user) {
          setDataByYear({});
          setLoading(false);
          return;
        }

        const resp = await getconsommationsByUser(id_user);
        // console.log("res", resp);

        const consos = Array.isArray(resp.consommations) ? resp.consommations : [];

        const agg = {}; // { année: [valeurs 12 mois] }

        consos.forEach(c => {
          const d = new Date(c.datedecreation);
          if (isNaN(d)) return;
          const y = d.getFullYear();
          const m = d.getMonth(); // 0..11
          const val = (Number(c.consommation_Wh) || 0) / 1000; // convertir Wh → kW
          if (!agg[y]) agg[y] = new Array(12).fill(0);
          agg[y][m] += val;
        });

        if (mounted) {
          setDataByYear(agg);
          const yearsAvailable = Object.keys(agg).map(Number).sort((a,b)=>a-b);
          setYear(yearsAvailable.at(-1) || null); // année la plus récente
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur fetching consommations:", err);
        if (mounted) {
          setDataByYear({});
          setYear(null);
          setLoading(false);
        }
      }
    };

    fetchAndAggregate();
    return () => { mounted = false; };
  }, []);

  const years = useMemo(() => Object.keys(dataByYear).map(Number).sort((a,b)=>a-b), [dataByYear]);
  const series = useMemo(() => {
    if (!year || !dataByYear[year]) return new Array(12).fill(0);
    return dataByYear[year];
  }, [dataByYear, year]);

  // Mise à l’échelle et chemins
  const { view, scaleX, scaleY, yTicks, pathLine, pathArea, points } = useChart(series);

  // Interaction
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const onMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM().inverse());
    let nearest = 0, minDist = Infinity;
    points.forEach((p,i) => {
      const dx = Math.abs(p.x - x);
      if(dx < minDist) { minDist = dx; nearest = i; }
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
          <RiFlashlightFill className="pc-ic"/>
          <div>
            <h2>Puissance consommée</h2>
            <p>Consommation mensuelle en kW pour l’année sélectionnée</p>
          </div>
        </div>

        <div className="pc-actions">
          <div className="pc-select" role="button" aria-label="Choisir une année">
            <RiCalendar2Line/>
            <select value={year || ""} onChange={e=>setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <RiArrowDropDownLine className="pc-caret"/>
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
                <stop offset="0%" stopColor="#f6d365" stopOpacity="0.55"/>
                <stop offset="100%" stopColor="#fda085" stopOpacity="0.06"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g className="pc-axes">
              <line x1={view.padL} y1={view.h - view.padB} x2={view.w - view.padR} y2={view.h - view.padB}/>
              <line x1={view.padL} y1={view.padT} x2={view.padL} y2={view.h - view.padB}/>
              {yTicks.map((t,i)=>(<g key={i}>
                <line x1={view.padL} x2={view.w - view.padR} y1={scaleY(t)} y2={scaleY(t)} className="pc-gridline"/>
                <text x={view.padL - 8} y={scaleY(t)} className="pc-y" dominantBaseline="middle">
                  {t.toLocaleString("fr-FR")} kW
                </text>
              </g>))}
            </g>

            <path d={pathArea} className="pc-area"/>
            <path d={pathLine} className="pc-line" filter="url(#glow)"/>

            {MONTHS.map((m,i)=>(<text key={m} x={scaleX(i)} y={view.h - view.padB + 18} className="pc-x" textAnchor="middle">{m}</text>))}
            {points.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="4" className="pc-dot"/>))}

            {hover && <>
              <line x1={hover.x} x2={hover.x} y1={view.padT} y2={view.h - view.padB} className="pc-marker"/>
              <circle cx={hover.x} cy={hover.y} r="6" className="pc-dot active"/>
              <g transform={`translate(${hover.x + 10}, ${hover.y - 28})`} className="pc-tip">
                <rect rx="8" ry="8" width="130" height="44"/>
                <text x="10" y="18" className="pc-tip-title">{MONTHS[hover.i]} {year}</text>
                <text x="10" y="34" className="pc-tip-value">{hover.val.toLocaleString("fr-FR")} kW</text>
              </g>
            </>}
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

      {loading && <div style={{textAlign:"center", color:"#fff"}}>Chargement des données...</div>}
    </div>
  );
}

/* Hook utilitaire pour calculs de tracé */
function useChart(series){
  const w=980,h=360;
  const padL=56,padR=20,padT=26,padB=44;
  const innerW=w-padL-padR, innerH=h-padT-padB;
  const maxVal=Math.max(...series, 600);
  const niceMax=niceCeil(maxVal);
  const yTicks=niceTicks(5,niceMax);

  const scaleX=i=>padL + (innerW/11)*i; // 12 mois
  const scaleY=v=>padT + innerH - (v/niceMax)*innerH;

  const points=series.map((v,i)=>({x:scaleX(i),y:scaleY(v),v}));
  const dLine=points.map((p,i,arr)=>{
    if(i===0) return `M ${p.x} ${p.y}`;
    const p0=arr[i-1];
    const cx=(p0.x+p.x)/2;
    return `Q ${cx} ${p0.y}, ${p.x} ${p.y}`;
  }).join(" ");
  const dArea=`${dLine} L ${padL+innerW} ${padT+innerH} L ${padL} ${padT+innerH} Z`;

  return { view:{w,h,padL,padR,padT,padB}, scaleX, scaleY, yTicks, pathLine:dLine, pathArea:dArea, points };
}

/* Helpers */
function niceCeil(v){ const p=Math.pow(10,Math.floor(Math.log10(v))); return Math.ceil(v/p)*p; }
function niceTicks(n,max){ const step=max/n; return Array.from({length:n+1},(_,i)=>Math.round(step*i)); }
