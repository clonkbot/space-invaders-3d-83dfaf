import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { Suspense, useState, useCallback } from 'react'
import { Game } from './components/Game'
import { HUD } from './components/HUD'
import { StartScreen } from './components/StartScreen'
import { GameOverScreen } from './components/GameOverScreen'

export type GameState = 'start' | 'playing' | 'gameover'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [wave, setWave] = useState(1)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('spaceInvadersHighScore')
    return saved ? parseInt(saved, 10) : 0
  })

  const startGame = useCallback(() => {
    setScore(0)
    setLives(3)
    setWave(1)
    setGameState('playing')
  }, [])

  const endGame = useCallback(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('spaceInvadersHighScore', score.toString())
    }
    setGameState('gameover')
  }, [score, highScore])

  const addScore = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

  const loseLife = useCallback(() => {
    setLives(prev => {
      if (prev <= 1) {
        endGame()
        return 0
      }
      return prev - 1
    })
  }, [endGame])

  const nextWave = useCallback(() => {
    setWave(prev => prev + 1)
  }, [])

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      {/* Main 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 15, 35]} />

        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

          {gameState === 'playing' && (
            <Game
              wave={wave}
              onScore={addScore}
              onLoseLife={loseLife}
              onNextWave={nextWave}
            />
          )}

          {gameState !== 'playing' && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 4}
            />
          )}
        </Suspense>

        <ambientLight intensity={0.15} />
        <pointLight position={[0, 20, 0]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[-10, 10, 10]} intensity={0.3} color="#00ffff" />
      </Canvas>

      {/* UI Overlays */}
      {gameState === 'start' && (
        <StartScreen onStart={startGame} highScore={highScore} />
      )}

      {gameState === 'playing' && (
        <HUD score={score} lives={lives} wave={wave} highScore={highScore} />
      )}

      {gameState === 'gameover' && (
        <GameOverScreen score={score} highScore={highScore} onRestart={startGame} />
      )}

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center z-50 pointer-events-none">
        <p className="text-[10px] md:text-xs text-cyan-500/40 tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}

export default App
