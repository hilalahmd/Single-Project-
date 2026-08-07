import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import PricingSection from '../sections/PricingSection'

export default function SubscriptionPlansPage() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'Can I switch trainers later?', a: 'Yes, you can request a change of coach at any time from your dashboard.' },
    { q: 'How does live video training work?', a: 'You and your coach join a secure video call directly from the platform. They guide your form in real-time.' },
    { q: 'Is the diet plan customized for Indian food?', a: 'Absolutely. Our AI and coaches are trained on diverse regional diets, from Kerala Sadya to North Indian rotis.' },
    { q: 'What happens if I miss a live session?', a: 'Sessions can be rescheduled up to 24 hours in advance without penalty.' },
  ]

  return (
    <div className="min-h-screen bg-black text-white font-['Inter'] selection:bg-white selection:text-black">
      {/* Master-Class Black & White Video Pricing Section */}
      <div className="min-h-[88vh] flex items-center justify-center">
        <PricingSection />
      </div>

      {/* FAQs Section (Black & White Luxury Theme) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 relative z-20 border-t border-white/10">
        <h2 className="text-3xl font-black text-center mb-10 text-white font-['Syne'] uppercase tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/15 rounded-2xl overflow-hidden bg-[#0a0a0a]">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="font-bold text-white text-base">{faq.q}</span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-white' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-6 text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4 bg-[#0a0a0a]">
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
