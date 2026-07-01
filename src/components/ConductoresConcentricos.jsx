import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import './ConductoresConcentricos.css'

// ── Physics ──────────────────────────────────────────────────────────────────
const Ra = 0.5, Rb = 0.7, Rc = 0.9, Rd = 1.1
const kQt = -12960 * Math.PI  // k·Q_total en V·m

function calcE(r) {
  if (r < Ra)  return 0
  if (r <= Rb) return -54000 * Math.PI * (1 - 0.25 / (r * r))
  if (r < Rc)  return kQt / (r * r)
  if (r <= Rd) return 0
  return kQt / (r * r)
}

function calcV(r) {
  if (r > Rd)  return kQt / r
  if (r >= Rc) return kQt / Rd
  if (r > Rb)  return kQt * (1 / Rd - 1 / Rc + 1 / r)
  if (r >= Ra) return 54000 * Math.PI * (r + 0.25 / r) - 72981.8 * Math.PI
  return 54000 * Math.PI * (Ra + 0.25 / Ra) - 72981.8 * Math.PI
}

function getZone(r) {
  if (r < Ra)  return { num: 1, label: 'Zona 1 — Vacío interior (r < Rₐ = 0,5 m)' }
  if (r <= Rb) return { num: 2, label: 'Zona 2 — Cascarón dieléctrico (Rₐ ≤ r ≤ Rᵦ = 0,7 m)' }
  if (r < Rc)  return { num: 3, label: 'Zona 3 — Vacío entre cascarones' }
  if (r <= Rd) return { num: 4, label: 'Zona 4 — Interior del conductor (E = 0)' }
  return         { num: 5, label: 'Zona 5 — Exterior del sistema' }
}

const ZONE_COLORS = {
  1: '#757575',
  2: '#1565c0',
  3: '#757575',
  4: '#e65100',
  5: '#1b5e20',
}

// ── SVG layout constants ──────────────────────────────────────────────────────
const CX = 150, CY = 150
const SCALE = 110 // px por metro
const RA_PX = Ra * SCALE
const RB_PX = Rb * SCALE
const RC_PX = Rc * SCALE
const RD_PX = Rd * SCALE

const RESULTADOS = [
  { mag: 'Q_total del dieléctrico',                       val: '−1,44π μC ≈ −4,524 μC' },
  { mag: 'σ_c  cara interior Rc=0,9m',                    val: '+4/9 μC/m² ≈ +0,444 μC/m²' },
  { mag: 'σ_d  cara exterior Rd=1,1m',                    val: '−36/121 μC/m² ≈ −0,298 μC/m²' },
  { mag: 'E(P1)  |r|=0,7m=Rᵦ (frontera)',                 val: '−83.092 N/C r̂' },
  { mag: 'V(P1)',                                         val: '−49.939 V' },
  { mag: 'E(P2)  (0,−0,7,−0,7)m → |r|≈0,990m — dentro del conductor', val: '0 N/C' },
  { mag: 'V(P2)',                                         val: '−37.014 V' },
]

const CHART_DATA = Array.from({ length: 300 }, (_, i) => {
  const r = 0.001 + (i * 1.499) / 299
  return { r: parseFloat(r.toFixed(3)), E: calcE(r), V: calcV(r) }
})

const BOUNDARIES = [
  { x: Ra, label: '0,5' },
  { x: Rb, label: '0,7' },
  { x: Rc, label: '0,9' },
  { x: Rd, label: '1,1' },
]

export default function ConductoresConcentricos() {
  const [r, setR] = useState(0.8)

  const zone = useMemo(() => getZone(r), [r])
  const E = useMemo(() => calcE(r), [r])
  const V = useMemo(() => calcV(r), [r])

  const showPoint = r > 0 && r <= 1.45
  const rSVG = Math.min(r, 1.45) * SCALE
  const angle = Math.PI / 4 // 45°
  const px = CX + rSVG * Math.cos(angle)
  const py = CY - rSVG * Math.sin(angle)
  const pointColor = zone.num === 4 ? '#e65100' : '#c62828'

  return (
    <div className="fs-root">
      <h2>Conductores Concéntricos</h2>
      <p className="cc2-subtitle">
        Cascarón dieléctrico entre Rₐ y Rᵦ, y cascarón conductor entre Rc y Rd,
        con vacío entre ambos.
      </p>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="fs-controls">
        <div className="fs-slider-row">
          <span className="fs-z-label">r = <strong>{r.toFixed(2)} m</strong></span>
          <input
            type="range" min="0" max="1.5" step="0.01"
            value={r}
            onChange={e => setR(parseFloat(e.target.value))}
            className="fs-slider"
          />
        </div>
        <div className="fs-btn-row">
          <button className="tab-btn" onClick={() => setR(0.7)}>Ir a P1 (r=0,7m)</button>
          <button className="tab-btn" onClick={() => setR(0.99)}>Ir a P2 (r=0,99m)</button>
        </div>
      </div>

      {/* ── SVG + values ─────────────────────────────────────────────────── */}
      <div className="fs-layout">

        <svg width={300} height={300} className="fs-svg" aria-label="Diagrama del sistema de conductores concéntricos">
          {/* Anillo Rc→Rd, conductor */}
          <circle cx={CX} cy={CY} r={RD_PX} fill="#b0bec5" stroke="#546e7a" strokeWidth={1.5} />
          {/* Anillo Rb→Rc, vacío */}
          <circle cx={CX} cy={CY} r={RC_PX} fill="white" stroke="#ccc" strokeWidth={1.5} />
          {/* Anillo Ra→Rb, dieléctrico */}
          <circle cx={CX} cy={CY} r={RB_PX} fill="#bbdefb" fillOpacity={0.7} stroke="#1565c0" strokeWidth={1.5} />
          {/* Círculo central, vacío interior */}
          <circle cx={CX} cy={CY} r={RA_PX} fill="white" stroke="#ccc" strokeWidth={1} />

          <text x={CX} y={CY - 4} textAnchor="middle" fontSize={9} fill="#999">Vacío</text>

          <text x={CX} y={CY - (RA_PX + RB_PX) / 2} textAnchor="middle" fontSize={8}
                fill="#1565c0" fontStyle="italic">ρ(r) dieléctrico</text>

          <text x={CX} y={CY - (RB_PX + RC_PX) / 2} textAnchor="middle" fontSize={8}
                fill="#999" fontStyle="italic">Vacío</text>

          <text x={CX} y={CY - (RC_PX + RD_PX) / 2} textAnchor="middle" fontSize={8}
                fill="#37474f" fontStyle="italic">Conductor</text>

          {/* Radial labels toward bottom-right */}
          {[
            { r: RA_PX, label: 'Rₐ' },
            { r: RB_PX, label: 'Rᵦ' },
            { r: RC_PX, label: 'Rc' },
            { r: RD_PX, label: 'Rd' },
          ].map(({ r: rr, label }) => {
            const a = Math.PI / 4 * 1.6 // ~72° hacia abajo-derecha
            const lx = CX + rr * Math.cos(a)
            const ly = CY + rr * Math.sin(a)
            const lx2 = lx + 14
            const ly2 = ly + 14
            return (
              <g key={label}>
                <line x1={lx} y1={ly} x2={lx2} y2={ly2} stroke="#888" strokeWidth={0.75} />
                <text x={lx2 + 2} y={ly2 + 3} fontSize={9} fill="#666">{label}</text>
              </g>
            )
          })}

          {/* Slider point indicator */}
          {showPoint && (
            <g>
              <circle cx={px} cy={py} r={5.5} fill={pointColor} stroke="white" strokeWidth={1.5} />
              <text x={px + 9} y={py - 6} fontSize={10} fontWeight="bold" fill={pointColor}>
                r={r.toFixed(2)} m
              </text>
            </g>
          )}
        </svg>

        <div className="fs-values">
          <div className="fs-card">
            <div className="fs-card-title">Zona actual</div>
            <div className="cc2-zone" style={{ color: ZONE_COLORS[zone.num] }}>
              {zone.label}
            </div>
          </div>
          <div className="fs-card fs-card-result">
            <div className="fs-card-title">Campo eléctrico</div>
            <div className="cc2-result">{E.toFixed(1)} N/C r̂</div>
            <div className="fs-card-title cc2-title-spaced">Potencial</div>
            <div className="cc2-result">{V.toFixed(1)} V</div>
          </div>
        </div>
      </div>

      {/* ── Fixed results table ──────────────────────────────────────────── */}
      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Magnitud</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {RESULTADOS.map(({ mag, val }) => (
              <tr key={mag}>
                <td>{mag}</td>
                <td>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      <div className="fs-chart-wrap">
        <div className="cc2-chart-title">Campo Eléctrico Eᵣ(r)</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={CHART_DATA} margin={{ top: 10, right: 24, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="r" type="number" domain={[0, 1.5]}
              tickFormatter={v => v.toFixed(1)}
              label={{ value: 'r (m)', position: 'insideBottom', offset: -8 }}
            />
            <YAxis
              domain={[-100000, 10000]}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
              unit=" N/C"
              width={52}
            />
            <Tooltip
              formatter={v => [`${v.toFixed(1)} N/C`, 'E(r)']}
              labelFormatter={v => `r = ${parseFloat(v).toFixed(3)} m`}
            />
            <Line dataKey="E" stroke="#1565c0" strokeWidth={2} dot={false} name="E(r)" />
            {BOUNDARIES.map(({ x, label }) => (
              <ReferenceLine key={x} x={x} stroke="#999" strokeDasharray="4 3"
                label={{ value: label, position: 'top', fontSize: 10 }} />
            ))}
            <ReferenceLine y={0} stroke="#333" strokeWidth={1} />
            <ReferenceLine x={r} stroke="#e53935" strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="fs-chart-wrap">
        <div className="cc2-chart-title">Potencial Eléctrico V(r)</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={CHART_DATA} margin={{ top: 10, right: 24, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="r" type="number" domain={[0, 1.5]}
              tickFormatter={v => v.toFixed(1)}
              label={{ value: 'r (m)', position: 'insideBottom', offset: -8 }}
            />
            <YAxis
              domain={[-70000, 5000]}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
              unit=" V"
              width={52}
            />
            <Tooltip
              formatter={v => [`${v.toFixed(1)} V`, 'V(r)']}
              labelFormatter={v => `r = ${parseFloat(v).toFixed(3)} m`}
            />
            <Line dataKey="V" stroke="#6a1b9a" strokeWidth={2} dot={false} name="V(r)" />
            {BOUNDARIES.map(({ x, label }) => (
              <ReferenceLine key={x} x={x} stroke="#999" strokeDasharray="4 3"
                label={{ value: label, position: 'top', fontSize: 10 }} />
            ))}
            <ReferenceLine y={0} stroke="#333" strokeWidth={1} />
            <ReferenceLine x={r} stroke="#e53935" strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
