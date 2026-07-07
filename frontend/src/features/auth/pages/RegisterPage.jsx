import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check, Target, Dumbbell, Activity, Heart, ArrowRight } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'

// ── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isDone   = step < current
        const isActive = step === current
        return (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
              isDone   ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
            : isActive ? 'bg-blue-50 dark:bg-[#1E293B] border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)]'
                       : 'bg-gray-100 dark:bg-[#0F172A] border-gray-300 dark:border-[#1E293B] text-gray-400 dark:text-gray-500'
            }`}>
              {isDone ? <Check size={14} strokeWidth={3} /> : step}
            </div>
            {i < total - 1 && (
              <div className={`w-12 h-0.5 transition-all duration-300 ${step < current ? 'bg-blue-600' : 'bg-gray-300 dark:bg-[#1E293B]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Goal Cards ────────────────────────────────────────────────────────────────
const GOALS = [
  { id: 'lose-weight',     label: 'Lose Weight',     icon: Target },
  { id: 'build-muscle',    label: 'Build Muscle',    icon: Dumbbell },
  { id: 'improve-fitness', label: 'Improve Fitness', icon: Activity },
  { id: 'stay-healthy',    label: 'Stay Healthy',    icon: Heart },
]
const EXPERIENCE = ['Beginner', 'Intermediate', 'Advanced']

// ── Shared page wrapper ────────────────────────────────────────────────────
function PageWrapper({ children }) {
  const trackRef = useRef(null)
  
  useEffect(() => {
    let ticking = false
    const onMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (trackRef.current) {
            const x = (e.clientX / window.innerWidth  - 0.5) * 20
            const y = (e.clientY / window.innerHeight - 0.5) * 20
            trackRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07080C] flex flex-col text-gray-900 dark:text-white font-['Inter'] selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none will-change-transform transform-gpu">
        <svg ref={trackRef} width="100%" height="100%" preserveAspectRatio="none"
          className="absolute top-0 h-full origin-center will-change-transform transform-gpu opacity-40 transition-transform duration-1000 ease-out text-gray-300 dark:text-white">
          <g stroke="currentColor">
            <line x1="50%" y1="0" x2="50%"  y2="100%" strokeWidth="2"  opacity="0.30" />
            <line x1="50%" y1="0" x2="20%"  y2="100%" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="-10%" y2="100%" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="80%"  y2="100%" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="110%" y2="100%" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="0" y1="30%" x2="100%" y2="30%" strokeWidth="1" opacity="0.15" />
            <line x1="0" y1="60%" x2="100%" y2="60%" strokeWidth="2" opacity="0.15" />
            <line x1="0" y1="90%" x2="100%" y2="90%" strokeWidth="4" opacity="0.15" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(249,250,251,0.95)_100%)] dark:bg-[radial-gradient(ellipse,_transparent_10%,_rgba(7,8,12,0.95)_100%)] z-10 pointer-events-none" />
        <div className="absolute inset-0 z-[70] opacity-[0.03] pointer-events-none transform-gpu"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Top Bar */}
      <header className="relative z-50 w-full pt-8 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-[900] tracking-tight text-gray-900 dark:text-white font-['Syne'] group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">FITFORGE</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold text-[10px] tracking-widest uppercase ml-2 border border-blue-500/30 px-2 py-0.5 rounded-md bg-blue-500/10 hidden sm:block shadow-[0_0_10px_rgba(37,99,235,0.2)]">Sign Up</span>
        </Link>
        <Link to="/auth/login" className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-gray-900 dark:hover:border-white pb-0.5">
          Sign in &rarr;
        </Link>
      </header>

      {children}
    </div>
  )
}

// ── Left side copy (visible on large screens) ───────────────────────────────
function LeftCopy() {
  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
      <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-[#1E293B]/40 border border-blue-200 dark:border-[#2563EB]/30 rounded-full px-4 py-2 mb-8 shadow-[0_0_20px_rgba(37,99,235,0.15)] backdrop-blur-md">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </span>
        <span className="text-blue-600 dark:text-blue-300 text-xs font-bold tracking-widest uppercase">Join FitForge</span>
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white font-['Syne'] leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
        Start your{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">transformation.</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium max-w-lg mb-12 leading-relaxed">
        Create your account and get matched with a dedicated wellness coach, personalized diet plans, and live training sessions.
      </p>
      <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
        {[
          { icon: <Target size={20} className="text-blue-500 dark:text-blue-400"/>,    text: '1-on-1 Coaching' },
          { icon: <Activity size={20} className="text-indigo-500 dark:text-indigo-400"/>, text: 'AI Meal Analysis' },
          { icon: <Dumbbell size={20} className="text-blue-500 dark:text-blue-400"/>,  text: 'Live Sessions' },
          { icon: <Heart size={20} className="text-blue-500 dark:text-blue-400"/>,     text: 'Progress Tracking' },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 bg-white dark:bg-[#0F172A]/40 border border-gray-200 dark:border-[#1E293B] p-3.5 rounded-2xl backdrop-blur-sm shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#030712] border border-gray-200 dark:border-[#1E293B] flex items-center justify-center shadow-inner shrink-0">{f.icon}</div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Common card wrapper ─────────────────────────────────────────────────────
function Card({ step, children }) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 py-12 z-10 relative max-w-7xl mx-auto w-full gap-16">
      <LeftCopy />
      <div className="w-full lg:w-5/12 max-w-md relative z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20 rounded-3xl blur-2xl transform rotate-3 scale-105 -z-10 pointer-events-none" />
        <div className="bg-white/80 dark:bg-[#0F172A]/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <StepIndicator current={step} total={4} />
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate()
  const { login, register, verifyOTP } = useAuth()
  const [userId, setUserId] = useState('')
  const [step, setStep]     = useState(1)
  const [done, setDone]     = useState(false)
  const [regError, setRegError] = useState('')

  // Step 1
  const [form1, setForm1] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // OTP Step
  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const inputRefs = useRef([])

  // Step 3
  const [language, setLanguage]     = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [experience, setExperience] = useState('')

  // Step 4
  const [form3, setForm3] = useState({ height: '', weight: '', age: '', gender: '', activityLevel: '' })

  const f1 = (k) => (e) => { setForm1(p => ({ ...p, [k]: e.target.value })); setRegError('') }
  const f3 = (k) => (e) => setForm3(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    if (!form1.fullName.trim())    return 'Full name is required.'
    if (!form1.email.trim())       return 'Email is required.'
    if (!form1.phone.trim())       return 'Phone number is required.'
    if (form1.password.length < 8) return 'Password must be at least 8 characters.'
    if (form1.password !== form1.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleRegister = async () => {
    setRegError('')
    const err = validate()
    if (err) { setRegError(err); return }
    try {
      const data = await register(form1.fullName, form1.email, form1.password, 'user')
      if (data?.userId) { setUserId(data.userId); setStep(2) }
      else setRegError(data?.message || 'Registration failed. Please try again.')
    } catch {
      setRegError('Network error. Please check your connection and try again.')
    }
  }

  const handleVerifyOTP = async () => {
    const data = await verifyOTP(userId, otp.join(''))
    if (data.message === 'Email verified successfully') setStep(3)
    else setOtpError(data.message)
  }

  const handleCreateAccount = async () => {
    try {
      const data = await login(form1.email, form1.password)
      if (!data?.user) {
        setRegError(data?.message || 'Login failed. Please try logging in manually.')
        return
      }

      // Save Step 3 & 4 data in parallel (non-blocking — account created regardless)
      const profilePayload = { preferredLanguage: language || 'English' }
      const metricsPayload = {
        height:        form3.height        || undefined,
        weight:        form3.weight        || undefined,
        age:           form3.age           || undefined,
        gender:        form3.gender        || undefined,
        activityLevel: form3.activityLevel || undefined,
        goal:          selectedGoal        || undefined,
      }

      await Promise.allSettled([
        fetch(`${API}/users/profile`, {
          method:      'PUT',
          headers:     { 'Content-Type': 'application/json' },
          credentials: 'include',
          body:        JSON.stringify(profilePayload),
        }),
        fetch(`${API}/users/body-metrics`, {
          method:      'PUT',
          headers:     { 'Content-Type': 'application/json' },
          credentials: 'include',
          body:        JSON.stringify(metricsPayload),
        }),
      ])

      setDone(true)
    } catch {
      setRegError('Network error. Please try again.')
    }
  }

  // ── Input style helpers ──────────────────────────────────────────────────────
  const inputCls = "w-full px-5 py-4 text-sm focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium"
  const fieldWrap = "relative flex rounded-2xl overflow-hidden border border-gray-300 dark:border-[#1E293B] bg-white/80 dark:bg-[#030712]/80 backdrop-blur-sm focus-within:border-blue-500/50 transition-colors"
  const labelCls = "block text-[10px] font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1"
  const btnPrimary = "w-full py-4 mt-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-blue-500 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] group"
  const btnBack = "flex-1 py-4 bg-gray-100 dark:bg-[#0F172A] border border-gray-300 dark:border-[#1E293B] text-gray-700 dark:text-white font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-[#1E293B] transition-all"
  const btnNext = "flex-1 py-4 bg-[#2563EB] hover:bg-blue-500 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"

  // ── Done State ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center px-4 z-10 relative">
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20 rounded-3xl blur-2xl transform rotate-3 scale-105 -z-10 pointer-events-none" />
            <div className="bg-white/80 dark:bg-[#0F172A]/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-12 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,99,235,0.3)] animate-in zoom-in duration-500">
                <Check size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Syne'] tracking-tight">Account Created!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Welcome to FitForge. Let's start your journey.</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 bg-[#2563EB] hover:bg-blue-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>

      {/* ── STEP 1: Account Details ── */}
      {step === 1 && (
        <Card step={step}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Syne'] tracking-tight">Create account</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Step 1 of 4 — Account details</p>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <div className={fieldWrap}>
                <input type="text" placeholder="John Doe" value={form1.fullName} onChange={f1('fullName')} className={inputCls} />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className={labelCls}>Email</label>
              <div className={fieldWrap}>
                <input type="email" placeholder="john@example.com" value={form1.email} onChange={f1('email')} className={inputCls} />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className={labelCls}>Phone</label>
              <div className={fieldWrap}>
                <div className="px-4 py-4 border-r border-gray-300 dark:border-[#1E293B] bg-gray-50 dark:bg-[#0F172A] text-gray-600 dark:text-gray-500 font-bold text-sm shrink-0">+91</div>
                <input type="tel" placeholder="9876543210" maxLength={10} value={form1.phone} onChange={f1('phone')} className={inputCls} />
              </div>
            </div>
            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Password</label>
                <div className={fieldWrap}>
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form1.password} onChange={f1('password')} className={inputCls} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="px-4 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Confirm</label>
                <div className={fieldWrap}>
                  <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={form1.confirmPassword} onChange={f1('confirmPassword')} className={inputCls} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-4 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {regError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{regError}</span>
            </div>
          )}

          <button onClick={handleRegister} className={btnPrimary}>
            <span>Continue to Verification</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>


          <div className="text-center space-y-2 pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors ml-1">Sign in</Link>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-500 font-medium">
              Are you a fitness professional?{' '}
              <Link to="/auth/trainer-register" className="text-gray-700 dark:text-gray-300 font-bold hover:text-gray-900 dark:hover:text-white transition-colors ml-1 border-b border-transparent hover:border-gray-900 dark:hover:border-white pb-0.5">Apply as Trainer</Link>
            </p>
          </div>
        </Card>
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 2 && (
        <Card step={step}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Syne'] tracking-tight">Verify your email</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Step 2 of 4 — Code sent to <span className="text-gray-900 dark:text-white font-bold">{form1.email}</span></p>
          </div>

          <div className="mb-6">
            <label className={`${labelCls} text-center block`}>Enter OTP Code</label>
            <div className="flex justify-center gap-2 mt-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (inputRefs.current[i] = el)}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '')
                    if (!/^\d?$/.test(val)) return
                    const next = [...otp]; next[i] = val; setOtp(next)
                    if (val && i < 5) inputRefs.current[i + 1]?.focus()
                  }}
                  onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus() }}
                  onPaste={e => {
                    e.preventDefault()
                    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                    const next = [...otp]; digits.split('').forEach((d, idx) => { if (idx < 6) next[idx] = d }); setOtp(next)
                    inputRefs.current[Math.min(digits.length, 5)]?.focus()
                  }}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                    digit ? 'bg-blue-50 dark:bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-white dark:bg-[#0F172A]/80 border-gray-300 dark:border-[#1E293B] text-gray-900 dark:text-white focus:border-blue-500/50'
                  }`}
                />
              ))}
            </div>
            {otpError && <p className="text-red-400 text-xs mt-3 text-center">{otpError}</p>}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className={btnBack}>Back</button>
            <button onClick={handleVerifyOTP} className={btnNext}>Verify &amp; Continue</button>
          </div>
          <div className="text-center mt-4">
            <button className="text-xs text-gray-500 hover:text-blue-400 transition-colors font-medium">Didn't receive code? Resend</button>
          </div>
        </Card>
      )}

      {/* ── STEP 3: Preferences ── */}
      {step === 3 && (
        <Card step={step}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Syne'] tracking-tight">Your profile</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Step 3 of 4 — Preferences</p>
          </div>

          <div className="space-y-6">
            {/* Language */}
            <div>
              <label className={labelCls}>Preferred Language</label>
              <div className={fieldWrap}>
                <select value={language} onChange={e => setLanguage(e.target.value)} className={`${inputCls} appearance-none`}>
                  <option value="" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Select language</option>
                  {['Malayalam','Hindi','Tamil','Kannada','Telugu','English'].map(l => <option key={l} value={l} className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">{l}</option>)}
                </select>
              </div>
            </div>

            {/* Goal cards */}
            <div>
              <label className={labelCls}>Fitness Goal</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {GOALS.map(({ id, label, icon: Icon }) => {
                  const active = selectedGoal === id
                  return (
                    <button key={id} type="button" onClick={() => setSelectedGoal(id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${active ? 'border-blue-500 bg-blue-50 dark:bg-blue-600/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]' : 'border-gray-300 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]/80 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1E293B]'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-gray-100 dark:bg-[#1E293B] text-gray-600 dark:text-gray-400'}`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-xs font-bold ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className={labelCls}>Experience Level</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {EXPERIENCE.map(lvl => {
                  const active = experience === lvl
                  return (
                    <button key={lvl} type="button" onClick={() => setExperience(lvl)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all duration-300 ${active ? 'border-blue-500 bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'border-gray-300 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1E293B]'}`}
                    >
                      {lvl}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={() => setStep(2)} className={btnBack}>Back</button>
            <button onClick={() => setStep(4)} className={btnNext}>Continue</button>
          </div>
        </Card>
      )}

      {/* ── STEP 4: Body Metrics ── */}
      {step === 4 && (
        <Card step={step}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Syne'] tracking-tight">Body metrics</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Step 4 of 4 — Physical details</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Height (cm)</label>
                <div className={fieldWrap}>
                  <input type="number" placeholder="170" value={form3.height} onChange={f3('height')} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Weight (kg)</label>
                <div className={fieldWrap}>
                  <input type="number" placeholder="70" value={form3.weight} onChange={f3('weight')} className={inputCls} />
                </div>
              </div>
            </div>
            <div>
              <label className={labelCls}>Age</label>
              <div className={fieldWrap}>
                <input type="number" placeholder="25" value={form3.age} onChange={f3('age')} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Gender</label>
              <div className={fieldWrap}>
                <select value={form3.gender} onChange={f3('gender')} className={`${inputCls} appearance-none`}>
                  <option value="" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Select gender</option>
                  <option value="male" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Male</option>
                  <option value="female" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Female</option>
                  <option value="other" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Activity Level</label>
              <div className={fieldWrap}>
                <select value={form3.activityLevel} onChange={f3('activityLevel')} className={`${inputCls} appearance-none`}>
                  <option value="" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Select activity level</option>
                  <option value="sedentary" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Sedentary (little or no exercise)</option>
                  <option value="lightly-active" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Lightly Active (1–3 days/week)</option>
                  <option value="moderately-active" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Moderately Active (3–5 days/week)</option>
                  <option value="very-active" className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">Very Active (6–7 days/week)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={() => setStep(3)} className={btnBack}>Back</button>
            <button onClick={handleCreateAccount} className={btnNext}>Create Account</button>
          </div>
        </Card>
      )}

    </PageWrapper>
  )
}
