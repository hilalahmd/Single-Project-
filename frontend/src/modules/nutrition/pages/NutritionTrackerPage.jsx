import { useState } from 'react'
import { Plus, Droplet } from 'lucide-react'

export default function NutritionTrackerPage() {
  const [glasses, setGlasses] = useState(5)
  const today = "Thursday, December 12"

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-white">Nutrition</h1>
        <p className="text-gray-400 font-medium text-[14px] mt-1">{today}</p>
      </div>

      {/* Top Macro Summary Card */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-10 items-center hover:border-[#2563EB] transition-colors">
        
        {/* Circle Chart */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="84" className="stroke-[#0F172A]" strokeWidth="20" fill="none" />
            <circle cx="96" cy="96" r="84" className="stroke-[#2563EB]" strokeWidth="20" strokeDasharray="527" strokeDashoffset="160" fill="none" strokeLinecap="round" />
          </svg>
          <div className="text-center mt-1">
            <p className="text-[32px] font-bold text-white">1,360</p>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mt-1">of 2,000<br/>kcal</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="flex-1 w-full space-y-8">
          <div>
            <div className="flex justify-between text-[15px] font-semibold mb-3">
              <span className="text-white">Protein</span>
              <span className="text-gray-400">136g / 150g</span>
            </div>
            <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B]">
              <div className="h-full bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[15px] font-semibold mb-3">
              <span className="text-white">Carbohydrates</span>
              <span className="text-gray-400">149g / 230g</span>
            </div>
            <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B]">
              <div className="h-full bg-gradient-to-r from-[#22C55E] to-green-400 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[15px] font-semibold mb-3">
              <span className="text-white">Fat</span>
              <span className="text-gray-400">42g / 67g</span>
            </div>
            <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden border border-[#1E293B]">
              <div className="h-full bg-gradient-to-r from-[#F59E0B] to-yellow-400 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-sm hover:border-[#2563EB] transition-colors">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[20px] font-semibold text-white">Water</h2>
          <span className="text-[14px] font-bold text-[#2563EB] bg-[#2563EB]/10 px-4 py-2 rounded-lg border border-[#2563EB]/20">{glasses} / 8 glasses</span>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <button 
              key={i} 
              onClick={() => setGlasses(i + 1)}
              className={`h-12 flex-1 min-w-[48px] rounded-xl flex items-center justify-center transition-all duration-300 ${
                i < glasses 
                  ? 'bg-gradient-to-br from-[#2563EB] to-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' 
                  : 'bg-[#0F172A] text-gray-500 border border-[#1E293B] hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
            >
              <Droplet size={18} className={i < glasses ? "fill-white" : ""} strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </div>

      {/* Meals List */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl shadow-sm overflow-hidden">
        
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
          <div key={i} className="border-b border-[#1E293B] last:border-0">
            {/* Meal Header */}
            <div className="flex justify-between items-center px-8 py-6 bg-[#0F172A]/50 hover:bg-[#0F172A] transition-colors">
              <h3 className="font-semibold text-[18px] text-white">{meal.name}</h3>
              <div className="flex items-center gap-6">
                {meal.cal > 0 && <span className="text-[14px] font-bold text-[#22C55E]">{meal.cal} kcal</span>}
                <button className="w-8 h-8 rounded-full bg-[#111827] border border-[#1E293B] text-gray-400 hover:border-[#2563EB] hover:text-[#2563EB] flex items-center justify-center transition-colors">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Meal Items */}
            {meal.items.length > 0 && (
              <div className="px-8 pb-4 bg-[#111827]">
                {meal.items.map((item, j) => (
                  <div key={j} className="flex justify-between items-center py-5 border-t border-[#1E293B]/50 first:border-0">
                    <span className="text-[15px] font-semibold text-gray-300">{item.n}</span>
                    <div className="flex items-center gap-8">
                      <span className="font-bold text-[15px] text-white">{item.c}</span>
                      <span className="text-[12px] font-bold text-gray-500 w-40 text-right uppercase tracking-wider">
                        <span className="text-[#2563EB]">P</span> {item.p}g &nbsp; 
                        <span className="text-[#22C55E]">C</span> {item.cb}g &nbsp; 
                        <span className="text-[#F59E0B]">F</span> {item.f}g
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
