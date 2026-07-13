import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2, Dumbbell, Salad, Target } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function TrainerPlanBuilderPage() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('workout')
  const [isLoading, setIsLoading] = useState(true)
  
  const clientName = id === '1' ? 'David Kim' : 'Client' // Ideally fetched

  // Multi-day state
  const [workoutDays, setWorkoutDays] = useState([
    { dayNumber: 1, title: 'Day 1 Workout', exercises: [{ name: 'Bench Press', sets: 4, reps: 8, rest: 90 }] }
  ])
  const [activeWorkoutDayIndex, setActiveWorkoutDayIndex] = useState(0)

  const [dietDays, setDietDays] = useState([
    { dayNumber: 1, title: 'Day 1 Diet', meals: [{ name: 'Breakfast', foods: 'Oats, 2 Eggs', calories: 450, protein: 25, carbs: 40, fat: 12 }] }
  ])
  const [activeDietDayIndex, setActiveDietDayIndex] = useState(0)

  // Nutrition Goal State
  const [nutritionTargets, setNutritionTargets] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })

  useEffect(() => {
    const fetchExistingPlan = async () => {
      try {
        const res = await fetch(`${API}/workouts/plan/${id}`, { credentials: 'include' })
        const data = await res.json()
        
        if (data.success && data.data) {
          const { plan, workouts, diets } = data.data
          
          if (plan && plan.nutritionTargets) {
            setNutritionTargets({
              calories: plan.nutritionTargets.calories || '',
              protein: plan.nutritionTargets.protein || '',
              carbs: plan.nutritionTargets.carbs || '',
              fat: plan.nutritionTargets.fat || ''
            })
          }

          if (workouts && workouts.length > 0) {
            const formattedWorkouts = workouts.map(wDay => {
              const parsedExs = wDay.exercises.map(ex => {
                const match = ex.sets.match(/(\d+)\s*Sets\s*x\s*(\d+)\s*Reps\s*\(Rest:\s*(\d+)s\)/i)
                return {
                  name: ex.name,
                  sets: match ? parseInt(match[1]) : 3,
                  reps: match ? parseInt(match[2]) : 10,
                  rest: match ? parseInt(match[3]) : 60
                }
              })
              return { dayNumber: wDay.dayNumber, title: wDay.title, isCompleted: wDay.isCompleted, exercises: parsedExs }
            })
            setWorkoutDays(formattedWorkouts)
          }

          if (diets && diets.length > 0) {
            setDietDays(diets.map(dDay => ({
              dayNumber: dDay.dayNumber,
              title: dDay.title,
              meals: dDay.meals
            })))
          }
        }
      } catch (error) {
        console.error("Failed to load existing plan", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExistingPlan()
  }, [id])

  // --- Handlers for Workouts ---
  const handleAddWorkoutDay = () => {
    const newDayNum = workoutDays.length + 1
    setWorkoutDays([...workoutDays, { dayNumber: newDayNum, title: `Day ${newDayNum} Workout`, isCompleted: false, exercises: [] }])
    setActiveWorkoutDayIndex(workoutDays.length)
  }

  const handleUpdateWorkoutDayTitle = (val) => {
    const newDays = [...workoutDays]
    newDays[activeWorkoutDayIndex].title = val
    setWorkoutDays(newDays)
  }

  const handleAddExercise = () => {
    const newDays = [...workoutDays]
    newDays[activeWorkoutDayIndex].exercises.push({ name: '', sets: 3, reps: 10, rest: 60 })
    setWorkoutDays(newDays)
  }

  const handleUpdateExercise = (index, field, value) => {
    const newDays = [...workoutDays]
    newDays[activeWorkoutDayIndex].exercises[index][field] = value
    setWorkoutDays(newDays)
  }

  const handleRemoveExercise = (index) => {
    const newDays = [...workoutDays]
    newDays[activeWorkoutDayIndex].exercises = newDays[activeWorkoutDayIndex].exercises.filter((_, i) => i !== index)
    setWorkoutDays(newDays)
  }

  // --- Handlers for Diets ---
  const handleAddDietDay = () => {
    const newDayNum = dietDays.length + 1
    setDietDays([...dietDays, { dayNumber: newDayNum, title: `Day ${newDayNum} Diet`, meals: [] }])
    setActiveDietDayIndex(dietDays.length)
  }

  const handleUpdateDietDayTitle = (val) => {
    const newDays = [...dietDays]
    newDays[activeDietDayIndex].title = val
    setDietDays(newDays)
  }

  const handleAddMeal = () => {
    const newDays = [...dietDays]
    newDays[activeDietDayIndex].meals.push({ name: '', foods: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
    setDietDays(newDays)
  }

  const handleUpdateMeal = (index, field, value) => {
    const newDays = [...dietDays]
    newDays[activeDietDayIndex].meals[index][field] = value
    setDietDays(newDays)
  }

  const handleRemoveMeal = (index) => {
    const newDays = [...dietDays]
    newDays[activeDietDayIndex].meals = newDays[activeDietDayIndex].meals.filter((_, i) => i !== index)
    setDietDays(newDays)
  }

  const handleSavePlan = async () => {
    try {
      // Format workouts
      const formattedWorkouts = workoutDays.map(wDay => ({
        title: wDay.title,
        dayNumber: wDay.dayNumber,
        exercises: wDay.exercises.map(ex => ({
          name: ex.name,
          sets: `${ex.sets} Sets x ${ex.reps} Reps (Rest: ${ex.rest}s)`
        }))
      }))

      // Format diets
      const formattedDiets = dietDays.map(dDay => ({
        title: dDay.title,
        dayNumber: dDay.dayNumber,
        meals: dDay.meals.map(m => ({
          name: m.name,
          foods: m.foods,
          calories: Number(m.calories) || 0,
          protein: Number(m.protein) || 0,
          carbs: Number(m.carbs) || 0,
          fat: Number(m.fat) || 0
        }))
      }))

      // Format targets
      const formattedTargets = {
        calories: Number(nutritionTargets.calories) || 0,
        protein: Number(nutritionTargets.protein) || 0,
        carbs: Number(nutritionTargets.carbs) || 0,
        fat: Number(nutritionTargets.fat) || 0
      }

      const payload = {
        clientId: id,
        title: "Custom Assigned Plan",
        description: "Assigned by Trainer",
        type: "hybrid",
        startDate: new Date(),
        workouts: formattedWorkouts,
        diets: formattedDiets,
        nutritionTargets: formattedTargets
      }

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold">Loading client plan...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/trainer/clients')}
            className="w-10 h-10 rounded-full bg-[#111827] border border-[#1E293B] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2563EB] transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-white tracking-tight">Plan Builder</h1>
            <p className="text-sm text-gray-400 mt-1">Assigning plan for <span className="text-white font-semibold">{clientName}</span></p>
          </div>
        </div>
        
        <button 
          onClick={handleSavePlan}
          className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer whitespace-nowrap">
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
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'nutrition' ? 'bg-[#A855F7] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-[#0F172A]'
          }`}
        >
          <Target size={16} /> Nutrition Goal
        </button>
      </div>

      {/* Builder Content */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {activeTab === 'nutrition' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Overall Daily Nutrition Goal</h2>
              <p className="text-gray-400 text-sm">
                Set explicit daily macro targets for the client. If left empty, the client's dashboard will fallback to dynamic targets based on their body weight and goal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Calories</label>
                <div className="relative">
                  <input type="number" value={nutritionTargets.calories} onChange={(e) => setNutritionTargets({...nutritionTargets, calories: e.target.value})} placeholder="e.g. 2500" className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white font-bold px-3 py-2.5 focus:border-[#A855F7] focus:outline-none" />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-600">KCAL</span>
                </div>
              </div>
              
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Protein</label>
                <div className="relative">
                  <input type="number" value={nutritionTargets.protein} onChange={(e) => setNutritionTargets({...nutritionTargets, protein: e.target.value})} placeholder="e.g. 180" className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white font-bold px-3 py-2.5 focus:border-[#A855F7] focus:outline-none" />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-600">G</span>
                </div>
              </div>
              
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Carbs</label>
                <div className="relative">
                  <input type="number" value={nutritionTargets.carbs} onChange={(e) => setNutritionTargets({...nutritionTargets, carbs: e.target.value})} placeholder="e.g. 250" className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white font-bold px-3 py-2.5 focus:border-[#A855F7] focus:outline-none" />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-600">G</span>
                </div>
              </div>
              
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Fat</label>
                <div className="relative">
                  <input type="number" value={nutritionTargets.fat} onChange={(e) => setNutritionTargets({...nutritionTargets, fat: e.target.value})} placeholder="e.g. 70" className="w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white font-bold px-3 py-2.5 focus:border-[#A855F7] focus:outline-none" />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-600">G</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workout' && workoutDays.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                {workoutDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveWorkoutDayIndex(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                      activeWorkoutDayIndex === i 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : d.isCompleted 
                          ? 'bg-[#C4F135]/10 text-[#C4F135] border border-[#C4F135]/30' 
                          : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    Day {d.dayNumber} {d.isCompleted && '✓'}
                  </button>
                ))}
                <button onClick={handleAddWorkoutDay} className="px-4 py-2 rounded-lg text-sm font-bold text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 transition-colors whitespace-nowrap flex items-center gap-1">
                  <Plus size={14} /> Add Day
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Day Title / Muscle Group</label>
              <input 
                type="text" 
                value={workoutDays[activeWorkoutDayIndex].title}
                onChange={(e) => handleUpdateWorkoutDayTitle(e.target.value)}
                placeholder="e.g. Chest & Triceps"
                className="w-full sm:w-96 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white font-semibold px-4 py-3 focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            
            <div className="hidden sm:grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
              <div className="col-span-5">Exercise Name</div>
              <div className="col-span-2">Sets</div>
              <div className="col-span-2">Reps</div>
              <div className="col-span-2">Rest (sec)</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              {workoutDays[activeWorkoutDayIndex].exercises.map((ex, i) => (
                <div key={i} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center bg-[#0F172A] p-4 sm:p-2 rounded-xl border border-[#1E293B]">
                  <div className="w-full sm:col-span-5">
                    <label className="sm:hidden block text-[10px] font-bold text-gray-500 uppercase mb-1">Exercise Name</label>
                    <input 
                      type="text" 
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(i, 'name', e.target.value)}
                      placeholder="e.g. Squats"
                      className="w-full bg-transparent border-none text-white text-sm font-semibold focus:outline-none focus:ring-0 sm:px-3 sm:py-2 placeholder-gray-600 border-b border-[#1E293B] sm:border-none pb-2 sm:pb-0" 
                    />
                  </div>
                  <div className="w-full sm:col-span-2 flex gap-2 items-center">
                    <label className="sm:hidden w-20 text-[10px] font-bold text-gray-500 uppercase">Sets</label>
                    <input type="number" value={ex.sets} onChange={(e) => handleUpdateExercise(i, 'sets', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm sm:text-center px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-2 flex gap-2 items-center">
                    <label className="sm:hidden w-20 text-[10px] font-bold text-gray-500 uppercase">Reps</label>
                    <input type="number" value={ex.reps} onChange={(e) => handleUpdateExercise(i, 'reps', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm sm:text-center px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-2 flex gap-2 items-center">
                    <label className="sm:hidden w-20 text-[10px] font-bold text-gray-500 uppercase">Rest (s)</label>
                    <input type="number" value={ex.rest} onChange={(e) => handleUpdateExercise(i, 'rest', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-sm sm:text-center px-3 py-2 focus:border-[#2563EB] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-1 flex justify-end sm:justify-center mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-[#1E293B] sm:border-t-0">
                    <button onClick={() => handleRemoveExercise(i)} className="text-gray-500 hover:text-red-500 transition-colors p-2 sm:p-0">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddExercise}
              className="w-full py-4 border-2 border-dashed border-[#1E293B] rounded-xl text-sm font-bold text-[#2563EB] hover:bg-[#0F172A] hover:border-[#2563EB] transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={16} strokeWidth={3} /> Add Exercise
            </button>
          </div>
        )}

        {activeTab === 'diet' && dietDays.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-[#1E293B] pb-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                {dietDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDietDayIndex(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeDietDayIndex === i ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5'}`}
                  >
                    Day {d.dayNumber}
                  </button>
                ))}
                <button onClick={handleAddDietDay} className="px-4 py-2 rounded-lg text-sm font-bold text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 transition-colors whitespace-nowrap flex items-center gap-1">
                  <Plus size={14} /> Add Day
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Day Title / Diet Focus</label>
              <input 
                type="text" 
                value={dietDays[activeDietDayIndex].title}
                onChange={(e) => handleUpdateDietDayTitle(e.target.value)}
                placeholder="e.g. High Carb Day"
                className="w-full sm:w-96 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white font-semibold px-4 py-3 focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            
            <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2">
              <div className="col-span-2">Meal Name</div>
              <div className="col-span-4">Foods</div>
              <div className="col-span-1 text-center">Kcal</div>
              <div className="col-span-1 text-center">Pro(g)</div>
              <div className="col-span-1 text-center">Carb(g)</div>
              <div className="col-span-1 text-center">Fat(g)</div>
              <div className="col-span-2"></div>
            </div>

            <div className="space-y-4">
              {dietDays[activeDietDayIndex].meals.map((meal, i) => (
                <div key={i} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center bg-[#0F172A] p-4 sm:p-2 rounded-xl border border-[#1E293B]">
                  <div className="w-full sm:col-span-2">
                    <label className="sm:hidden block text-[10px] font-bold text-gray-500 uppercase mb-1">Meal Name</label>
                    <input 
                      type="text" 
                      value={meal.name || ''}
                      onChange={(e) => handleUpdateMeal(i, 'name', e.target.value)}
                      placeholder="e.g. Lunch"
                      className="w-full bg-transparent border-none text-white text-sm font-semibold focus:outline-none focus:ring-0 sm:px-3 sm:py-2 placeholder-gray-600 border-b border-[#1E293B] sm:border-none pb-2 sm:pb-0" 
                    />
                  </div>
                  <div className="w-full sm:col-span-4 flex gap-2 items-center">
                    <label className="sm:hidden w-16 text-[10px] font-bold text-gray-500 uppercase">Foods</label>
                    <input 
                      type="text" 
                      value={meal.foods || ''}
                      onChange={(e) => handleUpdateMeal(i, 'foods', e.target.value)}
                      placeholder="e.g. Chicken breast, Rice"
                      className="flex-1 sm:w-full bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 sm:px-3 sm:py-2 placeholder-gray-700" 
                    />
                  </div>
                  <div className="w-full sm:col-span-1 flex gap-2 items-center">
                    <label className="sm:hidden w-16 text-[10px] font-bold text-gray-500 uppercase">Kcal</label>
                    <input type="number" value={meal.calories || 0} onChange={(e) => handleUpdateMeal(i, 'calories', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-xs sm:text-center px-2 py-2 focus:border-[#22C55E] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-1 flex gap-2 items-center">
                    <label className="sm:hidden w-16 text-[10px] font-bold text-gray-500 uppercase">Pro</label>
                    <input type="number" value={meal.protein || 0} onChange={(e) => handleUpdateMeal(i, 'protein', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-xs sm:text-center px-2 py-2 focus:border-[#22C55E] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-1 flex gap-2 items-center">
                    <label className="sm:hidden w-16 text-[10px] font-bold text-gray-500 uppercase">Carb</label>
                    <input type="number" value={meal.carbs || 0} onChange={(e) => handleUpdateMeal(i, 'carbs', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-xs sm:text-center px-2 py-2 focus:border-[#22C55E] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-1 flex gap-2 items-center">
                    <label className="sm:hidden w-16 text-[10px] font-bold text-gray-500 uppercase">Fat</label>
                    <input type="number" value={meal.fat || 0} onChange={(e) => handleUpdateMeal(i, 'fat', e.target.value)} className="flex-1 sm:w-full bg-[#111827] border border-[#1E293B] rounded-lg text-white text-xs sm:text-center px-2 py-2 focus:border-[#22C55E] focus:outline-none" />
                  </div>
                  <div className="w-full sm:col-span-2 flex justify-end sm:justify-center mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-[#1E293B] sm:border-t-0">
                    <button onClick={() => handleRemoveMeal(i)} className="text-gray-500 hover:text-red-500 transition-colors p-2 sm:p-0">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

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
