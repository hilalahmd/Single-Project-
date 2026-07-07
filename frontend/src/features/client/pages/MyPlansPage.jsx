import { useState, useEffect } from 'react'
import { ChevronDown, Info, Plus, Trash2, CheckCircle2, Circle, Lock } from 'lucide-react'
import Badge from '../../../shared/components/Badge'
import Modal from '../../../shared/components/Modal'
import { useAuth } from '../../../shared/context/AuthContext'

export default function MyPlansPage() {
  const { subscriptionTier } = useAuth()
  const [activeTab, setActiveTab] = useState('workout')
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDietDay, setActiveDietDay] = useState('Mon')
  const [expandedDay, setExpandedDay] = useState(1)

  // ─── Workouts State ───
  const [workouts, setWorkouts] = useState([
    { 
      day: 1, 
      title: 'Push Day', 
      rest: '60-90s',
      exs: [
        { id: 1, name: 'Bench Press', focus: 'Focus on slow eccentric.', sets: 4, reps: '8-10', rest: '90s', completed: false },
        { id: 2, name: 'Overhead Press', focus: 'Keep core tight, press vertical.', sets: 3, reps: '8-10', rest: '90s', completed: false },
        { id: 3, name: 'Incline Dumbbell Press', focus: '30 degree incline.', sets: 3, reps: '10-12', rest: '60s', completed: false },
        { id: 4, name: 'Triceps Pushdown', focus: 'Squeeze at bottom.', sets: 4, reps: '12-15', rest: '60s', completed: false }
      ] 
    },
    { 
      day: 2, 
      title: 'Pull Day', 
      rest: '60-90s',
      exs: [
        { id: 5, name: 'Lat Pulldown', focus: 'Pull with elbows.', sets: 4, reps: '10-12', rest: '90s', completed: false },
        { id: 6, name: 'Barbell Row', focus: 'Hinge hips, pull to navel.', sets: 3, reps: '8-10', rest: '90s', completed: false },
        { id: 7, name: 'Face Pulls', focus: 'Hold squeeze for 1s.', sets: 4, reps: '15', rest: '60s', completed: false }
      ] 
    },
    { 
      day: 3, 
      title: 'Rest Day', 
      rest: '-',
      exs: [] 
    }
  ])

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

  const toggleExerciseCompletion = (dayNum, exId) => {
    setWorkouts(prev => prev.map(w => {
      if (w.day !== dayNum) return w
      return {
        ...w,
        exs: w.exs.map(ex => {
          if (ex.id !== exId) return ex
          return { ...ex, completed: !ex.completed }
        })
      }
    }))
  }

  const getDayProgress = (workoutDay) => {
    if (!workoutDay.exs || workoutDay.exs.length === 0) return null
    const completedCount = workoutDay.exs.filter(e => e.completed).length
    const totalCount = workoutDay.exs.length
    const percent = Math.round((completedCount / totalCount) * 100)
    return { completedCount, totalCount, percent }
  }

  const isFree = subscriptionTier === 'free'
  const dietDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Determine coach assign label
  const coachLabel = subscriptionTier === 'personal_training'
    ? 'Assigned by Coach Arjun Menon' 
    : (subscriptionTier === 'wellness' ? 'Assigned by Coach Priya Nair' : 'Self-Assigned Program')

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">My Plans</h1>
          <p className="text-gray-400 mt-1">Your personalized routine for this month.</p>
        </div>
        
        {/* Free users can manually add a workout day */}
        {isFree && (
          <button 
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add Workout Day
          </button>
        )}
      </div>

      {/* Gated Plan Headers / Warning banners */}
      <div className="bg-[#F97316]/10 border border-[#F97316]/30 rounded-[16px] p-4 flex items-center justify-between gap-3 text-sm font-bold text-[#F97316]">
        <div className="flex items-center gap-3">
          <Info size={18} className="shrink-0" />
          <p>
            {isFree 
              ? 'Free Plan Mode — You are customizing your own workout list. Upgrade to Wellness or PT to have a dedicated trainer assign routines directly.'
              : `${coachLabel} — Your custom training and nutrition programs are active and synced.`
            }
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-white/10 flex gap-8">
        {['workout', 'diet'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-all duration-300 ease-out relative ${
              activeTab === tab ? 'text-[#F97316]' : 'text-gray-400 hover:text-[#F97316]'
            }`}
          >
            {tab} Plan
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F97316] rounded-t-full shadow-[0_0_8px_#F97316] animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* ─── WORKOUT PLAN TAB ─── */}
      {activeTab === 'workout' && (
        <div className="space-y-6">
          {/* Week Selector */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(w => (
              <button 
                key={w}
                onClick={() => setActiveWeek(w)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ease-out shadow-sm ${
                  activeWeek === w ? 'bg-[#F97316]/20 backdrop-blur-md border border-[#F97316]/50 text-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105' : 'bg-white/[0.04] backdrop-blur-md text-gray-400 border border-white/[0.05] hover:border-[#F97316]/50 hover:text-[#F97316]'
                }`}
              >
                Week {w}
              </button>
            ))}
          </div>

          {/* Progressive overload Suggestion banner */}
          <div className="bg-[#F97316]/10 border border-[#F97316]/30 rounded-[16px] p-4 flex gap-3 text-sm font-bold text-[#F97316] items-start shadow-sm">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p>Progressive Overload Target: Try to complete at least 1 more rep or increase load by 2.5kg on final sets this week.</p>
          </div>

          {/* Workout Days List */}
          {activeWeek === 1 ? (
            <div className="space-y-4">
              {workouts.map((wDay) => {
                const progress = getDayProgress(wDay)
                const hasExs = wDay.exs && wDay.exs.length > 0

                return (
                  <div key={wDay.day} className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[16px] overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
                  <div className="w-full flex flex-col sm:flex-row items-stretch justify-between p-6 hover:bg-white/[0.02] transition-colors">
                    
                    {/* Day description */}
                    <button 
                      onClick={() => setExpandedDay(expandedDay === wDay.day ? null : wDay.day)}
                      className="flex-1 flex items-center gap-4 sm:gap-8 text-left focus:outline-none"
                    >
                      <div className="w-12 text-center shrink-0">
                        <p className="text-xs text-gray-400 uppercase font-bold">Day</p>
                        <p className="text-xl font-black text-white">{wDay.day}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-lg text-white">{wDay.title}</p>
                          <span className="text-[10px] text-gray-500 font-bold border border-white/10 px-2 py-0.5 rounded-full bg-white/5 uppercase tracking-wider">{wDay.rest} rest</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-sm text-gray-400 font-medium">
                          <span>Exercises: {wDay.exs.length}</span>
                          {progress && (
                            <span className="text-[#22C55E] font-bold">{progress.completedCount} of {progress.totalCount} Done ({progress.percent}%)</span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Progress Bar & Actions */}
                    <div className="flex items-center gap-4 justify-between sm:justify-end mt-4 sm:mt-0 shrink-0">
                      {progress && (
                        <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden hidden md:block">
                          <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress.percent}%` }} />
                        </div>
                      )}
                      
                      {/* Delete option for manual workouts on Free tier */}
                      {isFree && (
                        <button
                          onClick={() => handleDeleteDay(wDay.day)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Workout Day"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setExpandedDay(expandedDay === wDay.day ? null : wDay.day)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none"
                      >
                        <ChevronDown size={20} className={`transform transition-transform duration-200 ${expandedDay === wDay.day ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Exercises */}
                  {expandedDay === wDay.day && hasExs && (
                    <div className="px-6 pb-6 border-t border-white/[0.05] pt-6 bg-transparent">
                      <div className="space-y-3">
                        {wDay.exs.map((ex) => (
                          <div 
                            key={ex.id} 
                            onClick={() => toggleExerciseCompletion(wDay.day, ex.id)}
                            className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 shadow-sm cursor-pointer ${
                              ex.completed 
                                ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/30 opacity-60' 
                                : 'bg-[#111318]/50 border-white/[0.04] hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Completing Tick System */}
                              {ex.completed ? (
                                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                              ) : (
                                <Circle className="text-gray-600 hover:text-gray-400 shrink-0" size={20} />
                              )}
                              
                              <div>
                                <p className={`font-bold ${ex.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{ex.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">{ex.focus}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 sm:gap-4 text-xs font-bold shrink-0">
                              <span className="bg-white/5 text-gray-300 border border-white/10 px-2.5 py-1 rounded-md">{ex.sets} Sets</span>
                              <span className="bg-white/5 text-gray-300 border border-white/10 px-2.5 py-1 rounded-md">{ex.reps} Reps</span>
                              <span className="bg-white/5 text-gray-400 px-2.5 py-1 rounded-md">{ex.rest} Rest</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {expandedDay === wDay.day && !hasExs && (
                    <div className="px-6 pb-6 border-t border-white/10 pt-4 bg-transparent text-gray-400 text-sm font-medium">
                      Rest day. Complete recovery. Optional stretching or walking.
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white/[0.02] border border-white/5 rounded-[24px]">
              <Lock size={40} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Week {activeWeek} Locked</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                Complete Week {activeWeek - 1} to unlock this week's progressive overload routine.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── DIET PLAN TAB ─── */}
      {activeTab === 'diet' && (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="flex flex-wrap gap-2">
            {dietDays.map(day => (
              <button 
                key={day}
                onClick={() => setActiveDietDay(day)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ease-out shadow-sm ${
                  activeDietDay === day ? 'bg-[#F97316]/20 backdrop-blur-md border border-[#F97316]/50 text-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105' : 'bg-white/[0.04] backdrop-blur-md text-gray-400 border border-white/[0.05] hover:border-[#F97316]/50 hover:text-[#F97316]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Daily Target calories summary */}
          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[16px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">Daily Target</p>
              <p className="text-3xl font-black text-white">2,200 <span className="text-sm font-bold text-gray-500">kcal</span></p>
            </div>
            <div className="flex gap-6 sm:gap-12">
              <div><p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Protein</p><p className="font-black text-xl text-white">160g</p></div>
              <div><p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Carbs</p><p className="font-black text-xl text-white">220g</p></div>
              <div><p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">Fat</p><p className="font-black text-xl text-white">75g</p></div>
            </div>
          </div>

          {/* Meals list */}
          <div className="space-y-4">
            {[
              { name: 'Breakfast', time: '08:00 AM', items: 'Oats, Protein Powder, Peanut Butter, Banana', cal: 450, p: 35, c: 50, f: 12 },
              { name: 'Lunch', time: '01:00 PM', items: 'Chicken Breast, Brown Rice, Broccoli', cal: 650, p: 55, c: 80, f: 10 },
              { name: 'Snack', time: '04:30 PM', items: 'Greek Yogurt, Almonds', cal: 300, p: 20, c: 15, f: 18 },
              { name: 'Dinner', time: '08:00 PM', items: 'Salmon, Sweet Potato, Asparagus', cal: 500, p: 40, c: 45, f: 20 },
            ].map((meal, i) => (
              <div key={i} className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[16px] p-6 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{meal.name}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-0.5">{meal.time}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">{meal.cal} kcal</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-white/10 text-gray-300 border border-white/20">{meal.p}g P</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-white/10 text-gray-300 border border-white/20">{meal.c}g C</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-[800] tracking-[0.15em] uppercase bg-white/10 text-gray-300 border border-white/20">{meal.f}g F</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm font-bold text-gray-300 leading-relaxed">{meal.items}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ADD WORKOUT DAY MODAL (Free Users Only) ─── */}
      {isFree && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Create Workout Day ${newDayNum}`}>
          <form onSubmit={handleSaveDay} className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-3 rounded-xl text-xs font-bold flex gap-2">
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
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
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
                  className="w-full px-4 py-3 border border-white/10 rounded-lg text-[14px] bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
                  required
                />
              </div>
            </div>

            {/* Added Exercises List */}
            {newExercises.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-900/50 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Added Exercises</p>
                {newExercises.map((e, idx) => (
                  <div key={e.id} className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/10 text-xs">
                    <div>
                      <span className="font-bold text-white">{idx+1}. {e.name}</span>
                      <span className="text-gray-500 ml-2">({e.sets}x{e.reps})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setNewExercises(prev => prev.filter(item => item.id !== e.id))}
                      className="text-red-400 hover:text-red-500 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Exercise form subset */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
              <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Add Exercise</p>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Exercise name (e.g. Push Ups)"
                  value={exName}
                  onChange={e => setExName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Sets</label>
                  <input 
                    type="number" 
                    value={exSets}
                    onChange={e => setExSets(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-white/10 rounded-lg bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Reps</label>
                  <input 
                    type="text" 
                    value={exReps}
                    onChange={e => setExReps(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-white/10 rounded-lg bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Rest</label>
                  <input 
                    type="text" 
                    value={exRest}
                    onChange={e => setExRest(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-white/10 rounded-lg bg-slate-900 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Form focus notes (e.g. Keep elbows tucked)"
                  value={exFocus}
                  onChange={e => setExFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-slate-900 text-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddExerciseToTempList}
                className="w-full py-2 bg-white/10 hover:bg-[#F97316] hover:text-white text-gray-300 rounded-lg text-xs font-bold transition-all"
              >
                + Add Exercise to List
              </button>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setModalOpen(false)} 
                className="px-5 py-2.5 border border-white/10 text-white hover:bg-white/10 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!newDayTitle.trim()}
                className="px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] cursor-pointer"
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
