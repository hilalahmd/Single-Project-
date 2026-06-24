import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const handleSendOtp = () => {
    if (phone.length < 10) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(2) }, 1200)
  }

  const handleVerify = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/dashboard') }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#07080C] flex flex-col text-white font-['Inter'] selection:bg-[#2563EB] selection:text-white relative overflow-hidden">
      
      {/* GLOBAL FIXED BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu bg-[#030712]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,_transparent_10%,_rgba(3,7,18,1)_100%)]"></div>
      </div>

      {/* Top Bar - Transparent */}
      <header className="relative z-50 w-full pt-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-[900] tracking-tight text-white font-['Syne']">FITFORGE</span>
          </Link>
          <p className="text-sm text-gray-300 font-bold tracking-wide">
            New here?{' '}
            <Link to="/auth/register" className="text-white hover:text-gray-300 transition-colors ml-2 border-b border-white/30 hover:border-white">Create account</Link>
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
                  <span className="text-blue-100 text-xs font-bold tracking-wide">500+ coaches active now</span>
                </div>
                <h2 className="text-4xl font-bold text-white font-['Syne'] leading-tight mb-4">
                  Welcome to the<br />next level.
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Log in to connect with your dedicated coach, track your nutrition, and crush your fitness goals.
                </p>
              </div>

              {/* Feature list */}
              <div className="relative z-10 space-y-5 my-8">
                {[
                  { icon: '🎯', text: '1-on-1 Personalized Coaching' },
                  { icon: '📸', text: 'AI-Powered Meal Analysis' },
                  { icon: '🗣️', text: 'Multilingual Support' },
                  { icon: '📹', text: 'Live Video Sessions' },
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

              {step === 1 ? (
                <div className="max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-white font-['Syne'] mb-2 tracking-tight">Welcome back</h1>
                    <p className="text-gray-400 text-sm font-medium">Sign in with your registered phone number</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-[#1E293B] focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-[#030712] shadow-sm">
                        <div className="flex items-center gap-2 px-4 border-r border-[#1E293B] shrink-0 bg-[#0F172A]">
                          <span className="text-base">🇮🇳</span>
                          <span className="text-sm font-bold text-gray-400">+91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter your 10-digit number"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="flex-1 px-4 py-3.5 text-sm focus:outline-none bg-transparent text-white placeholder-gray-600 font-medium"
                          maxLength={10}
                        />
                      </div>
                      {phone.length > 0 && phone.length < 10 && (
                        <p className="text-xs text-red-400 mt-2 ml-1 font-medium flex items-center gap-1">
                          Enter a valid 10-digit number
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleSendOtp}
                      disabled={phone.length < 10 || loading}
                      className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                    >
                      {loading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><span>Continue</span><ArrowRight size={16} /></>
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
                        Are you a trainer?{' '}
                        <Link to="/auth/trainer-login" className="text-white font-bold hover:text-blue-400 transition-colors ml-1 border-b border-white/30 hover:border-blue-400 pb-0.5">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <button
                    onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']) }}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-white mb-10 transition-colors w-fit"
                  >
                    ← Back
                  </button>

                  <div className="mb-10">
                    <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                      <Phone size={24} className="text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white font-['Syne'] mb-2 tracking-tight">Verify phone</h1>
                    <p className="text-gray-400 text-sm font-medium">
                      We sent a 6-digit code to{' '}
                      <span className="font-bold text-white">+91 {phone}</span>
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <div className="flex gap-2 sm:gap-3 justify-between">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleOtpChange(e.target.value, i)}
                            onKeyDown={e => handleOtpKeyDown(e, i)}
                            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black border rounded-xl focus:outline-none transition-all bg-[#030712] text-white shadow-sm
                              ${digit ? 'border-blue-500 bg-blue-600/5 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'border-[#1E293B]'}
                              focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={otp.join('').length < 6 || loading}
                      className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                    >
                      {loading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><span>Verify & Sign In</span><CheckCircle2 size={18} /></>
                      }
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-500 font-medium">Didn't receive the code? </span>
                      <button
                        onClick={() => setOtp(['', '', '', '', '', ''])}
                        className="text-sm text-blue-400 font-bold hover:text-blue-300 transition-colors"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                </div>
              )}

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

export default LoginPage