import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface InvaderProps {
  position: [number, number, number]
  type: 'basic' | 'advanced' | 'elite'
  health: number
}

export function Invader({ position, type, health }: InvaderProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const colors = {
    basic: { main: '#00ff00', glow: '#00ff00' },
    advanced: { main: '#00ffff', glow: '#00ffff' },
    elite: { main: '#ff00ff', glow: '#ff00ff' }
  }

  const color = colors[type]
  const maxHealth = type === 'elite' ? 3 : type === 'advanced' ? 2 : 1
  const damageFlash = health < maxHealth

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Hovering animation
      groupRef.current.position.y = position[1] + Math.sin(time * 3 + position[0]) * 0.1
      // Slight rotation
      groupRef.current.rotation.y = Math.sin(time * 2) * 0.2
      groupRef.current.rotation.z = Math.sin(time * 2.5 + position[0]) * 0.1
    }
  })

  if (type === 'elite') {
    return (
      <group ref={groupRef} position={position}>
        {/* Elite - Skull-like appearance */}
        <mesh>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={damageFlash ? '#ff3333' : color.main}
            emissive={color.glow}
            emissiveIntensity={0.8}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.4]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.2, 0.1, 0.4]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Horns */}
        <mesh position={[-0.4, 0.4, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.1, 0.4, 4]} />
          <meshStandardMaterial color={color.main} emissive={color.glow} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.4, 0.4, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.1, 0.4, 4]} />
          <meshStandardMaterial color={color.main} emissive={color.glow} emissiveIntensity={0.5} />
        </mesh>
        <pointLight color={color.glow} intensity={0.5} distance={2} />
      </group>
    )
  }

  if (type === 'advanced') {
    return (
      <group ref={groupRef} position={position}>
        {/* Advanced - Crab-like */}
        <mesh>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={damageFlash ? '#ff3333' : color.main}
            emissive={color.glow}
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        {/* Claws */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshStandardMaterial color={color.main} emissive={color.glow} emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshStandardMaterial color={color.main} emissive={color.glow} emissiveIntensity={0.4} />
        </mesh>
        {/* Eye */}
        <mesh position={[0, 0.2, 0.3]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        <pointLight color={color.glow} intensity={0.3} distance={1.5} />
      </group>
    )
  }

  // Basic invader - Classic squid-like
  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[0.6, 0.4, 0.4]} />
        <meshStandardMaterial
          color={damageFlash ? '#ff3333' : color.main}
          emissive={color.glow}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      {/* Tentacles */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.3, 6]} />
          <meshStandardMaterial color={color.main} emissive={color.glow} emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Eyes */}
      <mesh position={[-0.15, 0.05, 0.21]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 0.05, 0.21]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight color={color.glow} intensity={0.2} distance={1} />
    </group>
  )
}
