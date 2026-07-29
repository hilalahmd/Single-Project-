import { useNavigate } from 'react-router-dom'
import { Utensils } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 }
  }
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

const charVariant = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 150, damping: 15 }
  }
}

const AnimatedText = ({ text, className }) => {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={charVariant} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function CinematicHero() {
  const navigate = useNavigate()
  
  return (
    <div className="w-full relative font-['Syne']">
      
      {/* Phase 1: Intro Text */}
      <div className="h-[100dvh] w-full flex flex-col items-center justify-center snap-start relative z-30 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center w-full"
        >
          <h1 className="text-[clamp(2rem,7vw,6rem)] font-[800] text-white tracking-[-0.03em] leading-tight text-center drop-shadow-2xl px-4">
            CONNECT. TRAIN. TRANSFORM.
          </h1>
          <p className="mt-4 text-white text-[0.7rem] font-[800] tracking-[0.3em] uppercase drop-shadow-md">
            India's #1 Live Coaching Platform
          </p>
        </motion.div>
      </div>

      {/* Phase 2: Diet Generator (Animated via Framer Motion) */}
      <div className="h-[100dvh] w-full flex items-center justify-start snap-start relative z-40 shrink-0">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={containerVariant}
        >
          <div className="max-w-3xl drop-shadow-2xl">
             <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 bg-[#5a6b41]/40 border border-[#7a8754]/80 rounded-full px-5 py-2 mb-8 shadow-sm backdrop-blur-sm">
               <span className="text-[#f97316] text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse"></span> Free Tool
               </span>
             </motion.div>
             
             <h2 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black text-white mb-8 font-['Syne'] tracking-tighter leading-[0.95] flex flex-col drop-shadow-xl overflow-hidden">
               <AnimatedText text="Get a Custom" className="block" />
               <AnimatedText text="AI Diet Plan in" className="block" />
               <AnimatedText text="Seconds." className="text-[#F97316] block" />
             </h2>
             
             <motion.p variants={fadeUpVariant} className="text-gray-200 font-medium text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl drop-shadow-md font-['Inter']">
               Not sure where to start? Use our free AI-powered diet generator. Enter your physical metrics and goals, and instantly receive a personalized Indian diet plan. No credit card required.
             </motion.p>
             
             <motion.button 
               variants={fadeUpVariant}
               onClick={() => navigate('/free-diet-plan')}
               className="px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:scale-105 hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-4"
             >
               Try Free Diet Generator <Utensils size={22} className="text-black" />
             </motion.button>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
