import { Plus, Salad, MoreHorizontal } from 'lucide-react'
import Card from '../../../shared/components/Card'

const PLANS = [
  { title: 'Clean Bulk Diet',      clients: 3, calories: '3,200 kcal', updated: 'Jun 21' },
  { title: 'Fat Loss Protocol',    clients: 5, calories: '1,800 kcal', updated: 'Jun 19' },
  { title: 'Maintenance Plan',     clients: 2, calories: '2,400 kcal', updated: 'Jun 14' },
  { title: 'Athlete Performance',  clients: 4, calories: '3,800 kcal', updated: 'Jun 10' },
]

export default function DietPlansPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-white">Diet Plans</h1>
          <p className="text-[14px] text-gray-400 mt-1">Manage and assign nutrition protocols.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white text-[14px] font-semibold rounded-lg transition-all shadow-sm">
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
              <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            <div className="flex gap-4 text-[12px] font-semibold text-gray-400 mb-6 uppercase tracking-wider">
              <span>{p.clients} clients</span>
              <span>{p.calories}/day</span>
              <span>Updated {p.updated}</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 border border-[#1E293B] bg-[#0F172A] text-[14px] font-semibold text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] rounded-lg transition-colors">Edit</button>
              <button className="flex-1 py-2.5 border border-[#1E293B] bg-[#0F172A] text-[14px] font-semibold text-gray-300 hover:border-[#2563EB] hover:text-[#2563EB] rounded-lg transition-colors">Assign</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
