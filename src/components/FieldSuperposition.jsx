import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import './FieldSuperposition.css'

// ── Physics ──────────────────────────────────────────────────────────────────
const k = 9e9
const E_PLANOS = 2259.9  // N/C, constant, direction ĵ

function calcFields(z) {
  const esfera = k * 50e-9 / (z * z)
  const anillo = k * 3.14e-9 * z / Math.pow(0.05 * 0.05 + z * z, 1.5)
  const kComp  = esfera + anillo
  const mag    = Math.sqrt(E_PLANOS * E_PLANOS + kComp * kComp)
  return { esfera, anillo, kComp, mag }
}

// ── SVG layout constants ──────────────────────────────────────────────────────
const SW = 272, SH = 318
const AX  = SW / 2       // Z-axis x
const OY  = 278          // Origin (z=0) y in SVG coords
const TOP = 42           // z=3 m y in SVG coords

function zToY(z) {
  return OY - (z / 3) * (OY - TOP)
}

// Manual arrowhead — works without <defs>/<marker> to avoid id collisions
function SvgArrow({ x1, y1, x2, y2, color, w = 2.5 }) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy)
  if (len < 3) return null
  const ux = dx / len, uy = dy / len
  const px = -uy,      py =  ux
  const hs = 8
  return (
    <g>
      <line x1={x1} y1={y1}
            x2={x2 - ux * hs * 0.65} y2={y2 - uy * hs * 0.65}
            stroke={color} strokeWidth={w} />
      <polygon
        fill={color}
        points={`
          ${x2},${y2}
          ${x2 - ux * hs + px * hs * 0.42},${y2 - uy * hs + py * hs * 0.42}
          ${x2 - ux * hs - px * hs * 0.42},${y2 - uy * hs - py * hs * 0.42}
        `}
      />
    </g>
  )
}

const COLORS = { planos: '#1565c0', esfera: '#2e7d32', anillo: '#e65100' }

// k̂ arrow normalized to [8, 52] over the full z range [0.3, 3]
// kComp_max ≈ 5301 N/C at z=0.3, kComp_min ≈ 51 N/C at z=3
const K_RANGE_MIN =  51
const K_RANGE_MAX = 5301
function kArrowLen(kComp) {
  const t = Math.min(1, Math.max(0, (kComp - K_RANGE_MIN) / (K_RANGE_MAX - K_RANGE_MIN)))
  return 8 + t * 44
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FieldSuperposition() {
  const [z, setZ] = useState(2)
  const f = useMemo(() => calcFields(z), [z])

  const pointY = zToY(z)
  const arrowK = kArrowLen(f.kComp)  // upward (−y in SVG)
  const arrowJ = 44                  // rightward, constant (E_PLANOS is constant)

  const chartData = [
    { name: 'Planos', label: 'Planos (ĵ)',  value: E_PLANOS,  color: COLORS.planos  },
    { name: 'Esfera', label: 'Esfera (k̂)',  value: f.esfera,  color: COLORS.esfera  },
    { name: 'Anillo', label: 'Anillo (k̂)',  value: f.anillo,  color: COLORS.anillo  },
  ]

  return (
    <div className="fs-root">
      <h2>Superposición de Campos</h2>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="fs-controls">
        <div className="fs-slider-row">
          <span className="fs-z-label">z = <strong>{z.toFixed(2)} m</strong></span>
          <input
            type="range" min="0.3" max="3" step="0.01"
            value={z}
            onChange={e => setZ(parseFloat(e.target.value))}
            className="fs-slider"
          />
        </div>
        <div className="fs-btn-row">
          <button className="tab-btn" onClick={() => setZ(2)}>Ir a P1 (z=2m)</button>
          <button className="tab-btn" onClick={() => setZ(1)}>Ir a P2 (z=1m)</button>
        </div>
      </div>

      {/* ── SVG + values ─────────────────────────────────────────────────── */}
      <div className="fs-layout">

        {/* Diagram */}
        <svg width={SW} height={SH} className="fs-svg" aria-label="Diagrama del sistema">

          {/* Planes — vertical dashed lines */}
          <line x1={50} y1={TOP-8} x2={50} y2={OY+16}
                stroke={COLORS.planos} strokeWidth={2.5} strokeDasharray="8,4" />
          <line x1={SW-50} y1={TOP-8} x2={SW-50} y2={OY+16}
                stroke={COLORS.planos} strokeWidth={2.5} strokeDasharray="8,4" />
          <text x={50}     y={TOP-12} textAnchor="middle" fontSize={9} fill={COLORS.planos}>Plano 1</text>
          <text x={SW-50}  y={TOP-12} textAnchor="middle" fontSize={9} fill={COLORS.planos}>Plano 2</text>

          {/* Z axis */}
          <line x1={AX} y1={OY} x2={AX} y2={TOP+6} stroke="#555" strokeWidth={1.5} />
          <polygon
            fill="#555"
            points={`${AX},${TOP-2} ${AX-5},${TOP+10} ${AX+5},${TOP+10}`}
          />
          <text x={AX+9} y={TOP+2} fontSize={13} fontWeight="bold" fill="#555">Z</text>

          {/* Tick marks */}
          {[1, 2, 3].map(v => (
            <g key={v}>
              <line x1={AX-5} y1={zToY(v)} x2={AX+5} y2={zToY(v)}
                    stroke="#aaa" strokeWidth={1} />
              <text x={AX-9} y={zToY(v)+4} textAnchor="end" fontSize={9} fill="#999">{v}</text>
            </g>
          ))}
          <text x={AX-9} y={OY+4} textAnchor="end" fontSize={9} fill="#bbb">0</text>

          {/* Ring — back half (top arc, passes behind sphere) */}
          <path d={`M ${AX+27},${OY} A 27,8 0 0,0 ${AX-27},${OY}`}
                fill="none" stroke={COLORS.anillo} strokeWidth={2.5}
                strokeDasharray="4,3" opacity={0.6} />
          <text x={AX+31} y={OY-9} fontSize={9} fontStyle="italic" fill={COLORS.anillo}>anillo</text>

          {/* Sphere at origin — covers back arc where they overlap */}
          <circle cx={AX} cy={OY} r={14}
                  fill="#fffde7" stroke={COLORS.esfera} strokeWidth={2} />
          <text x={AX} y={OY+4} textAnchor="middle" fontSize={8} fontStyle="italic"
                fill={COLORS.esfera}>esfera</text>

          {/* Ring — front half (bottom arc, passes in front of sphere) */}
          <path d={`M ${AX+27},${OY} A 27,8 0 0,1 ${AX-27},${OY}`}
                fill="none" stroke={COLORS.anillo} strokeWidth={2.5} />

          {/* Field component arrows at P */}
          {/* ĵ — horizontal to the right */}
          <SvgArrow x1={AX} y1={pointY} x2={AX + arrowJ} y2={pointY} color={COLORS.planos} />
          <text x={AX + arrowJ + 4} y={pointY - 3} fontSize={9} fill={COLORS.planos}>ĵ</text>

          {/* k̂ — vertical upward */}
          <SvgArrow x1={AX} y1={pointY} x2={AX} y2={pointY - arrowK} color={COLORS.esfera} />
          <text x={AX + 4} y={pointY - arrowK - 3} fontSize={9} fill={COLORS.esfera}>k̂</text>

          {/* Point P */}
          <circle cx={AX} cy={pointY} r={6.5} fill="#c62828" stroke="white" strokeWidth={2} />
          <text x={AX+12} y={pointY+5} fontSize={12} fontWeight="bold" fill="#c62828">P</text>

          {/* Scale note */}
          <text x={SW-4} y={SH-5} textAnchor="end" fontSize={8} fill="#bbb"
                fontStyle="italic">esquemático</text>
        </svg>

        {/* Numerical values */}
        <div className="fs-values">
          <div className="fs-card">
            <div className="fs-card-title">Fuentes individuales</div>
            <ValRow label="E_planos" value={E_PLANOS.toFixed(1)} unit="N/C ĵ" color={COLORS.planos} />
            <ValRow label="E_esfera" value={f.esfera.toFixed(2)}  unit="N/C k̂" color={COLORS.esfera} />
            <ValRow label="E_anillo" value={f.anillo.toFixed(2)}  unit="N/C k̂" color={COLORS.anillo} />
          </div>
          <div className="fs-card fs-card-result">
            <div className="fs-card-title">Campo resultante en P</div>
            <ValRow label="Comp. ĵ"   value={E_PLANOS.toFixed(1)} unit="N/C" />
            <ValRow label="Comp. k̂"   value={f.kComp.toFixed(2)}  unit="N/C" />
            <ValRow label="|E_total|"  value={f.mag.toFixed(2)}    unit="N/C" bold />
          </div>
        </div>
      </div>

      {/* ── Bar chart ────────────────────────────────────────────────────── */}
      <div className="fs-chart-wrap">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={chartData} margin={{ top: 5, right: 24, left: 4, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : String(v)}
              unit=" N/C"
              width={72}
              domain={[0, 5500]}
            />
            <Tooltip
              formatter={val => [`${val.toFixed(2)} N/C`]}
              labelFormatter={name => chartData.find(d => d.name === name)?.label ?? name}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Explanation ──────────────────────────────────────────────────── */}
      <p className="fs-explanation">
        <strong>Principio de superposición:</strong> el campo eléctrico total en un punto
        es la suma vectorial de los campos generados por cada fuente de forma independiente,
        como si las demás no existieran. Aquí los planos contribuyen con una componente{' '}
        <em>ĵ</em> constante (no depende de z); la esfera y el anillo contribuyen en{' '}
        dirección <em>k̂</em> y crecen al acercarse al origen. La magnitud resultante se
        obtiene por Pitágoras: |<strong>E</strong>| = √(E<sub>ĵ</sub>² + E<sub>k̂</sub>²).
      </p>
    </div>
  )
}

function ValRow({ label, value, unit, color, bold }) {
  return (
    <div className="fs-valrow">
      <span className="fs-valrow-label" style={color ? { color } : undefined}>{label}</span>
      <span className={`fs-valrow-num${bold ? ' fs-valrow-bold' : ''}`}>{value}</span>
      <span className="fs-valrow-unit">{unit}</span>
    </div>
  )
}
