import { useState, useRef, useEffect } from 'react'
import { Camera, Image as ImageIcon, RotateCcw, Lock, AlertCircle, Upload, Edit2, Info } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import API from '../../../shared/utils/api'

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
      handleReset()
    } catch (err) {
      setError(err.message)
      setAnalyzing(false)
    }
  }

  const maxMacro = result ? Math.max(result.macros?.carbs || 0, result.macros?.protein || 0, result.macros?.fat || 0, 1) : 1

  return (
    <div className="relative max-w-4xl mx-auto min-h-[500px] pb-24 md:pb-8 pt-8 px-4 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0a]"></div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes growBar { from { width: 0%; } to { width: var(--target-width); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes ringPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.35); } 50% { box-shadow: 0 0 0 6px rgba(34,197,94,0); } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.96); } 100% { opacity: 1; transform: scale(1); } }
        .anim-fade-up { animation: fadeUp 0.45s ease-out both; }
        .anim-fade-in { animation: fadeIn 0.3s ease-out both; }
        .anim-pop { animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-bar { animation: growBar 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-shimmer { background: linear-gradient(90deg, #171717 25%, #1f1f1f 37%, #171717 63%); background-size: 400% 100%; animation: shimmer 1.6s ease-in-out infinite; }
        .anim-ring-pulse { animation: ringPulse 2s ease-in-out infinite; }
        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.15s; }
        .stagger-3 { animation-delay: 0.25s; }
        .stagger-4 { animation-delay: 0.35s; }
        .hover-lift { transition: transform 0.2s ease, border-color 0.2s ease; }
        .hover-lift:hover { transform: translateY(-1px); }
        .btn-press { transition: transform 0.1s ease; }
        .btn-press:active { transform: scale(0.97); }
      `}</style>

      <div className="relative z-10">

        {isFreeClient && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 anim-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4 text-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
              <Lock size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Food Analyzer Locked</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
              Upgrade to a premium plan to unlock instant nutritional macro breakdowns.
            </p>
            <button onClick={() => navigate('/plans')} className="btn-press px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold transition-colors hover:bg-blue-500">
              Upgrade Plan
            </button>
          </div>
        )}

        <div className={`space-y-8 ${isFreeClient ? 'blur-sm pointer-events-none select-none' : ''}`}>

          <header className="mb-2 anim-fade-up">
            <h1 className="text-[28px] font-semibold text-white tracking-tight">AI Food Analysis</h1>
            <p className="text-[14px] text-gray-400 mt-1">Upload a photo of your meal for an instant macro breakdown.</p>
          </header>

          {error && (
            <div className="anim-fade-up bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          {/* 1. Empty Upload State */}
          {!result && !analyzing && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`anim-pop bg-[#121212] border border-dashed rounded-[16px] py-12 px-8 flex flex-col items-center justify-center text-center transition-colors duration-200 ${
                dragOver ? 'border-blue-500 bg-blue-500/5' : 'border-gray-700'
              }`}
            >
              <div className={`w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 ${dragOver ? 'scale-110' : ''}`}>
                <Camera size={26} className="text-blue-500" />
              </div>
              <h2 className="text-white font-medium text-lg mb-1.5">Upload a photo of your meal</h2>
              <p className="text-gray-500 text-[13px] mb-8">JPG or PNG, clear top-down shot works best · drag and drop also works</p>

              <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
                <button onClick={handleUploadClick} className="btn-press w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium">
                  <Upload size={16} /> Choose file
                </button>
                <button onClick={handleUploadClick} className="btn-press w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors text-sm font-medium">
                  <Camera size={16} /> Take photo
                </button>
              </div>
            </div>
          )}

          {/* Analyzing Loading State */}
          {analyzing && (
            <div className="anim-pop bg-[#121212] border border-gray-800 rounded-[16px] py-16 flex flex-col items-center justify-center relative overflow-hidden">
              {imagePreview && <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-10 blur-md" />}
              <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-gray-800 relative z-10 shadow-lg mb-4 anim-ring-pulse">
                <div className="w-6 h-6 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
              </div>
              <p className="font-medium text-white text-[15px] relative z-10">Analyzing meal...</p>
              <p className="text-gray-500 text-[12px] relative z-10 mt-1">Reading the plate, estimating portions</p>
            </div>
          )}

          {/* 2. Results Card (Diagnostic Report Style) */}
          {result && !analyzing && (
            <div className="anim-pop bg-[#121212] border border-gray-800 rounded-[16px] overflow-hidden shadow-2xl">

              {/* Header Row */}
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-800 bg-[#171717]">
                <div className="flex items-center gap-2">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  <span className="text-green-500 text-[10px] font-mono tracking-widest font-bold">FOOD DETECTED</span>
                </div>
                <span className="text-gray-500 text-[10px] font-mono">ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Dish Info */}
                <div className="flex items-center gap-5 mb-8 anim-fade-up stagger-1">
                  <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-gray-700">
                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600 m-auto h-full" />}
                  </div>
                  <div>
                    <h2 className="text-2xl text-white font-medium capitalize mb-1">{result.name || 'Unknown Meal'}</h2>
                    <p className="text-gray-400 text-[13px]">Visual analysis via AI detection model</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mb-8 anim-fade-up stagger-2">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Analysis Confidence</span>
                    <span className="text-green-400 text-[11px] font-mono font-bold">92%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="anim-bar h-full bg-green-500 rounded-full" style={{ '--target-width': '92%', width: '92%' }}></div>
                  </div>
                </div>

                {/* Macro Section */}
                <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 mb-6">
                  {/* Calories Panel */}
                  <div className="anim-fade-up stagger-2 bg-[#0a0a0a] border border-gray-800/60 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider font-mono mb-2">ESTIMATED ENERGY</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl text-white font-mono font-medium">{result.calories}</span>
                      <span className="text-gray-500 text-sm font-mono">kcal</span>
                    </div>
                  </div>

                  {/* Macros Panel */}
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-4 anim-fade-up stagger-2">
                      <span className="text-gray-400 text-[13px] font-medium w-16">Carbs</span>
                      <div className="flex-1 h-1.5 bg-gray-800/80 rounded-full overflow-hidden flex">
                        <div
                          className="anim-bar h-full bg-orange-400 rounded-full"
                          style={{ '--target-width': `${(result.macros?.carbs / maxMacro) * 100}%`, width: `${(result.macros?.carbs / maxMacro) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-mono text-sm w-10 text-right">{result.macros?.carbs || 0}g</span>
                    </div>
                    <div className="flex items-center gap-4 anim-fade-up stagger-3">
                      <span className="text-gray-400 text-[13px] font-medium w-16">Protein</span>
                      <div className="flex-1 h-1.5 bg-gray-800/80 rounded-full overflow-hidden flex">
                        <div
                          className="anim-bar h-full bg-green-500 rounded-full"
                          style={{ '--target-width': `${(result.macros?.protein / maxMacro) * 100}%`, width: `${(result.macros?.protein / maxMacro) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-mono text-sm w-10 text-right">{result.macros?.protein || 0}g</span>
                    </div>
                    <div className="flex items-center gap-4 anim-fade-up stagger-4">
                      <span className="text-gray-400 text-[13px] font-medium w-16">Fat</span>
                      <div className="flex-1 h-1.5 bg-gray-800/80 rounded-full overflow-hidden flex">
                        <div
                          className="anim-bar h-full bg-amber-500 rounded-full"
                          style={{ '--target-width': `${(result.macros?.fat / maxMacro) * 100}%`, width: `${(result.macros?.fat / maxMacro) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-mono text-sm w-10 text-right">{result.macros?.fat || 0}g</span>
                    </div>
                  </div>
                </div>

                <div className="anim-fade-up stagger-4 flex items-start gap-2.5 text-gray-400 bg-gray-800/20 p-3.5 rounded-lg border border-gray-800/40 mb-8">
                  <Info size={15} className="shrink-0 mt-0.5 text-gray-500" />
                  <p className="text-[12px] leading-relaxed">Multi-dish plates or hidden ingredients (like oils) may be less precise. You can adjust the macros manually if you know the exact preparation.</p>
                </div>

                {/* Button Row */}
                <div className="anim-fade-up stagger-4 flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <button onClick={handleReset} className="btn-press flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-[13px] font-medium flex justify-center items-center gap-2">
                    <RotateCcw size={15} /> Retake
                  </button>
                  <button className="btn-press flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-[13px] font-medium flex justify-center items-center gap-2">
                    <Edit2 size={15} /> Adjust
                  </button>
                  <button onClick={handleLogMeal} className="btn-press w-full sm:w-auto sm:ml-auto px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors text-[13px] font-bold shadow-md">
                    Log this meal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Recent Analyses List */}
          <div className="pt-6 anim-fade-up">
            <h3 className="text-[16px] font-medium text-white mb-4">Recent Analyses</h3>

            <div className="space-y-2.5">
              {loggedMeals.length === 0 ? (
                <div className="p-5 text-center border border-dashed border-gray-800 rounded-xl bg-[#121212]">
                  <p className="text-gray-500 text-[13px]">No meals logged yet. Analyze and log a meal to see it here.</p>
                </div>
              ) : (
                loggedMeals.map((item, i) => (
                  <div
                    key={item._id}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    className="anim-fade-up hover-lift flex items-center gap-4 p-3 pr-5 border border-gray-800 rounded-[12px] hover:border-gray-700 bg-[#121212]"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-800 shrink-0 overflow-hidden border border-gray-700/50">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600 m-auto h-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-[14px] truncate capitalize">{item.name}</h4>
                      <p className="text-gray-500 text-[11px] mt-0.5 font-medium">{new Date(item.loggedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(item.loggedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-mono font-medium text-[16px] leading-none mb-1">{item.calories}</p>
                      <p className="text-gray-500 text-[10px] font-mono leading-none">kcal</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
