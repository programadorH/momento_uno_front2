import { lazy, Suspense } from 'react'

// three.js se carga aparte para no aumentar el peso inicial de la página
const HeroFlotante = lazy(() => import('./HeroFlotante'))

/**
 * Fondo de modelos 3D flotando. Se coloca dentro de un contenedor con
 * `relative isolate overflow-hidden` (por ejemplo, los headers verdes de Comunidad).
 */
function Modelos3D() {
  return (
    <Suspense fallback={null}>
      <HeroFlotante />
    </Suspense>
  )
}

export default Modelos3D
