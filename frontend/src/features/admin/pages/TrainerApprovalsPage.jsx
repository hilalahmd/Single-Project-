import { useState, useEffect } from 'react'
import { Check, X, FileText, Loader2 } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function TrainerApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [rejectModal, setRejectModal] = useState(false)
  
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      // Ippo nammal credentials (cookies) vazhiyanu auth cheyyunnath
      const res = await fetch(`${API}/admin/trainers`, {
        credentials: 'include' 
      })
      
      if (!res.ok) throw new Error('Failed to load trainers')
      
      const data = await res.json()
      setTrainers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainers()
  }, [])

  const handleApprove = async (trainerId) => {
    try {
      const res = await fetch(`${API}/admin/approve/${trainerId}`, {
        method: 'PUT',
        credentials: 'include'
      })
      
      if (!res.ok) throw new Error('Failed to approve trainer')
      fetchTrainers()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredTrainers = trainers.filter(t => {
    if (activeTab === 'pending') return !t.isApproved
    if (activeTab === 'approved') return t.isApproved
    return false 
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-gray-500" size={32} /></div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Trainer Approvals</h1>
        <p className="text-gray-500 mt-1 font-medium">Review and manage trainer applications.</p>
      </div>

      <div className="border-b border-gray-200 flex gap-8">
        {['pending', 'approved', 'rejected'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      {filteredTrainers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-2xl bg-gray-50">
          No {activeTab} trainers found.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredTrainers.map(t => (
            <div key={t._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-xl font-bold text-black border border-gray-200 uppercase">
                    {t.userId?.name ? t.userId.name.substring(0, 2) : 'TR'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black">{t.userId?.name || 'Unknown User'}</h2>
                    <p className="text-sm text-gray-500 font-medium">{t.userId?.email}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Applied: {new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {t.specialties && t.specialties.length > 0 ? t.specialties.map(s => <span key={s} className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-[11px] font-bold rounded">{s}</span>) : <span className="text-gray-400 text-xs">Not specified</span>}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {t.languagesSpoken && t.languagesSpoken.length > 0 ? t.languagesSpoken.map(l => <span key={l} className="px-2 py-1 bg-gray-100 border border-gray-200 text-black text-[11px] font-bold rounded">{l}</span>) : <span className="text-gray-400 text-xs">Not specified</span>}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-400 mb-1 uppercase tracking-wider text-[10px]">Role</p>
                  <p className="font-bold text-black capitalize">{t.role.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Bio</p>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium">{t.bio || 'No bio provided.'}</p>
              </div>
              
              <div className="mb-6">
                <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Certificates</p>
                {t.certifications && t.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {t.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm font-bold text-black bg-white border border-gray-200 w-max px-4 py-2.5 rounded-xl shadow-sm"><FileText size={16} /> {cert}</div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No certificates uploaded.</p>
                )}
              </div>

              {activeTab === 'pending' && (
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button onClick={() => handleApprove(t._id)} className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm"><Check size={16} className="mr-2" /> Approve</button>
                  <button onClick={() => setRejectModal(true)} className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"><X size={16} className="mr-2" /> Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal - Unchanged */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRejectModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-black">Reject Application</h2></div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 font-medium">Please provide a reason for rejecting this trainer application.</p>
              <textarea rows="4" placeholder="Reason for rejection..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none bg-white text-black placeholder-gray-400"></textarea>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setRejectModal(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-black transition-colors">Cancel</button>
              <button onClick={() => setRejectModal(false)} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
