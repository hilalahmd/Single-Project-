import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mic, MicOff, Video, VideoOff,
  ChevronLeft, Users, CheckCircle2,
  AlertCircle, Loader2, Phone, PhoneOff
} from 'lucide-react'
import { useSocket } from '../../../shared/context/SocketContext'
import { useAuth } from '../../../shared/context/AuthContext'
import VideoCallModal from '../../../shared/components/VideoCallModal'
import API from '../../../shared/utils/api'

// ─── States: 'lobby' → 'calling' → 'in-call' → 'ended' ─────────────────────

export default function VideoSessionPage() {
  const { sessionId } = useParams()
  const navigate      = useNavigate()
  const socket        = useSocket()
  const { user }      = useAuth()

  // ── Page state machine
  const [pageState,  setPageState]  = useState('lobby')   // lobby | calling | in-call | ended
  const [callData,   setCallData]   = useState(null)       // data passed to VideoCallModal

  // ── Lobby device state
  const [isMuted,    setIsMuted]    = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [camReady,   setCamReady]   = useState(false)      // camera access granted?
  const [camError,   setCamError]   = useState(false)      // camera access denied?
  const [callSeconds,setCallSeconds]= useState(0)          // ended screen duration

  // ── Refs
  const localPreviewRef = useRef(null)
  const previewStreamRef = useRef(null)

  // ─── Start real camera preview in lobby ─────────────────────────────────
  useEffect(() => {
    let stream = null

    const startPreview = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        previewStreamRef.current = stream
        if (localPreviewRef.current) {
          localPreviewRef.current.srcObject = stream
        }
        setCamReady(true)
      } catch (err) {
        console.warn('Camera access denied in lobby:', err)
        setCamError(true)
      }
    }

    if (pageState === 'lobby') startPreview()

    return () => {
      // Stop preview when leaving lobby (VideoCallModal will open its own stream)
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [pageState])

  // Toggle preview mic
  const toggleLobbyMic = () => {
    const track = previewStreamRef.current?.getAudioTracks()[0]
    if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled) }
  }

  // Toggle preview camera
  const toggleLobbyCamera = () => {
    const track = previewStreamRef.current?.getVideoTracks()[0]
    if (track) { track.enabled = !track.enabled; setIsVideoOff(!track.enabled) }
  }

  // ─── Socket listeners for call handshake ────────────────────────────────
  useEffect(() => {
    if (!socket) return

    const handleCallAccepted = () => {
      // Stop lobby preview before VideoCallModal opens its own stream
      previewStreamRef.current?.getTracks().forEach(t => t.stop())
      setCallData({
        id: sessionId,
        name: 'Contact',
        isCaller: true,
      })
      setPageState('in-call')
    }

    const handleCallRejected = async () => {
      setPageState('lobby')
      alert('The contact is currently unavailable. Try again later.')
      try {
        const res = await fetch(`${API}/chat/call-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId: sessionId, type: 'call_declined' }),
          credentials: 'include'
        })
        const data = await res.json()
        if (data.success) {
          const roomIds = [user._id, sessionId].sort()
          const chatId = `${roomIds[0]}_${roomIds[1]}`
          socket.emit('send_message', { ...data.data, chatId })
        }
      } catch (err) { console.error('Failed to log declined call', err) }
    }

    const handleCallEnded = () => {
      setPageState('ended')
    }

    socket.on('call_accepted', handleCallAccepted)
    socket.on('call_rejected', handleCallRejected)
    socket.on('call_ended',    handleCallEnded)

    return () => {
      socket.off('call_accepted', handleCallAccepted)
      socket.off('call_rejected', handleCallRejected)
      socket.off('call_ended',    handleCallEnded)
    }
  }, [socket, user, sessionId])

  // ─── Join Session → emit initiate_call to contact ───────────────────────
  const handleJoinSession = useCallback(() => {
    if (!socket) return

    if (!sessionId) {
      alert('Invalid session ID.')
      return
    }

    // Stop preview stream — VideoCallModal will open fresh stream after accepted
    previewStreamRef.current?.getTracks().forEach(t => t.stop())

    socket.emit('initiate_call', {
      receiverId: sessionId,
      callerData: { id: user._id, name: user.name }
    })

    setPageState('calling')
  }, [socket, user, sessionId])

  // ─── Cancel outgoing call ────────────────────────────────────────────────
  const cancelCall = useCallback(async () => {
    if (socket && sessionId) {
      socket.emit('end_call', { targetId: sessionId })
      try {
        const res = await fetch(`${API}/chat/call-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId: sessionId, type: 'call_missed' }),
          credentials: 'include'
        })
        const data = await res.json()
        if (data.success) {
          const roomIds = [user._id, sessionId].sort()
          const chatId = `${roomIds[0]}_${roomIds[1]}`
          socket.emit('send_message', { ...data.data, chatId })
        }
      } catch (err) { console.error('Failed to log missed call', err) }
    }
    setPageState('lobby')
  }, [socket, user, sessionId])

  // ─── Format time ─────────────────────────────────────────────────────────
  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    return `${m}:${String(s % 60).padStart(2, '0')}`
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: LOBBY
  // ════════════════════════════════════════════════════════════════════════
  if (pageState === 'lobby') {
    return (
      <div className="h-screen w-full bg-[#050810] fixed top-0 left-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-600/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-[#F97316]/8 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 z-10 px-6">

          {/* ── Left: Live Camera Preview ─────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video bg-[#0F172A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

              {/* Live video element */}
              <video
                ref={localPreviewRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
              />

              {/* Camera off overlay */}
              {isVideoOff && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center mb-3">
                    <span className="text-2xl font-black text-white">{user?.name?.charAt(0) || 'Y'}</span>
                  </div>
                  <span className="text-sm font-semibold tracking-widest uppercase text-gray-500">Camera is off</span>
                </div>
              )}

              {/* Camera loading / error */}
              {!camReady && !camError && !isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]">
                  <Loader2 size={32} className="text-[#F97316] animate-spin" />
                </div>
              )}

              {/* Preview controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button
                  onClick={toggleLobbyMic}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md border ${
                    isMuted
                      ? 'bg-red-500/80 border-red-500/50 text-white'
                      : 'bg-white/15 border-white/15 text-white hover:bg-white/25'
                  }`}>
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  onClick={toggleLobbyCamera}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-md border ${
                    isVideoOff
                      ? 'bg-red-500/80 border-red-500/50 text-white'
                      : 'bg-white/15 border-white/15 text-white hover:bg-white/25'
                  }`}>
                  {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              </div>
            </div>

            {/* Device status row */}
            <div className="flex items-center justify-center gap-6">
              {camError ? (
                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                  <AlertCircle size={16} />
                  Camera / Mic access denied
                </div>
              ) : camReady ? (
                <>
                  <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold">
                    <CheckCircle2 size={15} /> Mic ready
                  </div>
                  <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold">
                    <CheckCircle2 size={15} /> Camera ready
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                  <Loader2 size={15} className="animate-spin" />
                  Checking devices…
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Meeting Info + Join ────────────────────────────── */}
          <div className="flex flex-col justify-center">
            <button
              onClick={() => navigate(-1)}
              className="w-fit mb-6 text-gray-500 hover:text-white flex items-center text-sm font-bold transition-colors">
              <ChevronLeft size={16} className="mr-1" /> Back
            </button>

            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Ready to join?</h1>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Your personal training session will begin as soon as your coach accepts.
            </p>

            {/* Coach card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] font-black text-lg">
                  {user?.assignedTrainer?.name?.charAt(0) || <Users size={20} />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    {user?.assignedTrainer?.name || 'Your Assigned Coach'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Personal Trainer · FitForge</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-semibold">Online</span>
                </div>
              </div>
            </div>

            {/* Session ID chip */}
            {sessionId && (
              <p className="text-xs text-gray-600 mb-5 font-mono">
                Session ID: {sessionId}
              </p>
            )}

            <button
              onClick={handleJoinSession}
              disabled={camError}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                camError
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_0_24px_rgba(249,115,22,0.35)] hover:shadow-[0_0_36px_rgba(249,115,22,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              }`}>
              <Phone size={20} className={camError ? '' : 'fill-white'} />
              {camError ? 'Camera Required to Join' : 'Call Coach'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: CALLING (waiting for coach to accept)
  // ════════════════════════════════════════════════════════════════════════
  if (pageState === 'calling') {
    return (
      <div className="h-screen w-full bg-[#050810] fixed top-0 left-0 z-50 flex flex-col items-center justify-center"
        style={{ fontFamily: "'Inter', sans-serif" }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F97316]/6 rounded-full blur-[150px]" />
        </div>

        {/* Animated ring avatar */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F97316]/30 to-[#F97316]/10 border-2 border-[#F97316]/50 flex items-center justify-center text-4xl font-black text-white z-10 relative"
            style={{ animation: 'scalePulse 2s ease-in-out infinite' }}>
            {user?.assignedTrainer?.name?.charAt(0) || '?'}
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-[#F97316]/30 animate-ping" />
          <div className="absolute -inset-4 rounded-full border border-[#F97316]/15 animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Calling your coach…</h2>
        <p className="text-gray-400 text-sm mb-10">
          {user?.assignedTrainer?.name || 'Your Coach'} · Ringing
        </p>

        <button
          onClick={cancelCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_24px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95">
          <PhoneOff size={26} />
        </button>
        <p className="text-gray-600 text-xs mt-4 font-medium">Tap to cancel</p>

        <style>{`
          @keyframes scalePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
        `}</style>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: IN-CALL — delegate to VideoCallModal
  // ════════════════════════════════════════════════════════════════════════
  if (pageState === 'in-call' && callData) {
    return (
      <VideoCallModal
        callData={callData}
        onClose={() => setPageState('ended')}
      />
    )
  }

  // ════════════════════════════════════════════════════════════════════════
  // RENDER: ENDED
  // ════════════════════════════════════════════════════════════════════════
  if (pageState === 'ended') {
    return (
      <div className="h-screen w-full bg-[#050810] fixed top-0 left-0 z-50 flex items-center justify-center"
        style={{ fontFamily: "'Inter', sans-serif" }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-10 rounded-3xl max-w-sm w-full mx-4 text-center shadow-2xl z-10">
          <div className="w-20 h-20 bg-green-500/15 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={38} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Session Complete</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Great work! Your session with{' '}
            <span className="text-white font-semibold">
              {user?.assignedTrainer?.name || 'your coach'}
            </span>{' '}
            has ended.
          </p>

          <button
            onClick={() => navigate('/dashboard/schedule')}
            className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl font-bold text-base transition-all duration-200 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer mb-3">
            Back to Schedule
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-500 hover:text-white transition-colors font-medium cursor-pointer">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return null
}