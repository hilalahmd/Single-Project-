import { useEffect, useRef } from 'react'
import LottieReact from 'lottie-react'
const Lottie = LottieReact.default || LottieReact
import runningAthleteAnimation from '../../../assets/running_athlete.json'

// High-performance clamp & map functions
const clamp = (val, min, max) => Math.max(min, Math.min(max, val))
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  return clamp(((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin, Math.min(outMin, outMax), Math.max(outMin, outMax))
}

export default function CinematicHero() {
  const sectionRef = useRef(null)
  
  // DOM element refs for direct manipulation (Bypassing React render cycle for 240fps)
  const introRef = useRef(null)
  const flashRef = useRef(null)
  const runnerRef = useRef(null)

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
        introRef.current.style.transform = `translate3d(0, ${mapRange(p, 0.05, 0.30, 0, -40)}px, 0)`
      }

      if (flashRef.current) {
        flashRef.current.style.opacity = flashOpacity
      }

      if (runnerRef.current) {
        // Runner runs away: shrinks and moves up as you scroll down
        const scale = mapRange(p, 0, 1, 1.2, 0.2) // Starts slightly large, gets small
        const translateY = mapRange(p, 0, 1, 100, -200) // Starts low, moves high up
        const opacity = mapRange(p, 0.6, 1, 0.8, 0) // Fades out at the very end
        
        runnerRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
        runnerRef.current.style.opacity = opacity
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
    <div ref={sectionRef} className="h-screen w-full relative font-['Syne']">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Sportsman Running Effect - mix-blend-screen overridden to normal in index.css for light theme */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{ perspective: '1000px' }}
        >
          <div 
            ref={runnerRef}
            className="w-[30vw] min-w-[300px] will-change-transform transform-gpu origin-bottom opacity-80 mix-blend-screen drop-shadow-[0_0_50px_rgba(37,99,235,0.3)]"
          >
            <Lottie animationData={runningAthleteAnimation} loop={true} />
          </div>
        </div>

        {/* Phase 1: Intro Text */}
        <div 
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none will-change-transform transform-gpu"
        >
          <h1 className="text-[clamp(2rem,7vw,6rem)] font-[800] text-white tracking-[-0.03em] leading-tight text-center drop-shadow-2xl">
            CONNECT. TRAIN. TRANSFORM.
          </h1>
          <p className="mt-4 text-[#2563EB] text-[0.7rem] font-[800] tracking-[0.3em] uppercase">
            India's #1 Live Coaching Platform
          </p>
        </div>

        {/* White Flash Overlay */}
        <div ref={flashRef} className="absolute inset-0 bg-white z-[60] pointer-events-none opacity-0 will-change-opacity transform-gpu"></div>

      </div>
    </div>
  )
}

