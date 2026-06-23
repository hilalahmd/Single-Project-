import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// High-performance clamp & map functions
const clamp = (val, min, max) => Math.max(min, Math.min(max, val))
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  return clamp(((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin, Math.min(outMin, outMax), Math.max(outMin, outMax))
}

export default function CinematicHero() {
  const navigate = useNavigate()
  
  const sectionRef = useRef(null)
  
  // DOM element refs for direct manipulation (Bypassing React render cycle for 240fps)
  const introRef = useRef(null)
  const pillsRef = useRef(null)
  const breakthroughRef = useRef(null)
  const ctaRef = useRef(null)
  const flashRef = useRef(null)

  useEffect(() => {
    let ticking = false;

    const updateDOM = () => {
      if (!sectionRef.current) {
        ticking = false;
        return;
      }
      
      const { top, height } = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const maxScroll = height - windowHeight
      let p = -top / maxScroll
      p = clamp(p, 0, 1)

      // --- GPU-Only Math Calculations ---
      
      let flashOpacity = 0
      if (p > 0.60 && p < 0.85) {
        flashOpacity = Math.sin(mapRange(p, 0.60, 0.85, 0, Math.PI)) * 0.4
      }

      // --- Direct DOM Manipulation (Zero React Renders) ---
      
      if (introRef.current) {
        introRef.current.style.opacity = mapRange(p, 0.05, 0.15, 1, 0)
        introRef.current.style.transform = `translateY(${mapRange(p, 0.10, 0.20, 0, -30)}px) translateZ(0)`
      }

      if (pillsRef.current) {
        // Appears at 0.15 to 0.25, fades out at 0.50 to 0.60 (stays on screen much longer)
        pillsRef.current.style.opacity = mapRange(p, 0.15, 0.25, 0, 1) * mapRange(p, 0.50, 0.60, 1, 0)
        pillsRef.current.style.transform = `translateY(${mapRange(p, 0.15, 0.25, 50, 0)}px) translateZ(0)`
      }

      if (breakthroughRef.current) {
        // Appears at 0.60 to 0.70, fades out at 0.85 to 0.90
        breakthroughRef.current.style.opacity = mapRange(p, 0.60, 0.70, 0, 1) * mapRange(p, 0.85, 0.90, 1, 0)
        breakthroughRef.current.style.transform = `scale(${mapRange(p, 0.60, 0.85, 0.9, 1.1)}) translateZ(0)`
      }

      if (ctaRef.current) {
        ctaRef.current.style.opacity = mapRange(p, 0.85, 0.90, 0, 1)
        ctaRef.current.style.transform = `translateY(${mapRange(p, 0.85, 0.95, 30, 0)}px) translateZ(0)`
      }

      if (flashRef.current) {
        flashRef.current.style.opacity = flashOpacity
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateDOM);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial paint
    updateDOM()
    
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} className="h-[250vh] w-full relative font-['Syne']">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Phase 1: Intro Text */}
        <div 
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none will-change-transform"
        >
          <h1 className="text-[clamp(2rem,7vw,6rem)] font-[800] text-white tracking-[-0.03em] leading-tight text-center drop-shadow-2xl">
            CONNECT. TRAIN. TRANSFORM.
          </h1>
          <p className="mt-4 text-[#2563EB] text-[0.7rem] font-[800] tracking-[0.3em] uppercase">
            India's #1 Live Coaching Platform
          </p>
        </div>

        {/* Phase 2: Free Diet Plan CTA */}
        <div 
          ref={pillsRef}
          className="absolute bottom-[20vh] left-0 w-full flex flex-col items-center gap-6 z-30 opacity-0 will-change-transform"
        >
          <div className="text-center">
            <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white mb-2 font-['Syne'] tracking-wide drop-shadow-lg">Curious how AI fits your diet?</h3>
            <p className="text-[#00E5FF] text-xs font-bold tracking-[0.2em] uppercase drop-shadow-md">Test it instantly. No credit card required.</p>
          </div>
          <button 
            onClick={() => navigate('/free-diet-plan')}
            className="pointer-events-auto bg-white/5 backdrop-blur-lg border border-white/20 text-white px-10 py-4 rounded-full font-[800] text-sm uppercase tracking-[0.1em] hover:bg-white/15 hover:scale-105 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 flex items-center gap-3"
          >
            Generate Free Diet Plan <span className="text-xl leading-none">&rarr;</span>
          </button>
        </div>

        {/* Phase 4: Breakthrough Text */}
        <div 
          ref={breakthroughRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none opacity-0 will-change-transform"
        >
          <h2 
            className="text-[clamp(2.5rem,7vw,6rem)] font-[800] text-white text-center leading-[0.85] tracking-[-0.03em]"
            style={{ textShadow: `0 0 40px rgba(37,99,235,0.9)` }}
          >
            YOUR TRANSFORMATION<br/>
            <span className="text-[#2563EB]">STARTS HERE</span>
          </h2>
        </div>

        {/* Phase 5: Landing CTA */}
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div ref={ctaRef} className="absolute right-[5vw] md:right-[15vw] opacity-0 will-change-transform">
            <button 
              onClick={() => navigate('/auth/register')}
              className="pointer-events-auto bg-[#2563EB] text-white px-8 py-5 rounded-full font-[800] text-lg uppercase tracking-[0.05em] hover:bg-white hover:text-[#2563EB] transition-colors hover:scale-105"
              style={{ boxShadow: `0 0 40px rgba(37,99,235,0.6)` }}
            >
              START TRAINING FREE &rarr;
            </button>
          </div>
        </div>

        {/* Phase 4: White Flash Overlay */}
        <div ref={flashRef} className="absolute inset-0 bg-white z-[60] pointer-events-none opacity-0 will-change-opacity transform-gpu"></div>

      </div>
    </div>
  )
}
