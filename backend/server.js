import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/db.js'
import jwt from 'jsonwebtoken'
import { Conversation } from './modules/chat/chat.model.js'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/users/user.routes.js'
import trainerRoutes from './modules/trainers/trainer.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import managerRoutes from './modules/manager/manager.routes.js'
import reportRoutes from './modules/reports/report.routes.js'
import foodAiRoutes from './modules/food-ai/foodai.routes.js'
import transformationRoutes from './modules/transformation/transformation.routes.js'
import sessionRoutes from './modules/video/session.routes.js'
import workoutRoutes from './modules/workout/workout.routes.js'
import chatRoutes from './modules/chat/chat.routes.js'
import nutritionRoutes from './modules/nutrition/nutrition.routes.js'
import progressRoutes from './modules/progress/progress.routes.js'
import scheduleRoutes from './modules/schedule/schedule.routes.js'
import ragRoutes from './modules/rag/rag.routes.js'
import { initializeRAG } from './modules/rag/rag.service.js'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

dotenv.config()
connectDB()

const app = express()

// helmet — sets ~15 security HTTP headers automatically:
// X-Content-Type-Options, X-Frame-Options, HSTS, Content-Security-Policy, etc.
// WHY: without these headers the browser has no instructions to prevent
//      clickjacking, MIME sniffing, and cross-origin data leaks.
// helmet was already installed (in package.json) but was never imported or used.
app.use(helmet({ contentSecurityPolicy: false })) // CSP disabled: frontend and API share localhost in dev
app.use(morgan('dev')) // HTTP request logging — shows method, path, status, response time
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))


app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// io object-ne every request-ilum available aakkunnu
// Ithuvazhi controllers-il req.io.to(...).emit(...) use cheyyam
app.use((req, res, next) => { req.io = io; next() })

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/trainers', trainerRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/managers', managerRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/food-ai', foodAiRoutes)
app.use('/api/transformation', transformationRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/schedule', scheduleRoutes)
app.use('/api/ai', ragRoutes)



app.get('/', (req, res) => {
  res.json({ message: 'FitForge API running 🔥' })
})

// 404 handler — catches any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler — NEVER sends stack traces to the client in production
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }) // Only expose stack in development
  })
})

// ==========================================
// SOCKET.IO REAL-TIME CHAT SETUP
// ==========================================
// 1. Express-ne oru pure HTTP server aakki maattunnu
const server = http.createServer(app)

// 2. Aa server-ilekku Socket.io connect cheyyunnu (CORS set cheyunnu, frontend url allow cheyyan)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
})

const onlineUsers = new Map() // { userId -> socket.id }
const videoRooms = new Map() // roomId -> Map(userId -> socketId)
const messageRateLimits = new Map() // socket.id -> lastMessageTimestamp

// Auth Middleware for Socket.IO
io.use((socket, next) => {
  try {
    const cookieHeader = socket.request.headers.cookie
    if (!cookieHeader) return next(new Error('Authentication error: No cookies'))

    const tokenMatch = cookieHeader.match(/jwt=([^;]+)/)
    if (!tokenMatch) return next(new Error('Authentication error: No token'))

    const token = tokenMatch[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.user = decoded
    next()
  } catch (error) {
    next(new Error('Authentication error: Invalid token'))
  }
})

// 3. Oru user frontend-il ninnu app open aakkumbol ee function work aavum (Phone edukkunnu)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id, 'User ID:', socket.user?.userId)

  // 4. User oru prathyeka chat room-ilekku join cheyumbol
  socket.on('join_chat', async (chatId) => {
    try {
      // Validate that the user is actually a participant of this chat room
      // Our chat room ID is generated as "id1_id2", so we can just check if it contains the user's ID
      if (!chatId || typeof chatId !== 'string' || !chatId.includes(socket.user.userId)) {
        return socket.emit('error_message', { message: 'Unauthorized to join this room' })
      }
      
      socket.join(chatId) // Aa ID ulla room-ilekku user-ne add cheyyunnu
      console.log(`User ${socket.user.userId} Joined Chat Room: ${chatId}`)
    } catch (err) {
      console.error('Room join error:', err)
    }
  })

  // 5. Frontend-il ninnu oral message ayakkumbol
  socket.on('send_message', (data) => {
    // RATE LIMITING / THROTTLING
    const now = Date.now()
    const lastMsgTime = messageRateLimits.get(socket.id) || 0
    if (now - lastMsgTime < 500) { // Max 1 message per 500ms
      return socket.emit('error_message', { message: 'You are sending messages too fast.' })
    }
    messageRateLimits.set(socket.id, now)

    console.log(`Message sent to Room: ${data.chatId}`)
    // Aa message, aa room-il ulla matte aalkku mathram (socket.to) ayachu kodukkunnu (emit)
    socket.to(data.chatId).emit('receive_message', data)

    // Receiver online aano ennu check cheyyunnu (Delivery tick)
    if (data.receiverId && onlineUsers.has(data.receiverId)) {
      // Receiver online aanenkil, sender-kku 'delivered' aayi ennu message kodukkunnu
      socket.emit('message_delivered', { messageId: data._id, chatId: data.chatId })
    }
  })

  // Blue tick update cheyyan
  socket.on('mark_messages_read', ({ senderId, chatId }) => {
    // Sender-kku avaru ayacha message receiver read aakki ennu ariyikkunnu
    socket.to(senderId).emit('messages_read_by_receiver', { chatId })
  })

  // ==========================================
  // WEBRTC VIDEO CALL SIGNALING
  // ==========================================

  // User login aakumbol swantham room-il join cheyyunnu
  socket.on('setup_user', (userId) => {
    socket.join(userId)
    onlineUsers.set(userId, socket.id)
    console.log(`User registered for calls & online: ${userId}`)
  })

  // Oral call cheyyunnu (Ringing)
  socket.on('initiate_call', ({ receiverId, callerData }) => {
    console.log(`Call initiated to ${receiverId} from ${callerData.name}`)
    // receiver-nte swantham room-ilekku ring cheyyunnu
    socket.to(receiverId).emit('incoming_call', callerData)
  })

  // Call edukkunnu
  socket.on('accept_call', ({ callerId }) => {
    socket.to(callerId).emit('call_accepted')
  })

  // Call cut cheyyunnu / Reject cheyyunnu
  socket.on('reject_call', ({ callerId }) => {
    socket.to(callerId).emit('call_rejected')
  })

  // Call End cheyyunnu (Idakku vechu)
  socket.on('end_call', ({ targetId }) => {
    socket.to(targetId).emit('call_ended')
  })

  // WebRTC Data Exchange (Audio/Video connect aavan ulla technical data)
  socket.on('webrtc_offer', ({ receiverId, offer }) => {
    socket.to(receiverId).emit('webrtc_offer', { offer })
  })

  socket.on('webrtc_answer', ({ callerId, answer }) => {
    socket.to(callerId).emit('webrtc_answer', { answer })
  })

  socket.on('webrtc_ice_candidate', ({ targetId, candidate }) => {
    socket.to(targetId).emit('webrtc_ice_candidate', { candidate })
  })

  // ==========================================
  // GROUP VIDEO CALL SIGNALING (SCHEDULED)
  // ==========================================

  socket.on('join_video_room', ({ roomId, userId, userName }) => {
    socket.join(roomId)
    
    if (!videoRooms.has(roomId)) {
      videoRooms.set(roomId, new Map())
    }
    const room = videoRooms.get(roomId)
    room.set(userId, { socketId: socket.id, userName })

    // Notify the user who just joined about all existing peers
    const existingPeersList = []
    room.forEach((peerData, uId) => {
      if (uId !== userId) {
        existingPeersList.push({ userId: uId, socketId: peerData.socketId, userName: peerData.userName })
      }
    })
    socket.emit('existing_peers', existingPeersList)

    // Notify all existing peers that a new user joined
    room.forEach((peerData, uId) => {
      if (uId !== userId) {
        socket.to(peerData.socketId).emit('peer_joined', { userId, socketId: socket.id, userName })
      }
    })
    console.log(`[Video] User ${userId} joined room ${roomId}`)
  })

  socket.on('request_peers', ({ roomId, userId }) => {
    const room = videoRooms.get(roomId)
    if (!room) {
      console.log(`[Video Debug] request_peers failed. Room ${roomId} does not exist.`)
      return
    }
    
    console.log(`[Video Debug] request_peers for Room ${roomId}. Total sockets: ${room.size}. Requesting User: ${userId}`)
    const existingPeersList = []
    room.forEach((peerData, uId) => {
      console.log(`[Video Debug] Inside Room ${roomId} -> User: ${uId}, Socket: ${peerData.socketId}`)
      if (uId !== userId) {
        existingPeersList.push({ userId: uId, socketId: peerData.socketId, userName: peerData.userName })
      }
    })
    console.log(`[Video Debug] Returning ${existingPeersList.length} peers to User ${userId}`)
    socket.emit('existing_peers', existingPeersList)
  })

  socket.on('room_offer', ({ targetUserId, offer, fromUserId, roomId }) => {
    const room = videoRooms.get(roomId)
    if (room && room.has(targetUserId)) {
      socket.to(room.get(targetUserId).socketId).emit('room_offer', { offer, fromUserId })
    }
  })

  socket.on('room_answer', ({ targetUserId, answer, fromUserId, roomId }) => {
    const room = videoRooms.get(roomId)
    if (room && room.has(targetUserId)) {
      socket.to(room.get(targetUserId).socketId).emit('room_answer', { answer, fromUserId })
    }
  })

  socket.on('room_ice', ({ targetUserId, candidate, fromUserId, roomId }) => {
    const room = videoRooms.get(roomId)
    if (room && room.has(targetUserId)) {
      socket.to(room.get(targetUserId).socketId).emit('room_ice', { candidate, fromUserId })
    }
  })

  socket.on('leave_video_room', ({ roomId, userId }) => {
    socket.leave(roomId)
    const room = videoRooms.get(roomId)
    if (room) {
      room.delete(userId)
      if (room.size === 0) videoRooms.delete(roomId)
    }
    socket.to(roomId).emit('peer_left', { userId })
  })

  // 6. User app close cheyyumbol (Phone  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    messageRateLimits.delete(socket.id)
    
    // Find user and remove from online map
    for (const [userId, socId] of onlineUsers.entries()) {
      if (socId === socket.id) {
        onlineUsers.delete(userId)
      }
    }
  })
})

// 7. Pazhaya app.listen-nu pakaram puthiya server.listen kodukkunnu
initializeRAG() // Ithu Server on aavumbol thanne text vayichu memory-il save aakkum
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server & Socket running on port ${PORT} 🔥`)
})
