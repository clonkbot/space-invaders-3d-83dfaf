import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Player } from './Player'
import { Invader } from './Invader'
import { Bullet } from './Bullet'
import { Explosion } from './Explosion'
import { GameFloor } from './GameFloor'

interface GameProps {
  wave: number
  onScore: (points: number) => void
  onLoseLife: () => void
  onNextWave: () => void
}

interface InvaderData {
  id: string
  position: [number, number, number]
  type: 'basic' | 'advanced' | 'elite'
  health: number
}

interface BulletData {
  id: string
  position: [number, number, number]
  velocity: [number, number, number]
  isEnemy: boolean
}

interface ExplosionData {
  id: string
  position: [number, number, number]
  color: string
}

export function Game({ wave, onScore, onLoseLife, onNextWave }: GameProps) {
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0.5, 8])
  const [invaders, setInvaders] = useState<InvaderData[]>([])
  const [bullets, setBullets] = useState<BulletData[]>([])
  const [explosions, setExplosions] = useState<ExplosionData[]>([])
  const [invaderDirection, setInvaderDirection] = useState(1)
  const [canShoot, setCanShoot] = useState(true)

  const keysPressed = useRef<Set<string>>(new Set())
  const lastInvaderMove = useRef(0)
  const lastEnemyShot = useRef(0)
  const { viewport, size } = useThree()

  // Initialize invaders for current wave
  useEffect(() => {
    const newInvaders: InvaderData[] = []
    const rows = Math.min(3 + Math.floor(wave / 2), 5)
    const cols = Math.min(6 + wave, 11)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const type = row === 0 ? 'elite' : row < 2 ? 'advanced' : 'basic'
        newInvaders.push({
          id: `invader-${row}-${col}`,
          position: [(col - (cols - 1) / 2) * 1.5, 0.5, (row - rows) * 1.2 - 2],
          type,
          health: type === 'elite' ? 3 : type === 'advanced' ? 2 : 1
        })
      }
    }
    setInvaders(newInvaders)
    setInvaderDirection(1)
  }, [wave])

  // Check for wave completion
  useEffect(() => {
    if (invaders.length === 0 && wave > 0) {
      const timer = setTimeout(() => {
        onNextWave()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [invaders.length, wave, onNextWave])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase())
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault()
        shoot()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [canShoot])

  // Touch controls
  useEffect(() => {
    let touchStartX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touchX = e.touches[0].clientX
      const deltaX = (touchX - touchStartX) / size.width
      setPlayerPosition(prev => {
        const newX = Math.max(-8, Math.min(8, prev[0] + deltaX * 15))
        return [newX, prev[1], prev[2]]
      })
      touchStartX = touchX
    }

    const handleTouchEnd = () => {
      shoot()
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [size.width, canShoot])

  const shoot = useCallback(() => {
    if (!canShoot) return
    setCanShoot(false)

    setBullets(prev => [...prev, {
      id: `bullet-${Date.now()}`,
      position: [...playerPosition] as [number, number, number],
      velocity: [0, 0, -0.5],
      isEnemy: false
    }])

    setTimeout(() => setCanShoot(true), 250)
  }, [canShoot, playerPosition])

  const addExplosion = useCallback((position: [number, number, number], color: string) => {
    const id = `explosion-${Date.now()}-${Math.random()}`
    setExplosions(prev => [...prev, { id, position, color }])
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== id))
    }, 800)
  }, [])

  // Game loop
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Player movement
    const moveSpeed = 10 * delta
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      setPlayerPosition(prev => [Math.max(-8, prev[0] - moveSpeed), prev[1], prev[2]])
    }
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      setPlayerPosition(prev => [Math.min(8, prev[0] + moveSpeed), prev[1], prev[2]])
    }

    // Move invaders
    const invaderSpeed = 0.8 - Math.min(wave * 0.05, 0.4)
    if (time - lastInvaderMove.current > invaderSpeed) {
      lastInvaderMove.current = time

      setInvaders(prev => {
        let needsDirectionChange = false
        const moved = prev.map(inv => {
          const newX = inv.position[0] + invaderDirection * 0.3
          if (Math.abs(newX) > 8) needsDirectionChange = true
          return inv
        })

        if (needsDirectionChange) {
          setInvaderDirection(d => -d)
          return prev.map(inv => ({
            ...inv,
            position: [inv.position[0], inv.position[1], inv.position[2] + 0.5] as [number, number, number]
          }))
        }

        return prev.map(inv => ({
          ...inv,
          position: [inv.position[0] + invaderDirection * 0.3, inv.position[1], inv.position[2]] as [number, number, number]
        }))
      })
    }

    // Enemy shooting
    const shootInterval = Math.max(1.5 - wave * 0.1, 0.5)
    if (time - lastEnemyShot.current > shootInterval && invaders.length > 0) {
      lastEnemyShot.current = time
      const shooter = invaders[Math.floor(Math.random() * invaders.length)]
      setBullets(prev => [...prev, {
        id: `enemy-bullet-${Date.now()}`,
        position: [...shooter.position] as [number, number, number],
        velocity: [0, 0, 0.3],
        isEnemy: true
      }])
    }

    // Update bullets
    setBullets(prev => {
      const updated: BulletData[] = []

      for (const bullet of prev) {
        const newPos: [number, number, number] = [
          bullet.position[0] + bullet.velocity[0],
          bullet.position[1] + bullet.velocity[1],
          bullet.position[2] + bullet.velocity[2]
        ]

        // Out of bounds
        if (newPos[2] < -15 || newPos[2] > 15) continue

        // Check collisions
        let hit = false

        if (!bullet.isEnemy) {
          // Player bullet vs invaders
          for (const inv of invaders) {
            const dist = Math.sqrt(
              Math.pow(newPos[0] - inv.position[0], 2) +
              Math.pow(newPos[2] - inv.position[2], 2)
            )
            if (dist < 0.8) {
              hit = true
              setInvaders(prevInv => {
                const target = prevInv.find(i => i.id === inv.id)
                if (!target) return prevInv

                if (target.health <= 1) {
                  const points = target.type === 'elite' ? 100 : target.type === 'advanced' ? 50 : 25
                  onScore(points)
                  addExplosion(target.position, target.type === 'elite' ? '#ff00ff' : target.type === 'advanced' ? '#00ffff' : '#00ff00')
                  return prevInv.filter(i => i.id !== inv.id)
                }

                return prevInv.map(i =>
                  i.id === inv.id ? { ...i, health: i.health - 1 } : i
                )
              })
              break
            }
          }
        } else {
          // Enemy bullet vs player
          const playerDist = Math.sqrt(
            Math.pow(newPos[0] - playerPosition[0], 2) +
            Math.pow(newPos[2] - playerPosition[2], 2)
          )
          if (playerDist < 1) {
            hit = true
            onLoseLife()
            addExplosion(playerPosition, '#ff3333')
          }
        }

        if (!hit) {
          updated.push({ ...bullet, position: newPos })
        }
      }

      return updated
    })

    // Check if invaders reached player
    for (const inv of invaders) {
      if (inv.position[2] > 6) {
        onLoseLife()
        addExplosion(playerPosition, '#ff3333')
        break
      }
    }
  })

  return (
    <group>
      <GameFloor />

      <Player position={playerPosition} />

      {invaders.map(inv => (
        <Invader
          key={inv.id}
          position={inv.position}
          type={inv.type}
          health={inv.health}
        />
      ))}

      {bullets.map(bullet => (
        <Bullet
          key={bullet.id}
          position={bullet.position}
          isEnemy={bullet.isEnemy}
        />
      ))}

      {explosions.map(exp => (
        <Explosion
          key={exp.id}
          position={exp.position}
          color={exp.color}
        />
      ))}
    </group>
  )
}
