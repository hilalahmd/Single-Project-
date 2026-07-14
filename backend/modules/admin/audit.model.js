import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true,
    enum: [
      'SUSPEND_USER', 'ACTIVATE_USER',
      'APPROVE_TRAINER', 'REJECT_TRAINER', 'SUSPEND_TRAINER',
      'RESOLVE_REPORT', 'CREATE_MANAGER', 'DELETE_MANAGER'
    ]
  },
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  targetUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // The user/trainer who was affected
  details: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

export default mongoose.model('AuditLog', auditLogSchema)
