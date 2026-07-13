import { useState, useEffect } from 'react'
import { Users, UserCheck, IndianRupee, Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API from '../../../shared/utils/api'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
    const [pendingTrainers, setPendingTrainers] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeTrainers: 0,
    monthlyRevenue: 0,
    recentRegistrations: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both trainers and our new dashboard stats simultaneously
        const [trainersRes, statsRes] = await Promise.all([
          fetch(`${API}/admin/trainers`, { credentials: 'include' }),
          fetch(`${API}/admin/dashboard`, { credentials: 'include' })
        ])

        if (trainersRes.ok) {
          const data = await trainersRes.json()
          setPendingTrainers(data.filter(t => !t.isApproved))
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setDashboardStats(statsData)
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  const handleApprove = async (trainerId) => {
    try {
      const res = await fetch(`${API}/admin/approve/${trainerId}`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (res.ok) {
        setPendingTrainers(prev => prev.filter(t => t._id !== trainerId))
      }
    } catch (err) {
      alert("Error approving trainer")
    }
  }

   

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium">Platform overview and pending actions.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
          { label: 'Total Users', val: loading ? '...' : dashboardStats.totalUsers, icon: Users },
          { label: 'Active Trainers', val: loading ? '...' : dashboardStats.activeTrainers, icon: UserCheck },
          { label: 'Monthly Revenue', val: loading ? '...' : `₹${dashboardStats.monthlyRevenue.toLocaleString()}`, icon: IndianRupee },
          { label: 'Pending Approvals', val: loading ? '...' : pendingTrainers.length, icon: Clock },
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
                  {dashboardStats.recentRegistrations.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-black">{row.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${row.role === 'trainer' ? 'bg-white border-gray-300 text-gray-700' : 'bg-gray-100 border-gray-200 text-black'}`}>{row.role}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{new Date(row.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span>
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
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-black text-white">
                {pendingTrainers.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {pendingTrainers.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No pending approvals at the moment.</p>
              ) : (
                pendingTrainers.slice(0, 3).map((t) => (
                  <div key={t._id} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-black">{t.userId?.name || 'Unknown User'}</h3>
                        <p className="text-xs text-gray-500 font-medium capitalize">{t.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(t._id)} className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 transition-colors">Approve</button>
                      <button onClick={() => navigate('/admin/approvals')} className="flex-1 py-1.5 bg-white border border-gray-200 text-black text-xs font-bold rounded hover:bg-gray-100 transition-colors">View full</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => navigate('/admin/approvals')} 
              className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-black flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              View All Approvals <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
