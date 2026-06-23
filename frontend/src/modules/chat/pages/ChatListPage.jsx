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
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      
      {/* Left Panel */}
      <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-black text-black mb-4">Messages</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-gray-50" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map(c => (
            <button 
              key={c.id} 
              onClick={() => setActiveChat(c.id)}
              className={`w-full text-left p-4 flex gap-4 transition-colors border-b border-gray-50 last:border-0 ${activeChat === c.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg ${activeChat === c.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold truncate ${activeChat === c.id ? 'text-white' : 'text-black'}`}>{c.name}</h3>
                  <span className={`text-xs ${activeChat === c.id ? 'text-gray-400' : 'text-gray-400'}`}>{c.time}</span>
                </div>
                <p className={`text-sm truncate ${activeChat === c.id ? 'text-gray-300' : 'text-gray-500'}`}>{c.msg}</p>
              </div>
              {c.unread > 0 && (
                <div className="shrink-0 flex items-center">
                  <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full ${activeChat === c.id ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    {c.unread}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className={`flex-1 flex flex-col bg-gray-50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-4 text-gray-300" />
            <p className="font-bold text-black">Select a conversation</p>
            <p className="text-sm">Choose a chat from the list to start messaging.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-sm mb-4">You selected chat #{activeChat}</p>
            {/* The prompt specifically asked for ChatWindowPage.jsx as a separate route file. 
                In a real app this area would either mount <ChatWindowPage /> directly 
                or this file would just redirect to a nested route. */}
            <a href={`/dashboard/chat/${activeChat}`} className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors">
              Open Chat Window
            </a>
          </div>
        )}
      </div>

    </div>  
  )
}
