import { Users, UserCheck, IndianRupee, Clock, ChevronRight } from 'lucide-react'

export default function AdminDashboardPage() {
  const recentRegistrations = [
    { id: 1, name: 'Sanjay Kumar', role: 'Client', date: 'Oct 15, 2026', status: 'Active' },
    { id: 2, name: 'Priya Nair', role: 'Trainer', date: 'Oct 15, 2026', status: 'Pending' },
    { id: 3, name: 'Arjun Menon', role: 'Trainer', date: 'Oct 14, 2026', status: 'Active' },
    { id: 4, name: 'Meera Thomas', role: 'Client', date: 'Oct 14, 2026', status: 'Active' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium">Platform overview and pending actions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', val: '1,240', icon: Users },
          { label: 'Active Trainers', val: '89', icon: UserCheck },
          { label: 'Monthly Revenue', val: '₹1,84,000', icon: IndianRupee },
          { label: 'Pending Approvals', val: '7', icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
              <stat.icon className="text-black" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-black mt-1">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">Revenue Overview</h2>
            <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
              <span className="font-bold text-gray-400">Revenue Chart Placeholder</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Recent Registrations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Name', 'Role', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentRegistrations.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-black">{row.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${row.role === 'Trainer' ? 'bg-white border-gray-300 text-gray-700' : 'bg-gray-100 border-gray-200 text-black'}`}>{row.role}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{row.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Pending Approvals</h2>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-black text-white">7</span>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Priya Nair', spec: 'Yoga, Nutrition', exp: '4 years' },
                { name: 'Karthik S', spec: 'Strength, HIIT', exp: '2 years' },
                { name: 'Aiswarya M', spec: 'Pilates', exp: '5 years' },
              ].map((t, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-black">{t.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{t.spec}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">{t.exp}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition-colors">Approve</button>
                    <button className="flex-1 py-1.5 bg-white border border-gray-200 text-red-600 text-xs font-bold rounded hover:bg-red-50 hover:border-red-200 transition-colors">Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-black flex items-center justify-center hover:bg-gray-50 transition-colors">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
