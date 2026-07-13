import { useState, useEffect } from 'react'
import { Search, Eye, Ban, Trash2, X } from 'lucide-react'
import API from '../../../shared/utils/api'


export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API}/admin/users`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        }
      } catch (err) {
        console.error("Failed to load users", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])


  return (
    <div className="max-w-7xl mx-auto relative overflow-hidden flex h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-[#F9FAFB]">
      <div className={`flex-1 overflow-y-auto space-y-8 pr-4 transition-all duration-300 ${selectedUser ? 'mr-96' : ''}`}>
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage all clients and trainers.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" />
          </div>
          <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white">
            <option>All Roles</option><option>Client</option><option>Trainer</option>
          </select>
          <select className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white">
            <option>All Statuses</option><option>Active</option><option>Suspended</option>
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['User', 'Role', 'Plan', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
                          <tbody className="divide-y divide-gray-100">
                {users.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0 border border-gray-200">
                          {row.name ? row.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-black">{row.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${row.role === 'trainer' ? 'bg-white border-gray-300 text-gray-700' : 'bg-gray-100 border-gray-200 text-black'}`}>{row.role}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600 capitalize">{row.subscriptionTier || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedUser(row)} className="p-1.5 text-gray-400 hover:text-black transition-colors rounded hover:bg-gray-100"><Eye size={16} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-amber-500 transition-colors rounded hover:bg-amber-50"><Ban size={16} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Slide-out Panel */}
      <div className={`absolute top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl transform transition-transform duration-300 flex flex-col z-10 ${selectedUser ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedUser && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              <div className="text-center">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-3xl font-black text-black mx-auto mb-4 border border-gray-200">
  {selectedUser.name ? selectedUser.name[0] : 'U'}
</div>

                <h3 className="text-2xl font-bold text-black mb-1">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500 mb-3 font-medium">{selectedUser.email}</p>
                <div className="flex justify-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 border border-gray-200 text-black capitalize">{selectedUser.role}</span>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedUser.status}</span>
                </div>

              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">Subscription Info</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-2"><span className="font-medium text-gray-500">Current Plan</span><span className="font-bold text-black capitalize">{selectedUser.subscriptionTier || 'None'}</span></div>
                <div className="flex justify-between items-center"><span className="font-medium text-gray-500">Joined</span><span className="font-bold text-black">{new Date(selectedUser.createdAt).toLocaleDateString()}</span></div>

                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">Recent Activity</h4>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 bg-black rounded-full mt-2 shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold text-black">Logged in via Web</p>
                        <p className="text-xs text-gray-500 font-medium">Oct {16 - i}, 2026</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 bg-gray-50">
              <button className="flex-1 py-2.5 border border-amber-200 bg-amber-50 text-amber-700 font-bold text-sm rounded-lg hover:bg-amber-100 transition-colors">Suspend</button>
              <button className="flex-1 py-2.5 border border-red-200 bg-red-50 text-red-700 font-bold text-sm rounded-lg hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
