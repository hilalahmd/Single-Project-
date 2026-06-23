import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Input from '../../../shared/components/Input'

export default function TrainerLoginPage() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-black">Login as Trainer</h1>
        <p className="text-sm text-gray-500 mt-0.5">Access your trainer dashboard.</p>
      </div>

      <div className="space-y-4">
        <Input label="Email" type="email" placeholder="trainer@example.com" />

        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex items-center border border-gray-300 focus-within:border-black transition-colors">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
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
        </div>
      </div>

      <Button variant="primary" fullWidth onClick={() => navigate('/trainer/dashboard')}>
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-500">
        New trainer?{' '}
        <Link
          to="/auth/trainer-register"
          className="font-semibold text-black underline underline-offset-2"
        >
          Register here
        </Link>
      </p>
    </div>
  )
}
