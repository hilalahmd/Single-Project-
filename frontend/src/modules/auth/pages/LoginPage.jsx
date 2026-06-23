import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-[#F5F4F0] flex flex-col text-[#1A1A1A]">

      {/* Top Bar */}
      <header className="bg-white border-b border-[#E5E4E0]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#1A1A1A]">FitForge</span>
          </Link>
          <p className="text-sm text-gray-500 font-medium">
            New here?{' '}
            <Link to="/auth/register" className="text-[#1A1A1A] font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl border border-[#E5E4E0] overflow-hidden flex flex-col lg:flex-row min-h-[560px] shadow-sm">

            {/* Left Info Panel */}
            <div className="lg:w-5/12 bg-[#F5F4F0] border-r border-[#E5E4E0] p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white border border-[#E5E4E0] rounded-full px-3 py-1.5 mb-8 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[#1A1A1A] text-xs font-semibold">500+ trainers online</span>
                </div>
                <h2 className="text-3xl font-bold text-[#1A1A1A] leading-snug mb-4">
                  Your transformation<br />starts today.
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  India's first platform connecting you with certified personal trainers and wellness coaches in your language.
                </p>
              </div>

              {/* Feature list */}
              <div className="relative z-10 space-y-4 my-8">
                {[
                  { icon: '🎯', text: 'Dedicated coach assigned to you' },
                  { icon: '📸', text: 'AI food photo nutrition analysis' },
                  { icon: '🗣️', text: 'Coach in your preferred language' },
                  { icon: '📹', text: 'Live 1-on-1 video PT sessions' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-[#E5E4E0] shadow-sm rounded-lg flex items-center justify-center text-sm shrink-0">
                      {f.icon}
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-white">

              {step === 1 ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Welcome back</h1>
                    <p className="text-gray-500 text-sm font-medium">Sign in with your phone number</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
                        Phone Number
                      </label>
                      <div className="flex rounded-lg overflow-hidden border border-[#E5E4E0] focus-within:ring-2 focus-within:ring-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-all bg-[#F5F4F0]">
                        <div className="flex items-center gap-2 px-4 border-r border-[#E5E4E0] shrink-0 bg-white">
                          <span className="text-base">🇮🇳</span>
                          <span className="text-sm font-semibold text-gray-500">+91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter your 10-digit number"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white text-[#1A1A1A] placeholder-gray-400 font-medium"
                          maxLength={10}
                        />
                      </div>
                      {phone.length > 0 && phone.length < 10 && (
                        <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">Enter a valid 10-digit number</p>
                      )}
                    </div>

                    <button
                      onClick={handleSendOtp}
                      disabled={phone.length < 10 || loading}
                      className="w-full py-3 bg-[#1A1A1A] text-white font-semibold rounded-lg hover:bg-[#2D2D2D] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      {loading
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><span>Send OTP</span><span>→</span></>
                      }
                    </button>

                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-[#E5E4E0]" />
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">secure · encrypted</span>
                      <div className="flex-1 h-px bg-[#E5E4E0]" />
                    </div>

                    <div className="bg-[#F5F4F0] rounded-xl p-4 border border-[#E5E4E0]">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Demo Access</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Client', path: '/dashboard' },
                          { label: 'Trainer', path: '/trainer/dashboard' },
                          { label: 'Admin', path: '/admin' },
                        ].map(role => (
                          <Link
                            key={role.label}
                            to={role.path}
                            className="text-center text-xs py-2 bg-white border border-[#E5E4E0] rounded-lg text-gray-600 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all font-semibold shadow-sm"
                          >
                            {role.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']) }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#1A1A1A] mb-8 transition-colors w-fit"
                  >
                    ← Back
                  </button>

                  <div className="mb-8">
                    <div className="w-12 h-12 bg-[#F5F4F0] border border-[#E5E4E0] rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <span className="text-xl">📱</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Check your phone</h1>
                    <p className="text-gray-500 text-sm font-medium">
                      We sent a 6-digit code to{' '}
                      <span className="font-semibold text-[#1A1A1A]">+91 {phone}</span>
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
                        Enter OTP
                      </label>
                      <div className="flex gap-2 sm:gap-3">
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
                            className={`w-full aspect-square text-center text-xl font-bold border rounded-xl focus:outline-none transition-all bg-white text-[#1A1A1A] shadow-sm
                              ${digit ? 'border-[#1A1A1A] bg-[#F5F4F0]' : 'border-[#E5E4E0]'}
                              focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/20`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVerify}
                      disabled={otp.join('').length < 6 || loading}
                      className="w-full py-3 bg-[#1A1A1A] text-white font-semibold rounded-lg hover:bg-[#2D2D2D] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      {loading
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><span>Verify & Sign in</span><span>→</span></>
                      }
                    </button>

                    <div className="text-center">
                      <span className="text-sm text-gray-500 font-medium">Didn't receive the code? </span>
                      <button
                        onClick={() => setOtp(['', '', '', '', '', ''])}
                        className="text-sm text-[#1A1A1A] font-semibold hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

          <p className="text-center text-xs font-medium text-gray-400 mt-6">
            © 2026 FitForge · Made with ❤️ by Hilal · All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage