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
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg md:hidden"><ArrowLeft size={20}/></button>
          <div className="relative">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">AM</div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-black rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="font-bold text-black leading-tight">Arjun Menon</h2>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"><Video size={20}/></button>
          <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"><Info size={20}/></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50">
        <div className="text-center">
          <span className="text-xs font-bold text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
        </div>

        {messages.map((m, i) => {
          const isMe = m.sender === 'client'
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isMe ? 'bg-black text-white rounded-br-sm' : 'bg-white border border-gray-200 text-black rounded-bl-sm shadow-sm'}`}>
                <p className="leading-relaxed">{m.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-medium">
                {m.time}
                {isMe && <CheckCheck size={12} className="text-black" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2">
          <button className="p-2.5 text-gray-400 hover:text-black rounded-full transition-colors shrink-0"><Paperclip size={20}/></button>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-end overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-shadow">
            <textarea 
              rows="1" 
              placeholder="Type a message..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-transparent border-0 focus:ring-0 resize-none px-4 py-3 text-sm max-h-32 focus:outline-none"
            />
            <button className="p-3 text-gray-400 hover:text-black transition-colors"><Smile size={20}/></button>
          </div>
          <button className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shrink-0 shadow-sm"><Send size={18}/></button>
        </div>
      </div>
    </div>
  )
}
