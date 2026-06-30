import { useState } from 'react'
import { Plus } from 'lucide-react'
import WaterTrackerWidget from '../components/WaterTrackerWidget'

export default function NutritionTrackerPage() {
  const [glasses, setGlasses] = useState(5)
  const today = "Thursday, December 12"

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
            <circle cx="96" cy="96" r="84" className="stroke-[#F97316]" strokeWidth="20" strokeDasharray="527" strokeDashoffset="160" fill="none" strokeLinecap="round" />
          </svg>
          <div className="text-center mt-1">
            <p className="text-[32px] font-bold text-white">1,360</p>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mt-1">of 2,000<br/>kcal</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="flex-1 w-full space-y-8">
          <div>
            <div className="flex justify-between text-[15px] font-bold mb-3">
              <span className="text-white">Protein</span>
              <span className="text-gray-400">136g / 150g</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#F97316] rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[15px] font-bold mb-3">
              <span className="text-white">Carbohydrates</span>
              <span className="text-gray-400">149g / 230g</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[15px] font-bold mb-3">
              <span className="text-white">Fat</span>
              <span className="text-gray-400">42g / 67g</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker */}
      <WaterTrackerWidget />

      {/* Meals List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        
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
          <div key={i} className="border-b border-white/10 last:border-0">
            {/* Meal Header */}
            <div className="flex justify-between items-center px-8 py-6 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="font-bold text-[18px] text-white">{meal.name}</h3>
              <div className="flex items-center gap-6">
                {meal.cal > 0 && <span className="text-[14px] font-bold text-[#22C55E]">{meal.cal} kcal</span>}
                <button className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-gray-400 hover:border-[#F97316] hover:text-[#F97316] flex items-center justify-center transition-colors shadow-sm">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Meal Items */}
            {meal.items.length > 0 && (
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
            )}
          </div>
        ))}

      </div>

    </div>
  )
}
