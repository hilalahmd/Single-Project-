import { useState } from 'react'
import { Plus, Utensils } from 'lucide-react'
import WaterTrackerWidget from '../components/WaterTrackerWidget'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'

export default function NutritionTrackerPage() {
  const today = "Thursday, December 12"

  // ─── Local State for Meals ───
  const [meals, setMeals] = useState([
    {
      name: 'Breakfast',
      items: [
        { n: 'Greek Yogurt (200g)', c: 130, p: 17, cb: 9, f: 4 },
        { n: 'Blueberries', c: 84, p: 1, cb: 21, f: 0 },
        { n: 'Granola', c: 180, p: 4, cb: 32, f: 6 }
      ]
    },
    {
      name: 'Lunch',
      items: [
        { n: 'Chicken Breast (200g)', c: 330, p: 62, cb: 0, f: 7 },
        { n: 'Brown Rice (100g)', c: 216, p: 5, cb: 45, f: 2 }
      ]
    },
    {
      name: 'Dinner',
      items: []
    },
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [activeMealIndex, setActiveMealIndex] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Form states
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  // Calculate dynamic totals
  const totalCalories = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + item.c, 0), 0)
  const totalProtein = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + item.p, 0), 0)
  const totalCarbs = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + item.cb, 0), 0)
  const totalFat = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + item.f, 0), 0)

  // Target limits
  const targetCalories = 2000
  const targetProtein = 150
  const targetCarbs = 230
  const targetFat = 67

  // Circular progress calculations
  const strokeDasharray = 527 // 2 * PI * r (r=84)
  const progressRatio = Math.min(totalCalories, targetCalories) / targetCalories
  const strokeDashoffset = strokeDasharray * (1 - progressRatio)

  const handleAddFood = (e) => {
    e.preventDefault()
    if (activeMealIndex === null) return

    const newItem = {
      n: foodName,
      c: Number(calories) || 0,
      p: Number(protein) || 0,
      cb: Number(carbs) || 0,
      f: Number(fat) || 0
    }

    setMeals(prev => prev.map((meal, index) => {
      if (index === activeMealIndex) {
        return {
          ...meal,
          items: [...meal.items, newItem]
        }
      }
      return meal
    }))

    // Reset form
    setFoodName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setModalOpen(false)
    setToastMessage(`Added "${newItem.n}" to ${meals[activeMealIndex].name}!`)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative z-10">
      <style>
        {`
          @keyframes wave-spin {
            from { transform: translateX(-50%) rotate(0deg); }
            to { transform: translateX(-50%) rotate(360deg); }
          }
        `}
      </style>
      
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-white">Nutrition</h1>
        <p className="text-gray-400 font-bold text-[14px] mt-1">{today}</p>
      </div>

      {/* Top Macro Summary Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center hover:border-white/20 transition-colors">
        
        {/* Circle Chart */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="84" className="stroke-white/10" strokeWidth="20" fill="none" />
            <circle cx="96" cy="96" r="84" className="stroke-[#F97316]" strokeWidth="20" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} fill="none" strokeLinecap="round" />
          </svg>
          <div className="text-center mt-1">
            <p className="text-[32px] font-bold text-white">{totalCalories.toLocaleString()}</p>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mt-1">of {targetCalories}<br/>kcal</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="flex-1 w-full space-y-8">
          <div>
            <div className="flex justify-between text-[15px] font-bold mb-3">
              <span className="text-white">Protein</span>
              <span className="text-gray-400">{totalProtein}g / {targetProtein}g</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#F97316] rounded-full transition-all duration-300" style={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[15px] font-bold mb-3">
              <span className="text-white">Carbohydrates</span>
              <span className="text-gray-400">{totalCarbs}g / {targetCarbs}g</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#22C55E] rounded-full transition-all duration-300" style={{ width: `${Math.min((totalCarbs / targetCarbs) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[15px] font-bold mb-3">
              <span className="text-white">Fat</span>
              <span className="text-gray-400">{totalFat}g / {targetFat}g</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full transition-all duration-300" style={{ width: `${Math.min((totalFat / targetFat) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker */}
      <WaterTrackerWidget />

      {/* Meals List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        
        {meals.map((meal, index) => {
          const mealCalories = meal.items.reduce((s, item) => s + item.c, 0)
          return (
            <div key={meal.name} className="border-b border-white/10 last:border-0">
              {/* Meal Header */}
              <div className="flex justify-between items-center px-8 py-6 bg-white/5 hover:bg-white/10 transition-colors">
                <h3 className="font-bold text-[18px] text-white">{meal.name}</h3>
                <div className="flex items-center gap-6">
                  {mealCalories > 0 && <span className="text-[14px] font-bold text-[#22C55E]">{mealCalories} kcal</span>}
                  <button 
                    onClick={() => {
                      setActiveMealIndex(index)
                      setModalOpen(true)
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-gray-400 hover:border-[#F97316] hover:text-[#F97316] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Meal Items */}
              {meal.items.length > 0 ? (
                <div className="px-8 pb-4 bg-transparent">
                  {meal.items.map((item, j) => (
                    <div key={j} className="flex justify-between items-center py-5 border-t border-white/10 first:border-0">
                      <span className="text-[15px] font-bold text-gray-300">{item.n}</span>
                      <div className="flex items-center gap-8">
                        <span className="font-bold text-[15px] text-white">{item.c}</span>
                        <span className="text-[12px] font-bold text-gray-500 w-40 text-right uppercase tracking-wider">
                          <span className="text-[#F97316]">P</span> {item.p}g &nbsp; 
                          <span className="text-[#22C55E]">C</span> {item.cb}g &nbsp; 
                          <span className="text-[#F59E0B]">F</span> {item.f}g
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-8 py-4 bg-transparent text-gray-500 text-xs font-semibold">
                  No food logged for {meal.name} yet.
                </div>
              )}
            </div>
          )
        })}

      </div>

      {/* Log Food Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Log Food for ${activeMealIndex !== null ? meals[activeMealIndex].name : 'Meal'}`}>
        <form onSubmit={handleAddFood} className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Food Name</label>
            <input
              type="text"
              placeholder="e.g. Scrambled Eggs"
              required
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Calories (kcal)</label>
              <input
                type="number"
                placeholder="0"
                required
                value={calories}
                onChange={e => setCalories(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Protein (g)</label>
              <input
                type="number"
                placeholder="0"
                value={protein}
                onChange={e => setProtein(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Carbs (g)</label>
              <input
                type="number"
                placeholder="0"
                value={carbs}
                onChange={e => setCarbs(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Fat (g)</label>
              <input
                type="number"
                placeholder="0"
                value={fat}
                onChange={e => setFat(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-3 border border-white/10 text-white hover:bg-white/10 rounded-xl text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] flex items-center gap-2"
            >
              <Utensils size={14} /> Log Food
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Alert */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

    </div>
  )
}
