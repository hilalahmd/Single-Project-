import { useState } from 'react'
import { Search, MessageCircle, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ChatListPage() {
  const [activeChat, setActiveChat] = useState(null)
  const navigate = useNavigate()

  const chats = [
    { id: 1, name: 'Arjun Menon',   role: 'Personal Trainer',  msg: 'Great session today! Remember to stretch.', time: '10:30 AM', unread: 2, online: true },
    { id: 2, name: 'Priya Nair',    role: 'Wellness Coach',    msg: 'Here is your updated diet plan.',           time: 'Yesterday', unread: 0, online: false },
    { id: 3, name: 'Support Team',  role: 'FitForge Support',  msg: 'Your refund has been processed.',           time: 'Oct 12',    unread: 0, online: true },
  ]

  return (
    <div className="w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)] flex border border-[#1E293B] rounded-2xl overflow-hidden bg-[#111827] shadow-sm">

      {/* ── Left Panel: Chat List ── */}
      <div className={`w-full md:w-[320px] border-r border-[#1E293B] flex flex-col bg-[#0F172A] shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B]">
          <h2 className="text-[20px] font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2.5 border border-[#1E293B] rounded-xl text-[13px] bg-[#111827] text-white placeholder-gray-600 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
            />
          </div>
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto">
          {chats.map(c => {
            const isActive = activeChat === c.id
            return (
              <button
                key={c.id}
                onClick={() => setActiveChat(c.id)}
                className={`w-full text-left p-4 flex gap-3 transition-all border-b border-[#1E293B]/50 last:border-0 ${
                  isActive
                    ? 'bg-[#2563EB]/10 border-l-2 border-l-[#2563EB]'
                    : 'hover:bg-[#1E293B]/50'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[16px] transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]'
                      : 'bg-[#1E293B] text-gray-300 border border-[#1E293B]'
                  }`}>
                    {c.name[0]}
                  </div>
                  {c.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F172A]" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className={`font-bold text-[14px] truncate ${isActive ? 'text-white' : 'text-gray-200'}`}>{c.name}</h3>
                    <span className={`text-[11px] font-medium shrink-0 ml-2 ${isActive ? 'text-[#2563EB]' : 'text-gray-500'}`}>{c.time}</span>
                  </div>
                  <p className={`text-[12px] truncate ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{c.msg}</p>
                </div>

                {/* Unread badge */}
                {c.unread > 0 && (
                  <div className="shrink-0 flex items-center self-center">
                    <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-[#2563EB] text-white shadow-[0_2px_6px_rgba(37,99,235,0.4)]">
                      {c.unread}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className={`flex-1 flex flex-col bg-[#030712] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <MessageCircle size={28} className="text-[#2563EB]" />
            </div>
            <p className="font-bold text-[18px] text-white mb-2">Select a conversation</p>
            <p className="text-[14px] text-gray-400 text-center">Choose a chat from the list to start messaging your coach.</p>
          </div>
        ) : (
          /* Selected — open button */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center font-bold text-[20px] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-4">
              {chats.find(c => c.id === activeChat)?.name[0]}
            </div>
            <p className="text-white font-bold text-[16px] mb-1">{chats.find(c => c.id === activeChat)?.name}</p>
            <p className="text-gray-400 text-[13px] mb-6">{chats.find(c => c.id === activeChat)?.role}</p>
            <button
              onClick={() => navigate(`/dashboard/chat/${activeChat}`)}
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(37,99,235,0.3)] flex items-center gap-2"
            >
              <CheckCheck size={16} /> Open Conversation
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
