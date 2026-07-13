import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import {
  UserCheck,
  MessageSquare,
  CalendarDays,
  Video,
  Clock,
  AlertCircle,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  Bot,
  Zap
} from 'lucide-react'

import API from '../../../shared/utils/api'

// ─── Animated stat counter ─────────────────────────────────────────────
function AnimatedStat({ target, duration = 900, delay = 0 }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(null)
  useEffect(() => {
    const t = setTimeout(() => {
      if (target === 0) { setCurrent(0); return }
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(target * eased))
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current) }
  }, [target, duration, delay])
  return <>{current}</>
}

export default function MyCoachPage() {
  const navigate = useNavigate()

  const { subscriptionTier, user } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [requestStatus, setRequestStatus] = useState('idle')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  
  const [availableSlots, setAvailableSlots] = useState([])
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  let assignedCoach = {
    name: user?.assignedTrainer?.name || 'Awaiting Assignment',
    role: subscriptionTier === 'wellness' ? 'Wellness Coach' : 'Personal Trainer'
  }
  let subscription = {
    planName: subscriptionTier === 'wellness' ? 'Wellness Plan' : 'Personal Training',
    renewDate: 'Next Month'
  }

  if (subscriptionTier === 'free' || !subscriptionTier) {
    assignedCoach = { name: 'Sample Coach Profile', role: 'Preview of Premium Coaching' }
    subscription = { planName: 'Free Preview Mode', renewDate: 'N/A' }
  }

  useEffect(() => {
    const fetchCoachData = async () => {
      if (subscriptionTier === 'free' || !subscriptionTier) {
        setIsLoading(false)
        return
      }
      try {
        const slotsRes = await fetch(`${API}/sessions/slots`, { credentials: 'include' })
        const slotsData = await slotsRes.json()
        if (slotsData.success) setAvailableSlots(slotsData.data)

        const sessionsRes = await fetch(`${API}/sessions/my-sessions`, { credentials: 'include' })
        const sessionsData = await sessionsRes.json()
        if (sessionsData.success) setSessions(sessionsData.data)
      } catch (error) {
        console.error('Failed to fetch coach data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCoachData()
  }, [subscriptionTier, user])

  const handleBookSession = async () => {
    if (!selectedSlot) return
    setRequestStatus('sending')
    try {
      const slotData = availableSlots.find(s => s.id === selectedSlot)
      const res = await fetch(`${API}/sessions/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ startTime: slotData.exactDate, sessionType: 'Weekly Check-in' })
      })
      const data = await res.json()
      if (data.success) {
        setRequestStatus('sent')
        const sessionsRes = await fetch(`${API}/sessions/my-sessions`, { credentials: 'include' })
        const sessionsData = await sessionsRes.json()
        if (sessionsData.success) {
          setSessions(sessionsData.data)
          setAvailableSlots(prev => prev.filter(s => s.id !== selectedSlot))
        }
      } else {
        alert(data.message || 'Error booking session')
        setRequestStatus('idle')
      }
    } catch (error) {
      console.error(error)
      setRequestStatus('idle')
    }
  }

  const getSessionStatus = (startTime) => {
    const now = new Date()
    const start = new Date(startTime)
    const diffMin = (start - now) / 60000
    if (diffMin > 15) return { status: 'upcoming', label: `Starts at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, canJoin: false }
    if (diffMin > -60 && diffMin <= 15) return { status: 'active', label: 'Join Call', canJoin: true }
    return { status: 'past', label: 'Completed', canJoin: false }
  }

  const isAwaitingCoach = assignedCoach.name === 'Awaiting Assignment'

  const statSessions = 12
  const statDaysUntil = 2
  const statStreak = 4

  return (
    <div className="max-w-4xl mx-auto relative min-h-[500px] space-y-6">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.04) 0%, transparent 70%)' }} />
      </div>

      {/* ── Upgrade toast (free tier) ── */}
      {showUpgradePrompt && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 px-5 py-4 rounded-[16px] border shadow-2xl"
          style={{ background: '#0f1117', borderColor: 'rgba(196,241,53,0.3)', boxShadow: '0 0 30px rgba(196,241,53,0.1)' }}>
          <AlertCircle size={18} style={{ color: '#C4F135' }} className="shrink-0" />
          <p className="font-bold text-sm text-white">Upgrade to unlock coach messaging</p>
          <button
            onClick={() => navigate('/plans')}
            className="ml-1 px-4 py-2 rounded-full text-xs font-black transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b' }}
          >
            Upgrade
          </button>
        </div>
      )}

      {/* ── Free Tier Lock Overlay ── */}
      {subscriptionTier === 'free' && (
        <div className="absolute inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 rounded-[24px]"
          style={{ background: 'rgba(10,10,11,0.75)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(196,241,53,0.08)', border: '1px solid rgba(196,241,53,0.2)', boxShadow: '0 0 40px rgba(196,241,53,0.12)' }}>
            <Lock size={32} style={{ color: '#C4F135' }} className="glow-pulse" />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 font-['Syne']">Sample Coach Preview</h3>
          <p className="text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
            This is a preview of what premium unlocks. Join FitForge Premium to get matched with a real certified coach, unlock personalized workout routines, and track your progress with advanced analytics.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-8 py-4 rounded-full text-sm font-black transition-all active:scale-95 hover:-translate-y-0.5 uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b', boxShadow: '0 4px 24px rgba(196,241,53,0.35)' }}
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className={`relative z-10 space-y-6 ${subscriptionTier === 'free' ? 'blur-sm pointer-events-none select-none' : ''}`}>

        {/* Header */}
        <div className="coach-card-1">
          <h1 className="text-[28px] font-black text-white tracking-tight font-['Syne']">My Coach</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your personal coaching overview</p>
        </div>

        {/* ── Coach Info Card ── */}
        <div
          className="coach-card-1 rounded-[20px] p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {assignedCoach && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Coach Avatar */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shrink-0 font-['Syne'] ${
                  isAwaitingCoach ? 'glow-pulse' : ''
                }`}
                style={{
                  background: isAwaitingCoach ? 'rgba(196,241,53,0.08)' : 'rgba(196,241,53,0.12)',
                  border: `1px solid ${isAwaitingCoach ? 'rgba(196,241,53,0.2)' : 'rgba(196,241,53,0.3)'}`,
                  color: '#C4F135',
                  boxShadow: isAwaitingCoach ? '0 0 20px rgba(196,241,53,0.1)' : '0 0 16px rgba(196,241,53,0.15)',
                }}
              >
                {isAwaitingCoach ? <Search size={22} /> : assignedCoach.name.charAt(0)}
              </div>

              {/* Coach Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-[18px] font-black text-white">{assignedCoach.name}</h2>
                  {isAwaitingCoach && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: '#C4F135', background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {isAwaitingCoach
                    ? "We're matching you with the perfect coach…"
                    : assignedCoach.role}
                </p>
              </div>

              {/* Message Coach */}
              <button
                onClick={(e) => {
                  if (subscriptionTier === 'free') {
                    e.preventDefault(); e.stopPropagation()
                    setShowUpgradePrompt(true)
                    setTimeout(() => setShowUpgradePrompt(false), 5000)
                    return
                  }
                  navigate(`/dashboard/chat/${user.assignedTrainer.trainerUserId}`)
                }}
                aria-label="Message your coach"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-black transition-all duration-200 active:scale-95 shrink-0 ${
                  subscriptionTier === 'free'
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:-translate-y-0.5'
                }`}
                style={{
                  background: subscriptionTier === 'free'
                    ? 'rgba(255,255,255,0.06)'
                    : 'linear-gradient(135deg, #C4F135, #a3d625)',
                  color: subscriptionTier === 'free' ? '#6b7280' : '#0a0a0b',
                  boxShadow: subscriptionTier === 'free' ? 'none' : '0 4px 16px rgba(196,241,53,0.3)',
                }}
              >
                <MessageSquare size={14} />
                Message Coach
              </button>
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div className="coach-card-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Coach Chat */}
          <button
            onClick={(e) => {
              if (subscriptionTier === 'free') {
                e.preventDefault(); e.stopPropagation()
                setShowUpgradePrompt(true)
                setTimeout(() => setShowUpgradePrompt(false), 5000)
                return
              }
              navigate('/dashboard/chat')
            }}
            aria-label="Open coach chat"
            className="group flex items-center justify-between p-5 rounded-[18px] transition-all duration-200 hover:-translate-y-1 text-left"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,241,53,0.1)'; e.currentTarget.style.borderColor = 'rgba(196,241,53,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                <MessageSquare size={18} style={{ color: '#C4F135' }} />
              </div>
              <div>
                <h4 className="font-black text-sm text-white mb-0.5">Coach Chat</h4>
                <p className="text-xs text-gray-500">Message your coach</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-600 transition-all duration-200 group-hover:text-white group-hover:translate-x-1" />
          </button>

          {/* Schedule */}
          <button
            onClick={() => navigate('/dashboard/schedule')}
            aria-label="Go to schedule"
            className="group flex items-center justify-between p-5 rounded-[18px] transition-all duration-200 hover:-translate-y-1 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,241,53,0.1)'; e.currentTarget.style.borderColor = 'rgba(196,241,53,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                <CalendarDays size={18} style={{ color: '#C4F135' }} />
              </div>
              <div>
                <h4 className="font-black text-sm text-white mb-0.5">Schedule</h4>
                <p className="text-xs text-gray-500">Manage sessions</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-600 transition-all duration-200 group-hover:text-white group-hover:translate-x-1" />
          </button>

          {/* AI Chatbot */}
          <button
            onClick={() => navigate('/dashboard/ai')}
            aria-label="Open AI chatbot"
            className="group flex items-center justify-between p-5 rounded-[18px] transition-all duration-200 hover:-translate-y-1 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(196,241,53,0.1)'; e.currentTarget.style.borderColor = 'rgba(196,241,53,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                <Bot size={18} style={{ color: '#C4F135' }} />
              </div>
              <div>
                <h4 className="font-black text-sm text-white mb-0.5">AI Chatbot</h4>
                <p className="text-xs text-gray-500">Ask anything</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-600 transition-all duration-200 group-hover:text-white group-hover:translate-x-1" />
          </button>
        </div>

        {/* ── Stats Row ── */}
        {(subscriptionTier === 'personal_training' || subscriptionTier === 'wellness' || subscriptionTier === 'free') && (
          <div className="coach-card-3 grid grid-cols-3 gap-4">
            {/* Sessions Done */}
            <div
              className="rounded-[20px] p-6 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <span className="text-3xl font-black text-white font-['Syne']">
                <AnimatedStat target={statSessions} delay={0} />
              </span>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1.5">Sessions Done</span>
            </div>

            {/* Days Until Next — highlighted with lime */}
            <div
              className="rounded-[20px] p-6 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
              style={{
                background: 'rgba(196,241,53,0.05)',
                border: '1px solid rgba(196,241,53,0.2)',
                boxShadow: '0 0 24px rgba(196,241,53,0.08), 0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.15) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
              <span className="text-3xl font-black text-white font-['Syne'] relative z-10">
                <AnimatedStat target={statDaysUntil} delay={120} />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1.5 relative z-10" style={{ color: '#C4F135' }}>Days Until Next</span>
            </div>

            {/* Week Streak */}
            <div
              className="rounded-[20px] p-6 text-center flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              <span className="text-3xl font-black text-white font-['Syne']">
                <AnimatedStat target={statStreak} delay={240} />
              </span>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1.5">Week Streak</span>
            </div>
          </div>
        )}

        {/* ── Active Plan Card ── */}
        <div
          className="coach-card-4 rounded-[20px] p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-5">Active Plan</p>
          {subscription && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[18px] font-black text-white font-['Syne'] mb-1">{subscription.planName}</p>
                <p className="text-sm text-gray-500">Renews {subscription.renewDate}</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-3">
                {/* Active badge */}
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{ color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', boxShadow: '0 0 12px rgba(74,222,128,0.08)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block glow-pulse" />
                  Active
                </span>
                {subscriptionTier === 'free' && (
                  <button
                    onClick={() => navigate('/plans')}
                    className="text-xs font-bold flex items-center gap-1 transition-all duration-200 hover:gap-2 group"
                    style={{ color: '#C4F135' }}
                  >
                    Upgrade for full access
                    <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Upcoming Sessions — Wellness (Locked) ── */}
        {subscriptionTier === 'wellness' && (
          <div
            className="coach-card-5 rounded-[20px] p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(196,241,53,0.03) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(196,241,53,0.15)',
              boxShadow: '0 0 40px rgba(196,241,53,0.06), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 relative z-10">Upcoming Sessions</p>

            <div className="flex flex-col items-center text-center py-4 relative z-10">
              {/* Premium upsell icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full blur-xl"
                  style={{ background: 'rgba(196,241,53,0.2)', transform: 'scale(1.6)' }} />
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.3)' }}
                >
                  <Zap size={28} style={{ color: '#C4F135' }} />
                </div>
              </div>

              <h4 className="font-black text-white text-[16px] mb-2 font-['Syne']">Live Video Sessions</h4>
              <p className="text-[13px] text-gray-500 max-w-xs mb-7 leading-relaxed">
                1-on-1 live video coaching calls are exclusive to our Personal Training plan.
                Upgrade to unlock real-time sessions with your trainer.
              </p>

              <button
                onClick={() => navigate('/plans')}
                className="px-7 py-3 rounded-full text-[13px] font-black transition-all duration-200 active:scale-95 hover:-translate-y-0.5 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #C4F135, #a3d625)',
                  color: '#0a0a0b',
                  boxShadow: '0 4px 20px rgba(196,241,53,0.35)',
                }}
              >
                <Sparkles size={14} /> Upgrade Plan
              </button>
            </div>
          </div>
        )}

        {/* ── Upcoming Sessions — Personal Training / Free ── */}
        {(subscriptionTier === 'personal_training' || subscriptionTier === 'free') && (
          <div
            className="coach-card-5 rounded-[20px] p-6 md:p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upcoming Sessions</p>
              {sessions.length > 0 && (
                <button
                  onClick={() => navigate('/dashboard/schedule')}
                  className="text-[12px] font-bold transition-all duration-200 hover:gap-2 flex items-center gap-1 group"
                  style={{ color: '#C4F135' }}
                >
                  View Schedule <ChevronRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              )}
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const { status, label, canJoin } = getSessionStatus(session.startTime)
                  return (
                    <div
                      key={session._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-[14px] transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(196,241,53,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(196,241,53,0.08)', border: '1px solid rgba(196,241,53,0.15)' }}>
                          <Video size={16} style={{ color: '#C4F135' }} />
                        </div>
                        <div>
                          <p className="text-[14px] font-black text-white">{session.type}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <CalendarDays size={11} className="text-gray-600" />
                            <span className="text-[11px] text-gray-500">
                              {new Date(session.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <Clock size={11} className="text-gray-600" />
                            <span className="text-[11px] text-gray-500">
                              {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {status === 'active' && (
                        <button
                          onClick={() => navigate(`/dashboard/video/${session._id}`)}
                          className="px-5 py-2.5 rounded-full text-[13px] font-black transition-all active:scale-95 flex items-center gap-2"
                          style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 4px 12px rgba(34,197,94,0.2)' }}
                        >
                          <Video size={13} /> Join Call
                        </button>
                      )}
                      {status === 'upcoming' && (
                        <span className="px-4 py-2.5 rounded-full text-[12px] font-bold flex items-center gap-2"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                          <Clock size={12} /> {label}
                        </span>
                      )}
                      {status === 'past' && (
                        <span className="text-[12px] font-bold flex items-center gap-2 text-gray-600">
                          <CheckCircle2 size={13} /> {label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <CalendarDays size={22} className="text-gray-600" />
                </div>
                <h3 className="text-[15px] font-black text-white mb-1.5">No upcoming sessions</h3>
                <p className="text-[13px] text-gray-500 max-w-xs mb-6">Book a session with your coach below to get started.</p>
                <button
                  onClick={() => document.getElementById('book-session-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}
                >
                  <CalendarDays size={13} /> Book a Session
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Real Booking Redirection Card ── */}
        {(subscriptionTier === 'personal_training' || subscriptionTier === 'free') && (
          <div
            className="coach-card-6 rounded-[20px] p-6 md:p-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(249,115,22,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Ambient orange glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />

            <div className="flex flex-col items-center py-4 relative z-10">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <CalendarDays size={24} className="text-[#F97316]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">Book Live Sessions</h3>
              <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
                Manage your availability slots, request new personal/group workouts, and join WebRTC calls with your coach directly from the dedicated Schedule page.
              </p>
              <button
                onClick={() => navigate('/dashboard/schedule')}
                className="px-6 py-3 rounded-full text-xs font-black transition-all active:scale-95 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #F97316, #ff8c3a)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
                }}
              >
                Go to Schedule
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
