import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle2, ChevronRight, Activity, Target, Leaf, UtensilsCrossed, Lock } from 'lucide-react'
import API from '../../../shared/utils/api'
import { useAuth } from '../../../shared/context/AuthContext'

export default function FreeDietPlanPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [dietPlan, setDietPlan] = useState(null)
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="min-h-screen bg-[#000000] text-white font-['Inter'] relative flex flex-col">
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-[#0f1117] border border-[rgba(255,255,255,0.08)] p-8 rounded-[20px] shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#ff6b1a]/10 border border-[#ff6b1a]/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Leaf size={28} className="text-[#ff6b1a]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-['Syne'] tracking-tight">Unlock AI Diet Generator</h2>
              <p className="text-gray-400 mt-2 font-medium">To generate a custom diet preview plan matching your body metrics, please sign in or create a free account.</p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/auth/login', { state: { from: location } })}
                className="w-full py-4 bg-[#ff6b1a] hover:bg-[#EA580C] text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(255,107,26,0.3)] transition-all uppercase tracking-wide text-xs cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all uppercase tracking-wide text-xs cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    country: '',
    goal: '',
    dietPref: '',
    measurements: {
      neck: '',
      waist: '',
      navel: '',
      arm: '',
      wrist: '',
      hip: '',
      thigh: ''
    }
  })

  const COUNTRIES = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands',
    'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Chile',
    'China', 'Japan', 'South Korea', 'Thailand', 'Vietnam',
    'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'UAE',
    'Saudi Arabia', 'Turkey', 'Egypt', 'South Africa', 'Nigeria',
    'Russia', 'Poland', 'Sweden', 'Norway', 'Denmark',
    'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Myanmar',
    'New Zealand', 'Ireland', 'Portugal', 'Greece', 'Belgium',
    'Switzerland', 'Austria', 'Czech Republic', 'Hungary', 'Other'
  ]

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleGenerate = async () => {
    setStep(4)
    setIsGenerating(true)
    setError('')

    try {
      const res = await fetch(`${API}/food-ai/generate-diet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
        setIsGenerating(false)
        setStep(3)
        return
      }

      setDietPlan(data.dietPlan)
      setIsGenerating(false)
      setStep(5)
    } catch (err) {
      setError('Failed to generate plan. Please try again.')
      setIsGenerating(false)
      setStep(3)
    }
  }

  const renderStep1 = () => (
    <div className="animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white font-['Syne'] tracking-tight mb-2">Let's get your metrics</h2>
        <p className="text-gray-400 font-medium">We need this to calculate your daily caloric needs.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Biological Gender</label>
          <div className="grid grid-cols-2 gap-4">
            {['Male', 'Female'].map(g => (
              <button
                key={g}
                onClick={() => setFormData({ ...formData, gender: g })}
                className={`py-4 rounded-xl font-bold border-2 transition-all duration-300 ${
                  formData.gender === g
                    ? 'border-[#ff6b1a] bg-[#ff6b1a]/10 text-white shadow-[0_0_20px_rgba(255,107,26,0.2)]'
                    : 'border-[rgba(255,255,255,0.1)] text-gray-400 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Age <span className="text-gray-600 normal-case">(yrs)</span></label>
            <input
              type="number"
              placeholder="e.g. 25"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: e.target.value })}
              className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Height <span className="text-gray-600 normal-case">(cm)</span></label>
            <input
              type="number"
              placeholder="e.g. 175"
              value={formData.height}
              onChange={e => setFormData({ ...formData, height: e.target.value })}
              className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Weight <span className="text-gray-600 normal-case">(kg)</span></label>
            <input
              type="number"
              placeholder="e.g. 70"
              value={formData.weight}
              onChange={e => setFormData({ ...formData, weight: e.target.value })}
              className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Country</label>
          <select
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all appearance-none"
          >
            <option value="" className="bg-[#1a1d27]">Select your country</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c} className="bg-[#1a1d27]">{c}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">We tailor your meal plan to foods available in your region.</p>
        </div>

        <div className="border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMeasurements(!showMeasurements)}
            className="w-full flex items-center justify-between px-5 py-4 bg-[#1a1d27] hover:bg-[#1f232f] transition-colors"
          >
            <span className="text-sm font-bold text-white">
              Add measurements for more accuracy <span className="text-gray-500 font-normal normal-case">(optional)</span>
            </span>
            <ChevronRight
              size={18}
              className={`text-[#ff6b1a] transition-transform duration-300 ${showMeasurements ? 'rotate-90' : ''}`}
            />
          </button>

          {showMeasurements && (
            <div className="p-5 bg-[#14161f] space-y-4 animate-fade-in">
              <p className="text-xs text-gray-500 leading-relaxed">
                These help us estimate your body fat % accurately using the Navy method. All optional — skip if you don't have a measuring tape handy.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'neck', label: 'Neck (cm)' },
                  { key: 'waist', label: 'Waist (cm)' },
                  { key: 'navel', label: 'Navel (cm)' },
                  { key: 'arm', label: 'Arm (cm)' },
                  { key: 'wrist', label: 'Wrist (cm)' },
                  { key: 'hip', label: 'Hip (cm)' },
                  { key: 'thigh', label: 'Thigh (cm)' },
                ].map(m => (
                  <div key={m.key}>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{m.label}</label>
                    <input
                      type="number"
                      placeholder="cm"
                      value={formData.measurements[m.key]}
                      onChange={e => setFormData({
                        ...formData,
                        measurements: { ...formData.measurements, [m.key]: e.target.value }
                      })}
                      className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-sm text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={nextStep}
          disabled={!formData.gender || !formData.age || !formData.height || !formData.weight || !formData.country}
          className="w-full mt-8 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white py-5 rounded-full font-[800] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          Continue <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white font-['Syne'] tracking-tight mb-2">What is your goal?</h2>
        <p className="text-gray-400 font-medium">This determines your caloric deficit or surplus.</p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'loss', title: 'Weight Loss', desc: 'Burn fat and get leaner', icon: Activity },
          { id: 'gain', title: 'Muscle Gain', desc: 'Build size and strength', icon: Target },
          { id: 'maintain', title: 'Maintenance', desc: 'Stay at your current weight', icon: CheckCircle2 }
        ].map(goal => (
          <button
            key={goal.id}
            onClick={() => setFormData({ ...formData, goal: goal.id })}
            className={`w-full p-5 rounded-xl border-2 flex items-center gap-5 transition-all duration-300 text-left ${
              formData.goal === goal.id
                ? 'border-[#ff6b1a] bg-[#ff6b1a]/10 shadow-[0_0_20px_rgba(255,107,26,0.2)]'
                : 'border-[rgba(255,255,255,0.08)] bg-[#1a1d27]/50 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <div className={`p-3 rounded-lg ${formData.goal === goal.id ? 'bg-[#ff6b1a] text-white' : 'bg-white/5 text-gray-400'}`}>
              <goal.icon size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-lg">{goal.title}</div>
              <div className="text-sm font-medium text-gray-400 mt-1">{goal.desc}</div>
            </div>
          </button>
        ))}

        <div className="flex gap-4 mt-8">
          <button onClick={prevStep} className="px-6 py-5 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={!formData.goal}
            className="flex-1 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white py-5 rounded-full font-[800] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            Continue <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="animate-fade-in-up">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white font-['Syne'] tracking-tight mb-2">Dietary Preference</h2>
        <p className="text-gray-400 font-medium">We'll tailor your meal plan to what you eat.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'veg', title: 'Vegetarian', icon: Leaf },
          { id: 'nonveg', title: 'Non-Vegetarian', icon: UtensilsCrossed },
          { id: 'vegan', title: 'Vegan', icon: Leaf },
          { id: 'eggetarian', title: 'Eggetarian', icon: Leaf }
        ].map(diet => (
          <button
            key={diet.id}
            onClick={() => setFormData({ ...formData, dietPref: diet.id })}
            className={`p-6 rounded-xl border-2 flex flex-col items-center text-center gap-4 transition-all duration-300 ${
              formData.dietPref === diet.id
                ? 'border-[#ff6b1a] bg-[#ff6b1a]/10 shadow-[0_0_20px_rgba(255,107,26,0.2)]'
                : 'border-[rgba(255,255,255,0.08)] bg-[#1a1d27]/50 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.dietPref === diet.id ? 'bg-[#ff6b1a] text-white' : 'bg-white/5 text-gray-400'}`}>
              <diet.icon size={20} />
            </div>
            <div className="font-bold text-white">{diet.title}</div>
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

      <div className="flex gap-4 mt-8">
        <button onClick={prevStep} className="px-6 py-5 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
          Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={!formData.dietPref}
          className="flex-1 bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white py-5 rounded-full font-[800] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
        >
          Generate Plan ✨
        </button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-[#ff6b1a]/20 border-t-[#ff6b1a] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="text-[#ff6b1a] animate-pulse" size={32} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white font-['Syne'] tracking-wide mb-3 animate-pulse">
        FitForge AI is analyzing...
      </h2>
      <p className="text-gray-400 font-medium text-center max-w-sm">
        Calculating your macros and generating a personalized {formData.dietPref} meal plan for {formData.goal.replace('-', ' ')}...
      </p>
    </div>
  )

  const renderStep5 = () => {
    if (!dietPlan) return null

    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-3xl font-black text-white font-['Syne'] tracking-tight mb-2">Your Sample Plan is Ready</h2>
          <p className="text-[#ff6b1a] font-bold text-sm tracking-widest uppercase">Target: ~{dietPlan.dailyCalorieTarget} kcal / day</p>
        </div>

        {dietPlan.estimatedBodyFatPercent && (
          <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Body Fat</p>
            <p className="text-2xl font-black text-white mb-2">{dietPlan.estimatedBodyFatPercent}%</p>
            {dietPlan.bodyFatNote && <p className="text-sm text-gray-400">{dietPlan.bodyFatNote}</p>}
          </div>
        )}

        {/* Macro Breakdown */}
        {dietPlan.macros && (() => {
          const pCal = dietPlan.macros.protein * 4
          const cCal = dietPlan.macros.carbs * 4
          const fCal = dietPlan.macros.fat * 9
          const totalCal = pCal + cCal + fCal
          const pPct = Math.round((pCal / totalCal) * 100) || 0
          const cPct = Math.round((cCal / totalCal) * 100) || 0
          const fPct = 100 - pPct - cPct

          return (
            <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 mb-6 shadow-xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Daily Macro Targets</p>
              
              {/* Macro Cards Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {/* Protein */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#ff6b1a]/10 to-transparent border border-[#ff6b1a]/20 rounded-xl p-3.5 text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#ff6b1a]" />
                  <p className="text-[10px] font-bold text-[#ff6b1a] uppercase tracking-wider mb-1">Protein</p>
                  <p className="text-2xl font-black text-white">{dietPlan.macros.protein}g</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-1">{pPct}% of kcal</p>
                </div>
                
                {/* Carbs */}
                <div className="relative overflow-hidden bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-3.5 text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-1">Carbs</p>
                  <p className="text-2xl font-black text-white">{dietPlan.macros.carbs}g</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-1">{cPct}% of kcal</p>
                </div>

                {/* Fat */}
                <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-3.5 text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Fat</p>
                  <p className="text-2xl font-black text-white">{dietPlan.macros.fat}g</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-1">{fPct}% of kcal</p>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
                  <div className="h-full bg-[#ff6b1a]" style={{ width: `${pPct}%` }} title={`Protein: ${pPct}%`} />
                  <div className="h-full bg-green-500" style={{ width: `${cPct}%` }} title={`Carbs: ${cPct}%`} />
                  <div className="h-full bg-amber-500" style={{ width: `${fPct}%` }} title={`Fat: ${fPct}%`} />
                </div>
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-gray-500 px-0.5">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#ff6b1a]" /> P: {pPct}%</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> C: {cPct}%</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> F: {fPct}%</span>
                </div>
              </div>
            </div>
          )
        })()}

        <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden mb-8 shadow-lg">
          <div className="bg-white/5 px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
            <span className="font-bold text-white">Day 1 Sample</span>
            <span className="text-xs font-bold bg-[#ff6b1a]/20 text-[#ff6b1a] px-3 py-1 rounded-full">{formData.dietPref.toUpperCase()}</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.05)]">
            {dietPlan.meals.map((meal, i) => (
              <div key={i} className="p-6">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{meal.name} ({meal.time})</div>
                <div className="font-bold text-white text-lg mb-1">{meal.items}</div>
                <div className="text-sm text-gray-400">{meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#ff6b1a]/20 to-[#ff8c3a]/10 border border-[#ff6b1a]/30 p-6 rounded-2xl mb-8">
          <h3 className="font-bold text-white text-lg mb-2">This is just a sample.</h3>
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {dietPlan.closingNote}
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="w-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white py-4 rounded-full font-[800] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,107,26,0.4)] transition-all duration-300 flex justify-center items-center"
          >
            Unlock Full 7-Day Plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-['Inter'] selection:bg-[#ff6b1a] selection:text-white relative flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-transparent z-10"></div>
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-[#ff6b1a]/5 blur-[120px] rounded-full pointer-events-none z-10"></div>
        <div className="absolute inset-0 z-[70] mix-blend-overlay opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {step < 4 && (
            <div className="mb-10">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">
                <span>Step {step} of 3</span>
                <span>{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] transition-all duration-500 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] p-8 rounded-[20px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>
        </div>
      </main>
    </div>
  )
}