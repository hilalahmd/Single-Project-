import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Check, Clock, User, Trash2 } from 'lucide-react'
import { SESSIONS, DAYS } from '../data/mockData'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'

export default function TrainerSchedulePage() {
  // Initialize sessions list as state using the imported SESSIONS mock array
  const [sessions, setSessions] = useState(SESSIONS)
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Form states for booking new slot
  const [clientName, setClientName] = useState('David Kim')
  const [sessionDay, setSessionDay] = useState(22)
  const [sessionTime, setSessionTime] = useState('10:00 AM')
  const [sessionType, setSessionType] = useState('Strength')

  const handleAddSlot = (e) => {
    e.preventDefault()

    const newSlot = {
      day: Number(sessionDay),
      client: clientName,
      time: sessionTime,
      type: sessionType
    }

    setSessions(prev => [...prev, newSlot])
    setModalOpen(false)
    setToastMessage(`Added slot on June ${newSlot.day} for ${newSlot.client}!`)
  }

  const handleDeleteSlot = (index) => {
    setSessions(prev => prev.filter((_, idx) => idx !== index))
    setToastMessage("Schedule slot removed successfully.")
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Schedule</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage your availability and upcoming sessions.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white text-[14px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
        >
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
            const count = sessions.filter(s => s.day === day).length
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
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {[...sessions].sort((a, b) => a.day - b.day).map((s, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-sm">
                <div className="text-center w-14 shrink-0 border-r border-white/10 pr-6">
                  <p className="text-[24px] font-bold text-white">{s.day}</p>
                  <p className="text-[12px] font-bold text-blue-400 uppercase">Jun</p>
                </div>
                <div className="w-12 h-12 bg-[#1E293B] text-blue-400 flex items-center justify-center text-[16px] font-bold rounded-full border border-white/10 shrink-0">{s.client.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-white">{s.client}</p>
                  <p className="text-[14px] text-gray-400 mt-0.5 font-medium">{s.time} <span className="mx-1 text-gray-600">·</span> {s.type}</p>
                </div>
                <button 
                  onClick={() => handleDeleteSlot(index)}
                  className="p-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Remove slot"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <CalendarDays size={28} className="text-gray-500" />
            </div>
            <p className="font-bold text-white text-[16px] mb-1">No scheduled sessions</p>
            <p className="text-[13px] text-gray-400">Click "Add Slot" above to log open slots or client bookings.</p>
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Availability / Session Slot">
        <form onSubmit={handleAddSlot} className="space-y-6">
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">Select Client Name / Slot Type</label>
            <select
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option>David Kim</option>
              <option>Anita Rao</option>
              <option>Tom Morris</option>
              <option>Lisa Park</option>
              <option>James Chen</option>
              <option>Open Slot (Unassigned)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-bold text-gray-300 mb-2">Day in June (1-30)</label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={sessionDay}
                onChange={e => setSessionDay(e.target.value)}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-300 mb-2">Select Time</label>
              <select
                value={sessionTime}
                onChange={e => setSessionTime(e.target.value)}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB]"
              >
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>04:30 PM</option>
                <option>06:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">Session Focus Type</label>
            <select
              value={sessionType}
              onChange={e => setSessionType(e.target.value)}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option>Strength</option>
              <option>Yoga</option>
              <option>HIIT</option>
              <option>Nutrition Review</option>
              <option>Cardio Training</option>
            </select>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 border border-white/10 text-white hover:bg-white/10 rounded-lg text-[14px] font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-[14px] font-bold transition-all shadow-sm">Add Slot</button>
          </div>
        </form>
      </Modal>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
