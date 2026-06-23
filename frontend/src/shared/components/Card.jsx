export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false
}) {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={`
      bg-white border border-gray-200 rounded-xl
      ${paddings[padding]}
      ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}
