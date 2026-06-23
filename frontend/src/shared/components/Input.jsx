export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  icon: Icon,
  suffix,
  name,
  id,
  required = false,
  className = ''
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-[0.65rem] font-[800] text-gray-400 uppercase tracking-[0.2em] mb-2 font-['Syne']"
        >
          {label}{required && <span className="text-[#2563EB] ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-500" />
          </div>
        )}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`
            w-full bg-white/5 border rounded-xl px-4 py-3
            text-sm text-white placeholder-gray-600
            font-['Inter'] transition-all duration-200
            focus:outline-none focus:border-[#2563EB] focus:bg-white/8
            focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]
            disabled:opacity-40
            ${Icon ? 'pl-10' : ''}
            ${suffix ? 'pr-12' : ''}
            ${error
              ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
              : 'border-white/10 hover:border-white/20'
            }
          `}
        />
        {suffix && (
          <div className="absolute right-4 flex items-center pointer-events-none text-gray-500 text-xs font-semibold">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-['Inter']">{error}</p>
      )}
    </div>
  )
}
