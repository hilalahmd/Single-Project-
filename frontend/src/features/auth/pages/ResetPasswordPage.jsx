import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Check } from 'lucide-react'
import Button from '../../../shared/components/Button'
import API from '../../../shared/utils/api'

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0–4
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const strength = getStrength(pw)

  if (done) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto">
          <Check size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Password Reset!</h2>
          <p className="text-sm text-gray-500 mt-1">Your password has been updated successfully.</p>
        </div>
        <Button variant="primary" fullWidth onClick={() => navigate('/auth/login')}>
          Go to Login
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-black">Reset password</h1>
        <p className="text-sm text-gray-500 mt-0.5">Choose a strong new password.</p>
      </div>

      {/* New password */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          New Password
        </label>
        <div className="flex items-center border border-gray-300 focus-within:border-black transition-colors">
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="px-3 text-gray-400 hover:text-black transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Strength bars */}
        {pw.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`flex-1 h-1 transition-all ${
                    i <= strength ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Strength: <span className="font-semibold text-black">{STRENGTH_LABELS[strength]}</span>
            </p>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Confirm Password
        </label>
        <div className="flex items-center border border-gray-300 focus-within:border-black transition-colors">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Re-enter password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm focus:outline-none bg-white"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="px-3 text-gray-400 hover:text-black transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {confirm && pw !== confirm && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={async () => {
  if (!pw || pw !== confirm) return
  const token = new URLSearchParams(window.location.search).get('token')
  const res = await fetch(`${API}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password: pw })
  })
  const data = await res.json()
  if (data.message === 'Password reset successful') {
    setDone(true)
  } else {
    alert(data.message)
  }
}}
      >
        Reset Password
      </Button>
    </div>
  )
}
