import { useState } from 'react'
import './Flashcards.css'

const flashcards = [
  { tema: "1b", pregunta: "¿Por qué pueden sumar los campos de los planos, la esfera y el anillo como si fueran independientes?", respuesta: "Por el principio de superposición: el campo eléctrico es lineal, así que el campo total en un punto es la suma vectorial de los campos que generaría cada distribución de carga por separado, como si las otras no existieran." },
  { tema: "1b", pregunta: "¿Por qué el campo entre los dos planos es σ/ε₀ y no σ/(2ε₀)?", respuesta: "Un solo plano infinito genera σ/(2ε₀). Con dos planos enfrentados de cargas opuestas, en la región entre ambos los dos campos apuntan igual y se suman: σ/(2ε₀)+σ/(2ε₀)=σ/ε₀." },
  { tema: "1b", pregunta: "¿Por qué usan k̂ para la esfera y el anillo, y no la fórmula vectorial completa?", respuesta: "Porque P1 y P2 están sobre el eje de simetría (Z) de la esfera y el anillo, así que ahí 'r' coincide con 'z' y el versor r̂ coincide con k̂." },
  { tema: "1b", pregunta: "¿Por qué la fuerza sobre el electrón es opuesta al campo?", respuesta: "Porque F=qE, y la carga del electrón es negativa: la fuerza apunta exactamente al revés de donde apunta el campo." },
  { tema: "1b", pregunta: "¿Por qué ΔV_planos=0 en el cálculo del trabajo?", respuesta: "El campo de los planos es horizontal y el desplazamiento de P1 a P2 es vertical. Son perpendiculares, entonces ese campo no hace trabajo: el eje Z es equipotencial respecto a los planos." },
  { tema: "1b", pregunta: "¿Por qué el trabajo externo da negativo?", respuesta: "Porque P2 tiene mayor potencial que P1, y el electrón 'quiere' ir naturalmente hacia ahí. El agente externo no empuja, frena la carga para que no acelere: frenar en la dirección del movimiento es trabajo negativo." },
  { tema: "1b", pregunta: "¿De dónde sale la relación W_ext = q·ΔV?", respuesta: "De combinar ΔU=q·ΔV (definición de diferencia de potencial) con W_ext=ΔU (el trabajo externo a velocidad constante se almacena como energía potencial)." },
  { tema: "1c", pregunta: "¿Por qué en serie se suman las inversas de C y en paralelo se suman directamente?", respuesta: "En serie todos acumulan la misma carga y el voltaje se reparte entre ellos → 1/Ceq=Σ1/C. En paralelo todos tienen el mismo voltaje y la carga se reparte → Ceq=ΣC." },
  { tema: "1c", pregunta: "¿Por qué C1, C4 y C2356 tienen la misma carga?", respuesta: "Porque están en serie: forman el único camino desde la fuente, y en serie la carga que atraviesa un capacitor es la misma que atraviesa el siguiente." },
  { tema: "1c", pregunta: "¿Por qué C5, C6 y C23 tienen el mismo voltaje?", respuesta: "Porque están en paralelo, conectados entre los mismos dos nodos del circuito, y dos puntos del circuito tienen un único valor de potencial." },
  { tema: "1c", pregunta: "¿Qué significa físicamente U=½QV?", respuesta: "Es la energía almacenada en el campo eléctrico del capacitor: el trabajo que costó cargarlo hasta V (no cuesta lo mismo el primer culombio que el último, por eso ½ y no QV directo)." },
  { tema: "1c", pregunta: "¿Cómo verifican que los resultados están bien?", respuesta: "Dos chequeos: (1) la suma de voltajes en la rama serie debe dar el voltaje de la fuente (V1+V2356+V4=12V); (2) la suma de todas las energías debe igualar ½·Ceq·V²." },
]

export default function Flashcards() {
  const [index, setIndex]     = useState(0)
  const [flipped, setFlipped] = useState(false)

  const total = flashcards.length
  const card  = flashcards[index]

  function goTo(next) {
    setFlipped(false)
    setTimeout(() => setIndex(next), 150)
  }

  return (
    <div className="fc-root">
      <h2>Flashcards de Repaso</h2>

      <p className="fc-counter">Tarjeta {index + 1} de {total}</p>

      <div
        className={`fc-scene${flipped ? ' fc-scene--flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
      >
        <div className="fc-card">
          <div className="fc-face fc-front">
            <span className="fc-tema">Tema {card.tema}</span>
            <p className="fc-text">{card.pregunta}</p>
            <span className="fc-hint">Clic para ver respuesta →</span>
          </div>
          <div className="fc-face fc-back">
            <span className="fc-tema">Tema {card.tema}</span>
            <p className="fc-text">{card.respuesta}</p>
            <span className="fc-hint">← Clic para volver</span>
          </div>
        </div>
      </div>

      <div className="fc-nav">
        <button
          className="tab-btn"
          onClick={() => goTo((index - 1 + total) % total)}
        >
          ← Anterior
        </button>
        <button
          className="tab-btn"
          onClick={() => goTo((index + 1) % total)}
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}
