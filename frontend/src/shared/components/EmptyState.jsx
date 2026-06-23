export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
          <Icon size={28} className="text-[#2563EB]" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-[800] text-white font-['Syne'] tracking-[-0.01em] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 font-['Inter'] max-w-xs mb-6">
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}
