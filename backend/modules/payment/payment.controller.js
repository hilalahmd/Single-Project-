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

      // ==========================================
      // MANGLISH TUTORIAL: REVENUE & COMMISSION LOGIC 
      // ==========================================
      // Ithu vare nammal User-ne update cheythu. Ini nammal Trainer-te cash update cheyyan pokunnu.
      
      // 1. Aadyam namukku Client pay cheytha total amount edukkam.
      const totalAmountPaid = payment.amount;

      // 2. Admin-te commission calculate cheyyam (Ivide njan 5% edukkunnu).
      // Example: 1000 RS aayirunnengil, 5% = 50 RS.
      const adminCommissionPercentage = 5;
      const adminCut = (totalAmountPaid * adminCommissionPercentage) / 100;

      // 3. Trainer-kk kittenda actual earning calculate cheyyam (95%).
      const trainerEarning = totalAmountPaid - adminCut;

      // 4. Ini Trainer-te collection-il poyi avarude 'earnings' update cheyyam.
      // Nammal $inc (increment) operator aanu use cheyyunnathu, appol pazhaya balance-nte koode ithu add aavum.
      await Trainer.findByIdAndUpdate(
        payment.trainer,
        {
          $inc: {
            'earnings.balance': trainerEarning,      // Withdraw cheyyan ulla current balance
            'earnings.totalEarned': trainerEarning   // Life-time eethra undakki ennu kaanikkaan
          }
        }
      );

      // --- NEW FEATURE: Send Notification to Trainer ---
      try {
        const { default: Notification } = await import('../notifications/notification.model.js');
        const trainerDoc = await Trainer.findById(payment.trainer);
        
        if (trainerDoc) {
          const msgText = `🎉 Congratulations! ${user.name} just purchased your ${payment.planTier.replace('_', ' ')} plan for ₹${totalAmountPaid.toLocaleString()}.\nNote: A 10% platform fee (₹${adminCut.toLocaleString()}) was deducted. Your net earning of ₹${trainerEarning.toLocaleString()} has been added to your balance. Keep up the great work! 💪`;
          
          await Notification.create({
            user: trainerDoc.userId,
            title: 'New Client Payment',
            message: msgText,
            type: 'payment',
            link: '/trainer/earnings'
          });
        }
      } catch (notifError) {
        console.error("Failed to create automated notification:", notifError);
      }
      // ==========================================

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

// ==========================================
// TRAINER PLATFORM SUBSCRIPTION (Rs 399) APIs
// ==========================================

export const createTrainerSubscriptionOrder = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) return res.status(404).json({ message: 'Trainer profile not found' });
    
    // Admin approval must be completed
    if (trainer.status !== 'approved') {
      return res.status(403).json({ message: 'Your profile is not approved yet' });
    }

    const amount = 399 * 100; // Rs 399 in paise

    const razorpay = getRazorpayInstance();
    const shortId = req.user._id.toString().slice(-6);
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `rcpt_trainersub_${Date.now().toString().slice(-8)}_${shortId}`
    };

    const order = await razorpay.orders.create(options);

    // Save pending payment record in database
    await Payment.create({
      user: req.user._id,
      planTier: 'platform_subscription',
      amount: 399, // Store in INR
      razorpayOrderId: order.id,
      status: 'pending'
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: amount,
      currency: 'INR'
    });

  } catch (error) {
    console.error('Error creating trainer subscription order:', error);
    res.status(500).json({ message: error.message || 'Failed to create payment order' });
  }
}


export const verifyTrainerSubscription = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (!payment) return res.status(404).json({ message: 'Payment record not found' });

      // Update payment status
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = 'successful';
      await payment.save();

      // Extend Trainer Subscription by 30 Days!
      const trainer = await Trainer.findOne({ userId: req.user._id });
      
      const currentExpiry = trainer.subscriptionExpiresAt ? new Date(trainer.subscriptionExpiresAt) : new Date();
      // If already expired, start from today. If active, add 30 days to existing expiry.
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      baseDate.setDate(baseDate.getDate() + 30);
      
      trainer.subscriptionExpiresAt = baseDate;
      await trainer.save();

      res.json({
        success: true,
        message: 'Platform subscription activated successfully!',
        expiresAt: trainer.subscriptionExpiresAt
      });
    } else {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying trainer subscription:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
}

export const getTrainerTransactions = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    
    // Find all successful payments where this trainer was the target
    const payments = await Payment.find({ 
      trainer: trainer._id,
      status: 'successful',
      planTier: { $ne: 'platform_subscription' } 
    })
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching trainer transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
}
