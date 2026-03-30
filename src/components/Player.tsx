import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshWobbleMaterial } from '@react-three/drei'

interface PlayerProps {
  position: [number, number, number]
}

export function Player({ position }: PlayerProps) {
  const glowRef = useRef<THREE.Mesh>(null!)
  const engineRef = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 8) * 0.1)
    }
    if (engineRef.current) {
      engineRef.current.intensity = 2 + Math.sin(time * 15) * 0.5
    }
  })

  return (
    <group position={position}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[1.2, 0.3, 1.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.25, -0.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wings */}
      <mesh position={[-0.8, 0, 0.2]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial
          color="#0088ff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.8, 0, 0.2]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial
          color="#0088ff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Engine glow */}
      <mesh ref={glowRef} position={[0, 0, 0.9]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.8} />
      </mesh>
      <pointLight ref={engineRef} position={[0, 0, 1]} color="#ff6600" intensity={2} distance={3} />

      {/* Weapon tips */}
      <mesh position={[-0.5, 0.1, -0.6]}>
        <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.5, 0.1, -0.6]}>
        <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}
