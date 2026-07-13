import { useState, useRef, useEffect } from 'react'
import { Camera, Image as ImageIcon, RotateCcw, Lock, AlertCircle, Upload, Edit2, Info, Sparkles, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../../shared/utils/api'
import { addMealItem } from '../services/nutrition.service'

// ─── Animated macro bar (grows from 0 on mount) ─────────────────────────────
function AIMacroBar({ label, value, max, color, gradientTo, delay = 0 }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-400 text-[13px] font-medium w-16">{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}
        role="progressbar" aria-valuenow={value} aria-label={`${label}: ${value}g`}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${pct}%` : '0%', background: `linear-gradient(90deg, ${color}, ${gradientTo})`, boxShadow: `0 0 8px ${color}60` }} />
      </div>
      <span className="text-white font-bold text-sm w-10 text-right">{value || 0}g</span>
    </div>
  )
}

export default function FoodAIPage() {
  const navigate = useNavigate()
  const { role, subscriptionTier } = useAuth()
  const fileInputRef = useRef(null)

  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)
  const [loggedMeals, setLoggedMeals] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [selectedMealIndex, setSelectedMealIndex] = useState("1") // Default to Lunch

  const isFreeClient = role === 'user' && subscriptionTier === 'free'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/food-ai/history`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setLoggedMeals(data)
        }
      } catch (err) {}
    }
    if (!isFreeClient) fetchHistory()
  }, [isFreeClient])

  const handleUploadClick = () => { if (fileInputRef.current) fileInputRef.current.click() }

  const processFile = async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result
      setImagePreview(base64String)
      setAnalyzing(true)
      setError(null)

      try {
        const res = await fetch(`${API}/food-ai/analyze-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ imageBase64: base64String })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || data.message || 'Failed to analyze image')

        setResult(data.analysis)
      } catch (err) {
        console.error(err)
        setError(err.message)
        setImagePreview(null)
      } finally {
        setAnalyzing(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => processFile(e.target.files?.[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const handleReset = () => {
    setAnalyzing(false)
    setResult(null)
    setImagePreview(null)
    setError(null)
  }

  const handleLogMeal = async () => {
    if (!result) return
    try {
      setAnalyzing(true)
      const res = await fetch(`${API}/food-ai/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: result.name || 'Unknown Meal',
          calories: result.calories,
          macros: result.macros,
          imageUrl: imagePreview
        })
      })

      if (!res.ok) throw new Error('Failed to save meal to database')

      const savedMeal = await res.json()
      setLoggedMeals(prev => [savedMeal, ...prev])

      // Save to Nutrition Tracker
      const dateString = new Date().toLocaleDateString('en-CA')
      const nutritionItem = {
        name: result.name || 'Unknown Meal',
        calories: result.calories,
        protein: result.macros?.protein || 0,
        carbs: result.macros?.carbs || 0,
        fat: result.macros?.fat || 0
      }
      await addMealItem(dateString, Number(selectedMealIndex), nutritionItem)

      handleReset()
    } catch (err) {
      setError(err.message)
      setAnalyzing(false)
    }
  }

  const maxMacro = result ? Math.max(result.macros?.carbs || 0, result.macros?.protein || 0, result.macros?.fat || 0, 1) : 1

  return (
    <div className="relative max-w-4xl mx-auto min-h-[500px] pb-16 space-y-6">
      {/* Ambient glows — same pattern as Nutrition page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.04) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 space-y-6">

        {/* ── Free tier lock overlay ── */}
        {isFreeClient && (
          <div className="absolute inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-[20px]"
            style={{ background: 'rgba(10,10,11,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ background: 'rgba(196,241,53,0.08)', border: '1px solid rgba(196,241,53,0.2)', boxShadow: '0 0 30px rgba(196,241,53,0.1)' }}>
              <Lock size={26} style={{ color: '#C4F135' }} className="glow-pulse" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 font-['Syne']">AI Food Analyzer Locked</h3>
            <p className="text-sm text-gray-400 max-w-xs mb-7 leading-relaxed">
              Upgrade to a premium plan to unlock instant AI-powered nutritional macro breakdowns.
            </p>
            <button
              onClick={() => navigate('/plans')}
              className="px-7 py-3 rounded-full text-sm font-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #C4F135, #a3d625)', color: '#0a0a0b', boxShadow: '0 4px 20px rgba(196,241,53,0.3)' }}
            >
              Upgrade Plan
            </button>
          </div>
        )}

        <div className={`space-y-6 ${isFreeClient ? 'blur-sm pointer-events-none select-none' : ''}`}>

          {/* ── Header ── */}
          <header className="ai-card-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(196,241,53,0.12)' }}>
                <Sparkles size={14} style={{ color: '#C4F135' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#C4F135' }}>AI-Powered</span>
            </div>
            <h1 className="text-[28px] font-black text-white tracking-tight font-['Syne']">Food Analysis</h1>
            <p className="text-gray-500 text-sm mt-1">Upload a photo of your meal for an instant macro breakdown.</p>
          </header>

          {/* ── Error banner ── */}
          {error && (
            <div className="ai-card-2 flex items-center gap-3 p-4 rounded-[16px] border"
              style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}
              role="alert">
              <AlertCircle size={18} className="shrink-0 text-red-400" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload meal photo"
          />

          {/* ── Upload drop zone ── */}
          {!result && !analyzing && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`ai-card-2 relative rounded-[20px] overflow-hidden transition-all duration-300 ${
                dragOver ? 'scale-[1.02]' : 'zone-breathe'
              }`}
              style={{
                background: dragOver
                  ? 'linear-gradient(135deg, rgba(196,241,53,0.06) 0%, rgba(196,241,53,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: dragOver
                  ? '1px solid rgba(196,241,53,0.5)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: dragOver
                  ? '0 0 30px rgba(196,241,53,0.12), 0 8px 32px rgba(0,0,0,0.3)'
                  : '0 8px 32px rgba(0,0,0,0.3)',
              }}
              role="button"
              tabIndex={0}
              aria-label="Drag and drop meal photo or click to upload"
              onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
            >
              {/* Dashed border overlay — subtle animated border */}
              <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 9px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 9px)`,
              }} />

              <div className="relative z-10 py-14 px-8 flex flex-col items-center justify-center text-center">
                {/* Camera icon with glow and float animation */}
                <div className="relative mb-7">
                  {/* Glow ring */}
                  <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${dragOver ? 'opacity-100' : 'opacity-40'}`}
                    style={{ background: 'radial-gradient(circle, rgba(196,241,53,0.3) 0%, transparent 70%)', transform: 'scale(1.8)' }} />
                  {/* Icon circle */}
                  <div
                    className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 ${dragOver ? 'scale-110' : 'camera-float'}`}
                    style={{
                      background: dragOver
                        ? 'rgba(196,241,53,0.18)'
                        : 'rgba(196,241,53,0.08)',
                      border: `1px solid ${dragOver ? 'rgba(196,241,53,0.5)' : 'rgba(196,241,53,0.2)'}`,
                      boxShadow: dragOver ? '0 0 24px rgba(196,241,53,0.25)' : '0 0 16px rgba(196,241,53,0.1)',
                    }}
                  >
                    <Camera size={28} style={{ color: '#C4F135' }} />
                  </div>
                </div>

                <h2 className="text-xl font-black text-white mb-2 font-['Syne']">
                  {dragOver ? 'Drop it to analyze!' : 'Upload your meal photo'}
                </h2>
                <p className="text-gray-500 text-[13px] mb-8 max-w-xs leading-relaxed">
                  JPG or PNG · top-down shots work best · or just drag &amp; drop here
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleUploadClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                    style={{
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#e5e7eb',
                      background: 'rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                  >
                    <Upload size={15} /> Choose file
                  </button>
                  <button
                    onClick={handleUploadClick}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-black transition-all duration-200 active:scale-95 hover:-translate-y-0.5 group"
                    style={{
                      background: 'linear-gradient(135deg, #C4F135, #a3d625)',
                      color: '#0a0a0b',
                      boxShadow: '0 4px 20px rgba(196,241,53,0.3)',
                    }}
                  >
                    <Camera size={15} className="group-hover:scale-110 transition-transform duration-200" />
                    Take photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Analyzing / loading state ── */}
          {analyzing && (
            <div className="ai-card-2 relative rounded-[20px] overflow-hidden"
              style={{
                border: '1px solid rgba(196,241,53,0.15)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                boxShadow: '0 0 40px rgba(196,241,53,0.05), 0 8px 32px rgba(0,0,0,0.4)',
              }}>
              {/* Blurred photo background */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Meal being analyzed"
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.07] blur-xl"
                />
              )}
              {/* Shimmer sweep overlay */}
              <div className="absolute inset-0 shimmer-bg pointer-events-none" />

              <div className="relative z-10 py-16 flex flex-col items-center justify-center text-center gap-5">
                {/* Spinner with lime ring */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(196,241,53,0.15)' }} />
                  <div className="absolute inset-[3px] rounded-full"
                    style={{
                      border: '2px solid transparent',
                      borderTopColor: '#C4F135',
                      borderRightColor: 'rgba(196,241,53,0.3)',
                      animation: 'analyzeRing 1s linear infinite',
                    }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera size={22} style={{ color: '#C4F135' }} className="opacity-80" />
                  </div>
                </div>

                <div>
                  <p className="font-black text-white text-[17px] font-['Syne']">Analyzing your meal…</p>
                  <p className="text-gray-500 text-[13px] mt-1.5">Reading the plate · estimating portions · calculating macros</p>
                </div>

                {/* Skeleton shimmer lines */}
                <div className="w-64 space-y-2 mt-2">
                  <div className="h-2 rounded-full shimmer-bg" style={{ width: '80%', margin: '0 auto' }} />
                  <div className="h-2 rounded-full shimmer-bg" style={{ width: '60%', margin: '0 auto' }} />
                  <div className="h-2 rounded-full shimmer-bg" style={{ width: '70%', margin: '0 auto' }} />
                </div>
              </div>
            </div>
          )}

          {/* ── Results card ── */}
          {result && !analyzing && (
            <div className="result-pop rounded-[20px] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(196,241,53,0.05)',
              }}>

              {/* Result header bar */}
              <div className="flex items-center justify-between px-6 py-3.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-2">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  <span className="text-green-400 text-[10px] font-mono tracking-widest font-bold uppercase">Food Detected</span>
                </div>
                <span className="text-gray-600 text-[10px] font-mono">
                  ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-7">

                {/* Dish info row */}
                <div className="flex items-center gap-5 ai-card-1">
                  <div className="w-[76px] h-[76px] rounded-[16px] overflow-hidden shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)' }}>
                    {imagePreview
                      ? <img src={imagePreview} alt={result.name || 'Meal'} className="w-full h-full object-cover" />
                      : <ImageIcon className="text-gray-600 m-auto h-full" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white capitalize leading-tight font-['Syne']">
                      {result.name || 'Unknown Meal'}
                    </h2>
                    <p className="text-gray-500 text-[13px] mt-1">Visual analysis via AI detection model</p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="ai-card-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Analysis Confidence</span>
                    <span className="text-[11px] font-black font-mono" style={{ color: '#C4F135' }}>92%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full macro-bar-ai"
                      style={{ width: '92%', background: 'linear-gradient(90deg, #C4F135, #a3d625)', boxShadow: '0 0 8px rgba(196,241,53,0.4)' }} />
                  </div>
                </div>

                {/* Macro section */}
                <div className="grid md:grid-cols-[1fr_1.6fr] gap-5 ai-card-3">
                  {/* Calorie panel */}
                  <div className="flex flex-col items-center justify-center py-7 rounded-[16px] text-center"
                    style={{ background: 'rgba(196,241,53,0.04)', border: '1px solid rgba(196,241,53,0.1)' }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(196,241,53,0.6)' }}>
                      Estimated Energy
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[44px] font-black text-white leading-none font-['Syne']">{result.calories}</span>
                      <span className="text-gray-500 text-sm font-medium">kcal</span>
                    </div>
                  </div>

                  {/* Macro bars */}
                  <div className="flex flex-col justify-center space-y-4">
                    <AIMacroBar label="Carbs"   value={result.macros?.carbs   || 0} max={maxMacro} color="#f97316" gradientTo="#fb923c" delay={100} />
                    <AIMacroBar label="Protein" value={result.macros?.protein || 0} max={maxMacro} color="#22c55e" gradientTo="#4ade80" delay={200} />
                    <AIMacroBar label="Fat"     value={result.macros?.fat     || 0} max={maxMacro} color="#f59e0b" gradientTo="#fbbf24" delay={300} />
                  </div>
                </div>

                {/* Disclaimer note */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-[12px] ai-card-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Info size={14} className="shrink-0 mt-0.5 text-gray-600" />
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    Multi-dish plates or hidden ingredients (like oils) may be less precise. Adjust macros manually if needed.
                  </p>
                </div>

                {/* Action row */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2 ai-card-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                  <button
                    onClick={handleReset}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    <RotateCcw size={14} /> Retake
                  </button>
                  <button
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    <Edit2 size={14} /> Adjust
                  </button>

                  <div className="w-full sm:w-auto sm:ml-auto flex gap-2">
                    <select
                      value={selectedMealIndex}
                      onChange={(e) => setSelectedMealIndex(e.target.value)}
                      className="px-3 py-2.5 rounded-full text-[13px] font-bold focus:outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                      }}
                      aria-label="Select meal slot"
                    >
                      <option value="0">Breakfast</option>
                      <option value="1">Lunch</option>
                      <option value="2">Dinner</option>
                      <option value="3">Snacks</option>
                    </select>
                    <button
                      onClick={handleLogMeal}
                      disabled={analyzing}
                      className="px-6 py-2.5 rounded-full text-[13px] font-black transition-all duration-200 active:scale-95 hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #C4F135, #a3d625)',
                        color: '#0a0a0b',
                        boxShadow: '0 4px 16px rgba(196,241,53,0.3)',
                      }}
                    >
                      Log this meal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Recent Analyses ── */}
          <div className="ai-card-4">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[16px] font-black text-white">Recent Analyses</h3>
              {loggedMeals.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: '#C4F135', background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                  {loggedMeals.length}
                </span>
              )}
            </div>

            {loggedMeals.length === 0 ? (
              /* Premium empty state */
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-[20px]"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                }}>
                {/* Empty plate icon */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <UtensilsCrossed size={26} className="text-gray-600" />
                  </div>
                  {/* Small sparkle accent */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196,241,53,0.1)', border: '1px solid rgba(196,241,53,0.2)' }}>
                    <Sparkles size={10} style={{ color: '#C4F135' }} />
                  </div>
                </div>
                <h4 className="text-base font-black text-white mb-1.5">No analyses yet</h4>
                <p className="text-[13px] text-gray-500 max-w-[220px] leading-relaxed">
                  Upload a meal photo above — your logged analyses will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {loggedMeals.map((item, i) => (
                  <div
                    key={item._id}
                    style={{ animationDelay: `${i * 0.07}s` }}
                    className="ai-card-1 flex items-center gap-4 p-3 pr-5 rounded-[14px] transition-all duration-200 hover:-translate-y-0.5 group"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      animationDelay: `${i * 0.07}s`,
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-[10px] shrink-0 overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-gray-600" /></div>
                      }
                    </div>

                    {/* Meal info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-[14px] truncate capitalize leading-none mb-1">{item.name}</h4>
                      <p className="text-gray-600 text-[11px] font-medium">
                        {new Date(item.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        {new Date(item.loggedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Calorie badge */}
                    <div className="shrink-0 text-right">
                      <p className="text-white font-black text-[17px] leading-none">{item.calories}</p>
                      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

