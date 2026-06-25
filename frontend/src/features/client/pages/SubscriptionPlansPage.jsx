import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Check } from 'lucide-react'

export default function SubscriptionPlansPage() {
  const navigate = useNavigate()
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-[40px] font-bold text-white mb-4 tracking-tight">Choose Your Plan</h1>
        <p className="text-[16px] text-gray-400">Transform your life with expert coaching.</p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-[#111827] p-1.5 rounded-full flex items-center relative border border-[#1E293B]">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-8 py-2.5 rounded-full text-[14px] font-semibold transition-all ${!isAnnual ? 'bg-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.3)] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-8 py-2.5 rounded-full text-[14px] font-semibold transition-all flex items-center gap-2 ${isAnnual ? 'bg-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.3)] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Annual <span className="bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">20% Off</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
        
        {/* Free Plan */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 flex flex-col hover:border-[#2563EB]/50 transition-colors">
          <h3 className="text-[22px] font-bold mb-2 text-white">Free</h3>
          <div className="mb-6"><span className="text-[40px] font-bold text-white">₹{pricing.free.mo}</span><span className="text-gray-500 font-medium">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-[14px] text-gray-400 mb-8 border-b border-[#1E293B] pb-8">Basic tools to get you started.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-gray-300 text-[14px] font-medium"><Check size={20} className="shrink-0 text-[#2563EB]" />BMI/BMR calculators</li>
            <li className="flex items-start gap-3 text-gray-300 text-[14px] font-medium"><Check size={20} className="shrink-0 text-[#2563EB]" />AI diet plan (3 generations/mo)</li>
            <li className="flex items-start gap-3 text-gray-300 text-[14px] font-medium"><Check size={20} className="shrink-0 text-[#2563EB]" />Browse all trainers</li>
          </ul>
          <button className="w-full py-3.5 border border-[#1E293B] text-white text-[15px] font-semibold rounded-lg hover:bg-[#111827] hover:border-[#2563EB] transition-colors" onClick={() => navigate('/auth/register')}>Get Started</button>
        </div>

        {/* Wellness Plan */}
        <div className="bg-[#111827] border border-[#2563EB] rounded-2xl p-8 flex flex-col shadow-[0_0_30px_rgba(37,99,235,0.1)] relative lg:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Most Popular
          </div>
          <h3 className="text-[22px] font-bold mb-2 text-white">Wellness</h3>
          <div className="mb-6"><span className="text-[40px] font-bold text-white">₹{Math.round(isAnnual ? pricing.wellness.yr : pricing.wellness.mo)}</span><span className="text-gray-500 font-medium">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-[14px] text-gray-400 mb-8 border-b border-[#1E293B] pb-8">Complete lifestyle coaching and daily tracking.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-white font-semibold text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Dedicated wellness coach</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Custom Diet + Workout plan</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Progress tracking dashboard</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Unlimited AI food photo analysis</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Chat support with coach</li>
          </ul>
          <button className="w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-600 text-white text-[15px] font-semibold rounded-lg hover:to-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all" onClick={() => navigate('/auth/register')}>Choose Wellness</button>
        </div>

        {/* PT Plan */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-8 flex flex-col hover:border-[#2563EB]/50 transition-colors">
          <h3 className="text-[22px] font-bold mb-2 text-white">Personal Training</h3>
          <div className="mb-6"><span className="text-[40px] font-bold text-white">₹{Math.round(isAnnual ? pricing.pt.yr : pricing.pt.mo)}</span><span className="text-gray-500 font-medium">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-[14px] text-gray-400 mb-8 border-b border-[#1E293B] pb-8">Premium 1-on-1 coaching for guaranteed results.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-white font-semibold text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Everything in Wellness</li>
            <li className="flex items-start gap-3 text-white font-semibold text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Live 1-on-1 video sessions</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Real-time form correction</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Priority support</li>
            <li className="flex items-start gap-3 text-gray-300 font-medium text-[14px]"><Check size={20} className="shrink-0 text-[#2563EB]" />Weekly check-in calls</li>
          </ul>
          <button className="w-full py-3.5 border border-[#1E293B] bg-[#111827] text-white text-[15px] font-semibold rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition-colors" onClick={() => navigate('/auth/register')}>Choose PT</button>
        </div>

      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[28px] font-bold text-center mb-10 text-white">Frequently Asked Questions</h2>
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
