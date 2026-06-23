import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={`
        relative w-full bg-white border border-[#E5E4E0] rounded-xl shadow-2xl
        animate-in fade-in zoom-in-95 duration-200
        ${sizes[size]}
      `}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E4E0]">
            <h2 className="text-lg font-bold text-[#1A1A1A]">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-[#1A1A1A] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
