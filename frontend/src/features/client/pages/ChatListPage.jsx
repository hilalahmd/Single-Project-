import { useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'

export default function ChatListPage() {
  const [activeChat, setActiveChat] = useState(null)

  const chats = [
    { id: 1, name: 'Arjun Menon', msg: 'Great session today! Remember to stretch.', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Priya Nair', msg: 'Here is your updated diet plan.', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Support Team', msg: 'Your refund has been processed.', time: 'Oct 12', unread: 0 },
  ]

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex border border-[#1E293B] rounded-xl overflow-hidden bg-[#111827] shadow-sm">
      
      {/* Left Panel */}
      <div className={`w-full md:w-1/3 border-r border-[#1E293B] flex flex-col bg-[#0F172A] ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[#1E293B]">
          <h2 className="text-[20px] font-semibold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-3 py-2 border border-[#1E293B] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-[#111827] text-white placeholder-gray-500" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(c => (
            <button 
              key={c.id} 
              onClick={() => setActiveChat(c.id)}
              className={`w-full text-left p-4 flex gap-4 transition-colors border-b border-[#1E293B]/50 last:border-0 ${activeChat === c.id ? 'bg-[#111827] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#111827]'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-[18px] ${activeChat === c.id ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-[#1E293B] text-gray-400'}`}>
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold text-[15px] truncate ${activeChat === c.id ? 'text-white' : 'text-gray-200'}`}>{c.name}</h3>
                  <span className={`text-[12px] ${activeChat === c.id ? 'text-[#2563EB]' : 'text-gray-500'}`}>{c.time}</span>
                </div>
                <p className={`text-[13px] truncate ${activeChat === c.id ? 'text-gray-300' : 'text-gray-500'}`}>{c.msg}</p>
              </div>
              {c.unread > 0 && (
                <div className="shrink-0 flex items-center">
                  <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full ${activeChat === c.id ? 'bg-[#2563EB] text-white' : 'bg-[#2563EB] text-white'}`}>
                    {c.unread}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className={`flex-1 flex flex-col bg-[#111827] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 rounded-full bg-[#0F172A] border border-[#1E293B] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.05)]">
              <MessageCircle size={28} className="text-gray-600" />
            </div>
            <p className="font-semibold text-[18px] text-white mb-2">Select a conversation</p>
            <p className="text-[14px] text-gray-400">Choose a chat from the list to start messaging.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-[14px] mb-6">You selected chat #{activeChat}</p>
            <a href={`/dashboard/chat/${activeChat}`} className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-blue-500 hover:to-blue-400 text-white rounded-lg text-[14px] font-semibold transition-all">
              Open Chat Window
            </a>
          </div>
        )}
      </div>

    </div>  
  )
}
