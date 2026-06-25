import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Dumbbell, Salad } from 'lucide-react'

export default function TrainerPlanBuilderPage() {
  const { id } = useParams() // Client ID
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('workout')
  
  // Dummy Client Info based on ID
  const clientName = id === '1' ? 'David Kim' : 'Client'

  // Workout state
  const [exercises, setExercises] = useState([
    { name: 'Bench Press', sets: 4, reps: 8, rest: 90 }
  ])

  // Diet state
  const [meals, setMeals] = useState([
    { name: 'Breakfast', foods: 'Oatmeal, 2 Eggs, Protein Shake', calories: 450 }
  ])

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, rest: 60 }])
  }

  const handleAddMeal = () => {
    setMeals([...meals, { name: '', foods: '', calories: 0 }])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/trainer/clients')}
            className="w-10 h-10 rounded-full bg-[#111827] border border-[#1E293B] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2563EB] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-white tracking-tight">Plan Builder</h1>
            <p className="text-sm text-gray-400 mt-1">Assigning plan for <span className="text-white font-semibold">{clientName}</span></p>
          </div>
        </div>
        
        <button className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
          <Save size={18} /> Save Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 bg-[#111827] border border-[#1E293B] rounded-xl w-max">
        <button 
          onClick={() => setActiveTab('workout')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'workout' ? 'bg-[#2563EB] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#0F172A]'
          }`}
        >
          <Dumbbell size={16} /> Workout Program
        </button>
        <button 
          onClick={() => setActiveTab('diet')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'diet' ? 'bg-[#22C55E] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#0F172A]'
          }`}
        >
          <Salad size={16} /> Diet Plan
        </button>
      </div>

      {/* Builder Content */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-sm">
        
        {activeTab === 'workout' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E293B]">
              <h2 className="text-xl font-bold text-white">Daily Exercises</h2>
            </div>
            
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
              <div className="col-span-5">Exercise Name</div>
              <div className="col-span-2">Sets</div>
              <div className="col-span-2">Reps</div>
              <div className="col-span-2">Rest (sec)</div>
              <div className="col-span-1"></div>
            </div>

            {exercises.map((ex, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center bg-[#0F172A] p-2 rounded-xl border border-[#1E293B]">
                <div className="col-span-5">
                  <input 
                    type="text" 
                    value={ex.name}
                    placeholder="e.g. Squats"
                    className="w-full bg-transparent border-none text-white text-sm font-semibold focus:outline-none focus:ring-0 px-3 py-2 placeholder-gray-600" 
                  />
                </div>
                <div className="col-span-2">
                  <input type="number" value={ex.sets} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#2563EB] focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={ex.reps} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#2563EB] focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={ex.rest} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#2563EB] focus:outline-none" />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={handleAddExercise}
              className="w-full py-4 border-2 border-dashed border-[#1E293B] rounded-xl text-sm font-bold text-[#2563EB] hover:bg-[#0F172A] hover:border-[#2563EB] transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={16} strokeWidth={3} /> Add Exercise
            </button>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E293B]">
              <h2 className="text-xl font-bold text-white">Daily Meals</h2>
            </div>
            
            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
              <div className="col-span-3">Meal Name</div>
              <div className="col-span-6">Foods</div>
              <div className="col-span-2">Calories</div>
              <div className="col-span-1"></div>
            </div>

            {meals.map((meal, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center bg-[#0F172A] p-2 rounded-xl border border-[#1E293B]">
                <div className="col-span-3">
                  <input 
                    type="text" 
                    value={meal.name}
                    placeholder="e.g. Lunch"
                    className="w-full bg-transparent border-none text-white text-sm font-semibold focus:outline-none focus:ring-0 px-3 py-2 placeholder-gray-600" 
                  />
                </div>
                <div className="col-span-6">
                  <input 
                    type="text" 
                    value={meal.foods}
                    placeholder="e.g. 200g Chicken, 100g Rice"
                    className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm px-3 py-2 focus:border-[#22C55E] focus:outline-none placeholder-gray-600" 
                  />
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <input type="number" value={meal.calories} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-[#22C55E] font-bold text-sm text-center py-2 focus:border-[#22C55E] focus:outline-none" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase">kcal</span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={handleAddMeal}
              className="w-full py-4 border-2 border-dashed border-[#1E293B] rounded-xl text-sm font-bold text-[#22C55E] hover:bg-[#0F172A] hover:border-[#22C55E] transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={16} strokeWidth={3} /> Add Meal
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
