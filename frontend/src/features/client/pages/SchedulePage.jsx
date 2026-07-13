import { useState, useEffect, useCallback } from 'react'
import {
  Calendar as CalendarIcon, Clock, Video, Lock,
  CheckCircle2, XCircle, Loader2, RefreshCw,
  AlertCircle, UserCheck, ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'
import API from '../../../shared/utils/api'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })

// Can client join the video call?
// Allowed 15 min before slot starts, up to 60 min after
const getJoinStatus = (startTime) => {
  const now   = new Date()
  const start = new Date(startTime)
  const diffMin = (start - now) / 60000

  if (diffMin <= 15 && diffMin > -60) return { canJoin: true,  label: 'Join Call' }
  if (diffMin > 15)                   return { canJoin: false, label: `Starts ${formatDate(startTime)} at ${formatTime(startTime)}` }
  return                                     { canJoin: false, label: 'Session Ended' }
}

// Booking status pill styling
const statusPill = {
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  accepted:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function SchedulePage() {
  const navigate              = useNavigate()
  const { user, subscriptionTier } = useAuth()

  // ── State ─────────────────────────────────────────────────────────────────
  const [trainerUserId, setTrainerUserId] = useState(null)
  const [slots,         setSlots]         = useState([])
  const [myBookings,    setMyBookings]    = useState([])
  const [loadingSlots,  setLoadingSlots]  = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [toastMsg,      setToastMsg]      = useState(null)

  // Browse slots modal
  const [browseOpen,    setBrowseOpen]    = useState(false)
  const [selectedDate,  setSelectedDate]  = useState(new Date().toISOString().split('T')[0])
  const [bookingSlot,   setBookingSlot]   = useState(null)   // slot selected to book
  const [clientNote,    setClientNote]    = useState('')
  const [isRebook,      setIsRebook]      = useState(false)  // is this a rebook attempt?
  const [submitting,    setSubmitting]    = useState(false)
  const [cancelling,    setCancelling]    = useState(null)   // bookingId being cancelled

  const isLocked = subscriptionTier !== 'personal_training'

  const [currentTime, setCurrentTime] = useState(new Date())

  // Force re-renders every second for the active countdown timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ── Fetch trainer's User ID ──────────────────────────────────────────────
  useEffect(() => {
    if (isLocked || !user) return
    const fetchTrainerId = async () => {
      try {
        const res  = await fetch(`${API}/schedule/my-trainer-id`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) setTrainerUserId(data.trainerUserId)
      } catch (err) {
        console.error('Could not fetch trainer ID', err)
      }
    }
    fetchTrainerId()
  }, [user, isLocked])

  // ── Fetch client's own bookings ──────────────────────────────────────────
  const fetchMyBookings = useCallback(async () => {
    if (isLocked || !user) return
    try {
      setLoadingBookings(true)
      const res  = await fetch(`${API}/schedule/bookings/my`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) setMyBookings(data.data)
    } catch (err) {
      setToastMsg('Failed to load your bookings.')
    } finally {
      setLoadingBookings(false)
    }
  }, [user, isLocked])

  useEffect(() => { fetchMyBookings() }, [fetchMyBookings])

  // ── Fetch open slots when browse modal opens / date changes ─────────────
  useEffect(() => {
    if (!browseOpen || !trainerUserId) return
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true)
        const res  = await fetch(
          `${API}/schedule/slots?trainerId=${trainerUserId}&date=${selectedDate}`,
          { credentials: 'include' }
        )
        const data = await res.json()
        setSlots(data.success ? data.data : [])
      } catch (err) {
        setToastMsg('Could not load available slots.')
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchSlots()
  }, [browseOpen, selectedDate, trainerUserId])

  // ── Submit booking request ───────────────────────────────────────────────
  const handleBook = async () => {
    if (!bookingSlot) return
    try {
      setSubmitting(true)
      const res  = await fetch(`${API}/schedule/bookings`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          slotId:     bookingSlot._id,
          clientNote: clientNote.trim(),
          isRebook
        })
      })
      const data = await res.json()
      if (data.success) {
        setToastMsg('✅ Booking request sent! Waiting for trainer approval.')
        setBrowseOpen(false)
        setBookingSlot(null)
        setClientNote('')
        setIsRebook(false)
        fetchMyBookings()
      } else {
        setToastMsg(data.message || 'Booking failed.')
      }
    } catch (err) {
      setToastMsg('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Cancel a booking ─────────────────────────────────────────────────────
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking request?')) return
    try {
      setCancelling(bookingId)
      const res  = await fetch(`${API}/schedule/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setToastMsg('Booking cancelled.')
        fetchMyBookings()
      } else {
        setToastMsg(data.message || 'Could not cancel.')
      }
    } catch (err) {
      setToastMsg('Network error.')
    } finally {
      setCancelling(null)
    }
  }

  // ── Open rebook flow ─────────────────────────────────────────────────────
  const handleRebook = () => {
    setIsRebook(true)
    setBrowseOpen(true)
  }

  // ── Rejected booking — has free rebook? ──────────────────────────────────
  const rejectedBookings = myBookings.filter(
    b => b.status === 'rejected' && !b.rebookUsed
  )
  const hasRebookChance = rejectedBookings.length > 0

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative max-w-4xl mx-auto min-h-[500px]">

      {/* ── Premium Lock Overlay ── */}
      {isLocked && (
        <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5">
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4 text-[#F97316] animate-pulse">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Video Scheduling Locked</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
            Schedule group training sessions with your personal coach. Upgrade to Personal Training to unlock.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#ff8c3a] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className={`space-y-8 ${isLocked ? 'blur-sm pointer-events-none select-none' : ''}`}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-white">Schedule</h1>
            <p className="text-[14px] text-gray-400 mt-1">
              Book group training sessions with your coach.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Rebook alert badge */}
            {hasRebookChance && (
              <button
                onClick={handleRebook}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[13px] font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <RefreshCw size={15} /> Free Rebook Available
              </button>
            )}
            <button
              onClick={() => { setIsRebook(false); setBrowseOpen(true) }}
              disabled={!trainerUserId}
              className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] cursor-pointer disabled:opacity-40"
              title={!trainerUserId ? 'No trainer assigned yet' : ''}
            >
              Browse Slots
            </button>
          </div>
        </div>

        {/* No trainer assigned message */}
        {!trainerUserId && !isLocked && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle size={20} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-amber-300 text-[14px]">No trainer assigned yet</p>
              <p className="text-[13px] text-gray-400 mt-1">
                A trainer will be assigned to your account after your subscription is processed. Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* ── My Bookings ── */}
        <div>
          <h2 className="text-[20px] font-bold text-white mb-5">My Bookings</h2>

          {loadingBookings ? (
            <div className="flex items-center gap-3 text-gray-400 py-10 justify-center">
              <Loader2 size={22} className="animate-spin" />
              <span>Loading your bookings...</span>
            </div>
          ) : myBookings.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <UserCheck size={28} className="text-gray-500" />
              </div>
              <p className="font-bold text-white text-[16px] mb-1">No bookings yet</p>
              <p className="text-[13px] text-gray-400">
                Click "Browse Slots" to request a session with your coach.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map(booking => {
                const slot     = booking.slotId
                const join     = slot ? getJoinStatus(slot.startTime) : null
                const isActive = booking.status === 'accepted'

                return (
                  <div
                    key={booking._id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5"
                  >
                    {/* Date block */}
                    {slot && (
                      <div className="text-center w-14 shrink-0 border-r border-white/10 pr-4">
                        <p className="text-[11px] font-bold text-gray-500 uppercase">
                          {new Date(slot.startTime).toLocaleDateString([], { month: 'short' })}
                        </p>
                        <p className="text-[26px] font-black text-white leading-none">
                          {new Date(slot.startTime).getUTCDate()}
                        </p>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {slot ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={13} className="text-orange-400" />
                            <span className="text-[14px] font-bold text-white">
                              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-gray-400">
                            <CalendarIcon size={11} />
                            {formatDate(slot.startTime)}
                          </div>
                        </>
                      ) : (
                        <p className="text-[13px] text-gray-500">Slot details unavailable</p>
                      )}

                      {booking.rejectionReason && (
                        <p className="text-[12px] text-red-400 mt-1.5">
                          Reason: "{booking.rejectionReason}"
                        </p>
                      )}
                    </div>

                    {/* Right: status + actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Status badge */}
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${statusPill[booking.status] || ''}`}>
                        {booking.status}
                      </span>

                      {/* Actions based on status */}
                      {booking.status === 'accepted' && slot && (() => {
                        const now = new Date()
                        const start = new Date(slot.startTime)
                        const diffMin = (start - now) / 60000
                        const canJoin = diffMin <= 15 && diffMin > -60

                        if (canJoin) {
                          return (
                            <button
                              onClick={() => navigate(`/dashboard/video/${slot._id}`)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[12px] font-black transition-all shadow-[0_4px_12px_rgba(34,197,94,0.3)] cursor-pointer"
                            >
                              <Video size={13} />
                              Join Call
                            </button>
                          )
                        } else if (diffMin > 15) {
                          // Calculate precise hours/minutes remaining
                          const totalSec = Math.floor((start - now) / 1000)
                          const hrs = Math.floor(totalSec / 3600)
                          const mins = Math.floor((totalSec % 3600) / 60)
                          const secs = totalSec % 60
                          const countdownStr = hrs > 0 
                            ? `${hrs}h ${mins}m` 
                            : `${mins}m ${secs}s`

                          return (
                            <span className="px-3 py-2 bg-white/5 border border-white/10 text-gray-500 rounded-lg text-[11px] font-bold flex items-center gap-1">
                              <Clock size={11} />
                              Starts in {countdownStr}
                            </span>
                          )
                        } else {
                          return (
                            <span className="text-[11px] text-gray-600 font-bold">
                              Session Ended
                            </span>
                          )
                        }
                      })()}

                      {booking.status === 'rejected' && !booking.rebookUsed && (
                        <button
                          onClick={handleRebook}
                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-[12px] font-bold transition-colors cursor-pointer"
                        >
                          <RefreshCw size={13} /> Rebook
                        </button>
                      )}

                      {booking.status === 'rejected' && booking.rebookUsed && (
                        <span className="text-[11px] text-gray-500">Rebook used</span>
                      )}

                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          className="px-3 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-[12px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {cancelling === booking._id
                            ? <Loader2 size={13} className="animate-spin" />
                            : 'Cancel'
                          }
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Browse Slots Modal ── */}
      <Modal
        isOpen={browseOpen}
        onClose={() => { setBrowseOpen(false); setBookingSlot(null); setIsRebook(false) }}
        title={isRebook ? '🔄 Choose a New Slot (Free Rebook)' : 'Browse Available Slots'}
      >
        <div className="space-y-5">

          {isRebook && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-[13px] text-amber-400">
              You have one free rebook after your rejection. Choose a different slot below.
            </div>
          )}

          {/* Date picker */}
          <div>
            <label className="block text-[13px] font-bold text-gray-300 mb-2">Select Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setBookingSlot(null) }}
              className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#F97316] cursor-pointer"
            />
          </div>

          {/* Available slots */}
          <div>
            <label className="block text-[13px] font-bold text-gray-300 mb-2">Available Slots</label>
            {loadingSlots ? (
              <div className="flex items-center gap-2 text-gray-400 py-6 justify-center">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-[13px]">Loading slots...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-[13px]">
                No open slots on this date. Try another date.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {slots.map(slot => (
                  <button
                    key={slot._id}
                    type="button"
                    onClick={() => setBookingSlot(slot)}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-left transition-all cursor-pointer ${
                      bookingSlot?._id === slot._id
                        ? 'border-[#F97316] bg-[#F97316]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-orange-400" />
                      <span className="text-[14px] font-bold text-white">
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-400">
                      {slot.capacity - slot.bookedCount} spot{slot.capacity - slot.bookedCount !== 1 ? 's' : ''} left
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Note */}
          {bookingSlot && (
            <div>
              <label className="block text-[13px] font-bold text-gray-300 mb-2">
                Note to trainer <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                maxLength={500}
                value={clientNote}
                onChange={e => setClientNote(e.target.value)}
                placeholder="e.g. I have a knee injury, please adjust exercises..."
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[13px] bg-slate-900 text-white placeholder-gray-600 focus:outline-none focus:border-[#F97316] resize-none"
              />
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setBrowseOpen(false); setBookingSlot(null); setIsRebook(false) }}
              className="px-5 py-3 border border-white/10 text-white hover:bg-white/10 rounded-lg text-[14px] font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleBook}
              disabled={!bookingSlot || submitting}
              className="px-5 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-[14px] font-bold transition-all cursor-pointer disabled:opacity-40 flex items-center gap-2"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? 'Sending...' : 'Request Booking'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  )
}
