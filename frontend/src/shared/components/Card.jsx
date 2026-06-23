export default function Card({
  children,
  className = '',
  padding = 'md'
}) {
  const paddings = {
    none: 'p-0',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-6'
  }

  return (
    <div
      className={`
        bg-[#111827] border border-[#1E293B] rounded-xl shadow-sm
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
