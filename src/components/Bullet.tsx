import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BulletProps {
  position: [number, number, number]
  isEnemy: boolean
}

export function Bullet({ position, isEnemy }: BulletProps) {
  const trailRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (trailRef.current) {
      trailRef.current.scale.y = 1 + Math.sin(time * 20) * 0.3
    }
  })

  const color = isEnemy ? '#ff3333' : '#00ffff'
  const emissiveColor = isEnemy ? '#ff0000' : '#00ffff'

  return (
    <group position={position}>
      {/* Main bullet */}
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Trail */}
      <mesh ref={trailRef} position={[0, 0, isEnemy ? -0.3 : 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 0.5, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>

      {/* Glow */}
      <pointLight color={emissiveColor} intensity={1} distance={2} />
    </group>
  )
}
