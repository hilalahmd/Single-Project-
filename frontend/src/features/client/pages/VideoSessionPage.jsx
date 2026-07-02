import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/context/AuthContext'
import { Mic, MicOff, Video, VideoOff, Monitor, Phone, MessageSquare, ChevronRight, User } from 'lucide-react'
import Badge from '../../../shared/components/Badge'

export default function VideoSessionPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { subscriptionTier } = useAuth()
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (!sessionId || subscriptionTier !== 'pt') {
      navigate('/dashboard/coach', { replace: true })
    }
  }, [sessionId, subscriptionTier, navigate])

  if (!sessionId || subscriptionTier !== 'pt') return null

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* Background Decor (Light Glassmorphic) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] bg-purple-400/20 rounded-full blur-[100px]" />
      </div>

      {/* Main Video Area */}
      <div className={`flex-1 relative flex flex-col p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${chatOpen ? 'pr-[400px]' : ''}`}>
        
        {/* Header Overlay */}
        <div className="absolute top-10 left-10 right-10 z-20 flex justify-between items-start pointer-events-none">
          <div className="bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] pointer-events-auto">
            <h1 className="text-slate-800 font-bold text-[18px] leading-tight drop-shadow-sm">Session with Arjun Menon</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-red-500 font-mono text-[14px] font-bold animate-pulse drop-shadow-sm">00:24:31</span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <Badge label="Personal Training" className="text-[10px] text-slate-600 bg-white/80 border-slate-200 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Main Trainer Video Placeholder */}
        <div className="flex-1 bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white overflow-hidden relative flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(37,99,235,0.06)]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/50 pointer-events-none" />
          <User size={80} className="text-slate-300/50 mb-6 drop-shadow-sm" />
          <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-[14px]">Trainer Video Placeholder</p>
          
          {/* My Video Pip */}
          <div className="absolute bottom-8 right-8 w-64 aspect-video bg-white/70 backdrop-blur-2xl rounded-2xl border border-white overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.1)] flex items-center justify-center group pointer-events-none">
            {!cam ? (
              <div className="flex flex-col items-center text-slate-400">
                <VideoOff size={32} className="mb-2" />
                <span className="text-[12px] font-bold tracking-wider uppercase drop-shadow-sm">Camera Off</span>
              </div>
            ) : (
              <User size={40} className="text-slate-300 drop-shadow-sm" />
            )}
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 uppercase tracking-wider shadow-sm border border-white">You</div>
          </div>
        </div>

        {/* Controls Pill */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white/80 backdrop-blur-2xl border border-white px-8 py-4 rounded-[2rem] flex items-center gap-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <button onClick={() => setMic(!mic)} className={`p-4 rounded-full transition-all duration-300 shadow-sm ${!mic ? 'bg-red-50 text-red-500 border border-red-100 shadow-[0_4px_15px_rgba(239,68,68,0.15)]' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:text-blue-600'}`}>
              {mic ? <Mic size={22}/> : <MicOff size={22}/>}
            </button>
            <button onClick={() => setCam(!cam)} className={`p-4 rounded-full transition-all duration-300 shadow-sm ${!cam ? 'bg-red-50 text-red-500 border border-red-100 shadow-[0_4px_15px_rgba(239,68,68,0.15)]' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:text-blue-600'}`}>
              {cam ? <Video size={22}/> : <VideoOff size={22}/>}
            </button>
            <button className="p-4 bg-white text-slate-600 rounded-full hover:bg-slate-50 border border-slate-100 transition-colors shadow-sm hover:text-blue-600">
              <Monitor size={22}/>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`p-4 rounded-full transition-all duration-300 shadow-sm ${chatOpen ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] border border-blue-500' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:text-blue-600'}`}>
              <MessageSquare size={22}/>
            </button>
            <div className="w-px h-10 bg-slate-200 mx-2"></div>
            <button className="px-8 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-[0_8px_25px_rgba(239,68,68,0.3)] flex items-center font-bold text-[15px] border border-red-400">
              <Phone size={18} className="mr-2" style={{ transform: 'rotate(135deg)' }}/> End Call
            </button>
          </div>
        </div>

        {/* Collapsible Notes Area Overlay */}
        <div className="absolute top-10 right-10 z-20 max-w-sm pointer-events-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Session Notes</p>
            <p className="text-[14px] text-slate-700 font-medium leading-relaxed drop-shadow-sm">Trainer Note: "Focus on squat depth today. Let's aim to increase bench to 55kg."</p>
          </div>
        </div>

      </div>

      {/* Slide-in Chat Panel */}
      <div className={`absolute top-0 right-0 h-full w-[400px] bg-white/80 backdrop-blur-3xl border-l border-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col z-30 ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200/50 flex justify-between items-center bg-white/40">
          <h2 className="text-slate-800 font-bold text-[16px] drop-shadow-sm">In-call Messages</h2>
          <button onClick={() => setChatOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition-colors"><ChevronRight size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center"><span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-white/80 px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">Session Started</span></div>
          
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-slate-400 text-[13px] font-medium">No messages yet</p>
            <p className="text-slate-400/60 text-[12px] mt-1">Use the input below to chat during the session.</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200/50 bg-white/40">
          <div className="bg-white/80 backdrop-blur-md border border-white rounded-2xl flex items-end overflow-hidden focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
            <textarea rows="1" placeholder="Type message..." className="w-full bg-transparent text-slate-700 border-0 focus:ring-0 resize-none px-5 py-4 text-[14px] focus:outline-none placeholder-slate-400 font-medium" />
          </div>
        </div>
      </div>

    </div>
  )
}
