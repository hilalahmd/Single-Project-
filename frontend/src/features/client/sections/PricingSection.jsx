import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    color: '#6B7494',
    features: ['BMI / BMR calculators', 'AI diet plan (3 per month)', 'Browse trainer profiles'],
    cta: 'Get Started Free',
    route: '/auth/register',
    highlight: false,
  },
  {
    name: 'Wellness',
    prefix: 'Starts from',
    price: '₹999',
    period: '/month',
    color: '#2563EB',
    badge: 'Most Popular',
    features: [
      'Dedicated wellness coach',
      'Custom diet + workout plan',
      'Progress tracking dashboard',
      'AI food photo analysis',
      'Real-time chat support',
    ],
    cta: 'Browse Wellness Coaches',
    route: '/trainers?type=wellness',
    highlight: true,
  },
  {
    name: 'Personal Training',
    prefix: 'Starts from',
    price: '₹2,499',
    period: '/month',
    color: '#7C3AED',
    features: [
      'Everything in Wellness',
      'Live 1-on-1 video sessions',
      'Real-time form correction',
      'Priority coach support',
    ],
    cta: 'Browse PT Coaches',
    route: '/trainers?type=personal_training',
    highlight: false,
  },
]

export default function PricingSection() {
  const navigate = useNavigate()

  return (
    <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[clamp(2rem,4.5vw,4rem)] font-black text-white font-['Syne'] tracking-tight">
            Simple Pricing
          </h2>
          <p className="text-gray-400 text-base mt-2">No hidden fees. No contracts. Cancel anytime.</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5 items-center">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`relative p-7 rounded-2xl border flex flex-col transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                plan.highlight
                  ? 'bg-[#111318] border-[#2563EB]/50 md:-translate-y-4'
                  : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-white/8'
              }`}
              style={plan.highlight ? { boxShadow: '0 0 40px rgba(37,99,235,0.2)' } : {}}
            >
              {plan.badge && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap"
                  style={{ background: plan.color }}
                >
                  {plan.badge}
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>

              <div className="mb-6 flex flex-col justify-center min-h-[4.5rem]">
                {plan.prefix && <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{plan.prefix}</div>}
                <div>
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-7 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm font-medium text-gray-300">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${plan.color}25`, border: `1px solid ${plan.color}60` }}
                    >
                      <Check size={9} style={{ color: plan.color }} strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(plan.route)}
                className="w-full py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.02]"
                style={
                  plan.highlight
                    ? { background: plan.color, color: 'white', boxShadow: `0 0 20px ${plan.color}60` }
                    : { background: 'rgba(255,255,255,0.08)', color: 'white' }
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 font-medium">
          All plans include a 7-day free trial · No credit card required to start
        </p>

      </div>
    </div>
  )
}
