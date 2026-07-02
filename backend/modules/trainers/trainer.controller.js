import Trainer from './trainer.model.js'
import User from '../users/user.model.js'


export const getTrainers = async (req, res) => {
  try {
    const { language } = req.query

    const filter = { isApproved: true }
    if (language) {
      filter.languagesSpoken = language
    }

    const trainers = await Trainer.find(filter)
      .populate('userId', 'name email avatar')
      .sort({ rating: -1 })

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


export const registerTrainer = async (req, res) => {
  try {
    // Get trainer details from request body
    const { bio, specialties, languagesSpoken, pricing } = req.body

    // Check if trainer profile already exists for this user
    // req.user._id comes from JWT middleware (logged in user)
    const existing = await Trainer.findOne({ userId: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'Trainer profile already exists' })
    }

    // Create new trainer profile in DB
    // isApproved is false by default — admin must approve first
    const trainer = await Trainer.create({
      userId: req.user._id,
      role: req.user.role, // 'trainer' or 'wellness_coach'
      bio,
      specialties,
      languagesSpoken,
      pricing,
      isApproved: false // needs admin approval
    })

    // Send success response with created trainer
    res.status(201).json({ 
      message: 'Trainer profile created. Pending admin approval.',
      trainer 
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const updateTrainerProfile = async (req, res) => {
  try {
    // Get updated fields from request body
    const { bio, specialties, languagesSpoken, pricing } = req.body

    // Find trainer profile by userId and update it
    // req.user._id = logged in trainer's user ID
    // { new: true } = return updated document, not old one
    const trainer = await Trainer.findOneAndUpdate(
      { userId: req.user._id }, // find by userId
      { bio, specialties, languagesSpoken, pricing }, // update these fields
      { new: true } // return updated trainer
    )

    // If no trainer profile found
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer profile not found' })
    }

    // Send success response
    res.json({ message: 'Profile updated', trainer })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
