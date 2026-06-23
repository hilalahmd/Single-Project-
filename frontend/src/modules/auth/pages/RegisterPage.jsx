import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, Target, Dumbbell, Activity, Heart } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Input from '../../../shared/components/Input'

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
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${
                isDone
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                  : isActive
                  ? 'bg-white border-[#1A1A1A] text-[#1A1A1A] shadow-sm'
                  : 'bg-[#F5F4F0] border-[#E5E4E0] text-gray-400'
              }`}
            >
              {isDone ? <Check size={12} /> : step}
            </div>
            {/* Connector line */}
            {i < total - 1 && (
              <div
                className={`w-12 h-px transition-all ${
                  step < current ? 'bg-[#1A1A1A]' : 'bg-[#E5E4E0]'
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
      <div className="text-center space-y-5 py-4">
        <div className="w-14 h-14 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto shadow-sm">
          <Check size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Account Created!</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Welcome to FitForge. Let's start your journey.</p>
        </div>
        <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div>
      <StepIndicator current={step} total={3} />

      {/* ── Step 1: Account ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="mb-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Create your account</h1>
            <p className="text-sm text-gray-500 mt-0.5 font-medium">Step 1 of 3 — Account details</p>
          </div>

          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={form1.fullName}
            onChange={f1('fullName')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={form1.email}
            onChange={f1('email')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="9876543210"
            value={form1.phone}
            onChange={f1('phone')}
            maxLength={10}
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-[#E5E4E0] rounded-lg focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/20 transition-all bg-white overflow-hidden">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={form1.password}
                onChange={f1('password')}
                className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="px-3 py-2 text-gray-400 hover:text-[#1A1A1A] transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-[#E5E4E0] rounded-lg focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/20 transition-all bg-white overflow-hidden">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form1.confirmPassword}
                onChange={f1('confirmPassword')}
                className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="px-3 py-2 text-gray-400 hover:text-[#1A1A1A] transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={() => setStep(2)}>
            Continue
          </Button>

          <p className="text-center text-sm text-gray-500 font-medium pt-2">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-[#1A1A1A] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {/* ── Step 2: Profile ── */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="mb-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Your profile</h1>
            <p className="text-sm text-gray-500 mt-0.5 font-medium">Step 2 of 3 — Preferences</p>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Language
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] text-sm text-gray-900 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all bg-white"
            >
              <option value="">Select language</option>
              {['Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'English'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Goal cards */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Fitness Goal
            </p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(({ id, label, icon: Icon }) => {
                const active = selectedGoal === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedGoal(id)}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all ${
                      active
                        ? 'border-[#1A1A1A] bg-[#F5F4F0] shadow-sm'
                        : 'border-[#E5E4E0] hover:border-[#1A1A1A]/30 hover:bg-[#F5F4F0]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        active ? 'bg-[#1A1A1A] text-white shadow-sm' : 'bg-[#F5F4F0] text-gray-500'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className={`text-xs font-semibold ${active ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Experience level */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EXPERIENCE.map(lvl => {
                const active = experience === lvl
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setExperience(lvl)}
                    className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                      active
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-sm'
                        : 'border-[#E5E4E0] text-gray-600 hover:border-[#1A1A1A]/30 hover:bg-[#F5F4F0]'
                    }`}
                  >
                    {lvl}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" fullWidth onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Body Metrics ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="mb-2">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Body metrics</h1>
            <p className="text-sm text-gray-500 mt-0.5 font-medium">Step 3 of 3 — Physical details</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Height"
              type="number"
              placeholder="170"
              suffix={<span className="text-xs text-gray-500">cm</span>}
              value={form3.height}
              onChange={f3('height')}
            />
            <Input
              label="Weight"
              type="number"
              placeholder="70"
              suffix={<span className="text-xs text-gray-500">kg</span>}
              value={form3.weight}
              onChange={f3('weight')}
            />
          </div>

          <Input
            label="Age"
            type="number"
            placeholder="25"
            value={form3.age}
            onChange={f3('age')}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={form3.gender}
              onChange={f3('gender')}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] text-sm text-gray-900 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all bg-white"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Level
            </label>
            <select
              value={form3.activityLevel}
              onChange={f3('activityLevel')}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E4E0] text-sm text-gray-900 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20 transition-all bg-white"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="lightly-active">Lightly Active (1–3 days/week)</option>
              <option value="moderately-active">Moderately Active (3–5 days/week)</option>
              <option value="very-active">Very Active (6–7 days/week)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" fullWidth onClick={() => setStep(2)}>
              Back
            </Button>
            <Button variant="primary" fullWidth onClick={() => setDone(true)}>
              Create Account
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
