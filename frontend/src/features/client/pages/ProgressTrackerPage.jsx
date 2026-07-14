import { useState, useEffect, useRef } from 'react'
import { ArrowDownRight, TrendingUp, Scale, Percent, Info } from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'
import API from '../../../shared/utils/api'

// ─── Reusable Scroll Reveal Wrapper ──────────────────────────────────────
function ScrollReveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated stat counter ─────────────────────────────────────────────
function AnimatedStat({ target, duration = 1200, delay = 0, decimals = 0 }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  useEffect(() => {
    if (!isInView) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setCurrent(target)
      return
    }

    const t = setTimeout(() => {
      if (target === 0) { setCurrent(0); return }
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(target * eased)
        if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current) }
  }, [target, duration, delay, isInView])
  
  return <span ref={ref}>{current.toFixed(decimals)}</span>
}

// ─── Mini SVG Line Chart (Scroll Scrubbed & Morphing) ──────────────────────
function LineChartSVG({ data, color = '#C4F135', height = 120 }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 45%"]
  })
  
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = useState(2000)

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [data])

  // Map scroll progress to path drawing
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [pathLength, 0])
  const opacityFill = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (data.length === 0) return null
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min || 1
  const w = 100
  const pad = 4

  const points = data.map((d, i) => {
    const x = data.length > 1 ? pad + (i / (data.length - 1)) * (w - pad * 2) : w / 2
    const y = pad + (range > 0 ? (1 - (d.value - min) / range) * (height - pad * 2) : (height - pad * 2) / 2)
    return { x, y }
  })

  const polylineStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
  const areaPointsStr = `${polylineStr} L ${w - pad},${height - pad} L ${pad},${height - pad} Z`

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-line`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <motion.path 
          animate={{ d: areaPointsStr }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          fill="url(#grad-line)" 
          style={{ opacity: opacityFill }}
        />
        
        {/* Path Line */}
        <motion.path 
          ref={pathRef}
          animate={{ d: polylineStr }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          fill="none" 
          stroke={color} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          style={{ strokeDashoffset }}
        />
        
        {/* Points */}
        {points.map((p, i) => (
          <ChartPoint 
            key={i} 
            p={p} 
            i={i} 
            pointsLength={points.length} 
            scrollYProgress={scrollYProgress} 
            color={color} 
          />
        ))}
      </svg>
    </div>
  )
}

function ChartPoint({ p, i, pointsLength, scrollYProgress, color }) {
  const pointPercentage = pointsLength > 1 ? i / (pointsLength - 1) : 0.5
  const scale = useTransform(scrollYProgress, 
    [Math.max(0, pointPercentage - 0.1), pointPercentage], 
    [0, 1]
  )
  
  return (
    <motion.circle 
      animate={{ cx: p.x, cy: p.y }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      r="3" 
      fill={color} 
      stroke="#0A0A0B" 
      strokeWidth="2" 
      style={{ scale, originX: 0.5, originY: 0.5 }}
    />
  )
}

// ─── Mini SVG Bar Chart (Scroll Scrubbed & Morphing) ───────────────────────
function BarChartSVG({ data, color = '#C4F135', height = 120 }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 50%"]
  })

  if (data.length === 0) return null
  const max = Math.max(...data.map(d => d.value)) || 1
  const gap = 4
  const totalGap = gap * (data.length + 1)
  const barW = (100 - totalGap) / data.length

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bargrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const x = gap + i * (barW + gap)
          const targetBarH = (d.value / max) * (height - 12)
          
          const start = i * (0.6 / data.length)
          const end = start + 0.4
          
          return (
            <Bar 
              key={d.date} 
              x={x} 
              targetBarH={targetBarH} 
              height={height} 
              barW={barW} 
              scrollYProgress={scrollYProgress} 
              start={start} 
              end={end} 
            />
          )
        })}
      </svg>
    </div>
  )
}

function Bar({ x, targetBarH, height, barW, scrollYProgress, start, end }) {
  // Tie scale to scroll progression for that specific bar (staggered)
  const scrollScale = useTransform(scrollYProgress, [start, end], [0, 1])
  
  return (
    <motion.rect
      x={x}
      width={barW}
      rx="3"
      fill="url(#bargrad)"
      // Animate morphs layout smoothly on data change (dropdown swap)
      initial={{ height: targetBarH, y: height - targetBarH - 4 }}
      animate={{ height: targetBarH, y: height - targetBarH - 4 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      style={{ scaleY: scrollScale, originY: 1 }}
    />
  )
}

const GLASS = 'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-[24px] hover:border-white/[0.12] transition-colors'

export default function ProgressTrackerPage() {
  const [strengthExercise, setStrengthExercise] = useState('Bench Press')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [hasLoggedData, setHasLoggedData] = useState(false)

  // ─── Scroll Hook for Parallax ───
  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 1000], [0, 50])

  // ─── States ───────────────────────────────────────────────────────────────
  const [currentWeight, setCurrentWeight] = useState(74.5)
  const [goalWeight, setGoalWeight] = useState(68.0)
  const [bodyFat, setBodyFat] = useState(18.5)
  const [bmi, setBmi] = useState(23.8)

  const [weightHistory, setWeightHistory] = useState([])

  const [exerciseData, setExerciseData] = useState({
    'Bench Press': [],
    'Squat': [],
    'Deadlift': [],
  })

  const [measurements, setMeasurements] = useState([
    { label: 'Chest',    value: 0,   unit: 'cm', prev: 0,   down: null  },
    { label: 'Waist',    value: 0,   unit: 'cm', prev: 0,   down: null  },
    { label: 'Hips',     value: 0,   unit: 'cm', prev: 0,   down: null  },
    { label: 'Thigh',    value: 0,   unit: 'cm', prev: 0,   down: null  },
    { label: 'Arm',      value: 0,   unit: 'cm', prev: 0,   down: null  },
    { label: 'Neck',     value: 0,   unit: 'cm', prev: 0,   down: null  },
  ])

  const [activeTab, setActiveTab] = useState('metrics')

  // ─── Daily Progress Photos State ───
  const [photos, setPhotos] = useState([])
  const [compA, setCompA] = useState(1)
  const [compB, setCompB] = useState(3)

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    const newPhoto = {
      id: Date.now(),
      date: new Date().toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      url,
      tag: 'Front'
    }

    setPhotos(prev => [newPhoto, ...prev])
    setCompA(newPhoto.id)
    setToastMessage("Progress photo uploaded successfully!")
  }

  const handleDeletePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
    setToastMessage("Photo removed successfully.")
  }

  // ─── Form Inputs State ───
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formWeight, setFormWeight] = useState(currentWeight)
  const [formBodyFat, setFormBodyFat] = useState(bodyFat)
  const [formMeasurements, setFormMeasurements] = useState({
    Chest: 96,
    Waist: 82,
    Hips: 94,
    Thigh: 58,
    Arm: 35,
    Neck: 38
  })

  // Dynamic strength logs
  const [formExWeight, setFormExWeight] = useState(55)
  const [formExReps, setFormExReps] = useState(8)
  const [formExSets, setFormExSets] = useState(4)

  const handleSave = async (e) => {
    e.preventDefault()

    const weightVal = Number(formExWeight)
    const repsVal = Number(formExReps)
    const setsVal = Number(formExSets)
    const est1RM = Math.round(weightVal * (1 + repsVal / 30))
    const totalVolume = Math.round(weightVal * repsVal * setsVal)

    try {
      const payload = {
        date: formDate,
        weight: Number(formWeight),
        bodyFat: Number(formBodyFat),
        measurements: {
          chest: formMeasurements.Chest,
          waist: formMeasurements.Waist,
          hips: formMeasurements.Hips,
          thigh: formMeasurements.Thigh,
          arm: formMeasurements.Arm,
          neck: formMeasurements.Neck
        },
        strengthLog: {
          exercise: strengthExercise,
          weight: weightVal,
          reps: repsVal,
          sets: setsVal,
          estimated1RM: est1RM,
          volume: totalVolume
        }
      }
      
      const res = await fetch(`${API}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })
      const data = await res.json()
      
      if(data.success) {
        // Update local state smoothly
        setCurrentWeight(Number(formWeight))
        setBodyFat(Number(formBodyFat))

        const dateObj = new Date(formDate)
        const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })

        setWeightHistory(prev => {
          const filtered = prev.filter(w => w.date !== formDate)
          const list = [...filtered, { label: dateStr, date: formDate, value: Number(formWeight) }]
          return list.sort((a, b) => new Date(a.date) - new Date(b.date))
        })

        setExerciseData(prev => {
          const currentList = prev[strengthExercise] || []
          const filtered = currentList.filter(ex => ex.date !== formDate)
          const list = [...filtered, {
            label: dateStr,
            date: formDate,
            weight: weightVal,
            reps: repsVal,
            sets: setsVal,
            value: est1RM,
            max1RM: `${est1RM} kg`,
            vol: `${totalVolume.toLocaleString()} kg`
          }]
          return {
            ...prev,
            [strengthExercise]: list.sort((a, b) => new Date(a.date) - new Date(b.date))
          }
        })

        setMeasurements(prev => prev.map(m => {
          const formVal = formMeasurements[m.label]
          if (formVal !== undefined) {
            return {
              ...m,
              prev: m.value,
              value: Number(formVal),
              down: Number(formVal) < m.value ? true : Number(formVal) > m.value ? false : null
            }
          }
          return m
        }))

        const newBmi = (Number(formWeight) / (1.77 * 1.77)).toFixed(1)
        setBmi(newBmi)

        setModalOpen(false)
        setHasLoggedData(true)
        setToastMessage("Daily check-in logs saved successfully!")
      }
    } catch (err) {
      console.error(err)
      setToastMessage("Failed to save progress")
    }
  }

  // ─── Fetch Progress History from Backend ───
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API}/progress`, { credentials: 'include' })
        const data = await res.json()
        if (data.success && data.history.length > 0) {
          const history = data.history
          
          const parsedWeight = history.filter(h => h.weight).map(h => {
            const dateObj = new Date(h.date)
            return {
              label: dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }),
              date: h.date,
              value: h.weight
            }
          })
          if (parsedWeight.length > 0) {
            setWeightHistory(parsedWeight)
            setCurrentWeight(parsedWeight[parsedWeight.length - 1].value)
          }

          const parsedExercise = { 'Bench Press': [], 'Squat': [], 'Deadlift': [] }
          
          history.forEach(h => {
            if(h.strengthLogs) {
              h.strengthLogs.forEach(log => {
                const dateObj = new Date(h.date)
                const exName = log.exercise
                if(!parsedExercise[exName]) parsedExercise[exName] = []
                parsedExercise[exName].push({
                  label: dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                  date: h.date,
                  weight: log.weight,
                  reps: log.reps,
                  sets: log.sets,
                  value: log.estimated1RM,
                  max1RM: `${log.estimated1RM} kg`,
                  vol: `${log.volume} kg`
                })
              })
            }
          })
          
          // Only overwrite if we got data
          if (Object.values(parsedExercise).some(arr => arr.length > 0)) {
            setExerciseData(parsedExercise)
          }
          
          const latest = history[history.length - 1]
          if (latest.bodyFat) setBodyFat(latest.bodyFat)
          
          if (latest.measurements) {
            const m = latest.measurements
            setMeasurements(prev => prev.map(item => {
              const val = m[item.label.toLowerCase()]
              return val ? { ...item, value: val, prev: item.value } : item
            }))
          }
          
          setHasLoggedData(true)
        }
      } catch (err) {
        console.error("Progress fetch error:", err)
      }
    }
    fetchProgress()
  }, [])

  const getProgressiveOverloadAlert = (exercise) => {
    const list = exerciseData[exercise] || []
    if (list.length < 2) return null

    const last = list[list.length - 1]
    const prev = list[list.length - 2]

    if (last.weight === prev.weight) {
      const nextWeight = last.weight + 2.5
      return {
        type: 'warning',
        text: `💡 Progressive Overload Target: You used ${last.weight} kg for ${exercise} in consecutive sessions. Try increasing by 2.5 kg next session to force adaptation!`
      }
    }

    if (last.weight > prev.weight) {
      const diff = (last.weight - prev.weight).toFixed(1)
      return {
        type: 'success',
        text: `💪 Strength Increase Detected! You successfully increased your ${exercise} weight from ${prev.weight} kg to ${last.weight} kg (+${diff} kg)! Keep up the overload.`
      }
    }

    return null
  }

  const strengthData = exerciseData[strengthExercise] || []

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10 pt-4 md:pt-6 pb-20" aria-live="polite">
      
      {/* Spotlight Animations */}
      <style>{`
        @keyframes spotlightPulseWarning {
          0% { box-shadow: 0 0 0 rgba(196,241,53,0); background: rgba(196,241,53,0.02); border-color: rgba(196,241,53,0.05); }
          50% { box-shadow: 0 0 30px rgba(196,241,53,0.3); background: rgba(196,241,53,0.12); border-color: rgba(196,241,53,0.3); }
          100% { box-shadow: 0 4px 16px rgba(196,241,53,0.05); background: rgba(196,241,53,0.05); border-color: rgba(196,241,53,0.2); }
        }
        @keyframes spotlightPulseSuccess {
          0% { box-shadow: 0 0 0 rgba(34,197,94,0); background: rgba(34,197,94,0.02); border-color: rgba(34,197,94,0.05); }
          50% { box-shadow: 0 0 30px rgba(34,197,94,0.3); background: rgba(34,197,94,0.12); border-color: rgba(34,197,94,0.3); }
          100% { box-shadow: 0 4px 16px rgba(34,197,94,0.05); background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.2); }
        }
        .spotlight-warning {
          animation: spotlightPulseWarning 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .spotlight-success {
          animation: spotlightPulseSuccess 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Ambient glow with parallax */}
      <motion.div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ y: yParallax }}>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.03) 0%, transparent 70%)' }} />
      </motion.div>

      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-3xl md:text-[34px] font-black text-white font-['Syne'] tracking-tight">Progress Tracker</h1>
            <p className="text-gray-500 mt-1 font-medium text-[15px]">Visualize your transformation.</p>
          </div>
          {activeTab === 'metrics' && (
            <button
              onClick={() => {
                setFormWeight(currentWeight)
                setFormBodyFat(bodyFat)
                setFormDate(new Date().toISOString().split('T')[0])
                setFormMeasurements(measurements.reduce((acc, m) => ({ ...acc, [m.label]: m.value }), {}))
                setModalOpen(true)
              }}
              className="px-6 py-3 rounded-full text-[13px] font-black transition-all active:scale-95 hover:-translate-y-0.5 cursor-pointer shadow-[0_4px_16px_rgba(196,241,53,0.3)]"
              style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b' }}
            >
              Log Today's Metrics
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Demo data notice */}
      {!hasLoggedData && (
        <ScrollReveal delay={0.1}>
          <div className="flex items-start gap-3 px-5 py-4 bg-[rgba(196,241,53,0.05)] border border-[rgba(196,241,53,0.2)] rounded-[16px] text-[13px] shadow-[0_4px_16px_rgba(196,241,53,0.05)] relative z-10">
            <Info size={18} className="text-[#C4F135] shrink-0 mt-0.5" />
            <p className="text-[#C4F135]/90 font-medium">
              <span className="font-bold text-[#C4F135]">Sample data shown.</span> These are demo values — tap{' '}
              <button
                onClick={() => { setFormWeight(currentWeight); setFormBodyFat(bodyFat); setFormDate(new Date().toISOString().split('T')[0]); setFormMeasurements(measurements.reduce((acc, m) => ({ ...acc, [m.label]: m.value }), {})); setModalOpen(true) }}
                className="underline font-bold text-[#C4F135] hover:text-white transition-colors"
              >
                Log Today's Metrics
              </button>{' '}
              to replace them with your real data.
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* Tab Bar */}
      <ScrollReveal delay={0.2}>
        <div className="border-b border-white/10 flex relative mb-6 z-10">
          {[
            { id: 'metrics', label: 'Metrics & Charts', w: '8rem' },
            { id: 'gallery', label: 'Transformation Gallery', w: '12rem' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`pb-4 text-[14px] tracking-wide font-black capitalize transition-all duration-300 focus:outline-none ${tab.id === 'metrics' ? 'w-32' : 'w-48'} ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          <div className="absolute bottom-0 h-0.5 bg-[#C4F135] shadow-[0_0_12px_#C4F135] transition-all duration-300 ease-out"
            style={{
              width: activeTab === 'metrics' ? '8rem' : '12rem',
              transform: activeTab === 'metrics' ? 'translateX(0)' : 'translateX(8rem)'
            }}
          />
        </div>
      </ScrollReveal>

      {/* Content Area (Crossfade logic) */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          
          {/* ─── METRICS TAB ─── */}
          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-8">
                
                {/* Stats Summary cards */}
                <ScrollReveal>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {[
                      { 
                        label: 'Current Weight', 
                        value: currentWeight, 
                        decimals: 1, 
                        unit: 'kg', 
                        delta: weightHistory.length > 0 ? `${(currentWeight - weightHistory[0].value).toFixed(1)}kg this month` : '0kg this month', 
                        icon: Scale, 
                        up: weightHistory.length > 0 ? (currentWeight < weightHistory[0].value ? false : currentWeight > weightHistory[0].value ? true : null) : null
                      },
                      { label: 'Goal Weight',    value: goalWeight, decimals: 1, unit: 'kg', delta: `${Math.abs(currentWeight - goalWeight).toFixed(1)}kg remaining`,   icon: TrendingUp, up: null },
                      { label: 'Body Fat %',     value: bodyFat, decimals: 1, unit: '%',  delta: `${(bodyFat - 19.3).toFixed(1)}% this month`,  icon: Percent, up: (bodyFat < 19.3 ? false : bodyFat > 19.3 ? true : null) },
                      { label: 'BMI',            value: Number(bmi), decimals: 1, unit: '',   delta: 'Normal Range',       icon: Scale, up: null },
                    ].map((s, i) => {
                      const Icon = s.icon
                      return (
                        <div key={i} className={`${GLASS} p-5 sm:p-6 relative overflow-hidden group`}>
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C4F135]/5 rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="flex items-center justify-between mb-4 relative z-10">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
                            <div className="w-8 h-8 rounded-full bg-[rgba(196,241,53,0.08)] border border-[rgba(196,241,53,0.2)] flex items-center justify-center">
                              <Icon size={14} className="text-[#C4F135]" />
                            </div>
                          </div>
                          
                          <p className="text-3xl sm:text-[34px] font-black text-white mb-1.5 font-['Syne'] leading-none relative z-10">
                            <AnimatedStat target={s.value} decimals={s.decimals} duration={1200} delay={i * 80} /> <span className="text-sm font-bold text-gray-500">{s.unit}</span>
                          </p>
                          
                          {/* Trend indicator fades in after numbers count up */}
                          <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.8 + (i * 0.08), duration: 0.5 }}
                            className={`text-[11px] font-bold flex items-center gap-1 relative z-10 ${s.up === false ? 'text-[#C4F135]' : s.up === true ? 'text-red-400' : 'text-gray-500'}`}
                          >
                            {s.up === false && <ArrowDownRight size={14} strokeWidth={3} className="rotate-90" />}
                            {s.delta}
                          </motion.p>
                        </div>
                      )
                    })}
                  </div>
                </ScrollReveal>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-8">
                  
                  {/* Weight Progress */}
                  <ScrollReveal delay={0.1}>
                    <div className={`${GLASS} p-6 sm:p-8 h-full flex flex-col`}>
                      <h2 className="text-xl font-bold text-white mb-6 font-['Syne']">Weight Progress</h2>

                      <div className="mb-6 px-1 flex-1">
                        <div className="flex gap-3 items-end h-40">
                          <div className="flex flex-col justify-between h-full pb-1 text-[10px] font-bold text-gray-500 text-right w-10 shrink-0">
                            <span>{weightHistory.length > 0 ? (Math.max(...weightHistory.map(d => d.value)) + 0.5).toFixed(1) : "0.0"}</span>
                            <span>{weightHistory.length > 0 ? ((Math.max(...weightHistory.map(d => d.value)) + Math.min(...weightHistory.map(d => d.value))) / 2).toFixed(1) : "0.0"}</span>
                            <span>{weightHistory.length > 0 ? (Math.min(...weightHistory.map(d => d.value)) - 0.5).toFixed(1) : "0.0"}</span>
                          </div>
                          <div className="flex-1 relative h-full">
                            {[0, 50, 100].map(p => (
                              <div key={p} className="absolute w-full border-t border-white/5" style={{ top: `${p}%` }} />
                            ))}
                            <LineChartSVG data={weightHistory} color="#C4F135" height={140} />
                          </div>
                        </div>
                        <div className="flex justify-between pl-[52px] mt-2">
                          {weightHistory.map((d, index) => (
                            <span key={index} className="text-[10px] font-bold text-gray-500">{d.label}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-4 mt-auto">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-2 px-2">
                          <span>Date</span><span>Weight</span><span>Change</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2">
                          {[...weightHistory].reverse().map((row, i) => {
                            const prevVal = weightHistory[weightHistory.length - 1 - i - 1]?.value
                            const diff = prevVal ? row.value - prevVal : 0
                            return (
                              <div key={row.date} 
                                className="flex justify-between text-xs font-bold py-3 border-t border-white/[0.04] px-2 items-center hover:bg-white/[0.02] transition-colors rounded-lg">
                                <span className="text-gray-400">{row.label}</span>
                                <span className="text-white">{row.value.toFixed(1)} kg</span>
                                <span className={diff < 0 ? 'text-[#C4F135]' : diff > 0 ? 'text-red-400' : 'text-gray-500'}>
                                  {diff < 0 ? `−${Math.abs(diff).toFixed(1)} kg` : diff > 0 ? `+${diff.toFixed(1)} kg` : '—'}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Strength Progress */}
                  <ScrollReveal delay={0.2}>
                    <div className={`${GLASS} p-6 sm:p-8 h-full flex flex-col`}>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white font-['Syne']">Strength Progress</h2>
                        <div className="relative">
                          <select
                            value={strengthExercise}
                            onChange={e => setStrengthExercise(e.target.value)}
                            className="text-sm font-bold bg-white/5 border border-white/10 rounded-full px-4 py-2 pr-8 text-white focus:outline-none focus:border-[#C4F135] transition-all cursor-pointer appearance-none hover:bg-white/10"
                          >
                            <option className="bg-[#111318]">Bench Press</option>
                            <option className="bg-[#111318]">Squat</option>
                            <option className="bg-[#111318]">Deadlift</option>
                          </select>
                          <ArrowDownRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {(() => {
                          const alertObj = getProgressiveOverloadAlert(strengthExercise)
                          if (!alertObj) return null
                          return (
                            <motion.div 
                              key={strengthExercise}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`p-4 rounded-[14px] text-[13px] font-bold mb-6 border leading-relaxed ${
                                alertObj.type === 'warning' 
                                  ? 'spotlight-warning text-[#C4F135]' 
                                  : 'spotlight-success text-[#22C55E]'
                              }`}
                            >
                              {alertObj.text}
                            </motion.div>
                          )
                        })()}
                      </AnimatePresence>

                      <div className="mb-6 px-1 flex-1">
                        <div className="flex gap-3 items-end h-40">
                          <div className="flex flex-col justify-between h-full pb-1 text-[10px] font-bold text-gray-500 text-right w-10 shrink-0">
                            <span>{strengthData.length > 0 ? (Math.max(...strengthData.map(d => d.value)) * 1.05).toFixed(0) : "0"}</span>
                            <span>{strengthData.length > 0 ? (Math.max(...strengthData.map(d => d.value)) * 0.5).toFixed(0) : "0"}</span>
                            <span>0</span>
                          </div>
                          <div className="flex-1 relative h-full">
                            {[0, 50, 100].map(p => (
                              <div key={p} className="absolute w-full border-t border-white/5" style={{ top: `${p}%` }} />
                            ))}
                            <BarChartSVG data={strengthData} color="#C4F135" height={140} />
                          </div>
                        </div>
                        <div className="flex justify-between pl-[52px] mt-2">
                          {strengthData.map((d, index) => (
                            <span key={index} className="text-[10px] font-bold text-gray-500">{d.label}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-4 mt-auto">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-2 px-2">
                          <span className="w-14">Date</span>
                          <span className="w-16 text-center">Weight</span>
                          <span className="w-16 text-center">Change</span>
                          <span className="w-16 text-center">1RM</span>
                          <span className="w-16 text-right">Volume</span>
                        </div>
                        <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2">
                          {[...strengthData].reverse().map((row, i) => {
                            const chronologicalList = strengthData
                            const currentIndex = chronologicalList.findIndex(item => item.date === row.date)
                            const prevRow = currentIndex > 0 ? chronologicalList[currentIndex - 1] : null
                            
                            let diffText = '—'
                            let diffClass = 'text-gray-500'
                            if (prevRow) {
                              const diff = row.weight - prevRow.weight
                              if (diff > 0) {
                                diffText = `+${diff} kg`
                                diffClass = 'text-green-400'
                              } else if (diff < 0) {
                                diffText = `${diff} kg`
                                diffClass = 'text-red-400'
                              } else {
                                diffText = 'Same'
                                diffClass = 'text-gray-500'
                              }
                            }

                            return (
                              <motion.div 
                                key={`${strengthExercise}-${row.date}`} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="flex justify-between text-[11px] sm:text-xs font-bold py-3 border-t border-white/[0.04] items-center px-2 hover:bg-white/[0.02] transition-colors rounded-lg"
                              >
                                <span className="text-gray-400 w-14">{row.label}</span>
                                <span className="text-white w-16 text-center">{row.weight} kg</span>
                                <span className={`w-16 text-center ${diffClass}`}>{diffText}</span>
                                <span className="text-white w-16 text-center">{row.max1RM}</span>
                                <span className="text-[#C4F135] w-16 text-right">{row.vol}</span>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Body Measurements */}
                <ScrollReveal>
                  <div className={`${GLASS} p-6 sm:p-8`}>
                    <h2 className="text-xl font-bold text-white mb-6 font-['Syne']">Body Measurements</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {measurements.map((m, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all hover:-translate-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{m.label}</p>
                          <p className="text-xl font-black text-white font-['Syne'] mb-1.5 leading-none">
                            <AnimatedStat target={m.value} duration={1200} delay={i * 80} /> <span className="text-[11px] text-gray-500">{m.unit}</span>
                          </p>
                          <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.8 + (i * 0.08), duration: 0.5 }}
                            className={`text-[10px] font-bold ${m.down === true ? 'text-[#C4F135]' : m.down === false ? 'text-red-400' : 'text-gray-500'}`}
                          >
                            prev {m.prev} {m.unit}
                          </motion.p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
                
              </div>
            </motion.div>
          )}

          {/* ─── GALLERY TAB ─── */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="space-y-8">
                
                <ScrollReveal>
                  <div className={`${GLASS} p-6 sm:p-8`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-white font-['Syne']">Daily Progress Photos</h2>
                        <p className="text-sm text-gray-400 mt-1 font-medium">Upload daily photos to visually track your body transformation.</p>
                      </div>
                      <div>
                        <input 
                          type="file" 
                          id="photo-upload" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handlePhotoUpload} 
                        />
                        <label 
                          htmlFor="photo-upload"
                          className="px-6 py-3 bg-[rgba(196,241,53,0.1)] border border-[rgba(196,241,53,0.3)] hover:bg-[#C4F135] hover:text-[#0a0a0b] text-[#C4F135] font-black rounded-full text-[13px] transition-all cursor-pointer flex items-center gap-2"
                        >
                          + Upload Check-in Photo
                        </label>
                      </div>
                    </div>

                    {/* Comparison Slider / Side-by-side viewer */}
                    {photos.length >= 2 && (
                      <div className="bg-black/20 border border-white/5 rounded-[20px] p-5 sm:p-6 mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Transformation Comparison</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Compare From (Before)</label>
                            <select 
                              value={compA} 
                              onChange={e => setCompA(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 text-white font-bold rounded-xl p-3 text-xs focus:outline-none focus:border-[#C4F135] transition-colors cursor-pointer"
                            >
                              {photos.map(p => (
                                <option key={p.id} value={p.id} className="bg-[#111318]">{p.date} ({p.tag})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Compare To (After)</label>
                            <select 
                              value={compB} 
                              onChange={e => setCompB(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 text-white font-bold rounded-xl p-3 text-xs focus:outline-none focus:border-[#C4F135] transition-colors cursor-pointer"
                            >
                              {photos.map(p => (
                                <option key={p.id} value={p.id} className="bg-[#111318]">{p.date} ({p.tag})</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black/40 border border-white/10 flex items-center justify-center">
                            <img 
                              src={photos.find(p => p.id === compA)?.url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80'} 
                              alt="Before" 
                              className="w-full h-full object-cover" 
                            />
                            <span className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                              Before: {photos.find(p => p.id === compA)?.date}
                            </span>
                          </div>
                          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black/40 border border-white/10 flex items-center justify-center">
                            <img 
                              src={photos.find(p => p.id === compB)?.url || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'} 
                              alt="After" 
                              className="w-full h-full object-cover" 
                            />
                            <span className="absolute bottom-4 left-4 bg-[#C4F135] text-[#0a0a0b] text-[11px] font-black px-3 py-1.5 rounded-lg shadow-sm">
                              After: {photos.find(p => p.id === compB)?.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gallery Timeline */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Photo Check-in Timeline</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <AnimatePresence>
                          {photos.map((photo, i) => (
                            <motion.div 
                              key={photo.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ delay: i * 0.05 }}
                              className="relative group rounded-[16px] overflow-hidden aspect-[3/4] bg-white/5 border border-white/10 hover:border-[#C4F135]/50 transition-colors flex flex-col shadow-sm"
                            >
                              <div className="flex-1 overflow-hidden relative">
                                <img src={photo.url} alt={photo.tag} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out" />
                                <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md text-[#C4F135] border border-[#C4F135]/30">
                                  {photo.tag}
                                </span>
                              </div>
                              <div className="p-3 bg-black/40 backdrop-blur-md text-center border-t border-white/5 flex flex-col items-center justify-center min-h-[64px]">
                                <p className="text-[11px] font-bold text-white leading-none">{photo.date}</p>
                                <p className="text-[9px] text-gray-500 font-bold mt-1.5 leading-none">{photo.time}</p>
                                <button 
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="text-[10px] text-red-400 hover:text-red-500 font-bold mt-2 cursor-pointer transition-colors block leading-none"
                                >
                                  Delete
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ─── LOG METRICS MODAL ─── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Today's Check-in">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Check-in Date</label>
            <input
              type="date"
              required
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formWeight}
                onChange={e => setFormWeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formBodyFat}
                onChange={e => setFormBodyFat(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 mt-2">
            <h4 className="text-[13px] font-bold text-white mb-4 uppercase tracking-widest text-[#C4F135]">Today's Strength Performance</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Exercise</label>
                <select
                  value={strengthExercise}
                  onChange={e => setStrengthExercise(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors cursor-pointer"
                >
                  <option className="bg-[#111318]">Bench Press</option>
                  <option className="bg-[#111318]">Squat</option>
                  <option className="bg-[#111318]">Deadlift</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Weight Lifted (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formExWeight}
                  onChange={e => setFormExWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reps Completed</label>
                <input
                  type="number"
                  required
                  value={formExReps}
                  onChange={e => setFormExReps(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sets Completed</label>
                <input
                  type="number"
                  required
                  value={formExSets}
                  onChange={e => setFormExSets(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 mt-2">
            <h4 className="text-[13px] font-bold text-white mb-4 uppercase tracking-widest text-[#C4F135]">Measurements (cm)</h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(formMeasurements).map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{field}</label>
                  <input
                    type="number"
                    required
                    value={formMeasurements[field]}
                    onChange={e => setFormMeasurements(prev => ({ ...prev, [field]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#C4F135] transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-3 border border-white/10 text-white hover:bg-white/10 rounded-full text-[13px] font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#C4F135] hover:bg-[#a3d625] text-[#0a0a0b] rounded-full text-[13px] font-black transition-all shadow-[0_4px_16px_rgba(196,241,53,0.3)] cursor-pointer"
            >
              Save Check-in
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
