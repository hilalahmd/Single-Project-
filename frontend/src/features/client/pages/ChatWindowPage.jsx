import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Info, Phone, PhoneOff, PhoneCall, MessageCircle, Lock, Paperclip, Send, CheckCheck, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'
import { useSocket } from '../../../shared/context/SocketContext'





export default function ChatWindowPage() {
  const navigate = useNavigate()
  const { id: otherUserId } = useParams() // URL-il ninnum matte aalude ID edukkunnu
  const { user, role, subscriptionTier } = useAuth()

    const socket = useSocket()
  
  const handleVideoCall = () => {
    if (role === 'trainer' || role === 'wellness_coach') {
      navigate(`/trainer/video/${otherUserId}`)
    } else {
      navigate(`/dashboard/video/${otherUserId}`)
    }
  }

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [contactInfo, setContactInfo] = useState(null)
  const bottomRef = useRef(null)

  const isFree = role === 'user' && subscriptionTier === 'free'

  // Oru unique room ID undakkunnu. Nammude id-yum averude id-yum vechu.
  // Sort cheyyunnathu kondu randu perkum ore Room ID thanne kittum.
  // NOTE: user object uses _id from MongoDB!
  const roomId = user ? [user._id, otherUserId].sort().join('_') : null

  // 1. Pazhaya messages fetch cheyyunnu (Database-il ninnum)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/chat/history/${otherUserId}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          // Backend is already reversing, no need to reverse again!
          setMessages(data.data)
          setContactInfo(data.contact) // User details set cheyyunnu
          
          // Chat open aakumbol 'Read' aakki mattunnu
          await fetch(`${API}/chat/mark-read/${otherUserId}`, { method: 'PUT', credentials: 'include' })
          if (socket) {
            socket.emit('mark_messages_read', { senderId: otherUserId, chatId: roomId })
          }
        }
      } catch (error) {
        console.error("Failed to load history:", error)
      }
    }
    if (user && !isFree) fetchHistory()
  }, [user, otherUserId, isFree, socket, roomId])

  // 2. Socket Room-ilekku join cheyyunnu & Messages receive cheyyunnu
  useEffect(() => {
    if (!roomId || !socket) return

    // Aa theerumanicha room-ilekku join cheyyan backend-nodu parayunnu
    socket.emit('join_chat', roomId)

    // Puthiya message varumpol kekkan ulla listener (Like phone ringing)
    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
      // Live aayi chatil irikkumpol message vannal udane mark as read aakkunnu
      fetch(`${API}/chat/mark-read/${otherUserId}`, { method: 'PUT', credentials: 'include' })
      socket.emit('mark_messages_read', { senderId: otherUserId, chatId: roomId })
    }

    const handleDelivered = ({ messageId }) => {
      setMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, status: 'delivered' } : msg))
    }

    const handleRead = ({ chatId }) => {
      if (chatId === roomId) {
        setMessages(prev => prev.map(msg => msg.senderId === user._id ? { ...msg, status: 'read' } : msg))
      }
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('message_delivered', handleDelivered)
    socket.on('messages_read_by_receiver', handleRead)

    // Component unmount aavumpol (Page close cheyyumpol) listener remove cheyyunnu
    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('message_delivered', handleDelivered)
      socket.off('messages_read_by_receiver', handleRead)
    }
  }, [roomId, socket, otherUserId, user])

  // Scroll to bottom puthiya message varumpol
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 3. Message ayakkumpol nadakkunnathu
  const sendMessage = async () => {
    if (!input.trim() || !user) return

    const tempText = input.trim()
    setInput('') // Input field udane clear cheyyunnu (Fast aayi thonan)

    try {
      // Aadyam Backend DB-ilekku save cheyyan ayakkunnu
      const res = await fetch(`${API}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ receiverId: otherUserId, text: tempText })
      })
      
      const data = await res.json()
      
      if (data.success) {
        const newMessage = data.data

        // Nammude local screen-il appozhe kanikkan state update cheyyunnu
        setMessages((prev) => [...prev, newMessage])

        // PINNE, matte aalkku live aayi kittan Socket vazhi emit cheyyunnu! 🔥
        socket.emit('send_message', {
          ...newMessage,
          chatId: roomId,       // Ee room-il ulla aalkku mathram povanaanu ithu
          senderName: user.name // Browser notification-il sender name kaanikkaan
        })
      }
    } catch (error) {
      console.error("Message send failed:", error)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="relative w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)]">
      {/* Free Tier Lock Overlay */}
      {isFree && (
        <div className="absolute inset-0 z-50 bg-[#07080C]/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4 text-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">Coach Chat Locked</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
            Get 24/7 direct chat messaging with your certified coach. Upgrade to a premium plan to unlock.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#ff8c3a] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Actual Chat Layout */}
      <div className={`w-full h-full flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-[#0B0C10] shadow-[0_8px_30px_rgb(0,0,0,0.4)] ${isFree ? 'blur-sm pointer-events-none select-none' : ''}`}>

      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-[#07080C] shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(role === 'trainer' || role === 'wellness_coach' ? '/trainer/chat' : '/dashboard/chat')}
            className="p-2 -ml-2 flex items-center gap-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            title="Back to Chat List"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar with Pulse */}
          <div className="relative">
            <div className="w-11 h-11 bg-[#F97316]/20 rounded-full flex items-center justify-center text-[15px] font-bold text-[#F97316] border border-[#F97316]/30 shadow-[0_0_15px_rgba(249,115,22,0.15)] uppercase overflow-hidden">
              {contactInfo ? (
                (contactInfo.profilePhoto || contactInfo.profileImage || contactInfo.avatar) ? (
                  <img src={contactInfo.profilePhoto || contactInfo.profileImage || contactInfo.avatar} alt={contactInfo.name} className="w-full h-full object-cover" />
                ) : contactInfo.name.charAt(0)
              ) : 'U'}
            </div>
            {/* Online Pulse Indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#07080C] rounded-full"></span>
          </div>

          <div>
            <h2 className="font-bold text-white text-[16px] leading-tight capitalize tracking-wide">
              {contactInfo ? contactInfo.name : 'Loading...'}
            </h2>
            <p className="text-[12px] text-[#F97316] font-medium tracking-wide">
              {(contactInfo?.role === 'trainer' || contactInfo?.role === 'wellness_coach') ? 'Coach' : 'Client'} • Online
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {role !== 'wellness_coach' && contactInfo?.role !== 'wellness_coach' && (
            <>
              <button className="p-2.5 text-gray-400 hover:text-[#F97316] hover:bg-[#F97316]/10 rounded-full transition-all hover:scale-105" title="Call">
                <Phone size={18} />
              </button>
              <button onClick={handleVideoCall} className="p-2.5 text-gray-400 hover:text-[#F97316] hover:bg-[#F97316]/10 rounded-full transition-all hover:scale-105 cursor-pointer" title="Video">
                <Video size={18} />
              </button>
            </>
          )}
          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-105" title="Info">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 bg-[#07080C]">
        {messages.length > 0 ? (
          <>
            {/* Date divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-bold text-gray-500 bg-[#111318] border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {messages.map((m, index) => {
              // Nammal ayacha message aano ennu check cheyyunnu
              const isMe = user && m.senderId === user._id
              const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              
              const nextMsg = messages[index + 1]
              const isNextSameSender = nextMsg && nextMsg.senderId === m.senderId
              const timeDiff = nextMsg ? new Date(nextMsg.createdAt) - new Date(m.createdAt) : 0
              const isGroupedWithNext = isNextSameSender && timeDiff < 60000 // 1 min

              if (m.type === 'call_declined' || m.type === 'call_missed') {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={m._id} className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="bg-[#111318] border border-red-500/20 rounded-2xl px-4 py-3 shadow-sm max-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                          <PhoneOff size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{m.text}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{time}</p>
                        </div>
                      </div>
                      {!isMe && role !== 'wellness_coach' && contactInfo?.role !== 'wellness_coach' && (
                        <button 
                          onClick={handleVideoCall}
                          className="mt-3 w-full py-2 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <PhoneCall size={16} />
                          Call back
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  key={m._id} className={`flex flex-col ${isGroupedWithNext ? 'mb-1' : 'mb-5'} ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-end ${isMe ? 'flex-row-reverse' : 'flex-row'} max-w-[85%]`}>
                    {/* Avatar for Received Messages */}
                    {!isMe && (
                      <div className="flex-shrink-0 w-8 mr-2 flex justify-center">
                        {!isGroupedWithNext ? (
                          (contactInfo?.profilePhoto || contactInfo?.profileImage || contactInfo?.avatar) ? (
                            <img src={contactInfo.profilePhoto || contactInfo.profileImage || contactInfo.avatar} alt={contactInfo.name} className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(249,115,22,0.1)]" />
                          ) : (
                            <div className="w-8 h-8 bg-[#F97316]/20 border border-[#F97316]/30 rounded-full flex items-center justify-center text-[12px] font-bold text-[#F97316] uppercase shadow-[0_0_10px_rgba(249,115,22,0.1)] overflow-hidden" aria-label={contactInfo?.name}>
                              {contactInfo ? contactInfo.name.charAt(0) : 'U'}
                            </div>
                          )
                        ) : (
                          <div className="w-8"></div>
                        )}
                      </div>
                    )}

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Bubble */}
                      <div className={`px-4 py-2.5 text-[14.5px] leading-relaxed shadow-sm ${
                        isMe
                          ? `bg-gradient-to-br from-[#F97316] to-[#E35D08] text-white ${isGroupedWithNext ? 'rounded-2xl rounded-tr-sm rounded-br-sm' : 'rounded-2xl rounded-br-sm'}`
                          : `bg-[#111318] border border-white/5 text-gray-200 ${isGroupedWithNext ? 'rounded-2xl rounded-tl-sm rounded-bl-sm' : 'rounded-2xl rounded-bl-sm'}`
                      }`}>
                        {m.text}
                      </div>
                      
                      {/* Meta */}
                      {!isGroupedWithNext && (
                        <div className={`flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-gray-500 ${isMe ? 'flex-row-reverse' : 'ml-1'}`}>
                          <span>{time}</span>
                          {isMe && (
                            <>
                              {m.status === 'read' ? (
                                <CheckCheck size={14} className="text-[#3b82f6]" /> // Double Blue Tick
                              ) : m.status === 'delivered' ? (
                                <CheckCheck size={14} className="text-gray-400" /> // Double Gray Tick
                              ) : (
                                <Check size={14} className="text-gray-400" /> // Single Gray Tick
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </>
        ) : (
          /* Empty state — no messages yet */
          <div className="flex-1 h-full flex flex-col items-center justify-center py-16 opacity-70">
            <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-[#F97316]" />
            </div>
            <p className="font-bold text-[16px] text-white mb-1 tracking-wide">No messages yet</p>
            <p className="text-[13px] text-gray-500 text-center">Start the conversation by sending a message below.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="p-4 bg-[#07080C] border-t border-white/10 shrink-0">
        <div className="flex items-end gap-2">
          <button className="p-2.5 text-gray-400 hover:text-[#F97316] hover:bg-[#F97316]/10 rounded-full transition-all hover:scale-105 shrink-0 cursor-pointer">
            <Paperclip size={19} />
          </button>

          <div className="flex-1 bg-[#111318] border border-white/5 rounded-2xl flex items-end overflow-hidden focus-within:border-[#F97316]/50 focus-within:ring-1 focus-within:ring-[#F97316]/50 transition-all shadow-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message..."
              className="w-full bg-transparent text-white px-4 py-3 min-h-[46px] max-h-[120px] resize-none focus:outline-none text-[14.5px] placeholder-gray-600"
              rows={1}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 bg-gradient-to-r from-[#F97316] to-[#E35D08] hover:from-[#ff8c3a] hover:to-[#F97316] disabled:opacity-50 disabled:from-gray-800 disabled:to-gray-800 text-white rounded-xl transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] disabled:shadow-none shrink-0 cursor-pointer hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
          </button>
        </div>
      </div>

    </div>
  </div>
  )
}
