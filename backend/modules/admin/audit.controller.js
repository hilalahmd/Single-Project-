import AuditLog from './audit.model.js'

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100) // Show last 100 actions

    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
