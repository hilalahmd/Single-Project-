import Trainer from "../trainers/trainer.model.js";
import User from '../users/user.model.js';
import bcrypt from 'bcryptjs';

export const approveTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' })
    if (trainer.status === 'approved') return res.status(400).json({ message: 'Trainer is already approved' })

    trainer.status = 'approved'
    trainer.approvedBy = req.user._id
    trainer.approvedAt = new Date()
    await trainer.save()

    res.json({ message: 'Trainer approved', trainer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const rejectTrainer = async (req, res) => {
  try {
    const { reason } = req.body
    if (!reason) return res.status(400).json({ message: 'Rejection reason is required' })
    
    const trainer = await Trainer.findById(req.params.id)
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' })
    if (trainer.status === 'rejected') return res.status(400).json({ message: 'Trainer is already rejected' })

    trainer.status = 'rejected'
    trainer.rejectionReason = reason
    trainer.reviewedBy = req.user._id
    trainer.reviewedAt = new Date()
    await trainer.save()

    res.json({ message: 'Trainer rejected', trainer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const suspendTrainer = async (req, res) => {
  try {
    const { reason } = req.body
    if (!reason) return res.status(400).json({ message: 'Suspension reason is required' })
    
    const trainer = await Trainer.findById(req.params.id)
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' })
    if (trainer.status === 'suspended') return res.status(400).json({ message: 'Trainer is already suspended' })

    trainer.status = 'suspended'
    trainer.reason = reason
    trainer.suspendedBy = req.user._id
    trainer.suspendedAt = new Date()
    await trainer.save()

    res.json({ message: 'Trainer suspended', trainer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
    res.json(trainers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' })
    const activeTrainers = await Trainer.countDocuments({ status: 'approved' })
    
    // Since we don't have Stripe yet, we calculate a mock revenue 
    // assuming an average of ₹2000 per user. We will change this later!
    const monthlyRevenue = totalUsers * 2000 

    // Fetch the 5 newest users who registered
    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name role createdAt status')

    res.json({
      totalUsers,
      activeTrainers,
      monthlyRevenue,
      recentRegistrations
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users (both clients and trainers) except superadmins
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── MANAGER MANAGEMENT ──

export const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 })
    res.json(managers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createManager = async (req, res) => {
  try {
    const { name, email, adminRole } = req.body
    
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash('defaultPassword123!', 10)

    const newManager = new User({
      name,
      email,
      password: hashedPassword, // Provide a hashed default password for new managers
      role: 'admin',
      adminRole: adminRole || 'Support Manager',
      status: 'active'
    })

    await newManager.save()
    res.json({ message: 'Manager created successfully', manager: newManager })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateManagerStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, adminRole } = req.body
    
    // Prevent self-suspension/modification if needed
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: 'You cannot modify your own admin account.' })
    }

    const manager = await User.findById(id)
    if (!manager || manager.role !== 'admin') {
      return res.status(404).json({ message: 'Manager not found' })
    }

    if (status) manager.status = status
    if (adminRole) manager.adminRole = adminRole

    await manager.save()
    res.json({ message: 'Manager updated successfully', manager })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params
    
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' })
    }

    const manager = await User.findByIdAndDelete(id)
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' })
    }

    res.json({ message: 'Manager deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPendingPayouts = async (req, res) => {
  try {
    const activeTrainers = await Trainer.find({ status: 'approved' }).populate('userId', 'name email')
    
    const payouts = []
    
    for (let trainer of activeTrainers) {
      const activeClientsCount = await User.countDocuments({
        assignedTrainer: trainer._id,
        role: 'user'
      })
      
      const ptPrice = trainer.pricing?.personalTrainingMonthly || 0
      const currentGross = activeClientsCount * ptPrice
      const currentNet = Math.round(currentGross * 0.85)

      if (currentNet > 0) {
        payouts.push({
          _id: trainer._id,
          name: trainer.userId?.name || 'Unknown',
          req: currentNet,
          bank: 'Bank on File',
          status: 'Pending',
          date: new Date().toLocaleDateString()
        })
      }
    }

    res.json(payouts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
