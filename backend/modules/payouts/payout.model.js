import mongoose from 'mongoose'

const payoutSchema = new mongoose.Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankDetails: {
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'rejected'],
    default: 'pending'
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date
  }
}, { timestamps: true })

export default mongoose.model('Payout', payoutSchema)
