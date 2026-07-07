import { useState, useEffect } from 'react'
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
  Bot
} from 'lucide-react'

import API from '../../../shared/utils/api'

export default function MyCoachPage() {
  const navigate = useNavigate()

  const { subscriptionTier, user } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [requestStatus, setRequestStatus] = useState('idle')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  
  // Real Data-kku vendiyulla puthiya states
  const [availableSlots, setAvailableSlots] = useState([])
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Coach-inte perum plan-um set cheyyunnu
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

  // 🚀 Component load aavumpol Backend API vilikkunnu
  useEffect(() => {
    const fetchCoachData = async () => {
      if (subscriptionTier === 'free' || !subscriptionTier) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch Slots
        const slotsRes = await fetch(`${API}/sessions/slots`, { credentials: 'include' })
        const slotsData = await slotsRes.json()
        if (slotsData.success) {
          setAvailableSlots(slotsData.data)
        }

        // Fetch My Sessions
        const sessionsRes = await fetch(`${API}/sessions/my-sessions`, { credentials: 'include' })
        const sessionsData = await sessionsRes.json()
        if (sessionsData.success) {
          setSessions(sessionsData.data)
        }
      } catch (error) {
        console.error("Failed to fetch coach data:", error)
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
        body: JSON.stringify({ 
          startTime: slotData.exactDate,
          sessionType: 'Weekly Check-in'
        })
      })
      
      const data = await res.json()
      if (data.success) {
        setRequestStatus('sent')
        
        // Book cheythu kazhinjal automatically puthiya list edukkuvan vendi
        const sessionsRes = await fetch(`${API}/sessions/my-sessions`, { credentials: 'include' })
        const sessionsData = await sessionsRes.json()
        if (sessionsData.success) {
          setSessions(sessionsData.data)
          // Book cheytha slot available slots-il ninnu mattunnu
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


  const getSessionStatus = (sessionDate) => {
    const now = new Date()
    const start = new Date(sessionDate)
    const diffMs = start - now
    const diffMin = diffMs / 60000

    // IVIDE MAATTUKA 15 ennullathu maatti 99999999 aakkuka (For testing UX)
    if (diffMin > 99999999) {
      return {
        status: 'upcoming',
        label: `Starts at ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        canJoin: false
      }
    }

    if (diffMin > -60 && diffMin <= 99999999) {
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

  return (
    <div className="max-w-4xl mx-auto relative min-h-[500px]">

      {/* Toast Notification */}
      {showUpgradePrompt && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] border border-[#F97316]/50 text-white px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.2)] flex items-center gap-4 animate-fade-in">
          <AlertCircle size={20} className="text-[#F97316]" />
          <div>
            <p className="font-bold text-sm">Upgrade to unlock coach messaging</p>
          </div>
          <button 
            onClick={() => navigate('/plans')}
            className="ml-2 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-black rounded-lg transition-colors cursor-pointer shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:scale-105"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Free Tier Lock Overlay */}
      {subscriptionTier === 'free' && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/10 animate-fade-in shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F97316]/20 to-[#ea580c]/10 border border-[#F97316]/30 flex items-center justify-center mb-6 text-[#F97316] shadow-[0_0_30px_rgba(249,115,22,0.3)] animate-pulse">
            <Lock size={32} />
          </div>
          <h3 className="text-3xl font-black text-white mb-3 font-['Syne']">Sample Coach Preview</h3>
          <p className="text-sm text-gray-300 max-w-md mb-8 leading-relaxed font-medium">
            This is a preview of what premium unlocks. Join FitForge Premium to get matched with a real certified coach, unlock personalized workout routines, and track your progress with advanced analytics.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-8 py-4 bg-gradient-to-r from-[#F97316] to-[#ea580c] text-white rounded-xl text-sm font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer uppercase tracking-wider"
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Actual Content Wrapper (Blurred for Free users) */}
      <div className={`space-y-8 ${subscriptionTier === 'free' ? 'blur-sm pointer-events-none select-none' : ''}`}>
        
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-black text-white tracking-tight font-['Syne'] mb-1">My Coach</h1>
          <p className="text-[15px] text-gray-400 font-medium">
            Your personal coaching overview
          </p>
        </div>

        {/* Coach Info Card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] border-l-4 border-l-[#F97316]/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] p-8">
          {assignedCoach && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Coach Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#F97316]/10 flex items-center justify-center text-[20px] font-bold text-[#F97316] shrink-0">
                {assignedCoach.name.charAt(0)}
              </div>

              {/* Coach Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[20px] font-bold text-white mb-1">{assignedCoach.name}</h2>
                <p className="text-sm text-gray-400 font-medium">{assignedCoach.role}</p>
              </div>

              {/* Message Coach Button */}
              <button
                onClick={(e) => {
                  if (subscriptionTier === 'free') {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowUpgradePrompt(true);
                    setTimeout(() => setShowUpgradePrompt(false), 5000);
                    return;
                  }
                  navigate('/dashboard/chat');
                }}
                className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2 shrink-0 ${
                  subscriptionTier === 'free'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.5)] hover:scale-105 cursor-pointer'
                }`}
              >
                <MessageSquare size={16} />
                Message Coach
              </button>
            </div>
          )}
        </div>

        {/* Coach Tools Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={(e) => {
              if (subscriptionTier === 'free') {
                e.preventDefault();
                e.stopPropagation();
                setShowUpgradePrompt(true);
                setTimeout(() => setShowUpgradePrompt(false), 5000);
                return;
              }
              navigate('/dashboard/chat');
            }} 
            className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-200 ease-out cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#a855f7]/10 flex items-center justify-center shrink-0 group-hover:bg-[#a855f7]/20 transition-colors">
                <MessageSquare size={20} className="text-[#a855f7]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-white mb-1 group-hover:text-[#a855f7] transition-colors">Coach Chat</h4>
                <p className="text-sm text-gray-400">Message your coach</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>

          <button onClick={() => navigate('/dashboard/schedule')} className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-200 ease-out cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F97316]/10 flex items-center justify-center shrink-0 group-hover:bg-[#F97316]/20 transition-colors">
                <CalendarDays size={20} className="text-[#F97316]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-white mb-1 group-hover:text-[#F97316] transition-colors">Schedule</h4>
                <p className="text-sm text-gray-400">Manage sessions</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>

          <button onClick={() => navigate('/dashboard/ai')} className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-200 ease-out cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center shrink-0 group-hover:bg-[#3b82f6]/20 transition-colors">
                <Bot size={20} className="text-[#3b82f6]" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-white mb-1 group-hover:text-[#3b82f6] transition-colors">AI Chatbot</h4>
                <p className="text-sm text-gray-400">Ask anything</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Stats Row */}
        {(subscriptionTier === 'personal_training' || subscriptionTier === 'wellness' || subscriptionTier === 'free') && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[20px] p-6 text-center flex flex-col items-center justify-center hover:bg-white/[0.08] transition-colors">
              <span className="text-3xl font-black text-white font-['Syne']">12</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Sessions Done</span>
            </div>
            <div className="bg-white/[0.05] backdrop-blur-xl border border-[#F97316]/30 border-t-white/[0.15] shadow-[0_8px_32px_rgba(249,115,22,0.15)] rounded-[20px] p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#F97316]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4" />
              <span className="text-3xl font-black text-white font-['Syne'] relative z-10">2</span>
              <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest mt-1 relative z-10">Days Until Next</span>
            </div>
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[20px] p-6 text-center flex flex-col items-center justify-center hover:bg-white/[0.08] transition-colors">
              <span className="text-3xl font-black text-white font-['Syne']">4</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Week Streak</span>
            </div>
          </div>
        )}

        {/* Subscription Summary */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] p-8">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Active Plan
          </h3>
          {subscription && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[18px] font-bold text-white mb-1">{subscription.planName}</p>
                <p className="text-sm text-gray-400">
                  Renews {subscription.renewDate}
                </p>
              </div>
              
              <div className="flex flex-col items-start sm:items-end gap-3">
                <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[12px] font-bold rounded-full">
                  Active
                </span>
                {subscriptionTier === 'free' && (
                  <button onClick={() => navigate('/plans')} className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 transition-colors group cursor-pointer">
                    Upgrade for full access <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gated Sessions Container */}
        {subscriptionTier === 'wellness' && (
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] p-8">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
              Upcoming Sessions
            </h3>
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Lock size={20} className="text-gray-500" />
              </div>
              <p className="font-bold text-white text-[15px] mb-1">Live Video sessions locked</p>
              <p className="text-[13px] text-gray-400 max-w-sm mb-4">
                Live video conference calls are exclusive to our Personal Training plan.
              </p>
              <button 
                onClick={() => navigate('/plans')}
                className="px-4 py-2 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        )}

        {(subscriptionTier === 'personal_training' || subscriptionTier === 'free') && (
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Upcoming Sessions
              </h3>
              {sessions.length > 0 && (
                <button
                  onClick={() => navigate('/dashboard/schedule')}
                  className="text-[12px] font-bold text-[#F97316] hover:text-[#EA580C] transition-colors cursor-pointer"
                >
                  View Schedule
                </button>
              )}
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const { status, label, canJoin } = getSessionStatus(session.date)

                  return (
                    <div
                      key={session.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      {/* Session Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Video size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-white">{session.type}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <CalendarDays size={12} className="text-gray-500" />
                            <span className="text-[12px] text-gray-400">
                              {new Date(session.date).toLocaleDateString([], {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <Clock size={12} className="text-gray-500" />
                            <span className="text-[12px] text-gray-400">
                              {new Date(session.date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Session Action */}
                      {status === 'active' && (
                        <button
                          onClick={() => navigate(`/dashboard/video/${session.id}`)}
                          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(34,197,94,0.3)] flex items-center gap-2 cursor-pointer"
                        >
                          <Video size={14} />
                          Join Call
                        </button>
                      )}

                      {status === 'upcoming' && (
                        <span className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-[13px] font-bold flex items-center gap-2 cursor-not-allowed">
                          <Clock size={14} />
                          {label}
                        </span>
                      )}

                      {status === 'past' && (
                        <span className="px-4 py-2.5 text-gray-500 text-[13px] font-bold flex items-center gap-2">
                          <CheckCircle2 size={14} />
                          {label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              /* No sessions — empty state */
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <CalendarDays size={24} className="text-gray-500" />
                </div>
                <h3 className="text-[16px] font-bold text-white mb-1">No upcoming sessions</h3>
                <p className="text-[13px] text-gray-400 max-w-sm mb-5">
                  Book a session with your coach below to get started.
                </p>
                <button
                  onClick={() => document.getElementById('book-session-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[13px] font-bold transition-colors border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <CalendarDays size={14} />
                  Book a Session
                </button>
              </div>
            )}
          </div>
        )}

        {/* Book Next Session */}
        {(subscriptionTier === 'personal_training' || subscriptionTier === 'free') && (
          <div id="book-session-section" className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.10] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-[24px] p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Book Next Session
              </h3>
            </div>
            
            {requestStatus === 'sent' ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-fade-in">
                <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-1">Request Sent!</h4>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Your request has been sent to your coach. Once approved, you'll receive a confirmation message in the Chat.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button 
                    onClick={() => {
                      setRequestStatus('idle')
                      setSelectedSlot(null)
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Book Another
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard/schedule')}
                    className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-[0_4px_12px_rgba(249,115,22,0.3)] flex items-center gap-2"
                  >
                    <CalendarDays size={14} />
                    Go to Schedule
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">Select an available time slot from your coach's schedule:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSlot === slot.id
                          ? 'bg-[#F97316]/20 border-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <p className={`font-bold ${selectedSlot === slot.id ? 'text-[#F97316]' : 'text-white'}`}>{slot.day}</p>
                      <p className={`text-sm mt-0.5 ${selectedSlot === slot.id ? 'text-[#F97316]/80' : 'text-gray-400'}`}>{slot.time}</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={!selectedSlot || requestStatus === 'sending'}
                    onClick={handleBookSession}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      !selectedSlot
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-[#F97316] text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] hover:scale-[1.02] cursor-pointer'
                    }`}
                  >
                    {requestStatus === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Send Request'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
