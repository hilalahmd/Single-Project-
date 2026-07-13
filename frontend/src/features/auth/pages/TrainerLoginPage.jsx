import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Users, TrendingUp, Trophy, Shield, AlertCircle } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'

export default function TrainerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { login, logout } = useAuth()

  const trackRef = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    let ticking = false
    const onMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (trackRef.current) {
            const x = (e.clientX / window.innerWidth - 0.5) * 30
            const y = (e.clientY / window.innerHeight - 0.5) * 30
            trackRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      const data = await login(email, password)
      if (data.user) {
        if (data.user.role === 'trainer' || data.user.role === 'wellness_coach') {
          if (data.user.trainerStatus === 'rejected') {
            if (data.user.rejectionReason) sessionStorage.setItem('rejectionReason', data.user.rejectionReason)
            window.location.href = '/auth/trainer-resubmit'
          } else if (data.user.trainerStatus === null || data.user.trainerStatus === 'pending') {
            await logout()
            showToast('Admin approval is pending')
          } else {
            window.location.href = '/trainer/dashboard'
          }
        } else {
          showToast('This account is not a trainer account')
        }
      } else {
        showToast(data.message)
      }
    } catch (err) {
      showToast('Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07080C] flex flex-col text-white font-['Inter'] selection:bg-[#F97316] selection:text-white relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {toast}
          </div>
        </div>
      )}

      {/* GLOBAL FIXED BACKGROUND — matches trainer-register */}
      <div className="fixed inset-0 z-0 pointer-events-none will-change-transform transform-gpu">
        <svg
          ref={trackRef}
          width="100%" height="100%"
          preserveAspectRatio="none"
          className="absolute top-0 h-full origin-center will-change-transform transform-gpu opacity-40 transition-transform duration-1000 ease-out"
        >
          <g>
            <line x1="50%" y1="0" x2="50%"  y2="100%" stroke="white" strokeWidth="2"  opacity="0.30" />
            <line x1="50%" y1="0" x2="20%"  y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="-10%" y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="80%"  y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="50%" y1="0" x2="110%" y2="100%" stroke="white" strokeWidth="2"  strokeDasharray="10 10" opacity="0.30" />
            <line x1="0" y1="30%" x2="100%" y2="30%" stroke="white" strokeWidth="1" opacity="0.15" />
            <line x1="0" y1="60%" x2="100%" y2="60%" stroke="white" strokeWidth="2" opacity="0.15" />
            <line x1="0" y1="90%" x2="100%" y2="90%" stroke="white" strokeWidth="4" opacity="0.15" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(7,8,12,0.95)_100%)] z-10 pointer-events-none" />
        {/* Film Grain */}
        <div
          className="absolute inset-0 z-[70] opacity-[0.03] pointer-events-none transform-gpu"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        />
        {/* Orange Orbs — same as register */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Top Bar */}
      <header className="relative z-50 w-full pt-8 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-[900] tracking-tight text-white font-['Syne'] group-hover:text-orange-400 transition-colors">FITFORGE</span>
          <span className="text-orange-400 font-bold text-[10px] tracking-widest uppercase ml-2 border border-orange-500/30 px-2 py-0.5 rounded-md bg-orange-500/10 hidden sm:block shadow-[0_0_10px_rgba(249,115,22,0.2)]">Coach Portal</span>
        </Link>
        <Link to="/auth/trainer-register" className="text-sm font-bold text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
          Apply as Coach &rarr;
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 py-12 z-10 relative max-w-7xl mx-auto w-full gap-16">

        {/* Left Side: Cinematic Copy */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
          {/* Accepting Apps badge — same as register */}
          <div className="inline-flex items-center gap-2 bg-[#1E293B]/40 border border-[#F97316]/30 rounded-full px-4 py-2 mb-8 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-orange-300 text-xs font-bold tracking-widest uppercase">Coach Portal</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white font-['Syne'] leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
            Lead the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Forge.</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-lg mb-12 leading-relaxed">
            Welcome back, Coach. Log in to access your analytics, build powerful plans, and connect with your dedicated clients.
          </p>

          {/* Feature grid — same card style as register */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            {[
              { icon: <Users size={20} className="text-orange-400"/>, text: 'Global Audience' },
              { icon: <TrendingUp size={20} className="text-orange-400"/>, text: 'Scale Revenue' },
              { icon: <Trophy size={20} className="text-orange-400"/>, text: 'Elite Status' },
              { icon: <Shield size={20} className="text-orange-400"/>, text: 'Zero Hassle' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#0F172A]/40 border border-[#1E293B] p-3.5 rounded-2xl backdrop-blur-sm shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#030712] border border-[#1E293B] flex items-center justify-center shadow-inner shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm font-semibold text-gray-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Card — same glass style as register */}
        <div className="w-full lg:w-5/12 max-w-md relative z-10">
          {/* Card backdrop glow — orange like register */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-orange-600/20 rounded-3xl blur-2xl transform rotate-3 scale-105 -z-10 pointer-events-none" />

          <div className="bg-[#0F172A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white font-['Syne'] tracking-tight">Trainer Login</h2>
              <p className="text-gray-400 text-sm font-medium mt-2">Secure access to your dashboard.</p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="coach@fitforge.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                  <Link to="/auth/forgot-password" className="text-[11px] text-orange-400 font-bold hover:text-orange-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex rounded-2xl overflow-hidden border border-[#1E293B] bg-[#030712]/80 backdrop-blur-sm focus-within:border-orange-500/50 transition-colors">
                  <input
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="flex-1 px-5 py-4 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="px-4 text-gray-500 hover:text-gray-300 transition-colors bg-transparent focus:outline-none"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit — orange like register */}
              <button
                onClick={handleLogin}
                disabled={!email || !password || loading}
                className="w-full py-4 mt-4 bg-[#F97316] text-white font-bold rounded-2xl hover:bg-[#EA580C] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] group"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>
                      <span>Access Dashboard</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                }
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 font-medium">
                  Not a trainer?{' '}
                  <Link to="/auth/login" className="text-gray-300 font-bold hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5 ml-1">
                    Client Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
