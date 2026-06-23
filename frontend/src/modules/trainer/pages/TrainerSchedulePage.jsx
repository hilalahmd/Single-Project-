import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const SESSIONS = [
  { day: 15, client: 'David Kim',  time: '9:00 AM',  type: 'Strength' },
  { day: 17, client: 'Anita Rao',  time: '11:00 AM', type: 'Yoga' },
  { day: 20, client: 'Tom Morris', time: '2:00 PM',  type: 'HIIT' },
  { day: 22, client: 'Lisa Park',  time: '4:30 PM',  type: 'Nutrition Review' },
  { day: 22, client: 'James Cho',  time: '6:00 PM',  type: 'Strength' },
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function TrainerSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">Schedule</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors">
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {/* Calendar */}
      <div className="border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-black">June 2026</h2>
          <div className="flex gap-1">
            <button className="p-1.5 border border-gray-200 hover:border-black transition-colors"><ChevronLeft size={16} /></button>
            <button className="p-1.5 border border-gray-200 hover:border-black transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div />
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const count = SESSIONS.filter(s => s.day === day).length
            const isToday = day === 22
            return (
              <div key={day} className={`aspect-square flex flex-col items-center justify-center text-sm cursor-pointer transition-colors ${
                isToday ? 'bg-black text-white font-bold' : count > 0 ? 'border border-black font-semibold text-black' : 'hover:bg-gray-50 text-gray-600'
              }`}>
                {day}
                {count > 0 && !isToday && <span className="text-[9px] text-gray-500">{count}x</span>}
                {count > 0 && isToday && <span className="text-[9px] text-gray-300">{count}x</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sessions list */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Upcoming Sessions</h2>
        <div className="border border-gray-200 divide-y divide-gray-100">
          {SESSIONS.sort((a, b) => a.day - b.day).map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="text-center w-8 shrink-0">
                <p className="text-lg font-black text-black">{s.day}</p>
              </div>
              <div className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">{s.client.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-black">{s.client}</p>
                <p className="text-xs text-gray-500">{s.time} · {s.type}</p>
              </div>
              <button className="text-xs font-semibold text-black border border-gray-200 px-3 py-1.5 hover:border-black transition-colors">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
