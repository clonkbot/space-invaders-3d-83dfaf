interface HUDProps {
  score: number
  lives: number
  wave: number
  highScore: number
}

export function HUD({ score, lives, wave, highScore }: HUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 md:p-6">
        {/* Score */}
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-2 md:p-4">
          <p className="text-[8px] md:text-xs text-cyan-400/70 mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            SCORE
          </p>
          <p className="text-lg md:text-3xl text-cyan-400 tracking-wider" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {score.toString().padStart(6, '0')}
          </p>
        </div>

        {/* Wave */}
        <div className="bg-black/60 backdrop-blur-sm border border-fuchsia-500/30 rounded-lg p-2 md:p-4 text-center">
          <p className="text-[8px] md:text-xs text-fuchsia-400/70 mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            WAVE
          </p>
          <p className="text-xl md:text-4xl text-fuchsia-400" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {wave}
          </p>
        </div>

        {/* High Score */}
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-2 md:p-4 text-right">
          <p className="text-[8px] md:text-xs text-cyan-400/70 mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            HIGH SCORE
          </p>
          <p className="text-lg md:text-3xl text-cyan-400 tracking-wider" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            {highScore.toString().padStart(6, '0')}
          </p>
        </div>
      </div>

      {/* Lives */}
      <div className="absolute bottom-16 md:bottom-12 left-3 md:left-6">
        <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-2 md:p-4">
          <p className="text-[8px] md:text-xs text-green-400/70 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            SHIPS
          </p>
          <div className="flex gap-1 md:gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 md:w-6 md:h-6 transition-all duration-300 ${
                  i < lives
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                    : 'bg-gray-700'
                }`}
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-16 md:bottom-12 right-3 md:right-6">
        <div className="bg-black/60 backdrop-blur-sm border border-fuchsia-500/30 rounded-lg p-2 md:p-4 text-right">
          <p className="text-[8px] md:text-xs text-fuchsia-400/70" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <span className="hidden md:inline">← → MOVE · SPACE FIRE</span>
            <span className="md:hidden">SWIPE TO MOVE · TAP TO FIRE</span>
          </p>
        </div>
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)',
        }}
      />
    </div>
  )
}
