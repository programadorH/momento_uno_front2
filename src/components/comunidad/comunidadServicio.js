
const CONFIG = {
  urlBase: "https://6ada65937512f497b3ffea29.mockapi.io/api/v1",
  rutaFavoritos: "/favoritos",
  claveSesion: "sazon_sesion_activa",
};

export const TIPO_ERROR = {
  CONEXION: "conexion",
  SESION: "sesion",
  SERVIDOR: "servidor",
};

const MENSAJES_ERROR = {
  [TIPO_ERROR.CONEXION]: "Sin conexión con el servidor. Revisa tu internet e intenta de nuevo.",
  [TIPO_ERROR.SESION]: "Tu sesión no es válida. Inicia sesión para guardar favoritos.",
  [TIPO_ERROR.SERVIDOR]: "El servidor no pudo procesar la solicitud. Intenta más tarde.",
};


export class ErrorComunidad extends Error {
  constructor(tipo, causa) {
    super(MENSAJES_ERROR[tipo]);
    this.name = "ErrorComunidad";
    this.tipo = tipo;
    this.cause = causa;
  }
}

function obtenerUsuarioSesion() {
  let sesion;
  try {
    sesion = JSON.parse(localStorage.getItem(CONFIG.claveSesion));
  } catch {
    sesion = null;
  }
  if (!sesion || !Number.isInteger(Number(sesion.id))) {
    throw new ErrorComunidad(TIPO_ERROR.SESION);
  }
  return { ...sesion, id: Number(sesion.id) };
}

async function requestApi(ruta, opciones) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new ErrorComunidad(TIPO_ERROR.CONEXION);
  }

  let respuesta;
  try {
    respuesta = await fetch(CONFIG.urlBase + ruta, opciones);
  } catch (error) {
    
    throw new ErrorComunidad(TIPO_ERROR.CONEXION, error);
  }

  if (respuesta.status === 401 || respuesta.status === 403) {
    throw new ErrorComunidad(TIPO_ERROR.SESION);
  }
  if (!respuesta.ok) {
    throw new ErrorComunidad(TIPO_ERROR.SERVIDOR, respuesta.status);
  }
  return respuesta.status === 204 ? null : respuesta.json();
}


async function buscarFavorito(idUsuario, idReceta) {
  const lista = await requestApi(CONFIG.rutaFavoritos, { method: "GET" });
  return (
    lista.find(
      (item) =>
        Number(item.idUsuario) === idUsuario && Number(item.idReceta) === idReceta
    ) || null
  );
}

function agregarFavorito(idUsuario, idReceta) {
  return requestApi(CONFIG.rutaFavoritos, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario,
      idReceta,
      guardadoEn: new Date().toISOString(),
    }),
  });
}

function eliminarFavorito(idFavorito) {
  return requestApi(`${CONFIG.rutaFavoritos}/${idFavorito}`, { method: "DELETE" });
}

async function listarTodos() {
  return [];
}

/** @returns {Promise<boolean>} true si la receta está en favoritos del usuario en sesión */
async function esFavorito(idReceta) {
  const usuario = obtenerUsuarioSesion();
  const favorito = await buscarFavorito(usuario.id, Number(idReceta));
  return favorito !== null;
}

/**

 * @returns {Promise<boolean>} nuevo estado (true = guardada)
 */
async function alternarFavorito(idReceta) {
  const usuario = obtenerUsuarioSesion();
  const id = Number(idReceta);
  const existente = await buscarFavorito(usuario.id, id);

  if (existente) {
    await eliminarFavorito(existente.id);
    return false;
  }
  await agregarFavorito(usuario.id, id);
  return true;
}

export const comunidadService = {
  listarTodos,
  esFavorito,
  alternarFavorito,
};
