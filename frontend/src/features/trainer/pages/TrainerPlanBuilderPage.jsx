import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Dumbbell, Salad } from 'lucide-react'
import API from '../../../shared/utils/api' // API connect cheyyan

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

  // --- Puthiyathayi add cheytha functions (API Call) ---

  const handleUpdateExercise = (index, field, value) => {
    const newExercises = [...exercises]
    newExercises[index][field] = value
    setExercises(newExercises)
  }

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleSavePlan = async () => {
    try {
      const formattedExercises = exercises.map(ex => ({
        name: ex.name,
        sets: `${ex.sets} Sets x ${ex.reps} Reps (Rest: ${ex.rest}s)`
      }))

      const payload = {
        clientId: id, // URL-nnu kittunna ID
        title: "Custom Workout Plan",
        description: "Assigned by Trainer",
        type: "workout",
        startDate: new Date(),
        workouts: [
          {
            title: "Day 1 Workout",
            dayNumber: 1,
            exercises: formattedExercises
          }
        ]
      }

      // Backend API vilikkunnu
      const res = await fetch(`${API}/workouts/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      
      const data = await res.json()
      if (data.success) {
        alert("Plan saved successfully!")
        navigate('/trainer/clients') 
      } else {
        alert("Error saving plan: " + data.message)
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Something went wrong!")
    }
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
        
        {/* Puthiya handleSavePlan function ivide connect cheythu */}
        <button 
          onClick={handleSavePlan}
          className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
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
                    onChange={(e) => handleUpdateExercise(i, 'name', e.target.value)}
                    placeholder="e.g. Squats"
                    className="w-full bg-transparent border-none text-white text-sm font-semibold focus:outline-none focus:ring-0 px-3 py-2 placeholder-gray-600" 
                  />
                </div>
                <div className="col-span-2">
                  <input type="number" value={ex.sets} onChange={(e) => handleUpdateExercise(i, 'sets', e.target.value)} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#2563EB] focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={ex.reps} onChange={(e) => handleUpdateExercise(i, 'reps', e.target.value)} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#2563EB] focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={ex.rest} onChange={(e) => handleUpdateExercise(i, 'rest', e.target.value)} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#2563EB] focus:outline-none" />
                </div>
                <div className="col-span-1 flex justify-center">
                  <button onClick={() => handleRemoveExercise(i)} className="text-gray-500 hover:text-red-500 transition-colors">
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
                    placeholder="e.g. Chicken breast, Rice, Broccoli"
                    className="w-full bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 px-3 py-2 placeholder-gray-700" 
                  />
                </div>
                <div className="col-span-2">
                  <input type="number" value={meal.calories} className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm text-center py-2 focus:border-[#22C55E] focus:outline-none" />
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
