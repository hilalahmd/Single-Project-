import express from 'express'
import { protect } from '../../middleware/authenticate.js'
import { restrictTo } from '../../middleware/authorize.js'

import {
  createSlots,
  getMySlots,
  cancelSlot,
  getOpenSlots,
  requestBooking,
  getMyBookings,
  cancelBooking,
  getSlotBookings,
  respondToBooking,
  getMyTrainerUserId,
  verifySlotAccess
} from './schedule.controller.js'

const router = express.Router()

// Ella schedule routes-um login cheytathu mathram access
router.use(protect)

// ── TRAINER ROUTES ──────────────────────────────────────────────────────────

// POST /api/schedule/slots — Trainer working hours → 1-hour slots auto-generate
router.post('/slots', restrictTo('trainer', 'wellness_coach'), createSlots)

// GET /api/schedule/slots/my — Trainer swantham slots kaanuunn
router.get('/slots/my', restrictTo('trainer', 'wellness_coach'), getMySlots)

// PATCH /api/schedule/slots/:slotId/cancel — Trainer slot cancel cheyyunnu
router.patch('/slots/:slotId/cancel', restrictTo('trainer', 'wellness_coach'), cancelSlot)

// GET /api/schedule/bookings/slot/:slotId — Trainer oru slot-nte bookings kaanuunn
router.get('/bookings/slot/:slotId', restrictTo('trainer', 'wellness_coach'), getSlotBookings)

// PATCH /api/schedule/bookings/:bookingId/respond — Trainer accept/reject
router.patch('/bookings/:bookingId/respond', restrictTo('trainer', 'wellness_coach'), respondToBooking)

// ── SHARED ROUTES (Trainer & Client) ─────────────────────────────────────────

// GET /api/schedule/slots/:slotId/verify-access — Video call room access check
router.get('/slots/:slotId/verify-access', verifySlotAccess)

// ── CLIENT ROUTES ────────────────────────────────────────────────────────────

// GET /api/schedule/my-trainer-id — Client-nte assigned trainer-nte User ID get cheyyan
router.get('/my-trainer-id', restrictTo('user'), getMyTrainerUserId)

// GET /api/schedule/slots?trainerId=xxx&date=xxx — Client open slots browse cheyyunnu
router.get('/slots', restrictTo('user'), getOpenSlots)

// POST /api/schedule/bookings — Client booking request submit cheyyunnu (atomic)
router.post('/bookings', restrictTo('user'), requestBooking)

// GET /api/schedule/bookings/my — Client swantham bookings kaanuunn
router.get('/bookings/my', restrictTo('user'), getMyBookings)

// PATCH /api/schedule/bookings/:bookingId/cancel — Client cancel cheyyunnu
router.patch('/bookings/:bookingId/cancel', restrictTo('user'), cancelBooking)

// TEMPORARY DEVELOPMENT PURGE ROUTE (drop old testing data via browser GET)
router.get('/purge-test-data', async (req, res) => {
  try {
    const mongoose = (await import('mongoose')).default
    await mongoose.model('AvailabilitySlot').deleteMany({})
    await mongoose.model('SlotBooking').deleteMany({})
    res.json({ success: true, message: 'All slots and bookings purged! Database is clean.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
