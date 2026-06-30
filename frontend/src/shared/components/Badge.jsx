export default function Badge({ label, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-white/5 border border-white/10 text-gray-400',
    active:   'bg-[#F97316]/20 border border-[#F97316]/50 text-white',
    success:  'bg-green-500/20 border border-green-500/40 text-green-300',
    warning:  'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300',
    danger:   'bg-red-500/20 border border-red-500/40 text-red-300',
    cyan:     'bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#66f0ff]',
    outline:  'bg-transparent border border-white/20 text-gray-300',
    inactive: 'bg-white/5 border border-white/10 text-gray-500',
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-[0.6rem] font-[800] tracking-[0.15em] uppercase
        font-['Syne']
        ${variants[variant] || variants.default} ${className}
      `}
    >
      {label}
    </span>
  )
}
