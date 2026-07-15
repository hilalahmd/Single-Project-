import express from 'express'
import { getAvailableSlots, bookSession, getMySessions } from './session.controller.js'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

const router = express.Router()

// Ee route-il ulla ella API-um vilikkan user login aayirikkanam
router.use(protect)

// Get available slots (Client-nu vendi)
router.get('/slots', restrictTo('user'), getAvailableSlots)

// Book a new session (Client-nu vendi)
router.post('/book', restrictTo('user'), bookSession)

// Ente sessions edukkan (Both Client & Trainer access undu)
router.get('/my-sessions', restrictTo('user', 'trainer'), getMySessions)

export default router
