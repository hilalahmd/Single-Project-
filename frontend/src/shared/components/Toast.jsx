import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onClose?.() }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  if (!visible) return null

  const types = {
    success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    error:   { icon: XCircle,     color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20' },
    warning: { icon: AlertCircle, color: 'text-yellow-400',bg: 'bg-yellow-500/10 border-yellow-500/20' },
  }

  const { icon: Icon, color, bg } = types[type] || types.success

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${bg}`}>
      <Icon size={18} className={color} />
      <span className="text-sm font-[600] text-white font-['Inter']">{message}</span>
      <button
        onClick={() => { setVisible(false); onClose?.() }}
        className="ml-2 text-gray-500 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
