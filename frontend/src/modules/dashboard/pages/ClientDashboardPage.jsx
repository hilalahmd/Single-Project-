import { Calendar as CalendarIcon, Check } from 'lucide-react'

export default function ClientDashboardPage() {
  const today = "Thursday, December 12"

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-[#1A1A1A]">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight">Good morning, Jordan</h1>
        <p className="text-gray-500 font-medium text-sm mt-1">{today} — here's your overview</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5 shadow-sm">
          <p className="text-[13px] text-gray-500 font-medium mb-2">Weight</p>
          <p className="text-3xl font-bold mb-1">72.4 kg</p>
          <p className="text-[13px] text-gray-400 font-medium">-0.3 this week</p>
        </div>
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5 shadow-sm">
          <p className="text-[13px] text-gray-500 font-medium mb-2">Body Fat</p>
          <p className="text-3xl font-bold mb-1">18.2%</p>
          <p className="text-[13px] text-gray-400 font-medium">-0.4 this week</p>
        </div>
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5 shadow-sm">
          <p className="text-[13px] text-gray-500 font-medium mb-2">Workouts</p>
          <p className="text-3xl font-bold mb-1">14</p>
          <p className="text-[13px] text-gray-400 font-medium">this month</p>
        </div>
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-5 shadow-sm">
          <p className="text-[13px] text-gray-500 font-medium mb-2">Streak</p>
          <p className="text-3xl font-bold mb-1">7 days</p>
          <p className="text-[13px] text-gray-400 font-medium">personal best</p>
        </div>
      </div>

      {/* Second Row Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Today's Calories */}
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold mb-8">Today's Calories</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center mb-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* SVG Circle Chart Mock */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="stroke-gray-100" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="56" className="stroke-black" strokeWidth="12" strokeDasharray="351" strokeDashoffset="112" fill="none" strokeLinecap="round" />
              </svg>
              <div className="text-center mt-1">
                <p className="text-xl font-bold">1,360</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">of 2,000 kcal</p>
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="flex justify-between px-2 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="w-12 h-1.5 bg-black rounded-full mb-2 mx-auto"></div>
              <p className="text-sm font-bold">98g</p>
              <p className="text-[11px] text-gray-400 font-medium">Protein</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-1.5 bg-black rounded-full mb-2 mx-auto"></div>
              <p className="text-sm font-bold">156g</p>
              <p className="text-[11px] text-gray-400 font-medium">Carbs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-1.5 bg-black rounded-full mb-2 mx-auto"></div>
              <p className="text-sm font-bold">42g</p>
              <p className="text-[11px] text-gray-400 font-medium">Fat</p>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Today's Workout</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full">Upper Body</span>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            {[
              { name: 'Bench Press', sets: '4x8', done: true },
              { name: 'Pull-ups', sets: '3x10', done: true },
              { name: 'OHP', sets: '3x8', done: false },
              { name: 'Lateral Raises', sets: '3x15', done: false },
              { name: 'Face Pulls', sets: '3x20', done: false }
            ].map((ex, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    ex.done ? 'bg-black border-black text-white' : 'border-[#E5E4E0] bg-[#F9FAFB]'
                  }`}>
                    {ex.done && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span className={`text-sm font-medium ${ex.done ? 'text-gray-400 line-through' : 'text-black'}`}>
                    {ex.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">{ex.sets}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Progress</span>
              <span className="text-[11px] text-gray-500 font-bold">2 / 5 done</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-2/5 h-full bg-black rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Upcoming Sessions</h2>
          <div className="space-y-6">
            {[
              { title: 'Strength with Alex Chen', time: 'Today, 6:00 PM · 60 min' },
              { title: 'HIIT with Alex Chen', time: 'Sat Dec 14, 9:00 AM · 45 min' },
              { title: 'Strength with Alex Chen', time: 'Mon Dec 16, 6:00 PM · 60 min' }
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] border border-[#E5E4E0] flex items-center justify-center shrink-0">
                  <CalendarIcon size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-bold text-[14px] leading-tight mb-1">{s.title}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Weekly Calorie Intake (Mocked Chart) */}
      <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <h2 className="text-lg font-bold mb-6">Weekly Calorie Intake</h2>
        
        <div className="h-48 relative w-full flex items-end">
          {/* Y Axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[11px] font-semibold text-gray-400 py-2">
            <span>2500</span>
            <span>2250</span>
            <span>2000</span>
            <span>1750</span>
          </div>

          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between py-3">
            <div className="w-full border-b border-dashed border-gray-200"></div>
            <div className="w-full border-b border-dashed border-gray-200"></div>
            <div className="w-full border-b border-dashed border-gray-200"></div>
            <div className="w-full border-b border-dashed border-gray-200"></div>
          </div>

          {/* SVG Line Chart Mock */}
          <div className="absolute left-10 right-0 top-0 bottom-0 px-4">
             <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
               <path 
                 d="M0,150 C100,100 200,90 300,100 C400,120 500,140 600,110 C700,70 800,160 900,120 L1000,150" 
                 fill="none" 
                 stroke="black" 
                 strokeWidth="3" 
               />
               <circle cx="250" cy="95" r="4" fill="black" />
             </svg>
             {/* Tooltip mockup */}
             <div className="absolute left-[20%] top-[30%] bg-white border border-[#E5E4E0] shadow-md rounded-lg p-2 px-3 z-10">
               <p className="text-[11px] font-bold text-gray-500 mb-0.5">Tue</p>
               <p className="text-xs font-bold">calories : 2100</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  )
}
