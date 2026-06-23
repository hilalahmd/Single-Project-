import { Search, MessageSquare, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

const CLIENTS = [
  { id: 1, name: 'David Kim',   plan: 'Strength Program',  sessions: 18, status: 'Active' },
  { id: 2, name: 'Anita Rao',   plan: 'Yoga & Flexibility', sessions: 9,  status: 'Active' },
  { id: 3, name: 'Tom Morris',  plan: 'HIIT & Cardio',      sessions: 24, status: 'Active' },
  { id: 4, name: 'Lisa Park',   plan: 'Weight Loss',        sessions: 6,  status: 'Paused' },
  { id: 5, name: 'James Cho',   plan: 'Muscle Gain',        sessions: 12, status: 'Active' },
]

export default function ClientListPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">My Clients</h1>
        <span className="text-sm text-gray-500">{CLIENTS.length} total</span>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search clients..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors" />
      </div>

      <div className="border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-5 px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span className="col-span-2">Client</span>
          <span>Plan</span>
          <span>Sessions</span>
          <span>Actions</span>
        </div>
        {/* Rows */}
        {CLIENTS.map(c => (
          <div key={c.id} className="grid grid-cols-5 items-center px-4 py-3.5 border-b border-gray-50 last:border-0">
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold">{c.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-semibold text-black">{c.name}</p>
                <span className={`text-xs ${c.status === 'Active' ? 'text-gray-600' : 'text-gray-400'}`}>{c.status}</span>
              </div>
            </div>
            <span className="text-xs text-gray-600">{c.plan}</span>
            <span className="text-sm font-semibold text-black">{c.sessions}</span>
            <div className="flex gap-2">
              <Link to={`/trainer/chat/${c.id}`} className="p-1.5 border border-gray-200 hover:border-black transition-colors" title="Message">
                <MessageSquare size={14} className="text-gray-600" />
              </Link>
              <Link to="/trainer/video" className="p-1.5 border border-gray-200 hover:border-black transition-colors" title="Video">
                <Video size={14} className="text-gray-600" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
