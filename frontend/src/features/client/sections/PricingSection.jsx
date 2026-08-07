import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Sparkles, Shield, ArrowRight, Star, Video, Zap, Award, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../../shared/context/AuthContext'

export default function PricingSection() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPlanId, setSelectedPlanId] = useState('wellness')
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'annual'

  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      tagline: 'Essential AI diet & tracking tools',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      icon: Zap,
      cta: 'Get Started Free',
      route: '/auth/register',
      summary: 'Essential fitness calculators, basic progress logging, and 3 AI diet plans generated every month.',
      features: [
        { text: 'BMI & BMR Health Calculators', status: 'Included' },
        { text: 'AI Diet Plan Generator (3/month)', status: 'Included' },
        { text: 'Browse Full Trainer Directory', status: 'Included' },
        { text: 'Basic Workout & Weight Logger', status: 'Included' },
        { text: 'Dedicated 1-on-1 Coach', status: 'Not Included' },
        { text: 'Live Video Coaching Sessions', status: 'Not Included' },
      ],
    },
    {
      id: 'wellness',
      name: 'Wellness Coaching',
      tagline: 'Personalized coach & custom macros',
      monthlyPrice: 999,
      annualPrice: 799,
      prefix: 'Starts from',
      badge: '⚡ MOST POPULAR',
      icon: Award,
      cta: 'Browse Wellness Coaches',
      route: '/trainers?type=wellness',
      summary: 'Everything you need for sustainable long-term transformation with a dedicated wellness coach.',
      features: [
        { text: 'Dedicated Certified Wellness Coach', status: 'Included', highlight: true },
        { text: 'Custom Macro & Workout Blueprint', status: 'Included', highlight: true },
        { text: 'AI Food Photo & Calorie Scanner', status: 'Included' },
        { text: 'Weekly Progress & Body Metrics', status: 'Included' },
        { text: 'Direct 1-on-1 In-App Chat Support', status: 'Included' },
        { text: 'Live Video Coaching Sessions', status: 'Not Included' },
      ],
    },
    {
      id: 'pt',
      name: 'Personal Training',
      tagline: 'Live 1-on-1 video sessions & form check',
      monthlyPrice: 2499,
      annualPrice: 1999,
      prefix: 'Starts from',
      badge: '✦ ULTIMATE PRO',
      icon: Video,
      cta: 'Browse PT Coaches',
      route: '/trainers?type=personal_training',
      summary: 'High-touch live virtual coaching for maximum accountability, posture alignment, and peak results.',
      features: [
        { text: 'Everything included in Wellness', status: 'Included' },
        { text: 'Live 1-on-1 Video Coaching Sessions', status: 'Included', highlight: true },
        { text: 'Real-Time Form & Technique Correction', status: 'Included', highlight: true },
        { text: 'Custom Routine Adjustments Anytime', status: 'Included' },
        { text: 'VIP Priority Coach Response', status: 'Included', highlight: true },
        { text: 'Unlimited Form Check Video Submissions', status: 'Included' },
      ],
    },
  ]

  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[1]
  const currentPrice = billingCycle === 'annual' ? activePlan.annualPrice : activePlan.monthlyPrice

  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-black text-white px-4 sm:px-6 lg:px-8 py-3 overflow-hidden select-none relative z-20">
      
      {/* Background Video (Black & White Luxury Theme - Brightened) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale opacity-55 filter brightness-110 contrast-110 mix-blend-luminosity scale-105"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Balanced gradient overlays for high visibility with crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70"></div>
      </div>

      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.04] blur-[160px] pointer-events-none rounded-full z-[1]" />

      <div className="max-w-6xl w-full mx-auto flex flex-col justify-between h-full max-h-[94vh] relative z-10 py-1">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Sparkles size={12} className="text-white animate-pulse" />
              <span>HOVER-ACTIVATED LUXURY PRICING</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-['Syne'] uppercase tracking-tight text-white">
              CHOOSE YOUR <span className="text-gray-500">LEVEL</span>
            </h2>
          </div>

          {/* Billing Switcher - Hover/Click Activated */}
          <div className="inline-flex items-center gap-6">
            <button
              onMouseEnter={() => setBillingCycle('monthly')}
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs font-extrabold uppercase tracking-wider transition-all duration-300 py-1 cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'
              }`}
            >
              Monthly
            </button>

            <button
              onMouseEnter={() => setBillingCycle('annual')}
              onClick={() => setBillingCycle('annual')}
              className={`text-xs font-extrabold uppercase tracking-wider transition-all duration-300 py-1 flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-500 hover:text-gray-300 border-b-2 border-transparent'
              }`}
            >
              <span>Annually</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-normal bg-white text-black">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Split Layout Body */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch flex-1 min-h-0 py-3">
          
          {/* Left Column: Plan Selector (Hover-to-Select) */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-2.5">
            {plans.map((plan) => {
              const isSelected = plan.id === selectedPlanId
              const planPrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
              const PlanIcon = plan.icon

              return (
                <div
                  key={plan.id}
                  onMouseEnter={() => setSelectedPlanId(plan.id)}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`group relative text-left py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                    isSelected 
                    ? 'bg-white/10 border-white/30 opacity-100 shadow-xl' 
                    : 'bg-black/40 border-white/5 opacity-50 hover:opacity-90 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Active Brightness Indicator Bar */}
                    <div className={`w-1 h-8 rounded-full transition-all duration-300 ${
                      isSelected ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,1)]' : 'bg-transparent'
                    }`} />

                    <div className={`transition-colors duration-200 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                      <PlanIcon size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base sm:text-lg font-black uppercase font-['Syne'] tracking-wide transition-all duration-200 ${
                          isSelected ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-gray-400'
                        }`}>
                          {plan.name}
                        </span>
                        {plan.badge && isSelected && (
                          <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider text-black bg-white">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-medium transition-colors duration-200 ${
                        isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xl sm:text-2xl font-black block font-['Syne'] transition-all duration-200 ${
                      isSelected ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-gray-500'
                    }`}>
                      ₹{planPrice.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                      isSelected ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      /mo
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Live Showcase Matrix */}
          <div className="lg:col-span-7 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlan.id + billingCycle}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-black/80 border border-white/20 backdrop-blur-2xl shadow-2xl relative"
              >
                <div>
                  {/* Top Details Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-5">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">
                        SELECTED MEMBERSHIP
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-['Syne'] tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                        {activePlan.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-md font-medium">
                        {activePlan.summary}
                      </p>
                    </div>

                    <div className="text-right">
                      {activePlan.prefix && (
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                          {activePlan.prefix}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-['Syne'] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                          ₹{currentPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-xs font-semibold">/month</span>
                      </div>
                      {billingCycle === 'annual' && currentPrice > 0 && (
                        <span className="text-[10px] font-semibold text-gray-400 mt-0.5 block">
                          Billed annually (₹{(currentPrice * 12).toLocaleString()}/yr)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feature Checklist Grid */}
                  <div className="py-4">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-3">
                      INCLUDED IN THIS PLAN:
                    </span>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {activePlan.features.map((feat, idx) => {
                        const isIncluded = feat.status === 'Included'
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-2.5 text-xs p-3 rounded-xl transition-colors border ${
                              isIncluded 
                                ? (feat.highlight ? 'bg-white/15 text-white font-bold border-white/20' : 'bg-white/5 text-gray-200 border-white/10') 
                                : 'bg-black/40 text-gray-600 line-through border-transparent'
                            }`}
                          >
                            <div className={`shrink-0 rounded-full p-0.5 ${
                              isIncluded ? 'text-white' : 'text-gray-700'
                            }`}>
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <span className="truncate">{feat.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                  <div className="text-xs text-gray-400 font-medium">
                    ✦ <span className="text-white font-semibold">7-Day Free Trial</span> · Instant 1-Click Cancellation
                  </div>

                  {(() => {
                    let ctaText = activePlan.cta
                    let targetRoute = activePlan.route

                    if (user && activePlan.id === 'free') {
                      ctaText = 'Go to Dashboard'
                      targetRoute = user.role === 'admin' ? '/admin' : user.role === 'user' ? '/dashboard' : '/trainer/dashboard'
                    }

                    return (
                      <button
                        onClick={() => navigate(targetRoute)}
                        className="w-full sm:w-auto py-3 px-8 rounded-xl font-extrabold text-xs uppercase tracking-wider text-black bg-white hover:bg-gray-200 shadow-[0_4px_20px_rgba(255,255,255,0.25)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>{ctaText}</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    )
                  })()}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="shrink-0 flex items-center justify-center gap-8 text-[11px] text-gray-400 font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-white" />
            <span>Risk-Free Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-white" />
            <span>Transparent Pricing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-white" />
            <span>Certified Fitness Coaches</span>
          </div>
        </div>

      </div>
    </section>
  )
}
