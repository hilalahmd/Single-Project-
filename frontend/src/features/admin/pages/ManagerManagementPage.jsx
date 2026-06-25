import { useState } from 'react'
import { Search, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react'

export default function ManagerManagementPage() {
  const [managers, setManagers] = useState([
    { id: 1, name: 'Vikram Singh', email: 'vikram@fitforge.com', role: 'Super Admin', status: 'Active', added: 'Jan 15, 2026' },
    { id: 2, name: 'Anita Desai', email: 'anita@fitforge.com', role: 'Support Manager', status: 'Active', added: 'Mar 22, 2026' },
    { id: 3, name: 'Rohan Mehta', email: 'rohan@fitforge.com', role: 'Finance Manager', status: 'Suspended', added: 'May 10, 2026' },
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Manager Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Add, remove, and manage admin access roles.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
          <Plus size={16} /> Add Manager
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search managers..." className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
        </div>
        <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white min-w-[150px]">
          <option>All Roles</option>
          <option>Super Admin</option>
          <option>Support Manager</option>
          <option>Finance Manager</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Name', 'Role', 'Added On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {managers.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-black border border-gray-200 shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-black">{m.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">{m.role}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{m.added}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
