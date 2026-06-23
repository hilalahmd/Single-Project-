import { Plus, Dumbbell, MoreHorizontal } from 'lucide-react'

const PLANS = [
  { title: 'Upper Body Strength',  clients: 5, weeks: 8, updated: 'Jun 20' },
  { title: 'Full Body Beginner',   clients: 3, weeks: 6, updated: 'Jun 18' },
  { title: 'Powerlifting Prep',    clients: 2, weeks: 12, updated: 'Jun 15' },
  { title: 'Athlete Conditioning', clients: 4, weeks: 10, updated: 'Jun 10' },
]

export default function WorkoutPlansPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black">Workout Plans</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors">
          <Plus size={16} /> New Plan
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {PLANS.map(p => (
          <div key={p.title} className="border border-gray-200 p-5 hover:border-black transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Dumbbell size={16} className="text-black" />
                <h2 className="text-sm font-bold text-black">{p.title}</h2>
              </div>
              <button className="text-gray-300 hover:text-black transition-colors"><MoreHorizontal size={16} /></button>
            </div>
            <div className="flex gap-4 text-xs text-gray-500 mb-4">
              <span>{p.clients} clients</span>
              <span>{p.weeks} weeks</span>
              <span>Updated {p.updated}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 border border-gray-200 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition-colors">
                Edit
              </button>
              <button className="flex-1 py-2 border border-gray-200 text-xs font-semibold text-gray-700 hover:border-black hover:text-black transition-colors">
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
