import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { SESSIONS, DAYS } from '../data/mockData'

export default function TrainerSchedulePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Schedule</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage your availability and upcoming sessions.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white text-[14px] font-bold rounded-lg transition-all shadow-sm">
          <Plus size={18} /> Add Slot
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[20px] font-bold text-white">June 2026</h2>
          <div className="flex gap-2">
            <button className="p-2 border border-white/10 bg-white/5 rounded-lg hover:border-white/30 hover:text-white text-gray-400 transition-colors"><ChevronLeft size={18} /></button>
            <button className="p-2 border border-white/10 bg-white/5 rounded-lg hover:border-white/30 hover:text-white text-gray-400 transition-colors"><ChevronRight size={18} /></button>
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
                  ? 'bg-[#2563EB] border-[#2563EB] text-white font-bold shadow-lg shadow-blue-500/20 scale-105' 
                  : count > 0 
                    ? 'bg-white/10 border-white/20 font-bold text-white hover:border-white/40' 
                    : 'bg-transparent border-transparent hover:bg-white/5 text-gray-500 font-medium'
              }`}>
                {day}
                {count > 0 && !isToday && <span className="text-[10px] text-blue-400 font-bold mt-1">{count}x</span>}
                {count > 0 && isToday && <span className="text-[10px] text-blue-100 font-bold mt-1">{count}x</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sessions list */}
      <div>
        <h2 className="text-[20px] font-bold text-white mb-6">Upcoming Sessions</h2>
        <div className="space-y-4">
          {SESSIONS.sort((a, b) => a.day - b.day).map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-sm">
              <div className="text-center w-14 shrink-0 border-r border-white/10 pr-6">
                <p className="text-[24px] font-bold text-white">{s.day}</p>
                <p className="text-[12px] font-bold text-blue-400 uppercase">Jun</p>
              </div>
              <div className="w-12 h-12 bg-[#1E293B] text-blue-400 flex items-center justify-center text-[16px] font-bold rounded-full border border-white/10 shrink-0">{s.client.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-[16px] font-bold text-white">{s.client}</p>
                <p className="text-[14px] text-gray-400 mt-0.5 font-medium">{s.time} <span className="mx-1 text-gray-600">·</span> {s.type}</p>
              </div>
              <button className="px-5 py-2.5 border border-white/10 bg-white/5 text-white text-[14px] font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-colors">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
