import "../../../assets/estilos.css";
import HeroComunidad, { PanelDato } from "../../hero/HeroComunidad";
import EstadoComunidad from "../../comunidad/EstadoComunidad/EstadoComunidad";
import CalificacionEstrellas from "../../comunidad/CalificacionEstrellas/CalificacionEstrellas";
import BotonFavorito from "../../comunidad/BotonFavorito/BotonFavorito";

function Valoracion() {
  return (
    <section className="contenedor pagina-modulo">
      <HeroComunidad
        icono="bi-star-fill"
        colorIcono="text-amber-300"
        titulo="Valoraciones de la comunidad"
        descripcion="Califica las recetas, guarda tus favoritas y ayuda a otros cocineros a encontrar lo mejor de Sa·zón."
        aside={<PanelDato valor="10" titulo="Ingredientes" detalle="flotando en 3D" />}
      />

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
