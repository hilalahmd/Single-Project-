import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import { 
  Clock, UtensilsCrossed, Users, Video, Camera, 
  TrendingUp, MessageCircle, Utensils, BarChart2, Star, Check 
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import API from '../../../shared/utils/api'

let hasAnimatedIntro = false;

const AnimatedHeroText = ({ lines, subtext, subtextClassName, className, enforceOnce = false }) => {
  const INITIAL_PAUSE = 1.0;
  const STAGGER_DELAY = 0.05;
  const shouldAnimate = !enforceOnce || !hasAnimatedIntro;
  
  let maxWordLen = 0;
  lines.forEach(line => {
    line.text.split(' ').forEach(word => {
      if (word.length > maxWordLen) maxWordLen = word.length;
    })
  });
  
  const subtextDelay = shouldAnimate ? (INITIAL_PAUSE + (maxWordLen * STAGGER_DELAY) + 0.3) : 0;

  useEffect(() => {
    if (enforceOnce) hasAnimatedIntro = true;
  }, [enforceOnce]);

  return (
    <div className={`flex flex-col ${className || ''}`}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className={`block whitespace-nowrap ${line.className || ''}`}>
          {line.text.split(' ').map((word, wordIdx, wordArr) => (
            <span key={wordIdx} className="inline-block" style={{ marginRight: wordIdx < wordArr.length - 1 ? '0.25em' : '0' }}>
              {word.split('').map((char, charIdx) => {
                const isFirst = charIdx === 0;
                if (isFirst) {
                  return (
                    <motion.span
                      key={charIdx}
                      initial={shouldAnimate ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  )
                }
                return (
                  <motion.span
                    key={charIdx}
                    initial={shouldAnimate ? { opacity: 0, width: 0 } : { opacity: 1, width: 'auto' }}
                    animate={{ opacity: 1, width: 'auto' }}
                    transition={{ 
                      delay: shouldAnimate ? INITIAL_PAUSE + (charIdx * STAGGER_DELAY) : 0,
                      type: 'spring', stiffness: 150, damping: 20 
                    }}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    {char}
                  </motion.span>
                )
              })}
            </span>
          ))}
        </span>
      ))}
      {subtext && (
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: subtextDelay, duration: 0.6, ease: 'easeOut' }}
          className={subtextClassName || ''}
        >
          {subtext}
        </motion.div>
      )}
    </div>
  )
}

// --- Text Animation Helpers ---
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 150, damping: 15 }
  }
}

const AnimatedText = ({ text, className }) => {
  return (
    <span className={`inline-block whitespace-nowrap ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={charVariant} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// --- Auto-Changing Pure Client Image Showcase ---
const ClientDietSlideshow = () => {
  const [activeIdx, setActiveIdx] = useState(0)

  const images = [
    '/images/diet-client-1.png',
    '/images/diet-client-2.png',
    '/images/diet-client-3.png'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative w-full max-w-[480px] h-[460px] md:h-[520px] overflow-hidden rounded-none bg-black flex items-center justify-center border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.9)]">
      <img
        src={images[activeIdx]}
        alt="Client Healthy Diet"
        className="w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-10"></div>
    </div>
  )
}

// --- Slide Presentation Wrapper ---
const Slide = ({ isActive, children }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ willChange: 'opacity' }}
          className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-20 overflow-hidden pointer-events-auto"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const [topTrainers, setTopTrainers] = useState([])
  
  // --- Slide Logic ---
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 6
  const isAnimating = useRef(false)
  const touchStartY = useRef(0)

  const videoRef = useRef(null)
  const grainRef = useRef(null)

  useEffect(() => {
    const fetchTopTrainers = async () => {
      try {
        const res = await fetch(`${API}/trainers`)
        if (res.ok) {
          const data = await res.json()
          setTopTrainers(data.slice(0, 4))
        }
      } catch (err) {
        console.error('Error fetching trainers:', err)
      }
    }
    fetchTopTrainers()
  }, [])

  // Dispatch custom event to let Navbar know the slide changed
  useEffect(() => {
    const event = new CustomEvent('landingSlideChange', { 
      detail: { slideIndex: currentSlide } 
    });
    window.dispatchEvent(event);
  }, [currentSlide]);

  const goToNext = useCallback(() => {
    if (isAnimating.current) return;
    if (currentSlide < totalSlides - 1) {
      isAnimating.current = true;
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => { isAnimating.current = false }, 900);
    }
  }, [currentSlide]);

  const goToPrev = useCallback(() => {
    if (isAnimating.current) return;
    if (currentSlide > 0) {
      isAnimating.current = true;
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => { isAnimating.current = false }, 900);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay blocked:', err));
    }

    const handleWheel = (e) => {
      // Allow horizontal scroll (e.g. for trainers slider)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }
      // Lower threshold for a smoother, easier trigger
      if (Math.abs(e.deltaY) < 10) return;

      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY.current - touchEndY;
      
      // Lower threshold for swipe
      if (Math.abs(diff) > 30) {
        if (diff > 0) {
           goToNext();
        } else {
           goToPrev();
        }
        // reset touch start so it doesn't trigger repeatedly in one swipe
        touchStartY.current = touchEndY; 
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Prevent browser overscroll/rubber-banding and entirely disable native scroll
    document.body.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      document.body.style.overscrollBehavior = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [goToNext, goToPrev]);

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#07080C] text-white font-['Inter'] selection:bg-[#F97316] selection:text-white z-50">
      
      {/* GLOBAL FIXED BACKGROUND (Static, doesn't scroll) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${
            currentSlide === 1 ? 'filter grayscale contrast-125 brightness-75 scale-105 opacity-80' : 
            currentSlide === 2 ? 'opacity-0' : 'opacity-60'
          }`}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        <div 
          ref={grainRef}
          className="absolute inset-0 z-[70] opacity-[0.03] pointer-events-none transform-gpu mix-blend-overlay"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        ></div>
      </div>

      {/* SLIDE PRESENTATION CONTENT */}
      <div className="relative z-10 w-full h-full">

        {/* SLIDE 0: Connect. Train. Transform. */}
        <Slide isActive={currentSlide === 0}>
          <div className="flex flex-col items-center justify-center w-full font-['Syne'] mt-[-5vh]">
            <h1 className="text-[clamp(3rem,6vw,6rem)] font-[800] tracking-[-0.03em] leading-tight text-center drop-shadow-2xl px-4 flex flex-col items-center text-white">
              <span>CONNECT. TRAIN.</span>
              <span>TRANSFORM.</span>
            </h1>
            <p className="mt-6 text-white text-[0.7rem] font-[800] tracking-[0.3em] uppercase drop-shadow-md">
              India's #1 Live Coaching Platform
            </p>
          </div>
        </Slide>

        {/* SLIDE 1: Transform Preview Teaser */}
        <Slide isActive={currentSlide === 1}>
          <div className="w-full h-full flex flex-col justify-center relative bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column: Interactive Client Transformation Slider */}
                <div className="order-2 lg:order-1 relative">
                  <BeforeAfterSlider />
                </div>

                {/* Right Column: Pure White Text & CTA */}
                <div className="order-1 lg:order-2">
                   <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                     See Your Transformation Before You Start.
                   </h2>
                   <p className="text-white font-medium text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-['Inter'] drop-shadow-md">
                     Upload 4 quick photos, choose your goal, and let our AI generate a hyper-realistic preview of your future physique.
                   </p>
                   <button 
                     onClick={() => navigate('/transform-preview')}
                     className="px-9 py-4 bg-white text-black text-base font-bold rounded-full hover:scale-105 hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 cursor-pointer"
                   >
                     Try Transform Preview &rarr;
                   </button>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* SLIDE 2: Diet Generator */}
        <Slide isActive={currentSlide === 2}>
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariant}
          >
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
               {/* Left Column: Pure White Text & CTA */}
               <div className="max-w-2xl drop-shadow-2xl">
                  <h2 className="text-[clamp(2.5rem,4.5vw,4.8rem)] font-black text-white mb-6 tracking-tighter leading-[0.95] flex flex-col drop-shadow-xl overflow-hidden">
                    <AnimatedText text="Get a Custom" className="block text-white" />
                    <AnimatedText text="AI Diet Plan in" className="block text-white" />
                    <AnimatedText text="Seconds." className="block text-white" />
                  </h2>
                  
                  <motion.p variants={fadeUpVariant} className="text-white font-medium text-base sm:text-lg leading-relaxed mb-8 max-w-xl drop-shadow-md font-['Inter']">
                    Not sure where to start? Use our free AI-powered diet generator. Enter your physical metrics and goals, and instantly receive a personalized Indian diet plan. No credit card required.
                  </motion.p>
                  
                  <motion.button 
                    variants={fadeUpVariant}
                    onClick={() => navigate('/free-diet-plan')}
                    className="px-9 py-4 bg-white text-black text-base font-bold rounded-full hover:scale-105 hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 cursor-pointer"
                  >
                    Try Free Diet Generator <Utensils size={20} className="text-black" />
                  </motion.button>
               </div>

               {/* Right Column: High-Quality Watermark-Free Generated B&W Image (Sharp Edges) */}
               <motion.div 
                 variants={fadeUpVariant}
                 className="relative hidden lg:flex justify-center items-center"
               >
                 <div className="relative w-full max-w-[480px] h-[460px] md:h-[520px] overflow-hidden rounded-none bg-black flex items-center justify-center border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.9)]">
                   <img
                     src="/images/bw-hands-1.png"
                     alt="Gym Healthy Diet Prep"
                     className="w-full h-full object-cover filter contrast-110 brightness-105 z-0"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none z-10"></div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </Slide>

        {/* SLIDE 3: Trainer Showcase (Editorial Typography) */}
        <Slide isActive={currentSlide === 3}>
          <div className="w-full h-full flex flex-col justify-center relative bg-black pointer-events-auto z-20 border-y border-white/5">
            {/* Minimalist Section Header */}
            <div className="absolute top-12 left-0 w-full text-center">
              <h2 className="text-[10px] font-bold text-gray-500 tracking-[0.3em] uppercase">Meet Our Trainers</h2>
            </div>

            <div className="w-full overflow-hidden flex items-center justify-center flex-1 mt-12 relative group/section">
              <div className="flex w-max animate-marquee space-x-12 md:space-x-24 px-12">
                {[...topTrainers, ...topTrainers, ...topTrainers, ...topTrainers, ...topTrainers, ...topTrainers].map((t, i) => {
                  const name = t.userId?.name || 'TRAINER';
                  const price = t.role === 'wellness_coach' ? t.pricing?.wellnessMonthly : t.pricing?.personalTrainingMonthly;
                  const quote = (t.specialties && t.specialties[0] && typeof t.specialties[0] === 'string') 
                    ? `"${t.specialties[0].toUpperCase()} AND ATHLETIC EXCELLENCE"` 
                    : '"NEXT-LEVEL ATHLETIC PERFORMANCE"';

                  return (
                    <div 
                      key={`${t._id}-${i}`} 
                      className="flex flex-col items-center justify-center text-center w-[280px] md:w-[400px] shrink-0 cursor-pointer group"
                      onClick={() => navigate(`/trainers/${t._id}`)}
                    >
                      {/* Star Rating */}
                      <div className="text-white text-xs tracking-[0.3em] mb-6 opacity-80">
                        ★★★★★
                      </div>
                      
                      {/* Quote / Specialty */}
                      <p className="text-gray-300 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.25em] mb-12 leading-loose max-w-[320px]">
                        {quote}
                      </p>
                      
                      {/* Name (Acting as the Logo) */}
                      <h3 className="text-3xl md:text-5xl font-['Inter'] font-black text-white uppercase tracking-tighter group-hover:text-gray-400 transition-colors duration-500 mb-6 whitespace-nowrap">
                        {name}
                      </h3>
                      
                      {/* Action / Price */}
                      <div className="flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-4 group-hover:translate-y-0">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                          From ₹{price || 0} / month
                        </span>
                        <div className="text-white text-[10px] font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-[#F97316] hover:border-[#F97316] transition-colors">
                          View Profile
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Gradient Edges for fade effect on scroll */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
          </div>
        </Slide>

        {/* SLIDE 4: Pricing */}
        <Slide isActive={currentSlide === 4}>
          <div className="w-full h-full flex flex-col justify-center bg-[#09090b] relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Simple Pricing</h2>
                <p className="text-gray-400 text-lg font-medium">No hidden fees.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                
                {/* Free */}
                <div className="p-8 flex flex-col bg-[#111827] border border-[#1F2937] rounded-xl h-full">
                  <div className="mb-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Free</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-white leading-none tracking-tighter">₹0</span>
                      <span className="text-gray-400 font-medium text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1 mt-8">
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>BMI/BMR calculators</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>AI diet plan (3/month)</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Browse trainers</span>
                    </li>
                  </ul>
                  <button className="w-full py-3.5 rounded-xl border border-white/20 bg-transparent text-white font-bold hover:bg-white hover:text-black transition-colors" onClick={() => navigate('/auth/register')}>Get Started</button>
                </div>

                {/* Wellness */}
                <div className="p-8 flex flex-col bg-[#111827] border border-[#1F2937] rounded-xl h-full relative md:scale-[1.04] scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
                  <div className="absolute top-0 right-0 bg-[#F97316] text-white text-[10px] font-bold px-4 py-1.5 rounded-tr-xl rounded-bl-xl uppercase tracking-widest shadow-md">
                    Popular
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Wellness</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-white leading-none tracking-tighter">₹999</span>
                      <span className="text-gray-400 font-medium text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1 mt-8">
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-[#F97316] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-white font-bold">Dedicated wellness coach</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Diet + workout plan</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Progress tracking</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>AI food analysis</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Chat support</span>
                    </li>
                  </ul>
                  <button className="w-full py-3.5 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#EA580C] shadow-lg transition-colors" onClick={() => navigate('/trainers?type=wellness')}>Browse Wellness Coaches</button>
                </div>

                {/* PT */}
                <div className="p-8 flex flex-col bg-[#111827] border border-[#1F2937] rounded-xl h-full">
                  <div className="mb-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Personal Training</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-white leading-none tracking-tighter">₹2499</span>
                      <span className="text-gray-400 font-medium text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1 mt-8">
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Everything in Wellness</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-white font-bold">Live 1-on-1 video sessions</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Real-time form correction</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium">
                      <Check size={18} className="text-gray-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <button className="w-full py-3.5 rounded-xl border border-white/20 bg-transparent text-white font-bold hover:bg-white hover:text-black transition-colors" onClick={() => navigate('/trainers?type=personal_training')}>Browse PT Coaches</button>
                </div>

              </div>
            </div>
          </div>
        </Slide>

        {/* SLIDE 5: Footer CTA */}
        <Slide isActive={currentSlide === 5}>
          <div className="w-full h-full flex flex-col justify-center items-center text-center relative bg-black">
            {/* Dark athlete background image */}
            <img 
              src="/images/athlete-back-dark.png" 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
            {/* Gradient overlay: dark at edges, especially bottom to hide any artifacts */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-[1]"></div>
            <div className="absolute inset-0 bg-black/30 z-[1]"></div>
            <div className="flex-1 flex flex-col justify-center items-center w-full">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Ready to Transform?</h2>
                <p className="text-xl text-gray-400 font-medium mb-12">Start your journey today and achieve your goals with expert guidance.</p>
                <button 
                  className="bg-[#F97316] text-white px-12 py-5 text-lg font-bold rounded-full hover:scale-105 hover:bg-[#EA580C] shadow-[0_4px_24px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_32px_rgba(249,115,22,0.6)] transition-all duration-300 pointer-events-auto cursor-pointer" 
                  onClick={() => {
                    if (user) {
                      navigate(role === 'admin' ? '/admin' : role === 'trainer' ? '/trainer/dashboard' : '/dashboard')
                    } else {
                      navigate('/auth/register')
                    }
                  }}
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                </button>
              </div>
            </div>

            <div className="relative z-10 w-full bg-transparent py-8 border-t border-[#1E293B] mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-8 text-center">
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-3xl font-[800] text-white">500+</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Trainers</div>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-3xl font-[800] text-white">10,000+</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Active Clients</div>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-3xl font-[800] text-white">4.9★</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Average Rating</div>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <div className="text-3xl font-[800] text-white">6</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Languages</div>
                  </div>
                </div>
                <div className="text-center mt-8 text-sm text-gray-400 font-medium">
                  Join 10,000+ happy clients globally who have transformed their lives with FitForge.
                </div>
              </div>
            </div>
          </div>
        </Slide>

      </div>
      
      {/* Slide Indicators (Optional, highly recommended for slide navigation) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating.current || currentSlide === index) return;
              setCurrentSlide(index);
              isAnimating.current = true;
              setTimeout(() => { isAnimating.current = false }, 1200);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-[#F97316] scale-150 shadow-[0_0_10px_#F97316]' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

    </div>
  )
}
