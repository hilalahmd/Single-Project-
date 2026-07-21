import { useState, useEffect, useRef } from 'react'
import { Bell, Check, CreditCard, Info, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

export default function NotificationDropdown({ theme }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchNotifications()

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/notifications`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setNotifications(data.notifications)
          setUnreadCount(data.unreadCount)
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include'
      })
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Error marking notifications as read:', err)
    }
  }

  const getIcon = (type) => {
    switch(type) {
      case 'payment': return <CreditCard size={18} className="text-green-500" />
      case 'booking': return <Calendar size={18} className="text-blue-500" />
      default: return <Info size={18} className="text-orange-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleOpen}
        className={`relative flex items-center justify-center transition-colors ${theme.btnColor || 'text-gray-400 hover:text-white'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white rounded-full ${theme.bellDot || 'bg-[#F97316]'}`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden origin-top-right transition-all ${
          theme.dropdownBg || 'bg-[#111318] border-[#1E293B]'
        }`}>
          <div className={`p-4 border-b flex justify-between items-center ${theme.dropdownHeaderBorder || 'border-[#1E293B]'}`}>
            <h3 className={`font-bold ${theme.dropdownTitle || 'text-white'}`}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[#F97316] font-medium hover:underline flex items-center gap-1"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 font-medium">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 border-b last:border-0 transition-colors flex gap-3 ${theme.dropdownItemBorder || 'border-[#1E293B] hover:bg-[#0F172A]'} ${!notif.isRead ? (theme.unreadBg || 'bg-[#F97316]/5') : ''}`}
                >
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.iconBg || 'bg-[#1E293B]'}`}>
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${!notif.isRead ? (theme.dropdownTitle || 'text-white') : 'text-gray-300'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 whitespace-pre-line leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
