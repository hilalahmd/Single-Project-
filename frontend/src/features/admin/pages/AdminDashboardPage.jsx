import { useState, useEffect } from 'react'
import { Users, UserCheck, IndianRupee, Clock, ChevronRight, X, Loader2 } from 'lucide-react'
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

  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [txModalType, setTxModalType] = useState('commission') // 'commission' | 'subscription'
  const [txData, setTxData] = useState([])
  const [loadingTx, setLoadingTx] = useState(false)

  const openTxModal = async (type) => {
    setTxModalType(type)
    setIsTxModalOpen(true)
    setLoadingTx(true)
    try {
      const res = await fetch(`${API}/admin/revenue`, { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.transactions) {
        // filter transactions based on type
        const filtered = data.transactions.filter(tx => 
          type === 'subscription' 
            ? tx.planTier === 'platform_subscription'
            : tx.planTier !== 'platform_subscription'
        )
        setTxData(filtered)
      }
    } catch (error) {
      console.error("Failed to load tx details", error)
    } finally {
      setLoadingTx(false)
    }
  }

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
          setPendingTrainers(data.filter(t => t.status === 'pending'))
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
      const res = await fetch(`${API}/admin/trainers/${trainerId}/approve`, {
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
            <h2 className="text-xl font-bold text-black mb-6">Revenue Breakdown</h2>
            <div className="space-y-6">
              {/* Split Bar */}
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-black h-full transition-all duration-1000" 
                  style={{ width: `${dashboardStats.monthlyRevenue > 0 ? (dashboardStats.commissionRevenue / dashboardStats.monthlyRevenue) * 100 : 50}%` }}
                ></div>
                <div 
                  className="bg-orange-500 h-full transition-all duration-1000" 
                  style={{ width: `${dashboardStats.monthlyRevenue > 0 ? (dashboardStats.subscriptionRevenue / dashboardStats.monthlyRevenue) * 100 : 50}%` }}
                ></div>
              </div>

              {/* Stats Legends */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div 
                  onClick={() => openTxModal('commission')}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 cursor-pointer hover:border-black transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-black group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-black transition-colors">PT Commission (5%)</span>
                  </div>
                  <p className="text-2xl font-bold text-black">
                    ₹{dashboardStats.commissionRevenue ? dashboardStats.commissionRevenue.toLocaleString() : '0'}
                  </p>
                </div>
                
                <div 
                  onClick={() => openTxModal('subscription')}
                  className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 cursor-pointer hover:border-orange-500 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-bold text-orange-600/80 uppercase tracking-wider group-hover:text-orange-600 transition-colors">Trainer Subs (₹399)</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{dashboardStats.subscriptionRevenue ? dashboardStats.subscriptionRevenue.toLocaleString() : '0'}
                  </p>
                </div>
              </div>
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

      {/* Transactions Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  {txModalType === 'commission' ? 'Client PT Commissions' : 'Trainer Subscriptions'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Detailed breakdown of recent transactions.</p>
              </div>
              <button onClick={() => setIsTxModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingTx ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : txData.length === 0 ? (
                <div className="text-center text-gray-500 py-8 font-medium">No transactions found for this category.</div>
              ) : (
                <div className="space-y-4">
                  {txData.map(tx => (
                    <div key={tx._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-xl bg-gray-50 hover:border-gray-200 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          {txModalType === 'commission' ? (
                            tx.user?.avatar ? <img src={tx.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-sm">{tx.user?.name?.charAt(0) || '?'}</div>
                          ) : (
                            tx.user?.avatar ? <img src={tx.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-bold text-sm">{tx.user?.name?.charAt(0) || '?'}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black text-sm">
                            {txModalType === 'commission' ? `Client: ${tx.user?.name || 'Unknown'}` : `Trainer: ${tx.user?.name || 'Unknown'}`}
                          </p>
                          {txModalType === 'commission' && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Trained by: <span className="font-medium text-black">{tx.trainer?.userId?.name || 'Unknown'}</span>
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right mt-3 sm:mt-0 ml-14 sm:ml-0">
                        {txModalType === 'commission' ? (
                          <>
                            <p className="text-sm font-bold text-green-600">+₹{(tx.amount * 0.05).toLocaleString()} <span className="text-xs text-gray-400 font-medium">(5% Cut)</span></p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Gross: ₹{tx.amount.toLocaleString()}</p>
                          </>
                        ) : (
                          <p className="text-sm font-bold text-green-600">+₹{tx.amount.toLocaleString()} <span className="text-xs text-gray-400 font-medium">(Full)</span></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
