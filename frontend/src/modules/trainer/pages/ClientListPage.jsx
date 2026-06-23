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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-black tracking-tight">My Clients</h1>
          <p className="text-[14px] text-gray-500 mt-1">Manage and communicate with your active clients.</p>
        </div>
        <span className="px-4 py-2 bg-gray-100 border border-gray-200 text-black rounded-lg text-[14px] font-bold shadow-sm">{CLIENTS.length} Total</span>
      </div>

      <div className="relative shadow-sm">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search clients..." className="w-full pl-12 pr-4 py-3.5 border border-gray-200 bg-white rounded-xl text-[14px] text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-400" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 px-6 py-4 bg-gray-50 border-b border-gray-200 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
          <span className="col-span-2">Client</span>
          <span>Plan</span>
          <span>Sessions</span>
          <span>Actions</span>
        </div>
        {/* Rows */}
        <div>
          {CLIENTS.map(c => (
            <div key={c.id} className="grid grid-cols-5 items-center px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-[14px] font-bold rounded-full shadow-sm">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-black">{c.name}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.status}
                  </span>
                </div>
              </div>
              <span className="text-[14px] text-gray-600 font-medium">{c.plan}</span>
              <span className="text-[15px] font-bold text-black">{c.sessions}</span>
              <div className="flex gap-2">
                <Link to={`/trainer/chat/${c.id}`} className="p-2 border border-gray-200 bg-white hover:border-black hover:text-black text-gray-500 rounded-lg transition-colors shadow-sm" title="Message">
                  <MessageSquare size={16} />
                </Link>
                <Link to="/trainer/video" className="p-2 border border-gray-200 bg-white hover:border-black hover:text-black text-gray-500 rounded-lg transition-colors shadow-sm" title="Video">
                  <Video size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
