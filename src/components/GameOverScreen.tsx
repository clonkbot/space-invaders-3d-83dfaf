import { useState, useEffect } from 'react'

interface GameOverScreenProps {
  score: number
  highScore: number
  onRestart: () => void
}

export function GameOverScreen({ score, highScore, onRestart }: GameOverScreenProps) {
  const [visible, setVisible] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const isNewHighScore = score >= highScore && score > 0

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setShowButton(true), 1500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 via-black/90 to-black/95" />

      {/* Glitch lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-red-500/30"
            style={{
              top: `${20 + i * 15}%`,
              left: '-100%',
              right: '-100%',
              animation: `glitch ${0.5 + i * 0.2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Game Over */}
        <h1
          className="text-4xl md:text-7xl lg:text-8xl text-red-500 mb-6 md:mb-8 animate-pulse"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
          }}
        >
          GAME OVER
        </h1>

        {/* New high score badge */}
        {isNewHighScore && (
          <div
            className="inline-block px-4 py-2 md:px-6 md:py-3 mb-6 md:mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg animate-bounce"
            style={{
              boxShadow: '0 0 30px rgba(255, 200, 0, 0.5)',
            }}
          >
            <p className="text-xs md:text-sm text-black font-bold" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              NEW HIGH SCORE!
            </p>
          </div>
        )}

        {/* Score display */}
        <div className="mb-6 md:mb-10">
          <p className="text-xs md:text-sm text-cyan-400/70 mb-2 md:mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            FINAL SCORE
          </p>
          <p
            className="text-3xl md:text-5xl lg:text-6xl text-cyan-400"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            }}
          >
            {score.toString().padStart(6, '0')}
          </p>
        </div>

        {/* High score */}
        <div className="mb-8 md:mb-12">
          <p className="text-xs md:text-sm text-fuchsia-400/70 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            HIGH SCORE
          </p>
          <p
            className="text-xl md:text-3xl text-fuchsia-400"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              textShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
            }}
          >
            {highScore.toString().padStart(6, '0')}
          </p>
        </div>

        {/* Restart button */}
        <button
          onClick={onRestart}
          className={`group relative px-6 py-3 md:px-10 md:py-5 transition-all duration-500 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg opacity-75 group-hover:opacity-100 blur-sm transition-opacity" />
          <div className="absolute inset-0 bg-black rounded-lg" />
          <div className="absolute inset-[2px] bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-lg border border-red-500/50 group-hover:border-orange-500/50 transition-colors" />
          <span
            className="relative text-sm md:text-lg text-red-400 group-hover:text-orange-400 transition-colors"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            PLAY AGAIN
          </span>
        </button>

        {/* Insert coin text */}
        <p
          className={`mt-6 md:mt-8 text-[10px] md:text-xs text-red-400/50 transition-all duration-500 delay-500 ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            animation: 'blink 1s ease-in-out infinite',
          }}
        >
          INSERT COIN TO CONTINUE
        </p>
      </div>

      {/* Decorative corners */}
      <div className="absolute inset-4 md:inset-8 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 md:w-16 h-8 md:h-16 border-t-2 border-l-2 border-red-500/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 md:w-16 h-8 md:h-16 border-t-2 border-r-2 border-orange-500/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 md:w-16 h-8 md:h-16 border-b-2 border-l-2 border-orange-500/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 md:w-16 h-8 md:h-16 border-b-2 border-r-2 border-red-500/50 rounded-br-lg" />
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)',
        }}
      />

      <style>{`
        @keyframes glitch {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
