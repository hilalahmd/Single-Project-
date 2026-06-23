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
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-1'
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:text-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-200 disabled:text-red-400'
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
