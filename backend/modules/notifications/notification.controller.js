import Notification from './notification.model.js'

/**
 * Fetch notifications for the logged-in user
 */
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50) // Keep it reasonable
    
    // Also return unread count
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false })
    
    res.json({ success: true, notifications, unreadCount })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Mark all notifications as read for the user
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    )
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

/**
 * Mark a specific notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    )
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }
    res.json({ success: true, notification })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
