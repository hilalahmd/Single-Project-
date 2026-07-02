import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, ArrowRight, Camera, AlertCircle, ChevronRight, Zap, Target, Trophy, Clock, CalendarDays } from 'lucide-react'
import API from '../../../shared/utils/api'

const SLOTS = ['front', 'back', 'left', 'right']
const SLOT_LABELS = { front: 'Front View', back: 'Back View', left: 'Left Side', right: 'Right Side' }
const TIMELINE_KEYS = ['threeMonths', 'sixMonths', 'oneYear']

const TIMELINE_CONFIG = {
  threeMonths: {
    accent: '#f59e0b', bg: 'from-yellow-500/10', border: 'border-yellow-500/30',
    text: 'text-yellow-400', icon: Clock, label: '3 Months',
    silhouettePhase: 1, // 1 = slightly leaner
  },
  sixMonths: {
    accent: '#10b981', bg: 'from-emerald-500/10', border: 'border-emerald-500/30',
    text: 'text-emerald-400', icon: Target, label: '6 Months',
    silhouettePhase: 2, // 2 = noticeably leaner & more muscular
  },
  oneYear: {
    accent: '#ff6b1a', bg: 'from-orange-500/10', border: 'border-orange-500/30',
    text: 'text-orange-400', icon: Trophy, label: '1 Year',
    silhouettePhase: 3, // 3 = athletic/defined
  },
}

/* ── Progressive body silhouette SVG ─────────────────────────────────────── */
function TransformedSilhouette({ phase = 1, accent = '#ff6b1a', goal = 'Both' }) {
  // Phase 1 = slight change, Phase 2 = moderate, Phase 3 = athletic
  const shoulderW = phase === 1 ? 80 : phase === 2 ? 90 : 100
  const waistW    = phase === 1 ? 55 : phase === 2 ? 48 : 40
  const hipW      = phase === 1 ? 62 : phase === 2 ? 60 : 58
  const neckW     = 18
  const headR     = 20

  // Muscle bulk added per phase for Build Muscle goal
  const showMuscles = goal === 'Build Muscle' || goal === 'Both'
  const muscleLine  = phase >= 2 && showMuscles

  return (
    <svg viewBox="0 0 160 340" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bodyGrad-${phase}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Head */}
      <circle cx="80" cy="28" r={headR} fill={`url(#bodyGrad-${phase})`} filter="url(#glow)" opacity="0.9" />
      {/* Neck */}
      <rect x={80 - neckW/2} y="46" width={neckW} height="14" rx="4" fill={`url(#bodyGrad-${phase})`} opacity="0.9" />

      {/* Torso — v-taper shape */}
      <path
        d={`M${80-shoulderW/2},62 Q${80-shoulderW/2-8},90 ${80-waistW/2},130 Q${80-hipW/2-4},148 ${80-hipW/2},165 L${80+hipW/2},165 Q${80+hipW/2+4},148 ${80+waistW/2},130 Q${80+shoulderW/2+8},90 ${80+shoulderW/2},62 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.9"
        filter="url(#glow)"
      />

      {/* Abs lines (phase 2+, lose fat or both) */}
      {phase >= 2 && (goal === 'Lose Fat' || goal === 'Both') && [100, 115].map((y, i) => (
        <line key={i} x1={80-12} y1={y} x2={80+12} y2={y} stroke={accent} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      ))}
      {phase >= 3 && (goal === 'Lose Fat' || goal === 'Both') && (
        <line x1={80} y1="95" x2={80} y2="130" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      )}

      {/* Chest separation (phase 2+, build muscle or both) */}
      {muscleLine && (
        <line x1={80-2} y1="68" x2={80-2} y2="90" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      )}

      {/* Arms */}
      {/* Left arm */}
      <path
        d={`M${80-shoulderW/2+4},68 Q${80-shoulderW/2-12},100 ${80-shoulderW/2-8},145 L${80-shoulderW/2+4},145 Q${80-shoulderW/2+6},100 ${80-shoulderW/2+8},68 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.85"
      />
      {/* Right arm */}
      <path
        d={`M${80+shoulderW/2-4},68 Q${80+shoulderW/2+12},100 ${80+shoulderW/2+8},145 L${80+shoulderW/2-4},145 Q${80+shoulderW/2-6},100 ${80+shoulderW/2-8},68 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.85"
      />

      {/* Left forearm */}
      <path
        d={`M${80-shoulderW/2-7},145 Q${80-shoulderW/2-14},170 ${80-shoulderW/2-10},195 L${80-shoulderW/2-2},195 Q${80-shoulderW/2+2},170 ${80-shoulderW/2+5},145 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.75"
      />
      {/* Right forearm */}
      <path
        d={`M${80+shoulderW/2+7},145 Q${80+shoulderW/2+14},170 ${80+shoulderW/2+10},195 L${80+shoulderW/2+2},195 Q${80+shoulderW/2-2},170 ${80+shoulderW/2-5},145 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.75"
      />

      {/* Legs */}
      {/* Left thigh */}
      <path
        d={`M${80-hipW/2+4},165 Q${80-hipW/2-6},200 ${80-hipW/2-4},250 L${80-hipW/2+14},250 Q${80-hipW/2+10},200 ${80-hipW/2+16},165 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.85"
      />
      {/* Right thigh */}
      <path
        d={`M${80+hipW/2-4},165 Q${80+hipW/2+6},200 ${80+hipW/2+4},250 L${80+hipW/2-14},250 Q${80+hipW/2-10},200 ${80+hipW/2-16},165 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.85"
      />

      {/* Left calf */}
      <path
        d={`M${80-hipW/2-2},250 Q${80-hipW/2-8},280 ${80-hipW/2-4},315 L${80-hipW/2+10},315 Q${80-hipW/2+8},280 ${80-hipW/2+16},250 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.75"
      />
      {/* Right calf */}
      <path
        d={`M${80+hipW/2+2},250 Q${80+hipW/2+8},280 ${80+hipW/2+4},315 L${80+hipW/2-10},315 Q${80+hipW/2-8},280 ${80+hipW/2-16},250 Z`}
        fill={`url(#bodyGrad-${phase})`}
        opacity="0.75"
      />

      {/* Glow outline */}
      <ellipse cx="80" cy="280" rx={shoulderW * 0.4} ry="6" fill={accent} opacity="0.15" />
    </svg>
  )
}

/* ── Main Page Component ──────────────────────────────────────────────────── */
export default function TransformPreviewPage() {
  const navigate = useNavigate()
  const fileRefs = useRef({})

  const [uploads, setUploads]     = useState({ front: null, back: null, left: null, right: null })
  const [previews, setPreviews]   = useState({ front: null, back: null, left: null, right: null })
  const [goal, setGoal]           = useState('')
  const [timeline, setTimeline]   = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError]         = useState(null)
  const [result, setResult]       = useState(null)
  const [activeTab, setActiveTab] = useState('threeMonths')

  const handleUploadClick = (slot) => fileRefs.current[slot]?.click()

  const handleFileChange = (slot, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploads(prev  => ({ ...prev,  [slot]: reader.result }))
      setPreviews(prev => ({ ...prev, [slot]: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const allUploaded  = SLOTS.every(s => uploads[s] !== null)
  const canGenerate  = allUploaded && goal !== '' && timeline !== ''

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch(`${API}/food-ai/analyze-transformation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ images: uploads, goal, timeline })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Analysis failed')
      setResult(data.analysis)
      setActiveTab('threeMonths')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setUploads({ front: null, back: null, left: null, right: null })
    setPreviews({ front: null, back: null, left: null, right: null })
    setGoal(''); setTimeline(''); setResult(null); setError(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative font-sans overflow-x-hidden pt-24 pb-20">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6b1a]/20 to-[#ff8c3a]/20 border border-[#ff6b1a]/50 rounded-full px-4 py-2 mb-6">
            <span className="text-[#ff6b1a] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6b1a] animate-pulse" /> AI PREVIEW
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 font-['Syne'] tracking-tight uppercase leading-tight">
            See Your Transformation<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a]">Before You Start.</span>
          </h1>
          <p className="text-[#9ca3af] font-medium text-lg leading-relaxed">
            Upload 4 photos, choose your goal — get AI-powered before/after visuals for 3 months, 6 months, and 1 year.
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Upload & Goal Form ── */}
        {!result && (
          <div className="space-y-10 bg-[#0f1117] border border-white/[0.08] rounded-2xl p-8 sm:p-12 shadow-2xl relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff6b1a]/4 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-bold font-['Syne'] uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm">1</span>
                Upload Your 4 Photos
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {SLOTS.map(slot => (
                  <div key={slot}>
                    <input type="file" accept="image/*" capture="environment"
                      ref={el => fileRefs.current[slot] = el}
                      onChange={e => handleFileChange(slot, e)}
                      className="hidden"
                    />
                    <div
                      onClick={() => handleUploadClick(slot)}
                      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden aspect-[3/4] ${
                        previews[slot]
                          ? 'border-[#ff6b1a]'
                          : 'border-white/15 bg-black/40 hover:border-[#ff6b1a]/50 hover:bg-white/5'
                      }`}
                    >
                      {previews[slot] ? (
                        <>
                          <img src={previews[slot]} alt={slot} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                            <CheckCircle2 size={28} className="text-[#ff6b1a] mb-2 drop-shadow-lg" />
                            <span className="text-white font-bold text-xs">{SLOT_LABELS[slot]}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Camera size={26} className="text-[#9ca3af] mb-3" />
                          <span className="text-[#9ca3af] text-xs text-center leading-relaxed">
                            Tap to upload<br />
                            <span className="font-bold text-white">{SLOT_LABELS[slot]}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-white/[0.08]" />

            {/* Step 2 */}
            <div>
              <h3 className="text-xl font-bold font-['Syne'] uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm">2</span>
                Select Your Goal
              </h3>
              <div className="flex flex-wrap gap-4">
                {['Lose Fat', 'Build Muscle', 'Both'].map(g => (
                  <button key={g} onClick={() => setGoal(g)}
                    className={`px-8 py-4 rounded-full font-bold transition-all duration-300 text-sm sm:text-base ${
                      goal === g
                        ? 'bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white shadow-[0_0_20px_rgba(255,107,26,0.3)]'
                        : 'bg-transparent border-2 border-white/15 text-[#a1a1aa] hover:border-white/40 hover:text-white'
                    }`}
                  >{g}</button>
                ))}
              </div>
            </div>

            <hr className="border-white/[0.08]" />

            {/* Step 3: Timeline */}
            <div>
              <h3 className="text-xl font-bold font-['Syne'] uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm">3</span>
                Select Timeline
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: '3 Months', icon: Clock, color: '#f59e0b', desc: 'Foundation phase' },
                  { key: '6 Months', icon: Target, color: '#10b981', desc: 'Visible results' },
                  { key: '1 Year',   icon: Trophy, color: '#ff6b1a', desc: 'Full transformation' },
                ].map(t => (
                  <button key={t.key} onClick={() => setTimeline(t.key)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl font-bold transition-all duration-300 text-sm ${
                      timeline === t.key
                        ? 'border-2 text-white shadow-[0_0_20px_rgba(255,107,26,0.15)]'
                        : 'border-2 border-white/10 text-[#6b7280] hover:border-white/30 hover:text-white bg-black/20'
                    }`}
                    style={timeline === t.key ? { borderColor: t.color, background: t.color + '15' } : {}}
                  >
                    <t.icon size={22} style={{ color: timeline === t.key ? t.color : '#6b7280' }} />
                    <span className="text-base font-black">{t.key}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-70">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <div className="pt-2">
              <button onClick={handleGenerate} disabled={!canGenerate || isGenerating}
                className="w-full sm:w-auto px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white hover:shadow-[0_0_30px_rgba(255,107,26,0.4)]"
              >
                {isGenerating ? (
                  <><Loader2 size={20} className="animate-spin" />AI is analyzing your physique...</>
                ) : (
                  <><Zap size={18} />Generate My Transformation</>
                )}
              </button>
              {!allUploaded && <p className="text-xs text-[#6b7280] mt-3">Upload all 4 photos to continue.</p>}
            </div>
          </div>
        )}

        {/* ── Results Section ── */}
        {result && (
          <div className="space-y-10">

            {/* Current snapshot */}
            <div className="bg-[#0f1117] border border-white/[0.08] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-36 shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-2">Your Photo (Before)</p>
                <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                  <img src={previews.front} alt="Before" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-3">AI Current Analysis</div>
                <h2 className="text-xl font-black font-['Syne'] text-white mb-4 uppercase">Your Starting Point</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ['Est. Body Fat', result.currentAnalysis?.estimatedBodyFat],
                    ['Body Type',    result.currentAnalysis?.bodyType],
                    ['Strengths',    result.currentAnalysis?.visibleStrengths],
                    ['Focus Areas',  result.currentAnalysis?.keyAreas],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-black/30 rounded-xl p-3 border border-white/5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#6b7280] mb-1">{label}</p>
                      <p className="text-xs font-bold text-white leading-snug">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Timeline section heading ── */}
            <div>
              <h2 className="text-2xl font-black font-['Syne'] uppercase text-white mb-2">Your Transformation Timeline</h2>
              <p className="text-sm text-[#6b7280]">Select a milestone to see your projected before/after and plan details.</p>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 bg-black/30 rounded-xl p-1.5 border border-white/[0.08]">
              {TIMELINE_KEYS.map(key => {
                const col = TIMELINE_CONFIG[key]
                const Icon = col.icon
                return (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                      activeTab === key
                        ? `bg-gradient-to-r ${col.bg} to-transparent border ${col.border} ${col.text}`
                        : 'text-[#6b7280] hover:text-white'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:block">{col.label}</span>
                    <span className="sm:hidden">{key === 'threeMonths' ? '3M' : key === 'sixMonths' ? '6M' : '1Y'}</span>
                  </button>
                )
              })}
            </div>

            {/* ── Active Tab Panel ── */}
            {TIMELINE_KEYS.map(key => {
              if (activeTab !== key) return null
              const t   = result.timelines[key]
              const col = TIMELINE_CONFIG[key]
              const Icon = col.icon

              return (
                <div key={key} className="space-y-6">

                  {/* Before / After visual comparison */}
                  <div className={`bg-[#0f1117] border ${col.border} rounded-2xl p-6 sm:p-8 relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${col.bg} to-transparent opacity-40 pointer-events-none`} />
                    
                    <div className={`inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border ${col.border} bg-black/30`}>
                      <Icon size={13} style={{ color: col.accent }} />
                      <span className={`text-xs font-black uppercase tracking-widest ${col.text}`}>{col.label} Projection</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 items-end relative z-10">
                      {/* Before */}
                      <div className="space-y-3">
                        <div className="inline-block px-3 py-1 bg-black/50 border border-white/10 rounded-full text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">
                          Before — Now
                        </div>
                        <div className="aspect-[3/4] bg-black/30 rounded-xl border border-white/10 overflow-hidden relative">
                          <img src={previews.front} alt="Before" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{result.currentAnalysis?.estimatedBodyFat} body fat</p>
                          </div>
                        </div>
                      </div>

                      {/* After — AI physique silhouette */}
                      <div className="space-y-3">
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                          style={{ background: col.accent + '22', borderColor: col.accent + '55', color: col.accent }}>
                          After — {col.label} ✦ AI Projected
                        </div>
                        <div className="aspect-[3/4] rounded-xl border overflow-hidden relative flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, #14161f, #0a0a0a)`, borderColor: col.accent + '44' }}>
                          <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 60px ${col.accent}11` }} />
                          <div className="w-4/5 h-5/6 relative z-10">
                            <TransformedSilhouette
                              phase={TIMELINE_CONFIG[key].silhouettePhase}
                              accent={col.accent}
                              goal={goal}
                            />
                          </div>
                          {/* Projected stats overlay */}
                          <div className="absolute bottom-0 inset-x-0 p-3" style={{ background: `linear-gradient(to top, ${col.accent}22, transparent)` }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: col.accent }}>{t?.projectedBodyFat} projected</p>
                            <p className="text-white font-bold text-xs">{t?.projectedMuscleMass}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Projections */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Projected Body Fat', value: t?.projectedBodyFat },
                      { label: 'Fat Loss',           value: t?.fatLoss },
                      { label: 'Muscle Gain',        value: t?.projectedMuscleMass },
                      { label: 'Workouts / Week',    value: `${t?.workoutsPerWeek}x sessions` },
                    ].map((s, i) => (
                      <div key={i} className={`bg-[#0f1117] border ${col.border} rounded-2xl p-5 relative overflow-hidden`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${col.bg} to-transparent opacity-50`} />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#6b7280] mb-2 relative z-10">{s.label}</p>
                        <p className={`text-xl font-black font-['Syne'] relative z-10 ${col.text}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Nutrition + Milestones */}
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className={`bg-[#0f1117] border ${col.border} rounded-2xl p-6`}>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] mb-4">Daily Targets</h4>
                      <div className="space-y-3">
                        {[
                          ['Calories', `${t?.weeklyCalories} kcal`],
                          ['Protein',  `${t?.weeklyProtein}g`],
                          ['Training', `${t?.workoutsPerWeek}x / week`],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between items-center">
                            <span className="text-sm text-[#9ca3af]">{label}</span>
                            <span className={`font-bold text-sm ${col.text}`}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`bg-[#0f1117] border ${col.border} rounded-2xl p-6 col-span-1 sm:col-span-2`}>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] mb-3">Key Changes & Milestones</h4>
                      <p className="text-sm text-[#9ca3af] leading-relaxed mb-4">{t?.keyChanges}</p>
                      <div className="space-y-2">
                        {t?.milestones?.map((m, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: col.accent + '22', border: `1px solid ${col.accent}44` }}>
                              <ChevronRight size={11} style={{ color: col.accent }} />
                            </div>
                            <span className="text-sm text-white font-medium">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Motivation note */}
                  <div className={`bg-gradient-to-r ${col.bg} to-transparent border ${col.border} rounded-xl p-5 flex items-start gap-4`}>
                    <Icon size={22} style={{ color: col.accent }} className="shrink-0 mt-0.5" />
                    <p className={`text-sm font-semibold italic ${col.text}`}>{t?.motivationNote}</p>
                  </div>
                </div>
              )
            })}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4">
              <button onClick={handleReset}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm border-2 border-white/15 text-[#9ca3af] hover:border-white/40 hover:text-white transition-all">
                Start Over
              </button>
              <button onClick={() => navigate('/trainers')}
                className="w-full sm:flex-1 flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(255,107,26,0.5)] transition-all duration-300">
                Get a Real Coach to Make This Happen <ArrowRight size={18} />
              </button>
            </div>

            <p className="text-center text-[#6b7280] text-xs italic pb-4">
              AI-generated projection for illustration. Actual results depend on training consistency, nutrition, sleep and genetics.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
