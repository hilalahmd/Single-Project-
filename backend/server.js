import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './modules/auth/auth.routes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'FitForge API running 🔥' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`)
})