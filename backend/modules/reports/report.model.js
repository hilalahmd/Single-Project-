import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'Unprofessional behavior',
      'Inappropriate language or content',
      'Not responding or late',
      'Spam or advertising',
      'Other'
    ]
  },
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  }
}, { timestamps: true })

const Report = mongoose.model('Report', reportSchema)
export default Report
