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
  Lock
} from 'lucide-react'

export default function MyCoachPage() {
  const navigate = useNavigate()
  const { subscriptionTier } = useAuth()

  // Dynamically compute coach and sub features based on subscriptionTier
  let assignedCoach = null
  let subscription = null
  let sessions = []

  if (subscriptionTier === 'wellness') {
    assignedCoach = {
      name: 'Priya Nair',
      role: 'Wellness Coach'
    }
    subscription = {
      planName: 'Wellness Plan (Monthly)',
      renewDate: 'August 12, 2026'
    }
    sessions = [] // No video session capability for Wellness
  } else if (subscriptionTier === 'pt') {
    assignedCoach = {
      name: 'Arjun Menon',
      role: 'Personal Trainer'
    }
    subscription = {
      planName: 'Personal Training Plan (Monthly)',
      renewDate: 'August 12, 2026'
    }
    // Pre-populate mock sessions for testing Join Call features (first session starts in 10 minutes so it is active)
    sessions = [
      {
        id: 'session-1',
        type: 'Form Correction',
        date: new Date(Date.now() + 10 * 60 * 1000).toISOString() // Active now
      },
      {
        id: 'session-2',
        type: 'Weekly Check-in',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
      }
    ]
  } else {
    // Free plan preview details (rendered behind the blur)
    assignedCoach = {
      name: 'Priya Nair',
      role: 'Wellness Coach'
    }
    subscription = {
      planName: 'Free Preview Mode',
      renewDate: 'N/A'
    }
    sessions = []
  }

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

  return (
    <div className="max-w-4xl mx-auto relative min-h-[500px]">

      {/* Free Tier Lock Overlay */}
      {subscriptionTier === 'free' && (
        <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4 text-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">Personal Coaching Locked</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
            Upgrade to a premium coaching plan to get matched with a certified coach, unlock personalized workout routines, and receive direct message support.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#ff8c3a] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Actual Content Wrapper (Blurred for Free users) */}
      <div className={`space-y-8 ${subscriptionTier === 'free' ? 'blur-sm pointer-events-none select-none' : ''}`}>
        
        {/* Page Header */}
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight font-['Syne']">My Coach</h1>
          <p className="text-gray-400 font-medium text-[14px] mt-1">
            Your personal coaching overview
          </p>
        </div>

        {/* Coach Info Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {assignedCoach && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Coach Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center text-[24px] font-bold text-white shrink-0">
                {assignedCoach.name.charAt(0)}
              </div>

              {/* Coach Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[20px] font-bold text-white">{assignedCoach.name}</h2>
                <p className="text-[14px] text-gray-400 font-medium mt-0.5">{assignedCoach.role}</p>
              </div>

              {/* Message Coach Button */}
              <button
                onClick={() => navigate('/dashboard/chat')}
                className="px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <MessageSquare size={16} />
                Message Coach
              </button>
            </div>
          )}
        </div>

        {/* Subscription Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Active Plan
          </h3>
          {subscription && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[18px] font-bold text-white">{subscription.planName}</p>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  Renews {subscription.renewDate}
                </p>
              </div>
              <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[12px] font-bold rounded-full">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Gated Sessions Container */}
        {subscriptionTier === 'wellness' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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

        {(subscriptionTier === 'pt' || subscriptionTier === 'free') && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white/5 border border-white/10 rounded-xl"
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
                  Book a session with your coach to get started.
                </p>
                <button
                  onClick={() => navigate('/plans')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[13px] font-bold transition-colors border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <CalendarDays size={14} />
                  Book a Session
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
