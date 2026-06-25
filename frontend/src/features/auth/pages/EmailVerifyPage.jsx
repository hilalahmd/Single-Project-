import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import Button from '../../../shared/components/Button'

const DEMO_EMAIL = 'john@example.com'
const OTP_LENGTH = 6
const RESEND_SECONDS = 60

export default function EmailVerifyPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [verified, setVerified] = useState(false)
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const inputRefs = useRef([])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next = [...otp]
    digits.split('').forEach((d, i) => { next[i] = d })
    setOtp(next)
    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''))
    setCountdown(RESEND_SECONDS)
    inputRefs.current[0]?.focus()
  }

  if (verified) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto">
          <Check size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Email Verified!</h2>
          <p className="text-sm text-gray-500 mt-1">Your account is ready. Let's go!</p>
        </div>
        <Button variant="primary" fullWidth onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  const filled = otp.join('').length === OTP_LENGTH

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-black">Verify your email</h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          We sent a 6-digit code to{' '}
          <span className="font-bold text-black">{DEMO_EMAIL}</span>.
          <br />
          Enter it below to verify your account.
        </p>
      </div>

      {/* OTP inputs */}
      <div>
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Enter OTP
        </p>
        <div className="flex gap-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              autoFocus={i === 0}
              className={`w-full aspect-square text-center text-xl font-black border-2 focus:outline-none transition-all bg-white ${
                digit
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 focus:border-black'
              }`}
            />
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        disabled={!filled}
        onClick={() => setVerified(true)}
      >
        Verify
      </Button>

      {/* Resend */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            Resend OTP in{' '}
            <span className="font-bold text-black tabular-nums">
              {String(Math.floor(countdown / 60)).padStart(2, '0')}:
              {String(countdown % 60).padStart(2, '0')}
            </span>
          </p>
        ) : (
          <Button variant="ghost" onClick={handleResend}>
            Resend OTP
          </Button>
        )}
      </div>
    </div>
  )
}
