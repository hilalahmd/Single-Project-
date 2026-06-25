import { useState } from 'react'
import { ArrowLeft, Video, Info, Smile, Paperclip, Send, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ChatWindowPage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')

  const messages = [
    { id: 1, text: "Hey Hilal! How are you feeling after yesterday's leg day?", sender: 'trainer', time: '10:00 AM' },
    { id: 2, text: "A bit sore to be honest, especially the quads.", sender: 'client', time: '10:05 AM' },
    { id: 3, text: "That's completely normal. Make sure you're getting enough protein today and maybe do some light stretching.", sender: 'trainer', time: '10:06 AM' },
    { id: 4, text: "Will do. Should I still do the cardio session today?", sender: 'client', time: '10:10 AM' },
    { id: 5, text: "Yes, but keep it low intensity. A 20-minute walk will actually help with the soreness by promoting blood flow.", sender: 'trainer', time: '10:12 AM' },
    { id: 6, text: "Got it. Also, I logged my breakfast. Could you check if the macros look okay?", sender: 'client', time: '10:15 AM' },
    { id: 7, text: "Just checked. The oats and eggs are perfect. You hit the 35g protein target.", sender: 'trainer', time: '10:20 AM' },
    { id: 8, text: "Awesome. I'll stick to the plan for lunch.", sender: 'client', time: '10:22 AM' },
    { id: 9, text: "Great. Let's touch base during our live session tomorrow at 6 PM.", sender: 'trainer', time: '10:25 AM' },
    { id: 10, text: "See you then!", sender: 'client', time: '10:30 AM' },
  ]

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col border border-[#1E293B] rounded-xl overflow-hidden bg-[#111827] shadow-sm">
      
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B] flex justify-between items-center bg-[#0F172A]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg md:hidden"><ArrowLeft size={20}/></button>
          <div className="relative">
            <div className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center text-[14px] font-bold text-gray-300 border border-[#1E293B]">AM</div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#0F172A]"></div>
          </div>
          <div>
            <h2 className="font-semibold text-white text-[16px] leading-tight">Arjun Menon</h2>
            <p className="text-[12px] text-[#22C55E]">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors"><Video size={20}/></button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors"><Info size={20}/></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#030712]">
        <div className="text-center">
          <span className="text-[10px] font-bold text-gray-500 bg-[#0F172A] border border-[#1E293B] px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
        </div>

        {messages.map((m, i) => {
          const isMe = m.sender === 'client'
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-[14px] ${isMe ? 'bg-[#2563EB] text-white rounded-br-sm' : 'bg-[#111827] border border-[#1E293B] text-gray-200 rounded-bl-sm shadow-sm'}`}>
                <p className="leading-relaxed">{m.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 font-medium">
                {m.time}
                {isMe && <CheckCheck size={12} className="text-[#2563EB]" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#0F172A] border-t border-[#1E293B]">
        <div className="flex items-end gap-3">
          <button className="p-2.5 text-gray-400 hover:text-white rounded-full transition-colors shrink-0"><Paperclip size={20}/></button>
          <div className="flex-1 bg-[#111827] border border-[#1E293B] rounded-2xl flex items-end overflow-hidden focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-shadow">
            <textarea 
              rows="1" 
              placeholder="Type a message..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-transparent border-0 focus:ring-0 resize-none px-4 py-3 text-[14px] text-white placeholder-gray-500 max-h-32 focus:outline-none"
            />
            <button className="p-3 text-gray-400 hover:text-white transition-colors"><Smile size={20}/></button>
          </div>
          <button className="p-3 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white rounded-full hover:to-blue-400 transition-colors shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.3)]"><Send size={18}/></button>
        </div>
      </div>
    </div>
  )
}
