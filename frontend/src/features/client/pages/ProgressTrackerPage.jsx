import { useState } from 'react'
import { ArrowDownRight, TrendingUp, Scale, Percent } from 'lucide-react'

// ─── Mini SVG Line Chart ───────────────────────────────────────────────────
function LineChartSVG({ data, color = '#F97316', height = 120 }) {
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
  const max = Math.max(...data.map(d => d.value))
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

// ─── Data ──────────────────────────────────────────────────────────────────
const weightData = [
  { label: 'Sep 24', value: 75.7 },
  { label: 'Oct 1',  value: 75.2 },
  { label: 'Oct 8',  value: 74.8 },
  { label: 'Oct 15', value: 74.5 },
]

const strengthData = [
  { label: 'Sep 23', value: 1000 },
  { label: 'Sep 30', value: 1080 },
  { label: 'Oct 7',  value: 1150 },
  { label: 'Oct 14', value: 1200 },
]

const GLASS = 'bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all'

export default function ProgressTrackerPage() {
  const [strengthExercise, setStrengthExercise] = useState('Bench Press')

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Progress Tracker</h1>
          <p className="text-gray-400 mt-1 font-medium">Visualize your transformation.</p>
        </div>
        <button className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(249,115,22,0.3)]">
          Log Today's Metrics
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Current Weight', value: '74.5', unit: 'kg', delta: '-1.2kg this month', icon: Scale, up: false },
          { label: 'Goal Weight',    value: '68.0', unit: 'kg', delta: '6.5kg remaining',   icon: TrendingUp, up: null },
          { label: 'Body Fat %',     value: '18.5', unit: '%',  delta: '-0.8% this month',  icon: Percent, up: false },
          { label: 'BMI',            value: '23.8', unit: '',   delta: 'Normal Range',       icon: Scale, up: null },
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
              <p className={`text-xs font-bold flex items-center gap-1 ${s.up === false ? 'text-[#F97316]' : 'text-gray-500'}`}>
                {s.up === false && <ArrowDownRight size={13} strokeWidth={3} />}
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
            {/* Y labels + chart */}
            <div className="flex gap-2 items-end h-36">
              <div className="flex flex-col justify-between h-full pb-1 text-[10px] font-bold text-gray-500 text-right w-10 shrink-0">
                <span>76</span><span>75.5</span><span>75</span><span>74.5</span>
              </div>
              <div className="flex-1 relative h-full">
                {/* grid lines */}
                {[0, 33, 66, 100].map(p => (
                  <div key={p} className="absolute w-full border-t border-white/5" style={{ top: `${p}%` }} />
                ))}
                <LineChartSVG data={weightData} color="#F97316" height={130} />
              </div>
            </div>
            {/* X labels */}
            <div className="flex justify-between pl-12 mt-1">
              {weightData.map(d => (
                <span key={d.label} className="text-[10px] font-bold text-gray-500">{d.label}</span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-2">
              <span>Date</span><span>Weight</span><span>Change</span>
            </div>
            {[
              { d: 'Oct 15', w: '74.5 kg', c: '−0.3 kg' },
              { d: 'Oct 8',  w: '74.8 kg', c: '−0.4 kg' },
              { d: 'Oct 1',  w: '75.2 kg', c: '−0.5 kg' },
              { d: 'Sep 24', w: '75.7 kg', c: '−0.2 kg' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm font-bold py-1.5 border-t border-white/5">
                <span className="text-gray-400">{row.d}</span>
                <span className="text-white">{row.w}</span>
                <span className="text-[#F97316]">{row.c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strength Progress */}
        <div className={`${GLASS} p-6`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white">Strength Progress</h2>
            <select
              value={strengthExercise}
              onChange={e => setStrengthExercise(e.target.value)}
              className="text-sm font-bold bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-gray-200 focus:outline-none focus:border-[#F97316] transition-all"
            >
              <option>Bench Press</option>
              <option>Squat</option>
              <option>Deadlift</option>
            </select>
          </div>

          {/* Bar Chart */}
          <div className="mb-6 px-1">
            <div className="flex gap-2 items-end h-36">
              <div className="flex flex-col justify-between h-full pb-1 text-[10px] font-bold text-gray-500 text-right w-12 shrink-0">
                <span>1200</span><span>1100</span><span>1000</span><span>900</span>
              </div>
              <div className="flex-1 relative h-full">
                {[0, 33, 66, 100].map(p => (
                  <div key={p} className="absolute w-full border-t border-white/5" style={{ top: `${p}%` }} />
                ))}
                <BarChartSVG data={strengthData} color="#F97316" height={130} />
              </div>
            </div>
            <div className="flex justify-between pl-14 mt-1">
              {strengthData.map(d => (
                <span key={d.label} className="text-[10px] font-bold text-gray-500">{d.label}</span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest pb-2">
              <span>Date</span><span>1RM Est.</span><span>Volume</span>
            </div>
            {[
              { d: 'Oct 14', w: '65 kg',   c: '1,200 kg' },
              { d: 'Oct 7',  w: '62.5 kg', c: '1,150 kg' },
              { d: 'Sep 30', w: '60 kg',   c: '1,080 kg' },
              { d: 'Sep 23', w: '57.5 kg', c: '1,000 kg' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm font-bold py-1.5 border-t border-white/5">
                <span className="text-gray-400">{row.d}</span>
                <span className="text-white">{row.w}</span>
                <span className="text-[#F97316]">{row.c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body Measurements */}
      <div className={`${GLASS} p-6`}>
        <h2 className="text-xl font-bold text-white mb-6">Body Measurements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Chest',    value: '96 cm',  prev: '98 cm',  down: true  },
            { label: 'Waist',    value: '82 cm',  prev: '86 cm',  down: true  },
            { label: 'Hips',     value: '94 cm',  prev: '95 cm',  down: true  },
            { label: 'Thigh',    value: '58 cm',  prev: '58 cm',  down: null  },
            { label: 'Arm',      value: '35 cm',  prev: '34 cm',  down: false },
            { label: 'Neck',     value: '38 cm',  prev: '38.5 cm',down: true  },
          ].map((m, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#F97316]/30 transition-all">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{m.label}</p>
              <p className="text-xl font-black text-white mb-1">{m.value}</p>
              <p className={`text-[10px] font-bold ${m.down === true ? 'text-[#F97316]' : m.down === false ? 'text-[#22C55E]' : 'text-gray-500'}`}>
                prev {m.prev}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
