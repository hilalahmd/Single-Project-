import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Check } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Card from '../../../shared/components/Card'
import Badge from '../../../shared/components/Badge'

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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-black mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-500">Transform your life with expert coaching.</p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
          >
            Annual <Badge label="20% Off" variant="active" className="text-[10px] px-1.5 py-0" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
        
        {/* Free Plan */}
        <Card className="flex flex-col">
          <h3 className="text-2xl font-bold mb-2 text-black">Free</h3>
          <div className="mb-6"><span className="text-4xl font-black text-black">₹{pricing.free.mo}</span><span className="text-gray-500">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">Basic tools to get you started.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />BMI/BMR calculators</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />AI diet plan (3 generations/mo)</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Browse all trainers</li>
          </ul>
          <Button variant="secondary" fullWidth onClick={() => navigate('/auth/register')}>Get Started</Button>
        </Card>

        {/* Wellness Plan */}
        <Card className="flex flex-col border-black shadow-xl relative lg:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold mb-2 text-black">Wellness</h3>
          <div className="mb-6"><span className="text-4xl font-black text-black">₹{Math.round(isAnnual ? pricing.wellness.yr : pricing.wellness.mo)}</span><span className="text-gray-500">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">Complete lifestyle coaching and daily tracking.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-black font-bold"><Check size={18} className="shrink-0" />Dedicated wellness coach</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Custom Diet + Workout plan</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Progress tracking dashboard</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Unlimited AI food photo analysis</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Chat support with coach</li>
          </ul>
          <Button variant="primary" fullWidth onClick={() => navigate('/auth/register')}>Choose Wellness</Button>
        </Card>

        {/* PT Plan */}
        <Card className="flex flex-col">
          <h3 className="text-2xl font-bold mb-2 text-black">Personal Training</h3>
          <div className="mb-6"><span className="text-4xl font-black text-black">₹{Math.round(isAnnual ? pricing.pt.yr : pricing.pt.mo)}</span><span className="text-gray-500">/{isAnnual ? 'year' : 'month'}</span></div>
          <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8">Premium 1-on-1 coaching for guaranteed results.</p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-black font-bold"><Check size={18} className="shrink-0" />Everything in Wellness</li>
            <li className="flex items-start gap-3 text-black font-bold"><Check size={18} className="shrink-0" />Live 1-on-1 video sessions</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Real-time form correction</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Priority support</li>
            <li className="flex items-start gap-3 text-gray-600"><Check size={18} className="shrink-0 text-black" />Weekly check-in calls</li>
          </ul>
          <Button variant="primary" fullWidth onClick={() => navigate('/auth/register')}>Choose PT</Button>
        </Card>

      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-10 text-black">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-black">{faq.q}</span>
                <ChevronDown size={20} className={`text-black transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50">
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
