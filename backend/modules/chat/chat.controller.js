import { Conversation, Message } from './chat.model.js'
import User from '../users/user.model.js'

/**
 * sendMessage — saves a new chat message and links it to a conversation.
 * Validates receiverId and text before writing to DB.
 * WHY: without length limits, a user could send multi-MB messages,
 *      inflating the DB and potentially causing slow chat loads.
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body
    const senderId = req.user._id

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'receiverId is required.' })
    }
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty.' })
    }
    if (text.length > 2000) {
      return res.status(400).json({ success: false, message: 'Message cannot exceed 2000 characters.' })
    }
    // Prevent sending a message to yourself
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send a message to yourself.' })
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      text: text.trim()
    })

    conversation.lastMessage = newMessage._id
    await conversation.save()

    res.status(201).json({ success: true, data: newMessage })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 2. Oru User-nte muzhuvan Chat List edukkaan ulla API (WhatsApp Home Screen pole)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email role avatar') // Chat cheyyunna aalude peru kittan
      .populate('lastMessage') // Avasanathe message kittan
      .sort({ updatedAt: -1 })
      .lean() // Ettavum puthiya chat aadyam varan

    const Trainer = (await import('../trainers/trainer.model.js')).default
    for (let conv of conversations) {
      for (let p of conv.participants) {
        if (p.role === 'trainer' || p.role === 'wellness_coach') {
          const trainerRecord = await Trainer.findOne({ userId: p._id }).select('profilePhoto')
          if (trainerRecord && trainerRecord.profilePhoto) {
            p.profilePhoto = trainerRecord.profilePhoto
          }
        }
      }
    }

    res.status(200).json({ success: true, data: conversations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 3. Randu per thammilulla muzhuvan message history edukkaan (Chat Room)
export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params
    const myId = req.user._id
    
    // Pagination varubol URL-il ninnu page-um limit-um edukkunnu (eg: ?page=1&limit=20)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const conversation = await Conversation.findOne({
      participants: { $all: [myId, otherUserId], $size: 2 }
    })

    let contactInfo = await User.findById(otherUserId).select('name email role avatar').lean()

    if (contactInfo && (contactInfo.role === 'trainer' || contactInfo.role === 'wellness_coach')) {
      const Trainer = (await import('../trainers/trainer.model.js')).default
      const trainerRecord = await Trainer.findOne({ userId: otherUserId }).select('profilePhoto')
      if (trainerRecord && trainerRecord.profilePhoto) {
        contactInfo.profilePhoto = trainerRecord.profilePhoto
      }
    }

    if (!conversation) {
      return res.status(200).json({ success: true, data: [], contact: contactInfo }) 
    }

    // sort({ createdAt: -1 }) koduthal ettavum puthiya messages aadyam kittum. Athil ninnum limit cheytheduthal latest 20 messages kittum.
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)

    // UI-il kanikkumbol pazhaya message mukalilum puthiyathu thazheyum varan vendi array 'reverse()' cheyyunnu
    res.status(200).json({ success: true, data: messages.reverse(), contact: contactInfo }) 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 4. Log missed or declined video calls as chat messages
export const logCall = async (req, res) => {
  try {
    const { receiverId, type } = req.body
    const senderId = req.user._id

    if (!['call_declined', 'call_missed'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid call log type' })
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const text = type === 'call_declined' ? 'Call Declined' : 'Missed Call'

    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      text,
      type
    })

    conversation.lastMessage = newMessage._id
    await conversation.save()

    res.status(201).json({ success: true, data: newMessage })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 5. Oru chat open aakumbol athile messages 'Read' aakki mattunna API
export const markChatAsRead = async (req, res) => {
  try {
    const senderId = req.params.senderId // Client-nte ID
    const myId = req.user._id // Ente (Trainer-nte) ID

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, myId], $size: 2 }
    })

    if (conversation) {
      // Aa conversation-il client ayacha messages ellam isRead: true aakkunnu
      await Message.updateMany(
        { conversationId: conversation._id, senderId: senderId, isRead: false },
        { $set: { isRead: true, status: 'read' } }
      )
    }
    res.status(200).json({ success: true, message: 'Messages marked as read' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
