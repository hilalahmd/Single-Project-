import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'

// Standalone component for Admin Login exactly as requested.
export default function AdminLoginPage() {
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

 const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const data = await login(email, password)
    if (data.user && data.user.role === 'admin') {
      navigate('/admin')
    } else if (data.user) {
      alert('This account is not an admin account')
    } else {
      alert(data.message)
    }
  } catch (err) {
    alert('Login failed. Try again.')
  }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 selection:bg-black selection:text-white">
      <div className="w-full max-w-md mx-auto bg-white p-10 rounded-3xl border border-gray-200 shadow-xl shadow-black/5 relative overflow-hidden">
        
        {/* Subtle top decoration */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 to-black"></div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/20">
            <ShieldCheck size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Restricted Access
          </p>
          <h1 className="text-2xl font-black text-black tracking-tight">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Authorized administrators only.</p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-700 text-center font-bold mb-8">
          This area is strictly restricted to FitForge platform administrators.
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <input 
              type="email" 
              placeholder="admin@fitforge.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors overflow-hidden">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="px-4 text-gray-400 hover:text-black transition-colors"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 shadow-md hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
