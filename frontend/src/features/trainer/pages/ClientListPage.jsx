import { useState } from 'react'
import { Search, MoreVertical, Activity, Plus, TrendingUp, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ClientListPage() {
  const [search, setSearch] = useState('')

  const clients = [
    { id: 1, name: 'David Kim', goal: 'Muscle Gain', weight: '76 kg', status: 'Active', planStatus: 'Needs Update' },
    { id: 2, name: 'Anita Rao', goal: 'Weight Loss', weight: '65 kg', status: 'Active', planStatus: 'Up to date' },
    { id: 3, name: 'Tom Morris', goal: 'Endurance', weight: '82 kg', status: 'Inactive', planStatus: 'Expired' },
    { id: 4, name: 'Lisa Park', goal: 'General Fitness', weight: '58 kg', status: 'Active', planStatus: 'Up to date' },
    { id: 5, name: 'James Chen', goal: 'Weight Loss', weight: '90 kg', status: 'Active', planStatus: 'Needs Update' },
  ]

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">My Clients</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your active clients and their programs.</p>
        </div>
      </div>

      {/* Status Disclaimer Banner */}
      <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-[16px] p-4 flex items-center gap-3 text-sm font-bold text-[#2563EB]">
        <Activity size={18} className="shrink-0 animate-pulse" />
        <p>Demo Mode — These are pre-loaded demo clients for previewing your profile layout. You can click "Update Plan" on any client to view the custom plan builder tool.</p>
      </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-[#111827] border border-[#1E293B] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

      {/* Clients Table / List */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0F172A] border-b border-[#1E293B] text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Current Goal</th>
                <th className="px-6 py-4">Latest Weight</th>
                <th className="px-6 py-4">Plan Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-[#0F172A]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-white font-bold border border-gray-700">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-[15px]">{client.name}</p>
                        <p className="text-[12px] flex items-center gap-1 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-[#22C55E]' : 'bg-red-500'}`}></span>
                          {client.status}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-300">
                    {client.goal}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-gray-500" />
                      <span className="font-semibold text-white">{client.weight}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      client.planStatus === 'Up to date' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                      client.planStatus === 'Needs Update' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {client.planStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/trainer/plans/build/${client.id}`}
                        className="px-3 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/20 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Activity size={14} /> Update Plan
                      </Link>
                      <Link 
                        to={`/trainer/chat/${client.id}`}
                        className="px-3 py-1.5 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/20 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5"
                        title="Message Client"
                      >
                        <MessageSquare size={14} /> Chat
                      </Link>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1E293B] transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-sm">No clients found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
