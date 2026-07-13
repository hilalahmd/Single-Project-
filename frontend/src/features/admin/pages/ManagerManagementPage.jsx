import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, MoreVertical, Edit, Trash2, Loader2, AlertCircle, X } from 'lucide-react'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'
import API from '../../../shared/utils/api'

export default function ManagerManagementPage() {
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingManager, setEditingManager] = useState(null)
  
  // Form State
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formAdminRole, setFormAdminRole] = useState('Support Manager')
  const [formStatus, setFormStatus] = useState('active')
  const [submitting, setSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const fetchManagers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/admin/managers`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setManagers(data)
      } else {
        setToastMsg(data.message || 'Failed to fetch managers')
      }
    } catch (err) {
      setToastMsg('Error fetching managers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchManagers()
  }, [fetchManagers])

  const openAddModal = () => {
    setEditingManager(null)
    setFormName('')
    setFormEmail('')
    setFormAdminRole('Support Manager')
    setFormStatus('active')
    setModalOpen(true)
  }

  const openEditModal = (manager) => {
    setEditingManager(manager)
    setFormName(manager.name)
    setFormEmail(manager.email)
    setFormAdminRole(manager.adminRole || 'Support Manager')
    setFormStatus(manager.status || 'active')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingManager) {
        // Update
        const res = await fetch(`${API}/admin/managers/${editingManager._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            status: formStatus,
            adminRole: formAdminRole
          })
        })
        const data = await res.json()
        if (res.ok) {
          setToastMsg('Manager updated successfully')
          fetchManagers()
          setModalOpen(false)
        } else {
          setToastMsg(data.message || 'Failed to update manager')
        }
      } else {
        // Create
        const res = await fetch(`${API}/admin/managers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            adminRole: formAdminRole
          })
        })
        const data = await res.json()
        if (res.ok) {
          setToastMsg('Manager created successfully')
          fetchManagers()
          setModalOpen(false)
        } else {
          setToastMsg(data.message || 'Failed to create manager')
        }
      }
    } catch (error) {
      setToastMsg('Network error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this manager?')) return
    
    try {
      const res = await fetch(`${API}/admin/managers/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await res.json()
      if (res.ok) {
        setToastMsg('Manager deleted successfully')
        fetchManagers()
      } else {
        setToastMsg(data.message || 'Failed to delete manager')
      }
    } catch (error) {
      setToastMsg('Network error occurred')
    }
  }

  const filteredManagers = managers.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All Roles' || m.adminRole === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Manager Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Add, remove, and manage admin access roles.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add Manager
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search managers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" 
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white min-w-[150px] cursor-pointer"
        >
          <option>All Roles</option>
          <option>Super Admin</option>
          <option>Support Manager</option>
          <option>Finance Manager</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-sm font-medium">Loading managers...</p>
          </div>
        ) : filteredManagers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="font-bold">No managers found.</p>
            <p className="text-sm">Try adjusting your filters or add a new manager.</p>
          </div>
        ) : (
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
                {filteredManagers.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-black border border-gray-200 shrink-0 uppercase">
                          {m.name ? m.name.charAt(0) : 'M'}
                        </div>
                        <div>
                          <p className="font-bold text-black capitalize">{m.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{m.adminRole || 'Support Manager'}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} uppercase tracking-wider`}>
                        {m.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(m)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Edit Manager">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(m._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Manager">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingManager ? "Edit Manager" : "Add New Manager"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingManager && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  required 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Admin Role</label>
            <select 
              value={formAdminRole}
              onChange={(e) => setFormAdminRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white cursor-pointer"
            >
              <option>Super Admin</option>
              <option>Support Manager</option>
              <option>Finance Manager</option>
            </select>
          </div>

          {editingManager && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select 
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2.5 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editingManager ? 'Save Changes' : 'Create Manager'}
            </button>
          </div>
        </form>
      </Modal>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  )
}
