import express from 'express'
import { sendMessage, getConversations, getMessages, logCall, markChatAsRead } from './chat.controller.js'
import { protect } from '../../middleware/authenticate.js'

const router = express.Router()

// Chat APIs ellam login cheytha aalkarkku mathram
router.use(protect)

// 1. Oru puthiya message ayakkan
// POST http://localhost:5000/api/chat/send
router.post('/send', sendMessage)

// 1.1 Oru call log cheyyan
// POST http://localhost:5000/api/chat/call-log
router.post('/call-log', logCall)

// 2. Nammude chat list (Inbox) kaanan
// GET http://localhost:5000/api/chat/conversations
router.get('/conversations', getConversations)

// 3. Oralaayi ulla chat history kaanan (otherUserId kodukkanam)
// GET http://localhost:5000/api/chat/history/:otherUserId
router.get('/history/:otherUserId', getMessages)

router.put('/mark-read/:senderId', markChatAsRead)

export default router
