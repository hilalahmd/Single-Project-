import Trainer from "../trainers/trainer.model.js";




export const approveTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    )

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    res.json({ message: 'Trainer approved', trainer })
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