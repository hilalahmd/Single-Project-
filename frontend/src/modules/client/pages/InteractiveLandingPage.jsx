import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Camera, Globe } from 'lucide-react'

// Helper to map a value from one range to another, clamped
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  const result = ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  return Math.max(Math.min(result, Math.max(outMin, outMax)), Math.min(outMin, outMax))
}

export default function InteractiveLandingPage() {
  const containerRef = useRef(null)
  const [p, setP] = useState(0) // scroll progress 0 to 1
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const { top, height } = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const maxScroll = height - windowHeight
      let progress = -top / maxScroll
      progress = Math.max(0, Math.min(1, progress))
      setP(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- Animation Calculations ---

  // Athlete Scale (15% to 130% from 0 to 0.85, then settles to 85% at 1.0)
  let athleteScale = 0.15
  if (p < 0.85) {
    athleteScale = mapRange(p, 0, 0.85, 0.15, 1.3)
  } else {
    athleteScale = mapRange(p, 0.85, 1, 1.3, 0.85)
  }

  // Athlete Position Shift (Moves to the side in Phase 5)
  const athleteX = mapRange(p, 0.85, 1, 0, -25) // vw shift

  // Continuous breathing/bobbing loop (independent of scroll)
  const [bobOffset, setBobOffset] = useState(0)
  useEffect(() => {
    let frame
    const animate = () => {
      setBobOffset(Math.sin(Date.now() / 200) * 8) // Quick rigid running bob
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [])

  // Camera Shake (Phase 2, 3, 4) - linked to scroll movement
  const rumbleIntensity = mapRange(p, 0.2, 0.85, 0, 15)
  const rumbleX = Math.sin(p * 2000) * rumbleIntensity
  const rumbleY = Math.cos(p * 2300) * rumbleIntensity

  // Motion Blur & Grain
  const blurAmount = mapRange(p, 0.4, 0.85, 0, 8)
  const grainOpacity = mapRange(p, 0.0, 1.0, 0.05, 0.15) // Increases slightly
  
  // White Flash (Peaks at 0.85)
  let flashOpacity = 0
  if (p > 0.82 && p < 0.88) {
    flashOpacity = p < 0.85 ? mapRange(p, 0.82, 0.85, 0, 1) : mapRange(p, 0.85, 0.88, 1, 0)
  }

  // Orange Bleed (Phase 4)
  const orangeBleed = mapRange(p, 0.6, 0.85, 0, 1)

  // Track perspective
  const trackScaleX = mapRange(p, 0, 0.85, 1, 4)
  const trackScaleY = mapRange(p, 0, 0.85, 1, 2)
  const trackOpacity = mapRange(p, 0.6, 0.85, 1, 0) // Disappears in phase 4

  return (
    <div className="bg-[#07080C] min-h-screen text-white overflow-hidden selection:bg-[#FF4D00] selection:text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
      
      {/* Scroll Container (400vh as requested) */}
      <div ref={containerRef} className="h-[400vh] w-full relative">
        
        {/* Sticky Viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center perspective-[1000px]">
          
          {/* Main Shake Container */}
          <div 
            className="absolute inset-0 w-full h-full will-change-transform"
            style={{ 
              transform: `translate(${rumbleX}px, ${rumbleY}px)`,
              filter: `blur(${blurAmount}px)`
            }}
          >
            
            {/* 1. Track Lines Background */}
            <div 
              className="absolute bottom-0 w-[200%] h-1/2 left-[-50%] transform-gpu transform-origin-top opacity-30"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent 49%, #fff 49.5%, #fff 50.5%, transparent 51%)',
                backgroundSize: '20% 100%',
                transform: `rotateX(80deg) scaleX(${trackScaleX}) scaleY(${trackScaleY})`,
                opacity: trackOpacity * 0.3
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#07080C] to-[#07080C] opacity-90"></div>

            {/* 2. Film Grain Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                opacity: grainOpacity
              }}
            ></div>

            {/* 3. Central Spotlight Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#07080C_90%)] pointer-events-none z-10"></div>

            {/* 4. THE ATHLETE */}
            {/* Using a high-contrast stock photo with mix-blend-mode: screen to simulate a transparent cutout on dark background */}
            <div 
              className="absolute top-1/2 left-1/2 transform-gpu will-change-transform z-20 pointer-events-none"
              style={{ 
                transform: `translate(-50%, -50%) translateX(${athleteX}vw) scale(${athleteScale}) translateY(${bobOffset}px)`,
                width: '600px',
                height: '800px',
              }}
            >
              {/* The Image */}
              <div 
                className="w-full h-full bg-center bg-no-repeat bg-contain"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80')",
                  filter: 'grayscale(100%) contrast(150%) brightness(1.2)',
                  mixBlendMode: 'screen', // Removes black background of stock photo
                  opacity: p > 0.85 ? mapRange(p, 0.85, 0.9, 1, 0.8) : 1 // Slight fade out at end
                }}
              ></div>

              {/* Orange Energy Bleed (Overlay) */}
              <div 
                className="absolute inset-0 bg-[#FF4D00] mix-blend-color z-30"
                style={{ opacity: orangeBleed * 0.8 }}
              ></div>
              <div 
                className="absolute inset-0 shadow-[0_0_100px_50px_#FF4D00] z-0 rounded-full"
                style={{ opacity: orangeBleed * 0.5, mixBlendMode: 'screen' }}
              ></div>
            </div>

            {/* ── PHASE 1: Intro (0 - 0.2) ── */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
              style={{ 
                opacity: mapRange(p, 0.15, 0.2, 1, 0),
                transform: `translateY(${mapRange(p, 0.1, 0.2, 0, -50)}px)`
              }}
            >
              <h1 
                className="text-5vw md:text-[9vw] font-black text-white tracking-[-0.03em] text-center leading-[0.85] w-full px-4 drop-shadow-2xl"
              >
                CONNECT.<br/>TRAIN.<br/>TRANSFORM.
              </h1>
              <p className="mt-6 text-gray-400 text-lg md:text-2xl font-bold tracking-[0.2em] uppercase">
                India's #1 Live Coaching Platform
              </p>
            </div>

            {/* ── PHASE 2: Features (0.2 - 0.4) ── */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-end pb-32 z-30"
              style={{ 
                opacity: mapRange(p, 0.2, 0.25, 0, 1) * mapRange(p, 0.35, 0.4, 1, 0)
              }}
            >
              <div className="flex gap-6 flex-wrap justify-center px-4">
                <div 
                  className="bg-[#111318] border border-gray-800 px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl"
                  style={{ transform: `translateY(${mapRange(p, 0.2, 0.3, 100, 0)}px)` }}
                >
                  <Video className="text-[#FF4D00]" size={20} />
                  <span className="font-bold text-white tracking-wide">Live 1-on-1 Video Training</span>
                </div>
                <div 
                  className="bg-[#111318] border border-gray-800 px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl"
                  style={{ transform: `translateY(${mapRange(p, 0.2, 0.3, 120, 0)}px)` }}
                >
                  <Camera className="text-[#00E5FF]" size={20} />
                  <span className="font-bold text-white tracking-wide">AI Food Photo Analysis</span>
                </div>
                <div 
                  className="bg-[#111318] border border-gray-800 px-6 py-4 rounded-full flex items-center gap-3 shadow-2xl"
                  style={{ transform: `translateY(${mapRange(p, 0.2, 0.3, 140, 0)}px)` }}
                >
                  <Globe className="text-[#FF4D00]" size={20} />
                  <span className="font-bold text-white tracking-wide">Language Matched Coaches</span>
                </div>
              </div>
            </div>

            {/* ── PHASE 3: Stats (0.4 - 0.6) ── */}
            <div 
              className="absolute inset-0 flex items-center justify-between px-[10vw] z-30"
              style={{ 
                opacity: mapRange(p, 0.4, 0.45, 0, 1) * mapRange(p, 0.55, 0.6, 1, 0)
              }}
            >
              <div 
                className="text-left"
                style={{ transform: `translateX(${mapRange(p, 0.4, 0.45, -100, 0)}px)` }}
              >
                <div className="text-[6vw] font-black leading-none text-white drop-shadow-[0_0_30px_#FF4D00]">500+</div>
                <div className="text-xl md:text-2xl font-bold tracking-widest text-[#FF4D00] uppercase mt-2">Certified Trainers</div>
              </div>
              <div 
                className="text-right"
                style={{ transform: `translateX(${mapRange(p, 0.4, 0.45, 100, 0)}px)` }}
              >
                <div className="text-[6vw] font-black leading-none text-white drop-shadow-[0_0_30px_#00E5FF]">10,000+</div>
                <div className="text-xl md:text-2xl font-bold tracking-widest text-[#00E5FF] uppercase mt-2">Active Clients</div>
              </div>
            </div>

            {/* ── PHASE 4: Breakthrough Text (0.6 - 0.85) ── */}
            <div 
              className="absolute inset-0 flex items-center justify-center z-40 mix-blend-difference"
              style={{ 
                opacity: mapRange(p, 0.65, 0.7, 0, 1) * mapRange(p, 0.8, 0.85, 1, 0),
                transform: `scale(${mapRange(p, 0.65, 0.85, 0.8, 1.2)})`
              }}
            >
              <h2 className="text-[7vw] font-black text-white text-center leading-[0.9] tracking-tighter w-full px-4">
                YOUR<br/>TRANSFORMATION<br/>STARTS HERE
              </h2>
            </div>

            {/* ── PHASE 5: CTA Landing (0.85 - 1.0) ── */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
              style={{ 
                opacity: mapRange(p, 0.85, 0.9, 0, 1),
                transform: `translateY(${mapRange(p, 0.85, 0.95, 50, 0)}px)`
              }}
            >
              {/* Positioned on the right side of the athlete */}
              <div className="absolute right-[15vw] top-1/2 -translate-y-1/2">
                <button 
                  onClick={() => navigate('/auth/register')}
                  className="pointer-events-auto px-10 py-5 bg-[#FF4D00] text-black text-xl font-black rounded-full hover:bg-white transition-all shadow-[0_0_40px_rgba(255,77,0,0.35)] hover:shadow-[0_0_60px_#ffffff] hover:scale-105"
                >
                  START TRAINING FREE &rarr;
                </button>
              </div>
            </div>

          </div> {/* End Shake Container */}

          {/* White Flash Overlay (Absolute Top z-max) */}
          <div 
            className="absolute inset-0 bg-white pointer-events-none z-50"
            style={{ opacity: flashOpacity }}
          ></div>

        </div>
      </div>
    </div>
  )
}
