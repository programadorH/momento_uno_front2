// Servicio del módulo Comunidad (migrado de modulos/comunidad/servicio.js).
// Antes vivía en window.comunidadServicio; ahora se exporta como módulo ES.

const CONFIG = {
  urlBase: "https://6ada65937512f497b3ffea29.mockapi.io/api/v1",
  rutaFavoritos: "/favoritos",
};

async function requestApi(ruta, opciones) {
  const respuesta = await fetch(CONFIG.urlBase + ruta, opciones);
  if (!respuesta.ok) {
    const error = new Error("Error en API de comunidad: " + respuesta.status);
    error.status = respuesta.status;
    throw error;
  }
  if (respuesta.status === 204) {
    return null;
  }
  return respuesta.json();
}

function coincide(favorito, idUsuario, idReceta) {
  return (
    Number(favorito.idUsuario) === Number(idUsuario) &&
    Number(favorito.idReceta) === Number(idReceta)
  );
}

export async function listarTodos() {
  return [];
}

export async function consultarFavorito(idUsuario, idReceta) {
  const filtros = new URLSearchParams({ idUsuario, idReceta });
  try {
    const lista = await requestApi(`${CONFIG.rutaFavoritos}?${filtros}`, {
      method: "GET",
    });
    return lista.find((item) => coincide(item, idUsuario, idReceta)) || null;
  } catch (error) {
    // MockAPI responde 404 cuando el filtro no encuentra resultados.
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function agregarFavorito(idUsuario, idReceta) {
  return requestApi(CONFIG.rutaFavoritos, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario: Number(idUsuario),
      idReceta: Number(idReceta),
      guardadoEn: new Date().toISOString(),
    }),
  });
}

export async function eliminarFavorito(idFavorito) {
  return requestApi(`${CONFIG.rutaFavoritos}/${idFavorito}`, {
    method: "DELETE",
  });
}
