import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ExplosionProps {
  position: [number, number, number]
  color: string
}

export function Explosion({ position, color }: ExplosionProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const startTime = useRef(Date.now())

  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      direction: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 1.5,
        (Math.random() - 0.5) * 2
      ).normalize(),
      speed: 0.5 + Math.random() * 0.5,
      size: 0.1 + Math.random() * 0.15
    }))
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    const elapsed = (Date.now() - startTime.current) / 1000
    const progress = Math.min(elapsed / 0.8, 1)

    groupRef.current.children.forEach((child, i) => {
      const particle = particles[i]
      if (particle && child instanceof THREE.Mesh) {
        const pos = particle.direction.clone().multiplyScalar(elapsed * particle.speed * 3)
        child.position.copy(pos)
        child.scale.setScalar(particle.size * (1 - progress * 0.8))
        if (child.material instanceof THREE.MeshBasicMaterial) {
          child.material.opacity = 1 - progress
        }
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {particles.map((particle) => (
        <mesh key={particle.id}>
          <dodecahedronGeometry args={[particle.size, 0]} />
          <meshBasicMaterial color={color} transparent opacity={1} />
        </mesh>
      ))}
      <pointLight color={color} intensity={3} distance={5} decay={2} />
    </group>
  )
}
