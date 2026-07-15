import Trainer from './trainer.model.js'
import User from '../users/user.model.js'
import mongoose from 'mongoose'
import { uploadFile } from '../../shared/services/storage.service.js'
import { Conversation, Message } from '../chat/chat.model.js'
import Session from '../video/session.model.js'



export const getTrainers = async (req, res) => {
  try {
    const { language } = req.query

    const filter = { status: 'approved' }
    if (language) {
      filter.languagesSpoken = language
    }

    const trainers = await Trainer.find(filter)
      .populate('userId', 'name email avatar')
      .sort({ rating: -1 })
      .lean()

    // Fallback mock data if database is empty so the frontend can be tested
    if (trainers.length === 0) {
      return res.json([
        {
          _id: 'mock_trainer_001',
          userId: { name: 'Sarah Connor', email: 'sarah@example.com', avatar: '' },
          role: 'wellness_coach',
          languagesSpoken: ['English', 'Malayalam'],
          rating: 4.8,
          reviewCount: 42,
          specialties: ['Yoga', 'Mindfulness', 'Nutrition']
        },
        {
          _id: 'mock_trainer_002',
          userId: { name: 'John Rambo', email: 'john@example.com', avatar: '' },
          role: 'trainer',
          languagesSpoken: ['English', 'Hindi'],
          rating: 4.9,
          reviewCount: 88,
          specialties: ['Bodybuilding', 'Crossfit']
        }
      ]);
    }

    res.json(trainers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}




export const getTrainerById = async (req, res) => {
  try {
    // req.params.id = the trainer ID from the URL
    // Example: GET /api/trainers/6a423519f1e4a8217acfd778
    // req.params.id = "6a423519f1e4a8217acfd778"
    const trainer = await Trainer.findById(req.params.id)
      // populate = instead of just showing userId as an ID number,
      // go to Users collection and fetch name, email, avatar for that user
      // Like a JOIN in SQL
      .populate('userId', 'name email avatar')

    // If no trainer found with that ID → send 404 error
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    // Everything OK → send trainer data to frontend
    res.json(trainer)

  } catch (error) {
    // If anything goes wrong (invalid ID format, DB error etc)
    // Send 500 server error with the error message
    res.status(500).json({ message: error.message })
  }
}


export const completeTrainerRegistration = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { bio, specialties, languagesSpoken, wellnessPrice, personalPrice, experience } = req.body

    const existing = await Trainer.findOne({ userId: req.user._id }).session(session)
    if (existing) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: 'Trainer profile already exists' })
    }

    // Handle file uploads
    let profilePhotoUrl = ''
    let certificationsUrls = []

    if (req.files) {
      if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
        const result = await uploadFile(req.files['profilePhoto'][0], 'profiles')
        profilePhotoUrl = result.url
      }
      if (req.files['certifications']) {
        for (const file of req.files['certifications']) {
          const result = await uploadFile(file, 'certifications')
          certificationsUrls.push(result.url)
        }
      }
    }

    // Parse arrays from FormData (FormData sends them as comma-separated strings or multiple fields)
    const parsedSpecialties = typeof specialties === 'string' ? specialties.split(',').map(s=>s.trim()) : specialties
    const parsedLanguages = typeof languagesSpoken === 'string' ? languagesSpoken.split(',').map(s=>s.trim()) : languagesSpoken

    const trainer = await Trainer.create([{
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      bio,
      specialties: parsedSpecialties,
      languagesSpoken: parsedLanguages,
      experience: experience || 0,
      pricing: {
        wellnessMonthly: wellnessPrice || 0,
        personalTrainingMonthly: personalPrice || 0
      },
      profilePhoto: profilePhotoUrl,
      certifications: certificationsUrls,
      status: 'pending' 
    }], { session })

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({ 
      message: 'Trainer profile created. Pending admin approval.',
      trainer: trainer[0]
    })

  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ message: error.message })
  }
}

export const resubmitTrainerRegistration = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { bio, specialties, languagesSpoken, wellnessPrice, personalPrice, experience } = req.body

    const trainer = await Trainer.findOne({ userId: req.user._id }).session(session)
    if (!trainer) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ message: 'Trainer profile not found' })
    }

    if (trainer.status !== 'rejected') {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: 'Only rejected applications can be resubmitted.' })
    }

    // Handle file uploads (if new files are provided, we append or replace? Let's just replace or add depending on logic, but for simplicity, if files are provided we replace)
    if (req.files) {
      if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
        const result = await uploadFile(req.files['profilePhoto'][0], 'profiles')
        trainer.profilePhoto = result.url
      }
      if (req.files['certifications'] && req.files['certifications'].length > 0) {
        let newCerts = []
        for (const file of req.files['certifications']) {
          const result = await uploadFile(file, 'certifications')
          newCerts.push(result.url)
        }
        trainer.certifications = newCerts // overwrite old ones
      }
    }

    if (bio) trainer.bio = bio
    if (experience) trainer.experience = experience
    if (specialties) trainer.specialties = typeof specialties === 'string' ? specialties.split(',').map(s=>s.trim()) : specialties
    if (languagesSpoken) trainer.languagesSpoken = typeof languagesSpoken === 'string' ? languagesSpoken.split(',').map(s=>s.trim()) : languagesSpoken
    if (wellnessPrice) trainer.pricing.wellnessMonthly = wellnessPrice
    if (personalPrice) trainer.pricing.personalTrainingMonthly = personalPrice

    trainer.status = 'pending'
    trainer.rejectionReason = '' // clear rejection reason
    
    await trainer.save({ session })

    await session.commitTransaction()
    session.endSession()

    res.json({ message: 'Application resubmitted successfully. Pending admin review.', trainer })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ message: error.message })
  }
}


export const updateTrainerProfile = async (req, res) => {
  try {
    const { bio, specialties, languagesSpoken, wellnessPrice, personalPrice } = req.body

    const updateData = { bio }

    // Parse array fields if they come as strings from FormData
    if (specialties) {
      updateData.specialties = typeof specialties === 'string' ? specialties.split(',').map(s=>s.trim()) : specialties
    }
    
    if (languagesSpoken) {
      updateData.languagesSpoken = typeof languagesSpoken === 'string' ? languagesSpoken.split(',').map(s=>s.trim()) : languagesSpoken
    }

    if (wellnessPrice !== undefined || personalPrice !== undefined) {
      updateData.pricing = {
        wellnessMonthly: wellnessPrice !== undefined ? Number(wellnessPrice) : 0,
        personalTrainingMonthly: personalPrice !== undefined ? Number(personalPrice) : 0
      }
    }

    if (req.file) {
      const result = await uploadFile(req.file, 'profiles')
      updateData.profilePhoto = result.url
    }

    const trainer = await Trainer.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, upsert: true }
    )

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer profile not found' })
    }

    res.json({ message: 'Profile updated', trainer })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}




export const getMyTrainerProfile = async (req, res) => {
  try {
    // req.user._id = the logged-in trainer's user ID (comes from protect middleware)
    // We search by userId, NOT by trainer's own _id, because the trainer
    // doesn't know their own Trainer document ID — only their user ID from login
    const trainer = await Trainer.findOne({ userId: req.user._id })
      .populate('userId', 'name email avatar')

    // If this user has role 'trainer' but never called registerTrainer,
    // there will be no Trainer document yet
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer profile not found' })
    }

    res.json(trainer)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


/**
 * getMyClients — returns all clients assigned to the logged-in trainer.
 * Uses .lean() since we only display data — no .save() needed on results.
 */
export const getMyClients = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id }).lean()
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' })
    }

    const clients = await User.find({ assignedTrainer: trainer._id })
      .select('name email bodyMetrics avatar createdAt')
      .lean()

    res.status(200).json({ success: true, clients })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}



/**
 * getTrainerDashboardStats — returns summary stats for the trainer's home screen.
 *
 * BEFORE: fetched all conversations, extracted IDs in JS, then queried messages.
 * Two separate DB round-trips could be avoided but the approach is acceptable here
 * because the conversation IDs are needed to scope the message queries correctly.
 * 
 * FIXED: Added .lean() to all read-only queries for performance.
 * Removed console.error (debug artifact). 
 */
export const getTrainerDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id

    // Find trainer profile (lean — read only)
    const trainerProfile = await Trainer.findOne({ userId }).lean()
    if (!trainerProfile) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' })
    }

    // Count active clients assigned to this trainer
    const activeClientsCount = await User.countDocuments({
      assignedTrainer: trainerProfile._id,
      role: 'user'
    })

    // Fetch conversation IDs for this trainer
    const conversations = await Conversation.find({ participants: userId }).select('_id').lean()
    const conversationIds = conversations.map(c => c._id)

    // Count and fetch unread messages in one step each (no extra loop needed)
    const [unreadMessagesCount, recentMessagesData] = await Promise.all([
      Message.countDocuments({
        conversationId: { $in: conversationIds },
        senderId: { $ne: userId },
        isRead: false
      }),
      Message.find({
        conversationId: { $in: conversationIds },
        senderId: { $ne: userId }
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('senderId', 'name avatar')
        .lean()
    ])

    // Fetch upcoming sessions for this trainer
    const upcomingSessionsData = await Session.find({
      trainerId: trainerProfile._id,
      status: 'scheduled'
    })
      .populate('clientId', 'name')
      .sort({ startTime: 1 })
      .limit(3)
      .lean()

    const upcomingSessionsList = upcomingSessionsData.map(session => {
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const durationMin = Math.round((end - start) / 60000);

      return {
        client: session.clientId?.name || 'Client',
        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${durationMin} min`,
        type: session.sessionType
      }
    })

    res.status(200).json({
      success: true,
      stats: {
        activeClients: activeClientsCount,
        unreadMessages: unreadMessagesCount,
        upcomingSessions: upcomingSessionsData.length,
        upcomingSessionsList,
        earnings: 0,
        recentMessages: recentMessagesData
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * getUnreadMessages — fetches all unread messages for the trainer's notification modal.
 * Added .lean() for performance — we only read data, never call .save().
 */
export const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user._id

    const conversations = await Conversation.find({ participants: userId }).select('_id').lean()
    const conversationIds = conversations.map(c => c._id)

    const unreadMessages = await Message.find({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userId },
      isRead: false
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'name avatar')
      .lean()

    res.status(200).json({ success: true, unreadMessages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}




export const getTrainerEarnings = async (req, res) => {
  try {
    const userId = req.user._id
    const trainerProfile = await Trainer.findOne({ userId })
    
    if (!trainerProfile) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found' })
    }

    const activeClientsCount = await User.countDocuments({
      assignedTrainer: trainerProfile._id,
      role: 'user'
    })

    const ptPrice = trainerProfile.pricing?.personalTrainingMonthly || 0
    const currentGross = activeClientsCount * ptPrice
    const currentNet = Math.round(currentGross * 0.85)

    // Generate historical data based on current earnings for demo purposes
    // (Until Stripe integration is built)
    const months = [
      { month: 'Jul 2026', sessions: activeClientsCount * 4, gross: currentGross, net: currentNet },
      { month: 'Jun 2026', sessions: 48, gross: 2880, net: 2448 },
      { month: 'May 2026', sessions: 52, gross: 3120, net: 2652 },
      { month: 'Apr 2026', sessions: 45, gross: 2700, net: 2295 }
    ]

    const totalEarned = months.reduce((acc, curr) => acc + curr.net, 0)

    const earningsData = {
      thisMonth: currentNet,
      totalEarned: totalEarned,
      pendingPayout: currentNet, 
      history: months
    }

    res.status(200).json({ success: true, earningsData })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Check if the user has already reviewed the trainer
    const alreadyReviewed = trainer.reviews.find(
      (r) => r.client.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this coach' });
    }

    const review = {
      client: req.user._id,
      rating: Number(rating),
      comment: comment || '',
      date: new Date()
    };

    trainer.reviews.push(review);
    trainer.reviewCount = trainer.reviews.length;
    trainer.rating =
      trainer.reviews.reduce((acc, item) => item.rating + acc, 0) /
      trainer.reviews.length;

    await trainer.save();
    res.status(201).json({ message: 'Review added successfully', trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
