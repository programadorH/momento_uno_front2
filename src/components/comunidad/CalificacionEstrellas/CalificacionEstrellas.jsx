import { useState } from "react";
import "./CalificacionEstrellas.css";

const VALORES = [1, 2, 3, 4, 5];

function etiqueta(valor) {
  return `Calificar con ${valor} ${valor === 1 ? "estrella" : "estrellas"}`;
}

function CalificacionEstrellas() {
  const [calificacion, setCalificacion] = useState(0);

  return (
    <section className="bloque-modulo valoracion" aria-labelledby="valoracion-titulo">
      <h2 id="valoracion-titulo">Califica esta receta</h2>

      <div className="estrellas" role="group" aria-label="Calificación de la receta">
        {VALORES.map((valor) => (
          <button
            key={valor}
            type="button"
            className={valor <= calificacion ? "estrella activa" : "estrella"}
            aria-label={etiqueta(valor)}
            onClick={() => setCalificacion(valor)}
          >
            <span className="estrella-icono" aria-hidden="true">★</span>
          </button>
        ))}
      </div>

      <p className="puntuacion" aria-live="polite">
        {calificacion ? `${calificacion} de 5` : "Sin calificar"}
      </p>
    </section>
  );
}

export default CalificacionEstrellas;
