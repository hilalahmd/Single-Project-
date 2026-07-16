import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Plus, Lock, Loader2, MessageSquare, Menu, Bot, Trash2 } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../../../shared/utils/api'

export default function AIAssistantPage() {
  const navigate = useNavigate()
  const { subscriptionTier } = useAuth()
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Fetch chat history list
  const fetchHistoryList = async () => {
    try {
      const res = await fetch(`${API}/ai/chat/history`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setHistory(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch chat history list", error)
    }
  }

  useEffect(() => {
    fetchHistoryList()
  }, [])

  // Load a specific chat
  const loadChat = async (chatId) => {
    setIsLoading(true)
    setStarted(true)
    setCurrentChatId(chatId)
    try {
      const res = await fetch(`${API}/ai/chat/history/${chatId}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.data) {
        // Map db format to ui format
        const formattedMessages = data.data.messages.map(m => ({
          text: m.text,
          isUser: m.role === 'user'
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error("Failed to load chat", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteChat = async (chatId, e) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this chat?")) return
    
    try {
      const res = await fetch(`${API}/ai/chat/history/${chatId}`, { 
        method: 'DELETE',
        credentials: 'include' 
      })
      const data = await res.json()
      if (data.success) {
        setHistory(prev => prev.filter(c => c._id !== chatId))
        if (currentChatId === chatId) {
          setStarted(false)
          setMessages([])
          setCurrentChatId(null)
        }
      }
    } catch (error) {
      console.error("Failed to delete chat", error)
    }
  }

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return
    
    setStarted(true)
    const userMessage = text
    setInput('')
    
    setMessages(prev => [...prev, { text: userMessage, isUser: true }])
    setIsLoading(true)

    try {
      const res = await fetch(`${API}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage, chatId: currentChatId })
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message || 'Failed to get answer')
      
      setMessages(prev => [...prev, { text: data.answer, isUser: false }])
      
      // If it's a new chat, update ID and refresh history list
      if (!currentChatId && data.chatId) {
        setCurrentChatId(data.chatId)
        fetchHistoryList()
      }
    } catch (error) {
      console.error("AI Assistant Error:", error)
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", isUser: false }])
    } finally {
      setIsLoading(false)
    }
  }

  const isFree = subscriptionTier === 'free'
  const recentChats = ['Diet Questions', 'Workout Help', 'Nutrition FAQ', 'Injury Recovery', 'Supplements Guide']

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-full h-[calc(100vh-8rem)] bg-[#0B0B0F] rounded-2xl overflow-hidden shadow-2xl flex border border-white/5"
    >
      {/* Free Tier Lock Overlay */}
      {isFree && (
        <div className="absolute inset-0 z-50 bg-[#0B0B0F]/60 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-[#141419] border border-white/5 flex items-center justify-center mb-6 text-[#FF7A1A] shadow-[0_0_40px_rgba(255,122,26,0.15)]"
          >
            <Lock size={32} />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight font-['Syne']">AI Assistant Locked</h3>
          <p className="text-[#9CA3AF] max-w-md mb-8 leading-relaxed">
            Unlock our premium AI fitness companion to ask unlimited questions, design custom meals, track recipes, and get instant answers.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/plans')}
            className="px-8 py-4 bg-gradient-to-r from-[#FF7A1A] to-[#EA580C] text-white rounded-full text-sm font-bold shadow-[0_8px_24px_rgba(255,122,26,0.25)] transition-shadow hover:shadow-[0_12px_32px_rgba(255,122,26,0.4)]"
          >
            Upgrade to Premium
          </motion.button>
        </div>
      )}

      {/* Main Container - blur if locked */}
      <div className={`w-full h-full flex ${isFree ? 'blur-md pointer-events-none select-none' : ''}`}>
        
        {/* Sidebar */}
        <div className="w-[260px] shrink-0 border-r border-white/5 hidden md:flex flex-col bg-[#0B0B0F]/50">
          <div className="p-5">
            <button 
              onClick={() => { setStarted(false); setMessages([]); setCurrentChatId(null) }} 
              className="w-full py-3 px-4 border border-white/10 rounded-[14px] text-sm font-medium flex items-center gap-3 text-white hover:bg-white/5 transition-colors group"
            >
              <div className="w-6 h-6 rounded-md bg-[#141419] flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                <Plus size={14} className="text-white" />
              </div>
              New Chat
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2 scrollbar-hide">
            {history.length > 0 ? (
              history.map((chat) => (
                <button 
                  key={chat._id}
                  onClick={() => loadChat(chat._id)}
                  className={`w-full text-left p-3 rounded-[12px] transition-colors border group relative ${currentChatId === chat._id ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-[#9CA3AF] hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-3 pr-6">
                    <MessageSquare size={16} className={currentChatId === chat._id ? 'text-[#FF7A1A]' : 'text-[#9CA3AF]'} />
                    <span className="text-sm font-medium truncate flex-1">{chat.title}</span>
                  </div>
                  <div 
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-[#9CA3AF] hover:text-red-400 transition-all cursor-pointer"
                    title="Delete chat"
                  >
                    <Trash2 size={14} />
                  </div>
                </button>
              ))
            ) : (
              <p className="text-xs text-[#9CA3AF] text-center mt-4">No recent chats</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-[#0B0B0F]">
          {/* Header */}
          <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0B0B0F]/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <Menu className="text-white" size={20} />
              </div>
              <h2 className="font-bold text-lg text-white flex items-center gap-3 font-['Syne']">
                FitForge AI
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-[#9CA3AF] bg-[#141419] border border-white/5">
                  Gemini 2.0
                </span>
              </h2>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col relative scrollbar-hide">
            <AnimatePresence mode="wait">
              {!started ? (
                <motion.div 
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full text-center"
                >
                  <div className="w-20 h-20 bg-[#141419] rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-[0_0_50px_rgba(255,122,26,0.1)] relative">
                    <div className="absolute inset-0 rounded-3xl bg-[#FF7A1A]/10 blur-xl"></div>
                    <Bot size={36} className="text-[#FF7A1A] relative z-10" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight font-['Syne']">How can I help you today?</h3>
                  <p className="text-[#9CA3AF] mb-12 text-[15px]">Ask anything about fitness, nutrition, workouts or wellness.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {[
                      { icon: "🏋️‍♂️", text: "Create a workout" },
                      { icon: "🥗", text: "Build a diet plan" },
                      { icon: "🔥", text: "Calories in puttu" },
                      { icon: "💪", text: "Progressive overload" }
                    ].map((chip, i) => (
                      <motion.button 
                        key={i}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(chip.text)}
                        className="p-5 flex flex-col items-start gap-3 bg-[#141419] border border-white/5 rounded-2xl hover:border-[#FF7A1A]/30 transition-all group shadow-sm hover:shadow-[0_8px_24px_rgba(255,122,26,0.08)]"
                      >
                        <span className="text-xl">{chip.icon}</span>
                        <span className="text-sm font-medium text-white group-hover:text-[#FF7A1A] transition-colors">{chip.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6 pb-20 max-w-3xl mx-auto w-full">
                  {messages.map((m, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key={i} 
                      className={`flex gap-4 w-full ${m.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!m.isUser && (
                        <div className="w-8 h-8 bg-[#141419] border border-white/5 rounded-[10px] flex items-center justify-center shrink-0 mt-1">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      <div className={`px-5 py-4 text-[15px] leading-[1.6] ${
                        m.isUser 
                          ? 'bg-gradient-to-br from-[#FF7A1A] to-[#EA580C] text-white rounded-3xl rounded-tr-sm max-w-[70%] break-words' 
                          : 'bg-[#141419] border border-white/5 text-gray-200 rounded-3xl rounded-tl-sm w-full break-words'
                      }`}>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 w-full justify-start"
                    >
                      <div className="w-8 h-8 bg-[#141419] border border-white/5 rounded-[10px] flex items-center justify-center shrink-0 mt-1">
                        <Loader2 size={14} className="text-[#FF7A1A] animate-spin" />
                      </div>
                      <div className="px-5 py-5 bg-[#141419] border border-white/5 rounded-3xl rounded-tl-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-[#0B0B0F] to-transparent absolute bottom-0 left-0 right-0">
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7A1A]/0 via-[#FF7A1A]/10 to-[#FF7A1A]/0 rounded-[9999px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-[#141419] border border-white/10 rounded-[9999px] pr-2 focus-within:border-[#FF7A1A]/50 focus-within:bg-[#1A1A22] transition-colors shadow-lg">
                <input 
                  type="text"
                  placeholder="Message FitForge AI..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                  className="w-full bg-transparent pl-6 py-4 text-[15px] text-white placeholder-[#9CA3AF] focus:outline-none"
                />
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendMessage(input)} 
                  disabled={isLoading || !input.trim()} 
                  className="p-3 bg-[#FF7A1A] text-white rounded-full transition-colors hover:bg-[#EA580C] disabled:opacity-30 disabled:bg-white/10 disabled:text-gray-400 shrink-0 shadow-[0_2px_10px_rgba(255,122,26,0.3)] disabled:shadow-none"
                >
                  <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
                </motion.button>
              </div>
              <div className="text-center mt-3">
                <span className="text-[10px] font-medium text-[#9CA3AF]">
                  FitForge AI can make mistakes. Verify important information.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
