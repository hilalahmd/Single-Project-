import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import API from '../../../shared/utils/api'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch(`${API}/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.message === 'Password reset link sent to your email') {
        setSent(true)
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success state ───────────────────────────────────────────────── */
  if (sent) {
    return (
      <div className="text-center space-y-6 py-2">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,99,235,0.25)]">
          <CheckCircle2 size={28} className="text-blue-400" />
        </div>

        {/* Copy */}
        <div>
          <h2 className="text-xl font-bold text-white font-['Syne'] tracking-tight">
            Check your email
          </h2>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            We sent a password reset link to{' '}
            <span className="font-bold text-white">{email}</span>.
            <br />
            The link expires in <span className="text-blue-400 font-semibold">15 minutes</span>.
          </p>
        </div>

        {/* Resend — actually re-fires the API call */}
        <button
          onClick={async () => {
            setSent(false)
            setLoading(true)
            setError('')
            try {
              const res  = await fetch(`${API}/auth/forgot-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email }),
              })
              const data = await res.json()
              if (data.message === 'Password reset link sent to your email') {
                setSent(true)
              } else {
                setError(data.message || 'Something went wrong.')
              }
            } catch {
              setError('Network error. Please try again.')
            } finally {
              setLoading(false)
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
        >
          <Send size={15} />
          Resend email
        </button>

        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    )
  }

  /* ── Form state ──────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold text-white font-['Syne'] tracking-tight">
          Forgot password?
        </h1>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Email field */}
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-0.5">
          Email address
        </label>
        <div className="relative flex rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-blue-500/50 transition-colors">
          <div className="pl-4 flex items-center text-gray-500 shrink-0">
            <Mail size={16} />
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-3.5 text-sm bg-transparent text-white placeholder-gray-600 focus:outline-none font-medium"
            autoComplete="email"
            autoFocus
          />
        </div>
      </div>

      {/* Inline error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2563EB] hover:bg-blue-500 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)]"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Sending...</>
          : <><Send size={15} /> Send Reset Link</>
        }
      </button>

      <Link
        to="/auth/login"
        className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to login
      </Link>
    </div>
  )
}
