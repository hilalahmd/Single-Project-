import { useState, useEffect } from 'react'
import { Search, MessageCircle, Lock } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api' // API import cheythu

export default function ChatListPage() {
  const [activeChat, setActiveChat] = useState(null)
  const [chats, setChats] = useState([]) // Puthiya state
  const navigate = useNavigate()
  const location = useLocation()
  
  // user data koodi edukkunnu (namukku own id ariyanam)
  const { user, role, subscriptionTier } = useAuth() 

  const basePath = location.pathname.startsWith('/trainer') ? '/trainer' : '/dashboard'
  const isFreeClient = role === 'user' && subscriptionTier === 'free'

  // Backend-il ninnum conversations fetch cheyyunnu
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API}/chat/conversations`, {
          credentials: 'include'
        })
        const data = await res.json()
        
        if (data.success) {
          // Backend tharunna data format cheyyunnu
          const formattedChats = data.data.map(conv => {
            // Nammal allatha matte aale kandupidikkanam (Chat listil avarude peru kanikkan)
            const otherPerson = conv.participants.find(p => p._id !== user.id)
            
            return {
              id: otherPerson?._id,
              name: otherPerson?.name || 'Unknown User',
              role: otherPerson?.role || 'user',
              msg: conv.lastMessage ? conv.lastMessage.text : 'No messages yet',
              time: conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
              unread: 0,
              online: false
            }
          })
          setChats(formattedChats)
        }
      } catch (error) {
        console.error("Failed to load chats:", error)
      }
    }

    if (user && !isFreeClient) {
      fetchConversations()
    }
  }, [user, isFreeClient])

  return (
    <div className="relative w-full h-[calc(100vh-10rem)] md:h-[calc(100vh-8.5rem)]">
      {/* Free Tier Lock Overlay */}
      {isFreeClient && (
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
      <div className={`w-full h-full flex border border-white/[0.10] border-t-white/[0.15] rounded-[24px] overflow-hidden bg-white/[0.05] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${isFreeClient ? 'blur-sm pointer-events-none select-none' : ''}`}>

      {/* ── Left Panel: Chat List ── */}
      <div className={`w-full md:w-[320px] border-r border-white/[0.10] flex flex-col bg-black/20 shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-white/[0.10]">
          <h2 className="text-[20px] font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2.5 border border-white/[0.10] rounded-xl text-[13px] bg-white/[0.03] text-white placeholder-gray-400 focus:outline-none focus:border-[#2563EB]/50 focus:ring-1 focus:ring-[#2563EB]/50 transition-all hover:bg-white/[0.05]"
            />
          </div>
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            chats.map(c => {
              const isActive = activeChat === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c.id)}
                  className={`w-full text-left p-4 flex gap-3 transition-all border-b border-white/[0.05] last:border-0 cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.08] border-l-2 border-l-[#2563EB]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[16px] transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]'
                        : 'bg-white/[0.05] border border-white/[0.10] text-gray-300'
                    }`}>
                      {c.name ? c.name[0] : 'U'}
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
            })
          ) : (
            /* Empty state — no conversations */
            <div className="flex flex-col items-center justify-center text-center px-6 py-16">
              <div className="w-14 h-14 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-[#2563EB]" />
              </div>
              <p className="font-bold text-[16px] text-white mb-1">No conversations yet</p>
              <p className="text-[13px] text-gray-400 mb-6">
                Your conversations with coaches will appear here.
              </p>
              
              {/* Navigate to coach page to start chatting */}
              <button 
                onClick={() => navigate(basePath === '/trainer' ? '/trainer/clients' : '/dashboard/coach')}
                className="px-6 py-3 bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
              >
                {basePath === '/trainer' ? 'View My Clients' : 'Go to My Coach'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className={`flex-1 flex flex-col bg-transparent relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
            <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <MessageCircle size={28} className="text-[#2563EB]" />
            </div>
            <p className="font-bold text-[18px] text-white mb-2">
              {chats.length > 0 ? 'Select a conversation' : 'No messages'}
            </p>
            <p className="text-[14px] text-gray-400 text-center">
              {chats.length > 0
                ? 'Choose a chat from the list to start messaging your coach.'
                : 'When you start chatting with a coach, your conversations will show up here.'}
            </p>
          </div>
        ) : (
          /* Selected — open button */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] flex items-center justify-center font-bold text-[20px] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-4">
              {chats.find(c => c.id === activeChat)?.name[0]}
            </div>
            <p className="text-white font-bold text-[16px] mb-1">{chats.find(c => c.id === activeChat)?.name}</p>
            <p className="text-gray-400 text-[13px] mb-6 capitalize">{chats.find(c => c.id === activeChat)?.role}</p>
            <button
              onClick={() => navigate(`${basePath}/chat/${activeChat}`)}
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-500 text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_12px_rgba(37,99,235,0.3)] flex items-center gap-2"
            >
              <MessageCircle size={16} /> Open Conversation
            </button>
          </div>
        )}
      </div>

    </div>
  </div>
  )
}
