import Session from './session.model.js'
import Trainer from '../trainers/trainer.model.js'
import User from '../users/user.model.js'

// @desc    Get upcoming available slots for booking
// @route   GET /api/v1/sessions/slots
// @access  Private (Client)
export const getAvailableSlots = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('assignedTrainer').lean()
    if (!user?.assignedTrainer) {
      return res.status(404).json({ success: false, message: 'No trainer assigned to your account.' })
    }

    const trainerId = user.assignedTrainer

    // Smart Logic: Generate dynamic 3 days of slots (10 AM, 2 PM, 4 PM)
    const availableSlots = []
    let slotId = 1
    const baseHours = [10, 14, 16] 

    for (let i = 1; i <= 3; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      date.setMinutes(0, 0, 0)
      
      const dayName = i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' })

      for (const hour of baseHours) {
        date.setHours(hour)
        const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        
        availableSlots.push({
          id: slotId++,
          day: dayName,
          time: timeString,
          exactDate: new Date(date) // Real timestamp for DB
        })
      }
    }

    // Filter out slots that are already booked by other clients!
    const upcomingSessions = await Session.find({
      trainerId,
      startTime: { $gte: new Date() },
      status: 'scheduled'
    })

    const bookedTimes = upcomingSessions.map(session => session.startTime.getTime())
    const filteredSlots = availableSlots.filter(slot => !bookedTimes.includes(slot.exactDate.getTime()))

    res.status(200).json({ success: true, count: filteredSlots.length, data: filteredSlots })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Book a new video session
// @route   POST /api/v1/sessions
// @access  Private (Client)
export const bookSession = async (req, res) => {
  try {
    const { startTime, sessionType, notes } = req.body
    
    if (!startTime) {
      return res.status(400).json({ success: false, message: 'Start time is required to book a session.' })
    }

    const user = await User.findById(req.user._id).select('assignedTrainer').lean()
    
    // No longer falls back to a hardcoded test ID — that caused bookings to be created
    // against a non-existent trainer, which broke the trainer dashboard.
    if (!user?.assignedTrainer) {
      return res.status(400).json({ success: false, message: 'You must be assigned to a trainer before booking a session.' })
    }

    const trainerId = user.assignedTrainer

    const trainerUser = await User.findById(trainerId).select('role').lean();
    if (trainerUser?.role === 'wellness_coach') {
      return res.status(403).json({ success: false, message: 'Wellness coaches do not offer live video sessions.' })
    }

    const startDate = new Date(startTime)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour

    // Double booking prevention
    const existingSession = await Session.findOne({
      trainerId,
      startTime: startDate,
      status: 'scheduled'
    })

    if (existingSession) {
      return res.status(400).json({ success: false, message: 'Sorry, this slot just got booked.' })
    }

    const session = await Session.create({
      clientId: req.user._id,
      trainerId,
      sessionType: sessionType || 'Weekly Check-in',
      startTime: startDate,
      endTime: endDate,
      notes: notes || '',
      meetingLink: 'https://zoom.us/j/fitforge' + Math.floor(Math.random() * 100000)
    })

    res.status(201).json({ success: true, data: session })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get user's active/upcoming sessions
// @route   GET /api/v1/sessions
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const query = req.user.role === 'user' 
      ? { clientId: req.user._id } 
      : { trainerId: req.user._id }
      
    // Populate vachu Trainer/Client details koodi fetch cheyyunnu
    const sessions = await Session.find(query)
      .populate('trainerId', 'userId role bio')
      .populate('clientId', 'name email')
      .sort({ startTime: 1 })

    res.status(200).json({ success: true, count: sessions.length, data: sessions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
