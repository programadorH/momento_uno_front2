import { useEffect, useState } from "react";
import { comunidadService } from "../comunidadServicio";

// Migrado de iniciarComunidad() en modulos/comunidad/index.js
function EstadoComunidad() {
  const [estado, setEstado] = useState({ texto: "", esError: false });

  useEffect(() => {
    let vigente = true;
    comunidadService
      .listarTodos()
      .then(() => {
        if (vigente) {
          setEstado({ texto: "Estructura base del módulo comunidad cargada.", esError: false });
        }
      })
      .catch(() => {
        if (vigente) {
          setEstado({ texto: "No fue posible cargar la base de comunidad.", esError: true });
        }
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
