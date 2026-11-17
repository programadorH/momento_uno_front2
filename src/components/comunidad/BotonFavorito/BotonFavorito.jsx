import { useFavorito } from "./useFavorito";
import "./BotonFavorito.css";

const CLASE_BASE = "comunidad-btn-favorito";
const CLASE_ACTIVO = "comunidad-btn-favorito--activo";

function BotonFavorito({ idReceta }) {
  const { guardado, bloqueado, mensaje, alternar } = useFavorito(idReceta);

  const clases = guardado ? `${CLASE_BASE} ${CLASE_ACTIVO}` : CLASE_BASE;

  return (
    <div className="comunidad-favorito">
      <button
        type="button"
        className={clases}
        onClick={alternar}
        disabled={bloqueado}
        aria-pressed={guardado}
      >
        <span className="comunidad-btn-favorito__corazon" aria-hidden="true"></span>
        <span className="comunidad-btn-favorito__texto">
          {guardado ? "Guardado" : "Guardar"}
        </span>
      </button>

      <div className="mensaje-estado" role={mensaje.esError ? "alert" : "status"}>
        {mensaje.texto}
      </div>
    </div>
  );
}

export default BotonFavorito;
