import { useState, useEffect } from 'react'

interface StartScreenProps {
  onStart: () => void
  highScore: number
}

export function StartScreen({ onStart, highScore }: StartScreenProps) {
  const [visible, setVisible] = useState(false)
  const [showPress, setShowPress] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => setShowPress(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/30 to-black/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Title */}
        <div className="mb-8 md:mb-12">
          <h1
            className="text-3xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 mb-4 animate-pulse"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              textShadow: '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)',
            }}
          >
            SPACE
          </h1>
          <h1
            className="text-3xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              textShadow: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.1)',
            }}
          >
            INVADERS
          </h1>
        </div>

        {/* Decorative line */}
        <div className="w-48 md:w-64 h-1 mx-auto mb-8 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* High score */}
        {highScore > 0 && (
          <div className="mb-8">
            <p className="text-xs md:text-sm text-fuchsia-400/70 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              HIGH SCORE
            </p>
            <p className="text-xl md:text-3xl text-fuchsia-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              {highScore.toString().padStart(6, '0')}
            </p>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={onStart}
          className={`group relative px-8 py-4 md:px-12 md:py-6 transition-all duration-300 ${
            showPress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg opacity-75 group-hover:opacity-100 blur-sm transition-opacity" />
          <div className="absolute inset-0 bg-black rounded-lg" />
          <div className="absolute inset-[2px] bg-gradient-to-r from-cyan-900/50 to-fuchsia-900/50 rounded-lg border border-cyan-500/50 group-hover:border-fuchsia-500/50 transition-colors" />
          <span
            className="relative text-sm md:text-lg text-cyan-400 group-hover:text-fuchsia-400 transition-colors"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            START GAME
          </span>
        </button>

        {/* Controls info */}
        <div
          className={`mt-8 md:mt-12 transition-all duration-500 delay-300 ${
            showPress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-[10px] md:text-xs text-cyan-400/50 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            CONTROLS
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-center text-[10px] md:text-xs text-fuchsia-400/70" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <span className="hidden md:inline">← → or A/D to MOVE</span>
            <span className="hidden md:inline">SPACE or ↑ to FIRE</span>
            <span className="md:hidden">SWIPE to MOVE</span>
            <span className="md:hidden">TAP to FIRE</span>
          </div>
        </div>

        {/* Point values */}
        <div
          className={`mt-6 md:mt-8 grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto transition-all duration-500 delay-500 ${
            showPress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-black/50 border border-green-500/30 rounded p-2 md:p-3">
            <div className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 bg-green-500" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
            <p className="text-[10px] md:text-xs text-green-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>25</p>
          </div>
          <div className="bg-black/50 border border-cyan-500/30 rounded p-2 md:p-3">
            <div className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 bg-cyan-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <p className="text-[10px] md:text-xs text-cyan-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>50</p>
          </div>
          <div className="bg-black/50 border border-fuchsia-500/30 rounded p-2 md:p-3">
            <div className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 bg-fuchsia-500 rounded-full" />
            <p className="text-[10px] md:text-xs text-fuchsia-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>100</p>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-4 md:inset-8 border border-cyan-500/20 rounded-lg pointer-events-none">
        <div className="absolute top-0 left-0 w-8 md:w-16 h-8 md:h-16 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 md:w-16 h-8 md:h-16 border-t-2 border-r-2 border-fuchsia-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 md:w-16 h-8 md:h-16 border-b-2 border-l-2 border-fuchsia-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 md:w-16 h-8 md:h-16 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)',
        }}
      />
    </div>
  )
}
