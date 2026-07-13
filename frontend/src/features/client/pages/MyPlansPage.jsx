import { useState, useEffect } from 'react'
import { ChevronDown, Info, Plus, Trash2, Check, Lock, Zap } from 'lucide-react'
import Modal from '../../../shared/components/Modal'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'

export default function MyPlansPage() {
  const { subscriptionTier } = useAuth()
  const [activeTab, setActiveTab] = useState('workout')
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDietDay, setActiveDietDay] = useState('Mon')
  const [expandedDay, setExpandedDay] = useState(1)

  // ─── Workouts State ───
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  // ─── Diet State ───
  const [assignedDiets, setAssignedDiets] = useState([])
  const [activeDietDayNumber, setActiveDietDayNumber] = useState(1)


  // ─── Modal & Manual Entry States ───
  const [modalOpen, setModalOpen] = useState(false)
  const [newDayNum, setNewDayNum] = useState(4)
  const [newDayTitle, setNewDayTitle] = useState('')
  const [newDayRest, setNewDayRest] = useState('60s')
  const [newExercises, setNewExercises] = useState([])
  
  // Single exercise input fields
  const [exName, setExName] = useState('')
  const [exFocus, setExFocus] = useState('')
  const [exSets, setExSets] = useState(3)
  const [exReps, setExReps] = useState('10-12')
  const [exRest, setExRest] = useState('60s')



    useEffect(() => {
    const fetchMyPlan = async () => {
      try {
        const res = await fetch(`${API}/workouts/my-plan`, { credentials: 'include' })
        const data = await res.json()
        
        if (data.success && data.workouts) {
          setWorkouts(data.workouts) // Backend data state-lekku save cheyyunnu
        }
        if (data.success && data.diets) {
          setAssignedDiets(data.diets)
          if (data.diets.length > 0) {
            setActiveDietDayNumber(data.diets[0].dayNumber)
          }
        }
      } catch (error) {
        console.error("Plan fetch cheyyan pattiyailla:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMyPlan()
  }, [])

  // (Diet Fetch Logic for logs is removed as we now use assigned trainer plans)

  // Initialize new day number on modal open
  useEffect(() => {
    if (modalOpen) {
      setNewDayNum(workouts.length + 1)
      setNewDayTitle('')
      setNewDayRest('60s')
      setNewExercises([])
      clearExFields()
    }
  }, [modalOpen, workouts])

  const clearExFields = () => {
    setExName('')
    setExFocus('')
    setExSets(3)
    setExReps('10-12')
    setExRest('60s')
  }

  const handleAddExerciseToTempList = () => {
    if (!exName.trim()) return
    const tempEx = {
      id: Date.now() + Math.random(),
      name: exName.trim(),
      focus: exFocus.trim() || 'Focus on form.',
      sets: exSets,
      reps: exReps,
      rest: exRest,
      completed: false
    }
    setNewExercises(prev => [...prev, tempEx])
    clearExFields()
  }

  const handleSaveDay = (e) => {
    e.preventDefault()
    if (!newDayTitle.trim()) return

    const newDay = {
      day: newDayNum,
      title: newDayTitle.trim(),
      rest: newDayRest,
      exs: newExercises
    }

    setWorkouts(prev => [...prev, newDay])
    setModalOpen(false)
  }

  const handleDeleteDay = (dayNum) => {
    setWorkouts(prev => prev.filter(w => w.day !== dayNum))
  }

    const toggleExerciseCompletion = async (workoutId, exerciseId) => {
    try {
      const res = await fetch(`${API}/workouts/toggle-exercise`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutId, exerciseId }),
        credentials: 'include'
      })
      const data = await res.json()
      
      if (data.success) {
        // UI instantly update cheyyunnu
        setWorkouts(prev => prev.map(w => {
          if (w._id !== workoutId) return w
          return {
            ...w,
            exercises: w.exercises.map(ex => {
              if (ex._id !== exerciseId) return ex
              return { ...ex, isCompleted: !ex.isCompleted }
            })
          }
        }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleMealCompletion = async (dietId, mealId) => {
    try {
      const res = await fetch(`${API}/workouts/toggle-meal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dietId, mealId }),
        credentials: 'include'
      })
      const data = await res.json()
      
      if (data.success) {
        setAssignedDiets(prev => prev.map(d => {
          if (d._id !== dietId) return d
          return {
            ...d,
            meals: d.meals.map(m => {
              if (m._id !== mealId) return m
              return { ...m, isCompleted: !m.isCompleted }
            })
          }
        }))
      }
    } catch (err) {
      console.error(err)
    }
  }


    const getDayProgress = (workoutDay) => {
    if (!workoutDay.exercises || workoutDay.exercises.length === 0) return null
    const completedCount = workoutDay.exercises.filter(e => e.isCompleted).length
    const totalCount = workoutDay.exercises.length
    const percent = Math.round((completedCount / totalCount) * 100)
    return { completedCount, totalCount, percent }
  }


  const isFree = subscriptionTier === 'free'

  // Get current active diet day data
  const currentDietDay = assignedDiets.find(d => d.dayNumber === activeDietDayNumber)

  // Determine coach assign label
  const coachLabel = subscriptionTier === 'personal_training'
    ? 'Assigned by Coach Arjun Menon' 
    : (subscriptionTier === 'wellness' ? 'Assigned by Coach Priya Nair' : 'Self-Assigned Program')

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10 pb-20 pt-4 md:pt-6">
      
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.03) 0%, transparent 70%)', transform: 'translate(30%, -20%)' }} />
      </div>

      {/* Title */}
      <div className="dashboard-card-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-3xl md:text-[34px] font-black text-white font-['Syne'] tracking-tight">My Plans</h1>
          <p className="text-gray-500 font-medium text-[15px] mt-1">Your personalized routine for this month.</p>
        </div>
        
        {/* Free users can manually add a workout day */}
        {isFree && (
          <button 
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-full text-[13px] font-black transition-all active:scale-95 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(196,241,53,0.3)]"
            style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b' }}
          >
            <Plus size={16} /> Add Workout Day
          </button>
        )}
      </div>

      {/* Gated Plan Headers / Warning banners */}
      <div className="dashboard-card-2 bg-white/[0.04] border border-white/[0.08] rounded-[16px] p-4 flex items-center justify-between gap-3 text-sm font-bold text-gray-300 shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <Info size={18} className="shrink-0 text-gray-500" />
          <p>
            {isFree 
              ? 'Free Plan Mode — You are customizing your own workout list. Upgrade to Wellness or PT to have a dedicated trainer assign routines directly.'
              : `${coachLabel} — Your custom training and nutrition programs are active and synced.`
            }
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="dashboard-card-3 border-b border-white/10 flex relative mb-8 z-10">
        <button 
          onClick={() => setActiveTab('workout')} 
          role="tab"
          aria-selected={activeTab === 'workout'}
          className={`w-32 pb-4 text-[14px] tracking-wide font-black capitalize transition-all duration-300 focus:outline-none ${activeTab === 'workout' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Workout Plan
        </button>
        <button 
          onClick={() => setActiveTab('diet')} 
          role="tab"
          aria-selected={activeTab === 'diet'}
          className={`w-28 pb-4 text-[14px] tracking-wide font-black capitalize transition-all duration-300 focus:outline-none ${activeTab === 'diet' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Diet Plan
        </button>
        
        {/* Animated Sliding Underline */}
        <div className="absolute bottom-0 h-0.5 bg-[#C4F135] shadow-[0_0_12px_#C4F135] transition-all duration-300 ease-out"
          style={{
            width: activeTab === 'workout' ? '8rem' : '7rem', // w-32 = 8rem, w-28 = 7rem
            transform: activeTab === 'workout' ? 'translateX(0)' : 'translateX(8rem)'
          }}
        />
      </div>

      {/* Content Container (Crossfade) */}
      <div className="relative z-10">
        
        {/* ─── WORKOUT PLAN TAB ─── */}
        <div className={`transition-all duration-500 ease-out ${activeTab === 'workout' ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
          <div className="space-y-6">
            
            {/* Week Selector */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(w => (
                <button 
                  key={w}
                  onClick={() => setActiveWeek(w)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-black transition-all duration-300 ease-out active:scale-95 focus:outline-none ${
                    activeWeek === w 
                      ? 'bg-[#C4F135] text-[#0a0a0b] shadow-[0_4px_16px_rgba(196,241,53,0.3)]' 
                      : 'bg-transparent text-gray-500 border border-white/[0.08] hover:border-white/20 hover:text-gray-300 hover:bg-white/[0.02]'
                  }`}
                >
                  Week {w}
                </button>
              ))}
            </div>

            {/* Progressive overload Suggestion banner */}
            {activeWeek === 1 && (
              <div className="bg-[rgba(196,241,53,0.05)] border border-[rgba(196,241,53,0.2)] rounded-[16px] p-4 flex gap-3 text-sm font-bold text-[#C4F135] items-start shadow-[0_4px_16px_rgba(196,241,53,0.05)] animate-in fade-in slide-in-from-top-2 duration-500">
                <Zap size={18} className="shrink-0 mt-0.5" />
                <p>Progressive Overload Target: Try to complete at least 1 more rep or increase load by 2.5kg on final sets this week.</p>
              </div>
            )}

            {/* Workout Days List */}
            {activeWeek === 1 ? (
              <div className="space-y-4">
                                {workouts.map((wDay, idx) => {
                  const progress = getDayProgress(wDay)
                  const hasExs = wDay.exercises && wDay.exercises.length > 0
                  const isExpanded = expandedDay === wDay.dayNumber

                  return (
                    <div key={wDay.dayNumber} 
                      className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-[20px] overflow-hidden transition-all duration-300 hover:border-white/[0.12] animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      {/* Day Header (Accordion Toggle) */}
                      <button 
                        onClick={() => setExpandedDay(isExpanded ? null : wDay.dayNumber)}
                        className="w-full flex flex-col sm:flex-row items-stretch justify-between p-6 sm:p-8 hover:bg-white/[0.02] transition-colors focus:outline-none group text-left"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex-1 flex items-center gap-5 sm:gap-8">
                          <div className="w-12 text-center shrink-0">
                            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">Day</p>
                            <p className="text-[28px] font-black text-white font-['Syne'] leading-none mt-1">{wDay.dayNumber}</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-black text-[18px] text-white">{wDay.title}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-[13px] text-gray-500 font-bold">
                              <span>Exercises: {wDay.exercises ? wDay.exercises.length : 0}</span>
                              {progress && (
                                <span className="text-white flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" />
                                  {progress.completedCount} of {progress.totalCount} Done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar & Actions */}
                        <div className="flex items-center gap-5 justify-between sm:justify-end mt-5 sm:mt-0 shrink-0 w-full sm:w-auto">
                          {progress && (
                            <div className="flex items-center gap-3 w-full sm:w-32">
                              <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full transition-all duration-500 ease-out" 
                                  style={{ width: `${progress.percent}%`, background: 'linear-gradient(90deg, #a3d625, #C4F135)' }} />
                              </div>
                              <span className="text-[12px] font-black text-[#C4F135] w-8 text-right">{progress.percent}%</span>
                            </div>
                          )}
                          
                          <div className="p-2 text-gray-500 group-hover:text-white rounded-lg transition-colors shrink-0">
                            <ChevronDown size={20} className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                          </div>
                        </div>
                      </button>

                      {/* Accordion Content */}
                      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          {hasExs ? (
                            <div className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8 border-t border-white/[0.05] space-y-3">
                              {wDay.exercises.map((ex) => (
                                <div 
                                  key={ex._id} 
                                  onClick={() => toggleExerciseCompletion(wDay._id, ex._id)}
                                  role="checkbox"
                                  aria-checked={ex.isCompleted}
                                  className={`group p-4 sm:p-5 rounded-[16px] border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 ${
                                    ex.isCompleted 
                                      ? 'bg-[rgba(196,241,53,0.03)] border-[rgba(196,241,53,0.15)] opacity-80' 
                                      : 'bg-[#111318]/50 border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.1]'
                                  }`}
                                >
                                  <div className="flex items-start sm:items-center gap-4">
                                    <div className={`w-6 h-6 mt-0.5 sm:mt-0 rounded-[8px] flex items-center justify-center transition-all duration-300 shrink-0 ${
                                      ex.isCompleted 
                                        ? 'bg-[#C4F135] border-[#C4F135] shadow-[0_0_12px_rgba(196,241,53,0.4)]' 
                                        : 'bg-white/[0.04] border border-white/[0.15] group-hover:border-white/30'
                                    }`}>
                                      {ex.isCompleted && <Check size={14} strokeWidth={4} color="#0a0a0b" className="animate-in zoom-in duration-200" />}
                                    </div>
                                    
                                    <div>
                                      <p className={`text-[15px] font-bold transition-colors duration-300 ${ex.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{ex.name}</p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2 sm:gap-3 text-[11px] font-bold shrink-0 ml-10 sm:ml-0">
                                    <span className="bg-white/[0.04] text-gray-300 border border-white/[0.08] px-3 py-1.5 rounded-full">{ex.sets}</span>
                                    {ex.weight && <span className="bg-[rgba(196,241,53,0.08)] text-[#C4F135] border border-[rgba(196,241,53,0.2)] px-3 py-1.5 rounded-full">{ex.weight}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8 border-t border-white/[0.05]">
                              <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.05] rounded-[16px]">
                                <Info size={18} className="text-gray-500" />
                                <p className="text-[13px] font-bold text-gray-400">Rest day. Complete recovery. Optional stretching or walking.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-white/5 rounded-[24px] animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <Lock size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">Week {activeWeek} Locked</h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Complete Week {activeWeek - 1} to unlock this week's progressive overload routine.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── DIET PLAN TAB ─── */}
        <div className={`transition-all duration-500 ease-out ${activeTab === 'diet' ? 'opacity-100 translate-y-0 relative z-10' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
          <div className="space-y-6">
            
            {/* Day Selector */}
            <div className="flex flex-wrap gap-2">
              {assignedDiets.length > 0 ? assignedDiets.map(day => (
                <button 
                  key={day.dayNumber}
                  onClick={() => setActiveDietDayNumber(day.dayNumber)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-black transition-all duration-300 ease-out active:scale-95 focus:outline-none ${
                    activeDietDayNumber === day.dayNumber 
                      ? 'bg-[#C4F135] text-[#0a0a0b] shadow-[0_4px_16px_rgba(196,241,53,0.3)]' 
                      : 'bg-transparent text-gray-500 border border-white/[0.08] hover:border-white/20 hover:text-gray-300 hover:bg-white/[0.02]'
                  }`}
                >
                  Day {day.dayNumber} - {day.title}
                </button>
              )) : (
                <div className="text-gray-500 text-sm">No diet plan assigned yet.</div>
              )}
            </div>

            {/* Daily Target calories summary (can be updated to use plan targets later) */}
            {currentDietDay && (
              <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:-translate-y-0.5 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <p className="text-[#C4F135] text-[11px] font-bold mb-1 uppercase tracking-widest">{currentDietDay.title}</p>
                  <p className="text-[28px] font-black text-white font-['Syne'] leading-none">
                    Diet Focus
                  </p>
                </div>
              </div>
            )}

            {/* Meals list */}
            <div className="space-y-4">
              {currentDietDay && currentDietDay.meals && currentDietDay.meals.length > 0 ? (
                currentDietDay.meals.map((meal, i) => {
                  return (
                    <div key={i} className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-[20px] p-6 hover:bg-white/[0.05] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div 
                            onClick={() => toggleMealCompletion(currentDietDay._id, meal._id)}
                            className="w-6 h-6 rounded-[8px] flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer"
                            style={{
                              background: meal.isCompleted ? '#C4F135' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${meal.isCompleted ? '#C4F135' : 'rgba(255,255,255,0.15)'}`
                            }}
                          >
                            {meal.isCompleted && <Check size={14} strokeWidth={4} color="#0a0a0b" className="animate-in zoom-in duration-200" />}
                          </div>
                          <h3 className={`text-[18px] font-black transition-all duration-300 ${meal.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{meal.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[rgba(196,241,53,0.1)] text-[#C4F135] border border-[rgba(196,241,53,0.2)]">{meal.calories} kcal</span>
                          {meal.protein > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] text-gray-300 border border-[rgba(255,255,255,0.1)]">{meal.protein}g Pro</span>}
                          {meal.carbs > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] text-gray-300 border border-[rgba(255,255,255,0.1)]">{meal.carbs}g Carb</span>}
                          {meal.fat > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[rgba(255,255,255,0.05)] text-gray-300 border border-[rgba(255,255,255,0.1)]">{meal.fat}g Fat</span>}
                        </div>
                      </div>
                      <div className="p-4 bg-black/20 rounded-[14px] border border-white/[0.04]">
                        <p className="text-[14px] font-bold text-gray-300 leading-relaxed">
                          {meal.foods}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                currentDietDay && (
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[20px] text-center">
                    <p className="text-gray-400 text-sm">No meals assigned for this day.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ─── ADD WORKOUT DAY MODAL (Free Users Only) ─── */}
      {isFree && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Create Workout Day ${newDayNum}`}>
          <form onSubmit={handleSaveDay} className="space-y-4">
            <div className="bg-[rgba(196,241,53,0.1)] border border-[rgba(196,241,53,0.2)] text-[#C4F135] p-3 rounded-xl text-xs font-bold flex gap-2">
              <Info size={16} className="shrink-0" />
              <p>Preview Mode: New workout days are currently saved locally. They will reset on page refresh until the backend API is connected.</p>
            </div>
            
            {/* Workout Details */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Workout Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Chest & Triceps"
                  value={newDayTitle}
                  onChange={e => setNewDayTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Default Rest Interval</label>
                <input 
                  type="text" 
                  placeholder="e.g. 60-90s"
                  value={newDayRest}
                  onChange={e => setNewDayRest(e.target.value)}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Added Exercises List */}
            {newExercises.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto bg-black/40 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Added Exercises</p>
                {newExercises.map((e, idx) => (
                  <div key={e.id} className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10 text-xs">
                    <div>
                      <span className="font-bold text-white">{idx+1}. {e.name}</span>
                      <span className="text-gray-500 ml-2">({e.sets}x{e.reps})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setNewExercises(prev => prev.filter(item => item.id !== e.id))}
                      className="text-red-400 hover:text-red-500 font-bold px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Exercise form subset */}
            <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 space-y-3">
              <p className="text-[11px] font-bold text-[#C4F135] uppercase tracking-wider">Add Exercise</p>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Exercise name (e.g. Push Ups)"
                  value={exName}
                  onChange={e => setExName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Sets</label>
                  <input 
                    type="number" 
                    value={exSets}
                    onChange={e => setExSets(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reps</label>
                  <input 
                    type="text" 
                    value={exReps}
                    onChange={e => setExReps(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Rest</label>
                  <input 
                    type="text" 
                    value={exRest}
                    onChange={e => setExRest(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                  />
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Form focus notes (e.g. Keep elbows tucked)"
                  value={exFocus}
                  onChange={e => setExFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-black/40 text-white focus:outline-none focus:border-[#C4F135] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleAddExerciseToTempList}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-[13px] font-bold transition-all active:scale-95"
              >
                + Add Exercise to List
              </button>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setModalOpen(false)} 
                className="px-5 py-2.5 text-gray-400 hover:text-white rounded-full text-[13px] font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!newDayTitle.trim()}
                className="px-6 py-2.5 bg-[#C4F135] hover:bg-[#a3d625] disabled:opacity-50 text-[#0a0a0b] rounded-full text-[13px] font-black transition-all shadow-[0_4px_16px_rgba(196,241,53,0.3)] cursor-pointer"
              >
                Save Workout Day
              </button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  )
}
