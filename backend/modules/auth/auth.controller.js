import User from '../users/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { generateOTP, sendOTPEmail } from './auth.service.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

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

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // if (!user.isVerified) {
    //   return res.status(401).json({ message: 'Please verify your email first' })
    // }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

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

res.json({ 
  message: 'Login successful',
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscriptionTier: user.subscriptionTier
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
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiry')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}