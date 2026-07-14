import mongoose from 'mongoose'

const ManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    default: 'manager'
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  }
}, { timestamps: true })

export default mongoose.model('Manager', ManagerSchema)
