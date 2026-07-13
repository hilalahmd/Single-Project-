import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

// ── Browser Notification Permission ─────────────────────────────────────────
// One-time request when app loads — browser shows "Allow/Block" popup
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// ── Show Browser Notification ────────────────────────────────────────────────
// Only shows when tab is NOT focused (user on another tab/window)
const showMessageNotification = (senderName, messageText, onClickPath) => {
  if (document.hasFocus()) return                    // User already watching — skip
  if (Notification.permission !== 'granted') return  // No permission — skip

  const notification = new Notification(`💬 ${senderName}`, {
    body: messageText.length > 80
      ? messageText.substring(0, 80) + '...'
      : messageText,
    icon: '/logo.png',
    tag: `chat-${senderName}`,   // Stack per-sender — no spam
    requireInteraction: false,
  })

  notification.onclick = () => {
    window.focus()
    if (onClickPath) window.location.href = onClickPath
    notification.close()
  }

  setTimeout(() => notification.close(), 5000)
}

// ── Show Booking Notification ────────────────────────────────────────────────
const showBookingNotification = (title, body) => {
  if (Notification.permission !== 'granted') return
  const n = new Notification(title, {
    body,
    icon: '/logo.png',
    tag: 'booking-notification',
    requireInteraction: false,
  })
  setTimeout(() => n.close(), 6000)
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user } = useAuth()

  // Request browser notification permission once on mount
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    if (!user) return

    const newSocket = io('http://localhost:5000', {
      withCredentials: true
    })
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Socket connected! Emitting setup_user for', user._id)
      newSocket.emit('setup_user', user._id)
    })

    // ── Chat Message Notification ────────────────────────────────────────────
    // Global listener — works on ANY page, not just ChatWindowPage
    // ChatWindowPage handles its own receive_message to add message to UI.
    // Here we ONLY handle the browser notification part.
    newSocket.on('receive_message', (data) => {
      const senderName = data.senderName || 'New Message'
      const messageText = data.text || 'Sent you a message'

      // Build the correct chat path based on role
      const isTrainer = user.role === 'trainer' || user.role === 'wellness_coach'
      const chatPath = `${isTrainer ? '/trainer/chat' : '/dashboard/chat'}/${data.senderId}`

      showMessageNotification(senderName, messageText, chatPath)
    })

    // ── Booking Rejected Notification ────────────────────────────────────────
    newSocket.on('booking_rejected', (data) => {
      if (!document.hasFocus()) {
        showBookingNotification(
          '❌ Booking Request Rejected',
          data.reason || 'Your booking was rejected. You have one free rebook.'
        )
      }
    })

    // ── Booking Accepted Notification ────────────────────────────────────────
    newSocket.on('booking_accepted', (data) => {
      if (!document.hasFocus()) {
        showBookingNotification(
          '✅ Booking Accepted!',
          data.message || 'Your training session is confirmed!'
        )
      }
    })

    return () => newSocket.disconnect()
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
