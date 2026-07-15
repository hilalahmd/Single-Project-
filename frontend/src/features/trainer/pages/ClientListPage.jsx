import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Filter, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, Activity, MessageSquare, TrendingUp, BarChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import API from '../../../shared/utils/api' // Backend vilikkan ulla API tool

export default function ClientListPage() {
  const [search, setSearch] = useState('')
  // Dummy data-kku pakaram useState array kodukkunnu (Real data store cheyyan)
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Page load aakumbol backend-il ninnu data fetch cheyyan ulla useEffect
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${API}/trainers/clients`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setClients(data.clients)
        }
      } catch (error) {
        console.error("Error loading clients:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchClients()
  }, [])

  // Search filter (User type cheyyunnathinu anusarichu filter aavan)
  const filtered = useMemo(() => {
    if (!search) return clients
    return clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [clients, search])

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-white tracking-tight">My Clients</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your active clients and their programs.</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-64 bg-[#111827] border border-[#1E293B] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0F172A] border-b border-[#1E293B] text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Current Goal</th>
                <th className="px-6 py-4">Latest Weight</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              
              {/* Loading spinner */}
              {isLoading && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#2563EB]">
                    Loading clients...
                  </td>
                </tr>
              )}

              {/* Data vannal oro client-neyum map cheythu table row aaki matunnu */}
              {!isLoading && filtered.map(client => (
                <tr key={client._id} className="hover:bg-[#0F172A]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-white font-bold border border-gray-700">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-[15px]">{client.name}</p>
                        <p className="text-[12px] flex items-center gap-1 mt-0.5 text-gray-400">
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Database-il ninnulla real Goal */}
                  <td className="px-6 py-4 font-medium text-gray-300 capitalize">
                    {client.bodyMetrics?.goal?.replace('_', ' ') || 'Not Set'}
                  </td>
                  
                  {/* Database-il ninnulla real Weight */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-gray-500" />
                      <span className="font-semibold text-white">
                        {client.bodyMetrics?.weight ? `${client.bodyMetrics.weight} kg` : 'N/A'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#22C55E]/10 text-[#22C55E]">
                      Active
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/trainer/plans/build/${client._id}`}
                        className="px-3 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/20 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Activity size={14} /> Update Plan
                      </Link>
                      <Link 
                        to={`/trainer/chat/${client._id}`}
                        className="px-3 py-1.5 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/20 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5"
                        title="Message Client"
                      >
                        <MessageSquare size={14} /> Chat
                      </Link>
                      <Link 
                        to={`/trainer/analytics/${client._id}`}
                        className="px-3 py-1.5 bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/20 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5"
                        title="Analytics Dashboard"
                      >
                        <BarChart size={14} /> Analytics
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-sm">No clients found.</p>
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
