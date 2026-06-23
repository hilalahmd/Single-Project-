import { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquare, ChevronRight, User } from 'lucide-react'
import Badge from '../../../shared/components/Badge'

export default function VideoSessionPage() {
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex font-sans overflow-hidden">
      
      {/* Main Video Area */}
      <div className={`flex-1 relative flex flex-col p-4 transition-all duration-300 ${chatOpen ? 'pr-96' : ''}`}>
        
        {/* Header Overlay */}
        <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 pointer-events-auto">
            <h1 className="text-white font-bold text-lg leading-tight">Session with Arjun Menon</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-red-400 font-mono text-sm font-bold animate-pulse">00:24:31</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <Badge label="Personal Training" variant="outline" className="text-[10px] text-gray-300 border-gray-600 bg-gray-800/50" />
            </div>
          </div>
        </div>

        {/* Main Trainer Video Placeholder */}
        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative flex flex-col items-center justify-center shadow-2xl">
          <User size={64} className="text-gray-700 mb-4" />
          <p className="text-gray-500 font-bold tracking-widest uppercase">Trainer Video Placeholder</p>
          
          {/* My Video Pip */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl flex items-center justify-center group pointer-events-none">
            {!cam ? (
              <div className="flex flex-col items-center text-gray-500">
                <VideoOff size={24} className="mb-2" />
                <span className="text-xs font-bold">Camera Off</span>
              </div>
            ) : (
              <User size={32} className="text-gray-600" />
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-white">You</div>
          </div>
        </div>

        {/* Controls Pill */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-800 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
            <button onClick={() => setMic(!mic)} className={`p-3 rounded-full transition-colors ${!mic ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {mic ? <Mic size={20}/> : <MicOff size={20}/>}
            </button>
            <button onClick={() => setCam(!cam)} className={`p-3 rounded-full transition-colors ${!cam ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              {cam ? <Video size={20}/> : <VideoOff size={20}/>}
            </button>
            <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
              <Monitor size={20}/>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`p-3 rounded-full transition-colors ${chatOpen ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
              <MessageSquare size={20}/>
            </button>
            <div className="w-px h-8 bg-gray-700 mx-2"></div>
            <button className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center font-bold text-sm">
              <Phone size={16} className="mr-2" style={{ transform: 'rotate(135deg)' }}/> End
            </button>
          </div>
        </div>

        {/* Collapsible Notes Area Overlay */}
        <div className="absolute top-8 right-8 z-10 max-w-sm pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-lg">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Session Notes</p>
            <p className="text-sm text-white font-medium">Trainer Note: "Focus on squat depth today. Let's aim to increase bench to 55kg."</p>
          </div>
        </div>

      </div>

      {/* Slide-in Chat Panel */}
      <div className={`absolute top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-800 shadow-2xl transform transition-transform duration-300 flex flex-col z-20 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white font-bold">In-call Messages</h2>
          <button onClick={() => setChatOpen(false)} className="p-1 text-gray-400 hover:text-white rounded transition-colors"><ChevronRight size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center"><span className="text-[10px] uppercase font-bold text-gray-500">Session Started</span></div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 mb-1 ml-1 font-bold">Arjun</span>
            <div className="bg-gray-800 text-gray-200 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm border border-gray-700">Can you hear me alright?</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 mb-1 mr-1 font-bold">You</span>
            <div className="bg-white text-black text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm font-medium">Yes, audio is clear!</div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="bg-gray-900 border border-gray-700 rounded-xl flex items-end overflow-hidden focus-within:border-gray-500 transition-colors">
            <textarea rows="1" placeholder="Type message..." className="w-full bg-transparent text-white border-0 focus:ring-0 resize-none px-4 py-3 text-sm focus:outline-none placeholder-gray-600" />
          </div>
        </div>
      </div>

    </div>
  )
}
