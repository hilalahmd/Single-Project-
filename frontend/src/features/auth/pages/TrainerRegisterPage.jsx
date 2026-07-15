import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../shared/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Upload, X, Check, FileText, ArrowRight, ArrowLeft, Users, TrendingUp, Trophy, Shield, Loader2 } from 'lucide-react'
import API from '../../../shared/utils/api'

const SPECIALTIES = [
  'Weight Loss', 'Muscle Building', 'HIIT', 'Yoga',
  'Nutrition', 'Rehab', 'Sports', 'Flexibility',
]
const LANGUAGES = ['Malayalam', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'English']

export default function TrainerRegisterPage() {
  const { register, verifyOTP, login, user, logout } = useAuth()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (user && user.trainerStatus === null && (user.role === 'trainer' || user.role === 'wellness_coach')) {
      setUserId(user._id)
      setStep(3)
    }
  }, [user])
  
  // Step 1: Personal Info
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })
  const [role, setRole] = useState('trainer') // Default to trainer
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Step 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const inputRefs = useRef([])

  // Step 3: Professional Profile
  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  const [wellnessPrice, setWellnessPrice] = useState('')
  const [personalPrice, setPersonalPrice] = useState('')

  // Step 4: Documents
  const [files, setFiles] = useState([])
  const fileRef = useRef()

  const toggleSpecialty = (s) =>
    setSelectedSpecialties(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )

  const toggleLanguage = (l) =>
    setSelectedLanguages(prev =>
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    )

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files)
    setFiles(prev => [...prev, ...picked])
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const data = await register(form.name, form.email, form.password, role)
    if (data.userId) {
      setUserId(data.userId)
      setStep(2)
    } else {
      alert(data.message)
    }
  }

  const handleVerifyOTP = async () => {
    const data = await verifyOTP(userId, otp.join(''))
    if (data.message === 'Email verified successfully') {
      // User is verified, now login to get the JWT token for the next step
      await login(form.email, form.password)
      setStep(3)
    } else {
      setOtpError(data.message)
    }
  }

  const handleFinalSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('userId', userId)
      formData.append('bio', bio)
      formData.append('experience', experience)
      formData.append('wellnessPrice', wellnessPrice)
      formData.append('personalPrice', personalPrice)
      
      selectedSpecialties.forEach(s => formData.append('specialties', s))
      selectedLanguages.forEach(l => formData.append('languagesSpoken', l))
      
      files.forEach(f => {
        formData.append('certifications', f)
      })

      const res = await fetch(`${API}/trainers/complete-registration`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to submit application')
      }
      
      await logout()
      setDone(true)
    } catch (error) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#07080C] flex flex-col text-white font-['Inter'] relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(7,8,12,0.95)_100%)] z-10"></div>
        </div>
        <div className="flex-1 flex items-center justify-center relative z-10 p-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-24 h-24 rounded-full bg-orange-600 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(249,115,22,0.6)]">
              <Check size={40} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white font-['Syne'] tracking-tight">Application Submitted</h2>
              <p className="text-gray-400 mt-4 leading-relaxed font-medium">
                Your profile is under review. We'll notify you via email within <strong className="text-orange-400">24–48 hours</strong>.
              </p>
            </div>
            <Link to="/auth/trainer-login" className="inline-block mt-4">
              <button className="px-8 py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/30">
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07080C] flex flex-col text-white font-['Inter'] selection:bg-[#F97316] selection:text-white relative overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute top-0 h-full origin-center opacity-40">
          <g>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="2" opacity="0.30" />
            <line x1="50%" y1="0" x2="20%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="-10%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="80%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="110%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="10 10" opacity="0.30" />
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="1" opacity="0.15" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="2" opacity="0.15" />
            <line x1="0" y1="90%" x2="100%" y2="90%" stroke="white" strokeWidth="4" opacity="0.15" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(7,8,12,0.95)_100%)] z-10 pointer-events-none"></div>
        <div className="absolute inset-0 z-[70] opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/15 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>

      <header className="relative z-50 w-full pt-8 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-[900] tracking-tight text-white font-['Syne'] group-hover:text-orange-400 transition-colors">FITFORGE</span>
          <span className="text-orange-400 font-bold text-[10px] tracking-widest uppercase ml-2 border border-orange-500/30 px-2 py-0.5 rounded-md bg-orange-500/10 hidden sm:block">Coach Apply</span>
        </Link>
        <Link to="/auth/trainer-login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5 whitespace-nowrap">
          Sign In &rarr;
        </Link>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 py-12 z-10 relative max-w-7xl mx-auto w-full gap-16">
        
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#1E293B]/40 border border-[#F97316]/30 rounded-full px-4 py-2 mb-8 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-orange-300 text-xs font-bold tracking-widest uppercase">Accepting Apps</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white font-['Syne'] leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Elite.</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-lg mb-12 leading-relaxed">
            Submit your professional profile to join our global network. Scale your fitness business, manage clients effortlessly, and maximize your impact.
          </p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            {[
              { icon: <Users size={20} className="text-orange-400"/>, text: 'Global Audience' },
              { icon: <TrendingUp size={20} className="text-orange-400"/>, text: 'Scale Revenue' },
              { icon: <Trophy size={20} className="text-orange-400"/>, text: 'Elite Status' },
              { icon: <Shield size={20} className="text-orange-400"/>, text: 'Zero Hassle' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#0F172A]/40 border border-[#1E293B] p-3.5 rounded-2xl backdrop-blur-sm shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#030712] border border-[#1E293B] flex items-center justify-center shadow-inner shrink-0">{f.icon}</div>
                <span className="text-sm font-semibold text-gray-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-5/12 max-w-md relative z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-orange-600/20 rounded-3xl blur-2xl transform rotate-3 scale-105 -z-10 pointer-events-none"></div>
          
          <div className="bg-[#0F172A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">
            
            <div className="flex gap-2 mb-10">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-[#1E293B]'}`} />
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white font-['Syne'] tracking-tight">Apply Now</h2>
              <p className="text-gray-400 text-sm font-medium mt-2">
                {step === 1 && "Step 1: Personal Information"}
                {step === 2 && "Step 2: Email Verification"}
                {step === 3 && "Step 3: Professional Profile"}
                {step === 4 && "Step 4: Pricing & Documents"}
              </p>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Select Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      onClick={() => setRole('trainer')}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${role === 'trainer' ? 'bg-[#F97316]/10 border-[#F97316] text-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-[#030712]/80 border-[#1E293B] text-gray-400 hover:border-gray-600 hover:text-gray-200'}`}
                    >
                      Personal Trainer
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRole('wellness_coach')}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${role === 'wellness_coach' ? 'bg-[#F97316]/10 border-[#F97316] text-[#F97316] shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'bg-[#030712]/80 border-[#1E293B] text-gray-400 hover:border-gray-600 hover:text-gray-200'}`}
                    >
                      Wellness Coach
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                    <input type="text" placeholder="e.g. Jane Smith" value={form.name} onChange={f('name')} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Phone</label>
                  <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                    <div className="px-4 py-4 border-r border-[#1E293B] bg-[#0F172A] text-gray-500 font-bold text-sm shrink-0">+91</div>
                    <input type="tel" placeholder="9876543210" maxLength={10} value={form.phone} onChange={f('phone')} className="flex-1 px-4 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                    <input type="email" placeholder="coach@fitforge.com" value={form.email} onChange={f('email')} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                      <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={f('password')} className="w-full px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="px-3 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Confirm</label>
                    <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                      <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={form.confirmPassword} onChange={f('confirmPassword')} className="w-full px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-3 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button onClick={handleRegister} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group">
                    <span>Verify Email</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-xs text-gray-500 font-medium mt-6">
                    Already registered?{' '}
                    <Link to="/auth/trainer-login" className="text-gray-300 font-bold hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5 ml-1">Sign In</Link>
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1 text-center">Enter OTP Code</label>
                  <p className="text-gray-400 text-sm font-medium mt-1 text-center mb-4">Code sent to <span className="text-white font-bold">{form.email}</span></p>
                  
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
                          digit ? 'bg-orange-600/10 border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-[#0F172A]/80 border-[#1E293B] text-white focus:border-orange-500/50'
                        }`}
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-red-400 text-xs mt-3 text-center">{otpError}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 bg-[#0F172A] border border-[#1E293B] text-white font-bold rounded-2xl hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </button>
                  <button onClick={handleVerifyOTP} className="flex-1 py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group">
                    <span>Verify</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Experience (Years Active)</label>
                  <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors w-1/2">
                    <input type="number" placeholder="e.g. 5" min="0" value={experience} onChange={e => setExperience(e.target.value)} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Core Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map(s => {
                      const active = selectedSpecialties.includes(s)
                      return (
                        <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${active ? 'bg-orange-600 text-white border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-[#030712] text-gray-400 border-[#1E293B] hover:border-orange-500/50 hover:text-white'}`}>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map(l => {
                      const checked = selectedLanguages.includes(l)
                      return (
                        <button key={l} type="button" onClick={() => toggleLanguage(l)}
                          className={`px-3 py-1.5 text-[11px] flex items-center gap-1.5 font-bold rounded-lg border transition-all ${checked ? 'bg-orange-600 text-white border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-[#030712] text-gray-400 border-[#1E293B] hover:border-orange-500/50 hover:text-white'}`}>
                          {checked && <Check size={10} strokeWidth={4} />}
                          {l}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Short Bio</label>
                    <span className={`text-[10px] font-bold ${bio.length >= 100 ? 'text-emerald-400' : 'text-gray-500'}`}>{bio.length}/100</span>
                  </div>
                  <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                    <textarea rows={3} placeholder="Your training philosophy..." value={bio} onChange={e => setBio(e.target.value)} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium resize-none" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-4 bg-[#0F172A] border border-[#1E293B] text-white font-bold rounded-2xl hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </button>
                  <button onClick={() => setStep(4)} className="flex-1 py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group">
                    <span>Next</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Wellness Plan (₹)</label>
                    <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                      <input type="number" placeholder="999" value={wellnessPrice} onChange={e => setWellnessPrice(e.target.value)} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">PT Plan (₹)</label>
                    <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                      <input type="number" placeholder="2499" value={personalPrice} onChange={e => setPersonalPrice(e.target.value)} className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Certifications & ID</label>
                  <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-[#1E293B] rounded-2xl hover:border-orange-500 hover:bg-orange-500/5 transition-all p-6 text-center cursor-pointer group bg-[#030712]/50">
                    <Upload size={24} className="text-gray-400 group-hover:text-white transition-colors mx-auto mb-3" />
                    <p className="text-sm font-bold text-white mb-1">Upload Documents</p>
                    <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">PDF, JPG, PNG</p>
                    <input ref={fileRef} type="file" accept=".pdf,image/*" multiple onChange={handleFiles} className="hidden" />
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto pr-1">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#030712] border border-[#1E293B] rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText size={14} className="text-orange-500 shrink-0" />
                            <span className="text-xs font-medium text-gray-300 truncate max-w-[200px]">{f.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile(i)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(3)} className="flex-1 py-4 bg-[#0F172A] border border-[#1E293B] text-white font-bold rounded-2xl hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                  </button>
                  <button onClick={handleFinalSubmit} disabled={submitting} className={`flex-1 py-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 group ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span>{submitting ? 'Submitting...' : 'Submit'}</span>
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} className="group-hover:scale-110 transition-transform" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}