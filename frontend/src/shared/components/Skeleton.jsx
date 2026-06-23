export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`
        bg-white/5 border border-white/5 animate-pulse
        ${rounded} ${className}
      `}
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}
