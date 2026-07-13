import express from 'express'
import { askRAGChatbot } from './rag.service.js'
import { protect } from '../../middleware/authenticate.js' // Protect aakkanam

const router = express.Router()

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body
    
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" })
    }

    // Nammude RAG service vilikkunnu!
    const answer = await askRAGChatbot(message)

    res.status(200).json({
      success: true,
      answer: answer
    })

  } catch (error) {
    console.error("Chatbot Error:", error)
    res.status(500).json({ success: false, message: "AI Error: " + error.message })
  }
})

export default router
