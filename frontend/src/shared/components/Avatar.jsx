export default function Avatar({ src, name, size = 'md', onClick, className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  }

  const getInitials = (fullName) => {
    if (!fullName) return '?'
    const parts = fullName.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const baseStyles = `relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden border border-[#E5E4E0] shadow-sm ${sizes[size]} ${className}`
  const interactiveStyles = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''

  if (src) {
    return (
      <img 
        src={src} 
        alt={name} 
        onClick={onClick}
        className={`${baseStyles} object-cover ${interactiveStyles}`}
      />
    )
  }

  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} bg-[#F5F4F0] text-[#1A1A1A] font-bold tracking-tight ${interactiveStyles}`}
    >
      {getInitials(name)}
    </div>
  )
}
