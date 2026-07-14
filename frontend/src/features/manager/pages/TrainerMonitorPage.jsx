import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ShieldAlert, Users, Search, Clock, Calendar, X, AlertCircle } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function TrainerMonitorPage() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Modal State
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [monitorData, setMonitorData] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const res = await fetch(`${API}/managers/trainers`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) setTrainers(data)
    } catch (error) {
      console.error('Failed to fetch monitored trainers', error)
    } finally {
      setLoading(false)
    }
  }

  const openMonitorModal = async (trainer) => {
    setSelectedTrainer(trainer)
    setLoadingDetails(true)
    try {
      const res = await fetch(`${API}/managers/trainers/${trainer._id}/monitor`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) setMonitorData(data)
    } catch (error) {
      console.error('Failed to fetch monitor details', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const filteredTrainers = trainers.filter(t => 
    t.userId?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight flex items-center gap-2">
          <Activity className="text-amber-500" /> Trainer Monitor
        </h1>
        <p className="text-gray-500 mt-1 font-medium">Track trainer performance, client attendance, and administrative audits.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search trainers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-2.5 pl-10 pr-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="px-6 py-4">Trainer Name</th>
                <th className="px-6 py-4">Specialties</th>
                <th className="px-6 py-4">Active Clients</th>
                <th className="px-6 py-4">Overall Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">Loading trainer data...</td>
                </tr>
              ) : filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">No trainers found.</td>
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
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        {t.activeClientsCount} Clients
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.rating ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500">★</span>
                          <span className="font-bold text-black">{t.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm font-medium italic">No ratings</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openMonitorModal(t)}
                        className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Deep Monitor
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitor Modal */}
      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedTrainer(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                    {selectedTrainer.profilePhoto ? (
                      <img src={selectedTrainer.profilePhoto} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-black text-white">
                        {selectedTrainer.userId?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black font-['Syne'] capitalize">{selectedTrainer.userId?.name}</h2>
                    <p className="text-sm text-gray-500 font-medium">Advanced Monitor & Audit Profile</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTrainer(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
                {loadingDetails ? (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : monitorData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left Column: Attendance Stats */}
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-black">
                          <Calendar size={20} className="text-blue-500" />
                          <h3 className="font-bold text-lg">Client Attendance</h3>
                        </div>
                        
                        <div className="flex items-end justify-between mb-2">
                          <div className="text-4xl font-black font-['Syne']">
                            {monitorData.attendanceRate}%
                          </div>
                          <div className="text-sm text-gray-500 font-medium mb-1">Attendance Rate</div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mb-6">
                          <div 
                            className="h-full bg-green-500 transition-all duration-1000" 
                            style={{ width: `${monitorData.attendanceRate}%` }}
                            title="Completed"
                          />
                          <div 
                            className="h-full bg-red-400 transition-all duration-1000" 
                            style={{ width: `${monitorData.attendanceStats['no-show'] ? (monitorData.attendanceStats['no-show'] / monitorData.attendanceStats.total)*100 : 0}%` }}
                            title="No-Show"
                          />
                          <div 
                            className="h-full bg-amber-400 transition-all duration-1000" 
                            style={{ width: `${monitorData.attendanceStats.cancelled ? (monitorData.attendanceStats.cancelled / monitorData.attendanceStats.total)*100 : 0}%` }}
                            title="Cancelled"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Completed</div>
                            <div className="text-xl font-bold text-green-600">{monitorData.attendanceStats.completed}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">No-Shows</div>
                            <div className="text-xl font-bold text-red-600">{monitorData.attendanceStats['no-show']}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-xs text-gray-500 font-bold uppercase mb-1">Cancelled</div>
                            <div className="text-xl font-bold text-amber-600">{monitorData.attendanceStats.cancelled}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl border border-blue-100">
                            <div className="text-xs text-blue-500 font-bold uppercase mb-1">Upcoming</div>
                            <div className="text-xl font-bold text-blue-600">{monitorData.attendanceStats.scheduled}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Audit Logs */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
                      <div className="flex items-center gap-2 mb-6 text-black shrink-0">
                        <ShieldAlert size={20} className="text-purple-500" />
                        <h3 className="font-bold text-lg">Admin Audit Trail</h3>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {monitorData.auditLogs.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Clock size={32} className="mb-2 text-gray-300" />
                            <p className="font-medium text-sm">No administrative actions logged.</p>
                          </div>
                        ) : (
                          monitorData.auditLogs.map(log => (
                            <div key={log._id} className="relative pl-6 border-l-2 border-gray-100 pb-2">
                              <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-400 font-bold mb-1">
                                  {new Date(log.createdAt).toLocaleString()}
                                </div>
                                <div className="text-sm font-bold text-black mb-0.5">
                                  {log.action}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {log.details}
                                </div>
                                <div className="text-[10px] uppercase font-bold text-purple-600 mt-2 bg-purple-50 inline-block px-2 py-0.5 rounded-sm">
                                  By: {log.adminId?.name || 'System'}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
