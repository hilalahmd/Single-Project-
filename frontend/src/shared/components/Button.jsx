import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  fullWidth = false,
  type = 'button',
  className = ''
}) {
  const { role } = useAuth()
  const isClient = role !== 'trainer' && role !== 'admin'

  const base = `
    inline-flex items-center justify-center font-['Syne'] font-[800]
    uppercase tracking-[0.05em] transition-all duration-300
    focus:outline-none disabled:opacity-40 disabled:pointer-events-none
    ${isClient ? 'rounded-[10px]' : 'rounded-full'}
  `

  const variants = {
    primary: isClient ? `
      bg-[#F97316] text-white shadow-[0_4px_14px_rgba(249,115,22,0.3)]
      hover:bg-[#1D4ED8] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:-translate-y-0.5
    ` : `
      bg-[#F97316] text-white
      hover:bg-white hover:text-[#F97316] hover:scale-105
      shadow-[0_0_30px_rgba(37,99,235,0.4)]
      hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]
    `,
    secondary: isClient ? `
      bg-transparent border border-[#E2E8F0] text-[#0F172A] shadow-sm
      hover:bg-[#F97316]/5 hover:border-[#F97316] hover:-translate-y-0.5
    ` : `
      bg-white/5 backdrop-blur-lg border border-white/20 text-white
      hover:bg-white/15 hover:border-white/40 hover:scale-105
      hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
    `,
    ghost: isClient ? `
      bg-transparent text-[#64748B]
      hover:bg-[#F97316]/10 hover:text-[#F97316]
    ` : `
      bg-transparent border border-white/10 text-gray-400
      hover:bg-white/5 hover:text-white hover:border-white/20
    `,
    danger: isClient ? `
      bg-red-50/50 backdrop-blur-sm text-red-600 border border-red-100
      hover:bg-red-100 hover:text-red-700
    ` : `
      bg-red-500/10 border border-red-500/20 text-red-400
      hover:bg-red-500/20 hover:text-red-300
    `
  }

  const sizes = {
    sm:  'text-xs px-4 py-2',
    md:  'text-sm px-6 py-3',
    lg:  'text-sm px-8 py-4',
    xl:  'text-base px-10 py-5'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
