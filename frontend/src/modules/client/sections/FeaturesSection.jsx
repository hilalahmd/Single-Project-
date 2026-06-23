import { Video, Camera, TrendingUp, MessageCircle, Utensils, Clock } from 'lucide-react'

const FEATURES = [
  { icon: Video,         title: 'Live 1-on-1 Video Sessions',  desc: 'Train face-to-face with your coach from home — real-time form correction included.' },
  { icon: Camera,        title: 'AI Food Photo Analysis',       desc: 'Photograph any Indian meal for an instant calorie and macro breakdown.' },
  { icon: TrendingUp,    title: 'Progress Tracker',             desc: 'Visual charts for weight, measurements, strength — watch yourself improve.' },
  { icon: MessageCircle, title: 'Real-time Chat',               desc: 'Message your dedicated coach anytime between sessions for guidance.' },
  { icon: Utensils,      title: 'Personalised Diet Plans',      desc: 'Custom meal plans for dosa, idli, biryani, roti — food you actually eat.' },
  { icon: Clock,         title: 'Flexible Scheduling',          desc: 'Book sessions that fit your life. Morning, evening, weekends — your call.' },
]

const COLORS = ['#2563EB', '#00E5FF', '#10B981', '#F59E0B', '#EF4444', '#7C3AED']

export default function FeaturesSection() {
  return (
    <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[clamp(2rem,4.5vw,4rem)] font-black text-white font-['Syne'] tracking-tight">
            Everything You Need
          </h2>
          <p className="text-gray-400 text-base mt-3 max-w-xl mx-auto">
            One platform. Every tool you need to transform your body and lifestyle.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/8 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div
                className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${COLORS[i]}18`,
                  border: `1px solid ${COLORS[i]}40`,
                }}
              >
                <f.icon className="w-5 h-5" style={{ color: COLORS[i] }} />
              </div>
              <div>
                <div className="font-bold text-white text-sm mb-1 leading-snug">{f.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed hidden md:block">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
