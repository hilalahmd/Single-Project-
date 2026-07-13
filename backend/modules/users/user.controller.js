import User from './user.model.js'
import Trainer from '../trainers/trainer.model.js'
import { Conversation } from '../chat/chat.model.js'

// ─── Assign a trainer to the user + update subscription ─────────────────────
export const assignTrainer = async (req, res) => {
  try {
    const { trainerId, plan, paymentToken } = req.body

    if (!trainerId || !plan) {
      return res.status(400).json({ message: 'trainerId and plan are required' })
    }

    // SECURITY: Prevent unauthorized subscription upgrades
    if (plan !== 'free' && !paymentToken) {
      return res.status(403).json({ 
        message: 'Payment verification failed. A valid payment token is required for paid plans.' 
      })
    }

    // Validate trainer exists
    const trainer = await Trainer.findById(trainerId).populate('userId', 'name email avatar')
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    // Update user: set assignedTrainer + subscriptionTier
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { assignedTrainer: trainerId, subscriptionTier: plan },
      { new: true }
    ).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
      .populate({ path: 'assignedTrainer', populate: { path: 'userId', select: 'name email avatar' } })

    // Auto-create a chat conversation between client and trainer (if not exists)
    const participants = [req.user._id, trainer.userId._id]
    const existingChat = await Conversation.findOne({ participants: { $all: participants } })
    if (!existingChat) {
      await Conversation.create({ participants })
    }

    res.json({
      message: 'Trainer assigned successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        assignedTrainer: {
          _id: trainer._id,
          name: trainer.userId.name,
          trainerUserId: trainer.userId._id
        }
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const updateProfile = async (req, res) => {
  try {
    const { name, preferredLanguage, languagesSpoken } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, preferredLanguage, languagesSpoken },
      { new: true }
    ).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')

    res.json({ message: 'Profile updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}



export const updateBodyMetrics = async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, goal, calorieTarget } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bodyMetrics: { height, weight, age, gender, activityLevel, goal, calorieTarget } },
      { new: true }
    ).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')

    res.json({ message: 'Body metrics updated', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}