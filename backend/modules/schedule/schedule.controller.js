import AvailabilitySlot from './availabilitySlot.model.js'
import SlotBooking from './slotBooking.model.js'
import User from '../users/user.model.js'
import Trainer from '../trainers/trainer.model.js'

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Trainer working hours set cheyyu → 1-hour slots auto-generate
// @route  POST /api/schedule/slots
// @access Trainer only
// ─────────────────────────────────────────────────────────────────────────────
export const createSlots = async (req, res) => {
  try {
    const { date, workStart, workEnd, capacity } = req.body
    // workStart & workEnd are hours in 24h format — e.g. 17 for 5 PM, 21 for 9 PM
    // date is ISO string — e.g. "2026-07-12"

    // ── Step 0: SECURITY: Trainer Approval Check ────────────────────────────
    const trainer = await Trainer.findOne({ userId: req.user._id })
    if (!trainer || trainer.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Only approved (active) trainers can create schedule slots.'
      })
    }

    // ── Step 1: Basic input validation ──────────────────────────────────────
    if (!date || workStart === undefined || workEnd === undefined || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'date, workStart (hour), workEnd (hour), and capacity are required'
      })
    }

    // workStart must be before workEnd
    if (workStart >= workEnd) {
      return res.status(400).json({
        success: false,
        message: 'workStart must be before workEnd'
      })
    }

    // Capacity hard cap — backend-ilum enforce, client side mathral믿 poru
    if (capacity < 1 || capacity > 3) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be between 1 and 3'
      })
    }

    // ── Step 2: Past date check ──────────────────────────────────────────────
    // Trainer past-il slots create cheyyaruthu
    const slotDate = new Date(date)
    slotDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (slotDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create slots for a past date'
      })
    }

    // ── Step 3: Auto-generate 1-hour slots ──────────────────────────────────
    const slotsToCreate = []
    const [year, month, day] = date.split('-').map(Number)

    const now = new Date()

    for (let hour = workStart; hour < workEnd; hour++) {
      // Construct date exactly as local calendar time parameters
      const startTime = new Date(year, month - 1, day, hour, 0, 0, 0)
      
      const endTime   = new Date(year, month - 1, day, hour + 1, 0, 0, 0)
      
      // Strict validation: Do not allow creating slots for time that has ALREADY ENDED today.
      // (Ongoing sessions are allowed so clients can join immediately).
      if (endTime <= now) {
        return res.status(400).json({
          success: false,
          message: `Cannot create a slot at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} because that session time has already completely passed.`
        })
      }

      const dateOnly  = new Date(year, month - 1, day, 0, 0, 0, 0)

      slotsToCreate.push({
        trainerId: req.user._id,
        date: dateOnly,
        startTime,
        endTime,
        capacity: Number(capacity),
        bookedCount: 0,
        status: 'open'
      })
    }

    // ── Step 4: Bulk insert — ordered: false important! ──────────────────────
    // ordered: false → oru slot duplicate aayalkil (unique index violation), 
    // baakillathu still insert cheyyum. Partial success allowed.
    const result = await AvailabilitySlot.insertMany(slotsToCreate, {
      ordered: false  
    })

    res.status(201).json({
      success: true,
      message: `${result.length} slot(s) created successfully`,
      data: result
    })

  } catch (error) {
    // MongoDB duplicate key error code — same trainer, same startTime already exists
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Some slots already exist for this time range. Others were created.'
      })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Trainer swantham slots kaanunnu (upcoming only)
// @route  GET /api/schedule/slots/my
// @access Trainer only
// ─────────────────────────────────────────────────────────────────────────────
export const getMySlots = async (req, res) => {
  try {
    // Query param: ?date=2026-07-12 (optional filter by date)
    const filter = {
      trainerId: req.user._id,  // SECURITY: trainer swantham slots mathram kaananam
      status: { $ne: 'cancelled' }, // Do not fetch cancelled slots
      endTime: { $gt: new Date() } // Only upcoming or ongoing slots
    }

    if (req.query.date) {
      const dayStart = new Date(req.query.date)
      dayStart.setUTCHours(0, 0, 0, 0)
      const dayEnd = new Date(req.query.date)
      dayEnd.setUTCHours(23, 59, 59, 999)
      
      // Ensure we do not fetch past slots for today's date
      const now = new Date()
      const actualStart = dayStart < now ? now : dayStart

      filter.endTime = { $gt: actualStart, $lte: dayEnd }
    }

    const slots = await AvailabilitySlot.find(filter).sort({ startTime: 1 })

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Trainer oru slot cancel cheyyunnu
// @route  PATCH /api/schedule/slots/:slotId/cancel
// @access Trainer only
// ─────────────────────────────────────────────────────────────────────────────
export const cancelSlot = async (req, res) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.slotId)

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    // SECURITY: Ee slot ee trainer-nte aano verify cheyyunnu
    if (slot.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own slots'
      })
    }

    // Drop/Delete the slot document
    await AvailabilitySlot.findByIdAndDelete(req.params.slotId)

    // Reject any bookings on this slot to alert clients
    await SlotBooking.updateMany(
      { slotId: req.params.slotId },
      { 
        $set: { 
          status: 'rejected', 
          rejectionReason: 'Trainer cancelled this session slot.' 
        } 
      }
    )

    res.status(200).json({ success: true, message: 'Slot deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


export const getOpenSlots = async (req, res) => {
  try {
    const { trainerId, date } = req.query
    if (!trainerId) {
      return res.status(400).json({
        success: false,
        message: 'trainerId query param is required'
      })
    }
    const filter = {
      trainerId,
      status: 'open' // ONLY open slots (not full, not cancelled)
    }
    if (date) {
      const [year, month, day] = date.split('-').map(Number)
      const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0)
      const dayEnd   = new Date(year, month - 1, day, 23, 59, 59, 999)

      // Ensure we do not fetch past slots for today's date
      const now = new Date()
      const actualStart = dayStart < now ? now : dayStart

      filter.endTime = { $gt: actualStart, $lte: dayEnd }
    } else {
      filter.endTime = { $gt: new Date() }  // Future and ongoing slots only by default
    }
    const slots = await AvailabilitySlot.find(filter).sort({ startTime: 1 })
    res.status(200).json({ success: true, count: slots.length, data: slots })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// @desc   Client oru slot-ilekku booking request submit cheyyunnu
// @route  POST /api/schedule/bookings
// @access Client only
// ──────────────────────────────────────────────────────────────────────────
export const requestBooking = async (req, res) => {
  try {
    const { slotId, clientNote, isRebook } = req.body
    const clientId = req.user._id  // Always from JWT, never from body
    if (!slotId) {
      return res.status(400).json({ success: false, message: 'slotId is required' })
    }
    // ── REBOOK CHECK: Client already rejected aano? rebookUsed aano? ─────────
    // isRebook: true → client was rejected and is using their one free rebook chance
    if (isRebook) {
      const previousRejection = await SlotBooking.findOne({
        clientId,
        status: 'rejected'
      }).sort({ updatedAt: -1 }) // Most recent rejection
      if (!previousRejection) {
        return res.status(400).json({
          success: false,
          message: 'No rejection found to use rebook on'
        })
      }
      // Already used their free rebook? BLOCK IT!
      if (previousRejection.rebookUsed) {
        return res.status(403).json({
          success: false,
          message: 'You have already used your free rebook chance. Contact your trainer.'
        })
      }
      // Mark rebookUsed on the old rejected booking
      await SlotBooking.findByIdAndUpdate(previousRejection._id, {
        rebookUsed: true
      })
    }
    // ── ATOMIC STEP: Check capacity + increment in ONE DB operation ──────────
    // $expr allows comparing two fields inside the document
    // $lt: ['$bookedCount', '$capacity'] → bookedCount < capacity
    // Ith pass cheyyunna slot mathram update cheyyum — race condition safe!
    const updatedSlot = await AvailabilitySlot.findOneAndUpdate(
      {
        _id: slotId,
        status: 'open',
        $expr: { $lt: ['$bookedCount', '$capacity'] }  // Still has space?
      },
      {
        $inc: { bookedCount: 1 }  // Atomically increment
      },
      { new: true }  // Return updated document
    )
    // If null returned → slot was full OR doesn't exist OR already cancelled
    if (!updatedSlot) {
      return res.status(409).json({
        success: false,
        message: 'This slot is full or no longer available. Please choose another slot.'
      })
    }
    // ── Create the booking request document ─────────────────────────────────
    // Duplicate prevention: unique index { slotId, clientId } handles this at DB level
    const booking = await SlotBooking.create({
      slotId,
      clientId,
      trainerId: updatedSlot.trainerId,  // From the slot document — not from body!
      clientNote: clientNote || '',
      status: 'pending'
    })
    // ── If slot just became full, update its status ──────────────────────────
    if (updatedSlot.bookedCount >= updatedSlot.capacity) {
      await AvailabilitySlot.findByIdAndUpdate(slotId, { status: 'full' })
    }
    res.status(201).json({
      success: true,
      message: 'Booking request submitted! Waiting for trainer approval.',
      data: booking
    })
  } catch (error) {
    // Duplicate booking attempt (same client, same slot)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You already have a booking request for this slot.'
      })
    }
    res.status(500).json({ success: false, message: error.message })
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// @desc   Client swantham bookings kaanuunn
// @route  GET /api/schedule/bookings/my
// @access Client only
// ─────────────────────────────────────────────────────────────────────────────
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await SlotBooking.find({ 
      clientId: req.user._id,
      status: { $ne: 'cancelled' } 
    })
      .populate('slotId', 'startTime endTime date capacity status')  // Slot details
      .populate('trainerId', 'name profilePicture')                  // Trainer name/pic
      .sort({ createdAt: -1 })
    res.status(200).json({ success: true, count: bookings.length, data: bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
// ─────────────────────────────────────────────────────────────────────────────
// @desc   Client swantham pending booking cancel cheyyunnu
// @route  PATCH /api/schedule/bookings/:bookingId/cancel
// @access Client only
// ─────────────────────────────────────────────────────────────────────────────
  export const cancelBooking = async (req, res) => {
    try {
      const booking = await SlotBooking.findById(req.params.bookingId)
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' })
    }
    // SECURITY: Client swantham booking mathram cancel cheyyan pattu
    if (booking.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      })
    }
    // Only pending bookings cancel cheyyan pattu
    // Accepted booking cancel cheyyal → bookedCount decrement venam (future step)
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be cancelled this way'
      })
    }
    booking.status = 'cancelled'
    await booking.save()

    // Slot-nte bookedCount decrement cheyyunnu and status explicitly 'open' aakkunnu
    await AvailabilitySlot.findByIdAndUpdate(booking.slotId, {
      $inc: { bookedCount: -1 },
      $set: { status: 'open' } // Make absolutely sure it changes from 'full' to 'open'
    })
    res.status(200).json({ success: true, message: 'Booking cancelled', data: booking })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Client-nte assigned trainer-nte User _id return cheyyunnu
//         (user.assignedTrainer is a Trainer doc _id, but slots use User _id)
// @route  GET /api/schedule/my-trainer-id
// @access Client only
// ─────────────────────────────────────────────────────────────────────────────
export const getMyTrainerUserId = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('assignedTrainer')

    if (!user?.assignedTrainer) {
      return res.status(404).json({
        success: false,
        message: 'No trainer assigned to your account yet.'
      })
    }

    // assignedTrainer is Trainer doc _id — get the trainer's User _id from it
    const trainer = await Trainer.findById(user.assignedTrainer).select('userId')

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Assigned trainer not found.'
      })
    }

    res.status(200).json({
      success: true,
      trainerUserId: trainer.userId  // This is what slots use as trainerId
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Trainer oru slot-nte ella pending bookings kaanuunn
// @route  GET /api/schedule/bookings/slot/:slotId
// @access Trainer only
// ─────────────────────────────────────────────────────────────────────────────
export const getSlotBookings = async (req, res) => {
  try {
    const slot = await AvailabilitySlot.findById(req.params.slotId)

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    // SECURITY: Ee slot ee trainer-nte aano verify cheyyunnu
    if (slot.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view bookings for your own slots'
      })
    }

    // Slot-nte bookings
    const bookings = await SlotBooking.find({ slotId: req.params.slotId })
      .populate('clientId', 'name email profilePicture')
      .sort({ createdAt: 1 })

    res.status(200).json({ success: true, count: bookings.length, data: bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Trainer oru booking accept/reject cheyyunnu
// @route  PATCH /api/schedule/bookings/:bookingId/respond
// @access Trainer only
// ─────────────────────────────────────────────────────────────────────────────
export const respondToBooking = async (req, res) => {
  try {
    const { action, rejectionReason } = req.body

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "action must be 'accept' or 'reject'"
      })
    }

    const booking = await SlotBooking.findById(req.params.bookingId)

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    if (booking.trainerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to bookings for your own slots'
      })
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}. Cannot respond.`
      })
    }

    booking.status = action === 'accept' ? 'accepted' : 'rejected'
    
    if (action === 'reject') {
      booking.rejectionReason = rejectionReason || 'Trainer did not provide a reason'
      await AvailabilitySlot.findByIdAndUpdate(booking.slotId, {
        $inc: { bookedCount: -1 },
        status: 'open'
      })

      const clientIdStr = booking.clientId.toString()
      req.io.to(clientIdStr).emit('booking_rejected', {
        bookingId: booking._id,
        slotId: booking.slotId,
        reason: booking.rejectionReason,
        message: 'Your booking request was rejected. You have one free rebook.',
        rebookUsed: booking.rebookUsed,
        timestamp: new Date()
      })
    }

    if (action === 'accept') {
      const clientIdStr = booking.clientId.toString()
      req.io.to(clientIdStr).emit('booking_accepted', {
        bookingId: booking._id,
        slotId: booking.slotId,
        message: 'Your booking was accepted! Get ready for your session.',
        timestamp: new Date()
      })
    }

    await booking.save()

    res.status(200).json({
      success: true,
      message: `Booking ${booking.status}`,
      data: booking
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @desc   Verify slot access for joining video call
// @route  GET /api/schedule/slots/:slotId/verify-access
// ─────────────────────────────────────────────────────────────────────────────
export const verifySlotAccess = async (req, res) => {
  try {
    const { slotId } = req.params
    const userId     = req.user._id
    const role       = req.user.role

    if (role === 'trainer' || role === 'wellness_coach') {
      const slot = await AvailabilitySlot.findOne({
        _id: slotId,
        trainerId: userId
      })
      if (!slot) {
        return res.status(403).json({ success: false, message: 'Access denied' })
      }
      return res.status(200).json({ success: true, canJoin: true, role: 'trainer' })
    }

    const booking = await SlotBooking.findOne({
      slotId,
      clientId: userId,
      status: 'accepted'
    })

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: 'You do not have an accepted booking for this session.'
      })
    }

    res.status(200).json({ success: true, canJoin: true, role: 'client' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}