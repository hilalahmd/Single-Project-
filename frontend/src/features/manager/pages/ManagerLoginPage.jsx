import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'

export default function ManagerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await login(email, password)
      if (res.user && res.user.role === 'manager') {
        navigate('/manager/dashboard')
      } else {
        setError('Unauthorized. This portal is for managers only.')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF7A1A]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#141419] border border-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient border effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF7A1A]/50 to-transparent" />
          
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-[#0B0B0F] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <UserCheck size={28} className="text-[#FF7A1A]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight font-['Syne'] mb-2">Manager Portal</h1>
            <p className="text-[#9CA3AF] text-sm">Sign in to manage trainer approvals and support.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500 group-focus-within:text-[#FF7A1A] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A1A]/50 focus:ring-1 focus:ring-[#FF7A1A]/50 transition-all text-sm"
                  placeholder="manager@fitforge.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500 group-focus-within:text-[#FF7A1A] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A1A]/50 focus:ring-1 focus:ring-[#FF7A1A]/50 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF7A1A] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#FF7A1A] hover:bg-[#EA580C] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Secure Login
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
