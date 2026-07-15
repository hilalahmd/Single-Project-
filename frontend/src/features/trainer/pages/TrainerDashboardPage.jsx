import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, DollarSign, CalendarDays, MessageSquare, Video, ArrowRight, TrendingUp, X, Reply, CheckCircle2 } from 'lucide-react'
import API from '../../../shared/utils/api'
import { useAuth } from '../../../shared/context/AuthContext'

export default function TrainerDashboardPage() {
  const navigate = useNavigate()
  const { role } = useAuth()
  // Real stats store cheyyan ulla state
  const [dashboardStats, setDashboardStats] = useState({
    activeClients: 0,
    unreadMessages: 0,
    upcomingSessions: 0,
    earnings: 0,
    recentMessages: []
  })

  // Modal States
  const [showUnreadModal, setShowUnreadModal] = useState(false)
  const [unreadList, setUnreadList] = useState([])
  const [loadingUnread, setLoadingUnread] = useState(false)

  // Page load aakumbol backend-il ninnu stats edukkunna useEffect
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/trainers/dashboard-stats`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setDashboardStats(data.stats)
        }
      } catch (error) {
        console.error("Dashboard stats edukkan pattiyailla:", error)
      }
    }
    fetchStats()
  }, [])

  const handleOpenUnreadModal = async () => {
    if (dashboardStats.unreadMessages === 0) return
    setShowUnreadModal(true)
    setLoadingUnread(true)
    try {
      const res = await fetch(`${API}/trainers/unread-messages`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setUnreadList(data.unreadMessages)
      }
    } catch (error) {
      console.error("Failed to fetch unread messages", error)
    } finally {
      setLoadingUnread(false)
    }
  }

  const handleReply = async (senderId) => {
    try {
      await fetch(`${API}/chat/mark-read/${senderId}`, { method: 'PUT', credentials: 'include' })
      navigate(`/trainer/chat/${senderId}`)
    } catch (error) {
      console.error("Failed to mark as read", error)
    }
  }

  // Nammude dummy data maatti, state-le real data vekkunnu
  const stats = [
    { label: 'Active Clients', value: dashboardStats.activeClients.toString(), icon: Users, color: 'text-orange-500' },
    { label: 'Unread Messages', value: dashboardStats.unreadMessages.toString(), icon: MessageSquare, color: 'text-amber-500' },
    ...(role !== 'wellness_coach' ? [{ label: 'Upcoming Sessions', value: dashboardStats.upcomingSessions.toString(), icon: Video, color: 'text-green-500' }] : []),
    { label: 'Earnings Balance', value: `$${dashboardStats.earnings}`, icon: DollarSign, color: 'text-emerald-400' },
  ]

  const upcomingSessions = dashboardStats.upcomingSessionsList || []


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-[32px] font-bold text-white tracking-tight">Trainer Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Here's your business overview for today.</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon
          const isUnread = s.label === 'Unread Messages'
          return (
            <div 
              key={i} 
              onClick={isUnread ? handleOpenUnreadModal : undefined}
              className={`bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#F97316] transition-colors ${isUnread && dashboardStats.unreadMessages > 0 ? 'cursor-pointer hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]' : ''}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center shrink-0">
                  <Icon size={20} className={s.color} />
                </div>
                <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              </div>
              <p className="text-[32px] font-bold text-white">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout for Sessions and Messages */}
      <div className={`grid lg:grid-cols-${role === 'wellness_coach' ? '1' : '2'} gap-8`}>
        
        {/* Upcoming Video Sessions */}
        {role !== 'wellness_coach' && (
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-semibold text-white">Today's Video Sessions</h2>
              <Link to="/trainer/schedule" className="text-sm font-semibold text-[#F97316] hover:text-orange-400 flex items-center gap-1 transition-colors">
                View Schedule <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4 flex-1">
              {upcomingSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                  <CalendarDays size={40} className="mb-3 opacity-50" />
                  <p className="font-medium">No upcoming sessions</p>
                </div>
              ) : (
                upcomingSessions.map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1E293B] hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F97316]/10 text-[#F97316] font-bold rounded-full flex items-center justify-center">
                        {session.time.split(':')[0]}
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{session.client}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{session.type} • {session.duration}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-colors">
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Unread Messages */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-white">Unread Messages</h2>
            <Link to="/trainer/chat" className="text-sm font-semibold text-[#F97316] hover:text-orange-400 flex items-center gap-1 transition-colors">
              Go to Inbox <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {(!dashboardStats.recentMessages || dashboardStats.recentMessages.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                <MessageSquare size={40} className="mb-3 opacity-50" />
                <p className="font-medium">All caught up!</p>
              </div>
            ) : (
              dashboardStats.recentMessages.map((msg, i) => {
                const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const clientName = msg.senderId?.name || 'Client'
                
                return (
                  <div key={i} className="p-4 bg-[#0F172A] rounded-xl border border-[#1E293B] hover:border-gray-700 transition-colors flex gap-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                      {clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-bold">{clientName}</h3>
                        <span className="text-xs font-semibold text-gray-500">{time}</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{msg.text}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>


      {/* Unread Messages Modal (Transparent Design) */}
      {showUnreadModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowUnreadModal(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0a0a0b]/80 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.15)] flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center">
                  <MessageSquare size={20} className="text-[#F97316]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Unread Messages</h2>
                  <p className="text-xs text-gray-400">{unreadList.length} total unread</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUnreadModal(false)}
                className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {loadingUnread ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : unreadList.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <CheckCircle2 size={40} className="mx-auto mb-3 opacity-20" />
                  <p>You caught up! No unread messages.</p>
                </div>
              ) : (
                unreadList.map((msg, i) => {
                  const sender = msg.senderId
                  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={msg._id} className="group p-4 bg-gray-900/40 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all rounded-2xl flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {sender?.avatar ? (
                            <img src={sender.avatar} alt={sender.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center">
                              {sender?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-white">{sender?.name || 'Unknown User'}</h4>
                            <span className="text-[11px] font-semibold text-gray-500">{time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-300 pl-13 line-clamp-2">{msg.text}</p>
                      
                      <div className="flex justify-end mt-1">
                        <button 
                          onClick={() => handleReply(sender._id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] text-xs font-bold rounded-full transition-colors"
                        >
                          <Reply size={14} /> Reply
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
