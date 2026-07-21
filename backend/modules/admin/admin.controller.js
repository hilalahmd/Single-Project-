import Trainer from "../trainers/trainer.model.js";
import User from '../users/user.model.js';
import bcrypt from 'bcryptjs';
import { logAuditAction } from '../../shared/utils/audit.logger.js';

export const approveTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' })
    if (trainer.status === 'approved') return res.status(400).json({ message: 'Trainer is already approved' })

    trainer.status = 'approved'
    trainer.approvedBy = req.user._id
    trainer.approvedAt = new Date()
    await trainer.save()

    await logAuditAction('APPROVE_TRAINER', req.user._id, trainer.userId, 'Approved trainer application')

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

    await logAuditAction('REJECT_TRAINER', req.user._id, trainer.userId, `Rejected trainer application. Reason: ${reason}`)

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

    await logAuditAction('SUSPEND_TRAINER', req.user._id, trainer.userId, `Suspended trainer. Reason: ${reason}`)

    res.json({ message: 'Trainer suspended', trainer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * getAllTrainers — returns all trainer applications for the admin panel.
 * Uses .lean() since we only read data, never call .save() on the results.
 */
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean()
    res.json(trainers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * getAdminDashboardStats — returns key platform metrics for the admin home screen.
 * Uses .lean() on read-only queries for performance.
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' })
    const activeTrainers = await Trainer.countDocuments({ status: 'approved' })
    const monthlyRevenue = totalUsers * 2000 // Mock until Stripe is integrated

    const recentRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name role createdAt status')
      .lean()

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || 'All Roles';
    const status = req.query.status || 'All Statuses';

    const filter = { role: { $ne: 'admin' } };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role !== 'All Roles') {
      const targetRole = role.toLowerCase() === 'client' ? 'user' : role.toLowerCase();
      filter.role = targetRole;
    }
    
    if (status !== 'All Statuses') {
      filter.status = status.toLowerCase();
    }

    const skip = (page - 1) * limit;

    const [users, totalRecords] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * getPendingPayouts — returns trainer payout data for the admin panel.
 */
export const getPendingPayouts = async (req, res) => {
  try {
    const approvedTrainers = await Trainer.find({ status: 'approved' })
      .populate('userId', 'name email')
      .lean()

    if (!approvedTrainers.length) {
      return res.json([])
    }

    const trainerIds = approvedTrainers.map(t => t._id)
    const clientCounts = await User.aggregate([
      { $match: { assignedTrainer: { $in: trainerIds }, role: 'user' } },
      { $group: { _id: '$assignedTrainer', count: { $sum: 1 } } }
    ])

    const countMap = {}
    for (const row of clientCounts) {
      countMap[row._id.toString()] = row.count
    }

    const payouts = approvedTrainers
      .map(trainer => {
        const activeClientsCount = countMap[trainer._id.toString()] || 0
        const ptPrice = trainer.pricing?.personalTrainingMonthly || 0
        const currentGross = activeClientsCount * ptPrice
        const currentNet = Math.round(currentGross * 0.85)
        if (currentNet <= 0) return null
        return {
          _id: trainer._id,
          name: trainer.userId?.name || 'Unknown',
          req: currentNet,
          bank: 'Bank on File',
          status: 'Pending',
          date: new Date().toLocaleDateString()
        }
      })
      .filter(Boolean)

    res.json(payouts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // Toggle status
    user.status = user.status === 'active' ? 'suspended' : 'active'
    await user.save()
    
    const actionName = user.status === 'suspended' ? 'SUSPEND_USER' : 'ACTIVATE_USER'
    await logAuditAction(actionName, req.user._id, user._id, `Changed user status to ${user.status}`)

    res.json({ message: `User ${user.status} successfully`, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    await logAuditAction('SUSPEND_USER', req.user._id, user._id, 'Deleted user account')

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
