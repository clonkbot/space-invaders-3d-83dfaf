import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function GameFloor() {
  const gridRef = useRef<THREE.GridHelper>(null!)

  useFrame((state) => {
    if (gridRef.current) {
      // Scroll the grid to create motion effect
      gridRef.current.position.z = (state.clock.getElapsedTime() * 2) % 2
    }
  })

  return (
    <group>
      {/* Main floor plane with gradient */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#0a0a20"
          metalness={0.8}
          roughness={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        ref={gridRef}
        args={[40, 40, '#ff00ff', '#00ffff']}
        position={[0, -0.49, 0]}
      />

      {/* Side barriers - left */}
      <mesh position={[-10, 1, 0]}>
        <boxGeometry args={[0.2, 3, 30]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Side barriers - right */}
      <mesh position={[10, 1, 0]}>
        <boxGeometry args={[0.2, 3, 30]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Back barrier */}
      <mesh position={[0, 1, -15]}>
        <boxGeometry args={[20, 3, 0.2]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Decorative corner lights */}
      {[[-9, -14], [9, -14], [-9, 10], [9, 10]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
              emissive={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight
            color={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
            intensity={0.5}
            distance={5}
            position={[0, 1.5, 0]}
          />
        </group>
      ))}
    </group>
  )
}
