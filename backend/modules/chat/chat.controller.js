import { Conversation, Message } from './chat.model.js'
import User from '../users/user.model.js'

// 1. Oru Message ayakkan ulla API
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body
    const senderId = req.user.id

    // Aadyam ivar thammil mumb chat cheythittundo ennu nokkunnu
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    })

    // Illenkil puthiya oru chat history undakkunnu
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    // Message save cheyyunnu
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      text
    })

    // Conversation table-il 'lastMessage' update cheyyunnu (Home screen-il kanikkan)
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
    const userId = req.user.id

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email role avatar') // Chat cheyyunna aalude peru kittan
      .populate('lastMessage') // Avasanathe message kittan
      .sort({ updatedAt: -1 }) // Ettavum puthiya chat aadyam varan

    res.status(200).json({ success: true, data: conversations })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// 3. Randu per thammilulla muzhuvan message history edukkaan (Chat Room)
export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params
    const myId = req.user.id
    
    // Pagination varubol URL-il ninnu page-um limit-um edukkunnu (eg: ?page=1&limit=20)
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const conversation = await Conversation.findOne({
      participants: { $all: [myId, otherUserId], $size: 2 }
    })

    const contactInfo = await User.findById(otherUserId).select('name email role avatar')

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
    const senderId = req.user.id

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
    const myId = req.user.id // Ente (Trainer-nte) ID

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
