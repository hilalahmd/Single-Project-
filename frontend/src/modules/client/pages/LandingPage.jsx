import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Clock, UtensilsCrossed, Users, Video, Camera, 
  TrendingUp, MessageCircle, Utensils, BarChart2, Star 
} from 'lucide-react'
import CinematicHero from './../components/CinematicHero'
import ScrollReveal from '../../../shared/components/ScrollReveal'

// High-performance clamp & map functions
const clamp = (val, min, max) => Math.max(min, Math.min(max, val))
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  return clamp(((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin, Math.min(outMin, outMax), Math.max(outMin, outMax))
}

export default function LandingPage() {
  const navigate = useNavigate()
  
  // Ref for the global background track
  const trackRef = useRef(null)
  const grainRef = useRef(null)

  useEffect(() => {
    let ticking = false;

    const updateDOM = () => {
      // Calculate scroll progress over the ENTIRE document
      const scrollTop = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      let p = scrollTop / (maxScroll || 1)
      p = clamp(p, 0, 1)

      // Global Track Animation (Spreads out as you scroll down the entire page)
      if (trackRef.current) {
        const trackSpread = mapRange(p, 0.0, 1.0, 1, 6.0)
        trackRef.current.style.transform = `scaleX(${trackSpread}) translateY(${p * 40}vh)`
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
    
    // Recalculate on resize in case document height changes
    window.addEventListener('resize', updateDOM)
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateDOM)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#07080C] text-white font-['Inter'] selection:bg-[#2563EB] selection:text-white relative">
      
      {/* GLOBAL FIXED BACKGROUND (Replaces Hero-only background) */}
      <div className="fixed inset-0 z-0 pointer-events-none will-change-transform transform-gpu">
        {/* Track */}
        <svg ref={trackRef} width="100%" height="100%" preserveAspectRatio="none" className="absolute bottom-0 h-[60%] origin-top">
          <g>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="2" opacity="0.40" />
            <line x1="50%" y1="0" x2="20%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.40" />
            <line x1="50%" y1="0" x2="-10%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.40" />
            <line x1="50%" y1="0" x2="-40%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.40" />
            <line x1="50%" y1="0" x2="80%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.40" />
            <line x1="50%" y1="0" x2="110%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.40" />
            <line x1="50%" y1="0" x2="140%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.40" />
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="1" opacity="0.25" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="2" opacity="0.25" />
            <line x1="0" y1="90%" x2="100%" y2="90%" stroke="white" strokeWidth="4" opacity="0.25" />
          </g>
        </svg>
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_25%,_rgba(7,8,12,0.95)_100%)] z-10"></div>
        {/* Film Grain */}
        <div 
          ref={grainRef}
          className="absolute inset-0 z-[70] mix-blend-overlay opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        ></div>
      </div>

      {/* ALL CONTENT GOES IN Z-10 OR HIGHER TO SIT ABOVE BACKGROUND */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="absolute top-0 w-full z-[100] bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-[-0.05em] text-white font-['Syne'] drop-shadow-md">FITFORGE</Link>
            <div className="flex items-center gap-6">
              <Link to="/auth/login" className="text-sm font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest drop-shadow-md">Log in</Link>
              <button 
                className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform" 
                onClick={() => navigate('/auth/register')}
              >
                GET STARTED
              </button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <CinematicHero />

        {/* STATS BRIDGE BAR */}
        <ScrollReveal direction="none" duration={1000}>
          <div className="bg-[#111318]/50 backdrop-blur-md py-8 border-y border-white/10 mt-[-1px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-8 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>
                <div className="flex-1 min-w-[150px]">
                  <div className="text-3xl font-[800] text-white">500+</div>
                  <div className="text-xs font-bold text-[#6B7494] uppercase tracking-widest mt-1">Trainers</div>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <div className="text-3xl font-[800] text-white">10,000+</div>
                  <div className="text-xs font-bold text-[#6B7494] uppercase tracking-widest mt-1">Clients</div>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <div className="text-3xl font-[800] text-white">4.9★</div>
                  <div className="text-xs font-bold text-[#6B7494] uppercase tracking-widest mt-1">Average Rating</div>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <div className="text-3xl font-[800] text-white">6</div>
                  <div className="text-xs font-bold text-[#6B7494] uppercase tracking-widest mt-1">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* PROBLEMS SECTION */}
        <section className="py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-center text-white mb-20 font-['Syne'] tracking-tight">Why FitForge?</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8">
              <ScrollReveal delay={0}>
                <div className="p-8 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-full hover:scale-105 hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-2xl">
                  <div className="w-14 h-14 bg-[#2563EB]/20 border border-[#2563EB]/50 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Clock className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Schedules Don't Match?</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    Train at home, anytime. No need to commute to the gym or fit into their limited hours.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <div className="p-8 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-full hover:scale-105 hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-2xl">
                  <div className="w-14 h-14 bg-[#2563EB]/20 border border-[#2563EB]/50 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <UtensilsCrossed className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Diet is 75% of Results</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    AI food photo analysis for Indian meals — dosa, puttu, biryani and more.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="p-8 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-full hover:scale-105 hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-2xl">
                  <div className="w-14 h-14 bg-[#2563EB]/20 border border-[#2563EB]/50 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Users className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Gym Trainers Are Shared</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    Every FitForge client gets a dedicated certified coach, not a shared floor trainer.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-center text-white mb-24 font-['Syne'] tracking-tight">How It Works</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-16">
              {[
                { num: '1', title: 'Register & Set Goals', desc: 'Tell us about your fitness level, dietary preferences, and goals.' },
                { num: '2', title: 'Get Matched With Your Coach', desc: 'We pair you with a certified professional who speaks your language.' },
                { num: '3', title: 'Train, Track, Transform', desc: 'Follow your plan, log meals, and meet your coach via live video.' }
              ].map((step, i) => (
                <ScrollReveal key={i} delay={i * 200} className="relative text-center px-6">
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[140px] font-black text-white/5 select-none -z-10 leading-none">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-12 mb-4">{step.title}</h3>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">{step.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-32 overflow-hidden relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-center text-white mb-20 font-['Syne'] tracking-tight">Everything You Need</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Video, title: 'Live Video Sessions' },
                { icon: Camera, title: 'AI Food Analysis' },
                { icon: TrendingUp, title: 'Progress Tracker' },
                { icon: MessageCircle, title: 'Real-time Chat' },
                { icon: Utensils, title: 'Diet Plans' },
                { icon: BarChart2, title: 'Progress Charts' },
              ].map((Feature, i) => (
                <ScrollReveal key={i} delay={i * 100} direction="up">
                  <div className="flex items-center gap-5 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                    <div className="w-12 h-12 bg-[#2563EB]/20 border border-[#2563EB]/50 shadow-sm flex items-center justify-center rounded-xl shrink-0">
                      <Feature.icon className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <span className="font-bold text-white text-lg">{Feature.title}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* TRAINER SHOWCASE */}
        <section className="py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="left">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-3 font-['Syne'] tracking-tight">Meet Our Trainers</h2>
                  <p className="text-gray-400 font-medium text-lg">Certified experts ready to guide you.</p>
                </div>
                <Link to="/trainers" className="hidden sm:block text-sm font-bold text-[#2563EB] hover:text-white transition-colors">
                  View all trainers &rarr;
                </Link>
              </div>
            </ScrollReveal>
            
            <div className="flex overflow-x-auto pb-12 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 gap-8 snap-x">
              {[
                { name: 'Arjun Menon', spec: 'Weight Loss', lang: 'Malayalam/English' },
                { name: 'Priya Nair', spec: 'Yoga/Nutrition', lang: 'Malayalam/Tamil' },
                { name: 'Rahul Sharma', spec: 'Muscle Building', lang: 'Hindi/English' },
                { name: 'Divya Thomas', spec: 'HIIT/Cardio', lang: 'Malayalam/English' },
              ].map((t, i) => (
                <ScrollReveal key={i} delay={i * 150} direction="up" className="min-w-[280px] snap-center shrink-0">
                  <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:bg-white/10 cursor-pointer">
                    <div className="text-center">
                      {/* Placeholder for Avatar */}
                      <div className="w-24 h-24 rounded-full bg-[#2563EB]/20 border-2 border-[#2563EB]/50 mx-auto mb-5 flex items-center justify-center text-2xl font-bold text-white">
                        {t.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white">{t.name}</h3>
                      <div className="flex items-center justify-center gap-1.5 text-sm font-medium mt-2 mb-5 text-[#A0AABF]">
                        <Star size={16} className="fill-[#2563EB] text-[#2563EB]" /> 4.9
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <span className="px-3 py-1 bg-[#2563EB]/20 text-[#2563EB] text-xs font-bold rounded-full">{t.spec}</span>
                        <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-bold rounded-full">{t.lang}</span>
                      </div>
                      <div className="mb-6">
                        <span className="text-2xl font-bold text-white">₹999</span>
                        <span className="text-sm text-gray-400 font-medium ml-1">/month</span>
                      </div>
                      <button 
                        className="w-full py-3 rounded-full bg-white/10 text-white font-bold hover:bg-[#2563EB] transition-colors"
                        onClick={() => navigate('/trainers')}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-32 overflow-hidden relative border-t border-white/5" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-white mb-4 font-['Syne'] tracking-tight">Simple Pricing</h2>
                <p className="text-gray-400 text-lg font-medium">No hidden fees.</p>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              <ScrollReveal delay={0} direction="right">
                <div className="p-8 flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl h-full hover:scale-105 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="mb-8"><span className="text-5xl font-bold text-white">₹0</span><span className="text-gray-400 font-medium ml-1">/month</span></div>
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0"/>BMI/BMR calculators</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0"/>AI diet plan (3/month)</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0"/>Browse trainers</li>
                  </ul>
                  <button className="w-full py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors" onClick={() => navigate('/auth/register')}>Get Started</button>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150} direction="up" className="z-10">
                <div className="p-8 flex flex-col bg-[#111318] border border-[#2563EB]/50 shadow-[0_0_40px_rgba(37,99,235,0.2)] rounded-2xl relative transform md:-translate-y-8 h-full scale-105 hover:scale-110 transition-all duration-300 cursor-pointer">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Wellness</h3>
                  <div className="mb-8"><span className="text-5xl font-bold text-white">₹999</span><span className="text-gray-400 font-medium ml-1">/month</span></div>
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-white font-semibold"><div className="w-2 h-2 rounded-full bg-[#2563EB] mt-2 shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.8)]"/>Dedicated wellness coach</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/>Diet + workout plan</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/>Progress tracking</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/>AI food analysis</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/>Chat</li>
                  </ul>
                  <button className="w-full py-4 rounded-full bg-[#2563EB] text-white font-bold hover:bg-white hover:text-[#2563EB] shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-colors" onClick={() => navigate('/plans')}>Choose Wellness</button>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="left">
                <div className="p-8 flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl h-full hover:scale-105 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                  <h3 className="text-2xl font-bold text-white mb-2">Personal Training</h3>
                  <div className="mb-8"><span className="text-5xl font-bold text-white">₹2499</span><span className="text-gray-400 font-medium ml-1">/month</span></div>
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-white font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0"/>Everything in Wellness</li>
                    <li className="flex items-start gap-3 text-white font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0"/>Live 1-on-1 video sessions</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/>Real-time form correction</li>
                    <li className="flex items-start gap-3 text-gray-300 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/>Priority support</li>
                  </ul>
                  <button className="w-full py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-colors" onClick={() => navigate('/plans')}>Choose PT</button>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="py-32 text-center overflow-hidden relative border-t border-white/5 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.1)_0%,_transparent_50%)]">
          <ScrollReveal direction="up" duration={1000}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <h2 className="text-5xl font-black text-white mb-6 tracking-tight font-['Syne']">Ready to Transform?</h2>
              <p className="text-xl text-gray-400 font-medium mb-12">Start your journey today and achieve your goals with expert guidance.</p>
              <button 
                className="bg-[#2563EB] text-white px-12 py-5 text-lg font-bold rounded-full hover:scale-105 hover:bg-white hover:text-[#2563EB] shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] transition-all duration-300" 
                onClick={() => navigate('/auth/register')}
              >
                Get Started Free
              </button>
            </div>
          </ScrollReveal>
        </section>
        
      </div>
    </div>
  )
}