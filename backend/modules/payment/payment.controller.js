import Razorpay from 'razorpay'
import crypto from 'crypto'
import Payment from './payment.model.js'
import User from '../users/user.model.js'

// Helper function to initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

import Trainer from '../trainers/trainer.model.js'

export const createOrder = async (req, res) => {
  try {
    const { plan, trainerId } = req.body
    
    if (!plan || !trainerId) {
      return res.status(400).json({ message: 'Plan and Trainer ID are required' })
    }

    const trainer = await Trainer.findById(trainerId)
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' })
    }

    let amount = 0
    if (plan === 'wellness') {
      amount = Math.max(trainer.pricing?.wellnessMonthly || 0, 999) * 100
    } else if (plan === 'personal_training') {
      amount = Math.max(trainer.pricing?.personalTrainingMonthly || 0, 2499) * 100
    } else if (plan !== 'free') {
      return res.status(400).json({ message: 'Invalid plan selected' })
    }

    // If free plan, bypass Razorpay
    if (amount === 0) {
      const payment = await Payment.create({
        user: req.user._id,
        trainer: trainerId,
        planTier: plan,
        amount: 0,
        razorpayOrderId: `free_${Date.now()}`,
        status: 'successful'
      })
      
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { 
          subscriptionTier: plan,
          assignedTrainer: trainerId
        },
        { new: true }
      ).populate({
        path: 'assignedTrainer',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      })

      return res.json({ 
        success: true, 
        message: 'Free plan activated',
        user 
      })
    }

    const razorpay = getRazorpayInstance()

    const shortId = req.user._id.toString().slice(-6)
    const options = {
      amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}_${shortId}`
    }

    const order = await razorpay.orders.create(options)

    // Save pending payment record
    await Payment.create({
      user: req.user._id,
      trainer: trainerId,
      planTier: plan,
      amount: amount / 100, // Store in INR, not paise
      razorpayOrderId: order.id,
      status: 'pending'
    })

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    })

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    res.status(500).json({ message: error.message || 'Failed to create payment order' })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Find the pending payment
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id })
      
      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found' })
      }

      // Update payment status
      payment.razorpayPaymentId = razorpay_payment_id
      payment.razorpaySignature = razorpay_signature
      payment.status = 'successful'
      await payment.save()

      // Update user subscription
      const user = await User.findByIdAndUpdate(
        payment.user,
        { 
          subscriptionTier: payment.planTier,
          assignedTrainer: payment.trainer
        },
        { new: true }
      ).populate({
        path: 'assignedTrainer',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      })

      res.json({
        success: true,
        message: 'Payment successful',
        user
      })
    } else {
      // Signature mismatch
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      )
      res.status(400).json({ success: false, message: 'Invalid payment signature' })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({ message: 'Failed to verify payment' })
  }
}

export const getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID })
}
