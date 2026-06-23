import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Button from '../../../shared/components/Button'
import Input from '../../../shared/components/Input'

export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Restricted Access
        </p>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck size={20} className="text-black" />
          <h1 className="text-xl font-black text-black">Admin Portal</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Authorized administrators only.</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-500 text-center">
        This area is restricted to FitForge platform administrators.
      </div>

      <div className="space-y-4">
        <Input label="Admin Email" type="email" placeholder="admin@fitforge.com" />
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
            Password
          </label>
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

      <Button variant="primary" fullWidth onClick={() => navigate('/admin')}>
        Access Dashboard
      </Button>
    </div>
  )
}
