import Modelos3D from './Modelos3D'

/**
 * Header verde compartido por todas las vistas de Comunidad (Célula 6),
 * con los modelos 3D flotando de fondo y la misma altura en escritorio.
 *
 * Uso estándar: pasar `etiqueta`, `icono`, `titulo`, `descripcion` y opcionalmente `aside`
 * (panel de la derecha). Para un diseño propio, pasar `children` en su lugar.
 */
function HeroComunidad({
  etiqueta = 'Sa·zón · Comunidad',
  icono = 'bi-people-fill',
  colorIcono = 'text-emerald-300',
  titulo,
  descripcion,
  aside,
  children,
}) {
  return (
    <header className="relative isolate flex flex-col justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10 lg:min-h-[19.25rem]">
      <div className="absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-28 right-1/4 -z-10 h-56 w-56 rounded-full bg-lime-300/10 blur-2xl" aria-hidden="true" />
      <Modelos3D />

      {children ?? (
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
              <i className={`bi ${icono} ${colorIcono}`} aria-hidden="true"></i>
              {etiqueta}
            </span>
            <h1 className="m-0 mt-4 font-poppins text-3xl font-bold tracking-tight text-white sm:text-4xl">{titulo}</h1>
            {descripcion && (
              <p className="m-0 mt-3 max-w-xl text-sm leading-relaxed text-emerald-50 sm:text-base">{descripcion}</p>
            )}
          </div>
          {aside}
        </div>
      )}
    </header>
  )
}

/** Panel translúcido de la derecha del header, con un número destacado. */
export function PanelDato({ valor, titulo, detalle }) {
  return (
    <div className="flex w-fit shrink-0 items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
      <span className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-white px-2 text-2xl font-bold text-emerald-900">
        {valor}
      </span>
      <span>
        <span className="block text-lg font-bold text-white">{titulo}</span>
        {detalle && <span className="block text-xs text-emerald-100">{detalle}</span>}
      </span>
    </div>
  )
}

export default HeroComunidad
