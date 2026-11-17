import "../../../assets/estilos.css";
import EstadoComunidad from "../../comunidad/EstadoComunidad/EstadoComunidad";
import CalificacionEstrellas from "../../comunidad/CalificacionEstrellas/CalificacionEstrellas";
import BotonFavorito from "../../comunidad/BotonFavorito/BotonFavorito";

function Valoracion() {
  return (
    <section className="contenedor pagina-modulo">
      <EstadoComunidad />

      <CalificacionEstrellas />

      <section className="bloque-modulo" aria-labelledby="favorito-titulo">
        <h2 id="favorito-titulo">Favoritos</h2>
        <BotonFavorito idReceta={3} />
      </section>
    </section>
  );
}

export default Valoracion;
