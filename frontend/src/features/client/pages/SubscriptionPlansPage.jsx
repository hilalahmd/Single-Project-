import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Check } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'

export default function SubscriptionPlansPage() {
  const navigate = useNavigate()
  const { user, updateSubscription } = useAuth()
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'Can I switch trainers later?', a: 'Yes, you can request a change of coach at any time from your dashboard.' },
    { q: 'How does live video training work?', a: 'You and your coach join a secure video call directly from the platform. They guide your form in real-time.' },
    { q: 'Is the diet plan customized for Indian food?', a: 'Absolutely. Our AI and coaches are trained on diverse regional diets, from Kerala Sadya to North Indian rotis.' },
    { q: 'What happens if I miss a live session?', a: 'Sessions can be rescheduled up to 24 hours in advance without penalty.' },
  ]

  const pricing = {
    free: { mo: 0, yr: 0 },
    wellness: { mo: 999, yr: 999 * 12 * 0.8 },
    pt: { mo: 2499, yr: 2499 * 12 * 0.8 }
  }

  const handleSelectPlan = (planName) => {
    if (planName === 'free') {
      if (user) {
        updateSubscription('free')
        navigate('/dashboard')
      } else {
        navigate('/auth/register')
      }
    } else {
      if (user) {
        navigate('/dashboard/subscription', { state: { plan: planName } })
      } else {
        navigate('/auth/register')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-[40px] font-bold text-white mb-4 tracking-tight font-['Syne']">Choose Your Plan</h1>
        <p className="text-[16px] text-gray-400">Transform your life with expert coaching.</p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-20 relative z-10">
        <div className="bg-[#0f1117] p-1.5 rounded-full flex items-center relative border border-[rgba(255,255,255,0.08)] shadow-lg">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-8 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 ${!isAnnual ? 'bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] shadow-[0_0_15px_rgba(255,107,26,0.3)] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-8 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? 'bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] shadow-[0_0_15px_rgba(255,107,26,0.3)] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Annual <span className="bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">20% Off</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24 relative">
        
        {/* Ambient glow behind Wellness card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#ff6b1a]/10 blur-[100px] rounded-full pointer-events-none z-0 hidden lg:block"></div>

        {/* Free Plan */}
        <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 flex flex-col hover:border-[#ff6b1a]/40 transition-colors relative z-10 shadow-lg">
          <h3 className="text-[22px] font-bold mb-2 text-white">Free</h3>
          <div className="mb-6"><span className="text-[40px] font-black text-white font-['Syne']">₹{pricing.free.mo}</span><span className="text-gray-500 font-medium">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-[14px] text-gray-400 mb-8 border-b border-[rgba(255,255,255,0.08)] pb-8">Basic tools to get you started.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-gray-300 text-[14px] font-medium"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />BMI/BMR calculators</li>
            <li className="flex items-start gap-3 text-gray-300 text-[14px] font-medium"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />AI diet plan (3 generations/mo)</li>
            <li className="flex items-start gap-3 text-gray-300 text-[14px] font-medium"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Browse all trainers</li>
          </ul>
          <button 
            className="w-full py-3.5 border border-[rgba(255,255,255,0.1)] text-white text-[15px] font-bold rounded-full hover:bg-white/5 hover:text-[#ff6b1a] transition-colors cursor-pointer" 
            onClick={() => handleSelectPlan('free')}
          >
            {user ? 'Select Free' : 'Get Started'}
          </button>
        </div>

        {/* Wellness Plan */}
        <div className="bg-[#0f1117] border border-[#ff6b1a] rounded-[20px] p-8 flex flex-col shadow-[0_0_30px_rgba(255,107,26,0.15)] relative z-20 lg:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white text-[11px] font-bold px-5 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(255,107,26,0.4)] border border-[#ff6b1a]/50">
            Most Popular
          </div>
          <h3 className="text-[22px] font-bold mb-2 text-white">Wellness</h3>
          <div className="mb-6"><span className="text-[40px] font-black text-white font-['Syne']">₹{Math.round(isAnnual ? pricing.wellness.yr : pricing.wellness.mo)}</span><span className="text-gray-500 font-medium">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-[14px] text-gray-400 mb-8 border-b border-[rgba(255,255,255,0.08)] pb-8">Complete lifestyle coaching and daily tracking.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-white font-bold text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Dedicated wellness coach</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Custom Diet + Workout plan</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Progress tracking dashboard</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Unlimited AI food photo analysis</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Chat support with coach</li>
          </ul>
          <button 
            className="w-full py-4 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white text-[15px] font-bold rounded-full hover:shadow-[0_0_25px_rgba(255,107,26,0.5)] transition-all duration-300 uppercase tracking-wide cursor-pointer" 
            onClick={() => handleSelectPlan('wellness')}
          >
            Choose Wellness
          </button>
        </div>

        {/* PT Plan */}
        <div className="bg-[#0f1117] rounded-[20px] p-[1px] flex flex-col relative z-10 shadow-xl group hover:shadow-[0_0_30px_rgba(255,107,26,0.1)] transition-all bg-gradient-to-br from-[rgba(255,255,255,0.15)] via-transparent to-[rgba(255,107,26,0.2)]">
          <div className="bg-[#0f1117] rounded-[19px] p-8 flex flex-col h-full border border-[rgba(255,255,255,0.02)]">
            <h3 className="text-[22px] font-bold mb-2 text-white">Personal Training</h3>
            <div className="mb-6"><span className="text-[40px] font-black text-white font-['Syne']">₹{Math.round(isAnnual ? pricing.pt.yr : pricing.pt.mo)}</span><span className="text-gray-500 font-medium">/{isAnnual ? 'year' : 'month'}</span></div>
            <p className="text-[14px] text-gray-400 mb-8 border-b border-[rgba(255,255,255,0.08)] pb-8">Premium 1-on-1 coaching for guaranteed results.</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-white font-bold text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Everything in Wellness</li>
              <li className="flex items-start gap-3 text-white font-bold text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Live 1-on-1 video sessions</li>
              <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Real-time form correction</li>
              <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Priority support</li>
              <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} strokeWidth={2.5} className="shrink-0 text-[#ff6b1a]" />Weekly check-in calls</li>
            </ul>
            <button 
              className="w-full py-4 border-2 border-[rgba(255,255,255,0.1)] bg-white/5 text-white text-[15px] font-bold rounded-full group-hover:border-[#ff6b1a]/50 transition-colors uppercase tracking-wide cursor-pointer" 
              onClick={() => handleSelectPlan('pt')}
            >
              Choose PT
            </button>
          </div>
        </div>

      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[28px] font-bold text-center mb-10 text-white font-['Syne']">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#1E293B] rounded-xl overflow-hidden bg-[#111827]">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0F172A] transition-colors"
              >
                <span className="font-semibold text-white text-[15px]">{faq.q}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-gray-400 text-[14px] leading-relaxed border-t border-[#1E293B] pt-4 bg-[#0F172A]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
