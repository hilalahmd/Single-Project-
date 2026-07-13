import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Loader2, MessageSquare, ChevronUp } from 'lucide-react'
import { useSocket } from '../../../shared/context/SocketContext'
import { useAuth } from '../../../shared/context/AuthContext'
import API from '../../../shared/utils/api'

export default function GroupSessionPage() {
  const { sessionId } = useParams() // This represents slotId
  const navigate = useNavigate()
  const socket = useSocket()
  const { user } = useAuth()

  // ── States ────────────────────────────────────────────────────────────────
  const [isVerifying, setIsVerifying] = useState(true)
  const [isRequestingMedia, setIsRequestingMedia] = useState(false)
  const [canJoin, setCanJoin] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [cameraError, setCameraError] = useState(false)
  const [inCall, setInCall] = useState(false)
  const [showChatMenu, setShowChatMenu] = useState(false)

  // Local media control
  const [localStream, setLocalStream] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  // Peers dictionary: { userId: { socketId, stream, peerConnection } }
  const [peers, setPeers] = useState({})

  // Refs
  const localVideoRef = useRef()
  const peersRef = useRef({}) // Persistent reference to avoid render closures
  const streamRef = useRef()

  // ICE configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }

  // ── 1. Verify Slot Access ──────────────────────────────────────────────────
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`${API}/schedule/slots/${sessionId}/verify-access`, {
          credentials: 'include'
        })
        const data = await res.json()
        if (data.success && data.canJoin) {
          setCanJoin(true)
        } else {
          setErrorMessage(data.message || 'Access Denied. You do not have access to this slot.')
        }
      } catch (err) {
        setErrorMessage('Failed to verify session access. Try again.')
      } finally {
        setIsVerifying(false)
      }
    }
    if (sessionId) checkAccess()
  }, [sessionId])

  // ── 2. Get User Stream ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!canJoin) return
    const getMedia = async () => {
      setIsRequestingMedia(true)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setLocalStream(stream)
        streamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('Failed to get media devices:', err)
        setCameraError(true)
      } finally {
        setIsRequestingMedia(false)
      }
    }
    getMedia()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [canJoin])

  // Sync local stream to video element when it mounts/unmounts
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream, inCall])

  // ── 3. Peer Connection Creation Helper ────────────────────────────────────
  const createPeerConnection = (targetUserId, targetSocketId) => {
    const pc = new RTCPeerConnection(iceServers)

    // Add local tracks to peer connection
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => pc.addTrack(track, streamRef.current))
    }

    // ICE Candidate event
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('room_ice', {
          targetUserId,
          candidate: event.candidate,
          fromUserId: user._id,
          roomId: sessionId
        })
      }
    }

    // Remote Track event
    pc.ontrack = (event) => {
      console.log(`🎥 Received remote track from user ${targetUserId}`)
      setPeers(prev => ({
        ...prev,
        [targetUserId]: {
          ...prev[targetUserId],
          stream: event.streams[0]
        }
      }))
    }

    // Connection state changes
    pc.onconnectionstatechange = () => {
      console.log('🔄 Connection state:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        setPeers(prev => ({
          ...prev,
          [targetUserId]: {
            ...prev[targetUserId],
            connected: true
          }
        }))
      }
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeer(targetUserId)
      }
    }

    return pc
  }

  const removePeer = (targetUserId) => {
    const peer = peersRef.current[targetUserId]
    if (peer) {
      if (peer.peerConnection) peer.peerConnection.close()
      delete peersRef.current[targetUserId]
      setPeers(prev => {
        const newPeers = { ...prev }
        delete newPeers[targetUserId]
        return newPeers
      })
    }
  }

  // ── 4. WebRTC Signal Flow (Room Signalling) ────────────────────────────────
  useEffect(() => {
    if (!inCall || !socket || !user) return

    // A. Request join room
    const joinRoom = () => {
      socket.emit('join_video_room', { roomId: sessionId, userId: user._id, userName: user.name || user.firstName })
    }
    
    joinRoom()
    socket.on('connect', joinRoom) // Re-join if socket disconnects and reconnects

    // B. Received existing peers from room
    socket.on('existing_peers', async (existingPeersList) => {
      console.log('👥 Room peers detected:', existingPeersList)
      for (const peer of existingPeersList) {
        if (peer.userId === user._id) continue
        if (peersRef.current[peer.userId]) continue // Prevent duplicate connections

        const pc = createPeerConnection(peer.userId, peer.socketId)
        peersRef.current[peer.userId] = {
          socketId: peer.socketId,
          userName: peer.userName,
          peerConnection: pc,
          stream: null
        }
        setPeers(prev => ({
          ...prev,
          [peer.userId]: { socketId: peer.socketId, userName: peer.userName, stream: null }
        }))

        // Create Offer
        try {
          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          })
          await pc.setLocalDescription(offer)
          socket.emit('room_offer', {
            targetUserId: peer.userId,
            offer,
            fromUserId: user._id,
            roomId: sessionId
          })
        } catch (err) {
          console.error('Error creating local offer:', err)
        }
      }
    })

    // C. Another peer joined room
    socket.on('peer_joined', ({ userId, socketId, userName }) => {
      console.log('🆕 Peer joined room:', userId, userName)
      if (peersRef.current[userId]) return // Prevent duplicate connections
      
      const pc = createPeerConnection(userId, socketId)
      peersRef.current[userId] = {
        socketId,
        userName,
        peerConnection: pc,
        stream: null
      }
      setPeers(prev => ({
        ...prev,
        [userId]: { socketId, userName, stream: null }
      }))
    })

    // D. Receive WebRTC Offer
    socket.on('room_offer', async ({ offer, fromUserId }) => {
      console.log('📦 Received offer from:', fromUserId)
      const peer = peersRef.current[fromUserId]
      if (!peer) return

      try {
        await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await peer.peerConnection.createAnswer()
        await peer.peerConnection.setLocalDescription(answer)
        socket.emit('room_answer', {
          targetUserId: fromUserId,
          answer,
          fromUserId: user._id,
          roomId: sessionId
        })
      } catch (err) {
        console.error('Error handling WebRTC offer:', err)
      }
    })

    // E. Receive WebRTC Answer
    socket.on('room_answer', async ({ answer, fromUserId }) => {
      console.log('✅ Received answer from:', fromUserId)
      const peer = peersRef.current[fromUserId]
      if (peer && peer.peerConnection) {
        await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      }
    })

    // F. Receive ICE Candidates
    socket.on('room_ice', async ({ candidate, fromUserId }) => {
      const peer = peersRef.current[fromUserId]
      if (peer && peer.peerConnection) {
        try {
          await peer.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (err) {
          console.error('Error adding ICE candidate:', err)
        }
      }
    })

    // G. Peer left room
    socket.on('peer_left', ({ userId }) => {
      console.log('👋 Peer left:', userId)
      removePeer(userId)
    })

    // H. Self-Healing Ping Mechanism (If stuck waiting, ask for peers every 3s)
    const pingInterval = setInterval(() => {
      if (Object.keys(peersRef.current).length === 0) {
        socket.emit('request_peers', { roomId: sessionId, userId: user._id })
      }
    }, 3000)

    return () => {
      clearInterval(pingInterval)
      socket.emit('leave_video_room', { roomId: sessionId, userId: user._id })
      socket.off('connect', joinRoom)
      socket.off('existing_peers')
      socket.off('peer_joined')
      socket.off('room_offer')
      socket.off('room_answer')
      socket.off('room_ice')
      socket.off('peer_left')
      Object.keys(peersRef.current).forEach(removePeer)
    }
  }, [inCall, socket, user, sessionId])

  // ── 5. Media Toggle Actions ────────────────────────────────────────────────
  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
      }
    }
  }

  // ── 6. Disconnect & Chat Handlers ─────────────────────────────────────────
  const handleDisconnect = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    socket.emit('leave_video_room', { roomId: sessionId, userId: user._id })
    navigate(user?.role === 'trainer' || user?.role === 'wellness_coach' ? '/trainer/schedule' : '/dashboard/schedule')
  }

  const handleMessageClick = (peerId = null) => {
    const peerIds = Object.keys(peers)
    
    // If no peers, do nothing
    if (peerIds.length === 0) return

    // If specific peer selected (from dropdown) OR only 1 peer exists
    const targetPeerId = peerId || (peerIds.length === 1 ? peerIds[0] : null)

    if (targetPeerId) {
      const isTrainer = user?.role === 'trainer' || user?.role === 'wellness_coach'
      const chatUrl = isTrainer ? `/trainer/chat/${targetPeerId}` : `/dashboard/chat/${targetPeerId}`
      // Open in new tab so they don't leave the video call!
      window.open(chatUrl, '_blank')
      setShowChatMenu(false)
    } else {
      // Multiple peers, toggle menu
      setShowChatMenu(!showChatMenu)
    }
  }

  // ── Render States ─────────────────────────────────────────────────────────
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center text-gray-400">
        <Loader2 size={32} className="animate-spin text-[#F97316] mr-3" />
        <span>Verifying slot session permissions...</span>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl max-w-md">
          <h2 className="text-lg font-bold mb-2">Access Denied / Error</h2>
          <p className="text-sm">{errorMessage}</p>
        </div>
        <button
          onClick={() => navigate(user?.role === 'trainer' || user?.role === 'wellness_coach' ? '/trainer/schedule' : '/dashboard/schedule')}
          className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (isRequestingMedia) {
    return (
      <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center text-gray-400 px-6 text-center">
        <Loader2 size={32} className="animate-spin text-[#2563EB] mb-4" />
        <span className="text-lg font-bold text-white mb-2">Requesting Camera & Microphone</span>
        <span className="text-sm">Please click "Allow" on the browser prompt to join the workout.</span>
      </div>
    )
  }

  // A. LOBBY PREVIEW RENDER
  if (!inCall) {
    return (
      <div className="h-screen w-full bg-[#050810] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-black text-white">Lobby Setup</h1>
          <p className="text-gray-400">Prepare your camera and mic before starting group training.</p>

          {cameraError && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-lg text-sm text-left">
              Could not access camera/mic (it may be locked by another tab or missing). You can still join as a viewer.
            </div>
          )}

          <div className="relative aspect-video bg-[#0F172A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-gray-500 text-xs tracking-widest uppercase">
                Camera is muted
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/15'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full border transition-all ${isVideoOff ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/15'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          </div>

          <button
            onClick={() => setInCall(true)}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Join Call Session
          </button>
        </div>
      </div>
    )
  }

  // B. IN-CALL GRID RENDER
  return (
    <div className="h-screen w-full bg-[#050810] flex flex-col p-6 overflow-y-auto overflow-x-hidden">
      {/* Video Grid */}
      <div className="flex-1 grid gap-4 grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto w-full rounded-2xl">
        {/* Local Stream */}
        <div className="relative bg-[#0F172A] border border-white/5 rounded-2xl overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-semibold text-white">
            You ({user?.name})
          </div>
        </div>

        {/* Remote Streams or Waiting Message */}
        {Object.keys(peers).length === 0 && (
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl flex flex-col items-center justify-center aspect-video text-gray-500 text-sm">
            <Loader2 size={32} className="animate-spin text-gray-600 mb-3" />
            <span className="text-gray-400 font-medium">
              {user?.role === 'trainer' || user?.role === 'wellness_coach' 
                ? 'Waiting for clients to join...' 
                : 'Waiting for your trainer to join...'}
            </span>
          </div>
        )}

        {Object.entries(peers).map(([peerUserId, peerData]) => {
          if (!peerData.stream && !peerData.connected) {
            return (
              <div key={peerUserId} className="relative bg-[#0F172A] border border-white/5 rounded-2xl flex items-center justify-center aspect-video text-gray-500 text-sm">
                <Loader2 size={24} className="animate-spin text-gray-600 mr-2" />
                Connecting peer user...
              </div>
            )
          }

          if (!peerData.stream && peerData.connected) {
            return (
              <div key={peerUserId} className="relative bg-[#0F172A] border border-white/5 rounded-2xl flex flex-col items-center justify-center aspect-video text-gray-500 text-sm">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3 border border-white/5 shadow-lg">
                  <Users className="text-gray-400" size={32} />
                </div>
                <span className="font-medium text-gray-400">Peer Joined (No camera)</span>
              </div>
            )
          }

          return (
            <div key={peerUserId} className="relative bg-[#0F172A] border border-white/5 rounded-2xl overflow-hidden aspect-video">
              <video
                autoPlay
                playsInline
                ref={el => {
                  if (el) el.srcObject = peerData.stream
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-semibold text-white">
                {peerData.userName || 'Peer User'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Control bar */}
      <div className="h-20 shrink-0 flex items-center justify-center gap-4 mt-4">
        <button
          onClick={toggleMute}
          className={`p-3.5 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/15'}`}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3.5 rounded-full border transition-all ${isVideoOff ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/15'}`}
        >
          {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        {/* Chat Button */}
        <div className="relative">
          <button
            onClick={() => handleMessageClick()}
            disabled={Object.keys(peers).length === 0}
            className={`p-3.5 rounded-full border transition-all ${Object.keys(peers).length === 0 ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed' : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700 shadow-lg'}`}
          >
            <MessageSquare size={22} />
          </button>

          {/* Multiple Peers Chat Dropdown */}
          {showChatMenu && Object.keys(peers).length > 1 && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-white/5 text-xs font-semibold text-gray-400">
                Message Participant
              </div>
              <div className="max-h-48 overflow-y-auto">
                {Object.entries(peers).map(([pId, pData]) => (
                  <button
                    key={pId}
                    onClick={() => handleMessageClick(pId)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-white/5 transition-colors truncate"
                  >
                    {pData.userName || 'Peer User'}
                  </button>
                ))}
              </div>
              {/* Arrow pointer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[#0F172A]">
                <ChevronUp size={16} className="rotate-180 drop-shadow-lg" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDisconnect}
          className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  )
}
