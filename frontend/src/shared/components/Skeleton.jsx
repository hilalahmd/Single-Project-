export default function Skeleton({ className = '', width, height, rounded = false }) {
  const style = { width, height }
  
  return (
    <div 
      style={style}
      className={`bg-gray-100 animate-pulse ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
    />
  )
}
