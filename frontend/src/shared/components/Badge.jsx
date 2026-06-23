export default function Badge({ label, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    active: 'bg-black text-white',
    inactive: 'bg-gray-100 text-gray-400',
    outline: 'bg-transparent border border-gray-200 text-gray-500',
    danger: 'bg-red-50 text-red-600 border border-red-100'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${variants[variant]} ${className}`}>
      {label}
    </span>
  )
}
