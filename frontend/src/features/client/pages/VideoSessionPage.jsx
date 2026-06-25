import { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquare, ChevronRight, User } from 'lucide-react'
import Badge from '../../../shared/components/Badge'

export default function VideoSessionPage() {
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] flex font-sans overflow-hidden">
      
      {/* Main Video Area */}
      <div className={`flex-1 relative flex flex-col p-4 transition-all duration-300 ${chatOpen ? 'pr-96' : ''}`}>
        
        {/* Header Overlay */}
        <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-[#111827]/80 backdrop-blur-md px-6 py-3 rounded-xl border border-[#1E293B] shadow-lg pointer-events-auto">
            <h1 className="text-white font-bold text-[18px] leading-tight">Session with Arjun Menon</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[#EF4444] font-mono text-[14px] font-bold animate-pulse">00:24:31</span>
              <span className="w-1.5 h-1.5 bg-[#1E293B] rounded-full"></span>
              <Badge label="Personal Training" className="text-[10px] text-gray-300 bg-[#0F172A] border-[#1E293B]" />
            </div>
          </div>
        </div>

        {/* Main Trainer Video Placeholder */}
        <div className="flex-1 bg-[#111827] rounded-2xl border border-[#1E293B] overflow-hidden relative flex flex-col items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.05)]">
          <User size={72} className="text-[#1E293B] mb-6" />
          <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[14px]">Trainer Video Placeholder</p>
          
          {/* My Video Pip */}
          <div className="absolute bottom-6 right-6 w-56 aspect-video bg-[#0F172A] rounded-xl border border-[#1E293B] overflow-hidden shadow-2xl flex items-center justify-center group pointer-events-none">
            {!cam ? (
              <div className="flex flex-col items-center text-gray-500">
                <VideoOff size={28} className="mb-2" />
                <span className="text-[12px] font-bold tracking-wider uppercase">Camera Off</span>
              </div>
            ) : (
              <User size={36} className="text-[#1E293B]" />
            )}
            <div className="absolute bottom-2 left-2 bg-[#030712]/80 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">You</div>
          </div>
        </div>

        {/* Controls Pill */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-[#111827]/90 backdrop-blur-xl border border-[#1E293B] px-8 py-4 rounded-full flex items-center gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <button onClick={() => setMic(!mic)} className={`p-3.5 rounded-full transition-all duration-300 ${!mic ? 'bg-[#EF4444]/20 text-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'}`}>
              {mic ? <Mic size={22}/> : <MicOff size={22}/>}
            </button>
            <button onClick={() => setCam(!cam)} className={`p-3.5 rounded-full transition-all duration-300 ${!cam ? 'bg-[#EF4444]/20 text-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'}`}>
              {cam ? <Video size={22}/> : <VideoOff size={22}/>}
            </button>
            <button className="p-3.5 bg-[#0F172A] text-white rounded-full hover:bg-[#1E293B] transition-colors">
              <Monitor size={22}/>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`p-3.5 rounded-full transition-all duration-300 ${chatOpen ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'}`}>
              <MessageSquare size={22}/>
            </button>
            <div className="w-px h-10 bg-[#1E293B] mx-2"></div>
            <button className="px-8 py-3.5 bg-[#EF4444] text-white rounded-full hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center font-bold text-[15px]">
              <Phone size={18} className="mr-2" style={{ transform: 'rotate(135deg)' }}/> End Call
            </button>
          </div>
        </div>

        {/* Collapsible Notes Area Overlay */}
        <div className="absolute top-8 right-8 z-10 max-w-sm pointer-events-auto">
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-xl border border-[#1E293B] p-5 shadow-lg">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">Session Notes</p>
            <p className="text-[14px] text-gray-300 font-medium leading-relaxed">Trainer Note: "Focus on squat depth today. Let's aim to increase bench to 55kg."</p>
          </div>
        </div>

      </div>

      {/* Slide-in Chat Panel */}
      <div className={`absolute top-0 right-0 h-full w-96 bg-[#111827] border-l border-[#1E293B] shadow-2xl transform transition-transform duration-300 flex flex-col z-20 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-[#1E293B] flex justify-between items-center bg-[#0F172A]">
          <h2 className="text-white font-bold text-[16px]">In-call Messages</h2>
          <button onClick={() => setChatOpen(false)} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors"><ChevronRight size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#030712]">
          <div className="text-center"><span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 bg-[#0F172A] border border-[#1E293B] px-3 py-1 rounded-full">Session Started</span></div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 mb-1.5 ml-1 font-bold tracking-wider uppercase">Arjun</span>
            <div className="bg-[#111827] border border-[#1E293B] text-gray-200 text-[14px] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed">Can you hear me alright?</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 mb-1.5 mr-1 font-bold tracking-wider uppercase">You</span>
            <div className="bg-[#2563EB] text-white text-[14px] px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm font-medium leading-relaxed">Yes, audio is clear!</div>
          </div>
        </div>

        <div className="p-5 border-t border-[#1E293B] bg-[#0F172A]">
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl flex items-end overflow-hidden focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
            <textarea rows="1" placeholder="Type message..." className="w-full bg-transparent text-white border-0 focus:ring-0 resize-none px-4 py-3.5 text-[14px] focus:outline-none placeholder-gray-500" />
          </div>
        </div>
      </div>

    </div>
  )
}
