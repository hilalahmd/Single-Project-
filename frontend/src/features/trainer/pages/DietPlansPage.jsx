import { useState } from 'react'
import { Plus, Salad, MoreHorizontal } from 'lucide-react'
import Card from '../../../shared/components/Card'
import Modal from '../../../shared/components/Modal'

const PLANS = [
  { title: 'Clean Bulk Diet',      clients: 3, calories: '3,200 kcal', updated: 'Jun 21' },
  { title: 'Fat Loss Protocol',    clients: 5, calories: '1,800 kcal', updated: 'Jun 19' },
  { title: 'Maintenance Plan',     clients: 2, calories: '2,400 kcal', updated: 'Jun 14' },
  { title: 'Athlete Performance',  clients: 4, calories: '3,800 kcal', updated: 'Jun 10' },
]

export default function DietPlansPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeAction, setActiveAction] = useState('')

  const handleTrigger = (actionName) => {
    setActiveAction(actionName)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white">Diet Plans</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage and assign nutrition protocols.</p>
        </div>
        <button 
          onClick={() => handleTrigger('Create New Diet Plan')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white text-[14px] font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {PLANS.map(p => (
          <Card key={p.title} className="hover:border-[#2563EB] group transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center border border-[#1E293B]">
                  <Salad size={18} className="text-[#22C55E]" />
                </div>
                <h2 className="text-[16px] font-semibold text-white group-hover:text-[#2563EB] transition-colors">{p.title}</h2>
              </div>
              <button 
                onClick={() => handleTrigger(`Manage Options for "${p.title}"`)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div className="flex gap-4 text-[12px] font-semibold text-gray-400 mb-6 uppercase tracking-wider">
              <span>{p.clients} clients</span>
              <span>{p.calories}/day</span>
              <span>Updated {p.updated}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleTrigger(`Edit Diet Plan "${p.title}"`)}
                className="flex-1 py-2.5 border border-[#1E293B] bg-[#0F172A] text-[14px] font-semibold text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button 
                onClick={() => handleTrigger(`Assign Diet Plan "${p.title}"`)}
                className="flex-1 py-2.5 border border-[#1E293B] bg-[#0F172A] text-[14px] font-semibold text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
              >
                Assign
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Coming Soon Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Feature In Development">
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-2">
            <Salad size={28} className="text-[#22C55E]" />
          </div>
          <h3 className="text-lg font-bold text-white">{activeAction}</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            The customized diet protocol builder and client nutrition assignment tools are currently in development. You will be able to create, edit, and assign full macro plans once the backend nutrition manager is fully deployed.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
