import { useState } from 'react'
import { Check, X, FileText } from 'lucide-react'

export default function TrainerApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [rejectModal, setRejectModal] = useState(false)

  const trainers = [
    { id: 1, name: 'Priya Nair', email: 'priya@example.com', phone: '+91 9876543210', spec: ['Yoga', 'Nutrition'], exp: '4 years', lang: ['Malayalam', 'English'], date: 'Oct 15, 2026', bio: 'Certified yoga instructor with a background in clinical nutrition.' },
    { id: 2, name: 'Karthik S', email: 'karthik@example.com', phone: '+91 9123456789', spec: ['Strength', 'HIIT'], exp: '2 years', lang: ['Tamil', 'English'], date: 'Oct 14, 2026', bio: 'Specializing in high-intensity interval training and strength building.' },
  ]

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

      <div className="grid lg:grid-cols-2 gap-6">
        {trainers.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-xl font-bold text-black border border-gray-200">
                  {t.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{t.name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{t.email} • {t.phone}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">Applied: {t.date}</p>
                </div>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {t.spec.map(s => <span key={s} className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-[11px] font-bold rounded">{s}</span>)}
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Languages</p>
                <div className="flex flex-wrap gap-1">
                  {t.lang.map(l => <span key={l} className="px-2 py-1 bg-gray-100 border border-gray-200 text-black text-[11px] font-bold rounded">{l}</span>)}
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-400 mb-1 uppercase tracking-wider text-[10px]">Experience</p>
                <p className="font-bold text-black">{t.exp}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Bio</p>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium">{t.bio}</p>
            </div>
            
            <div className="mb-6">
              <p className="font-bold text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Certificates</p>
              <div className="flex items-center gap-2 text-sm font-bold text-black bg-white border border-gray-200 w-max px-4 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                <FileText size={16} /> View Credentials.pdf
              </div>
            </div>

            {activeTab === 'pending' && (
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
                  <Check size={16} className="mr-2" /> Approve
                </button>
                <button 
                  onClick={() => setRejectModal(true)}
                  className="flex-1 py-3 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                >
                  <X size={16} className="mr-2" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRejectModal(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">Reject Application</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 font-medium">Please provide a reason for rejecting this trainer application. This will be sent to the applicant.</p>
              <textarea 
                rows="4" 
                placeholder="Reason for rejection..." 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none bg-white text-black placeholder-gray-400"
              ></textarea>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setRejectModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setRejectModal(false)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
