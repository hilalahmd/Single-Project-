import React, { useEffect, useState, useCallback } from 'react'
import { useSocket } from '../context/SocketContext'
import { Phone, PhoneOff } from 'lucide-react'
import VideoCallModal from './VideoCallModal'

export default function GlobalCallListener() {
  const socket = useSocket()

  const [incomingCall, setIncomingCall] = useState(null)  // callerData object
  const [callActive,   setCallActive]   = useState(false)
  const [callData,     setCallData]     = useState(null)

  useEffect(() => {
    if (!socket) return

    const handleIncomingCall = (callerData) => {
      console.log('☎️ Incoming call from:', callerData)
      setIncomingCall(callerData)
    }

    const handleCallEnded = () => {
      setIncomingCall(null)
      setCallActive(false)
      setCallData(null)
    }

    const handleCallRejected = () => {
      setIncomingCall(null)
    }

    socket.on('incoming_call', handleIncomingCall)
    socket.on('call_ended',    handleCallEnded)
    socket.on('call_rejected', handleCallRejected)

    return () => {
      socket.off('incoming_call', handleIncomingCall)
      socket.off('call_ended',    handleCallEnded)
      socket.off('call_rejected', handleCallRejected)
    }
  }, [socket])

  const acceptCall = useCallback(() => {
    if (!incomingCall || !socket) return
    socket.emit('accept_call', { callerId: incomingCall.id })
    setCallData({ ...incomingCall, isCaller: false })
    setCallActive(true)
    setIncomingCall(null)
  }, [incomingCall, socket])

  const rejectCall = useCallback(() => {
    if (!incomingCall || !socket) return
    socket.emit('reject_call', { callerId: incomingCall.id })
    setIncomingCall(null)
  }, [incomingCall, socket])

  return (
    <>
      {/* ── Incoming Call Popup ───────────────────────────────────────── */}
      {incomingCall && !callActive && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.25s ease' }}>

          <div className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

            {/* Animated Avatar */}
            <div className="relative mx-auto mb-5 w-24 h-24">
              {/* Ripple rings */}
              <div className="absolute inset-0 rounded-full border-2 border-green-500/40 animate-ping" />
              <div className="absolute -inset-2 rounded-full border border-green-500/20 animate-ping" style={{ animationDelay: '0.25s' }} />
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] flex items-center justify-center text-3xl font-black text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                {incomingCall.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{incomingCall.name}</h3>
            <p className="text-gray-400 text-sm mb-8 font-medium">Incoming video call…</p>

            <div className="flex justify-center gap-8">
              {/* Decline */}
              <button onClick={rejectCall} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-200 shadow-sm">
                  <PhoneOff size={26} />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Decline</span>
              </button>

              {/* Accept */}
              <button onClick={acceptCall} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:bg-green-400 group-hover:scale-110 transition-all duration-200 shadow-[0_0_24px_rgba(34,197,94,0.5)] animate-pulse">
                  <Phone size={26} className="fill-white" />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Accept</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Video Call Modal ───────────────────────────────────── */}
      {callActive && callData && (
        <VideoCallModal
          callData={callData}
          onClose={() => {
            setCallActive(false)
            setCallData(null)
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </>
  )
}
