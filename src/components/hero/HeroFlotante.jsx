import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import { Vector3 } from 'three'

// Modelos exportados desde Blender (ver public/models/CREDITS.md)
const MODELOS = [
  'tomate', 'aguacate', 'sarten', 'cuchara', 'pan',
  'huevo', 'limon', 'olla', 'aji', 'batidor',
].map((nombre) => `/models/${nombre}.glb`)

MODELOS.forEach((url) => useGLTF.preload(url))

const INTERVALO_CAMBIO_MS = 1500

// Configuración fija de cada "hueco" del hero. Se genera una sola vez, fuera del render.
// x e y van normalizados (-1 a 1) y se escalan al tamaño visible del canvas.
const HUECOS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  // La raíz cuadrada carga los objetos hacia la derecha para no tapar el texto
  x: -0.6 + 1.55 * Math.sqrt(Math.random()),
  y: Math.random() * 2 - 1,
  z: -Math.random() * 2,
  eje: new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
  velocidad: 0.3 + Math.random() * 0.6,
  escala: 0.9 + Math.random() * 0.6,
  fase: Math.random() * Math.PI * 2,
}))

function usePrefiereMenosMovimiento() {
  const [reducido, setReducido] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const alCambiar = (evento) => setReducido(evento.matches)
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  return reducido
}

function ObjetoFlotante({ url, hueco, animado }) {
  const ref = useRef()
  const { scene } = useGLTF(url)
  const modelo = useMemo(() => scene.clone(true), [scene])
  const { viewport } = useThree()

  const posicion = [
    hueco.x * (viewport.width / 2) * 0.95,
    hueco.y * (viewport.height / 2) * 0.85,
    hueco.z,
  ]

  useFrame((state, delta) => {
    const objeto = ref.current
    if (!objeto) return

    // Aparece creciendo desde 0 cada vez que se monta (al intercambiarse)
    const escalaActual = objeto.scale.x + (hueco.escala - objeto.scale.x) * Math.min(1, delta * 6)
    objeto.scale.setScalar(escalaActual)

    if (!animado) return
    objeto.rotateOnAxis(hueco.eje, hueco.velocidad * delta)
    objeto.position.y = posicion[1] + Math.sin(state.clock.elapsedTime * 0.8 + hueco.fase) * 0.15
  })

  return (
    <primitive
      ref={ref}
      object={modelo}
      position={posicion}
      rotation={[hueco.fase, hueco.fase * 0.5, 0]}
      scale={animado ? 0 : hueco.escala}
    />
  )
}

export default function HeroFlotante() {
  const reducido = usePrefiereMenosMovimiento()
  const [asignados, setAsignados] = useState(() => HUECOS.map((_, i) => i % MODELOS.length))

  // Cada cierto tiempo, un hueco al azar cambia su objeto por otro distinto
  useEffect(() => {
    if (reducido) return undefined
    const temporizador = setInterval(() => {
      setAsignados((previos) => {
        const siguientes = [...previos]
        const hueco = Math.floor(Math.random() * siguientes.length)
        const salto = 1 + Math.floor(Math.random() * (MODELOS.length - 1))
        siguientes[hueco] = (siguientes[hueco] + salto) % MODELOS.length
        return siguientes
      })
    }, INTERVALO_CAMBIO_MS)
    return () => clearInterval(temporizador)
  }, [reducido])

  return (
    <>
    {/* -z-10: queda detrás del contenido del header (que usa `isolate`) pero sobre su fondo */}
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        frameloop={reducido ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 5]} intensity={1.4} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          {HUECOS.map((hueco) => (
            <ObjetoFlotante
              key={`${hueco.id}-${asignados[hueco.id]}`}
              url={MODELOS[asignados[hueco.id]]}
              hueco={hueco}
              animado={!reducido}
            />
          ))}
        </Suspense>
      </Canvas>
      {/* Degradado a la izquierda para que el texto siga siendo legible sobre los objetos */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/40 to-transparent" />
    </div>
    <a
      href="https://poly.pizza"
      target="_blank"
      rel="noreferrer"
      className="absolute bottom-2 right-4 text-[10px] text-emerald-100/60 transition-opacity hover:text-emerald-50"
    >
      Modelos 3D: Poly Pizza · huevo por sirkitree y ají por jeremy (CC-BY 3.0)
    </a>
    </>
  )
}
