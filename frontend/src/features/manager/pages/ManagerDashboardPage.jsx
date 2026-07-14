import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Clock, Search, Bell, Send, UserX, X, CheckCircle } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import API from '../../../shared/utils/api'

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState({
    pendingReportsCount: 0,
    recentReports: [],
    inactiveUsers: [],
    trainerStats: { pending: 0, approved: 0, rejected: 0 }
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  // Notification Modal State
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [notifyUser, setNotifyUser] = useState(null)
  const [notifyTitle, setNotifyTitle] = useState('We miss you at FitForge!')
  const [notifyBody, setNotifyBody] = useState('Come back and crush your fitness goals. Your coach is waiting!')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/managers/dashboard`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotifyClick = (targetUser) => {
    setNotifyUser(targetUser)
    setShowNotifyModal(true)
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    setIsSending(true)
    try {
      const res = await fetch(`${API}/manager/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: notifyUser._id,
          title: notifyTitle,
          body: notifyBody
        })
      })
      if (res.ok) {
        alert('Notification sent successfully!')
        setShowNotifyModal(false)
      } else {
        alert('Failed to send notification')
      }
    } catch (err) {
      console.error(err)
      alert('Error sending notification')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-2">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Manager Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium">Welcome back, {user?.name || 'Manager'}. Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <h3 className="text-3xl font-bold text-black">{stats.trainerStats?.pending || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Approved Trainers</p>
              <h3 className="text-3xl font-bold text-black">{stats.trainerStats?.approved || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Rejected Trainers</p>
              <h3 className="text-3xl font-bold text-black">{stats.trainerStats?.rejected || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ── Recent Reports ── */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-black font-['Syne']">Pending Reports</h2>
              <p className="text-xs text-gray-500 mt-0.5">Needs manager review</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              {stats.pendingReportsCount || 0}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0 h-[400px]">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">Loading reports...</div>
            ) : !stats.recentReports || stats.recentReports.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 h-full">
                <AlertCircle size={32} className="mb-3 text-gray-300" />
                <p className="font-bold">No pending reports</p>
                <p className="text-xs mt-1">All issues have been resolved.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.recentReports.map(report => (
                  <div key={report._id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-black text-sm">{report.reportedTrainer?.userId?.name || 'Unknown Trainer'}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase">Reported</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{report.reason}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{report.details}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                          By {report.reporter?.name} • {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link to="/manager/reports" className="shrink-0 p-2 text-gray-400 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-lg transition-all">
                        <Search size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {stats.pendingReportsCount > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Link to="/manager/reports" className="block w-full text-center py-2 text-sm font-bold text-gray-600 hover:text-black transition-colors">
                View all reports
              </Link>
            </div>
          )}
        </div>

        {/* ── Inactive Users ── */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-black font-['Syne'] flex items-center gap-2">
                <UserX size={18} className="text-gray-400" />
                Inactive Clients
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Not logged in for 10+ days</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
              {stats.inactiveUsers?.length || 0}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0 h-[400px]">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">Loading users...</div>
            ) : !stats.inactiveUsers || stats.inactiveUsers.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 h-full">
                <CheckCircle size={32} className="mb-3 text-gray-300" />
                <p className="font-bold">Great retention!</p>
                <p className="text-xs mt-1">All clients have been active recently.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.inactiveUsers.map(u => {
                  const daysInactive = Math.floor((new Date() - new Date(u.lastActive)) / (1000 * 60 * 60 * 24))
                  return (
                    <div key={u._id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-black text-sm">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-rose-600">
                          <Clock size={12} />
                          {daysInactive} days inactive
                        </div>
                      </div>
                      <button 
                        onClick={() => handleNotifyClick(u)}
                        className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Bell size={14} />
                        Notify
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Firebase Notification Modal (Mock) ── */}
      <AnimatePresence>
        {showNotifyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                <div className="flex items-center gap-2 text-blue-800">
                  <Bell size={18} />
                  <h3 className="font-bold font-['Syne']">Send Push Notification</h3>
                </div>
                <button 
                  onClick={() => setShowNotifyModal(false)}
                  className="p-1 text-gray-400 hover:text-black transition-colors rounded"
                >
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleSendNotification} className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Send a direct push notification to <strong className="text-black">{notifyUser?.name}</strong> to encourage them to return to the app.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notification Title</label>
                  <input 
                    type="text"
                    required
                    value={notifyTitle}
                    onChange={e => setNotifyTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message Body</label>
                  <textarea 
                    required
                    value={notifyBody}
                    onChange={e => setNotifyBody(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowNotifyModal(false)}
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSending ? 'Sending...' : (
                      <>
                        <Send size={16} />
                        Send via Firebase
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
