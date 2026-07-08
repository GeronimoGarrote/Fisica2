import { useState, useMemo } from 'react'

const FUND_ITEMS = [
  {
    title: '⚡ ¿Qué es la Carga Eléctrica Q?',
    content: (
      <>
        <p>
          La carga eléctrica es una <strong>propiedad fundamental de la materia</strong>,
          igual que la masa. No se puede ver directamente — se conoce por sus efectos:
          dos cargas interactúan entre sí con fuerzas de atracción o repulsión.
        </p>
        <p>
          Existen dos tipos: <strong>positiva y negativa</strong>. Cargas del mismo signo
          se repelen; de signos opuestos se atraen. La asignación de + y − es convencional.
        </p>
        <p>
          Se mide en <strong>Coulombs (C)</strong>. En este problema, Q no está
          concentrada en un punto sino repartida en el volumen del cascarón dieléctrico
          con densidad ρ(r). Para obtener la carga total hay que integrar:
        </p>
        <p><code>Q_total = ∫∫∫ ρ(r) dV = −1,44π μC ≈ −4,524 μC</code></p>
        <p>
          La carga es negativa porque ρ(r) = −3/r es negativa en todo el cascarón.
        </p>
      </>
    ),
  },
  {
    title: '🔵 ¿Qué es el Campo Eléctrico E?',
    content: (
      <>
        <p>
          Una carga Q modifica el espacio a su alrededor. Esa modificación es el
          <strong> campo eléctrico</strong>: una propiedad del espacio que se manifiesta
          como fuerza cuando se coloca otra carga en ese punto.
        </p>
        <p>
          Definición formal: el campo en un punto r⃗ es la fuerza que experimentaría
          una carga de prueba infinitesimalmente pequeña q, dividida por esa carga:
        </p>
        <p><code>E⃗(r) = lim(q→0)  F⃗ / q</code></p>
        <p>
          Se mide en <strong>N/C</strong> (equivalente a V/m). Es un <strong>vector</strong>:
          tiene módulo y dirección. En este problema, por simetría esférica, siempre
          apunta en dirección radial: hacia afuera (+r̂) si la carga encerrada es positiva,
          hacia adentro (−r̂) si es negativa.
        </p>
        <p>
          Como Q_total es negativa, el campo apunta hacia el origen en todas las zonas
          donde E ≠ 0 — por eso los valores son negativos en las fórmulas.
        </p>
      </>
    ),
  },
  {
    title: '🟢 ¿Qué es el Potencial Eléctrico V?',
    content: (
      <>
        <p>
          El campo eléctrico es conservativo: el trabajo que realiza no depende del
          camino recorrido, solo del punto de partida y llegada. Eso permite definir
          una <strong>energía potencial por unidad de carga</strong>:
        </p>
        <p><code>V(r) = U(r) / q</code></p>
        <p>
          Se mide en <strong>Voltios (V)</strong>. Es un <strong>escalar</strong> (un número,
          no un vector). Su relación con el campo es:
        </p>
        <p><code>E⃗ = −∇V   →   V(r) = −∫ E⃗ · dr⃗</code></p>
        <p>
          En este problema se integra de afuera hacia adentro con referencia V(∞) = 0.
          Dos propiedades clave para el oral:
        </p>
        <p>
          <strong>1)</strong> V es continuo en todo punto del espacio, incluso donde E
          tiene saltos (fronteras del conductor). Un salto en V implicaría trabajo
          infinito para mover una carga una distancia infinitesimal — imposible físicamente.
        </p>
        <p>
          <strong>2)</strong> Donde E = 0, V es constante. Por eso el interior del
          conductor y el vacío central tienen potencial constante.
        </p>
      </>
    ),
  },
  {
    title: '📐 Ley de Gauss: enunciado y cuándo usarla',
    content: (
      <>
        <p>
          La Ley de Gauss relaciona el flujo eléctrico a través de cualquier superficie
          cerrada con la carga encerrada dentro de ella:
        </p>
        <p><code>∮ E⃗ · dA⃗ = Q_enc / ε₀</code></p>
        <p>
          El <strong>flujo eléctrico</strong> es cuántas líneas de campo atraviesan la
          superficie: E⃗ · dA⃗ es el producto escalar entre el campo y el diferencial de
          área (que apunta hacia afuera de la superficie).
        </p>
        <p>
          La ley siempre es válida, pero solo sirve para <strong>calcular E directamente</strong>
          cuando la simetría del sistema garantiza que E es constante y perpendicular en
          toda la superficie gaussiana elegida. En ese caso E sale de la integral:
        </p>
        <p><code>E · ∮ dA = Q_enc / ε₀</code></p>
        <p>
          Las tres simetrías que lo permiten son: esférica (superficie gaussiana = esfera),
          cilíndrica (superficie = cilindro) y planar (superficie = caja/pillbox).
          En este problema usamos simetría esférica.
        </p>
      </>
    ),
  },
  {
    title: '🌐 Simetría esférica: por qué E sale de la integral',
    content: (
      <>
        <p>
          ρ(r) = −3/r depende <em>solo</em> de r, no de los ángulos θ ni φ.
          Eso es simetría esférica perfecta. Sus consecuencias (del material teórico, CAPIT_03):
        </p>
        <p>
          <strong>1)</strong> El campo solo puede tener componente radial:
          <code>E⃗(r) = Eᵣ(r) r̂</code>
          (las componentes angulares se anulan por simetría — cualquier rotación del sistema
          deja el campo igual, por lo que no puede apuntar en ninguna dirección angular preferida).
        </p>
        <p>
          <strong>2)</strong> Eᵣ(r) es igual en todos los puntos de una esfera de radio r.
        </p>
        <p>
          Por eso se elige una superficie gaussiana esférica de radio r: en ella E es
          constante y perpendicular, y puede salir de la integral:
        </p>
        <p><code>Eᵣ(r) · 4πr² = Q_enc(r) / ε₀</code></p>
        <p><code>Eᵣ(r) = k · Q_enc(r) / r²</code></p>
        <p>
          El 4πr² es el área de la esfera gaussiana. No es el elemento de volumen —
          es el área total de la superficie de integración.
        </p>
      </>
    ),
  },
  {
    title: '⚙ Conductor vs Dieléctrico: la diferencia fundamental',
    content: (
      <>
        <p>
          La diferencia es la <strong>movilidad de las cargas</strong>:
        </p>
        <p>
          <strong>Conductor:</strong> tiene cargas libres (electrones de conducción) que
          pueden moverse por todo el material. En equilibrio electrostático, si hubiera
          campo interno, esas cargas se moverían — contradicción. Por lo tanto E = 0
          dentro del conductor en equilibrio. Toda la carga neta queda en las superficies.
        </p>
        <p>
          <strong>Dieléctrico (no conductor):</strong> las cargas están ligadas a sus
          átomos y no pueden moverse libremente. La carga queda atrapada donde está —
          en este problema, distribuida en el volumen con densidad ρ(r). Ningún campo
          externo la desplaza.
        </p>
        <p>
          Consecuencia directa en el problema:
        </p>
        <p><code>Dieléctrico: carga en el volumen → hay que integrar ρ(r)</code></p>
        <p><code>Conductor: E = 0 adentro → carga solo en superficies → σ_c y σ_d</code></p>
      </>
    ),
  },
]

const ACCORDION_ITEMS = [
  {
    title: '⚙ Fundamentos: Ley de Gauss y simetría esférica',
    content: (
      <>
        <p>
          Como ρ depende solo de r, el sistema tiene <strong>simetría esférica perfecta</strong>:
          el campo es puramente radial E⃗ = Eᵣ(r) r̂ y su magnitud es la misma en todos los
          puntos de una esfera de radio r. Esto permite sacar E de la integral de flujo de Gauss:
        </p>
        <p><code>∮ E⃗·dA⃗ = Q_enc/ε₀  →  Eᵣ · 4πr² = Q_enc/ε₀  →  Eᵣ(r) = k·Q_enc(r) / r²</code></p>
        <p>
          La estrategia es siempre la misma: elegir una superficie gaussiana esférica de radio r,
          identificar correctamente la carga encerrada Q_enc, y aplicar la fórmula. El signo de
          Eᵣ indica la dirección: positivo = apunta hacia afuera (r̂), negativo = hacia adentro (−r̂).
        </p>
      </>
    ),
  },
  {
    title: 'Zona 1 (r < Rₐ = 0,5 m): vacío interior — E = 0',
    content: (
      <>
        <p>
          La densidad ρ(r) existe <em>solo</em> entre Rₐ y Rᵦ. Para r &lt; Rₐ, la superficie
          gaussiana no encierra ninguna carga: <code>Q_enc = 0</code>.
        </p>
        <p><code>Eᵣ · 4πr² = 0  →  E⃗ = 0</code></p>
        <p>
          Al ser E = 0 en toda esta región, no hay trabajo por unidad de carga al moverse entre
          dos puntos: el potencial es <strong>constante</strong>. Su valor se obtiene enganchando
          con la Zona 2 en r = Rₐ:
        </p>
        <p><code>V₁ = V₂(Rₐ) = 54000π(0,5 + 0,5) − 72981,8π ≈ −59.633 V</code></p>
      </>
    ),
  },
  {
    title: 'Zona 2 (Rₐ ≤ r ≤ Rᵦ): dentro del dieléctrico — E crece desde 0',
    content: (
      <>
        <p>
          Como ρ(r) = −3×10⁻⁶/r <strong>no es uniforme</strong>, no se puede usar Q = ρ·V.
          Hay que integrar en coordenadas esféricas:
        </p>
        <p><code>Q_enc(r) = ∫ ρ(r')·4πr'² dr'  (de Rₐ a r)</code></p>
        <p><code>= −12π×10⁻⁶ ∫ r' dr'  =  −6π×10⁻⁶ (r² − 0,25)</code></p>
        <p>
          El factor 4πr'² viene del elemento de volumen esférico: dV = r²sinθ dr dθ dϕ,
          integrado en ángulos da 4πr². La r' del denominador de ρ cancela una potencia de r'²,
          dejando solo r' en la integral.
        </p>
        <p>Aplicando Gauss:</p>
        <p><code>Eᵣ(r) = k·Q_enc/r²  =  −54000π (1 − 0,25/r²) N/C</code></p>
        <p>
          Verificación de continuidad: en r = Rₐ, Eᵣ = −54000π(1−1) = 0 ✓ (continuo con Zona 1).
          En r = Rᵦ, Eᵣ ≈ −83.092 N/C (mínimo del sistema).
        </p>
        <p>
          El potencial se obtiene integrando −E₂(r) y enganchando con V₃ en r = Rᵦ:
        </p>
        <p><code>V₂(r) = 54000π (r + 0,25/r) − 72981,8π [V]</code></p>
        <p>
          La primitiva de (1 − a²/r²) es (r + a²/r), de ahí esa forma.
        </p>
      </>
    ),
  },
  {
    title: 'Zona 3 (Rᵦ < r < Rᶜ): vacío entre cascarones — ley 1/r²',
    content: (
      <>
        <p>
          La superficie gaussiana ahora envuelve todo el cascarón dieléctrico.
          Q_enc = Q_total = −1,44π μC (constante, ya no depende de r).
        </p>
        <p><code>Eᵣ(r) = k·Q_total / r²  =  −12960π / r²  N/C</code></p>
        <p>
          El cascarón dieléctrico actúa como si toda su carga estuviera concentrada en el origen
          (consecuencia directa de la simetría esférica + Gauss).
        </p>
        <p>
          El potencial se integra y se engancha con el conductor en r = Rᶜ:
        </p>
        <p><code>V₃(r) = −12960π/r + 2618,2π [V]</code></p>
        <p>
          La constante 2618,2π surge de la condición V₃(Rᶜ) = V₄ (continuidad en la
          frontera con el conductor).
        </p>
      </>
    ),
  },
  {
    title: 'Zona 4 (Rᶜ ≤ r ≤ Rᵈ): conductor — E = 0, densidades superficiales',
    content: (
      <>
        <p>
          En equilibrio electrostático, las cargas libres del conductor se redistribuyen
          hasta que <strong>E = 0 en todo el interior del material</strong>. Aplicando Gauss
          con una superficie dentro del conductor:
        </p>
        <p><code>Q_enc_total = Q_dieléctrico + Q_cara_interior = 0</code></p>
        <p><code>→  Q_cara_interior = −Q_total = +1,44π μC</code></p>
        <p>
          La cara interior se carga positivamente para cancelar el campo del cascarón negativo.
          Como el conductor es neutro globalmente:
        </p>
        <p><code>Q_cara_exterior = −Q_cara_interior = −1,44π μC = Q_total</code></p>
        <p>Las densidades superficiales son:</p>
        <p><code>σ_c = +1,44π×10⁻⁶ / (4π·0,81) = +4/9 μC/m² ≈ +0,444 μC/m²</code></p>
        <p><code>σ_d = −1,44π×10⁻⁶ / (4π·1,21) = −36/121 μC/m² ≈ −0,298 μC/m²</code></p>
        <p>
          Todo el volumen del conductor es un <strong>equipotencial</strong>. Su valor
          se obtiene evaluando V₅ en r = Rᵈ (referencia desde el exterior):
        </p>
        <p><code>V₄ = k·Q_total / Rᵈ = −12960π / 1,1 ≈ −37.014 V</code></p>
      </>
    ),
  },
  {
    title: 'Zona 5 (r > Rᵈ): exterior — misma fórmula que Zona 3',
    content: (
      <>
        <p>
          La superficie gaussiana encierra el dieléctrico <em>y</em> el conductor.
          Como el conductor es <strong>neutro</strong> (Q_conductor = 0):
        </p>
        <p><code>Q_enc = Q_total + Q_conductor = Q_total + 0 = Q_total</code></p>
        <p>
          Por eso las Zonas 3 y 5 tienen exactamente la misma fórmula de E(r).
          Desde el exterior, todo el sistema se ve como una única carga puntual
          Q_total ubicada en el origen.
        </p>
        <p><code>Eᵣ(r) = −12960π / r²  N/C</code></p>
        <p><code>V₅(r) = −12960π / r  [V]  (con V(∞) = 0)</code></p>
        <p>
          Nota: E tiene un <strong>salto</strong> en r = Rᶜ y r = Rᵈ (fronteras del
          conductor, donde existen densidades superficiales σ), pero es
          <strong>continuo</strong> en r = Rₐ y r = Rᵦ (fronteras del dieléctrico,
          sin σ). El potencial V es continuo en todos los puntos.
        </p>
      </>
    ),
  },
]
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
  { mag: 'Q_total del dieléctrico',                       form: 'Q = ∫ ρ(r)·4πr² dr  de Ra a Rb',     val: '−1,44π μC ≈ −4,524 μC' },
  { mag: 'σ_c  cara interior Rc=0,9m',                    form: 'σ = −Q_total / (4πRc²)',              val: '+4/9 μC/m² ≈ +0,444 μC/m²' },
  { mag: 'σ_d  cara exterior Rd=1,1m',                    form: 'σ = Q_total / (4πRd²)',               val: '−36/121 μC/m² ≈ −0,298 μC/m²' },
  { mag: 'E(P1)  |r|=0,7m=Rᵦ (frontera)',                 form: 'E = k·Q_total / Rb²',                val: '−83.092 N/C r̂' },
  { mag: 'V(P1)',                                         form: 'V = k·Q_total·(1/Rd − 1/Rc + 1/Rb)', val: '−49.939 V' },
  { mag: 'E(P2)  (0,−0,7,−0,7)m → |r|≈0,990m — dentro del conductor', form: 'E = 0  (equilibrio electrostático)', val: '0 N/C' },
  { mag: 'V(P2)',                                         form: 'V = k·Q_total / Rd',                  val: '−37.014 V' },
]

const PROC_CARDS = [
  {
    header: 'i) Densidades superficiales de carga en el conductor',
    body: `El primer paso fue calcular la carga total Q_total del cascarón dieléctrico. Como la densidad ρ(r) = −3/r μC/m³ no es uniforme sino que varía con r, no es posible usar Q = ρ·V. Es necesario integrar ρ en todo el volumen del cascarón usando el elemento de volumen en coordenadas esféricas dV = 4πr²dr, que resulta de integrar la parte angular (sen θ dθ dφ) sobre la esfera completa. La integración desde Ra hasta Rb da Q_total = −1,44π μC.

Con Q_total conocido, se aplica la condición de equilibrio electrostático del conductor: el campo eléctrico dentro del material conductor es siempre nulo. Aplicando la Ley de Gauss con una superficie gaussiana esférica sumergida en el material del conductor, la carga total encerrada debe ser cero. Esto obliga a la cara interior (r = Rc) a adquirir una carga inducida de +1,44π μC exacta, que cancela el campo del dieléctrico. Como el conductor es eléctricamente neutro en total, la cara exterior (r = Rd) queda con −1,44π μC. Dividiendo cada carga por el área de su superficie (4πR²) se obtienen σ_c y σ_d.`,
  },
  {
    header: 'ii) Campo eléctrico y potencial en todo el espacio',
    body: `El sistema completo se divide en cinco zonas concéntricas. En cada zona se elige una superficie gaussiana esférica de radio r centrada en el origen. La simetría esférica del sistema (ρ depende solo de r) garantiza que el campo es puramente radial y constante en cada esfera, lo que permite sacarlo de la integral de flujo: Eᵣ(r)·4πr² = Q_enc(r)/ε₀, y despejar Eᵣ(r) = k·Q_enc(r)/r².

En la zona interior (r < Ra) no hay carga encerrada: E = 0. Dentro del dieléctrico (Ra < r < Rb) la carga encerrada crece con r según Q_enc(r) = −6π×10⁻⁶(r²−0,25), dando un campo que parte de cero en Ra y crece hasta su máximo en Rb. En el vacío entre cascarones (Rb < r < Rc) y en el exterior (r > Rd) la carga encerrada es siempre Q_total (el conductor neutro no suma carga neta), por eso ambas zonas tienen la misma fórmula E = k·Q_total/r². Dentro del conductor (Rc < r < Rd) el campo es cero por definición de equilibrio electrostático.

El potencial se obtiene integrando V(r) = −∫E(r)dr en cada zona, tomando V(∞) = 0 como referencia. La constante de integración que aparece en cada zona se determina por continuidad: el potencial no puede tener saltos en ningún punto del espacio, porque eso implicaría trabajo infinito para desplazar una carga una distancia infinitesimal. Se engancha de afuera hacia adentro: V₅ fija V₄ (el conductor es equipotencial), V₄ fija la constante de V₃, V₃ fija la de V₂, y V₂ evaluado en Ra da el potencial constante de V₁.`,
  },
  {
    header: 'iii) Gráficos de Eᵣ(r) y V(r)',
    body: `Los gráficos se construyen evaluando las mismas fórmulas del punto ii en un rango continuo de r entre 0 y 1,5 m. El gráfico del campo muestra discontinuidades de salto finito exclusivamente en r = Rc = 0,9 m y r = Rd = 1,1 m, que son las fronteras del conductor donde existen densidades superficiales de carga concentradas (σ_c y σ_d). En cambio, las fronteras del dieléctrico (r = Ra y r = Rb) muestran una transición estrictamente continua, porque la carga está distribuida en el volumen sin ninguna concentración superficial. El gráfico del potencial es globalmente continuo en todo el dominio: V nunca tiene saltos, aunque E sí los tenga.`,
  },
  {
    header: 'iv) Evaluación en los puntos P1 y P2',
    body: `Para evaluar el campo y el potencial en un punto dado, el primer paso siempre es calcular su módulo radial |r⃗| = √(x²+y²+z²) e identificar en qué zona cae ese valor.

P1 tiene |r| = 700 mm = 0,7 m, que coincide exactamente con Rb, el borde exterior del dieléctrico. Como en esa frontera no hay carga superficial (la carga es volumétrica), el campo es continuo: puede calcularse con la fórmula de zona 2 o zona 3 y el resultado es el mismo. Se obtiene E(P1) = −83.092 N/C r̂ y V(P1) = −49.939 V.

P2 = (0, −0,7, −0,7) m requiere calcular el módulo: |r⃗| = √(0²+0,49+0,49) = √0,98 ≈ 0,990 m. Este valor cae estrictamente dentro del intervalo 0,9 m < r < 1,1 m, es decir, en el interior del conductor. Por lo tanto E(P2) = 0 directamente por equilibrio electrostático, y V(P2) = −37.014 V igual al potencial del conductor, que es constante en todo su volumen.`,
  },
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

const ZONE_FORMULAS = {
  1: { E: 'E(r) = 0', V: 'V(r) = −18981,8π ≈ −59.633 V  (constante)' },
  2: { E: 'E(r) = −54000π (1 − 0,25/r²)  N/C', V: 'V(r) = 54000π (r + 0,25/r) − 72981,8π  V' },
  3: { E: 'E(r) = −12960π / r²  N/C', V: 'V(r) = −12960π/r + 2618,2π  V' },
  4: { E: 'E(r) = 0  (conductor en equilibrio)', V: 'V(r) = −11781,8π ≈ −37.014 V  (constante)' },
  5: { E: 'E(r) = −12960π / r²  N/C', V: 'V(r) = −12960π / r  V' },
}

export default function ConductoresConcentricos() {
  const [r, setR] = useState(0.8)
  const [openItem, setOpenItem] = useState(null)
  const toggle = (i) => setOpenItem(prev => prev === i ? null : i)
  const [openFund, setOpenFund] = useState(null)
  const toggleFund = (i) => setOpenFund(prev => prev === i ? null : i)
  const [openProc, setOpenProc] = useState(null)

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
            <div className="fs-card-title">Fórmula activa</div>
            <div className="cc2-formula">{ZONE_FORMULAS[zone.num].E}</div>
            <div className="cc2-formula cc2-formula--spaced">{ZONE_FORMULAS[zone.num].V}</div>
          </div>
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
          <colgroup>
            <col style={{ width: '35%' }} />
            <col style={{ width: '38%' }} />
            <col style={{ width: '27%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Magnitud</th>
              <th>Fórmula utilizada</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {RESULTADOS.map(({ mag, form, val }) => (
              <tr key={mag}>
                <td>{mag}</td>
                <td className="cc-table-formula">{form}</td>
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

      {/* ── Procedimiento por punto ───────────────────────────────────────── */}
      <h3 className="cc2-section-title">Procedimiento por punto</h3>
      <div className="cc2-accordion">
        {PROC_CARDS.map((card, i) => (
          <div key={i} className="cc2-accordion-item">
            <button
              className="cc2-accordion-header cc2-accordion-header--proc"
              onClick={() => setOpenProc(prev => prev === i ? null : i)}
            >
              <span>{card.header}</span>
              <span className="cc2-chevron">{openProc === i ? '▼' : '▶'}</span>
            </button>
            {openProc === i && (
              <div className="cc2-accordion-body">
                {card.body.split('\n\n').map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Conceptos Fundamentales ──────────────────────────────────────── */}
      <h3 className="cc2-section-title">Conceptos fundamentales</h3>
      <div className="cc2-accordion">
        {FUND_ITEMS.map((item, i) => (
          <div key={i} className="cc2-accordion-item">
            <button
              className="cc2-accordion-header cc2-accordion-header--fund"
              onClick={() => toggleFund(i)}
            >
              <span>{item.title}</span>
              <span className="cc2-chevron">{openFund === i ? '▼' : '▶'}</span>
            </button>
            {openFund === i && (
              <div className="cc2-accordion-body">{item.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Accordion ────────────────────────────────────────────────────── */}
      <h3 className="cc2-section-title">Justificación de las fórmulas</h3>
      <div className="cc2-accordion">
        {ACCORDION_ITEMS.map((item, i) => (
          <div key={i} className="cc2-accordion-item">
            <button className="cc2-accordion-header" onClick={() => toggle(i)}>
              <span>{item.title}</span>
              <span className="cc2-chevron">{openItem === i ? '▼' : '▶'}</span>
            </button>
            {openItem === i && (
              <div className="cc2-accordion-body">{item.content}</div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
