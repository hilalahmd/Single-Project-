import { useState, useEffect } from 'react'
import { Plus, Dumbbell, MoreHorizontal, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../shared/components/Card'
import Modal from '../../../shared/components/Modal'
import api from '../../../shared/utils/api'

export default function WorkoutPlansPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeAction, setActiveAction] = useState('')
  
  const [form, setForm] = useState({ title: '', clientId: '', type: 'Workout', startDate: new Date().toISOString().split('T')[0] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPlans()
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await api.get('/trainers/clients')
      if (res.data.success) {
        setClients(res.data.clients)
      }
    } catch (error) {
      console.error('Failed to fetch clients', error)
    }
  }

  const fetchPlans = async () => {
    try {
      const res = await api.get('/workouts/my-assigned-plans')
      if (res.data.success) {
        setPlans(res.data.plans)
      }
    } catch (error) {
      console.error('Failed to fetch plans', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTrigger = (actionName) => {
    setActiveAction(actionName)
    setForm({ title: '', clientId: clients[0]?._id || '', type: 'Workout', startDate: new Date().toISOString().split('T')[0] })
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
        workouts: [],
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
    return <div className="flex justify-center items-center h-96"><Loader className="animate-spin text-blue-500" size={32} /></div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white">Assigned Workouts</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage plans you have assigned to clients.</p>
        </div>
        <button 
          onClick={() => handleTrigger('Create New Workout Plan')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white text-[14px] font-semibold rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Dumbbell size={48} className="mx-auto mb-4 opacity-50" />
          <p>You haven't assigned any workout plans yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {plans.map(p => (
            <Card key={p._id} className="hover:border-[#2563EB] group transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center border border-[#1E293B]">
                    <Dumbbell size={18} className="text-[#2563EB]" />
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
                <span>{p.clientId?.name || 'Unknown Client'}</span>
                <span>{p.type}</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleTrigger(`Edit Workout Plan "${p.title}"`)}
                  className="flex-1 py-2.5 border border-[#1E293B] bg-[#0F172A] text-[14px] font-semibold text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Workout Plan">
        <form onSubmit={handleCreatePlan} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Plan Title</label>
            <input 
              required
              type="text" 
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. 4-Week Shred Program"
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
                <option value="Workout">Workout Only</option>
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
              className="px-6 py-2 bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all shadow-sm"
            >
              {submitting ? 'Creating...' : 'Create & Build'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
