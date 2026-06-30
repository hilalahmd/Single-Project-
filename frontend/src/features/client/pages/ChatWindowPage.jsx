import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Video, Info, Smile, Paperclip, Send, CheckCheck, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const INITIAL_MESSAGES = [
  { id: 1, text: "Hey Hilal! How are you feeling after yesterday's leg day?",                                            sender: 'trainer', time: '10:00 AM' },
  { id: 2, text: "A bit sore to be honest, especially the quads.",                                                      sender: 'client',  time: '10:05 AM' },
  { id: 3, text: "That's completely normal. Make sure you're getting enough protein today and do some light stretching.", sender: 'trainer', time: '10:06 AM' },
  { id: 4, text: "Will do. Should I still do the cardio session today?",                                                 sender: 'client',  time: '10:10 AM' },
  { id: 5, text: "Yes, but keep it low intensity. A 20-minute walk will actually help with the soreness.",               sender: 'trainer', time: '10:12 AM' },
  { id: 6, text: "Got it. Also, I logged my breakfast. Could you check if the macros look okay?",                        sender: 'client',  time: '10:15 AM' },
  { id: 7, text: "Just checked. The oats and eggs are perfect. You hit the 35g protein target. 💪",                      sender: 'trainer', time: '10:20 AM' },
  { id: 8, text: "Awesome. I'll stick to the plan for lunch.",                                                           sender: 'client',  time: '10:22 AM' },
  { id: 9, text: "Great. Let's touch base during our live session tomorrow at 6 PM.",                                    sender: 'trainer', time: '10:25 AM' },
  { id: 10, text: "See you then! 🙌",                                                                                    sender: 'client',  time: '10:30 AM' },
]

export default function ChatWindowPage() {
  const navigate = useNavigate()
  const [input, setInput]       = useState('')
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: input.trim(), sender: 'client', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ])
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)] flex flex-col border border-[#1E293B] rounded-2xl overflow-hidden bg-[#111827] shadow-sm">

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
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-[14px] font-bold text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]">
              AM
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F172A]" />
          </div>

          <div>
            <h2 className="font-bold text-white text-[15px] leading-tight">Arjun Menon</h2>
            <p className="text-[12px] text-green-400 font-medium">Online · Personal Trainer</p>
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
        {/* Date divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1E293B]" />
          <span className="text-[11px] font-bold text-gray-500 bg-[#0F172A] border border-[#1E293B] px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
          <div className="flex-1 h-px bg-[#1E293B]" />
        </div>

        {messages.map((m) => {
          const isMe = m.sender === 'client'
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
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
                <span>{m.time}</span>
                {isMe && <CheckCheck size={13} className="text-blue-400" />}
              </div>
            </div>
          )
        })}
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
              rows={1}
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="w-full bg-transparent border-0 focus:ring-0 resize-none px-4 py-3 text-[14px] text-white placeholder-gray-600 max-h-32 focus:outline-none leading-relaxed"
            />
            <button className="p-3 text-gray-500 hover:text-white transition-colors shrink-0">
              <Smile size={19} />
            </button>
          </div>

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 bg-[#2563EB] hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shrink-0 transition-all shadow-[0_0_12px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  )
}
