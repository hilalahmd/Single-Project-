import { useState } from 'react'
import { Plus, Droplet } from 'lucide-react'

export default function NutritionTrackerPage() {
  const [glasses, setGlasses] = useState(5)
  const today = "Thursday, December 12"

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#1A1A1A]">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight">Nutrition</h1>
        <p className="text-gray-500 font-medium text-sm mt-1">{today}</p>
      </div>

      {/* Top Macro Summary Card */}
      <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        
        {/* Circle Chart */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" className="stroke-gray-100" strokeWidth="16" fill="none" />
            <circle cx="80" cy="80" r="70" className="stroke-black" strokeWidth="16" strokeDasharray="440" strokeDashoffset="140" fill="none" strokeLinecap="round" />
          </svg>
          <div className="text-center mt-1">
            <p className="text-2xl font-bold">1,360</p>
            <p className="text-[11px] font-bold text-gray-400 uppercase">of 2,000<br/>kcal</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="flex-1 w-full space-y-6">
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Protein</span>
              <span className="text-gray-500">136g / 150g</span>
            </div>
            <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Carbohydrates</span>
              <span className="text-gray-500">149g / 230g</span>
            </div>
            <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>Fat</span>
              <span className="text-gray-500">42g / 67g</span>
            </div>
            <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Water</h2>
          <span className="text-sm font-bold text-gray-500">{glasses} / 8 glasses</span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setGlasses(i + 1)}
              className={`h-10 flex-1 min-w-[40px] rounded-lg flex items-center justify-center transition-all ${
                i < glasses 
                  ? 'bg-black text-white border border-black' 
                  : 'bg-gray-50 text-gray-300 border border-[#E5E4E0] hover:border-gray-300'
              }`}
            >
              <Droplet size={14} className={i < glasses ? "fill-white" : ""} strokeWidth={3} />
            </button>
          ))}
        </div>
      </div>

      {/* Meals List */}
      <div className="bg-white border border-[#E5E4E0] rounded-2xl shadow-sm overflow-hidden">
        
        {[
          { name: 'Breakfast', cal: 394, items: [
            {n: 'Greek Yogurt (200g)', c: 130, p: 17, cb: 9, f: 4}, 
            {n: 'Blueberries', c: 84, p: 1, cb: 21, f: 0},
            {n: 'Granola', c: 180, p: 4, cb: 32, f: 6}
          ]},
          { name: 'Lunch', cal: 546, items: [
            {n: 'Chicken Breast (200g)', c: 330, p: 62, cb: 0, f: 7}, 
            {n: 'Brown Rice (100g)', c: 216, p: 5, cb: 45, f: 2}
          ]},
          { name: 'Dinner', cal: 0, items: [] },
        ].map((meal, i) => (
          <div key={i} className="border-b border-[#E5E4E0] last:border-0">
            {/* Meal Header */}
            <div className="flex justify-between items-center px-6 py-5 bg-[#F9FAFB]/50">
              <h3 className="font-bold">{meal.name}</h3>
              <div className="flex items-center gap-4">
                {meal.cal > 0 && <span className="text-xs font-bold text-gray-400">{meal.cal} kcal</span>}
                <button className="text-gray-400 hover:text-black transition-colors">
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Meal Items */}
            {meal.items.length > 0 && (
              <div className="px-6 pb-2">
                {meal.items.map((item, j) => (
                  <div key={j} className="flex justify-between items-center py-4 border-t border-gray-100 first:border-0">
                    <span className="text-[14px] font-medium text-gray-600">{item.n}</span>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-[14px]">{item.c}</span>
                      <span className="text-[11px] font-bold text-gray-400 w-32 text-right">
                        P {item.p}g &nbsp; C {item.cb}g &nbsp; F {item.f}g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>

    </div>
  )
}
