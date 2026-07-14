import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Search, Clock, LogOut, Check, X, Eye } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'

export default function ManagerApprovalsPage() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const { user } = useAuth()

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const res = await fetch(`${API}/admin/trainers`, { credentials: 'include' })
      const data = await res.json()
      setTrainers(data)
    } catch (error) {
      console.error('Failed to fetch trainers', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (trainerId, action) => {
    try {
      const res = await fetch(`${API}/admin/trainers/${trainerId}/${action}`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (res.ok) fetchTrainers()
    } catch (error) {
      console.error(`Failed to ${action} trainer`, error)
    }
  }

  const filteredTrainers = trainers.filter(t => t.status === filter)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Trainer Approvals</h1>
        <p className="text-gray-500 mt-1 font-medium">Review and manage trainer applications.</p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-white border border-gray-200 shadow-sm rounded-xl p-1 w-full sm:w-auto">
          {['pending', 'approved', 'rejected', 'suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${
                filter === status 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search trainers..."
            className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-2.5 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Trainer Name</th>
                <th className="px-6 py-4">Specialties</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    Loading trainers...
                  </td>
                </tr>
              ) : filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No {filter} trainers found.
                  </td>
                </tr>
              ) : (
                filteredTrainers.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          {t.profilePhoto ? (
                            <img src={t.profilePhoto} alt={t.userId?.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-black font-bold">{t.userId?.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-black capitalize">{t.userId?.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{t.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {t.specialties?.length ? t.specialties.join(', ') : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {t.experienceYears ? `${t.experienceYears} Years` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4">
                      {t.rating ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500">★</span>
                          <span className="font-bold text-black">{t.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({t.reviewCount || 0})</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm font-medium italic">No ratings</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        t.status === 'approved' ? 'bg-green-100 text-green-700' :
                        t.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(t._id, 'approve')}
                              className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(t._id, 'reject')}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {(t.status === 'approved' || t.status === 'suspended') && (
                          <button 
                            onClick={() => handleStatusChange(t._id, t.status === 'suspended' ? 'approve' : 'suspend')}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-colors text-xs font-bold cursor-pointer"
                          >
                            {t.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                        )}
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
