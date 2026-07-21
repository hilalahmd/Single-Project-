import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import { 
  Clock, UtensilsCrossed, Users, Video, Camera, 
  TrendingUp, MessageCircle, Utensils, BarChart2, Star 
} from 'lucide-react'
import CinematicHero from './../components/CinematicHero'
import ScrollReveal from '../../../shared/components/ScrollReveal'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import API from '../../../shared/utils/api'

// High-performance clamp & map functions
const clamp = (val, min, max) => Math.max(min, Math.min(max, val))
const mapRange = (val, inMin, inMax, outMin, outMax) => {
  return clamp(((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin, Math.min(outMin, outMax), Math.max(outMin, outMax))
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const [topTrainers, setTopTrainers] = useState([])

  
  // Ref for the global background track
  const trackRef = useRef(null)
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
        trackRef.current.style.transform = `translate3d(0, ${p * 40}vh, 0) scaleX(${trackSpread})`
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
    <div className="flex flex-col min-h-screen bg-[#07080C] text-white font-['Inter'] selection:bg-[#F97316] selection:text-white relative">
      
      {/* GLOBAL FIXED BACKGROUND (Replaces Hero-only background) */}
      <div className="fixed inset-0 z-0 pointer-events-none will-change-transform transform-gpu">
        {/* Track */}
        <svg ref={trackRef} width="100%" height="100%" preserveAspectRatio="none" className="absolute bottom-0 h-[60%] origin-top will-change-transform transform-gpu">
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_25%,_rgba(7,8,12,0.95)_100%)] z-10 pointer-events-none"></div>
        {/* Film Grain */}
        <div 
          ref={grainRef}
          className="absolute inset-0 z-[70] opacity-[0.03] pointer-events-none transform-gpu mix-blend-overlay"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        ></div>
      </div>

      {/* ALL CONTENT GOES IN Z-10 OR HIGHER TO SIT ABOVE BACKGROUND */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* HERO SECTION */}
        <CinematicHero />


        {/* HOW IT WORKS */}
        <section className="pt-12 pb-32 overflow-hidden relative">
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


        {/* FREE DIET GENERATOR TEASER SECTION */}
        <section className="py-32 overflow-hidden relative border-t border-white/5 bg-[#0F172A]/30">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none transform-gpu"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="right">
                <div>
                   <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/50 rounded-full px-4 py-2 mb-6">
                     <span className="text-orange-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> Free Tool
                     </span>
                   </div>
                   <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 font-['Syne'] tracking-tight leading-tight">
                     Get a Custom AI Diet Plan in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Seconds</span>.
                   </h2>
                   <p className="text-gray-400 font-medium text-lg leading-relaxed mb-8">
                     Not sure where to start? Use our free AI-powered diet generator. Enter your physical metrics and goals, and instantly receive a personalized Indian diet plan. No credit card required.
                   </p>
                   <button 
                     onClick={() => navigate('/free-diet-plan')}
                     className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3"
                   >
                     Try Free Diet Generator <Utensils size={18} />
                   </button>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 to-transparent rounded-3xl blur-2xl transform rotate-3"></div>
                  <div className="bg-[#030712] border border-[#1E293B] rounded-3xl p-8 relative shadow-2xl overflow-hidden">
                    {/* Decorative mock UI */}
                    <div className="flex items-center justify-between mb-6 border-b border-[#1E293B] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center"><Utensils size={20} className="text-orange-400"/></div>
                        <div>
                          <div className="text-sm font-bold text-white">Your AI Plan</div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Generating...</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <input type="text" placeholder="e.g. I want to lose 5kg in 2 months..." className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white focus:outline-none pointer-events-none" readOnly />
                      <button className="w-full bg-[#F97316] text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.4)] pointer-events-none">
                        Analyzing Goals... <span className="flex gap-1 ml-1"><span className="w-1 h-1 bg-white rounded-full animate-bounce"></span><span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span><span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span></span>
                      </button>
                      <div className="grid grid-cols-2 gap-4 mt-4 opacity-50">
                        <div className="h-16 bg-[#1E293B]/50 rounded-2xl border border-white/5 animate-pulse"></div>
                        <div className="h-16 bg-[#1E293B]/50 rounded-2xl border border-white/5 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* TRANSFORM PREVIEW TEASER SECTION */}
        <section className="py-32 overflow-hidden relative border-t border-white/5 bg-[#0a0a0a]">
          <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff6b1a]/10 blur-[120px] rounded-full pointer-events-none transform-gpu"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left" className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#ff6b1a]/20 to-transparent rounded-3xl blur-2xl transform -rotate-3"></div>
                  <BeforeAfterSlider />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" className="order-1 lg:order-2">
                <div>
                   <div className="inline-flex items-center gap-2 bg-[#ff6b1a]/20 border border-[#ff6b1a]/50 rounded-full px-4 py-2 mb-6">
                     <span className="text-[#ff6b1a] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-[#ff6b1a] animate-pulse"></span> AI Preview
                     </span>
                   </div>
                   <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 font-['Syne'] tracking-tight leading-tight uppercase">
                     See Your Transformation Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a]">Start</span>.
                   </h2>
                   <p className="text-gray-400 font-medium text-lg leading-relaxed mb-8">
                     Upload 4 quick photos, choose your goal, and let our AI generate a hyper-realistic preview of your future physique.
                   </p>
                   <button 
                     onClick={() => navigate('/transform-preview')}
                     className="px-8 py-4 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white font-bold rounded-full uppercase tracking-widest text-sm hover:scale-105 shadow-[0_0_20px_rgba(255,107,26,0.3)] transition-all flex items-center gap-3"
                   >
                     Try Transform Preview &rarr;
                   </button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* TRAINER SHOWCASE */}
        <section className="py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="left">
              <div className="flex justify-between items-end mb-16 relative">
                {/* Ambient glow behind heading */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[200px] bg-[#ff6b1a]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                
                <div>
                  <h2 className="text-4xl font-bold text-white mb-3 font-['Syne'] tracking-tight uppercase">Meet Our Trainers</h2>
                  <p className="text-gray-400 font-medium text-lg">Certified experts ready to guide you.</p>
                </div>
                <Link to="/trainers" className="hidden sm:flex items-center text-sm font-bold text-[#ff6b1a] group hover:text-[#ff8c3a] transition-colors">
                  View all trainers <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>
            
            <div className="flex overflow-x-auto pb-12 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 gap-8 snap-x">
              {topTrainers.map((t, i) => {
                const img = t.profilePhoto || t.userId?.avatar || 'https://via.placeholder.com/400x500';
                const name = t.userId?.name || 'Trainer';
                const spec = t.specialties?.[0] || 'Fitness';
                const lang = t.languagesSpoken?.[0] || 'English';
                const price = t.role === 'wellness_coach' ? t.pricing?.wellnessMonthly : t.pricing?.personalTrainingMonthly;

                return (
                <ScrollReveal key={t._id || i} delay={i * 150} direction="up" className="min-w-[280px] snap-center shrink-0">
                  <div className="relative p-8 bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-[20px] hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,26,0.15)] cursor-pointer overflow-hidden group">
                    {/* Inner top highlight for depth */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    <div className="text-center relative z-10">
                      {/* Avatar Image with Hover Glow */}
                      <div className="relative w-24 h-24 mx-auto mb-5">
                        <div className="absolute inset-0 bg-[#ff6b1a] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
                        <img src={img} alt={name} loading="lazy" className="relative w-full h-full rounded-full object-cover border-2 border-transparent bg-clip-border group-hover:border-[#ff6b1a] transition-colors duration-300" style={{ backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box', backgroundImage: 'linear-gradient(#0f1117, #0f1117), linear-gradient(to right, #ff6b1a, #ff8c3a)' }} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white">{name}</h3>
                      <div className="flex items-center justify-center gap-1.5 text-sm font-medium mt-2 mb-5 text-gray-400">
                        <Star size={16} className="fill-[#ff6b1a] text-[#ff6b1a]" /> {t.rating || 0}
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <span className="px-3 py-1 bg-[#ff6b1a]/10 border border-[#ff6b1a]/20 shadow-[0_0_10px_rgba(255,107,26,0.15)] text-[#ff6b1a] text-xs font-bold rounded-full tracking-wide">{spec}</span>
                        <span className="px-3 py-1 bg-white/5 border border-white/5 text-[#c4c4c8] text-xs font-bold rounded-full tracking-wide">{lang}</span>
                      </div>
                      <div className="mb-6">
                        <span className="text-2xl font-black text-white font-['Syne'] tracking-tight">₹{price || 0}</span>
                        <span className="text-sm text-gray-400 font-medium ml-1">/month</span>
                      </div>
                      <button 
                        className="w-full py-3 rounded-full border border-[rgba(255,255,255,0.1)] bg-white/5 text-white font-bold group-hover:border-[#ff6b1a]/50 group-hover:bg-gradient-to-r group-hover:from-[#ff6b1a] group-hover:to-[#ff8c3a] group-hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] transition-all duration-300 uppercase tracking-widest text-xs"
                        onClick={() => navigate(`/trainers/${t._id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-32 overflow-hidden relative border-t border-[#1E293B]" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-white mb-4 font-['Syne'] tracking-tight">Simple Pricing</h2>
                <p className="text-gray-400 text-lg font-medium">No hidden fees.</p>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              <ScrollReveal delay={0} direction="right">
                <div className="p-8 flex flex-col bg-[#0F172A] border border-[#1E293B] rounded-3xl h-full hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-sm">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="mb-8"><span className="text-5xl font-bold text-white">₹0</span><span className="text-gray-400 font-medium ml-1">/month</span></div>
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0"/>BMI/BMR calculators</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0"/>AI diet plan (3/month)</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0"/>Browse trainers</li>
                  </ul>
                  <button className="w-full py-4 rounded-full bg-[#1E293B] text-white font-bold hover:bg-[#2A364D] transition-colors" onClick={() => navigate('/auth/register')}>Get Started</button>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150} direction="up" className="z-10">
                <div className="p-8 flex flex-col bg-[#111827] border-2 border-[#F97316] shadow-[0_12px_40px_rgba(249,115,22,0.12)] rounded-3xl relative transform md:-translate-y-8 h-full scale-105 hover:scale-110 transition-all duration-300 cursor-pointer">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Wellness</h3>
                  <div className="mb-8 flex flex-col justify-center min-h-[5rem]">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Starts from</div>
                    <div><span className="text-5xl font-bold text-white">₹999</span><span className="text-gray-400 font-medium ml-1">/month</span></div>
                  </div>
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-white font-bold"><div className="w-2 h-2 rounded-full bg-[#F97316] mt-2 shrink-0"/>Dedicated wellness coach</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"/>Diet + workout plan</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"/>Progress tracking</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"/>AI food analysis</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"/>Chat</li>
                  </ul>
                  <button className="w-full py-4 rounded-full bg-[#F97316] text-white font-bold hover:bg-[#EA580C] shadow-[0_4px_14px_rgba(249,115,22,0.4)] transition-colors" onClick={() => navigate('/trainers?type=wellness')}>Browse Wellness Coaches</button>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="left">
                <div className="p-8 flex flex-col bg-[#0F172A] border border-[#1E293B] rounded-3xl h-full hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-sm">
                  <h3 className="text-2xl font-bold text-white mb-2">Personal Training</h3>
                  <div className="mb-8 flex flex-col justify-center min-h-[5rem]">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Starts from</div>
                    <div><span className="text-5xl font-bold text-white">₹2499</span><span className="text-gray-400 font-medium ml-1">/month</span></div>
                  </div>
                  <ul className="space-y-5 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-white font-bold"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0"/>Everything in Wellness</li>
                    <li className="flex items-start gap-3 text-white font-bold"><div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 shrink-0"/>Live 1-on-1 video sessions</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"/>Real-time form correction</li>
                    <li className="flex items-start gap-3 text-white font-medium"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 shrink-0"/>Priority support</li>
                  </ul>
                  <button className="w-full py-4 rounded-full bg-[#1E293B] text-white font-bold hover:bg-[#2A364D] transition-colors" onClick={() => navigate('/trainers?type=personal_training')}>Browse PT Coaches</button>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>


        {/* FOOTER CTA */}
        <section className="py-32 text-center overflow-hidden relative border-t border-[#1E293B] bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.08)_0%,_transparent_50%)]">
          <ScrollReveal direction="up" duration={1000}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <h2 className="text-5xl font-black text-white mb-6 tracking-tight font-['Syne']">Ready to Transform?</h2>
              <p className="text-xl text-gray-400 font-medium mb-12">Start your journey today and achieve your goals with expert guidance.</p>
              <button 
                className="bg-[#F97316] text-white px-12 py-5 text-lg font-bold rounded-full hover:scale-105 hover:bg-[#EA580C] shadow-[0_4px_24px_rgba(249,115,22,0.4)] hover:shadow-[0_8px_32px_rgba(249,115,22,0.6)] transition-all duration-300" 
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
          </ScrollReveal>
        </section>

        {/* STATS BRIDGE BAR */}
        <ScrollReveal direction="none" duration={1000}>
          <div className="bg-[#07080C] py-8 border-y border-[#1E293B]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-8 text-center" style={{ fontFamily: "'Syne', sans-serif" }}>
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
        </ScrollReveal>
        
      </div>
    </div>
  )
}
