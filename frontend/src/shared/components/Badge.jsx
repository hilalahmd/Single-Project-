export default function Badge({ label, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-white/5 border border-white/10 text-gray-400',
    active:   'bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB]',
    success:  'bg-green-500/10 border border-green-500/20 text-green-400',
    warning:  'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400',
    danger:   'bg-red-500/10 border border-red-500/20 text-red-400',
    cyan:     'bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]',
    outline:  'bg-transparent border border-white/10 text-gray-500',
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
