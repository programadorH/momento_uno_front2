import { useEffect, useState } from "react";
import {
  consultarFavorito,
  agregarFavorito,
  eliminarFavorito,
} from "../comunidadServicio";

const SIN_MENSAJE = { texto: "", esError: false };

// Estado del botón de favorito conectado al servicio de Comunidad.
export function useFavorito(idUsuario, idReceta) {
  const idsValidos = Number.isInteger(idUsuario) && Number.isInteger(idReceta);

  const [favorito, setFavorito] = useState(null);
  const [cargando, setCargando] = useState(idsValidos);
  const [mensaje, setMensaje] = useState(SIN_MENSAJE);

  useEffect(() => {
    if (!idsValidos) {
      return;
    }
    let vigente = true;

    consultarFavorito(idUsuario, idReceta)
      .then((encontrado) => {
        if (vigente) setFavorito(encontrado);
      })
      .catch((error) => {
        if (vigente) {
          setMensaje({ texto: "No fue posible consultar tus favoritos.", esError: true });
        }
        console.error(error);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [idUsuario, idReceta, idsValidos]);

  const alternar = async () => {
    setCargando(true);
    try {
      if (favorito === null) {
        const nuevo = await agregarFavorito(idUsuario, idReceta);
        setFavorito(nuevo);
        setMensaje({ texto: "Receta guardada en tus favoritos.", esError: false });
      } else {
        await eliminarFavorito(favorito.id);
        setFavorito(null);
        setMensaje({ texto: "Receta quitada de tus favoritos.", esError: false });
      }
    } catch (error) {
      setMensaje({
        texto: "No fue posible actualizar tus favoritos. Intenta de nuevo.",
        esError: true,
      });
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  if (!idsValidos) {
    return {
      guardado: false,
      cargando: true,
      mensaje: { texto: "Los datos del botón de favorito no son válidos.", esError: true },
      alternar,
    };
  }

  return { guardado: favorito !== null, cargando, mensaje, alternar };
}
