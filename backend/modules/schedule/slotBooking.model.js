import mongoose from 'mongoose'

const slotBookingSchema = new mongoose.Schema(
  {
    // ① Ethu slot-ilekku aanu ee request?
    // AvailabilitySlot-nte _id — ithuvazhi slot details fetch cheyyan
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AvailabilitySlot',
      required: [true, 'Booking must be linked to a slot']
    },

    // ② Aara booking request cheytathu?
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a client']
    },

    // ③ Aara trainer? (denormalized — slot populate cheyyathe quick check cheyyan)
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a trainer']
    },

    // ④ Booking-nte current status
    // pending   → Client request iditu, trainer kaanaan
    // accepted  → Trainer okay parachhu, video room join cheyyan pattu
    // rejected  → Trainer reject cheytu, client-kku notification poovum
    // cancelled → Client swayam cancel cheytu
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    },

    // ⑤ THE MOST IMPORTANT SECURITY FIELD — Rebook abuse prevention!
    // Trainer reject cheyumbol client-inu ONE CHANCE — oru puthiya slot choose cheyyan
    // rebookUsed: false → Avarkku still oru chance baaki undu
    // rebookUsed: true  → Already rebook cheythittund, puthiya request allow illa
    rebookUsed: {
      type: Boolean,
      default: false
    },

    // ⑥ Rejection reason (optional) — trainer enth parachhu ennu client-kku kaananam
    rejectionReason: {
      type: String,
      default: ''
    },

    // ⑦ Client-nte optional note (e.g. "I have a knee injury, please adjust")
    clientNote: {
      type: String,
      default: '',
      maxlength: [500, 'Client note cannot exceed 500 characters']
    }
  },
  { timestamps: true }
)

// ─── INDEXES ──────────────────────────────────────────────────────────────

// Same client, same slot-il 2 bookings allow cheyyanilla
// DB level-il enforce — application check mathral poru illa (race condition)
slotBookingSchema.index(
  { slotId: 1, clientId: 1 },
  { unique: true }
)

// Trainer dashboard — pending requests patta querries fast aavaan
slotBookingSchema.index({ trainerId: 1, status: 1 })

// Client dashboard — swantham bookings kaanan
slotBookingSchema.index({ clientId: 1, status: 1 })

// Slot-nte ella bookings fetch cheyyan (trainer sees all requests per slot)
slotBookingSchema.index({ slotId: 1 })

export default mongoose.model('SlotBooking', slotBookingSchema)
