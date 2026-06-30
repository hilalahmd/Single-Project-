import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, CheckCircle2, Loader2, ArrowRight, Camera } from 'lucide-react'

export default function TransformPreviewPage() {
  const navigate = useNavigate()
  
  // State for uploads and goal
  const [uploads, setUploads] = useState({
    front: null,
    back: null,
    left: null,
    right: null
  })
  
  const [goal, setGoal] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  
  // Fake file selection
  const handleUploadClick = (slot) => {
    // In a real app, this would open a file picker. Here we simulate selecting a photo.
    setUploads(prev => ({
      ...prev,
      [slot]: 'uploaded'
    }))
  }

  const allUploaded = uploads.front && uploads.back && uploads.left && uploads.right
  const canGenerate = allUploaded && goal !== ''

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowResult(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff6b1a] selection:text-white relative font-sans overflow-x-hidden pt-24 pb-16">
      
      {/* Background line/dot grid pattern (similar to hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Header block */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6b1a]/20 to-[#ff8c3a]/20 border border-[#ff6b1a]/50 rounded-full px-4 py-2 mb-6">
            <span className="text-[#ff6b1a] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6b1a] animate-pulse"></span> AI PREVIEW
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 font-['Syne'] tracking-tight uppercase leading-tight">
            See Your Transformation Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a]">Start.</span>
          </h1>
          <p className="text-[#9ca3af] font-medium text-lg sm:text-xl leading-relaxed">
            Upload 4 quick photos, choose your goal, and let our AI generate a hyper-realistic preview of your future physique.
          </p>
        </div>

        {/* 2. Upload UI & Goal Selection (hidden after generation) */}
        {!showResult && (
          <div className="space-y-12 bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 sm:p-12 shadow-2xl relative animate-fade-in-up">
            
            {/* Ambient glow behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff6b1a]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div>
              <h3 className="text-xl font-bold font-['Syne'] uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm">1</span> 
                Upload Photos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(uploads).map((slot) => {
                  const isUploaded = uploads[slot] !== null
                  return (
                    <div 
                      key={slot}
                      onClick={() => handleUploadClick(slot)}
                      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
                        isUploaded 
                        ? 'border-[#ff6b1a] bg-[#ff6b1a]/10' 
                        : 'border-[rgba(255,255,255,0.15)] bg-black/40 hover:border-[#ff6b1a]/50 hover:bg-white/5'
                      }`}
                    >
                      {isUploaded ? (
                        <>
                          <div className="w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center mb-3">
                            <CheckCircle2 size={24} className="text-[#ff6b1a]" />
                          </div>
                          <span className="text-white font-bold capitalize">{slot} uploaded</span>
                        </>
                      ) : (
                        <>
                          <Camera size={28} className="text-[#9ca3af] mb-3 transition-transform group-hover:scale-110" />
                          <span className="text-[#9ca3af] text-sm font-medium text-center">Click to upload<br/><span className="capitalize font-bold text-white mt-1 block">{slot}</span></span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <hr className="border-[rgba(255,255,255,0.08)]" />

            {/* 3. Goal Selector */}
            <div>
              <h3 className="text-xl font-bold font-['Syne'] uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm">2</span> 
                Select Your Goal
              </h3>
              <div className="flex flex-wrap gap-4">
                {['Lose Fat', 'Build Muscle', 'Both'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-8 py-4 rounded-full font-bold transition-all duration-300 text-sm sm:text-base ${
                      goal === g
                      ? 'bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white shadow-[0_0_20px_rgba(255,107,26,0.3)]'
                      : 'bg-transparent border-2 border-[rgba(255,255,255,0.15)] text-[#a1a1aa] hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Generate Button */}
            <div className="pt-6">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full sm:w-auto px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white hover:shadow-[0_0_30px_rgba(255,107,26,0.4)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Analyzing Physics...
                  </>
                ) : (
                  'Generate Preview'
                )}
              </button>
            </div>
          </div>
        )}

        {/* 5. Result Section */}
        {showResult && (
          <div className="space-y-12 animate-fade-in-up">
            
            {/* Visual Preview Box */}
            <div className="bg-[#14161f] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b1a]/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Before */}
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 bg-black/50 border border-white/10 rounded-full text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">Before</div>
                  <div className="aspect-[3/4] bg-[#0a0a0a] rounded-xl border border-white/5 flex flex-col items-center justify-center text-[#9ca3af] relative overflow-hidden">
                    <UserPlaceholder />
                  </div>
                </div>
                
                {/* After */}
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#ff6b1a]/20 to-[#ff8c3a]/20 border border-[#ff6b1a]/50 rounded-full text-[#ff6b1a] text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,107,26,0.2)]">After (Projected)</div>
                  <div className="aspect-[3/4] bg-gradient-to-tr from-[#14161f] to-[#1f2233] rounded-xl border border-[#ff6b1a]/30 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-[0_0_40px_rgba(255,107,26,0.1)]">
                     <UserPlaceholder glow />
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Projected Fat Loss', value: '-4.2%', delta: 'Optimal rate' },
                { label: 'Projected Muscle Gain', value: '+1.8kg', delta: 'Hypertrophy target' },
                { label: 'Timeline', value: '12 weeks', delta: 'Requires consistency' }
              ].map((stat, i) => (
                <div key={i} className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 relative overflow-hidden">
                  <div className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider mb-2">{stat.label}</div>
                  <div className="text-4xl font-black text-white font-['Syne'] tracking-tight mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-[#ff6b1a]">{stat.delta}</div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-[#9ca3af] text-xs max-w-xl mx-auto italic">
              AI-generated visualization for illustration purposes only. Actual results vary and depend on training consistency, nutrition, and genetics.
            </p>
            
            {/* 6. Conversion CTA */}
            <div className="bg-[#14161f] border border-[rgba(255,255,255,0.08)] rounded-2xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden mt-16">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,26,0.15)_0%,transparent_70%)] pointer-events-none"></div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 font-['Syne'] uppercase tracking-tight relative z-10">
                This is what's possible with real coaching.
              </h2>
              <button 
                onClick={() => navigate('/trainers')}
                className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(255,107,26,0.5)] transition-all duration-300 hover:scale-105"
              >
                Get Matched With a Trainer <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// Simple SVG placeholder for the user silhouette
function UserPlaceholder({ glow = false }) {
  return (
    <div className={`flex flex-col items-center justify-center w-full h-full ${glow ? 'opacity-90' : 'opacity-30'}`}>
      <div className={`w-32 h-32 rounded-t-[3rem] rounded-b-[1rem] border-4 ${glow ? 'border-[#ff6b1a] bg-[#ff6b1a]/20' : 'border-white/40 bg-white/5'} mb-2`} />
      <div className={`w-48 h-56 rounded-t-[4rem] rounded-b-[2rem] border-4 ${glow ? 'border-[#ff6b1a] bg-[#ff6b1a]/20' : 'border-white/40 bg-white/5'} border-b-0`} />
    </div>
  )
}
