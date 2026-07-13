import { useState, useEffect, useCallback } from 'react'
import {
  CalendarDays, Plus, Clock, Users, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, Loader2, Trash2,
  AlertCircle, UserCheck, Video
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'
import API from '../../../shared/utils/api'

// ── Helper: Format Date for display ──────────────────────────────────────────
const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString([], {
    weekday: 'short', month: 'short', day: 'numeric'
  })
}

// Can trainer join the video call?
// Allowed 15 min before slot starts, up to 60 min after
const getJoinStatus = (startTime) => {
  const now   = new Date()
  const start = new Date(startTime)
  const diffMin = (start - now) / 60000

  if (diffMin <= 15 && diffMin > -60) return { canJoin: true,  label: 'Join Call' }
  if (diffMin > 15)                   return { canJoin: false, label: `Starts in ${Math.ceil(diffMin)}m` }
  return                                     { canJoin: false, label: 'Session Ended' }
}

// ── Status badge colors ───────────────────────────────────────────────────────
const statusStyles = {
  open:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  full:      'bg-amber-500/10  text-amber-400  border-amber-500/20',
  cancelled: 'bg-red-500/10    text-red-400    border-red-500/20',
}

const bookingStatusStyles = {
  pending:   'bg-amber-500/10  text-amber-400  border-amber-500/20',
  accepted:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected:  'bg-red-500/10    text-red-400    border-red-500/20',
  cancelled: 'bg-gray-500/10   text-gray-400   border-gray-500/20',
}

export default function TrainerSchedulePage() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [slots, setSlots]             = useState([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [modalOpen, setModalOpen]     = useState(false)
  const [toastMsg, setToastMsg]       = useState(null)
  const [expandedSlot, setExpandedSlot] = useState(null)   // Which slot's bookings are open
  const [bookingsMap, setBookingsMap] = useState({})        // { slotId: [bookings] }
  const [loadingBookings, setLoadingBookings] = useState({}) // { slotId: true/false }
  const [respondingId, setRespondingId] = useState(null)    // bookingId being processed

  // Create slot form state
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],  // Today's date as default
    workStart: 17,   // 5 PM
    workEnd: 21,     // 9 PM
    capacity: 2
  })
  const [creating, setCreating] = useState(false)
  
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Force re-renders every second for the active countdown timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ── Fetch trainer's slots ──────────────────────────────────────────────────
  const fetchSlots = useCallback(async () => {
    try {
      setLoadingSlots(true)
      const res = await fetch(`${API}/schedule/slots/my`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setSlots(data.data)
    } catch (err) {
      setToastMsg('Failed to load slots. Please try again.')
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  // ── Fetch bookings for a specific slot (on expand) ────────────────────────
  const fetchSlotBookings = async (slotId) => {
    if (bookingsMap[slotId]) return  // Already loaded — use cache
    try {
      setLoadingBookings(prev => ({ ...prev, [slotId]: true }))
      const res = await fetch(`${API}/schedule/bookings/slot/${slotId}`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setBookingsMap(prev => ({ ...prev, [slotId]: data.data }))
      }
    } catch (err) {
      setToastMsg('Failed to load booking requests.')
    } finally {
      setLoadingBookings(prev => ({ ...prev, [slotId]: false }))
    }
  }

  // ── Toggle slot expand ────────────────────────────────────────────────────
  const handleToggleSlot = (slotId) => {
    if (expandedSlot === slotId) {
      setExpandedSlot(null)
    } else {
      setExpandedSlot(slotId)
      fetchSlotBookings(slotId)
    }
  }

  // ── Create slots ──────────────────────────────────────────────────────────
  const handleCreateSlots = async (e) => {
    e.preventDefault()
    if (Number(form.workStart) >= Number(form.workEnd)) {
      setToastMsg('Start time must be before end time')
      return
    }
    try {
      setCreating(true)
      const res = await fetch(`${API}/schedule/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          date: form.date,
          workStart: Number(form.workStart),
          workEnd: Number(form.workEnd),
          capacity: Number(form.capacity)
        })
      })
      const data = await res.json()
      if (data.success) {
        setToastMsg(`✅ ${data.message}`)
        setModalOpen(false)
        fetchSlots()  // Refresh slot list
      } else {
        setToastMsg(data.message || 'Failed to create slots')
      }
    } catch (err) {
      setToastMsg('Network error. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  // ── Delete a slot ──────────────────────────────────────────────────────────
  const handleCancelSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this availability slot? It will be completely removed.')) return
    try {
      const res = await fetch(`${API}/schedule/slots/${slotId}/cancel`, {
        method: 'PATCH',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setToastMsg('Slot deleted successfully')
        fetchSlots()
      } else {
        setToastMsg(data.message || 'Failed to delete slot')
      }
    } catch (err) {
      setToastMsg('Network error.')
    }
  }

  // ── Accept / Reject a booking ─────────────────────────────────────────────
  const handleRespond = async (bookingId, slotId, action, reason = '') => {
    try {
      setRespondingId(bookingId)
      const body = { action }
      if (action === 'reject' && reason) body.rejectionReason = reason

      const res = await fetch(`${API}/schedule/bookings/${bookingId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        setToastMsg(action === 'accept' ? '✅ Client accepted!' : '❌ Client rejected')
        // Update local bookings cache — no need to re-fetch
        setBookingsMap(prev => ({
          ...prev,
          [slotId]: prev[slotId].map(b =>
            b._id === bookingId
              ? { ...b, status: action === 'accept' ? 'accepted' : 'rejected' }
              : b
          )
        }))
        // Refresh slot list to update bookedCount display
        fetchSlots()
      } else {
        setToastMsg(data.message || 'Action failed')
      }
    } catch (err) {
      setToastMsg('Network error.')
    } finally {
      setRespondingId(null)
    }
  }

  // ── Reject with reason prompt ─────────────────────────────────────────────
  const handleReject = (bookingId, slotId) => {
    const reason = window.prompt('Rejection reason (optional):') ?? ''
    handleRespond(bookingId, slotId, 'reject', reason)
  }

  // ── Hour options for select dropdown (0-23) ────────────────────────────────
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const label = i === 0 ? '12:00 AM' : i < 12
      ? `${i}:00 AM`
      : i === 12 ? '12:00 PM'
      : `${i - 12}:00 PM`
    return { value: i, label }
  })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">Schedule</h1>
          <p className="text-[14px] text-gray-400 mt-1">
            Set your availability and manage booking requests.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white text-[14px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Set Availability
        </button>
      </div>

      {/* ── Slots List ── */}
      {loadingSlots ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={28} className="animate-spin mr-3" />
          <span>Loading your slots...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <CalendarDays size={28} className="text-gray-500" />
          </div>
          <p className="font-bold text-white text-[16px] mb-1">No availability set</p>
          <p className="text-[13px] text-gray-400">
            Click "Set Availability" to add your working hours for a day.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {slots.map(slot => {
            const isExpanded = expandedSlot === slot._id
            const slotBookings = bookingsMap[slot._id] || []
            const pendingCount = slotBookings.filter(b => b.status === 'pending').length

            return (
              <div
                key={slot._id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Slot Row */}
                <div className="flex items-center gap-4 p-5">

                  {/* Date block */}
                  <div className="text-center w-14 shrink-0 border-r border-white/10 pr-4">
                    <p className="text-[11px] font-bold text-gray-500 uppercase">
                      {new Date(slot.date).toLocaleDateString([], { month: 'short' })}
                    </p>
                    <p className="text-[26px] font-black text-white leading-none">
                      {new Date(slot.startTime).getUTCDate()}
                    </p>
                  </div>

                  {/* Slot info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Clock size={14} className="text-blue-400" />
                      <span className="text-[15px] font-bold text-white">
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${statusStyles[slot.status] || ''}`}>
                        {slot.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[13px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {slot.bookedCount} / {slot.capacity} booked
                      </span>
                      {pendingCount > 0 && (
                        <span className="text-amber-400 font-bold">
                          • {pendingCount} pending request{pendingCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(() => {
                      const { canJoin, label } = getJoinStatus(slot.startTime)
                      return canJoin ? (
                        <button
                          onClick={() => navigate(`/trainer/video/${slot._id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all cursor-pointer animate-pulse"
                        >
                          <Video size={14} />
                          Join Call
                        </button>
                      ) : null
                    })()}

                    <button
                      onClick={() => handleCancelSlot(slot._id)}
                      className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete slot"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => handleToggleSlot(slot._id)}
                      className="p-2 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="View booking requests"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded: Booking requests ── */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/20 px-5 py-4">
                    {loadingBookings[slot._id] ? (
                      <div className="flex items-center gap-2 text-gray-400 py-4">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-[13px]">Loading requests...</span>
                      </div>
                    ) : slotBookings.length === 0 ? (
                      <div className="flex items-center gap-2 text-gray-500 py-4">
                        <AlertCircle size={16} />
                        <span className="text-[13px]">No booking requests yet for this slot.</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3">
                          Booking Requests ({slotBookings.length})
                        </p>
                        {slotBookings.map(booking => (
                          <div
                            key={booking._id}
                            className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/5"
                          >
                            {/* Client avatar */}
                            <div className="w-10 h-10 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center text-[14px] font-bold text-blue-400 shrink-0">
                              {booking.clientId?.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>

                            {/* Client info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-bold text-white">
                                {booking.clientId?.name || 'Unknown Client'}
                              </p>
                              {booking.clientNote && (
                                <p className="text-[12px] text-gray-400 mt-0.5 truncate">
                                  "{booking.clientNote}"
                                </p>
                              )}
                            </div>

                            {/* Status badge or action buttons */}
                            {booking.status === 'pending' ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleRespond(booking._id, slot._id, 'accept')}
                                  disabled={respondingId === booking._id}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[12px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {respondingId === booking._id
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <CheckCircle2 size={13} />
                                  }
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(booking._id, slot._id)}
                                  disabled={respondingId === booking._id}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-[12px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <XCircle size={13} />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide shrink-0 ${bookingStatusStyles[booking.status] || ''}`}>
                                {booking.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Create Availability Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Set Availability"
      >
        <form onSubmit={handleCreateSlots} className="space-y-6">

          {/* Date */}
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
            />
          </div>

          {/* Work Start + End */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-bold text-gray-300 mb-2">
                Start Time
              </label>
              <select
                value={form.workStart}
                onChange={e => setForm(f => ({ ...f, workStart: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                {hourOptions.map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-300 mb-2">
                End Time
              </label>
              <select
                value={form.workEnd}
                onChange={e => setForm(f => ({ ...f, workEnd: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                {hourOptions.map(h => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-[14px] font-bold text-gray-300 mb-2">
              Max Clients Per Slot
              <span className="ml-2 text-[12px] text-gray-500 font-normal">(max 3 — mesh WebRTC limit)</span>
            </label>
            <div className="flex gap-3">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, capacity: n }))}
                  className={`flex-1 py-3 rounded-lg text-[14px] font-bold border transition-all cursor-pointer ${
                    form.capacity === n
                      ? 'bg-[#2563EB]/20 border-[#2563EB] text-[#2563EB]'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {n} {n === 1 ? 'client' : 'clients'}
                </button>
              ))}
            </div>
          </div>

          {/* Preview of slots that will be created */}
          {form.workStart < form.workEnd && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <p className="text-[12px] font-bold text-blue-400 mb-2">
                Slots that will be created:
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  { length: form.workEnd - form.workStart },
                  (_, i) => form.workStart + i
                ).map(h => {
                  const startLabel = h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h-12}:00 PM`
                  const endLabel   = (h+1) === 12 ? '12:00 PM' : (h+1) > 12 ? `${h+1-12}:00 PM` : `${h+1}:00 AM`
                  return (
                    <span key={h} className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-2 py-1 rounded">
                      {startLabel} – {endLabel}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-3 border border-white/10 text-white hover:bg-white/10 rounded-lg text-[14px] font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || form.workStart >= form.workEnd}
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-[14px] font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {creating && <Loader2 size={16} className="animate-spin" />}
              {creating ? 'Creating...' : 'Create Slots'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
    </div>
  )
}
