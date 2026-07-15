import { useState, useEffect } from 'react'
import { Check, X, FileText, Loader2, Search, Filter, Ban, AlertCircle } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function TrainerApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [rejectModal, setRejectModal] = useState({ open: false, trainerId: null, isSuspend: false })
  const [reason, setReason] = useState('')
  
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/admin/trainers`, { credentials: 'include' })
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
      const res = await fetch(`${API}/admin/trainers/${trainerId}/approve`, {
        method: 'PUT',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to approve trainer')
      fetchTrainers()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAction = async () => {
    if (!reason.trim()) return alert('Reason is required')
    try {
      const endpoint = rejectModal.isSuspend ? `/admin/trainers/${rejectModal.trainerId}/suspend` : `/admin/trainers/${rejectModal.trainerId}/reject`
      const res = await fetch(`${API}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })
      if (!res.ok) throw new Error(`Failed to ${rejectModal.isSuspend ? 'suspend' : 'reject'} trainer`)
      setRejectModal({ open: false, trainerId: null, isSuspend: false })
      setReason('')
      fetchTrainers()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredTrainers = trainers.filter(t => {
    if (t.status !== activeTab) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const name = t.userId?.name?.toLowerCase() || ''
      const email = t.userId?.email?.toLowerCase() || ''
      if (!name.includes(query) && !email.includes(query)) return false
    }

    // Specialty filter
    if (specialtyFilter) {
      if (!t.specialties || !t.specialties.includes(specialtyFilter)) return false
    }

    return true
  })

  // Extract all unique specialties for the filter dropdown
  const allSpecialties = Array.from(new Set(trainers.flatMap(t => t.specialties || [])))

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-gray-500" size={32} /></div>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-black tracking-tight">Trainer Approvals</h1>
        <p className="text-gray-500 mt-1 font-medium">Review, approve, and manage trainer applications.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm font-medium"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <select 
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm font-medium appearance-none"
          >
            <option value="">All Specialties</option>
            {allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      <div className="border-b border-gray-200 flex gap-8">
        {['pending', 'approved', 'rejected', 'suspended'].map(tab => (
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
          No {activeTab} trainers match your filters.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredTrainers.map(t => (
            <div key={t._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-xl font-bold text-black border border-gray-200 uppercase overflow-hidden">
                    {t.profilePhoto ? <img src={t.profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (t.userId?.name ? t.userId.name.substring(0, 2) : 'TR')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black">{t.userId?.name || 'Unknown User'}</h2>
                    <p className="text-sm text-gray-500 font-medium">{t.userId?.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-400 font-medium">Applied: {new Date(t.createdAt).toLocaleDateString()}</p>
                      {t.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <span>★ {t.rating}</span>
                          <span className="text-yellow-400 font-medium">({t.reviewCount})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Pricing (Monthly)</p>
                  <p className="font-bold text-black">₹{t.pricing?.wellnessMonthly || 0} Wellness</p>
                  <p className="font-bold text-black mt-1">₹{t.pricing?.personalTrainingMonthly || 0} PT</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Experience</p>
                  <p className="font-bold text-black">{t.experience || 0} Years</p>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {t.specialties?.length ? t.specialties.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-black text-xs font-bold rounded-md">
                      {s}
                    </span>
                  )) : <span className="text-xs text-gray-400">None</span>}
                </div>
              </div>

              <div className="mb-6 flex-1">
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-2">Certifications ({t.certifications?.length || 0})</p>
                {t.certifications?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {t.certifications.map((url, i) => {
                      const isPdf = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/raw/')
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Certificate ${i + 1} — Click to view`}
                          className="relative group block w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-black transition-all shadow-sm"
                        >
                          {isPdf ? (
                            <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center">
                              <FileText size={22} className="text-red-500" />
                              <span className="text-[9px] font-bold text-red-500 mt-1">PDF</span>
                            </div>
                          ) : (
                            <img
                              src={url}
                              alt={`Certificate ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-100 flex flex-col items-center justify-center"><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'22\' height=\'22\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#9ca3af\' stroke-width=\'2\'><rect width=\'18\' height=\'18\' x=\'3\' y=\'3\' rx=\'2\' ry=\'2\'/><circle cx=\'9\' cy=\'9\' r=\'2\'/><path d=\'m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\'/></svg></div>'
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">View</span>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-red-400 font-semibold">⚠ No certificates uploaded</p>
                )}
              </div>

              {(t.rejectionReason || t.reason) && (
                <div className="mb-6 bg-red-50 p-3 rounded-lg border border-red-100 flex gap-2 items-start">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-500">Reason for {t.status}</p>
                    <p className="text-xs text-red-400 mt-0.5">{t.rejectionReason || t.reason}</p>
                  </div>
                </div>
              )}

              {activeTab === 'pending' && (
                <div className="flex gap-3 pt-6 border-t border-gray-100 mt-auto">
                  <button onClick={() => setRejectModal({ open: true, trainerId: t._id, isSuspend: false })} className="flex-1 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <X size={16} />
                    Reject
                  </button>
                  <button onClick={() => handleApprove(t._id)} className="flex-1 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2">
                    <Check size={16} />
                    Approve
                  </button>
                </div>
              )}

              {activeTab === 'approved' && (
                <div className="flex gap-3 pt-6 border-t border-gray-100 mt-auto">
                  <button onClick={() => setRejectModal({ open: true, trainerId: t._id, isSuspend: true })} className="flex-1 py-3 bg-orange-50 text-orange-600 font-bold text-sm rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
                    <Ban size={16} />
                    Suspend
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject / Suspend Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-2xl font-bold text-black tracking-tight mb-2">
              {rejectModal.isSuspend ? 'Suspend Trainer' : 'Reject Application'}
            </h3>
            <p className="text-gray-500 text-sm font-medium mb-6">
              Please provide a reason. This will be visible to the trainer.
            </p>
            
            <textarea 
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Incomplete certifications, invalid ID..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black text-sm font-medium resize-none mb-6"
            />
            
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal({ open: false, trainerId: null, isSuspend: false }); setReason(''); }} className="flex-1 py-3 border border-gray-200 text-black font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleAction} className={`flex-1 py-3 text-white font-bold text-sm rounded-xl transition-colors ${rejectModal.isSuspend ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'}`}>
                Confirm {rejectModal.isSuspend ? 'Suspend' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}