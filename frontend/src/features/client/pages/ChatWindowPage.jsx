import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Info, Phone, MessageCircle, Lock, Paperclip, Send, CheckCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'
import { io } from 'socket.io-client'

// Backend-ilekku Socket connect cheyyunnu (Live Connection)
const SOCKET_URL = 'http://localhost:5000'
const socket = io(SOCKET_URL)

export default function ChatWindowPage() {
  const navigate = useNavigate()
  const { id: otherUserId } = useParams() // URL-il ninnum matte aalude ID edukkunnu
  const { user, role, subscriptionTier } = useAuth()
  
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
          // Backend-il ninnu kittunna messages reverse cheyyunnu (pazhayathu aadyam varan)
          setMessages(data.data.reverse())
          setContactInfo(data.contact) // User details set cheyyunnu
        }
      } catch (error) {
        console.error("Failed to load history:", error)
      }
    }
    if (user && !isFree) fetchHistory()
  }, [user, otherUserId, isFree])

  // 2. Socket Room-ilekku join cheyyunnu & Messages receive cheyyunnu
  useEffect(() => {
    if (!roomId) return

    // Aa theerumanicha room-ilekku join cheyyan backend-nodu parayunnu
    socket.emit('join_chat', roomId)

    // Puthiya message varumpol kekkan ulla listener (Like phone ringing)
    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
    }

    socket.on('receive_message', handleReceiveMessage)

    // Component unmount aavumpol (Page close cheyyumpol) listener remove cheyyunnu
    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [roomId])

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
          chatId: roomId // Ee room-il ulla aalkku mathram povanaanu ithu
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
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 animate-fade-in">
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
      <div className={`w-full h-full flex flex-col border border-[#1E293B] rounded-2xl overflow-hidden bg-[#111827] shadow-sm ${isFree ? 'blur-sm pointer-events-none select-none' : ''}`}>

      {/* ── Header ── */}
      <div className="px-5 py-3.5 border-b border-[#1E293B] flex justify-between items-center bg-[#0F172A] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-1 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg md:hidden transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-[14px] font-bold text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] uppercase">
              {contactInfo ? contactInfo.name.charAt(0) : 'U'}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-white text-[15px] leading-tight capitalize">
              {contactInfo ? contactInfo.name : 'Loading...'}
            </h2>
            <p className="text-[12px] text-gray-500 font-medium">
              {contactInfo?.role === 'trainer' ? 'Coach' : 'Client'} • Online
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors" title="Call">
            <Phone size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors" title="Video">
            <Video size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors" title="Info">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 bg-[#030712]">
        {messages.length > 0 ? (
          <>
            {/* Date divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1E293B]" />
              <span className="text-[11px] font-bold text-gray-500 bg-[#0F172A] border border-[#1E293B] px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
              <div className="flex-1 h-px bg-[#1E293B]" />
            </div>

            {messages.map((m) => {
              // Nammal ayacha message aano ennu check cheyyunnu
              const isMe = user && m.senderId === user._id
              const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={m._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                    isMe
                      ? 'bg-[#2563EB] text-white rounded-br-sm shadow-[0_2px_8px_rgba(37,99,235,0.25)]'
                      : 'bg-[#111827] border border-[#1E293B] text-gray-200 rounded-bl-sm shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                  {/* Meta */}
                  <div className={`flex items-center gap-1 mt-1 text-[11px] font-medium text-gray-500 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span>{time}</span>
                    {isMe && <CheckCheck size={13} className="text-blue-400" />}
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          /* Empty state — no messages yet */
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-[#2563EB]" />
            </div>
            <p className="font-bold text-[16px] text-white mb-1">No messages yet</p>
            <p className="text-[13px] text-gray-400 text-center">Start the conversation by sending a message below.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="p-4 bg-[#0F172A] border-t border-[#1E293B] shrink-0">
        <div className="flex items-end gap-2">
          <button className="p-2.5 text-gray-500 hover:text-white rounded-xl hover:bg-[#1E293B] transition-colors shrink-0">
            <Paperclip size={19} />
          </button>

          <div className="flex-1 bg-[#111827] border border-[#1E293B] rounded-2xl flex items-end overflow-hidden focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Message..."
              className="w-full bg-transparent text-white px-4 py-3 min-h-[44px] max-h-[120px] resize-none focus:outline-none text-[14px]"
              rows={1}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 bg-[#2563EB] hover:bg-blue-500 disabled:bg-[#1E293B] disabled:text-gray-500 text-white rounded-xl transition-all shadow-[0_4px_12px_rgba(37,99,235,0.3)] disabled:shadow-none shrink-0"
          >
            <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
          </button>
        </div>
      </div>

    </div>
  </div>
  )
}
