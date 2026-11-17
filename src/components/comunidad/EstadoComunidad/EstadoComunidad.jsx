import { useEffect, useState } from "react";
import { listarTodos } from "../comunidadServicio";

// Migrado de iniciarComunidad() en modulos/comunidad/index.js
function EstadoComunidad() {
  const [estado, setEstado] = useState({ texto: "", esError: false });

  useEffect(() => {
    let vigente = true;
    listarTodos()
      .then(() => {
        if (vigente) {
          setEstado({ texto: "Estructura base del módulo comunidad cargada.", esError: false });
        }
      })
      .catch((error) => {
        if (vigente) {
          setEstado({ texto: "No fue posible cargar la base de comunidad.", esError: true });
        }
        console.error(error);
      });
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <section className="bloque-modulo">
      <h1>Módulo Comunidad</h1>
      <p>Base lista para desarrollar historias de usuario de comunidad.</p>
      <div className="mensaje-estado" role={estado.esError ? "alert" : "status"}>
        {estado.texto}
      </div>
    </section>
  );
}

export default EstadoComunidad;
