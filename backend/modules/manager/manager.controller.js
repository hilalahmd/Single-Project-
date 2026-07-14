import Manager from './manager.model.js'
import User from '../users/user.model.js'
import Report from '../reports/report.model.js'
import Trainer from '../trainers/trainer.model.js'
import Session from '../video/session.model.js'
import AuditLog from '../admin/audit.model.js'
import bcrypt from 'bcryptjs'

export const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find({}).select('-password').sort({ createdAt: -1 }).lean()
    res.json(managers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' })
    }
    
    const existing = await Manager.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newManager = new Manager({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'manager',
      status: 'active'
    })

    await newManager.save()
    const { password: _, ...managerData } = newManager.toObject()
    res.json({ message: 'Manager created successfully', manager: managerData })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateManagerStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const manager = await Manager.findById(id)
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' })
    }

    if (status) manager.status = status

    await manager.save()
    res.json({ message: 'Manager updated successfully', manager })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params
    const manager = await Manager.findByIdAndDelete(id)
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' })
    }

    res.json({ message: 'Manager deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getManagerDashboardStats = async (req, res) => {
  try {
    const pendingReportsCount = await Report.countDocuments({ status: 'pending' })
    const recentReports = await Report.find({ status: 'pending' })
      .populate('reporter', 'name email')
      .populate({
        path: 'reportedTrainer',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

    const inactiveUsers = await User.find({ 
      role: 'user',
      lastActive: { $lt: tenDaysAgo }
    })
      .select('name email lastActive status')
      .sort({ lastActive: 1 })
      .limit(20)
      .lean()

    const pendingTrainersCount = await Trainer.countDocuments({ status: 'pending' })
    const approvedTrainersCount = await Trainer.countDocuments({ status: 'approved' })
    const rejectedTrainersCount = await Trainer.countDocuments({ status: 'rejected' })

    res.json({
      pendingReportsCount,
      recentReports,
      inactiveUsers,
      trainerStats: {
        pending: pendingTrainersCount,
        approved: approvedTrainersCount,
        rejected: rejectedTrainersCount
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const sendNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body
    if (!userId || !title || !body) {
      return res.status(400).json({ message: 'userId, title, and body are required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // SIMULATED FIREBASE PUSH NOTIFICATION
    console.log(`\n[FIREBASE MOCK] Sending Push Notification to User: ${user.name} (${user.email})`)
    console.log(`[FIREBASE MOCK] Title: ${title}`)
    console.log(`[FIREBASE MOCK] Body: ${body}\n`)

    // In a real implementation, you would use:
    // admin.messaging().send({ token: user.fcmToken, notification: { title, body } })

    res.json({ message: 'Notification sent successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * getMonitoredTrainers — Fetches all approved trainers for the Manager Monitoring dashboard.
 * Includes basic stats for the table view.
 */
export const getMonitoredTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({ status: 'approved' })
      .populate('userId', 'name email avatar')
      .lean()
      
    // Fetch active clients count for each trainer
    const trainerIds = trainers.map(t => t._id)
    const clientCounts = await User.aggregate([
      { $match: { assignedTrainer: { $in: trainerIds }, role: 'user' } },
      { $group: { _id: '$assignedTrainer', count: { $sum: 1 } } }
    ])
    
    const countMap = {}
    clientCounts.forEach(c => { 
      if (c._id) {
        countMap[String(c._id)] = c.count 
      }
    })
    
    const mappedTrainers = trainers.map(trainer => ({
      ...trainer,
      activeClientsCount: countMap[String(trainer._id)] || 0
    }))
    
    res.json(mappedTrainers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * getTrainerMonitorDetails — Fetches deep analytics for a specific trainer, 
 * including their Audit Logs and Session Attendance records.
 */
export const getTrainerMonitorDetails = async (req, res) => {
  try {
    const { id } = req.params
    const trainer = await Trainer.findById(id).populate('userId', 'name email avatar').lean()
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    // 1. Fetch Audit Logs involving this trainer's user ID (safe check for userId)
    const targetUserId = trainer.userId ? trainer.userId._id : null;
    const auditLogs = targetUserId 
      ? await AuditLog.find({ targetUser: targetUserId })
          .populate('adminId', 'name')
          .sort({ createdAt: -1 })
          .lean()
      : [];
      
    // 2. Fetch Session Attendance Stats
    const sessionStatsAgg = await Session.aggregate([
      { $match: { trainerId: trainer._id } },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
      }}
    ])
    
    const attendanceStats = {
      completed: 0,
      scheduled: 0,
      cancelled: 0,
      'no-show': 0,
      total: 0
    }
    
    sessionStatsAgg.forEach(stat => {
      attendanceStats[stat._id] = stat.count
      attendanceStats.total += stat.count
    })
    
    // Calculate attendance rate (completed vs total past sessions)
    const pastSessions = attendanceStats.completed + attendanceStats['no-show'] + attendanceStats.cancelled
    const attendanceRate = pastSessions > 0 
      ? Math.round((attendanceStats.completed / pastSessions) * 100) 
      : 100
      
    res.json({
      trainer,
      auditLogs,
      attendanceStats,
      attendanceRate
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
