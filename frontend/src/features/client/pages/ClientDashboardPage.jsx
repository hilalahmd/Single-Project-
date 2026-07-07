import { useState, useEffect } from 'react' // useEffect puthiyathayi add cheythu
import { Calendar as CalendarIcon, Check, Sparkles, ArrowRight, Salad, Target, UserCheck, Dumbbell, Flame, TrendingUp, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api' // Backend URL edukkan vendi puthiyathayi add cheythu


export default function ClientDashboardPage() {
  const { user, subscriptionTier } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 22) return 'Good evening'
    return 'Good night'
  }

  const greeting = getGreeting()
  const firstName = user?.name ? user.name.split(' ')[0] : 'User'
  const isFree = subscriptionTier === 'free'
  
  const [todaysWorkout, setTodaysWorkout] = useState([]) 
  const [workoutTitle, setWorkoutTitle] = useState('Rest Day') 
  const [workoutId, setWorkoutId] = useState(null) // Added to store workout ID

  useEffect(() => {
    const fetchTodayWorkout = async () => {
      try {
        const res = await fetch(`${API}/workouts/today`, {
          credentials: 'include' 
        })
        const data = await res.json()

        if (data.success && data.data) { // Backend returns data.data, not data.workout!
          setTodaysWorkout(data.data.exercises)
          setWorkoutTitle(data.data.title)
          setWorkoutId(data.data._id)
        }
      } catch (error) {
        console.error("Failed to load workout:", error)
      }
    }
    fetchTodayWorkout()
  }, []) 

  const completedCount = todaysWorkout.filter(ex => ex.isCompleted).length
  const totalCount = todaysWorkout.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  
  const toggleExercise = async (exerciseId) => {
    if (!workoutId) return; // Prevent calling if no workout loaded

    try {
      const res = await fetch(`${API}/workouts/toggle-exercise`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ exerciseId, workoutId }) // Need to send workoutId too
      })
      const data = await res.json()

      if (data.success) {
        setTodaysWorkout(prev => prev.map(ex => 
          ex._id === exerciseId ? { ...ex, isCompleted: !ex.isCompleted } : ex 
        ))
      }
    } catch (error) {
      console.error("Toggle failed:", error)
    }
  }


  
  const today = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  // Medium-Large Premium Card CSS
  const glassCard = "bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl md:rounded-[24px] p-6 md:p-8 transition-all hover:bg-white/[0.08]"
  
  // Quick Action Btn (Height ~ 96px)
  const actionBtn = "flex flex-col items-center justify-center gap-2 p-4 h-24 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:bg-white/[0.1] transition-all duration-250 ease-out text-white group"

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-7 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4 md:pt-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight font-['Syne']">{greeting}, {firstName}!</h1>
        <p className="text-gray-400 font-medium text-sm mt-1">{today} — Let's crush it today.</p>
      </div>

      {isFree ? (
        // ── FREE USER VIEW ──
        <div className="space-y-6 md:space-y-7">
          <div className="p-6 md:p-8 rounded-[24px] bg-gradient-to-br from-[#F97316]/10 to-transparent border border-[#F97316]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10 max-w-lg">
              <h2 className="text-2xl font-black text-white font-['Syne'] mb-2">Welcome to FitForge</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">Your personal fitness journey starts here. Explore powerful tools designed to get you moving.</p>
              <Link to="/plans" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-full text-sm transition-colors shadow-md shadow-[#F97316]/10">
                Unlock Premium Coaching <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-['Syne']">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <Link to="/free-diet-plan" className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:bg-white/[0.1] hover:border-[#10b981]/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-250 ease-out">
                <div className="w-10 h-10 rounded-full bg-[#10b981]/15 backdrop-blur-md border border-[#10b981]/20 flex items-center justify-center shrink-0">
                  <Salad size={18} className="text-[#10b981]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#10b981] transition-colors">Diet Plan</h4>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Free nutrition strategy</p>
                </div>
              </Link>

              <Link to="/dashboard/profile" className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:bg-white/[0.1] hover:border-[#3b82f6]/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-250 ease-out">
                <div className="w-10 h-10 rounded-full bg-[#3b82f6]/15 backdrop-blur-md border border-[#3b82f6]/20 flex items-center justify-center shrink-0">
                  <Target size={18} className="text-[#3b82f6]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#3b82f6] transition-colors">Set Goal</h4>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Update body metrics</p>
                </div>
              </Link>

              <Link to="/trainers" className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:bg-white/[0.1] hover:border-[#a855f7]/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-250 ease-out">
                <div className="w-10 h-10 rounded-full bg-[#a855f7]/15 backdrop-blur-md border border-[#a855f7]/20 flex items-center justify-center shrink-0">
                  <UserCheck size={18} className="text-[#a855f7]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#a855f7] transition-colors">Find Coach</h4>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Browse top trainers</p>
                </div>
              </Link>

              <Link to="/transform-preview" className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:bg-white/[0.1] hover:border-[#F97316]/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-250 ease-out">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/15 backdrop-blur-md border border-[#F97316]/20 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#F97316] transition-colors">AI Preview</h4>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">See future physique</p>
                </div>
              </Link>

            </div>
          </div>
        </div>
      ) : (
        // ── PREMIUM USER VIEW ──
        <div className="space-y-6 md:space-y-7">
          
          {/* Quick Actions Grid (Medium Height) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard/plans" className={`${actionBtn} hover:border-[#3b82f6]/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]`}>
              <div className="w-10 h-10 rounded-full bg-[#3b82f6]/15 backdrop-blur-md border border-[#3b82f6]/20 flex items-center justify-center group-hover:bg-[#3b82f6]/25 transition-colors">
                <Dumbbell size={18} className="text-[#3b82f6]" />
              </div>
              <span className="text-sm font-bold">Start Workout</span>
            </Link>
            <Link to="/dashboard/food-ai" className={`${actionBtn} hover:border-[#10b981]/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]`}>
              <div className="w-10 h-10 rounded-full bg-[#10b981]/15 backdrop-blur-md border border-[#10b981]/20 flex items-center justify-center group-hover:bg-[#10b981]/25 transition-colors">
                <Salad size={18} className="text-[#10b981]" />
              </div>
              <span className="text-sm font-bold">Log Meal (AI)</span>
            </Link>
            <Link 
              to={user?.assignedTrainer ? `/dashboard/chat/${user.assignedTrainer._id || user.assignedTrainer}` : '/dashboard/chat'} 
              className={`${actionBtn} hover:border-[#a855f7]/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]`}
            >
              <div className="w-10 h-10 rounded-full bg-[#a855f7]/15 backdrop-blur-md border border-[#a855f7]/20 flex items-center justify-center group-hover:bg-[#a855f7]/25 transition-colors">
                <MessageSquare size={18} className="text-[#a855f7]" />
              </div>
              <span className="text-sm font-bold">Message Coach</span>
            </Link>
            <Link to="/dashboard/progress" className={`${actionBtn} hover:border-[#F97316]/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]`}>
              <div className="w-10 h-10 rounded-full bg-[#F97316]/15 backdrop-blur-md border border-[#F97316]/20 flex items-center justify-center group-hover:bg-[#F97316]/25 transition-colors">
                <TrendingUp size={18} className="text-[#F97316]" />
              </div>
              <span className="text-sm font-bold">Log Weight</span>
            </Link>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Today's Workout */}
            <div className={`${glassCard} lg:col-span-2 flex flex-col relative overflow-hidden`}>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col mb-5 relative z-10 gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white font-['Syne']">Today's Workout</h2>
                  <span className="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-bold rounded-md uppercase tracking-wider border border-[#3b82f6]/20">
                    Upper Body
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3b82f6] transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{progressPercent}%</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-5 flex-1 relative z-10">
                {todaysWorkout.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No exercises for today! Take a rest.</p>
                ) : (
                  todaysWorkout.map((ex) => (
                    <div key={ex._id} onClick={() => toggleExercise(ex._id)} className={`flex items-center justify-between p-3.5 px-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      ex.isCompleted ? 'bg-[#3b82f6]/5 border-[#3b82f6]/20 opacity-50' : 'bg-[#111318]/50 border-white/[0.04] hover:bg-white/[0.04]'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                          ex.isCompleted ? 'bg-[#3b82f6] border-[#3b82f6] text-white scale-110' : 'border-white/20'
                        }`}>
                          {ex.isCompleted && <Check size={14} strokeWidth={4} />}
                        </div>
                        <span className={`text-[15px] font-bold transition-colors ${ex.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {ex.name}
                        </span>
                      </div>
                      <span className={`text-[13px] font-medium transition-colors ${ex.isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>{ex.sets}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Macros & Streaks */}
            <div className="space-y-6 flex flex-col">
              {/* Macros Summary */}
              <div className={`${glassCard} flex-1 flex flex-col justify-center`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white font-['Syne']">Nutrition</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">Sample</span>
                </div>
                <div className="flex items-center justify-between mb-5 opacity-60">
                  <div>
                    <p className="text-3xl font-bold text-white tracking-tight">1,360</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mt-1">kcal eaten</p>
                  </div>
                  <div className="w-14 h-14 rounded-full border-[4px] border-[#10b981]/80 flex items-center justify-center bg-[#10b981]/5">
                    <span className="text-xs font-bold text-[#10b981]">68%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 opacity-60">
                  <div className="bg-[#111318]/50 p-2.5 rounded-xl border border-white/[0.04] text-center">
                    <p className="text-[14px] font-bold text-white">98g</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Pro</p>
                  </div>
                  <div className="bg-[#111318]/50 p-2.5 rounded-xl border border-white/[0.04] text-center">
                    <p className="text-[14px] font-bold text-white">156g</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Carb</p>
                  </div>
                  <div className="bg-[#111318]/50 p-2.5 rounded-xl border border-white/[0.04] text-center">
                    <p className="text-[14px] font-bold text-white">42g</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Fat</p>
                  </div>
                </div>
                <Link to="/dashboard/nutrition" className="mt-4 text-[11px] font-bold text-[#10b981] hover:text-[#34d399] transition-colors flex items-center gap-1">
                  Log today's meals <span aria-hidden>→</span>
                </Link>
              </div>

              {/* Streak */}
              <div className="bg-gradient-to-r from-[#F97316]/90 to-[#ea580c] rounded-[24px] p-5 relative overflow-hidden shadow-sm shadow-[#F97316]/10 flex items-center justify-between">
                <Flame size={80} className="absolute right-[-15px] top-[5px] text-white/10 pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest mb-1">Current Streak</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-['Syne'] leading-none">7</span>
                    <span className="text-white/90 text-sm font-bold">days</span>
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">(demo — not tracked yet)</p>
                </div>
              </div>
            </div>

          </div>

          {/* Upcoming Session */}
          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] border-t-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute left-[-20px] bottom-[-20px] w-48 h-48 bg-[#a855f7]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#a855f7]/10 text-[#a855f7] flex items-center justify-center shrink-0 border border-[#a855f7]/20">
                <CalendarIcon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#a855f7] uppercase tracking-widest mb-1">Next Session</p>
                <h3 className="text-lg font-bold text-white leading-tight font-['Syne']">Strength with Alex Chen</h3>
                <p className="text-sm text-gray-400 mt-0.5">Today, 6:00 PM (60 min)</p>
              </div>
            </div>
            <Link to="/dashboard/coach" className="w-full md:w-auto px-6 py-3 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#a855f7] rounded-xl font-bold text-sm transition-colors text-center border border-[#a855f7]/20 relative z-10 whitespace-nowrap">
              Join Session
            </Link>
          </div>

        </div>
      )}

    </div>
  )
}
