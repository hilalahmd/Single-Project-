import { useState, useEffect } from 'react'
import { Plus, Salad, MoreHorizontal, Loader, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../shared/components/Card'
import Modal from '../../../shared/components/Modal'
import api from '../../../shared/utils/api'

export default function DietPlansPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeAction, setActiveAction] = useState('')
  const [form, setForm] = useState({ title: '', clientId: '', type: 'Diet', startDate: new Date().toISOString().split('T')[0] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDietPlans()
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await api.get('/trainers/clients')
      if (res.data.success) {
        setClients(res.data.clients)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const fetchDietPlans = async () => {
    try {
      const res = await api.get('/workouts/my-assigned-diet-plans')
      if (res.data.success) {
        setPlans(res.data.plans)
      }
    } catch (error) {
      console.error('Failed to fetch diet plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTrigger = (actionName) => {
    setActiveAction(actionName)
    setForm({ title: '', clientId: clients[0]?._id || '', type: 'Diet', startDate: new Date().toISOString().split('T')[0] })
    setModalOpen(true)
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        clientId: form.clientId,
        type: form.type,
        startDate: form.startDate,
        diets: [],
        nutritionTargets: { calories: 0, protein: 0, carbs: 0, fats: 0 }
      }
      const res = await api.post('/workouts/plan', payload)
      if (res.data.success) {
        setModalOpen(false)
        navigate(`/trainer/plans/build/${res.data.planId}`)
      }
    } catch (error) {
      console.error('Failed to create plan', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin text-green-500" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white">Diet Plans</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage nutrition protocols assigned to your clients.</p>
        </div>
        <button
          onClick={() => handleTrigger('Create New Diet Plan')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:to-green-400 text-white text-[14px] font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      {/* Empty state */}
      {plans.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Salad size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-base font-semibold">No diet plans assigned yet.</p>
          <p className="text-sm mt-1 text-gray-500">Create and assign a nutrition plan to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {plans.map(p => (
            <Card key={p._id} className="hover:border-green-600/50 group transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center border border-[#1E293B]">
                    <Salad size={18} className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-white group-hover:text-green-400 transition-colors">{p.title}</h2>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                      {p.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleTrigger(`Options for "${p.title}"`)}
                  className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Client info */}
              <div className="flex items-center gap-2 mb-4 text-[13px] text-gray-400">
                <User size={14} />
                <span>{p.clientId?.name || 'Unknown Client'}</span>
              </div>

              {/* Nutrition targets */}
              {p.nutritionTargets?.calories && (
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {[
                    { label: 'Kcal', value: p.nutritionTargets.calories },
                    { label: 'Protein', value: `${p.nutritionTargets.protein}g` },
                    { label: 'Carbs', value: `${p.nutritionTargets.carbs}g` },
                    { label: 'Fat', value: `${p.nutritionTargets.fat}g` },
                  ].map(item => (
                    <div key={item.label} className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-2 text-center">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-[13px] font-bold text-white mt-0.5">{item.value ?? '—'}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleTrigger(`Edit "${p.title}"`)}
                className="w-full py-2.5 border border-[#1E293B] bg-[#0F172A] text-[14px] font-semibold text-gray-300 hover:border-green-500 hover:text-green-400 rounded-lg transition-colors cursor-pointer"
              >
                View Details
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Diet Plan">
        <form onSubmit={handleCreatePlan} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Plan Title</label>
            <input 
              required
              type="text" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. 30-Day Keto Reset"
              className="w-full px-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-white focus:border-[#2563EB] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Client</label>
            <select 
              required
              value={form.clientId}
              onChange={e => setForm({...form, clientId: e.target.value})}
              className="w-full px-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-white focus:border-[#2563EB] focus:outline-none"
            >
              <option value="" disabled>Select a client...</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Plan Type</label>
              <select 
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="w-full px-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-white focus:border-[#2563EB] focus:outline-none"
              >
                <option value="Diet">Diet Only</option>
                <option value="Hybrid">Hybrid (Workout + Diet)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input 
                required
                type="date" 
                value={form.startDate}
                onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full px-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#10b981] hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all shadow-sm"
            >
              {submitting ? 'Creating...' : 'Create & Build'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
