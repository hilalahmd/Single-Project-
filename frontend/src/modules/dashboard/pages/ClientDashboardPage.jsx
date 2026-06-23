import { Calendar as CalendarIcon, Check } from 'lucide-react'

export default function ClientDashboardPage() {
  const today = "Thursday, December 12"

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Good morning, Jordan</h1>
        <p className="text-gray-400 font-medium text-[14px] mt-1">{today} — here's your overview</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#2563EB] transition-colors">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Weight</p>
          <p className="text-[32px] font-bold text-white mb-1">72.4 kg</p>
          <p className="text-[13px] font-medium text-[#22C55E]">-0.3 this week</p>
        </div>
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#2563EB] transition-colors">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Body Fat</p>
          <p className="text-[32px] font-bold text-white mb-1">18.2%</p>
          <p className="text-[13px] font-medium text-[#22C55E]">-0.4 this week</p>
        </div>
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#2563EB] transition-colors">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Workouts</p>
          <p className="text-[32px] font-bold text-white mb-1">14</p>
          <p className="text-[13px] font-medium text-gray-500">this month</p>
        </div>
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#2563EB] transition-colors">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Streak</p>
          <p className="text-[32px] font-bold text-[#2563EB] mb-1">7 days</p>
          <p className="text-[13px] font-medium text-[#F59E0B]">personal best</p>
        </div>
      </div>

      {/* Second Row Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Today's Calories */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-sm flex flex-col hover:border-[#2563EB] transition-colors">
          <h2 className="text-[20px] font-semibold text-white mb-8">Today's Calories</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center mb-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* SVG Circle Chart Mock */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-[#0F172A]" strokeWidth="16" fill="none" />
                <circle cx="80" cy="80" r="70" className="stroke-[#2563EB]" strokeWidth="16" strokeDasharray="440" strokeDashoffset="140" fill="none" strokeLinecap="round" />
              </svg>
              <div className="text-center mt-1">
                <p className="text-[28px] font-bold text-white">1,360</p>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">of 2,000 kcal</p>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="flex justify-between px-2 pt-6 border-t border-[#1E293B]">
            <div className="text-center">
              <div className="w-12 h-1.5 bg-[#2563EB] rounded-full mb-3 mx-auto"></div>
              <p className="text-[16px] font-bold text-white">98g</p>
              <p className="text-[12px] text-gray-500 font-medium mt-1">Protein</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-1.5 bg-[#22C55E] rounded-full mb-3 mx-auto"></div>
              <p className="text-[16px] font-bold text-white">156g</p>
              <p className="text-[12px] text-gray-500 font-medium mt-1">Carbs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-1.5 bg-[#F59E0B] rounded-full mb-3 mx-auto"></div>
              <p className="text-[16px] font-bold text-white">42g</p>
              <p className="text-[12px] text-gray-500 font-medium mt-1">Fat</p>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-sm flex flex-col hover:border-[#2563EB] transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-semibold text-white">Today's Workout</h2>
            <span className="px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 text-[11px] font-bold rounded-lg uppercase tracking-wider">Upper Body</span>
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    ex.done ? 'bg-[#22C55E] border-[#22C55E] text-[#111827]' : 'border-[#1E293B] bg-[#0F172A]'
                  }`}>
                    {ex.done && <Check size={14} strokeWidth={4} />}
                  </div>
                  <span className={`text-[15px] font-semibold ${ex.done ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {ex.name}
                  </span>
                </div>
                <span className="text-[13px] text-gray-400 font-medium">{ex.sets}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#1E293B]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Progress</span>
              <span className="text-[12px] text-gray-300 font-bold">2 / 5 done</span>
            </div>
            <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B]">
              <div className="w-2/5 h-full bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-sm hover:border-[#2563EB] transition-colors">
          <h2 className="text-[20px] font-semibold text-white mb-8">Upcoming Sessions</h2>
          <div className="space-y-6">
            {[
              { title: 'Strength with Alex Chen', time: 'Today, 6:00 PM · 60 min', active: true },
              { title: 'HIIT with Alex Chen', time: 'Sat Dec 14, 9:00 AM · 45 min', active: false },
              { title: 'Strength with Alex Chen', time: 'Mon Dec 16, 6:00 PM · 60 min', active: false }
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${s.active ? 'bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]' : 'bg-[#0F172A] border-[#1E293B] text-gray-500'}`}>
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <p className={`font-semibold text-[15px] leading-tight mb-1.5 ${s.active ? 'text-white' : 'text-gray-300'}`}>{s.title}</p>
                  <p className={`text-[13px] font-medium ${s.active ? 'text-[#2563EB]' : 'text-gray-500'}`}>{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Weekly Calorie Intake (Mocked Chart) */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-sm relative overflow-hidden hover:border-[#2563EB] transition-colors">
        <h2 className="text-[20px] font-semibold text-white mb-8">Weekly Calorie Intake</h2>
        
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
            <div className="w-full border-b border-dashed border-[#1E293B]"></div>
            <div className="w-full border-b border-dashed border-[#1E293B]"></div>
            <div className="w-full border-b border-dashed border-[#1E293B]"></div>
            <div className="w-full border-b border-dashed border-[#1E293B]"></div>
          </div>

          {/* SVG Line Chart Mock */}
          <div className="absolute left-14 right-0 top-0 bottom-0 px-4">
             <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]" viewBox="0 0 1000 200" preserveAspectRatio="none">
               <path 
                 d="M0,150 C100,100 200,90 300,100 C400,120 500,140 600,110 C700,70 800,160 900,120 L1000,150" 
                 fill="none" 
                 stroke="#2563EB" 
                 strokeWidth="4" 
                 strokeLinecap="round"
               />
               <circle cx="250" cy="95" r="6" fill="#2563EB" stroke="#111827" strokeWidth="3" />
             </svg>
             {/* Tooltip mockup */}
             <div className="absolute left-[20%] top-[30%] bg-[#0F172A] border border-[#2563EB]/30 shadow-[0_0_20px_rgba(37,99,235,0.1)] rounded-xl p-3 px-4 z-10">
               <p className="text-[11px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Tue</p>
               <p className="text-[14px] font-bold text-white">2,100 kcal</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  )
}
