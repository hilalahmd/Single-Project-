import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel — CinematicHero glass style */}
      <div className={`relative w-full ${sizes[size]} bg-[#0D0E14]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden`}>
        {/* Top gloss */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <h3 className="text-lg font-[800] text-white font-['Syne'] tracking-[-0.01em]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
