import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle2, ChevronRight, Activity, Target, Leaf, UtensilsCrossed } from 'lucide-react'

export default function FreeDietPlanPage() {
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    dietPref: ''
  })

  // Handlers
  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleGenerate = () => {
    setStep(4) // Move to loading screen
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setStep(5) // Move to results
    }, 3000)
  }

  // --- UI Components for Steps ---

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
                onClick={() => setFormData({...formData, gender: g})}
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
              onChange={e => setFormData({...formData, age: e.target.value})}
              className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Height <span className="text-gray-600 normal-case">(cm)</span></label>
            <input 
              type="number" 
              placeholder="e.g. 175"
              value={formData.height}
              onChange={e => setFormData({...formData, height: e.target.value})}
              className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Weight <span className="text-gray-600 normal-case">(kg)</span></label>
            <input 
              type="number" 
              placeholder="e.g. 70"
              value={formData.weight}
              onChange={e => setFormData({...formData, weight: e.target.value})}
              className="w-full bg-[#1a1d27] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#ff6b1a] focus:ring-1 focus:ring-[#ff6b1a] transition-all"
            />
          </div>
        </div>

        <button 
          onClick={nextStep}
          disabled={!formData.gender || !formData.age || !formData.height || !formData.weight}
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
            onClick={() => setFormData({...formData, goal: goal.id})}
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
          { id: 'nonveg', title: 'Non-Vegetarian', icon: UtensilsCrossed }, // Using text or standard icon since we don't have UtensilsCrossed imported here
          { id: 'vegan', title: 'Vegan', icon: Leaf },
          { id: 'eggetarian', title: 'Eggetarian', icon: Leaf }
        ].map(diet => (
          <button 
            key={diet.id}
            onClick={() => setFormData({...formData, dietPref: diet.id})}
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

  const renderStep5 = () => (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl font-black text-white font-['Syne'] tracking-tight mb-2">Your Sample Plan is Ready</h2>
        <p className="text-[#ff6b1a] font-bold text-sm tracking-widest uppercase">Target: ~1,850 kcal / day</p>
      </div>

      <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden mb-8 shadow-lg">
        <div className="bg-white/5 px-6 py-4 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
          <span className="font-bold text-white">Day 1 Sample</span>
          <span className="text-xs font-bold bg-[#ff6b1a]/20 text-[#ff6b1a] px-3 py-1 rounded-full">{formData.dietPref.toUpperCase()}</span>
        </div>
        <div className="divide-y divide-[rgba(255,255,255,0.05)]">
          <div className="p-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Breakfast (8:00 AM)</div>
            <div className="font-bold text-white text-lg mb-1">Oats Idli with Sambar</div>
            <div className="text-sm text-gray-400">3 Idlis • 1 bowl Sambar • 350 kcal • 12g Protein</div>
          </div>
          <div className="p-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lunch (1:00 PM)</div>
            <div className="font-bold text-white text-lg mb-1">Brown Rice & Paneer/Chicken Curry</div>
            <div className="text-sm text-gray-400">1 cup Rice • 150g Protein • Salad • 550 kcal • 35g Protein</div>
          </div>
          <div className="p-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Dinner (8:00 PM)</div>
            <div className="font-bold text-white text-lg mb-1">Multigrain Roti & Dal</div>
            <div className="text-sm text-gray-400">2 Rotis • 1 bowl Dal • Veggies • 400 kcal • 15g Protein</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#ff6b1a]/20 to-[#ff8c3a]/10 border border-[#ff6b1a]/30 p-6 rounded-2xl mb-8">
        <h3 className="font-bold text-white text-lg mb-2">This is just 1 day out of 30.</h3>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Get your complete 30-day personalized diet plan, daily macro tracking, AI food photo analysis, and a dedicated live coach by starting your free trial.
        </p>
        <button 
          onClick={() => navigate('/auth/register')}
          className="w-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8c3a] text-white py-4 rounded-full font-[800] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,107,26,0.4)] transition-all duration-300 flex justify-center items-center"
        >
          Unlock Full 30-Day Plan
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#000000] text-white font-['Inter'] selection:bg-[#ff6b1a] selection:text-white relative flex flex-col">
      {/* Background styling identical to landing page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-transparent z-10"></div>
        {/* Subtle orange ambient glow instead of the harsh blue/navy */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-[#ff6b1a]/5 blur-[120px] rounded-full pointer-events-none z-10"></div>
        
        <div className="absolute inset-0 z-[70] mix-blend-overlay opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
      </div>


      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          {/* Progress Bar */}
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

          {/* Form Container */}
          <div className="bg-[#0f1117] border border-[rgba(255,255,255,0.08)] p-8 rounded-[20px] shadow-2xl relative overflow-hidden">
            {/* Glossy highlight effect */}
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
