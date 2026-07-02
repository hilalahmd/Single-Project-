import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/users/user.routes.js'
import trainerRoutes from './modules/trainers/trainer.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import foodAiRoutes from './modules/food-ai/foodai.routes.js'








dotenv.config()
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














app.get('/', (req, res) => {
  res.json({ message: 'FitForge API running 🔥' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`)
})