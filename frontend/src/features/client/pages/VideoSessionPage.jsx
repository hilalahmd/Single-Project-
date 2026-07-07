import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Settings, Star, CheckCircle2, ChevronLeft, Users } from 'lucide-react'

export default function VideoSessionPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  
  // Call States: 'lobby' -> 'in-call' -> 'ended'
  const [callState, setCallState] = useState('lobby')
  
  // Media States
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  
  // In-Call States
  const [showChat, setShowChat] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  
  // Rating State
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  // Timer logic for in-call
  useEffect(() => {
    let interval;
    if (callState === 'in-call') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callState])

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // --- RENDERS ---

  if (callState === 'lobby') {
    return (
      <div className="h-screen w-full bg-[#0B0F19] fixed top-0 left-0 z-50 flex items-center justify-center font-sans overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-[#F97316]/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 z-10 px-6">
          {/* Left: Video Preview */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
              {!isVideoOff ? (
                <img 
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2000&auto=format&fit=crop" 
                  alt="Camera Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <VideoOff size={48} className="mb-3 opacity-50" />
                  <span className="text-sm font-semibold tracking-widest uppercase">Camera is off</span>
                </div>
              )}
              
              {/* Preview Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md ${isMuted ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md ${isVideoOff ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}
                >
                  {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-400">
              <CheckCircle2 size={16} /> Audio & Video looks good
            </div>
          </div>

          {/* Right: Meeting Info */}
          <div className="flex flex-col justify-center">
            <button onClick={() => navigate('/dashboard/schedule')} className="w-fit mb-6 text-gray-400 hover:text-white flex items-center text-sm font-bold transition-colors">
              <ChevronLeft size={16} className="mr-1"/> Back to Schedule
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Ready to join?</h1>
            <p className="text-gray-400 mb-8">Personal Training Session with your Coach.</p>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316]">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold">Your Coach is waiting</h3>
                  <p className="text-xs text-gray-400">Joined 2 mins ago</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCallState('in-call')}
              className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transform hover:scale-[1.02]"
            >
              Join Session Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (callState === 'in-call') {
    return (
      <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden fixed top-0 left-0 z-50">
        
        {/* Top Bar */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-red-500 font-bold text-xs tracking-wider">LIVE</span>
            </div>
            <span className="text-white font-mono font-bold">{formatTime(callDuration)}</span>
          </div>
          <div className="flex gap-4">
            <button className="text-white/70 hover:text-white transition-colors"><Settings size={20}/></button>
          </div>
        </div>

        {/* Main Video Area (Coach) */}
        <div className="flex-1 relative bg-[#0a0a0a] flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
            alt="Coach" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="text-white font-bold text-sm">Arjun Menon (Coach)</span>
          </div>
        </div>

        {/* PiP (Client/You) */}
        <div className="absolute top-24 right-8 w-64 aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-10 group">
          {!isVideoOff ? (
            <img 
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2000&auto=format&fit=crop" 
              alt="You" 
              className="w-full h-full object-cover transform scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
            </div>
          )}
          {isMuted && (
            <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-md text-white">
              <MicOff size={14} />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md">
            <span className="text-white text-xs font-semibold">You</span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-0 w-full p-8 flex justify-center items-center z-10 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-4 rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            
            <button 
              onClick={() => setCallState('ended')}
              className="w-16 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all ml-4 shadow-[0_0_20px_rgba(220,38,38,0.4)] transform hover:scale-[1.05]"
            >
              <PhoneOff size={20} />
            </button>

            <div className="w-px h-8 bg-white/20 mx-2"></div>

            <button 
              onClick={() => setShowChat(!showChat)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${showChat ? 'bg-[#F97316] text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <MessageSquare size={20} />
            </button>

          </div>
        </div>
      </div>
    )
  }

  // --- Ended State (Rating Screen) ---
  if (callState === 'ended') {
    return (
      <div className="h-screen w-full bg-[#0B0F19] fixed top-0 left-0 z-50 flex items-center justify-center font-sans overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay"></div>
        
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl max-w-md w-full mx-4 text-center z-10 shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Session Ended</h2>
          <p className="text-gray-400 mb-2">Duration: {formatTime(callDuration)}</p>
          <p className="text-sm text-gray-500 mb-8">How was your session with Arjun?</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={36} 
                  className={`transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                />
              </button>
            ))}
          </div>

          <button 
            onClick={() => navigate('/dashboard/schedule')}
            disabled={rating === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              rating > 0 
                ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Feedback
          </button>
          
          <button 
            onClick={() => navigate('/dashboard/schedule')}
            className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    )
  }

  return null
}
    