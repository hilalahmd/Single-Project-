import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Input from '../../../shared/components/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-14 h-14 bg-black flex items-center justify-center mx-auto">
          <Mail size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-black">Check your email</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            We sent a reset link to{' '}
            <span className="font-bold text-black">{email}</span>.
            <br />
            It expires in 15 minutes.
          </p>
        </div>
        <Button
          variant="ghost"
          fullWidth
          onClick={() => setSent(false)}
        >
          Resend email
        </Button>
        <Link
          to="/auth/login"
          className="block text-center text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-black">Forgot password?</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <Input
        label="Email address"
        type="email"
        placeholder="john@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <Button
        variant="primary"
        fullWidth
        onClick={() => email && setSent(true)}
      >
        Send Reset Link
      </Button>

      <Link
        to="/auth/login"
        className="block text-center text-sm text-gray-500 hover:text-black transition-colors"
      >
        ← Back to login
      </Link>
    </div>
  )
}
