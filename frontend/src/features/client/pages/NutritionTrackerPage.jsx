import { useState, useEffect, useRef } from 'react'
import { Plus, Utensils, ChevronLeft, ChevronRight, Loader2, Droplet, Edit2, CheckCircle2 } from 'lucide-react'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'
import { useAuth } from '../../../shared/context/AuthContext'
import { calculateDynamicTargets } from '../../../shared/utils/nutritionCalculator'
import { getDailyLog, addMealItem, updateWaterIntake, updateWaterGoal } from '../services/nutrition.service'
import API from '../../../shared/utils/api'

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(null)
  useEffect(() => {
    if (target === 0) { setCurrent(0); return }
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(target * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])
  return <>{current.toLocaleString()}</>
}

// ─── Macro Progress Bar ──────────────────────────────────────────────────────
function MacroBar({ label, current, target, gradientFrom, gradientTo, delay = 0 }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: gradientFrom }} />
          <span className="text-sm font-bold text-white">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-white">{current}g</span>
          <span className="text-xs text-gray-500">/ {target}g</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1"
            style={{ color: gradientFrom, background: `${gradientFrom}18` }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}
        role="progressbar" aria-valuenow={current} aria-valuemax={target} aria-label={`${label} progress`}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${pct}%` : '0%', background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`, boxShadow: `0 0 10px ${gradientFrom}50` }} />
      </div>
    </div>
  )
}

// ─── Macro Stat Pill ─────────────────────────────────────────────────────────
function MacroPill({ label, value, color, bg }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: bg, borderColor: `${color}25` }}>
      <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color }}>{label}</span>
      <span className="text-2xl font-black text-white leading-none">{value}</span>
      <span className="text-[10px] text-gray-500 mt-0.5 font-medium">g</span>
    </div>
  )
}

// ─── Water Section ───────────────────────────────────────────────────────────
function WaterSection({ dateString, initialIntake = 0, initialGoal = 3000 }) {
  const [intake, setIntake] = useState(initialIntake)
  const [goal, setGoal] = useState(initialGoal)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [tempGoal, setTempGoal] = useState(initialGoal)
  const [customAmount, setCustomAmount] = useState('')

  useEffect(() => {
    setIntake(initialIntake); setGoal(initialGoal); setTempGoal(initialGoal)
  }, [initialIntake, initialGoal])

  const percentage = goal > 0 ? Math.min((intake / goal) * 100, 100) : 0
  const goalReached = intake >= goal
  const fillY = 240 - (percentage / 100) * 240

  const addWater = async (amount) => {
    const newIntake = intake + amount
    setIntake(newIntake)
    try { if (dateString) await updateWaterIntake(dateString, newIntake) } catch (e) { console.error(e) }
  }

  const handleAddCustom = () => {
    const amount = parseInt(customAmount)
    if (!isNaN(amount) && amount > 0) { addWater(amount); setCustomAmount('') }
  }

  const saveGoal = async () => {
    const newGoal = parseInt(tempGoal)
    if (!isNaN(newGoal) && newGoal > 0) {
      setGoal(newGoal); setIsEditingGoal(false)
      try { if (dateString) await updateWaterGoal(dateString, newGoal) } catch (e) { console.error(e) }
    }
  }

  return (
    <div className="nutrition-card-3 relative rounded-[20px] overflow-hidden border transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0a1628 100%)', borderColor: 'rgba(59,130,246,0.15)', boxShadow: '0 0 40px rgba(59,130,246,0.05), 0 8px 32px rgba(0,0,0,0.4)' }}>
      {/* Wave background fill */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 100 240" className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
          <g style={{ transform: `translateY(${fillY}px)`, transition: 'transform 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <path d="M -20 8 Q 15 -6, 50 8 T 120 8 L 120 260 L -20 260 Z" fill="rgba(59,130,246,0.06)">
              <animate attributeName="d"
                values="M -20 8 Q 15 -6, 50 8 T 120 8 L 120 260 L -20 260 Z;M -20 8 Q 15 18, 50 8 T 120 8 L 120 260 L -20 260 Z;M -20 8 Q 15 -6, 50 8 T 120 8 L 120 260 L -20 260 Z"
                dur="5s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Droplet size={15} className="text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Hydration</span>
            </div>
            <h2 className="text-2xl font-black text-white font-['Syne'] tracking-tight">Water Intake</h2>
          </div>
          {goalReached ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.1)' }}>
              <CheckCircle2 size={11} /> Goal!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)', background: 'rgba(96,165,250,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block glow-pulse" />
              {Math.round(percentage)}%
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Water bottle viz */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative w-20 h-36" aria-label={`Water ${Math.round(percentage)}% of goal`}>
              <svg viewBox="0 0 60 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.3))' }}>
                <path d="M22 5 L22 12 Q10 16 10 28 L10 88 Q10 95 20 95 L40 95 Q50 95 50 88 L50 28 Q50 16 38 12 L38 5 Z"
                  fill="none" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" />
                <clipPath id="bottleClip">
                  <path d="M22 5 L22 12 Q10 16 10 28 L10 88 Q10 95 20 95 L40 95 Q50 95 50 88 L50 28 Q50 16 38 12 L38 5 Z" />
                </clipPath>
                <g clipPath="url(#bottleClip)" style={{ transform: `translateY(${100 - percentage}%)`, transition: 'transform 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
                  <rect x="0" y="0" width="60" height="110" fill="url(#wg)" />
                  <path className="wave-animate" d="M-10 5 Q10 0 30 5 T70 5 L70 0 L-10 0 Z" fill="rgba(147,197,253,0.5)"
                    style={{ transformOrigin: 'center' }} />
                </g>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(96,165,250,0.8)" />
                    <stop offset="100%" stopColor="rgba(37,99,235,0.9)" />
                  </linearGradient>
                </defs>
                <rect x="23" y="2" width="14" height="6" rx="2" fill="rgba(96,165,250,0.4)" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white"><AnimatedNumber target={intake} duration={800} /></p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ml</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 w-full space-y-5">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {isEditingGoal ? (
                <div className="flex items-center gap-2">
                  <input type="number" value={tempGoal} onChange={e => setTempGoal(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-lg text-sm text-white font-bold focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(96,165,250,0.3)' }} autoFocus />
                  <button onClick={saveGoal} className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa' }}>Save</button>
                  <button onClick={() => setIsEditingGoal(false)} className="text-xs text-gray-500 hover:text-white transition-colors">Cancel</button>
                </div>
              ) : (
                <>
                  <span>Goal: <span className="text-white font-bold">{goal.toLocaleString()} ml</span></span>
                  <button onClick={() => setIsEditingGoal(true)} className="p-1 text-gray-600 hover:text-blue-400 transition-colors"><Edit2 size={12} /></button>
                  {!goalReached && <span className="text-gray-500 text-xs ml-auto">{(goal - intake).toLocaleString()} ml to go</span>}
                </>
              )}
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', boxShadow: '0 0 8px rgba(96,165,250,0.5)' }} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {[100, 250, 500, 750].map(amount => (
                  <button key={amount} onClick={() => addWater(amount)}
                    className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ border: '1px solid rgba(96,165,250,0.25)', color: '#93c5fd', background: 'rgba(96,165,250,0.06)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(96,165,250,0.18)'; e.currentTarget.style.boxShadow='0 0 16px rgba(96,165,250,0.2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(96,165,250,0.06)'; e.currentTarget.style.boxShadow='none' }}>
                    +{amount}ml
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Custom ml" value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                className="w-28 px-4 py-2.5 rounded-full text-sm text-white font-medium focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(96,165,250,0.15)' }} />
              <button onClick={handleAddCustom} disabled={!customAmount}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', color: 'white', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                <Plus size={13} /> Add
              </button>
              <button onClick={() => setIntake(0)} className="ml-auto text-[10px] font-bold text-gray-600 hover:text-gray-400 uppercase tracking-wider transition-colors">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NutritionTrackerPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const dateString = selectedDate.toLocaleDateString('en-CA')
  const displayDate = selectedDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

  const dynamicTargets = calculateDynamicTargets(user)

  const [meals, setMeals] = useState([])
  const [waterData, setWaterData] = useState({ intake: 0, goal: 3000 })
  const [targetCalories, setTargetCalories] = useState(0)
  const [targetProtein, setTargetProtein] = useState(0)
  const [targetCarbs, setTargetCarbs] = useState(0)
  const [targetFat, setTargetFat] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [activeMealIndex, setActiveMealIndex] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [addingFood, setAddingFood] = useState(false)
  const [ringKey, setRingKey] = useState(0)

  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  useEffect(() => {
    const fetchLog = async () => {
      try {
        setLoading(true)
        
        // Fetch both daily log and active plan concurrently
        const [res, planRes] = await Promise.all([
          getDailyLog(dateString),
          fetch(`${API}/workouts/my-plan`, { credentials: 'include' }).then(r => r.json())
        ])

        // Check if trainer set custom nutrition targets in the active plan
        let activeDynamicTargets = { targetCalories: 0, targetProtein: 0, targetCarbs: 0, targetFat: 0 }
        if (planRes.success && planRes.plan && planRes.plan.nutritionTargets) {
          const pt = planRes.plan.nutritionTargets
          if (pt.calories) activeDynamicTargets.targetCalories = pt.calories
          if (pt.protein) activeDynamicTargets.targetProtein = pt.protein
          if (pt.carbs) activeDynamicTargets.targetCarbs = pt.carbs
          if (pt.fat) activeDynamicTargets.targetFat = pt.fat
        }

        if (res.success && res.log) {
          setMeals(res.log.meals || [])
          setWaterData({ intake: res.log.waterIntake || 0, goal: res.log.waterGoal || 3000 })
          setTargetCalories(activeDynamicTargets.targetCalories)
          setTargetProtein(activeDynamicTargets.targetProtein)
          setTargetCarbs(activeDynamicTargets.targetCarbs)
          setTargetFat(activeDynamicTargets.targetFat)
        } else {
          setMeals([])
          setWaterData({ intake: 0, goal: 3000 })
          setTargetCalories(activeDynamicTargets.targetCalories)
          setTargetProtein(activeDynamicTargets.targetProtein)
          setTargetCarbs(activeDynamicTargets.targetCarbs)
          setTargetFat(activeDynamicTargets.targetFat)
        }
      } catch (err) {
        console.error('Failed to load nutrition log', err)
        setToastMessage('Failed to load nutrition data.')
      } finally {
        setLoading(false)
      }
    }
    fetchLog()
  }, [dateString])

  const totalCalories = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.calories, 0), 0)
  const totalProtein  = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.protein, 0), 0)
  const totalCarbs    = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.carbs, 0), 0)
  const totalFat      = meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.fat, 0), 0)

  const R = 84
  const CIRC = 2 * Math.PI * R
  const progressRatio = targetCalories > 0 ? Math.min(totalCalories / targetCalories, 1) : 0
  const dashOffset = CIRC * (1 - progressRatio)
  const calPct = Math.round(progressRatio * 100)

  const handlePrevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d) }
  const handleNextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d) }

  const handleAddFood = async (e) => {
    e.preventDefault()
    if (activeMealIndex === null) return
    try {
      setAddingFood(true)
      const newItem = { name: foodName, calories: Number(calories)||0, protein: Number(protein)||0, carbs: Number(carbs)||0, fat: Number(fat)||0 }
      const res = await addMealItem(dateString, activeMealIndex, newItem)
      if (res.success && res.log) {
        setMeals(res.log.meals)
        setToastMessage(`Added "${newItem.name}" to ${meals[activeMealIndex].name}!`)
      }
      setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFat('')
      setModalOpen(false)
    } catch (err) {
      console.error('Failed to add food', err)
      setToastMessage('Failed to add food. Please try again.')
    } finally {
      setAddingFood(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#C4F135' }} />
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Loading nutrition data…</p>
        </div>
      </div>
    )
  }

  const remainingCal = Math.max(targetCalories - totalCalories, 0)

  return (
    <div className="relative max-w-5xl mx-auto min-h-[500px] space-y-6">
      {/* Ambient background glows — NO busy image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.03) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 space-y-6">

        {/* ── Header ── */}
        <div className="nutrition-card-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-black text-white tracking-tight font-['Syne']">Nutrition</h1>
            <p className="text-gray-500 text-xs font-medium mt-0.5 uppercase tracking-widest">Daily food & macro tracker</p>
          </div>
          <div className="flex items-center gap-1 self-start sm:self-auto rounded-full px-2 py-1.5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={handlePrevDay} aria-label="Previous day"
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="text-white font-bold text-sm min-w-[160px] text-center px-2">{displayDate}</span>
            <button onClick={handleNextDay} aria-label="Next day"
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Calorie Ring + Macros ── */}
        <div className="nutrition-card-2 rounded-[20px] p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col lg:flex-row gap-8 items-center">

            {/* Calorie ring */}
            <div className="shrink-0 flex flex-col items-center gap-4">
              <div className="relative w-48 h-48">
                <svg key={ringKey} className="w-full h-full -rotate-90" viewBox="0 0 192 192"
                  aria-label={`Calories: ${totalCalories} of ${targetCalories}`} role="img">
                  <circle cx="96" cy="96" r={R} strokeWidth="14" fill="none" stroke="rgba(255,255,255,0.06)" />
                  {/* Glow layer */}
                  <circle cx="96" cy="96" r={R} strokeWidth="14" fill="none" stroke="rgba(196,241,53,0.15)"
                    strokeDasharray={CIRC} strokeDashoffset={dashOffset} strokeLinecap="round"
                    style={{ filter: 'blur(4px)' }} />
                  {/* Main ring */}
                  <circle cx="96" cy="96" r={R} strokeWidth="14" fill="none" stroke="#C4F135"
                    strokeDasharray={CIRC} strokeDashoffset={dashOffset} strokeLinecap="round"
                    className="ring-animate"
                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[30px] font-black text-white leading-none font-['Syne']">
                    <AnimatedNumber target={totalCalories} duration={1200} />
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">kcal</span>
                  <span className="text-[11px] font-black mt-1.5 px-2 py-0.5 rounded-full"
                    style={{ color: '#C4F135', background: 'rgba(196,241,53,0.12)' }}>{calPct}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{remainingCal.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">kcal remaining</p>
              </div>
            </div>

            {/* Macros */}
            <div className="flex-1 w-full space-y-5">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <MacroPill label="Protein" value={totalProtein} color="#f97316" bg="rgba(249,115,22,0.08)" />
                <MacroPill label="Carbs"   value={totalCarbs}   color="#22c55e" bg="rgba(34,197,94,0.08)" />
                <MacroPill label="Fat"     value={totalFat}     color="#f59e0b" bg="rgba(245,158,11,0.08)" />
              </div>
              <MacroBar label="Protein"       current={totalProtein} target={targetProtein} gradientFrom="#f97316" gradientTo="#fb923c" delay={100} />
              <MacroBar label="Carbohydrates" current={totalCarbs}   target={targetCarbs}   gradientFrom="#22c55e" gradientTo="#4ade80" delay={200} />
              <MacroBar label="Fat"           current={totalFat}     target={targetFat}     gradientFrom="#f59e0b" gradientTo="#fbbf24" delay={300} />
            </div>
          </div>
        </div>

        {/* ── Water ── */}
        <WaterSection dateString={dateString} initialIntake={waterData.intake} initialGoal={waterData.goal} />

        {/* ── Meals ── */}
        <div className="nutrition-card-4 rounded-[20px] overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          <div className="px-6 md:px-8 py-5 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(196,241,53,0.12)' }}>
                <Utensils size={15} style={{ color: '#C4F135' }} />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Today's Meals</h2>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  {meals.reduce((s, m) => s + m.items.length, 0)} items logged
                </p>
              </div>
            </div>
          </div>

          {meals.map((meal, index) => {
            const mealCalories = meal.items.reduce((s, item) => s + item.calories, 0)
            const mealProtein  = meal.items.reduce((s, item) => s + item.protein, 0)
            const accentColors = ['#C4F135','#f97316','#60a5fa','#a855f7']
            const accentBgs    = ['rgba(196,241,53','rgba(249,115,22','rgba(96,165,250','rgba(168,85,247']
            const accent = accentColors[index % 4]
            const accentBg = accentBgs[index % 4]
            return (
              <div key={meal.name} style={{ borderBottom: index < meals.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="flex justify-between items-center px-6 md:px-8 py-5 hover:bg-white/[0.025] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full" style={{ background: accent }} />
                    <div>
                      <h3 className="font-black text-[16px] text-white">{meal.name}</h3>
                      {mealCalories > 0 && (
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{mealProtein}g protein · {mealCalories} kcal</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {mealCalories > 0 && (
                      <span className="text-[12px] font-black px-3 py-1 rounded-full"
                        style={{ color: accent, background: `${accentBg},0.1)` }}>
                        {mealCalories} kcal
                      </span>
                    )}
                    <button onClick={() => { setActiveMealIndex(index); setModalOpen(true) }}
                      aria-label={`Add food to ${meal.name}`}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                      style={{ background: 'rgba(196,241,53,0.08)', border: '1px solid rgba(196,241,53,0.2)', color: '#C4F135' }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(196,241,53,0.18)'; e.currentTarget.style.boxShadow='0 0 16px rgba(196,241,53,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(196,241,53,0.08)'; e.currentTarget.style.boxShadow='none' }}>
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                {meal.items.length > 0 ? (
                  <div className="px-6 md:px-8 pb-4 space-y-1">
                    {meal.items.map((item, j) => (
                      <div key={item._id || j}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 rounded-xl hover:bg-white/[0.025] transition-colors">
                        <span className="text-[14px] font-semibold text-gray-300">{item.name}</span>
                        <div className="flex items-center gap-4 mt-1 sm:mt-0">
                          <span className="text-[14px] font-black text-white">{item.calories} kcal</span>
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                            <span style={{ color: '#fb923c' }}>P</span><span className="text-gray-400">{item.protein}g</span>
                            <span className="text-gray-600">·</span>
                            <span style={{ color: '#4ade80' }}>C</span><span className="text-gray-400">{item.carbs}g</span>
                            <span className="text-gray-600">·</span>
                            <span style={{ color: '#fbbf24' }}>F</span><span className="text-gray-400">{item.fat}g</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 md:px-8 py-4">
                    <p className="text-[12px] text-gray-600 font-medium">No food logged for {meal.name} yet.{' '}
                      <button onClick={() => { setActiveMealIndex(index); setModalOpen(true) }}
                        className="font-bold transition-colors" style={{ color: '#C4F135' }}>+ Add food</button>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Modal ── */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
          title={`Log Food — ${activeMealIndex !== null ? meals[activeMealIndex]?.name : 'Meal'}`}>
          <form onSubmit={handleAddFood} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Food Name</label>
              <input type="text" placeholder="e.g. Scrambled Eggs" required value={foodName}
                onChange={e => setFoodName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => e.target.style.borderColor='rgba(196,241,53,0.4)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Calories (kcal)', val: calories, set: setCalories, required: true },
                { label: 'Protein (g)',     val: protein,  set: setProtein  },
                { label: 'Carbs (g)',       val: carbs,    set: setCarbs    },
                { label: 'Fat (g)',         val: fat,      set: setFat      },
              ].map(({ label, val, set, required }) => (
                <div key={label}>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                  <input type="number" placeholder="0" required={required} value={val} onChange={e => set(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium focus:outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => e.target.style.borderColor='rgba(196,241,53,0.4)'}
                    onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.08)'} />
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button type="button" onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
              <button type="submit" disabled={addingFood}
                className="px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg,#C4F135,#a3d625)', color: '#0a0a0b', boxShadow: '0 4px 16px rgba(196,241,53,0.3)' }}>
                {addingFood ? <Loader2 size={14} className="animate-spin" /> : <Utensils size={14} />}
                {addingFood ? 'Logging…' : 'Log Food'}
              </button>
            </div>
          </form>
        </Modal>

        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      </div>
    </div>
  )
}
