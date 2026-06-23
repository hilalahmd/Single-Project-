import { Plus, Salad, MoreHorizontal } from 'lucide-react'

const PLANS = [
  { title: 'Clean Bulk Diet',      clients: 3, calories: '3,200 kcal', updated: 'Jun 21' },
  { title: 'Fat Loss Protocol',    clients: 5, calories: '1,800 kcal', updated: 'Jun 19' },
  { title: 'Maintenance Plan',     clients: 2, calories: '2,400 kcal', updated: 'Jun 14' },
  { title: 'Athlete Performance',  clients: 4, calories: '3,800 kcal', updated: 'Jun 10' },
]

export default function DietPlansPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">Diet Plans</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors">
          <Plus size={16} /> New Plan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {PLANS.map(p => (
          <div key={p.title} className="border border-gray-200 p-5 hover:border-black transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Salad size={16} className="text-black" />
                <h2 className="text-sm font-bold text-black">{p.title}</h2>
              </div>
              <button className="text-gray-300 hover:text-black transition-colors"><MoreHorizontal size={16} /></button>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mb-4">
              <span>{p.clients} clients</span>
              <span>{p.calories}/day</span>
              <span>Updated {p.updated}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-gray-200 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition-colors">Edit</button>
              <button className="flex-1 py-2 border border-gray-200 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition-colors">Assign</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
