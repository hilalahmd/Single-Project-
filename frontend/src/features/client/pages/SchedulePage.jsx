import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, Video, ChevronLeft, ChevronRight, CheckCircle2, UserCheck, Lock } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Badge from '../../../shared/components/Badge'
import Avatar from '../../../shared/components/Avatar'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'

export default function SchedulePage() {
  const navigate = useNavigate()
  const { subscriptionTier } = useAuth()
  const [view, setView] = useState('week')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Calendar dates
  const days = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17', 'Sun 18']
  const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

  // ─── Local Sessions State (relative to Oct 12-18, 2026) ───
  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      name: 'Arjun Menon',
      date: '2026-10-14T18:00:00',
      timeSlot: '18:00',
      dayIndex: 2, // Wed (0-indexed from Mon)
      type: 'Form Correction',
      duration: '18:00 - 19:00'
    },
    {
      id: 'session-2',
      name: 'Arjun Menon',
      date: '2026-10-17T08:00:00',
      timeSlot: '08:00',
      dayIndex: 5, // Sat (0-indexed from Mon)
      type: 'Weekly Check-in',
      duration: '08:00 - 09:00'
    }
  ])

  // Form input states
  const [selectedCoach, setSelectedCoach] = useState('Arjun Menon')
  const [bookingDate, setBookingDate] = useState('2026-10-15')
  const [bookingTime, setBookingTime] = useState('10:00 AM')
  const [bookingType, setBookingType] = useState('Personal Training')

  // Calculate status for joining video calls
  const getSessionStatus = (sessionDate) => {
    const now = new Date()
    const start = new Date(sessionDate)
    const diffMs = start - now
    const diffMin = diffMs / 60000

    if (diffMin > 15) {
      return {
        status: 'upcoming',
        label: `Starts at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        canJoin: false
      }
    }

    if (diffMin > -60 && diffMin <= 15) {
      return {
        status: 'active',
        label: 'Join Call',
        canJoin: true
      }
    }

    return {
      status: 'past',
      label: 'Completed',
      canJoin: false
    }
  }

  const handleBooking = (e) => {
    e.preventDefault()

    // Map selected time label to times slot index and index day from Mon-Sun
    const chosenDate = new Date(bookingDate)
    const dayOfWeek = chosenDate.getDay() // 0 = Sun, 1 = Mon...
    // Adjust to Monday-start (0 = Mon, 6 = Sun)
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    // Simple time parsing for slot mapping
    let timeSlot = '10:00'
    if (bookingTime.includes('08:00')) timeSlot = '08:00'
    if (bookingTime.includes('10:00')) timeSlot = '10:00'
    if (bookingTime.includes('02:00')) timeSlot = '14:00'
    if (bookingTime.includes('04:00')) timeSlot = '16:00'
    if (bookingTime.includes('06:00')) timeSlot = '18:00'
    if (bookingTime.includes('08:00 PM')) timeSlot = '20:00'

    const hourPart = timeSlot.split(':')[0]
    const isoDateTime = `${bookingDate}T${hourPart}:00:00`

    const newSession = {
      id: `session-${Date.now()}`,
      name: selectedCoach,
      date: isoDateTime,
      timeSlot: timeSlot,
      dayIndex: dayIndex >= 0 && dayIndex < 7 ? dayIndex : 3, // Fallback to Thursday
      type: bookingType,
      duration: `${bookingTime} - ${Number(hourPart) + 1}:00`
    }

    setSessions(prev => [...prev, newSession])
    setModalOpen(false)
    setToastMessage(`Successfully booked session with ${newSession.name}!`)
  }

  const handleCancelSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    setToastMessage("Session successfully cancelled.")
  }

  const isLocked = subscriptionTier !== 'pt'

  return (
    <div className="relative max-w-7xl mx-auto min-h-[500px]">
      {/* Premium PT Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-45 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4 text-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">Live Video Scheduling Locked</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
            Schedule 1-on-1 live video workouts, real-time form assessments, and weekly check-in calls. Upgrade to Personal Training to unlock.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#ff8c3a] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Actual Schedule Layout */}
      <div className={`space-y-6 ${isLocked ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-white">Schedule</h1>
            <p className="text-[14px] text-gray-400 mt-1">Manage your upcoming live sessions.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] cursor-pointer">Book New Session</button>
        </div>

      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"><ChevronLeft size={20} /></button>
          <h2 className="text-[16px] font-semibold text-white">Oct 12 – Oct 18, 2026</h2>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"><ChevronRight size={20} /></button>
        </div>
        <div className="bg-black/30 p-1 rounded-lg flex items-center hidden sm:flex border border-white/10">
          <button onClick={() => setView('week')} className={`px-4 py-1.5 rounded-md text-[14px] font-bold transition-all ${view === 'week' ? 'bg-[#F97316] text-white shadow-sm shadow-orange-500/30' : 'text-gray-400 hover:text-white'}`}>Week</button>
          <button onClick={() => setView('month')} className={`px-4 py-1.5 rounded-md text-[14px] font-bold transition-all ${view === 'month' ? 'bg-[#F97316] text-white shadow-sm shadow-orange-500/30' : 'text-gray-400 hover:text-white'}`}>Month</button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card padding="none" className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b border-white/10">
            <div className="p-4 text-center border-r border-white/10 bg-black/20"></div>
            {days.map(d => (
              <div key={d} className="p-4 text-center border-r border-white/10 last:border-0 bg-black/20">
                <p className="font-semibold text-gray-400 text-[14px]">{d.split(' ')[0]}</p>
                <p className="text-[24px] font-bold text-white mt-1">{d.split(' ')[1]}</p>
              </div>
            ))}
          </div>
          {times.map(t => (
            <div key={t} className="grid grid-cols-8 border-b border-white/10 last:border-0 h-24">
              <div className="p-2 text-center border-r border-white/10 bg-black/20 flex items-center justify-center">
                <span className="text-[12px] font-semibold text-gray-500">{t}</span>
              </div>
              {days.map((d, i) => {
                // Find matching session for this time and day index
                const cellSession = sessions.find(s => s.timeSlot === t && s.dayIndex === i)
                return (
                  <div key={d} className="p-1 border-r border-white/10 last:border-0 relative hover:bg-white/5 transition-colors cursor-pointer group">
                    {cellSession && (
                      <div className="absolute inset-2 bg-[#F97316] text-white rounded-lg p-2 overflow-hidden z-10 shadow-lg border border-orange-400/50 transition-all hover:scale-[1.02] shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
                        <p className="text-[12px] font-semibold truncate">{cellSession.name}</p>
                        <p className="text-[10px] text-orange-100 mt-0.5">{cellSession.duration}</p>
                        <div className="absolute bottom-2 right-2"><Video size={12} className="text-white" /></div>
                      </div>
                    )}
                    {!cellSession && (
                      <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <span className="text-[20px] font-light text-gray-500">+</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Sessions Cards List */}
      <div>
        <h2 className="text-[20px] font-bold text-white mb-6">Upcoming Sessions</h2>
        {sessions.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map((s) => {
              const { status, label, canJoin } = getSessionStatus(s.date)
              return (
                <Card key={s.id}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={s.name} size="lg" className="border-white/10" />
                      <div>
                        <h3 className="font-bold text-[16px] text-white">{s.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30 mt-2">{s.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-[14px] font-semibold text-white justify-end">
                        <CalendarIcon size={14} className="text-gray-400"/>
                        {new Date(s.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-400 justify-end mt-1.5">
                        <Clock size={12}/>
                        {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {status === 'active' ? (
                      <button
                        onClick={() => navigate(`/dashboard/video/${s.id}`)}
                        className="flex-1 flex items-center justify-center px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(34,197,94,0.3)] cursor-pointer"
                      >
                        <Video size={16} className="mr-2" />
                        Join Call
                      </button>
                    ) : status === 'past' ? (
                      <span className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 text-gray-500 rounded-lg text-[14px] font-bold cursor-not-allowed">
                        <CheckCircle2 size={16} className="mr-2" />
                        Completed
                      </span>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-[14px] font-bold cursor-not-allowed"
                      >
                        <Clock size={16} className="mr-2" />
                        {label}
                      </button>
                    )}
                    <button onClick={() => handleCancelSession(s.id)} className="px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-[14px] font-bold transition-colors cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <UserCheck size={28} className="text-gray-500" />
            </div>
            <p className="font-bold text-white text-[16px] mb-1">No upcoming sessions</p>
            <p className="text-[13px] text-gray-400 max-w-sm mb-4">Click "Book New Session" above to schedule a live call with your personal coach.</p>
          </div>
        )}
      </div>

      {/* Book New Session Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book New Session">
        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">Select Coach</label>
            <select
              value={selectedCoach}
              onChange={e => setSelectedCoach(e.target.value)}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
            >
              <option>Arjun Menon (Active Plan)</option>
            </select>
          </div>
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">Select Date</label>
            <input
              type="date"
              required
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {['08:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBookingTime(t)}
                  className={`p-3 border rounded-lg text-[12px] font-bold transition-all ${
                    bookingTime === t
                      ? 'border-[#F97316] text-[#F97316] bg-[#F97316]/10 shadow-sm'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">Session Type</label>
            <select
              value={bookingType}
              onChange={e => setBookingType(e.target.value)}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
            >
              <option>Personal Training</option>
              <option>Form Correction</option>
              <option>Weekly Check-in</option>
              <option>Nutrition Review</option>
            </select>
          </div>
          <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 border border-white/10 text-white hover:bg-white/10 rounded-lg text-[14px] font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)]">Confirm Booking</button>
          </div>
        </form>
      </Modal>

      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  )
}
