import { useState } from 'react'
import { Search, Eye, XCircle } from 'lucide-react'

export default function SubscriptionManagementPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const subscriptions = [
    { id: 1, client: 'Hilal', trainer: 'Arjun Menon', plan: 'Wellness', start: 'Oct 1, 2026', end: 'Nov 1, 2026', amt: '₹999', status: 'Active' },
    { id: 2, client: 'Meera Thomas', trainer: 'Priya Nair', plan: 'Personal Training', start: 'Sep 15, 2026', end: 'Oct 15, 2026', amt: '₹2,499', status: 'Expired' },
    { id: 3, client: 'Sanjay Kumar', trainer: 'Arjun Menon', plan: 'Wellness', start: 'Oct 10, 2026', end: 'Nov 10, 2026', amt: '₹999', status: 'Active' },
    { id: 4, client: 'Rahul S', trainer: 'Karthik S', plan: 'Personal Training', start: 'Aug 1, 2026', end: 'Sep 1, 2026', amt: '₹2,499', status: 'Cancelled' },
  ]

  const filteredSubs = subscriptions.filter(s => activeFilter === 'All' || s.status === activeFilter)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Subscription Management</h1>
        <p className="text-gray-500 mt-1 font-medium">Monitor and manage user subscriptions.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Total Active</p>
          <p className="text-2xl font-bold text-black">845</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Expired This Month</p>
          <p className="text-2xl font-bold text-black">124</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Cancelled</p>
          <p className="text-2xl font-bold text-black">32</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Active', 'Expired', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeFilter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search client or trainer..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Client', 'Trainer', 'Plan', 'Start Date', 'End Date', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 font-medium">No subscriptions found</td>
                </tr>
              ) : (
                filteredSubs.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black whitespace-nowrap">{row.client}</td>
                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{row.trainer}</td>
                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{row.plan}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{row.start}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{row.end}</td>
                    <td className="px-6 py-4 font-bold text-black whitespace-nowrap">{row.amt}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${row.status === 'Active' ? 'bg-green-100 border-green-200 text-green-700' : row.status === 'Cancelled' ? 'bg-red-100 border-red-200 text-red-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{row.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"><Eye size={16}/></button>
                        {row.status === 'Active' && <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={16}/></button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
