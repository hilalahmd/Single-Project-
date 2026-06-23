import { useState } from 'react'
import { Sparkles, Send, MessageSquare, Plus } from 'lucide-react'
import Badge from '../../../shared/components/Badge'

export default function AIAssistantPage() {
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)

  const messages = [
    { text: "Create a diet plan for me", isUser: true },
    { text: "I'd be happy to help you create a personalized diet plan! To make it effective, could you tell me a bit more about your goals?\n\n1. What is your primary goal? (Weight loss, muscle gain, maintenance)\n2. Do you have any dietary restrictions? (Vegetarian, vegan, gluten-free, etc.)\n3. How many calories do you currently consume, or would you like me to calculate that for you based on your body metrics?", isUser: false }
  ]

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      
      {/* Left Panel - History */}
      <div className="w-1/3 border-r border-gray-100 hidden md:flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-100 bg-white">
          <button onClick={() => setStarted(false)} className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-all text-black">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 px-2">Recent Chats</p>
          {['Diet Questions', 'Workout Help', 'Nutrition FAQ', 'Injury Recovery', 'Supplements Guide'].map((t, i) => (
            <button key={i} className="w-full text-left p-3 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-black rounded-lg transition-colors flex items-center gap-3">
              <MessageSquare size={16} className="text-gray-400" /> <span className="truncate">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-black flex items-center gap-2">FitForge AI <Badge label="Powered by Gemini 2.0" variant="outline" className="text-[10px] py-0 border-gray-300" /></h2>
              <p className="text-xs text-gray-500">Your intelligent fitness companion</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col relative bg-white">
          {!started ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
                <Sparkles size={32} className="text-black" />
              </div>
              <h3 className="text-2xl font-black text-black mb-2">How can I help you today?</h3>
              <p className="text-gray-500 text-center mb-8 text-sm">Ask me anything about fitness, nutrition, or wellness.</p>
              
              <div className="grid sm:grid-cols-2 gap-3 w-full">
                {["Create a diet plan for me", "How many calories in puttu?", "Best exercises for weight loss", "Explain progressive overload"].map((chip, i) => (
                  <button 
                    key={i}
                    onClick={() => setStarted(true)}
                    className="p-4 text-sm font-medium text-left border border-gray-200 rounded-xl hover:border-black hover:shadow-sm transition-all text-gray-700 bg-white"
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
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`px-5 py-3.5 text-sm leading-relaxed ${m.isUser ? 'bg-black text-white rounded-2xl rounded-tr-sm' : 'bg-gray-50 border border-gray-200 text-black rounded-2xl rounded-tl-sm'}`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end">
              <textarea 
                rows="1" 
                placeholder="Ask FitForge AI..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow resize-none max-h-32"
              />
              <button onClick={() => setStarted(true)} className="absolute right-2 bottom-2 p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"><Send size={18}/></button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">3/3 AI diet plans used this month. <a href="#" className="text-black underline ml-1">Upgrade for unlimited.</a></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
