import { useState } from 'react'
import { Search, Eye, Ban, Trash2, X } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import Table from '../../../shared/components/Table'

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState(null)
  const users = [
    { id: 1, name: 'Hilal', email: 'hilal@example.com', phone: '+91 9876543210', role: 'Client', sub: 'Wellness', date: 'Oct 1, 2026', status: 'Active' },
    { id: 2, name: 'Arjun Menon', email: 'arjun@example.com', phone: '+91 9123456789', role: 'Trainer', sub: 'N/A', date: 'Sep 15, 2026', status: 'Active' },
    { id: 3, name: 'Rahul S', email: 'rahul@example.com', phone: '+91 9988776655', role: 'Client', sub: 'Free', date: 'Oct 12, 2026', status: 'Suspended' },
  ]
  const columns = [
    { label: 'User', key: 'user', render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 border border-gray-700">{row.name[0]}</div>
          <div><p className="font-bold text-white">{row.name}</p><p className="text-xs text-gray-500">{row.email}</p></div>
        </div>
      ) },
    { label: 'Role', key: 'role', render: (val) => <Badge label={val} variant={val === 'Trainer' ? 'outline' : 'default'} /> },
    { label: 'Plan', key: 'sub', render: (val) => <span className="font-medium text-gray-300">{val}</span> },
    { label: 'Joined', key: 'date' },
    { label: 'Status', key: 'status', render: (val) => <Badge label={val} variant={val === 'Active' ? 'active' : 'danger'} /> },
    { label: 'Actions', key: 'actions', render: (_, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedUser(row)} className="p-1.5 text-gray-500 hover:text-white transition-colors rounded"><Eye size={16} /></button>
          <button className="p-1.5 text-gray-500 hover:text-orange-400 transition-colors rounded"><Ban size={16} /></button>
          <button className="p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded"><Trash2 size={16} /></button>
        </div>
      ) },
  ]

  return (
    <div className="max-w-7xl mx-auto relative overflow-hidden flex h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      <div className={`flex-1 overflow-y-auto space-y-8 pr-4 transition-all duration-300 ${selectedUser ? 'mr-96' : ''}`}>
        <div><h1 className="text-3xl font-black text-white">User Management</h1><p className="text-gray-500 mt-1">Manage all clients and trainers.</p></div>
        <div className="flex flex-col sm:flex-row gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white bg-gray-800 text-white placeholder-gray-600" />
          </div>
          <select className="px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:border-white appearance-none">
            <option>All Roles</option><option>Client</option><option>Trainer</option>
          </select>
          <select className="px-3 py-2 border border-gray-700 rounded-lg text-sm bg-gray-800 text-white focus:outline-none focus:border-white appearance-none">
            <option>All Statuses</option><option>Active</option><option>Suspended</option>
          </select>
        </div>
        <Card padding="none" className="overflow-hidden"><Table columns={columns} data={users} /></Card>
      </div>

      <div className={`absolute top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col z-10 ${selectedUser ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedUser && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-500 hover:text-white rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl font-black text-gray-500 mx-auto mb-4 border border-gray-700">{selectedUser.name[0]}</div>
                <h3 className="text-2xl font-black text-white mb-1">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{selectedUser.email}</p>
                <div className="flex justify-center gap-2"><Badge label={selectedUser.role} variant="default" /><Badge label={selectedUser.status} variant={selectedUser.status === 'Active' ? 'active' : 'danger'} /></div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Subscription Info</h4>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-800">
                  <div className="flex justify-between items-center mb-2"><span className="font-medium text-gray-400">Current Plan</span><span className="font-bold text-white">{selectedUser.sub}</span></div>
                  <div className="flex justify-between items-center"><span className="font-medium text-gray-400">Joined</span><span className="font-bold text-white">{selectedUser.date}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-500 uppercase mb-3">Recent Activity</h4>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 shrink-0"></div>
                      <div><p className="text-sm font-bold text-white">Logged in via Web</p><p className="text-xs text-gray-500">Oct {16 - i}, 2026</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex gap-2 bg-gray-800/50">
              <Button variant="secondary" className="flex-1 text-orange-400 border-orange-900/50 hover:bg-orange-900/20">Suspend</Button>
              <Button variant="danger" className="flex-1">Delete</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
