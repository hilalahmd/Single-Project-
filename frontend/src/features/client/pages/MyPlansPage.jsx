import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import Badge from '../../../shared/components/Badge'

export default function MyPlansPage() {
  const [activeTab, setActiveTab] = useState('workout')
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDietDay, setActiveDietDay] = useState('Mon')
  const [expandedDay, setExpandedDay] = useState(1)

  const dietDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white">My Plans</h1>
        <p className="text-gray-400 mt-1">Your personalized routine for this month.</p>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-white/10 flex gap-8">
        {['workout', 'diet'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${
              activeTab === tab ? 'text-[#F97316]' : 'text-gray-400 hover:text-[#F97316]'
            }`}
          >
            {tab} Plan
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F97316] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'workout' && (
        <div className="space-y-6">
          {/* Week Selector */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(w => (
              <button 
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                  activeWeek === w ? 'bg-[#F97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]' : 'bg-white/10 text-gray-300 border border-white/20 hover:border-[#F97316] hover:text-[#F97316]'
                }`}
              >
                Week {w}
              </button>
            ))}
          </div>

          {/* Info Banner */}
          <div className="bg-[#F97316]/10 border border-[#F97316]/30 rounded-[16px] p-4 flex gap-3 text-sm font-bold text-[#F97316] items-start shadow-sm">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p>Progressive Overload Suggestion: Bench Press — Try 55kg this session (up from 52.5kg).</p>
          </div>

          {/* Day Cards */}
          <div className="space-y-4">
            {[
              { day: 1, title: 'Push Day', exs: 6, sets: 18, rest: '60-90s' },
              { day: 2, title: 'Pull Day', exs: 5, sets: 15, rest: '60-90s' },
              { day: 3, title: 'Rest Day', exs: 0, sets: 0, rest: '-' },
              { day: 4, title: 'Leg Day', exs: 5, sets: 16, rest: '90-120s' },
              { day: 5, title: 'Upper Body', exs: 6, sets: 18, rest: '60s' },
              { day: 6, title: 'Lower Body', exs: 5, sets: 15, rest: '90s' },
              { day: 7, title: 'Active Recovery', exs: 1, sets: 1, rest: '-' },
            ].map((d) => (
              <div key={d.day} className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden hover:border-white/20 transition-all">
                <button 
                  onClick={() => setExpandedDay(expandedDay === d.day ? null : d.day)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 sm:gap-8">
                    <div className="w-12 text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold">Day</p>
                      <p className="text-xl font-black text-white">{d.day}</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-white">{d.title}</p>
                      <div className="flex gap-4 mt-1 text-sm text-gray-400 hidden sm:flex font-medium">
                        <span>Exercises: {d.exs}</span>
                        <span>Total Sets: {d.sets}</span>
                        <span>Rest: {d.rest}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${expandedDay === d.day ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedDay === d.day && d.exs > 0 && (
                  <div className="px-4 sm:px-6 pb-6 border-t border-white/10 pt-4 bg-transparent">
                    <div className="space-y-4">
                      {['Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Triceps Pushdown'].map((ex, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
                          <div>
                            <p className="font-bold text-white">{ex}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Focus on slow eccentric.</p>
                          </div>
                          <div className="flex gap-2 sm:gap-6 text-sm font-bold">
                            <div className="bg-[#F97316]/20 text-[#F97316] px-3 py-1 rounded-md border border-[#F97316]/30">4 Sets</div>
                            <div className="bg-[#F97316]/20 text-[#F97316] px-3 py-1 rounded-md border border-[#F97316]/30">8-10 Reps</div>
                            <div className="bg-white/10 text-gray-300 border border-white/20 px-3 py-1 rounded-md">90s Rest</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expandedDay === d.day && d.exs === 0 && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-4 bg-transparent text-gray-400 text-sm font-bold">
                    Rest and recover. Optional light stretching or walking.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'diet' && (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="flex flex-wrap gap-2">
            {dietDays.map(day => (
              <button 
                key={day}
                onClick={() => setActiveDietDay(day)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                  activeDietDay === day ? 'bg-[#F97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]' : 'bg-white/10 text-gray-300 border border-white/20 hover:border-[#F97316] hover:text-[#F97316]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Daily Target */}
          <div className="bg-white/5 border border-white/10 rounded-[16px] p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">Daily Target</p>
              <p className="text-3xl font-black text-white">2,200 <span className="text-sm font-bold text-gray-500">kcal</span></p>
            </div>
            <div className="flex gap-6 sm:gap-12">
              <div><p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Protein</p><p className="font-black text-xl text-white">160g</p></div>
              <div><p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Carbs</p><p className="font-black text-xl text-white">220g</p></div>
              <div><p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Fat</p><p className="font-black text-xl text-white">75g</p></div>
            </div>
          </div>

          {/* Meal Cards */}
          <div className="space-y-4">
            {[
              { name: 'Breakfast', time: '08:00 AM', items: 'Oats, Protein Powder, Peanut Butter, Banana', cal: 450, p: 35, c: 50, f: 12 },
              { name: 'Lunch', time: '01:00 PM', items: 'Chicken Breast, Brown Rice, Broccoli', cal: 650, p: 55, c: 80, f: 10 },
              { name: 'Snack', time: '04:30 PM', items: 'Greek Yogurt, Almonds', cal: 300, p: 20, c: 15, f: 18 },
              { name: 'Dinner', time: '08:00 PM', items: 'Salmon, Sweet Potato, Asparagus', cal: 500, p: 40, c: 45, f: 20 },
            ].map((meal, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[16px] p-5 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{meal.name}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-0.5">{meal.time}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">{meal.cal} kcal</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-white/10 text-gray-300 border border-white/20">{meal.p}g P</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-white/10 text-gray-300 border border-white/20">{meal.c}g C</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-white/10 text-gray-300 border border-white/20">{meal.f}g F</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm font-bold text-gray-300 leading-relaxed">{meal.items}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
