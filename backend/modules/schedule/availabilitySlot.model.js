import mongoose from 'mongoose'

const availabilitySlotSchema = new mongoose.Schema(
  {
    // ① Ee slot aara create cheytathu?
    // Trainer mathram slot create cheyyan pattu — routes-il enforce cheyyum
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',        // Trainer-um User model-il aanu (role: 'trainer')
      required: [true, 'Slot must belong to a trainer'],
      index: true         // Trainer-nte slots fast query cheyyan
    },

    // ② Ee slot ethu divasam? (Date object aanu, time portion ignore cheyyum)
    date: {
      type: Date,
      required: [true, 'Slot date is required']
    },

    // ③ Slot start aavunna exact time (e.g. 2024-07-11T17:00:00Z)
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },

    // ④ Slot end aavunna exact time (e.g. 2024-07-11T18:00:00Z)
    endTime: {
      type: Date,
      required: [true, 'End time is required']
    },

    // ⑤ Max clients trainer allow cheyyunnu — hard cap: 3
    // Frontend-il validation venam, backend-ilum enforce cheyyunnu
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1'],
      max: [3, 'Capacity cannot exceed 3 (mesh WebRTC limit)'],
      default: 1
    },

    // ⑥ Ethra clients ippol accepted aayitund?
    // IMPORTANT: Ithinte update ALWAYS atomic aayirikkanam ($inc operator)
    // Regular save() use cheyyanmengilum race condition varum — two clients same time-il book cheyumbol
    bookedCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // ⑦ Slot-nte overall status
    status: {
      type: String,
      enum: ['open', 'full', 'cancelled'],
      default: 'open'
    }
  },
  {
    timestamps: true // createdAt, updatedAt auto add aavum
  }
)

// ─── INDEXES ───────────────────────────────────────────────────────────────
// Trainer-nte slots by date — most common query (dashboard render)
availabilitySlotSchema.index({ trainerId: 1, date: 1 })

// Client slot browse cheyumbol — open slots by date query cheyyan
availabilitySlotSchema.index({ date: 1, status: 1 })

// Duplicate slot prevent cheyyan — same trainer, same startTime, oru slot mathram
// Ee unique index DB level-il enforce cheyyunnu (application layer check mathral poru)
availabilitySlotSchema.index(
  { trainerId: 1, startTime: 1 },
  { unique: true }
)

export default mongoose.model('AvailabilitySlot', availabilitySlotSchema)
