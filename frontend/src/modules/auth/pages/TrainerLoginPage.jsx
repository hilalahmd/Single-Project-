import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function TrainerLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/trainer/dashboard') }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#07080C] flex flex-col text-white font-['Inter'] selection:bg-[#2563EB] selection:text-white relative overflow-hidden">
      
      {/* GLOBAL FIXED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu bg-[#030712]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(3,7,18,1)_100%)]"></div>
      </div>

      {/* Top Bar - Transparent */}
      <header className="relative z-50 w-full pt-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-[900] tracking-tight text-white font-['Syne']">FITFORGE</span>
            <span className="text-blue-500 font-bold text-sm tracking-widest uppercase ml-2 border border-blue-500/30 px-2 py-0.5 rounded-md bg-blue-500/10 hidden sm:block">Coach</span>
          </Link>
          <p className="text-sm text-gray-300 font-bold tracking-wide">
            Want to coach?{' '}
            <Link to="/auth/trainer-register" className="text-white hover:text-gray-300 transition-colors ml-2 border-b border-white/30 hover:border-white">Apply now</Link>
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 z-10 relative">
        <div className="w-full max-w-5xl">
          {/* 100% Transparent Login Container */}
          <div className="bg-transparent overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative">
            
            {/* Background Glows inside the container */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none transform-gpu"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none transform-gpu"></div>

            {/* Left Info Panel */}
            <div className="lg:w-5/12 bg-transparent p-10 lg:p-12 flex flex-col justify-between relative z-10">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#1E293B]/50 border border-white/5 rounded-full px-4 py-2 mb-8 shadow-sm backdrop-blur-md">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                  <span className="text-blue-100 text-xs font-bold tracking-wide">Trainer Portal Active</span>
                </div>
                <h2 className="text-4xl font-bold text-white font-['Syne'] leading-tight mb-4">
                  Welcome back<br />to the Forge.
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Log in to manage your clients, schedule sessions, build workout plans, and track your revenue.
                </p>
              </div>

              {/* Feature list */}
              <div className="relative z-10 space-y-5 my-8">
                {[
                  { icon: '📊', text: 'Client Analytics & Management' },
                  { icon: '🗓️', text: 'Smart Scheduling System' },
                  { icon: '💪', text: 'Advanced Plan Builder' },
                  { icon: '💰', text: 'Real-time Revenue Tracking' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1E293B] border border-white/5 shadow-sm rounded-xl flex items-center justify-center text-lg shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-gray-300 text-sm font-semibold">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:w-7/12 p-8 sm:p-14 flex flex-col justify-center bg-transparent z-10">
              <div className="max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10 text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-white font-['Syne'] mb-2 tracking-tight">Trainer Login</h1>
                  <p className="text-gray-400 text-sm font-medium">Enter your credentials to access your dashboard</p>
                </div>

                <div className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-[#1E293B] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-[#030712] shadow-sm">
                      <input
                        type="email"
                        placeholder="coach@fitforge.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="flex-1 px-5 py-3.5 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Password
                      </label>
                      <Link to="/auth/forgot-password" className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-[#1E293B] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-[#030712] shadow-sm">
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="flex-1 px-5 py-3.5 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="px-4 text-gray-500 hover:text-white transition-colors bg-transparent"
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={!email || !password || loading}
                    className="w-full py-4 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                  >
                    {loading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><span>Access Dashboard</span><ArrowRight size={16} /></>
                    }
                  </button>

                  <div className="flex items-center gap-3 py-4">
                    <div className="flex-1 h-px bg-[#1E293B]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={12} /> Secure Login
                    </span>
                    <div className="flex-1 h-px bg-[#1E293B]" />
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-400 font-medium">
                      Not a trainer?{' '}
                      <Link to="/auth/login" className="text-white font-bold hover:text-blue-400 transition-colors ml-1 border-b border-white/30 hover:border-blue-400 pb-0.5">
                        Client Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs font-bold text-gray-600 mt-8 tracking-widest uppercase">
            © 2026 FitForge · Elevate Your Potential
          </p>
        </div>
      </div>
    </div>
  )
}
