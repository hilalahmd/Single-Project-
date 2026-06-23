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
      
      // Compressed timings: intro fades fast, CTA appears quickly
      // so the hero section resolves in just 20vh of scrolling
      let flashOpacity = 0
      if (p > 0.40 && p < 0.75) {
        flashOpacity = Math.sin(mapRange(p, 0.40, 0.75, 0, Math.PI)) * 0.25
      }

      // --- Direct DOM Manipulation (Zero React Renders) ---
      
      if (introRef.current) {
        // Fades out quickly in the first 25% of scroll
        introRef.current.style.opacity = mapRange(p, 0.05, 0.30, 1, 0)
        introRef.current.style.transform = `translateY(${mapRange(p, 0.05, 0.30, 0, -40)}px) translateZ(0)`
      }

      if (ctaRef.current) {
        // Appears right after intro fades, by 50% of scroll
        ctaRef.current.style.opacity = mapRange(p, 0.35, 0.55, 0, 1)
        ctaRef.current.style.transform = `translateY(${mapRange(p, 0.35, 0.55, 20, 0)}px) translateZ(0)`
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
    <div ref={sectionRef} className="h-[120vh] w-full relative font-['Syne']">
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

        {/* Phase 2: Landing CTA */}
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div ref={ctaRef} className="flex flex-col items-center gap-4 opacity-0 will-change-transform">
            <button 
              onClick={() => navigate('/auth/register')}
              className="pointer-events-auto bg-[#2563EB] text-white px-10 py-5 rounded-full font-[800] text-lg uppercase tracking-[0.05em] hover:bg-white hover:text-[#2563EB] transition-colors hover:scale-105"
              style={{ boxShadow: `0 0 40px rgba(37,99,235,0.6)` }}
            >
              START TRAINING FREE →
            </button>
            <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">
              No credit card required
            </p>
          </div>
        </div>

        {/* White Flash Overlay */}
        <div ref={flashRef} className="absolute inset-0 bg-white z-[60] pointer-events-none opacity-0 will-change-opacity transform-gpu"></div>

      </div>
    </div>
  )
}
