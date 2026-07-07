import { useState } from 'react'
import { ArrowDownRight, TrendingUp, Scale, Percent } from 'lucide-react'
import Modal from '../../../shared/components/Modal'
import Toast from '../../../shared/components/Toast'

// ─── Mini SVG Line Chart ───────────────────────────────────────────────────
function LineChartSVG({ data, color = '#F97316', height = 120 }) {
  if (data.length === 0) return null
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min || 1
  const w = 100
  const pad = 4

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (d.value - min) / range) * (height - pad * 2)
    return `${x},${y}`
  })

  const polyline = points.join(' ')
  const areaPoints = `${pad},${height - pad} ${polyline} ${w - pad},${height - pad}`

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#','')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2)
        const y = pad + (1 - (d.value - min) / range) * (height - pad * 2)
        return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="#07080C" strokeWidth="2" />
      })}
    </svg>
  )
}

// ─── Mini SVG Bar Chart ────────────────────────────────────────────────────
function BarChartSVG({ data, color = '#F97316', height = 120 }) {
  if (data.length === 0) return null
  const max = Math.max(...data.map(d => d.value)) || 1
  const gap = 4
  const totalGap = gap * (data.length + 1)
  const barW = (100 - totalGap) / data.length

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bargrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = gap + i * (barW + gap)
        const barH = (d.value / max) * (height - 12)
        const y = height - barH - 4
        return (
          <rect key={i} x={x} y={y} width={barW} height={barH} rx="3" fill="url(#bargrad)" />
        )
      })}
    </svg>
  )
}

const GLASS = 'bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all'

export default function ProgressTrackerPage() {
  const [strengthExercise, setStrengthExercise] = useState('Bench Press')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [hasLoggedData, setHasLoggedData] = useState(false)

  // ─── States ───────────────────────────────────────────────────────────────
  const [currentWeight, setCurrentWeight] = useState(74.5)
  const [goalWeight, setGoalWeight] = useState(68.0)
  const [bodyFat, setBodyFat] = useState(18.5)
  const [bmi, setBmi] = useState(23.8)

  const [weightHistory, setWeightHistory] = useState([
    { label: 'Sep 24', date: '2026-09-24', value: 75.7 },
    { label: 'Oct 01', date: '2026-10-01', value: 75.2 },
    { label: 'Oct 08', date: '2026-10-08', value: 74.8 },
    { label: 'Oct 15', date: '2026-10-15', value: 74.5 },
  ])

  const [exerciseData, setExerciseData] = useState({
    'Bench Press': [
      { label: 'Sep 23', date: '2026-09-23', weight: 50, reps: 8, sets: 4, value: 63, max1RM: '63 kg', vol: '1,600 kg' },
      { label: 'Sep 30', date: '2026-09-30', weight: 52.5, reps: 8, sets: 4, value: 66, max1RM: '66 kg', vol: '1,680 kg' },
      { label: 'Oct 07', date: '2026-10-07', weight: 55, reps: 8, sets: 4, value: 70, max1RM: '70 kg', vol: '1,760 kg' },
      { label: 'Oct 14', date: '2026-10-14', weight: 55, reps: 8, sets: 4, value: 70, max1RM: '70 kg', vol: '1,760 kg' },
    ],
    'Squat': [
      { label: 'Sep 23', date: '2026-09-23', weight: 80, reps: 6, sets: 4, value: 96, max1RM: '96 kg', vol: '1,920 kg' },
      { label: 'Sep 30', date: '2026-09-30', weight: 85, reps: 6, sets: 4, value: 102, max1RM: '102 kg', vol: '2,040 kg' },
      { label: 'Oct 07', date: '2026-10-07', weight: 90, reps: 6, sets: 4, value: 108, max1RM: '108 kg', vol: '2,160 kg' },
      { label: 'Oct 14', date: '2026-10-14', weight: 90, reps: 6, sets: 4, value: 108, max1RM: '108 kg', vol: '2,160 kg' },
    ],
    'Deadlift': [
      { label: 'Sep 23', date: '2026-09-23', weight: 100, reps: 5, sets: 4, value: 117, max1RM: '117 kg', vol: '2,000 kg' },
      { label: 'Sep 30', date: '2026-09-30', weight: 105, reps: 5, sets: 4, value: 122, max1RM: '122 kg', vol: '2,100 kg' },
      { label: 'Oct 07', date: '2026-10-07', weight: 110, reps: 5, sets: 4, value: 128, max1RM: '128 kg', vol: '2,200 kg' },
      { label: 'Oct 14', date: '2026-10-14', weight: 110, reps: 5, sets: 4, value: 128, max1RM: '128 kg', vol: '2,200 kg' },
    ],
  })

  const [measurements, setMeasurements] = useState([
    { label: 'Chest',    value: 96,   unit: 'cm', prev: 98,   down: true  },
    { label: 'Waist',    value: 82,   unit: 'cm', prev: 86,   down: true  },
    { label: 'Hips',     value: 94,   unit: 'cm', prev: 95,   down: true  },
    { label: 'Thigh',    value: 58,   unit: 'cm', prev: 58,   down: null  },
    { label: 'Arm',      value: 35,   unit: 'cm', prev: 34,   down: false },
    { label: 'Neck',     value: 38,   unit: 'cm', prev: 38.5, down: true  },
  ])

  const [activeTab, setActiveTab] = useState('metrics')

  // ─── Daily Progress Photos State ───
  const [photos, setPhotos] = useState([
    { id: 1, date: 'Oct 01, 2026', time: '09:30 AM', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80', tag: 'Front' },
    { id: 2, date: 'Oct 08, 2026', time: '09:15 AM', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80', tag: 'Front' },
    { id: 3, date: 'Oct 15, 2026', time: '08:45 AM', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', tag: 'Front' }
  ])
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

  const handleSave = (e) => {
    e.preventDefault()

    // 1. Update stats
    setCurrentWeight(Number(formWeight))
    setBodyFat(Number(formBodyFat))

    const dateObj = new Date(formDate)
    const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })

    // 2. Update weight history
    setWeightHistory(prev => {
      const filtered = prev.filter(w => w.date !== formDate)
      const list = [...filtered, { label: dateStr, date: formDate, value: Number(formWeight) }]
      return list.sort((a, b) => new Date(a.date) - new Date(b.date))
    })

    // 3. Calculate and update strength details
    const weightVal = Number(formExWeight)
    const repsVal = Number(formExReps)
    const setsVal = Number(formExSets)
    const est1RM = Math.round(weightVal * (1 + repsVal / 30))
    const totalVolume = Math.round(weightVal * repsVal * setsVal)

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

    // 4. Update measurements
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

    // Update BMI
    const newBmi = (Number(formWeight) / (1.77 * 1.77)).toFixed(1)
    setBmi(newBmi)

    setModalOpen(false)
    setHasLoggedData(true)
    setToastMessage("Daily check-in logs updated successfully!")
  }

  const getProgressiveOverloadAlert = (exercise) => {
    const list = exerciseData[exercise] || []
    if (list.length < 2) return null

    const last = list[list.length - 1]
    const prev = list[list.length - 2]

    if (last.weight === prev.weight) {
      const nextWeight = last.weight + 2.5
      return {
        type: 'warning',
        text: `💡 Progressive Overload Suggestion: You have used the same weight (${last.weight} kg) for ${exercise} in consecutive sessions. Try increasing by 2.5 kg to ${nextWeight} kg in your next session to force strength adaptation!`
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
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Progress Tracker</h1>
          <p className="text-gray-400 mt-1 font-medium">Visualize your transformation.</p>
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
            className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(249,115,22,0.3)] cursor-pointer"
          >
            Log Today's Metrics
          </button>
        )}
      </div>

      {/* Demo data notice — shown until user logs their first check-in */}
      {!hasLoggedData && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p className="text-amber-300/90">
            <span className="font-bold">Sample data shown.</span> These are demo values — tap{' '}
            <button
              onClick={() => { setFormWeight(currentWeight); setFormBodyFat(bodyFat); setFormDate(new Date().toISOString().split('T')[0]); setFormMeasurements(measurements.reduce((acc, m) => ({ ...acc, [m.label]: m.value }), {})); setModalOpen(true) }}
              className="underline font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Log Today's Metrics
            </button>{' '}
            to replace them with your real data.
          </p>
        </div>
      )}

      {/* Tab Bar */}
      <div className="border-b border-white/10 flex gap-8">
        {[
          { id: 'metrics', label: 'Metrics & Charts' },
          { id: 'gallery', label: 'Transformation Gallery' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold capitalize transition-colors relative ${
              activeTab === tab.id ? 'text-[#F97316]' : 'text-gray-400 hover:text-[#F97316]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F97316] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ─── METRICS TAB ─── */}
      {activeTab === 'metrics' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Stats Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Current Weight', value: currentWeight.toFixed(1), unit: 'kg', delta: `${(currentWeight - weightHistory[0].value).toFixed(1)}kg this month`, icon: Scale, up: (currentWeight < weightHistory[0].value ? false : currentWeight > weightHistory[0].value ? true : null) },
              { label: 'Goal Weight',    value: goalWeight.toFixed(1), unit: 'kg', delta: `${Math.abs(currentWeight - goalWeight).toFixed(1)}kg remaining`,   icon: TrendingUp, up: null },
              { label: 'Body Fat %',     value: bodyFat.toFixed(1), unit: '%',  delta: `${(bodyFat - 19.3).toFixed(1)}% this month`,  icon: Percent, up: (bodyFat < 19.3 ? false : bodyFat > 19.3 ? true : null) },
              { label: 'BMI',            value: bmi, unit: '',   delta: 'Normal Range',       icon: Scale, up: null },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className={`${GLASS} p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                      <Icon size={14} className="text-[#F97316]" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-white mb-1">
                    {s.value} <span className="text-sm font-bold text-gray-500">{s.unit}</span>
                  </p>
                  <p className={`text-xs font-bold flex items-center gap-1 ${s.up === false ? 'text-[#22C55E]' : s.up === true ? 'text-[#EF4444]' : 'text-gray-500'}`}>
                    {s.up === false && <ArrowDownRight size={13} strokeWidth={3} className="rotate-90" />}
                    {s.delta}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Weight Progress */}
            <div className={`${GLASS} p-6`}>
              <h2 className="text-xl font-bold text-white mb-5">Weight Progress</h2>

              {/* Chart */}
              <div className="mb-6 px-1">
                <div className="flex gap-2 items-end h-36">
                  <div className="flex flex-col justify-between h-full pb-1 text-[10px] font-bold text-gray-500 text-right w-10 shrink-0">
                    <span>{(Math.max(...weightHistory.map(d => d.value)) + 0.5).toFixed(1)}</span>
                    <span>{((Math.max(...weightHistory.map(d => d.value)) + Math.min(...weightHistory.map(d => d.value))) / 2).toFixed(1)}</span>
                    <span>{(Math.min(...weightHistory.map(d => d.value)) - 0.5).toFixed(1)}</span>
                  </div>
                  <div className="flex-1 relative h-full">
                    {[0, 50, 100].map(p => (
                      <div key={p} className="absolute w-full border-t border-white/5" style={{ top: `${p}%` }} />
                    ))}
                    <LineChartSVG data={weightHistory} color="#F97316" height={130} />
                  </div>
                </div>
                <div className="flex justify-between pl-12 mt-1">
                  {weightHistory.map((d, index) => (
                    <span key={index} className="text-[10px] font-bold text-gray-500">{d.label}</span>
                  ))}
                </div>
              </div>

              {/* Table (Inner Scrollable container) */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-2 px-1">
                  <span>Date</span><span>Weight</span><span>Change</span>
                </div>
                
                <div className="max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2">
                  {[...weightHistory].reverse().map((row, i) => {
                    const prevVal = weightHistory[weightHistory.length - 1 - i - 1]?.value
                    const diff = prevVal ? row.value - prevVal : 0
                    return (
                      <div key={i} className="flex justify-between text-xs font-bold py-2 border-t border-white/5 px-1 items-center">
                        <span className="text-gray-400">{row.label}</span>
                        <span className="text-white">{row.value.toFixed(1)} kg</span>
                        <span className={diff < 0 ? 'text-[#22C55E]' : diff > 0 ? 'text-red-400' : 'text-gray-500'}>
                          {diff < 0 ? `−${Math.abs(diff).toFixed(1)} kg` : diff > 0 ? `+${diff.toFixed(1)} kg` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Strength Progress */}
            <div className={`${GLASS} p-6`}>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-white">Strength Progress</h2>
                <select
                  value={strengthExercise}
                  onChange={e => setStrengthExercise(e.target.value)}
                  className="text-sm font-bold bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-gray-200 focus:outline-none focus:border-[#F97316] transition-all cursor-pointer"
                >
                  <option>Bench Press</option>
                  <option>Squat</option>
                  <option>Deadlift</option>
                </select>
              </div>

              {/* Dynamic overload banner inside the card */}
              {(() => {
                const alertObj = getProgressiveOverloadAlert(strengthExercise)
                if (!alertObj) return null
                return (
                  <div className={`p-4 rounded-xl text-xs font-bold mb-4 border leading-relaxed animate-fade-in ${
                    alertObj.type === 'warning' 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                      : 'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    {alertObj.text}
                  </div>
                )
              })()}

              {/* Bar Chart */}
              <div className="mb-6 px-1">
                <div className="flex gap-2 items-end h-36">
                  <div className="flex flex-col justify-between h-full pb-1 text-[10px] font-bold text-gray-500 text-right w-12 shrink-0">
                    <span>{(Math.max(...strengthData.map(d => d.value)) * 1.05).toFixed(0)}</span>
                    <span>{(Math.max(...strengthData.map(d => d.value)) * 0.5).toFixed(0)}</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 relative h-full">
                    {[0, 50, 100].map(p => (
                      <div key={p} className="absolute w-full border-t border-white/5" style={{ top: `${p}%` }} />
                    ))}
                    <BarChartSVG data={strengthData} color="#F97316" height={130} />
                  </div>
                </div>
                <div className="flex justify-between pl-14 mt-1">
                  {strengthData.map((d, index) => (
                    <span key={index} className="text-[10px] font-bold text-gray-500">{d.label}</span>
                  ))}
                </div>
              </div>

              {/* Scrollable Strength Table with custom weights and overload tracking */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-2 px-1">
                  <span className="w-16">Date</span>
                  <span className="w-20 text-center">Weight</span>
                  <span className="w-16 text-center">Change</span>
                  <span className="w-16 text-center">1RM Est.</span>
                  <span className="w-20 text-right">Volume</span>
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
                        diffClass = 'text-gray-400'
                      }
                    }

                    return (
                      <div key={i} className="flex justify-between text-xs font-bold py-2 border-t border-white/5 items-center px-1">
                        <span className="text-gray-400 w-16">{row.label}</span>
                        <span className="text-white w-20 text-center">{row.weight} kg</span>
                        <span className={`w-16 text-center ${diffClass}`}>{diffText}</span>
                        <span className="text-white w-16 text-center">{row.max1RM}</span>
                        <span className="text-[#F97316] w-20 text-right">{row.vol}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Body Measurements */}
          <div className={`${GLASS} p-6`}>
            <h2 className="text-xl font-bold text-white mb-6">Body Measurements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {measurements.map((m, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#F97316]/30 transition-all">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{m.label}</p>
                  <p className="text-xl font-black text-white mb-1">{m.value} {m.unit}</p>
                  <p className={`text-[10px] font-bold ${m.down === true ? 'text-[#22C55E]' : m.down === false ? 'text-red-400' : 'text-gray-500'}`}>
                    prev {m.prev} {m.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      )}

      {/* ─── GALLERY TAB ─── */}
      {activeTab === 'gallery' && (
        <div className="space-y-8">
          
          {/* Daily Progress Photos Gallery & Transformation Comparison */}
          <div className={`${GLASS} p-6`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Daily Progress Photos</h2>
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
                  className="px-5 py-3 bg-[#F97316]/10 border border-[#F97316]/30 hover:bg-[#F97316] hover:text-white text-[#F97316] font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  + Upload Check-in Photo
                </label>
              </div>
            </div>

            {/* Comparison Slider / Side-by-side viewer */}
            {photos.length >= 2 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Transformation Comparison</h3>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Compare From (Before)</label>
                    <select 
                      value={compA} 
                      onChange={e => setCompA(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F97316] cursor-pointer"
                    >
                      {photos.map(p => (
                        <option key={p.id} value={p.id}>{p.date} ({p.tag})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Compare To (After)</label>
                    <select 
                      value={compB} 
                      onChange={e => setCompB(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-white/10 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#F97316] cursor-pointer"
                    >
                      {photos.map(p => (
                        <option key={p.id} value={p.id}>{p.date} ({p.tag})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Images layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-black/40 border border-white/10 flex items-center justify-center">
                    <img 
                      src={photos.find(p => p.id === compA)?.url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80'} 
                      alt="Before" 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-3 left-3 bg-black/80 border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      Before: {photos.find(p => p.id === compA)?.date}
                    </span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-black/40 border border-white/10 flex items-center justify-center">
                    <img 
                      src={photos.find(p => p.id === compB)?.url || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'} 
                      alt="After" 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-3 left-3 bg-[#F97316] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      After: {photos.find(p => p.id === compB)?.date}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Timeline */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Photo Check-in Timeline</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-white/5 border border-white/10 hover:border-[#F97316]/50 transition-all flex flex-col shadow-sm">
                    <div className="flex-1 overflow-hidden relative">
                      <img src={photo.url} alt={photo.tag} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <span className="absolute top-2 right-2 bg-black/80 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded text-[#F97316] border border-[#F97316]/30">
                        {photo.tag}
                      </span>
                    </div>
                    <div className="p-3 bg-black/40 text-center border-t border-white/5 flex flex-col items-center justify-center min-h-[64px]">
                      <p className="text-[11px] font-bold text-white leading-none">{photo.date}</p>
                      <p className="text-[9px] text-gray-500 font-bold mt-1.5 leading-none">{photo.time}</p>
                      <button 
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-[10px] text-red-400 hover:text-red-500 font-bold mt-2 cursor-pointer transition-colors block leading-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}

      {/* ─── LOG METRICS MODAL ─── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Today's Check-in">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Check-in Date Picker */}
          <div>
            <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Check-in Date</label>
            <input
              type="date"
              required
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] cursor-pointer"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
            </div>
          </div>

          {/* Strength Check-in */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-[13px] font-bold text-white mb-3">Today's Strength Performance</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Exercise</label>
                <select
                  value={strengthExercise}
                  onChange={e => setStrengthExercise(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] cursor-pointer"
                >
                  <option>Bench Press</option>
                  <option>Squat</option>
                  <option>Deadlift</option>
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sets Completed</label>
                <input
                  type="number"
                  required
                  value={formExSets}
                  onChange={e => setFormExSets(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-[13px] font-bold text-white mb-3">Measurements (cm)</h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(formMeasurements).map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{field}</label>
                  <input
                    type="number"
                    required
                    value={formMeasurements[field]}
                    onChange={e => setFormMeasurements(prev => ({ ...prev, [field]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-3 border border-white/10 text-white hover:bg-white/10 rounded-xl text-sm font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] cursor-pointer"
            >
              Save Check-in
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

    </div>
  )
}
