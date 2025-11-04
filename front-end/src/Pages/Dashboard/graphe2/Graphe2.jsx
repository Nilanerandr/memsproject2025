// RevenueBar.jsx
import { useMemo, useRef, useState, useEffect } from "react";
import { RiBarChart2Fill, RiCalendar2Line, RiArrowDropDownLine, RiCashLine } from "react-icons/ri";
import "./Graphe2.css";
import { getpaymentbyid } from "../../../api/apipayment";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sept","Oct","Nov","Déc"];

export default function RevenueBar() {
  const [dataByYear, setDataByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);

  // Charger et agréger les paiements validés
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

        const resp = await getpaymentbyid(id_user);
        const paiements = Array.isArray(resp?.paiements) ? resp.paiements : [];

        // Filtrer paiements validés
        const validPays = paiements.filter(p => Number(p.validation_du_payement) === 1);

        const agg = {}; // { année: [valeurs 12 mois] }

        validPays.forEach(p => {
          const d = new Date(p.date_creation);
          if (isNaN(d)) return;
          const y = d.getFullYear();
          const m = d.getMonth(); // 0..11
          const val = Number(p.value) || 0; // valeur en Ariary
          if (!agg[y]) agg[y] = new Array(12).fill(0);
          agg[y][m] += val;
        });

        if (mounted) {
          setDataByYear(agg);
          // définir l'année sélectionnée sur la plus récente disponible
          const yearsAvailable = Object.keys(agg).map(Number).sort((a,b)=>a-b);
          setYear(yearsAvailable.at(-1) || null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur fetching payments:", err);
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

  // Années disponibles pour le select
  const years = useMemo(() => Object.keys(dataByYear).map(Number).sort((a,b)=>a-b), [dataByYear]);

  const values = useMemo(() => {
    if (!year || !dataByYear[year]) return new Array(12).fill(0);
    return dataByYear[year];
  }, [dataByYear, year]);

  // Mise à l’échelle et barres
  const { view, scaleX, scaleY, yTicks, bars } = useBar(values);

  // Tooltip
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const onMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM().inverse());
    let idx = 0, min = Infinity;
    bars.forEach((b,i) => { const cx = b.x + b.w/2; const d = Math.abs(cx - x); if(d<min){min=d; idx=i;}});
    const b = bars[idx];
    setHover({ i: idx, x: b.x + b.w/2, y: scaleY(values[idx]), val: values[idx] });
  };

  const onLeave = () => setHover(null);

  const sum = values.reduce((a,b)=>a+b,0);
  const max = Math.max(...values);
  const avg = Math.round(sum / values.length || 0);

  return (
    <div className="rb-wrap">
      <header className="rb-head">
        <div className="rb-title">
          <RiBarChart2Fill className="rb-ic" />
          <div>
            <h2>Revenus mensuels</h2>
            <p>Histogramme dynamique des revenus par mois (Ar)</p>
          </div>
        </div>

        <div className="rb-actions">
          <div className="rb-select">
            <RiCalendar2Line />
            <select value={year || ""} onChange={(e)=>setYear(Number(e.target.value))}>
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
            <g className="rb-axes">
              <line x1={view.padL} y1={view.h - view.padB} x2={view.w - view.padR} y2={view.h - view.padB}/>
              <line x1={view.padL} y1={view.padT} x2={view.padL} y2={view.h - view.padB}/>
              {yTicks.map((t,i)=>(
                <g key={i}>
                  <line x1={view.padL} x2={view.w - view.padR} y1={scaleY(t)} y2={scaleY(t)} className="rb-gridline" />
                  <text x={view.padL - 8} y={scaleY(t)} className="rb-y" dominantBaseline="middle">{t} Ar</text>
                </g>
              ))}
            </g>

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
                  fill="url(#barFill)"
                />
                <text x={b.x + b.w/2} y={view.h - view.padB + 18} className="rb-x" textAnchor="middle">
                  {MONTHS[i]}
                </text>
              </g>
            ))}

            <text x={view.padL - 8} y={scaleY(0)} className="rb-y" dominantBaseline="middle">0 Ar</text>

            {hover && (
              <>
                <line x1={hover.x} x2={hover.x} y1={view.padT} y2={view.h - view.padB} className="rb-marker" />
                <g transform={`translate(${hover.x + 10}, ${hover.y - 36})`} className="rb-tip">
                  <rect rx="8" ry="8" width="140" height="44"/>
                  <text x="10" y="18" className="rb-tip-title">{MONTHS[hover.i]} {year}</text>
                  <text x="10" y="32" className="rb-tip-value">{hover.val} Ar</text>
                </g>
              </>
            )}
          </svg>
        </div>

        <aside className="rb-side">
          <div className="rb-mini glass">
            <div className="rb-mini-title"><RiCashLine /> Total annuel</div>
            <div className="rb-mini-value">{sum.toLocaleString("fr-FR")} Ar</div>
          </div>
          <div className="rb-mini glass">
            <div className="rb-mini-title"><RiCashLine /> Pic mensuel</div>
            <div className="rb-mini-value">{max} Ar</div>
          </div>
          <div className="rb-mini glass">
            <div className="rb-mini-title"><RiCashLine /> Moyenne</div>
            <div className="rb-mini-value">{avg} Ar</div>
          </div>
        </aside>
      </section>

      {loading && <div style={{position:'absolute', right:16, top:16, color:'#cfcfcf'}}>Chargement...</div>}
    </div>
  );
}

/* Utilitaire de calcul des barres */
function useBar(values){
  const w = 980, h = 360;
  const padL = 56, padR = 60, padT = 26, padB = 44;
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

function niceCeil(v){ const p = Math.pow(10, Math.floor(Math.log10(v))); return Math.ceil(v/p)*p; }
function niceTicks(n,max){ const step = Math.round(max/n); return Array.from({length:n+1},(_,i)=>i*step); }
