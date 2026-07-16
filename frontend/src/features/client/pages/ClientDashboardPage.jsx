import { useState, useEffect, useRef } from 'react'
import { Calendar as CalendarIcon, Check, Sparkles, ArrowRight, Salad, Target, UserCheck, Dumbbell, Flame, TrendingUp, MessageSquare, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import { getDailyLog } from '../services/nutrition.service'
import API from '../../../shared/utils/api'
import { calculateDynamicTargets } from '../../../shared/utils/nutritionCalculator'

// ─── Animated stat counter ─────────────────────────────────────────────
function AnimatedStat({ target, duration = 900, delay = 0 }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(null)

  
  useEffect(() => {
    const t = setTimeout(() => {
      if (target === 0) { setCurrent(0); return }
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(target * eased))
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current) }
  }, [target, duration, delay])
  
  return <>{current}</>
}

// ─── Animated Circle Ring ─────────────────────────────────────────────
function AnimatedRing({ percent, size = 64, strokeWidth = 5 }) {
  const [currentPercent, setCurrentPercent] = useState(0)
  
  useEffect(() => {
    const t = setTimeout(() => setCurrentPercent(percent), 300)
    return () => clearTimeout(t)
  }, [percent])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (currentPercent / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 rotate-[-90deg]" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(196,241,53,0.1)" strokeWidth={strokeWidth} />
        <circle 
          cx={size / 2} cy={size / 2} r={radius} 
          fill="none" stroke="#C4F135" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} 
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <span className="text-[13px] font-black" style={{ color: '#C4F135' }}>
        <AnimatedStat target={percent} duration={1200} delay={300} />%
      </span>
    </div>
  )
}

export default function ClientDashboardPage() {
  const { user, subscriptionTier } = useAuth()

  // Real Nutrition & Streak States
  const [todaysNutrition, setTodaysNutrition] = useState({
    calories: 0, protein: 0, carbs: 0, fat: 0, 
    targetCalories: 2500, targetProtein: 150, targetCarbs: 250, targetFat: 70
  })
  const [streakDays, setStreakDays] = useState(0)
  const [nextSession, setNextSession] = useState(null)

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
  const [workoutId, setWorkoutId] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA')
        
        const [workoutRes, nutritionRes] = await Promise.all([
          fetch(`${API}/workouts/today`, { credentials: 'include' }).then(res => res.json()),
          getDailyLog(todayStr)
        ])

        if (workoutRes.success && workoutRes.data) {
          setTodaysWorkout(workoutRes.data.exercises)
          setWorkoutTitle(workoutRes.data.title)
          setWorkoutId(workoutRes.data._id)
        }

        let baseCals = 0, basePro = 0, baseCrb = 0, baseFat = 0
        
        // Use dynamically calculated targets based on user goals (e.g. Muscle Build)
        let dynamicTargets = calculateDynamicTargets(user)

        // OVERRIDE: If the Trainer explicitly set a Nutrition Goal for this plan, use it!
        if (workoutRes.success && workoutRes.plan && workoutRes.plan.nutritionTargets) {
          const pt = workoutRes.plan.nutritionTargets
          if (pt.calories) dynamicTargets.targetCalories = pt.calories
          if (pt.protein) dynamicTargets.targetProtein = pt.protein
          if (pt.carbs) dynamicTargets.targetCarbs = pt.carbs
          if (pt.fat) dynamicTargets.targetFat = pt.fat
        }

        let targetCals = dynamicTargets.targetCalories
        let targetPro = dynamicTargets.targetProtein
        let targetCrb = dynamicTargets.targetCarbs
        let targetFat = dynamicTargets.targetFat

        if (nutritionRes.success && nutritionRes.log) {
          const meals = nutritionRes.log.meals || []
          baseCals = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + (item.calories || 0), 0), 0)
          basePro = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + (item.protein || 0), 0), 0)
          baseCrb = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + (item.carbs || 0), 0), 0)
          baseFat = meals.reduce((sum, m) => sum + m.items.reduce((s, item) => s + (item.fat || 0), 0), 0)
          
        }

        // Add macros from completed Trainer-assigned meals
        if (workoutRes.success && workoutRes.diet && workoutRes.diet.meals) {
          workoutRes.diet.meals.forEach(m => {
            if (m.isCompleted) {
              baseCals += m.calories || 0
              basePro += m.protein || 0
              baseCrb += m.carbs || 0
              baseFat += m.fat || 0
            }
          })
        }


        // Add this below the existing fetch calls inside fetchDashboardData:
try {
  const bookingsRes = await fetch(`${API}/schedule/bookings/my`, { credentials: 'include' })
  const bookingsData = await bookingsRes.json()
  
  if (bookingsData.success && bookingsData.data.length > 0) {
    // Filter for accepted bookings that are in the future
    const now = new Date()
    const upcoming = bookingsData.data
      .filter(b => b.status === 'accepted' && new Date(b.slotId.startTime) > now)
      .sort((a, b) => new Date(a.slotId.startTime) - new Date(b.slotId.startTime))
      
    if (upcoming.length > 0) {
      setNextSession(upcoming[0])
    }
  }
} catch (err) {
  console.error("Failed to fetch bookings:", err)
}


        setTodaysNutrition({
          calories: baseCals,
          protein: basePro,
          carbs: baseCrb,
          fat: baseFat,
          targetCalories: targetCals,
          targetProtein: targetPro,
          targetCarbs: targetCrb,
          targetFat: targetFat
        })

      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      }
    }
    fetchDashboardData()

    if (user?.createdAt) {
      const joinDate = new Date(user.createdAt)
      const today = new Date()
      const diffTime = Math.abs(today - joinDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setStreakDays(diffDays)
    }
  }, [user])

  const completedCount = todaysWorkout.filter(ex => ex.isCompleted).length
  const totalCount = todaysWorkout.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  
  const toggleExercise = async (exerciseId) => {
    if (!workoutId) return;

    try {
      const res = await fetch(`${API}/workouts/toggle-exercise`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ exerciseId, workoutId })
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
    weekday: 'long', month: 'long', day: 'numeric'
  })

  // Shared Styles
  const actionBtn = "group flex flex-col items-center justify-center gap-2.5 p-4 h-28 rounded-[20px] transition-all duration-300 hover:-translate-y-1"
  const actionBtnBg = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  }
  const actionIconBg = {
    background: 'rgba(196,241,53,0.08)',
    border: '1px solid rgba(196,241,53,0.15)'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 relative z-10 pt-4 md:pt-6 pb-20">
      
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.03) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <div className="dashboard-card-1 relative z-10">
        <h1 className="text-3xl md:text-[34px] font-black text-white tracking-tight font-['Syne']">{greeting}, {firstName}!</h1>
        <p className="text-gray-500 font-medium text-[15px] mt-1">{today} — Let's crush it today.</p>
      </div>

      {isFree ? (
        // ── FREE USER VIEW ──
        <div className="space-y-6 md:space-y-8 relative z-10">
          <div className="dashboard-card-2 p-6 md:p-10 rounded-[24px] relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, rgba(196,241,53,0.08) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(196,241,53,0.2)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" style={{ background: 'rgba(196,241,53,0.15)' }} />
            <div className="relative z-10 max-w-lg">
              <h2 className="text-2xl md:text-[28px] font-black text-white font-['Syne'] mb-3">Welcome to FitForge</h2>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
                Your personal fitness journey starts here. Explore powerful tools designed to get you moving.
              </p>
              <Link to="/plans" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-black text-[13px] transition-all duration-200 active:scale-95 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(196,241,53,0.3)]"
                style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b' }}>
                Unlock Premium Coaching <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="dashboard-card-3">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/free-diet-plan" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                  <Salad size={20} style={{ color: '#C4F135' }} />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-[13px] text-white">Diet Plan</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">Free nutrition strategy</p>
                </div>
              </Link>

              <Link to="/dashboard/profile" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                  <Target size={20} style={{ color: '#C4F135' }} />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-[13px] text-white">Set Goal</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">Update body metrics</p>
                </div>
              </Link>

              <Link to="/trainers" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                  <UserCheck size={20} style={{ color: '#C4F135' }} />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-[13px] text-white">Find Coach</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">Browse top trainers</p>
                </div>
              </Link>

              <Link to="/transform-preview" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                  <Sparkles size={20} style={{ color: '#C4F135' }} />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-[13px] text-white">AI Preview</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">See future physique</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // ── PREMIUM USER VIEW ──
        <div className="space-y-6 md:space-y-8 relative z-10">
          
          {/* Quick Actions Grid */}
          <div className="dashboard-card-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard/plans" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                <Dumbbell size={20} style={{ color: '#C4F135' }} />
              </div>
              <span className="text-[13px] font-black text-white">Start Workout</span>
            </Link>
            <Link to="/dashboard/food-ai" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                <Salad size={20} style={{ color: '#C4F135' }} />
              </div>
              <span className="text-[13px] font-black text-white">Log Meal (AI)</span>
            </Link>
            <Link 
              to={user?.assignedTrainer ? `/dashboard/chat/${user.assignedTrainer._id || user.assignedTrainer}` : '/dashboard/chat'} 
              className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                <MessageSquare size={20} style={{ color: '#C4F135' }} />
              </div>
              <span className="text-[13px] font-black text-white">Message Coach</span>
            </Link>
            <Link to="/dashboard/progress" className={actionBtn} style={actionBtnBg} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,241,53,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(196,241,53,0.15)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95" style={actionIconBg}>
                <TrendingUp size={20} style={{ color: '#C4F135' }} />
              </div>
              <span className="text-[13px] font-black text-white">Log Weight</span>
            </Link>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Today's Workout */}
            <div className="dashboard-card-3 lg:col-span-2 flex flex-col relative overflow-hidden rounded-[24px] p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(196,241,53,0.05)' }} />
              
              <div className="flex flex-col mb-6 relative z-10 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-[22px] font-black text-white font-['Syne']">{workoutTitle}</h2>
                  {workoutTitle !== 'Rest Day' && (
                    <span className="self-start sm:self-auto px-3 py-1.5 text-[11px] font-bold rounded-full uppercase tracking-wider"
                      style={{ background: 'rgba(196,241,53,0.1)', color: '#C4F135', border: '1px solid rgba(196,241,53,0.2)' }}>
                      Today's Plan
                    </span>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #a3d625, #C4F135)' }} />
                  </div>
                  <span className="text-[13px] font-black" style={{ color: '#C4F135' }}>{progressPercent}%</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-2 flex-1 relative z-10">
                {todaysWorkout.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-70">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <Check size={24} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">No exercises for today! Take a well-earned rest.</p>
                  </div>
                ) : (
                  todaysWorkout.map((ex) => (
                    <div key={ex._id} onClick={() => toggleExercise(ex._id)} 
                      className="group flex items-center justify-between p-4 rounded-[16px] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{
                        background: ex.isCompleted ? 'rgba(196,241,53,0.04)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${ex.isCompleted ? 'rgba(196,241,53,0.15)' : 'rgba(255,255,255,0.06)'}`
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Custom Checkbox */}
                        <div className="w-6 h-6 rounded-[8px] flex items-center justify-center transition-all duration-300 shrink-0"
                          style={{
                            background: ex.isCompleted ? '#C4F135' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${ex.isCompleted ? '#C4F135' : 'rgba(255,255,255,0.15)'}`
                          }}
                        >
                          {ex.isCompleted && <Check size={14} strokeWidth={4} color="#0a0a0b" className="animate-in zoom-in duration-200" />}
                        </div>
                        <span className={`text-[15px] font-bold transition-all duration-300 ${ex.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {ex.name}
                        </span>
                      </div>
                      <span className={`text-[13px] font-bold transition-all duration-300 shrink-0 ${ex.isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                        {ex.sets}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Macros & Streaks */}
            <div className="space-y-6 flex flex-col">
              
              {/* Nutrition Summary */}
              <div className="dashboard-card-4 flex-1 flex flex-col justify-center rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[32px] font-black text-white font-['Syne'] leading-tight flex items-baseline gap-1">
                      <AnimatedStat target={todaysNutrition.calories} duration={1200} />
                      <span className="text-[20px] text-gray-500 font-bold">/ {todaysNutrition.targetCalories}</span>
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#C4F135' }}>kcal eaten</p>
                  </div>
                  <AnimatedRing percent={Math.min(Math.round((todaysNutrition.calories / todaysNutrition.targetCalories) * 100) || 0, 100)} size={64} strokeWidth={5} />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pro', val: todaysNutrition.protein, target: todaysNutrition.targetProtein, delay: '0.1s' },
                    { label: 'Carb', val: todaysNutrition.carbs, target: todaysNutrition.targetCarbs, delay: '0.2s' },
                    { label: 'Fat', val: todaysNutrition.fat, target: todaysNutrition.targetFat, delay: '0.3s' },
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col items-center p-3 rounded-[14px] animate-in slide-in-from-bottom-2 fade-in duration-500 fill-mode-both"
                      style={{ animationDelay: m.delay, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-[15px] font-black text-white flex items-baseline">
                        <AnimatedStat target={m.val} duration={1000} />
                        <span className="text-[11px] text-gray-500 font-bold ml-1">/ {m.target}</span><span className="text-[11px] text-gray-500 ml-0.5">g</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{m.label}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/dashboard/nutrition" className="mt-5 text-[12px] font-bold flex items-center gap-1.5 transition-all duration-200 group w-max" style={{ color: '#C4F135' }}>
                  Log today's meals <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Streak */}
              <div className="dashboard-card-4 rounded-[24px] p-6 relative overflow-hidden flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, rgba(196,241,53,0.08) 0%, rgba(196,241,53,0.02) 100%)', border: '1px solid rgba(196,241,53,0.2)' }}>
                <div className="absolute right-0 top-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.15) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
                
                <div className="relative z-10">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4F135' }}>Current Streak</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[36px] font-black text-white font-['Syne'] leading-none">
                      <AnimatedStat target={streakDays} duration={1200} delay={200} />
                    </span>
                    <span className="text-gray-400 text-[13px] font-bold">days</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium">active on FitForge</p>
                </div>
                
                <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center glow-pulse shrink-0" style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.3)' }}>
                  <Flame size={28} style={{ color: '#C4F135' }} />
                </div>
              </div>
            </div>

          </div>

                   {/* Upcoming Session */}
          {nextSession ? (
            <div className="dashboard-card-5 rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              
              <div className="absolute left-[-20px] bottom-[-20px] w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(196,241,53,0.05)' }} />
              
              <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                  <CalendarIcon size={22} style={{ color: '#C4F135' }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#C4F135' }}>Next Session</p>
                  <h3 className="text-[18px] font-black text-white leading-tight font-['Syne']">
                    Video Session with Coach
                  </h3>
                  <p className="text-[13px] text-gray-400 mt-1">
                    {new Date(nextSession.slotId.startTime).toLocaleDateString()} at {new Date(nextSession.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <Link to={`/dashboard/video/${nextSession.slotId._id}`} className="w-full md:w-auto px-8 py-4 rounded-full font-black text-[13px] transition-all duration-200 text-center active:scale-95 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(196,241,53,0.3)] glow-pulse"
                style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b' }}>
                Join Session
              </Link>
            </div>
          ) : (
            <div className="dashboard-card-5 rounded-[24px] p-6 text-center opacity-70"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-gray-400 text-[14px]">No upcoming sessions scheduled.</p>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
