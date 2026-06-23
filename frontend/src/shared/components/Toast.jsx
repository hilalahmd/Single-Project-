import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export default function Toast({ message, type = 'info', show, onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // allow fade out animation
      }, duration)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show, duration, onClose])

  if (!show && !isVisible) return null

  const types = {
    success: 'bg-black text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-900 text-white'
  }

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }

  const Icon = icons[type]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px]
          transition-all duration-300 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          ${types[type]}
        `}
      >
        <Icon size={20} className="shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/70 hover:text-white transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
