import express from 'express'
import { askRAGChatbot } from './rag.service.js'
import { protect } from '../../middleware/authenticate.js'
import AIChat from './aichat.model.js'

const router = express.Router()

// GET /api/ai/chat/history - Fetch all chat sessions for the user
router.get('/chat/history', protect, async (req, res) => {
  try {
    const chats = await AIChat.find({ userId: req.user.id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 })
    res.status(200).json({ success: true, data: chats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/ai/chat/history/:chatId - Fetch a specific chat session with its messages
router.get('/chat/history/:chatId', protect, async (req, res) => {
  try {
    const chat = await AIChat.findOne({ _id: req.params.chatId, userId: req.user.id })
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' })
    res.status(200).json({ success: true, data: chat })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, chatId } = req.body
    
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" })
    }

    // Generate AI answer
    const answer = await askRAGChatbot(message)
    
    let chat;
    if (chatId) {
      // Append to existing chat
      chat = await AIChat.findOne({ _id: chatId, userId: req.user.id })
      if (!chat) return res.status(404).json({ success: false, message: "Chat not found" })
      
      chat.messages.push({ role: 'user', text: message })
      chat.messages.push({ role: 'ai', text: answer })
      
      // Update title dynamically if it's still 'New Chat'
      if (chat.title === 'New Chat' && chat.messages.length <= 4) {
        chat.title = message.substring(0, 30) + (message.length > 30 ? '...' : '')
      }
      
      await chat.save()
    } else {
      // Create new chat
      chat = await AIChat.create({
        userId: req.user.id,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [
          { role: 'user', text: message },
          { role: 'ai', text: answer }
        ]
      })
    }

    res.status(200).json({
      success: true,
      answer: answer,
      chatId: chat._id
    })

  } catch (error) {
    console.error("Chatbot Error:", error)
    res.status(500).json({ success: false, message: "AI Error: " + error.message })
  }
})

export default router
