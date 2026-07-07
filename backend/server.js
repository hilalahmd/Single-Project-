
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/users/user.routes.js'
import trainerRoutes from './modules/trainers/trainer.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import foodAiRoutes from './modules/food-ai/foodai.routes.js'
import transformationRoutes from './modules/transformation/transformation.routes.js'
import sessionRoutes from './modules/video/session.routes.js'
import workoutRoutes from './modules/workout/workout.routes.js'
import chatRoutes from './modules/chat/chat.routes.js'



import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')





dotenv.config()
console.log("TESTING ENV LOAD: HUGGINGFACE_API_KEY exists?", !!process.env.HUGGINGFACE_API_KEY);
connectDB()

const app = express()

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))







app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())







app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/trainers', trainerRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/food-ai', foodAiRoutes)

app.use('/api/transformation', transformationRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/chat', chatRoutes)





app.get('/', (req, res) => {
  res.json({ message: 'FitForge API running 🔥' })
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
    methods: ["GET", "POST"]
  }
})

// 3. Oru user frontend-il ninnu app open aakkumbol ee function work aavum (Phone edukkunnu)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // 4. User oru prathyeka chat room-ilekku join cheyumbol
  socket.on('join_chat', (chatId) => {
    socket.join(chatId) // Aa ID ulla room-ilekku user-ne add cheyyunnu
    console.log(`User Joined Room: ${chatId}`)
  })

  // 5. Frontend-il ninnu oral message ayakkumbol
  socket.on('send_message', (data) => {
    // Aa message, aa room-il ulla matte aalkku mathram (socket.to) ayachu kodukkunnu (emit)
    socket.to(data.chatId).emit('receive_message', data)
  })

  // 6. User app close cheyyumbol (Phone cut cheyyunnu)
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// 7. Pazhaya app.listen-nu pakaram puthiya server.listen kodukkunnu
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server & Socket running on port ${PORT} 🔥`)
})
