export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizes = {
    xs:  'w-6 h-6 text-[8px]',
    sm:  'w-8 h-8 text-xs',
    md:  'w-10 h-10 text-sm',
    lg:  'w-14 h-14 text-lg',
    xl:  'w-20 h-20 text-2xl'
  }

  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return src ? (
    <img
      src={src}
      alt={name}
      className={`${sizes[size]} rounded-full object-cover border border-white/10 ${className}`}
    />
  ) : (
    <div
      className={`
        ${sizes[size]} rounded-full flex items-center justify-center
        bg-[#2563EB]/20 border border-[#2563EB]/30
        text-[#2563EB] font-[800] font-['Syne']
        shadow-[0_0_15px_rgba(37,99,235,0.2)]
        ${className}
      `}
    >
      {initials || '?'}
    </div>
  )
}
