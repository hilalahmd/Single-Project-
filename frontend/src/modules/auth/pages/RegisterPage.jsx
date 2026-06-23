import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, Target, Dumbbell, Activity, Heart } from 'lucide-react'

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isDone = step < current
        const isActive = step === current
        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                isDone
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : isActive
                  ? 'bg-[#1E293B] border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)]'
                  : 'bg-[#0F172A] border-[#1E293B] text-gray-500'
              }`}
            >
              {isDone ? <Check size={14} strokeWidth={3} /> : step}
            </div>
            {/* Connector line */}
            {i < total - 1 && (
              <div
                className={`w-12 h-0.5 transition-all duration-300 ${
                  step < current ? 'bg-blue-600' : 'bg-[#1E293B]'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Fitness Goal Cards ────────────────────────────────────────────────────────
const GOALS = [
  { id: 'lose-weight',     label: 'Lose Weight',     icon: Target },
  { id: 'build-muscle',    label: 'Build Muscle',    icon: Dumbbell },
  { id: 'improve-fitness', label: 'Improve Fitness', icon: Activity },
  { id: 'stay-healthy',    label: 'Stay Healthy',    icon: Heart },
]

const EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced']

// ── Main Component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  // Step 1
  const [form1, setForm1] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Step 2
  const [language, setLanguage] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [experience, setExperience] = useState('')

  // Step 3
  const [form3, setForm3] = useState({
    height: '', weight: '', age: '', gender: '', activityLevel: '',
  })

  const f1 = (k) => (e) => setForm1(p => ({ ...p, [k]: e.target.value }))
  const f3 = (k) => (e) => setForm3(p => ({ ...p, [k]: e.target.value }))

  if (done) {
    return (
      <div className="text-center space-y-5 py-8">
        <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,99,235,0.3)] animate-in zoom-in duration-500">
          <Check size={32} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Account Created!</h2>
          <p className="text-gray-400 mt-2 font-medium">Welcome to FitForge. Let's start your journey.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#030712] min-h-full flex flex-col justify-center py-6">
      <StepIndicator current={step} total={3} />

      {/* ── Step 1: Account ── */}
      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create your account</h1>
            <p className="text-gray-400 mt-2 font-medium">Step 1 of 3 — Account details</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" placeholder="John Doe" value={form1.fullName} onChange={f1('fullName')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" placeholder="john@example.com" value={form1.email} onChange={f1('email')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
              <input type="tel" placeholder="9876543210" maxLength={10} value={form1.phone} onChange={f1('phone')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="flex items-center bg-[#0F172A] border border-[#1E293B] rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden">
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form1.password} onChange={f1('password')} className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="px-4 text-gray-500 hover:text-white transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="flex items-center bg-[#0F172A] border border-[#1E293B] rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden">
                <input type={showConfirm ? 'text' : 'password'} placeholder="Re-enter password" value={form1.confirmPassword} onChange={f1('confirmPassword')} className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-4 text-gray-500 hover:text-white transition-colors">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button onClick={() => setStep(2)} className="w-full py-3.5 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all">
            Continue to Preferences
          </button>

          <p className="text-center text-sm text-gray-400 font-medium pt-2">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* ── Step 2: Profile ── */}
      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Your profile</h1>
            <p className="text-gray-400 mt-2 font-medium">Step 2 of 3 — Preferences</p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Preferred Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none">
              <option value="" className="text-gray-500">Select language</option>
              {['Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'English'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Goal cards */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Fitness Goal</label>
            <div className="grid grid-cols-2 gap-4">
              {GOALS.map(({ id, label, icon: Icon }) => {
                const active = selectedGoal === id
                return (
                  <button
                    key={id} type="button" onClick={() => setSelectedGoal(id)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
                      active
                        ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                        : 'border-[#1E293B] bg-[#0F172A] hover:border-gray-600 hover:bg-[#1E293B]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-[#1E293B] text-gray-400'}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-sm font-bold ${active ? 'text-blue-400' : 'text-gray-300'}`}>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Experience level */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Experience Level</label>
            <div className="grid grid-cols-3 gap-3">
              {EXPERIENCE.map(lvl => {
                const active = experience === lvl
                return (
                  <button
                    key={lvl} type="button" onClick={() => setExperience(lvl)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all duration-300 ${
                      active
                        ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                        : 'border-[#1E293B] bg-[#0F172A] text-gray-400 hover:text-white hover:border-gray-600 hover:bg-[#1E293B]'
                    }`}
                  >
                    {lvl}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={() => setStep(1)} className="flex-1 py-3.5 bg-[#0F172A] border border-[#1E293B] text-white font-bold rounded-xl hover:bg-[#1E293B] transition-all">
              Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Body Metrics ── */}
      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Body metrics</h1>
            <p className="text-gray-400 mt-2 font-medium">Step 3 of 3 — Physical details</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Height (cm)</label>
              <input type="number" placeholder="170" value={form3.height} onChange={f3('height')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Weight (kg)</label>
              <input type="number" placeholder="70" value={form3.weight} onChange={f3('weight')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Age</label>
            <input type="number" placeholder="25" value={form3.age} onChange={f3('age')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Gender</label>
            <select value={form3.gender} onChange={f3('gender')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none">
              <option value="" className="text-gray-500">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Activity Level</label>
            <select value={form3.activityLevel} onChange={f3('activityLevel')} className="w-full px-4 py-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none">
              <option value="" className="text-gray-500">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="lightly-active">Lightly Active (1–3 days/week)</option>
              <option value="moderately-active">Moderately Active (3–5 days/week)</option>
              <option value="very-active">Very Active (6–7 days/week)</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">
            <button onClick={() => setStep(2)} className="flex-1 py-3.5 bg-[#0F172A] border border-[#1E293B] text-white font-bold rounded-xl hover:bg-[#1E293B] transition-all">
              Back
            </button>
            <button onClick={() => setDone(true)} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all">
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
