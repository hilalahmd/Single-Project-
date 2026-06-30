import { useNavigate } from 'react-router-dom'
import { Camera, Brain, Zap, Shield, ChevronRight } from 'lucide-react'

const FEATURES = [
  { icon: Brain,   label: 'Trained on Indian food profiles' },
  { icon: Zap,     label: 'Results in under 60 seconds' },
  { icon: Camera,  label: 'Photograph meals for live tracking' },
  { icon: Shield,  label: 'No account or credit card needed' },
]

const MEALS = [
  { time: 'Breakfast', meal: 'Oats Idli with Sambar',     kcal: '350 kcal · 12g Protein', emoji: '🍽️' },
  { time: 'Lunch',     meal: 'Brown Rice & Paneer Curry',  kcal: '550 kcal · 35g Protein', emoji: '🍛' },
  { time: 'Snack',     meal: 'Sprout Chaat / Mixed Nuts',  kcal: '200 kcal · 8g Protein',  emoji: '🥗' },
  { time: 'Dinner',    meal: 'Multigrain Roti & Dal',      kcal: '400 kcal · 15g Protein', emoji: '🫓' },
]

export default function FreeDietSection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-bold px-4 py-2 rounded-full tracking-[0.15em] uppercase mb-5">
            <Camera size={13} /> AI Diet Analysis
          </div>
          <h2 className="text-[clamp(2rem,4.5vw,4rem)] font-black text-white font-['Syne'] tracking-tight leading-[0.9] mb-5">
            Explore Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#EA580C]">
              Free Diet Plan
            </span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-md">
            Our AI understands Indian meal patterns — dosa, idli, biryani, roti, dal — and generates your precise macro plan in under 60 seconds.
          </p>
          <div className="space-y-3 mb-7">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 border border-[#F97316]/25 flex items-center justify-center shrink-0">
                  <f.icon size={14} className="text-[#F97316]" />
                </div>
                <span className="font-medium text-sm">{f.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/free-diet-plan')}
            className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-[800] text-sm uppercase tracking-widest hover:opacity-90 hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)', boxShadow: '0 0 30px rgba(249,115,22,0.25)' }}
          >
            Generate Free Diet Plan <ChevronRight size={17} />
          </button>
        </div>

        {/* Right: preview card */}
        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 bg-gradient-to-br from-[#F97316]/15 to-[#EA580C]/15 rounded-3xl blur-2xl" />
          <div className="relative bg-[#0D0F18]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-1.5 mb-5 pb-4 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-gray-500">FitForge AI · Free Plan Generator</span>
            </div>
            {MEALS.map((m, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-2xl leading-none mt-0.5">{m.emoji}</span>
                <div>
                  <div className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest mb-0.5">{m.time}</div>
                  <div className="font-bold text-white text-sm">{m.meal}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.kcal}</div>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Daily Total</span>
              <span className="text-[#F97316] font-black">~1,850 kcal</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
