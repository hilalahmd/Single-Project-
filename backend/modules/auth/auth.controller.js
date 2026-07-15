import User from '../users/user.model.js'
import Trainer from '../trainers/trainer.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { generateOTP, sendOTPEmail } from './auth.service.js'

/**
 * register — creates a new user account and sends an OTP email for verification.
 * Validates required fields and email format before touching the DB.
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate required fields with clean 400 errors
    // WHY: Mongoose 'required' throws raw 500 errors without this check
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name, email, password: hashedPassword, role, otp, otpExpiry
    })

    await sendOTPEmail(email, otp)

    res.status(201).json({ 
      message: 'OTP sent to your email',
      userId: user._id
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save()

    res.json({ message: 'Password reset successful' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 mins
    await user.save()

    const resetLink = `http://localhost:5173/auth/reset-password?token=${resetToken}`

    await sendOTPEmail(email, `Reset your password by clicking this link: ${resetLink}`)

    res.json({ message: 'Password reset link sent to your email' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    res.json({ message: 'Email verified successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    let isManagerUser = false
    
    if (!user) {
      const Manager = (await import('../manager/manager.model.js')).default
      user = await Manager.findOne({ email })
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      isManagerUser = true
    }

    if (!isManagerUser && !user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    let trainerData = null
    // --- Trainer Approval Status Check ---
    if (user.role === 'trainer' || user.role === 'wellness_coach') {
      const trainer = await Trainer.findOne({ userId: user._id }).sort({ createdAt: -1 })
      trainerData = trainer
      
      if (!trainer) {
        // If a trainer has registered a User but hasn't completed Trainer Registration yet,
        // we DO NOT block them. We need to issue a JWT so they can call /complete-registration.
        // We will just let them pass. Their trainerStatus will be 'incomplete'.
      }

      if (trainer && trainer.status === 'pending') {
        return res.status(403).json({ message: 'Admin approval is pending', status: 'pending' })
      }
      
      if (trainer && trainer.status === 'suspended') {
        return res.status(403).json({ message: 'Your trainer account has been suspended.', status: 'suspended' })
      }
      
      // If status === 'rejected', we DO NOT block them! 
      // We allow them to login so the frontend can redirect them to the resubmit page.
      // (The frontend TrainerLoginPage will check the status and handle the redirect).
    }
    // -------------------------------------

    const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)

res.cookie('jwt', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
})

// Build assignedTrainer data if exists
let assignedTrainerData = null
if (user.assignedTrainer) {
  const trainer = await Trainer.findById(user.assignedTrainer).populate('userId', 'name email avatar')
  if (trainer) {
    assignedTrainerData = {
      _id: trainer._id,
      name: trainer.userId?.name || 'Coach',
      trainerUserId: trainer.userId?._id,
      profilePhoto: trainer.profilePhoto || trainer.userId?.avatar || null
    }
  }
}

res.json({ 
  message: 'Login successful',
  token: token, 
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    assignedTrainer: assignedTrainerData,
    trainerStatus: trainerData ? trainerData.status : null,
    rejectionReason: trainerData ? trainerData.rejectionReason : null
  } 
})

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
  res.clearCookie('jwt')
  res.json({ message: 'Logged out successfully' })
}

export const getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select('-password -otp -otpExpiry')
    
    if (!user) {
      const Manager = (await import('../manager/manager.model.js')).default
      user = await Manager.findById(req.user._id).select('-password')
      if (!user) return res.status(404).json({ message: 'User not found' })
    }
    
    // Convert to plain object to attach custom assignedTrainerData
    const userObj = user.toObject()

    if (user.role && user.role !== 'manager' && user.role !== 'admin') {
      user.lastActive = new Date()
      await user.save({ validateModifiedOnly: true }).catch(err => console.error('Failed to update lastActive:', err))
    }

    if (user.assignedTrainer) {
      const trainer = await Trainer.findById(user.assignedTrainer).populate('userId', 'name email avatar')
      if (trainer) {
        userObj.assignedTrainer = {
          _id: trainer._id,
          name: trainer.userId?.name || 'Coach',
          trainerUserId: trainer.userId?._id,
          profilePhoto: trainer.profilePhoto || trainer.userId?.avatar || null
        }
      }
    }

    res.json(userObj)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}