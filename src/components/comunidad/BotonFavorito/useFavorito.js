import { useEffect, useState } from "react";
import { comunidadService, ErrorComunidad } from "../comunidadServicio";

const SIN_MENSAJE = { texto: "", esError: false };
const ERROR_GENERICO = "Ocurrió un error inesperado. Intenta de nuevo.";

function mensajeDeError(error) {
  return {
    texto: error instanceof ErrorComunidad ? error.message : ERROR_GENERICO,
    esError: true,
  };
}


export function useFavorito(idReceta) {
  const idValido = Number.isInteger(idReceta);

  const [guardado, setGuardado] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(idValido);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(SIN_MENSAJE);

 
  useEffect(() => {
    if (!idValido) return;
    let vigente = true;

    comunidadService
      .esFavorito(idReceta)
      .then((esFav) => {
        if (vigente) setGuardado(esFav);
      })
      .catch((error) => {
        if (vigente) setMensaje(mensajeDeError(error));
      })
      .finally(() => {
        if (vigente) setCargandoInicial(false);
      });

    return () => {
      vigente = false;
    };
  }, [idReceta, idValido]);

  const alternar = async () => {
    if (procesando || !idValido) return;

    const estadoAnterior = guardado;
   
    setGuardado(!estadoAnterior);
    setProcesando(true);
    setMensaje(SIN_MENSAJE);

    try {
      const nuevoEstado = await comunidadService.alternarFavorito(idReceta);
      setGuardado(nuevoEstado);
      setMensaje({
        texto: nuevoEstado
          ? "Receta guardada en tus favoritos."
          : "Receta quitada de tus favoritos.",
        esError: false,
      });
    } catch (error) {
      
      setGuardado(estadoAnterior);
      setMensaje(mensajeDeError(error));
    } finally {
      setProcesando(false);
    }
  };

  if (!idValido) {
    return {
      guardado: false,
      bloqueado: true,
      mensaje: { texto: "La receta indicada no es válida.", esError: true },
      alternar,
    };
  }

  return {
    guardado,
    bloqueado: cargandoInicial || procesando,
    mensaje,
    alternar,
  };
}
