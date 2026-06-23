import { Link } from 'react-router-dom'
import { Users, DollarSign, CalendarDays, TrendingUp, ArrowRight } from 'lucide-react'

const STATS = [
  { label: 'Active Clients',   value: '24',     sub: '+3 this month' },
  { label: 'Monthly Earnings', value: '$3,840',  sub: '+12% vs last month' },
  { label: 'Sessions Today',   value: '4',       sub: 'Next: 2:00 PM' },
  { label: 'Avg. Rating',      value: '4.9 ★',   sub: 'From 86 reviews' },
]

const UPCOMING = [
  { client: 'David Kim',   time: '9:00 AM',  type: 'Strength' },
  { client: 'Anita Rao',   time: '11:00 AM', type: 'Yoga' },
  { client: 'Tom Morris',  time: '2:00 PM',  type: 'HIIT' },
  { client: 'Lisa Park',   time: '4:30 PM',  type: 'Nutrition Review' },
]

export default function TrainerDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-black">Welcome back, Alex 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's your training overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-black text-black mt-2">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/trainer/clients',       icon: Users,       label: 'My Clients' },
          { to: '/trainer/earnings',       icon: DollarSign,  label: 'Earnings' },
          { to: '/trainer/schedule',       icon: CalendarDays, label: 'Schedule' },
          { to: '/trainer/plans/workout',  icon: TrendingUp,  label: 'Plans' },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-2 p-4 border border-gray-200 hover:border-black transition-colors group">
            <Icon size={20} className="text-black" />
            <span className="text-xs font-semibold text-gray-700 group-hover:text-black">{label}</span>
          </Link>
        ))}
      </div>

      {/* Today's sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Today's Sessions</h2>
          <Link to="/trainer/schedule" className="text-xs font-semibold text-black flex items-center gap-1 hover:underline">
            Full schedule <ArrowRight size={12} />
          </Link>
        </div>
        <div className="border border-gray-200 divide-y divide-gray-100">
          {UPCOMING.map(u => (
            <div key={u.client} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-bold">{u.client.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-black">{u.client}</p>
                  <p className="text-xs text-gray-500">{u.type}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-black">{u.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
