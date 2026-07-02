import { useState } from 'react'
import { Sparkles, Send, MessageSquare, Plus, Lock } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AIAssistantPage() {
  const navigate = useNavigate()
  const { subscriptionTier } = useAuth()
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)

  const messages = [
    { text: "Create a diet plan for me", isUser: true },
    { text: "I'd be happy to help you create a personalized diet plan! To make it effective, could you tell me a bit more about your goals?\n\n1. What is your primary goal? (Weight loss, muscle gain, maintenance)\n2. Do you have any dietary restrictions? (Vegetarian, vegan, gluten-free, etc.)\n3. How many calories do you currently consume, or would you like me to calculate that for you based on your body metrics?", isUser: false }
  ]

  const isFree = subscriptionTier === 'free'

  return (
    <div className="relative max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      {/* Free Tier Lock Overlay */}
      {isFree && (
        <div className="absolute inset-0 z-45 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-4 text-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
            <Lock size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">AI Assistant Locked</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
            Unlock our premium AI fitness companion to ask unlimited questions, design custom meals, track recipes, and get instant answers.
          </p>
          <button
            onClick={() => navigate('/plans')}
            className="px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#ff8c3a] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Actual AI Assistant Layout */}
      <div className={`w-full h-full flex border border-white/10 rounded-2xl overflow-hidden bg-white/5 shadow-sm backdrop-blur-sm ${isFree ? 'blur-sm pointer-events-none select-none' : ''}`}>
      
      {/* Left Panel - History */}
      <div className="w-1/3 border-r border-white/10 hidden md:flex flex-col bg-black/20">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <button onClick={() => setStarted(false)} className="w-full py-2.5 border border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/10 transition-all text-gray-300">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase mb-3 px-2 tracking-wider">Recent Chats</p>
          {['Diet Questions', 'Workout Help', 'Nutrition FAQ', 'Injury Recovery', 'Supplements Guide'].map((t, i) => (
            <button key={i} className="w-full text-left p-3 text-sm font-medium text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-3">
              <MessageSquare size={16} className="text-gray-500" /> <span className="truncate">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white flex items-center gap-2">
                FitForge AI
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-widest uppercase bg-white/10 text-gray-400 border border-white/10">
                  Powered by Gemini 2.0
                </span>
              </h2>
              <p className="text-xs text-gray-400">Your intelligent fitness companion</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col relative bg-black/10">
          {!started ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
              <div className="w-16 h-16 bg-[#F97316]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#F97316]/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                <Sparkles size={32} className="text-[#F97316]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">How can I help you today?</h3>
              <p className="text-gray-400 text-center mb-8 text-sm">Ask me anything about fitness, nutrition, or wellness.</p>
              
              <div className="grid sm:grid-cols-2 gap-3 w-full">
                {["Create a diet plan for me", "How many calories in puttu?", "Best exercises for weight loss", "Explain progressive overload"].map((chip, i) => (
                  <button 
                    key={i}
                    onClick={() => setStarted(true)}
                    className="p-4 text-sm font-medium text-left border border-white/10 rounded-xl hover:border-[#F97316] hover:bg-[#F97316]/10 hover:text-[#F97316] transition-all text-gray-300 bg-white/5"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 max-w-[85%] ${m.isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                  {!m.isUser && (
                    <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-[0_4px_8px_rgba(249,115,22,0.3)]">
                      <Sparkles size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`px-5 py-3.5 text-sm leading-relaxed ${m.isUser ? 'bg-[#F97316] text-white rounded-2xl rounded-tr-sm shadow-[0_4px_12px_rgba(249,115,22,0.3)]' : 'bg-white/5 border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm'}`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end">
              <textarea 
                rows="1" 
                placeholder="Ask FitForge AI..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all resize-none max-h-32"
              />
              <button onClick={() => setStarted(true)} className="absolute right-2 bottom-2 p-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.3)]"><Send size={18}/></button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">3/3 AI diet plans used this month. <a href="#" className="text-[#F97316] hover:text-orange-300 ml-1 underline">Upgrade for unlimited.</a></span>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  )
}
