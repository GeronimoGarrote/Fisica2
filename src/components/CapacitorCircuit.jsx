import { useState } from 'react'
import './CapacitorCircuit.css'

// ── Shared constants ─────────────────────────────────────────────────────────
const PW = 7   // plate half-gap  (px)
const PH = 16  // plate half-extent (px)
const W_CLR = '#2c2c2c'
const C_CLR = '#1a237e'
const NEW_CLR = '#b71c1c'   // color for newly combined capacitors

// Horizontal capacitor: vertical plates, current flows left↔right.
function HCap({ cx, cy, label, value, flip = false, color = C_CLR }) {
  const valueY = flip ? cy - PH - 19 : cy + PH + 13
  return (
    <g>
      <line x1={cx - PW} y1={cy - PH} x2={cx - PW} y2={cy + PH}
            stroke={color} strokeWidth={3} />
      <line x1={cx + PW} y1={cy - PH} x2={cx + PW} y2={cy + PH}
            stroke={color} strokeWidth={3} />
      <text x={cx} y={cy - PH - 5} textAnchor="middle"
            fontSize={11} fontWeight="700" fill={color}>{label}</text>
      {value && (
        <text x={cx} y={valueY} textAnchor="middle" fontSize={9} fill="#777">{value}</text>
      )}
    </g>
  )
}

// Vertical capacitor: horizontal plates, current flows top↕bottom.
function VCap({ cx, cy, label, value, color = C_CLR }) {
  return (
    <g>
      <line x1={cx - PH} y1={cy - PW} x2={cx + PH} y2={cy - PW}
            stroke={color} strokeWidth={3} />
      <line x1={cx - PH} y1={cy + PW} x2={cx + PH} y2={cy + PW}
            stroke={color} strokeWidth={3} />
      <text x={cx + PH + 7} y={cy + 5}
            fontSize={11} fontWeight="700" fill={color}>{label}</text>
      {value && (
        <text x={cx + PH + 7} y={cy + 19} fontSize={9} fill="#777">{value}</text>
      )}
    </g>
  )
}

function Dot({ x, y }) {
  return <circle cx={x} cy={y} r={3.5} fill={W_CLR} />
}

function W({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={W_CLR} strokeWidth={2} />
}

const CAP_DATA = [
  { name: 'C1',   q: '15.62', v: '5.21', u: '40.70'  },
  { name: 'C2',   q: '6.51',  v: '3.25', u: '10.60'  },
  { name: 'C3',   q: '6.51',  v: '1.30', u: '4.24'   },
  { name: 'C4',   q: '15.62', v: '2.23', u: '17.42'  },
  { name: 'C5',   q: '4.55',  v: '4.55', u: '10.39'  },
  { name: 'C6',   q: '4.55',  v: '4.55', u: '10.39'  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function CapacitorCircuit() {
  const [step, setStep] = useState(0)
  const [showTable, setShowTable] = useState(false)

  function reset() {
    setStep(0)
    setShowTable(false)
  }

  // ── Coordinate map ──────────────────────────────────────────────────────────
  const yTop = 52
  const yBot = 222
  const xBat = 38
  const srcCy = Math.round((yTop + yBot) / 2)   // 137
  const xRL = 158, xRR = 378
  const xB1 = 213, xB2 = 283, xB3 = 353
  const c2cy = 107, c3cy = 167
  const midY = Math.round((yTop + yBot) / 2)     // 137

  // Step 2: C2356 placed at center of the rail span
  const xC2356 = Math.round((xRL + xRR) / 2)     // 268

  return (
    <div className="cc-root">
      <h2>Circuito de Capacitores</h2>

      <p className="cc-intro">
        Para hallar la capacidad equivalente, identificamos qué capacitores están
        en serie (comparten la misma carga) y cuáles en paralelo (comparten el
        mismo voltaje), y los combinamos de adentro hacia afuera.
      </p>

      <div className="cc-diagram-row">
      <div className="cc-left-col">
      <svg width={422} height={248} className="cc-svg">

        {/* ═══ Battery (always visible) ══════════════════════════════════════ */}
        <circle cx={xBat} cy={srcCy} r={22}
                fill="white" stroke="#1a237e" strokeWidth={2} />
        <text x={xBat} y={srcCy - 7}
              textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1a237e">+</text>
        <text x={xBat} y={srcCy + 12}
              textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1a237e">−</text>
        <text x={xBat + 28} y={srcCy + 5}
              textAnchor="start" fontSize={11} fontWeight="600" fill="#1a237e">12V</text>
        <W x1={xBat} y1={yTop}       x2={xBat} y2={srcCy - 22} />
        <W x1={xBat} y1={srcCy + 22} x2={xBat} y2={yBot} />

        {/* ═══ STEP 0 & 1 & 2: C1 on top wire, C4 on bottom wire ════════════ */}
        {step < 3 && (
          <>
            {/* C1: top wire */}
            <W x1={xBat} y1={yTop} x2={91}  y2={yTop} />
            <W x1={105}  y1={yTop} x2={xRL} y2={yTop} />
            <HCap cx={98} cy={yTop} label="C1" value="3 μF" />

            {/* C4: bottom wire */}
            <W x1={xBat} y1={yBot} x2={91}  y2={yBot} />
            <W x1={105}  y1={yBot} x2={xRL} y2={yBot} />
            <HCap cx={98} cy={yBot} label="C4" value="7 μF" flip />

            {/* Top and bottom rails */}
            <W x1={xRL} y1={yTop} x2={xRR} y2={yTop} />
            <W x1={xRL} y1={yBot} x2={xRR} y2={yBot} />
          </>
        )}

        {/* ═══ STEP 3: CEQ replaces everything ══════════════════════════════ */}
        {step === 3 && (
          <>
            {/* Top wire with CEQ */}
            <W x1={xBat} y1={yTop} x2={91}  y2={yTop} />
            <W x1={105}  y1={yTop} x2={xRR} y2={yTop} />
            <HCap cx={98} cy={yTop} label="CEQ" value="≈ 1.30 μF" color={NEW_CLR} />
            {/* Right side closing wire */}
            <W x1={xRR} y1={yTop} x2={xRR} y2={yBot} />
            {/* Bottom wire (no C4) */}
            <W x1={xBat} y1={yBot} x2={xRR} y2={yBot} />
          </>
        )}

        {/* ═══ STEP 0: All three original branches ══════════════════════════ */}
        {step === 0 && (
          <>
            {/* Branch 1: C2 series C3 */}
            <W x1={xB1} y1={yTop}      x2={xB1} y2={c2cy - PW} />
            <W x1={xB1} y1={c2cy + PW} x2={xB1} y2={c3cy - PW} />
            <W x1={xB1} y1={c3cy + PW} x2={xB1} y2={yBot} />
            <VCap cx={xB1} cy={c2cy} label="C2" value="2 μF" />
            <VCap cx={xB1} cy={c3cy} label="C3" value="5 μF" />

            {/* Branch 2: C6 */}
            <W x1={xB2} y1={yTop}      x2={xB2} y2={midY - PW} />
            <W x1={xB2} y1={midY + PW} x2={xB2} y2={yBot} />
            <VCap cx={xB2} cy={midY} label="C6" value="1 μF" />

            {/* Branch 3: C5 */}
            <W x1={xB3} y1={yTop}      x2={xB3} y2={midY - PW} />
            <W x1={xB3} y1={midY + PW} x2={xB3} y2={yBot} />
            <VCap cx={xB3} cy={midY} label="C5" value="1 μF" />

            <Dot x={xB1} y={yTop} />
            <Dot x={xB2} y={yTop} />
            <Dot x={xB3} y={yTop} />
          </>
        )}

        {/* ═══ STEP 1: C23 in branch 1, C5 and C6 unchanged ════════════════ */}
        {step === 1 && (
          <>
            {/* Branch 1: C23 (combined) */}
            <W x1={xB1} y1={yTop}      x2={xB1} y2={midY - PW} />
            <W x1={xB1} y1={midY + PW} x2={xB1} y2={yBot} />
            <VCap cx={xB1} cy={midY} label="C23" value="≈ 1.43 μF" color={NEW_CLR} />

            {/* Branch 2: C6 */}
            <W x1={xB2} y1={yTop}      x2={xB2} y2={midY - PW} />
            <W x1={xB2} y1={midY + PW} x2={xB2} y2={yBot} />
            <VCap cx={xB2} cy={midY} label="C6" value="1 μF" />

            {/* Branch 3: C5 */}
            <W x1={xB3} y1={yTop}      x2={xB3} y2={midY - PW} />
            <W x1={xB3} y1={midY + PW} x2={xB3} y2={yBot} />
            <VCap cx={xB3} cy={midY} label="C5" value="1 μF" />

            <Dot x={xB1} y={yTop} />
            <Dot x={xB2} y={yTop} />
            <Dot x={xB3} y={yTop} />
          </>
        )}

        {/* ═══ STEP 2: C2356 single branch, C1 and C4 unchanged ════════════ */}
        {step === 2 && (
          <>
            <W x1={xC2356} y1={yTop}      x2={xC2356} y2={midY - PW} />
            <W x1={xC2356} y1={midY + PW} x2={xC2356} y2={yBot} />
            <VCap cx={xC2356} cy={midY} label="C2356" value="≈ 3.43 μF" color={NEW_CLR} />
            <Dot x={xC2356} y={yTop} />
          </>
        )}

      </svg>

      {/* ── Buttons (left column, below SVG) ──────────────────────────────── */}
      <div className="cc-btn-col">
        <button className="tab-btn" onClick={() => setStep(1)} disabled={step !== 0}>
          Combinar C2+C3 → C23
        </button>
        <button className="tab-btn" onClick={() => setStep(2)} disabled={step !== 1}>
          Combinar C23+C5+C6 → C2356
        </button>
        <button className="tab-btn" onClick={() => setStep(3)} disabled={step !== 2}>
          Combinar C1+C2356+C4 → CEQ
        </button>
        {step === 3 ? (
          <button className="tab-btn" onClick={() => setShowTable(t => !t)}>
            {showTable ? 'Ocultar valores' : 'Calcular valores individuales'}
          </button>
        ) : (
          <span />
        )}
        <button className="tab-btn" onClick={reset} disabled={step === 0}>
          Reiniciar
        </button>
      </div>

      {/* ── Values table (step 3 only) ──────────────────────────────────────── */}
      {step === 3 && showTable && (
        <div className="cc-table-wrap">
          <table className="cc-table">
            <thead>
              <tr>
                <th>Capacitor</th>
                <th>Carga (μC)</th>
                <th>Voltaje (V)</th>
                <th>Energía (μJ)</th>
              </tr>
            </thead>
            <tbody>
              {CAP_DATA.map(({ name, q, v, u }) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{q}</td>
                  <td>{v}</td>
                  <td>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>{/* end cc-left-col */}

      {/* ── Calculation panel ──────────────────────────────────────────────── */}
      {step >= 1 && (
        <div className="cc-calc-panel">
          {step >= 1 && (
            <div className="cc-calc-step">
              <span className="cc-calc-label">Paso 1 · Serie C2–C3</span>
              <p className="cc-calc-why">
                C2 y C3 están conectados uno después del otro en el mismo camino
                (en serie), así que se suman sus inversas.
              </p>
              <p>
                1/C<sub>23</sub> = 1/C<sub>2</sub> + 1/C<sub>3</sub> = 1/2 + 1/5 = 7/10
              </p>
              <p className="cc-calc-result">
                C<sub>23</sub> = 10/7 ≈ <strong>1.43 μF</strong>
              </p>
            </div>
          )}
          {step >= 2 && (
            <div className="cc-calc-step">
              <span className="cc-calc-label">Paso 2 · Paralelo C23–C5–C6</span>
              <p className="cc-calc-why">
                C23, C5 y C6 quedan conectados entre los mismos dos nodos
                (en paralelo), así que sus capacidades se suman directamente.
              </p>
              <p>
                C<sub>2356</sub> = C<sub>23</sub> + C<sub>5</sub> + C<sub>6</sub> = 10/7 + 1 + 1 = 24/7
              </p>
              <p className="cc-calc-result">
                C<sub>2356</sub> ≈ <strong>3.43 μF</strong>
              </p>
            </div>
          )}
          {step >= 3 && (
            <div className="cc-calc-step">
              <span className="cc-calc-label">Paso 3 · Serie C1–C2356–C4</span>
              <p className="cc-calc-why">
                C1, C2356 y C4 forman ahora el único camino entre los bornes de
                la fuente (en serie), así que volvemos a sumar inversas.
              </p>
              <p>
                1/C<sub>EQ</sub> = 1/C<sub>1</sub> + 1/C<sub>2356</sub> + 1/C<sub>4</sub>
              </p>
              <p>
                = 1/3 + 7/24 + 1/7 = 56/168 + 49/168 + 24/168 = 129/168
              </p>
              <p>
                C<sub>EQ</sub> = 168/129 = 56/43
              </p>
              <p className="cc-calc-result">
                C<sub>EQ</sub> ≈ <strong>1.30 μF</strong>
              </p>
            </div>
          )}
          {step >= 3 && showTable && (
            <div className="cc-calc-step cc-verify-card">
              <span className="cc-calc-label">Verificación de consistencia</span>
              <p className="cc-check">V<sub>1</sub> + V<sub>2356</sub> + V<sub>4</sub> = 12 V ✓</p>
              <p className="cc-check">ΣU ≈ 93.7 μJ = ½·C<sub>EQ</sub>·V² ✓</p>
              <p className="cc-verify-note">
                Estos dos chequeos confirman que los cálculos son correctos: la suma
                de voltajes en la rama serie debe igualar el voltaje de la fuente, y
                la energía total debe coincidir con la fórmula global ½CV².
              </p>
            </div>
          )}
        </div>
      )}
      </div>{/* end cc-diagram-row */}
    </div>
  )
}
