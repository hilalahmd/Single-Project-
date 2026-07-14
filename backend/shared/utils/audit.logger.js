import AuditLog from '../../modules/admin/audit.model.js'

/**
 * Utility to log administrative actions (Audit Trails)
 * @param {String} action - The action type (e.g. 'SUSPEND_USER')
 * @param {ObjectId} performedBy - The admin/manager who did it
 * @param {ObjectId} targetUser - The user/trainer affected
 * @param {String} details - Human readable string explaining the action
 */
export const logAuditAction = async (action, performedBy, targetUser, details) => {
  try {
    await AuditLog.create({
      action,
      performedBy,
      targetUser,
      details
    })
  } catch (error) {
    console.error('Failed to log audit action:', error)
  }
}
