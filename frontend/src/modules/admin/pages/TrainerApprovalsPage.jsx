import { useState } from 'react'
import { Check, X, FileText } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Button from '../../../shared/components/Button'
import Badge from '../../../shared/components/Badge'
import Modal from '../../../shared/components/Modal'

export default function TrainerApprovalsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [rejectModal, setRejectModal] = useState(false)

  const trainers = [
    { id: 1, name: 'Priya Nair', email: 'priya@example.com', phone: '+91 9876543210', spec: ['Yoga', 'Nutrition'], exp: '4 years', lang: ['Malayalam', 'English'], date: 'Oct 15, 2026', bio: 'Certified yoga instructor with a background in clinical nutrition.' },
    { id: 2, name: 'Karthik S', email: 'karthik@example.com', phone: '+91 9123456789', spec: ['Strength', 'HIIT'], exp: '2 years', lang: ['Tamil', 'English'], date: 'Oct 14, 2026', bio: 'Specializing in high-intensity interval training and strength building.' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div><h1 className="text-3xl font-black text-white">Trainer Approvals</h1><p className="text-gray-500 mt-1">Review and manage trainer applications.</p></div>

      <div className="border-b border-gray-800 flex gap-8">
        {['pending', 'approved', 'rejected'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {trainers.map(t => (
          <Card key={t.id} padding="lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-xl font-black text-gray-500 border border-gray-700">
                  {t.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t.name}</h2>
                  <p className="text-sm text-gray-500">{t.email} • {t.phone}</p>
                  <p className="text-xs text-gray-600 mt-1">Applied: {t.date}</p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div><p className="font-bold text-gray-500 mb-1">Specialties</p><div className="flex flex-wrap gap-1">{t.spec.map(s => <Badge key={s} label={s} variant="outline" />)}</div></div>
              <div><p className="font-bold text-gray-500 mb-1">Languages</p><div className="flex flex-wrap gap-1">{t.lang.map(l => <Badge key={l} label={l} variant="default" />)}</div></div>
              <div><p className="font-bold text-gray-500 mb-1">Experience</p><p className="font-medium text-white">{t.exp}</p></div>
            </div>
            <div className="mb-6">
              <p className="font-bold text-gray-500 mb-1 text-sm">Bio</p>
              <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/50 p-3 rounded-lg border border-gray-800">{t.bio}</p>
            </div>
            <div className="mb-6">
              <p className="font-bold text-gray-500 mb-2 text-sm">Certificates</p>
              <div className="flex items-center gap-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 w-max px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                <FileText size={16} /> View Credentials.pdf
              </div>
            </div>
            {activeTab === 'pending' && (
              <div className="flex gap-4 pt-6 border-t border-gray-800">
                <Button variant="primary" className="flex-1"><Check size={16} className="mr-2" /> Approve</Button>
                <Button variant="secondary" className="flex-1 text-red-500 border-red-900/50 hover:bg-red-900/20" onClick={() => setRejectModal(true)}><X size={16} className="mr-2" /> Reject</Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Reject Application">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Please provide a reason for rejecting this trainer application.</p>
          <textarea rows="4" placeholder="Reason for rejection..." className="w-full px-3 py-2 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-white resize-none bg-gray-800 text-white placeholder-gray-600"></textarea>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="ghost" onClick={() => setRejectModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setRejectModal(false)}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
