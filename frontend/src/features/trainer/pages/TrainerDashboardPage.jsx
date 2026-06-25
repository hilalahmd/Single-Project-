import { Link } from 'react-router-dom'
import { Users, DollarSign, CalendarDays, MessageSquare, Video, ArrowRight, TrendingUp } from 'lucide-react'

export default function TrainerDashboardPage() {
  const stats = [
    { label: 'Active Clients', value: '24', icon: Users, color: 'text-blue-500' },
    { label: 'Unread Messages', value: '12', icon: MessageSquare, color: 'text-amber-500' },
    { label: 'Upcoming Sessions', value: '4', icon: Video, color: 'text-green-500' },
    { label: 'Earnings Balance', value: '$3,840', icon: DollarSign, color: 'text-emerald-400' },
  ]

  const upcomingSessions = [
    { client: 'David Kim', time: '9:00 AM', duration: '60 min', type: 'Strength Training' },
    { client: 'Anita Rao', time: '11:00 AM', duration: '45 min', type: 'Form Review' },
    { client: 'Tom Morris', time: '2:00 PM', duration: '60 min', type: 'HIIT Session' },
  ]

  const unreadMessages = [
    { client: 'Lisa Park', text: 'Hey coach, I felt a slight twinge in my shoulder during the bench press...', time: '10 min ago' },
    { client: 'James Chen', text: 'Just logged my meals for today! Hit my protein goal.', time: '1 hour ago' },
  ]

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
          return (
            <div key={i} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm hover:border-[#2563EB] transition-colors">
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
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Upcoming Video Sessions */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-white">Today's Video Sessions</h2>
            <Link to="/trainer/schedule" className="text-sm font-semibold text-[#2563EB] hover:text-blue-400 flex items-center gap-1 transition-colors">
              View Schedule <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {upcomingSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#111827] border border-[#1E293B] flex items-center justify-center text-white font-bold shrink-0">
                    {session.client.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-[15px]">{session.client}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5">{session.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2563EB] text-[15px]">{session.time}</p>
                  <p className="text-[12px] text-gray-500 font-medium">{session.duration}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/trainer/video" className="mt-6 w-full py-3 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
            <Video size={18} /> Join Next Session
          </Link>
        </div>

        {/* Unread Messages */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-semibold text-white">Unread Messages</h2>
            <Link to="/trainer/chat" className="text-sm font-semibold text-[#2563EB] hover:text-blue-400 flex items-center gap-1 transition-colors">
              Go to Inbox <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {unreadMessages.map((msg, i) => (
              <div key={i} className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#111827] border border-[#1E293B] flex items-center justify-center text-xs text-white font-bold shrink-0">
                      {msg.client.charAt(0)}
                    </div>
                    <p className="font-semibold text-white text-[14px]">{msg.client}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">{msg.time}</span>
                </div>
                <p className="text-[14px] text-gray-300 line-clamp-2 leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Quick Action Link */}
          <Link to="/trainer/clients" className="mt-6 w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
            <Users size={18} className="text-gray-400" /> View All Clients
          </Link>
        </div>

      </div>
    </div>
  )
}
