import { Calendar as CalendarIcon, Check, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'

export default function ClientDashboardPage() {
  const { user } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 22) return 'Good evening'
    return 'Good night'
  }

  const greeting = getGreeting()
  const firstName = user?.name ? user.name.split(' ')[0] : 'User'
  
  const today = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const glassCard = "bg-white/5 border border-white/10 rounded-[16px] p-6 transition-all hover:border-white/20"
  const blueCard = "bg-[#F97316]/10 border border-[#F97316]/30 rounded-[16px] p-6 transition-all"

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative z-10">
      
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">{greeting}, {firstName}</h1>
        <p className="text-gray-400 font-medium text-[14px] mt-1">{today} — here's your overview</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={glassCard}>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Weight</p>
          <p className="text-[24px] font-bold text-white mb-1">72.4 kg</p>
          <p className="text-[13px] font-bold text-[#F97316]">-0.3 this week</p>
        </div>
        <div className={glassCard}>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Body Fat</p>
          <p className="text-[24px] font-bold text-white mb-1">18.2%</p>
          <p className="text-[13px] font-bold text-[#F97316]">-0.4 this week</p>
        </div>
        <div className={glassCard}>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Workouts</p>
          <p className="text-[24px] font-bold text-white mb-1">14</p>
          <p className="text-[13px] font-bold text-gray-500">this month</p>
        </div>
        <div className={blueCard}>
          <p className="text-[11px] font-bold text-[#F97316] uppercase tracking-wider mb-2">Streak</p>
          <p className="text-[24px] font-bold text-white mb-1">7 days</p>
          <p className="text-[13px] font-bold text-[#F97316]/80">personal best</p>
        </div>
      </div>

      {/* Second Row Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Today's Calories */}
        <div className={`${glassCard} flex flex-col`}>
          <h2 className="text-[20px] font-bold text-white mb-8">Today's Calories</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center mb-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* SVG Circle Chart Mock */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-white/10" strokeWidth="16" fill="none" />
                <circle cx="80" cy="80" r="70" className="stroke-[#F97316]" strokeWidth="16" strokeDasharray="440" strokeDashoffset="140" fill="none" strokeLinecap="round" />
              </svg>
              <div className="text-center mt-1">
                <p className="text-[28px] font-bold text-white">1,360</p>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">of 2,000 kcal</p>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="flex justify-between px-2 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="w-12 h-1.5 bg-[#F97316] rounded-full mb-3 mx-auto shadow-sm"></div>
              <p className="text-[16px] font-bold text-white">98g</p>
              <p className="text-[12px] text-gray-400 font-bold mt-1">Protein</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-1.5 bg-[#F97316]/70 rounded-full mb-3 mx-auto shadow-sm"></div>
              <p className="text-[16px] font-bold text-white">156g</p>
              <p className="text-[12px] text-gray-400 font-bold mt-1">Carbs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-1.5 bg-[#F97316]/40 rounded-full mb-3 mx-auto shadow-sm"></div>
              <p className="text-[16px] font-bold text-white">42g</p>
              <p className="text-[12px] text-gray-400 font-bold mt-1">Fat</p>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div className={`${glassCard} flex flex-col`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-bold text-white">Today's Workout</h2>
            <span className="px-3 py-1 bg-[#F97316]/20 text-[#F97316] text-[11px] font-bold rounded-full uppercase tracking-wider border border-[#F97316]/30">Upper Body</span>
          </div>
          
          <div className="space-y-5 mb-8 flex-1">
            {[
              { name: 'Bench Press', sets: '4x8', done: true },
              { name: 'Pull-ups', sets: '3x10', done: true },
              { name: 'OHP', sets: '3x8', done: false },
              { name: 'Lateral Raises', sets: '3x15', done: false },
              { name: 'Face Pulls', sets: '3x20', done: false }
            ].map((ex, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    ex.done ? 'bg-[#F97316] border-[#F97316] text-white shadow-sm' : 'border-white/20 bg-transparent'
                  }`}>
                    {ex.done && <Check size={14} strokeWidth={4} />}
                  </div>
                  <span className={`text-[15px] font-bold ${ex.done ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {ex.name}
                  </span>
                </div>
                <span className="text-[13px] text-gray-400 font-bold">{ex.sets}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Progress</span>
              <span className="text-[12px] text-[#F97316] font-bold">2 / 5 done</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-2/5 h-full bg-[#F97316] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className={glassCard}>
          <h2 className="text-[20px] font-bold text-white mb-8">Upcoming Sessions</h2>
          <div className="space-y-6">
            {[
              { title: 'Strength with Alex Chen', time: 'Today, 6:00 PM · 60 min', active: true },
              { title: 'HIIT with Alex Chen', time: 'Sat Dec 14, 9:00 AM · 45 min', active: false },
              { title: 'Strength with Alex Chen', time: 'Mon Dec 16, 6:00 PM · 60 min', active: false }
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 ${s.active ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <p className={`font-bold text-[15px] leading-tight mb-1.5 ${s.active ? 'text-white' : 'text-gray-400'}`}>{s.title}</p>
                  <p className={`text-[13px] font-bold ${s.active ? 'text-[#F97316]' : 'text-gray-500'}`}>{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Weekly Calorie Intake (Mocked Chart) */}
      <div className={`${glassCard} relative overflow-hidden`}>
        <h2 className="text-[20px] font-bold text-white mb-8">Weekly Calorie Intake</h2>
        
        <div className="h-64 relative w-full flex items-end">
          {/* Y Axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[12px] font-bold text-gray-500 py-2">
            <span>2500</span>
            <span>2250</span>
            <span>2000</span>
            <span>1750</span>
          </div>

          {/* Grid lines */}
          <div className="absolute left-14 right-0 top-0 bottom-0 flex flex-col justify-between py-3">
            <div className="w-full border-b border-dashed border-white/10"></div>
            <div className="w-full border-b border-dashed border-white/10"></div>
            <div className="w-full border-b border-dashed border-white/10"></div>
            <div className="w-full border-b border-dashed border-white/10"></div>
          </div>

          {/* SVG Line Chart Mock */}
          <div className="absolute left-14 right-0 top-0 bottom-0 px-4">
             <svg className="w-full h-full drop-shadow-[0_4px_12px_rgba(249,115,22,0.25)]" viewBox="0 0 1000 200" preserveAspectRatio="none">
               <path 
                 d="M0,150 C100,100 200,90 300,100 C400,120 500,140 600,110 C700,70 800,160 900,120 L1000,150" 
                 fill="none" 
                 stroke="#F97316" 
                 strokeWidth="4" 
                 strokeLinecap="round"
               />
               <circle cx="250" cy="95" r="6" fill="#F97316" stroke="#07080C" strokeWidth="3" />
             </svg>
             {/* Tooltip mockup */}
             <div className="absolute left-[20%] top-[30%] bg-[#1E293B] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-[10px] p-3 px-4 z-10">
               <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Tue</p>
               <p className="text-[14px] font-bold text-white">2,100 kcal</p>
             </div>
          </div>
        </div>
      </div>

      {/* AI Transform Preview Banner */}
      <Link
        to="/transform-preview"
        className="block group relative overflow-hidden rounded-[20px] border border-[#F97316]/30 bg-gradient-to-r from-[#F97316]/10 via-[#F97316]/5 to-transparent hover:from-[#F97316]/20 hover:border-[#F97316]/50 transition-all duration-300 p-7"
      >
        {/* Glow orb */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-[#F97316]/20 transition-all duration-500" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(249,115,22,0.4)] transition-all duration-300">
              <Sparkles size={26} className="text-[#F97316]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-2 py-0.5 rounded-full">AI Preview</span>
              </div>
              <h2 className="text-[20px] font-bold text-white leading-tight">See Your Transformation Before You Start</h2>
              <p className="text-[13px] text-gray-400 mt-1">Upload 4 quick photos, pick your goal, and let AI generate a hyper-realistic physique preview.</p>
            </div>
          </div>
          <div className="shrink-0 ml-6 flex items-center gap-2 text-[#F97316] font-bold text-[14px] group-hover:translate-x-1 transition-transform duration-300">
            <span className="hidden sm:block">Try Now</span>
            <ArrowRight size={20} />
          </div>
        </div>
      </Link>

    </div>
  )
}
