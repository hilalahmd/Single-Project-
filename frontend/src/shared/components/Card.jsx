import { useAuth } from '../context/AuthContext'

export default function Card({
  children,
  className = '',
  padding = 'md'
}) {
  const { role } = useAuth()
  const isClient = role !== 'trainer' && role !== 'admin'

  const paddings = {
    none: 'p-0',
    sm:   'p-4',
    md:   isClient ? 'p-5' : 'p-6',
    lg:   isClient ? 'p-5' : 'p-6'
  }

  const baseTheme = isClient 
    ? 'bg-white/5 border border-white/10 rounded-[16px] shadow-sm transition-all hover:border-white/20'
    : 'bg-[#111827] border border-[#1E293B] rounded-xl shadow-sm'

  return (
    <div
      className={`
        ${baseTheme}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
