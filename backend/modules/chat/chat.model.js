import mongoose from 'mongoose'

// 1. Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message' 
  }
}, { timestamps: true })

// Index on participants — used every time we load a user's conversation list
// Without this, MongoDB does a full collection scan on every chat load
conversationSchema.index({ participants: 1 })

// 2. Message Schema
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'call_declined', 'call_missed'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
}, { timestamps: true })

// Index on conversationId — critical for getMessages (pagination query filters by this)
// Without this, every page of chat history scans the entire message collection
messageSchema.index({ conversationId: 1, createdAt: -1 })

// Index for unread message count queries (trainer dashboard uses this)
messageSchema.index({ conversationId: 1, senderId: 1, isRead: 1 })

export const Conversation = mongoose.model('Conversation', conversationSchema)
export const Message = mongoose.model('Message', messageSchema)
