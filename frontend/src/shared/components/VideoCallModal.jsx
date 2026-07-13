import React, { useEffect, useRef, useState, useCallback } from 'react'
import { PhoneOff, Mic, MicOff, Video, VideoOff, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'

// ─── ICE Server Config (STUN + free TURN relay for cross-network calls) ──────
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
}

export default function VideoCallModal({ callData, onClose }) {
  const socket = useSocket()
  const { user } = useAuth()

  const localVideoRef  = useRef(null)
  const remoteVideoRef = useRef(null)
  const pcRef          = useRef(null)       // RTCPeerConnection
  const localStreamRef = useRef(null)
  const isCleaningUp   = useRef(false)      // prevent double-cleanup

  const isCaller    = callData?.isCaller
  const otherUserId = callData?.id

  const [micOn,    setMicOn]    = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [connStatus, setConnStatus] = useState('connecting') // 'connecting' | 'connected' | 'failed'
  const [callSeconds, setCallSeconds] = useState(0)

  // ─── Timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (connStatus !== 'connected') return
    const id = setInterval(() => setCallSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [connStatus])

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  // ─── Cleanup (safe to call multiple times) ───────────────────────────────
  const cleanup = useCallback(() => {
    if (isCleaningUp.current) return
    isCleaningUp.current = true

    localStreamRef.current?.getTracks().forEach(t => t.stop())
    localStreamRef.current = null

    if (pcRef.current) {
      pcRef.current.ontrack         = null
      pcRef.current.onicecandidate  = null
      pcRef.current.onconnectionstatechange = null
      pcRef.current.close()
      pcRef.current = null
    }
  }, [])

  // ─── End call (user-initiated) ───────────────────────────────────────────
  const endCall = useCallback(() => {
    if (socket && otherUserId) {
      socket.emit('end_call', { targetId: otherUserId })
    }
    cleanup()
    onClose()
  }, [socket, otherUserId, cleanup, onClose])

  // ─── WebRTC Setup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return

    const pc = new RTCPeerConnection(ICE_SERVERS)
    pcRef.current = pc

    // Track connection state → update UI badge
    pc.onconnectionstatechange = () => {
      const s = pc.connectionState
      if (s === 'connected')                       setConnStatus('connected')
      else if (s === 'failed' || s === 'closed')   setConnStatus('failed')
      else if (s === 'connecting' || s === 'new')  setConnStatus('connecting')
    }

    // Show remote stream in full-screen video element
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // ICE candidates → relay via socket
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc_ice_candidate', { targetId: otherUserId, candidate: event.candidate })
      }
    }

    const setupWebRTC = (stream) => {
      if (stream) {
        localStreamRef.current = stream
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
        stream.getTracks().forEach(track => pc.addTrack(track, stream))
      }

      // Caller creates and sends the offer
      if (isCaller) {
        pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
          .then(offer => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit('webrtc_offer', { receiverId: otherUserId, offer: pc.localDescription })
          })
          .catch(e => console.error("Error creating offer:", e))
      }
    }

    // Get local camera + mic
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(setupWebRTC)
      .catch(err => {
        console.warn('Camera/Mic access denied (or in use by another tab). Trying audio only...', err)
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
          .then(setupWebRTC)
          .catch(err2 => {
            console.warn('Audio also failed. Connecting without media (view-only mode)...', err2)
            setupWebRTC(null)
          })
      })

    // ── Named socket handlers (so we can cleanly .off them later) ──────────
    const handleOffer = async ({ offer }) => {
      if (isCaller) return
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socket.emit('webrtc_answer', { callerId: otherUserId, answer })
      } catch (e) { console.error('Offer handling error:', e) }
    }

    const handleAnswer = async ({ answer }) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
      } catch (e) { console.error('Answer handling error:', e) }
    }

    const handleIce = async ({ candidate }) => {
      try {
        if (candidate && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
      } catch (e) { console.error('ICE candidate error:', e) }
    }

    const handleCallEnded = () => {
      cleanup()
      onClose()
    }

    socket.on('webrtc_offer',         handleOffer)
    socket.on('webrtc_answer',        handleAnswer)
    socket.on('webrtc_ice_candidate', handleIce)
    socket.on('call_ended',           handleCallEnded)

    return () => {
      // Remove only our named handlers — no side-effects on other listeners
      socket.off('webrtc_offer',         handleOffer)
      socket.off('webrtc_answer',        handleAnswer)
      socket.off('webrtc_ice_candidate', handleIce)
      socket.off('call_ended',           handleCallEnded)
      // Do NOT emit 'end_call' here — only the user clicking End button should do that
      cleanup()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  // ─── Mic toggle ──────────────────────────────────────────────────────────
  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled) }
  }

  // ─── Camera toggle ───────────────────────────────────────────────────────
  const toggleCamera = () => {
    const track = localStreamRef.current?.getVideoTracks()[0]
    if (track) { track.enabled = !track.enabled; setCameraOn(track.enabled) }
  }

  // ─── Connection Status Badge ─────────────────────────────────────────────
  const StatusBadge = () => {
    if (connStatus === 'connected') return (
      <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 px-3 py-1.5 rounded-full">
        <Wifi size={13} className="text-green-400" />
        <span className="text-green-400 font-bold text-xs tracking-wider">CONNECTED · {formatTime(callSeconds)}</span>
      </div>
    )
    if (connStatus === 'failed') return (
      <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 px-3 py-1.5 rounded-full">
        <WifiOff size={13} className="text-red-400" />
        <span className="text-red-400 font-bold text-xs tracking-wider">CONNECTION FAILED</span>
      </div>
    )
    return (
      <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 px-3 py-1.5 rounded-full">
        <Loader2 size={13} className="text-yellow-400 animate-spin" />
        <span className="text-yellow-400 font-bold text-xs tracking-wider">CONNECTING…</span>
      </div>
    )
  }

  // ─── Remote placeholder while connecting ─────────────────────────────────
  const callerName = callData?.name || 'User'
  const callerInitial = callerName.charAt(0).toUpperCase()

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050810] flex flex-col select-none" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top Bar ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 w-full px-6 py-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <StatusBadge />
        <div className="text-white/50 text-xs font-semibold">FitForge Video</div>
      </div>

      {/* ── Remote Video (Full Screen) ────────────────────────────────── */}
      <div className="flex-1 relative bg-[#0a0a12] overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Connecting overlay — shown until remote stream arrives */}
        {connStatus !== 'connected' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050810]/80 backdrop-blur-sm">
            {/* Animated avatar ring */}
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#F97316]/30 to-[#F97316]/10 border-2 border-[#F97316]/40 flex items-center justify-center text-4xl font-black text-white"
                style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                {callerInitial}
              </div>
              {/* Ripple rings */}
              <div className="absolute inset-0 rounded-full border-2 border-[#F97316]/20 animate-ping" />
              <div className="absolute -inset-3 rounded-full border border-[#F97316]/10 animate-ping" style={{ animationDelay: '0.3s' }} />
            </div>
            <p className="text-white font-bold text-lg mb-1">{callerName}</p>
            <p className="text-gray-400 text-sm">{connStatus === 'failed' ? 'Could not connect. Check network.' : 'Connecting, please wait…'}</p>
          </div>
        )}

        {/* Name tag bottom-left */}
        {connStatus === 'connected' && (
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="text-white font-bold text-sm">{callerName}</span>
          </div>
        )}
      </div>

      {/* ── Local PiP (you) ──────────────────────────────────────────── */}
      <div className="absolute top-20 right-5 w-36 md:w-48 aspect-video bg-[#111827] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-20 group">
        {cameraOn
          ? <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          : (
            <div className="w-full h-full flex items-center justify-center bg-[#0F172A]">
              <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center">
                <span className="text-white font-bold text-base">{user?.name?.charAt(0) || 'Y'}</span>
              </div>
            </div>
          )
        }
        {/* Muted indicator */}
        {!micOn && (
          <div className="absolute top-2 right-2 bg-red-500 p-0.5 rounded-md">
            <MicOff size={12} className="text-white" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded-md">
          <span className="text-white text-[10px] font-semibold">You</span>
        </div>
      </div>

      {/* ── Controls Bar ──────────────────────────────────────────────── */}
      <div className="h-28 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-5 px-6">

        {/* Mic */}
        <button
          onClick={toggleMic}
          title={micOn ? 'Mute Mic' : 'Unmute Mic'}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-200 border ${
            micOn
              ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
              : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
          }`}
        >
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          title="End Call"
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 border border-red-500/30"
        >
          <PhoneOff size={26} />
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          title={cameraOn ? 'Turn off Camera' : 'Turn on Camera'}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 border ${
            cameraOn
              ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
              : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
          }`}
        >
          {cameraOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.85; }
        }
      `}</style>
    </div>
  )
}
