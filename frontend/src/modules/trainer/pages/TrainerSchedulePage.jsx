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
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-black tracking-tight">Schedule</h1>
          <p className="text-[14px] text-gray-500 mt-1">Manage your availability and upcoming sessions.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white text-[14px] font-bold rounded-lg transition-all shadow-sm">
          <Plus size={18} /> Add Slot
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-black">June 2026</h2>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-200 bg-white rounded-lg hover:border-black hover:text-black text-gray-500 transition-colors"><ChevronLeft size={18} /></button>
            <button className="p-2 border border-gray-200 bg-white rounded-lg hover:border-black hover:text-black text-gray-500 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-3 mb-3">
          {DAYS.map(d => <div key={d} className="text-center text-[12px] font-bold text-gray-400 py-2 uppercase tracking-wide">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-3">
          <div />
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const count = SESSIONS.filter(s => s.day === day).length
            const isToday = day === 22
            return (
              <div key={day} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[14px] cursor-pointer transition-all border ${
                isToday 
                  ? 'bg-black border-black text-white font-bold shadow-md scale-105' 
                  : count > 0 
                    ? 'bg-gray-50 border-gray-200 font-bold text-black hover:border-black' 
                    : 'bg-transparent border-transparent hover:bg-gray-50 text-gray-500 font-medium'
              }`}>
                {day}
                {count > 0 && !isToday && <span className="text-[10px] text-gray-500 font-bold mt-1">{count}x</span>}
                {count > 0 && isToday && <span className="text-[10px] text-gray-300 font-bold mt-1">{count}x</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sessions list */}
      <div>
        <h2 className="text-[20px] font-bold text-black mb-6">Upcoming Sessions</h2>
        <div className="space-y-4">
          {SESSIONS.sort((a, b) => a.day - b.day).map((s, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-6 shadow-sm">
              <div className="text-center w-14 shrink-0 border-r border-gray-200 pr-6">
                <p className="text-[24px] font-bold text-black">{s.day}</p>
                <p className="text-[12px] font-bold text-gray-400 uppercase">Jun</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 text-black flex items-center justify-center text-[16px] font-bold rounded-full border border-gray-200 shrink-0">{s.client.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-[16px] font-bold text-black">{s.client}</p>
                <p className="text-[14px] text-gray-500 mt-0.5 font-medium">{s.time} · {s.type}</p>
              </div>
              <button className="px-5 py-2.5 border border-gray-200 bg-white text-black text-[14px] font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
