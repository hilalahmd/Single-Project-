import { Loader2 } from 'lucide-react'

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
  const base = `
    inline-flex items-center justify-center font-['Syne'] font-[800]
    uppercase tracking-[0.05em] transition-all duration-300
    focus:outline-none disabled:opacity-40 disabled:pointer-events-none
  `

  const variants = {
    // Blue glow — primary CTA (matches hero "START TRAINING FREE" button)
    primary: `
      bg-[#2563EB] text-white rounded-full
      hover:bg-white hover:text-[#2563EB] hover:scale-105
      shadow-[0_0_30px_rgba(37,99,235,0.4)]
      hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]
    `,
    // Ghost glass — secondary CTA (matches hero "Generate Free Diet Plan" button)
    secondary: `
      bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-full
      hover:bg-white/15 hover:border-white/40 hover:scale-105
      hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
    `,
    // Subtle — tertiary / back buttons
    ghost: `
      bg-transparent border border-white/10 text-gray-400 rounded-full
      hover:bg-white/5 hover:text-white hover:border-white/20
    `,
    // Danger
    danger: `
      bg-red-500/10 border border-red-500/20 text-red-400 rounded-full
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
