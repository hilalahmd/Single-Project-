import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Target, Dumbbell, Activity, Heart, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { z } from 'zod'

// Zod login schema — mirrors backend loginSchema (email format + non-empty password)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.'),
})

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const trackRef   = useRef(null)

  useEffect(() => {
    let ticking = false
    const onMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (trackRef.current) {
            const x = (e.clientX / window.innerWidth  - 0.5) * 30
            const y = (e.clientY / window.innerHeight - 0.5) * 30
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

  const handleLogin = async (e) => {
    e?.preventDefault()

    // Client-side Zod validation — runs before any API call
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const errs = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field && !errs[field]) errs[field] = issue.message
      }
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})

    setLoading(true)
    try {
      const data = await login(email, password)
      if (data.user) {
        const role = data.user.role
        if (role === 'trainer' || role === 'wellness_coach') navigate('/trainer/dashboard')
        else if (role === 'admin') navigate('/admin')
        else navigate('/dashboard')
      } else {
        alert(data.message)
      }
    } catch {
      alert('Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col text-white font-['Inter'] selection:bg-white selection:text-black relative overflow-x-hidden">

      {/* ── Cinematic Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none will-change-transform transform-gpu">
        <svg
          ref={trackRef}
          width="100%" height="100%"
          preserveAspectRatio="none"
          className="absolute top-0 h-full origin-center will-change-transform transform-gpu opacity-30 transition-transform duration-1000 ease-out"
        >
          <g>
            <line x1="50%" y1="0" x2="50%"  y2="100%" stroke="white" strokeWidth="2"  opacity="0.25" />
            <line x1="50%" y1="0" x2="20%"  y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.25" />
            <line x1="50%" y1="0" x2="-10%" y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.25" />
            <line x1="50%" y1="0" x2="80%"  y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.25" />
            <line x1="50%" y1="0" x2="110%" y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.25" />
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="1" opacity="0.1" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="2" opacity="0.1" />
            <line x1="0" y1="90%" x2="100%" y2="90%" stroke="white" strokeWidth="4" opacity="0.1" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(0,0,0,0.95)_100%)] z-10 pointer-events-none" />
        
        {/* Soft White Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* ── Top Bar ── */}
      <header className="relative z-50 w-full pt-8 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tight text-white font-['Syne'] group-hover:text-gray-300 transition-colors">FITFORGE</span>
          <span className="text-white font-bold text-[10px] tracking-widest uppercase ml-2 border border-white/20 px-2.5 py-0.5 rounded-full bg-white/10 hidden sm:block shadow-sm">Member Login</span>
        </Link>
        <Link to="/auth/register" className="text-xs font-extrabold text-gray-400 hover:text-white uppercase tracking-wider transition-colors border-b border-transparent hover:border-white pb-0.5">
          Create account &rarr;
        </Link>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 py-12 z-10 relative max-w-7xl mx-auto w-full gap-16">

        {/* Left: Cinematic Copy */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-white text-[11px] font-extrabold tracking-widest uppercase">500+ coaches active</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white font-['Syne'] leading-[1.1] mb-6 tracking-tight drop-shadow-2xl uppercase">
            Welcome to the{' '}
            <span className="text-gray-400">next level.</span>
          </h1>
          <p className="text-gray-400 text-base font-medium max-w-lg mb-12 leading-relaxed">
            Log in to connect with your dedicated coach, track your nutrition, and crush your fitness goals.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
            {[
              { icon: <Target size={18} className="text-white"/>,    text: '1-on-1 Coaching' },
              { icon: <Activity size={18} className="text-white"/>, text: 'AI Meal Analysis' },
              { icon: <Dumbbell size={18} className="text-white"/>,  text: 'Live Sessions' },
              { icon: <Heart size={18} className="text-white"/>,     text: 'Progress Tracking' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#0a0a0a] border border-white/15 p-3.5 rounded-2xl backdrop-blur-md shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                  {f.icon}
                </div>
                <span className="text-xs font-bold text-gray-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Glass Login Card */}
        <div className="w-full lg:w-5/12 max-w-md relative z-10">
          {/* Card glow */}
          <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl transform rotate-3 scale-105 -z-10 pointer-events-none" />

          <div className="bg-[#0a0a0a] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden relative">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white font-['Syne'] tracking-tight uppercase">Welcome back</h2>
              <p className="text-gray-400 text-xs font-medium mt-2">Sign in with your email and password.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className={`relative flex rounded-2xl overflow-hidden border bg-white/5 backdrop-blur-sm focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all ${
                  fieldErrors.email ? 'border-red-500/60' : 'border-white/15'
                }`}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })) }}
                    className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-bold"
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-red-400 text-xs font-medium mt-1.5 ml-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <Link to="/auth/forgot-password" className="text-[11px] text-gray-400 font-bold hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className={`relative flex rounded-2xl overflow-hidden border bg-white/5 backdrop-blur-sm focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all ${
                  fieldErrors.password ? 'border-red-500/60' : 'border-white/15'
                }`}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })) }}
                    className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="px-4 text-gray-500 hover:text-gray-300 transition-colors bg-transparent focus:outline-none cursor-pointer"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-400 text-xs font-medium mt-1.5 ml-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-white text-black font-extrabold rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,255,255,0.25)] group cursor-pointer"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <>
                      <span>Sign In</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                }
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={12} /> Secure Login
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Footer links */}
              <div className="text-center space-y-2 pt-1">
                <p className="text-xs text-gray-500 font-medium">
                  New here?{' '}
                  <Link to="/auth/register" className="text-white font-bold hover:underline transition-colors ml-1">
                    Create account
                  </Link>
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Are you a trainer?{' '}
                  <Link to="/auth/trainer-login" className="text-gray-300 font-bold hover:text-white transition-colors ml-1 underline">
                    Coach Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}