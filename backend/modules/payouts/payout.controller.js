import Payout from './payout.model.js'
import Trainer from '../trainers/trainer.model.js'

// ==========================================
// TRAINER: REQUEST PAYOUT
// ==========================================
export const requestPayout = async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    
    // 1. Get the trainer's profile
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // 2. Validate Amount
    if (amount < 1000) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹1,000' });
    }
    if (amount > trainer.earnings.balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 3. Strict Bank Details Validation
    if (!bankDetails || typeof bankDetails !== 'object') {
      return res.status(400).json({ message: 'Bank details are required' });
    }

    const { accountName, accountNumber, ifscCode, bankName } = bankDetails;

    if (!accountName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({ message: 'All bank details fields (Bank Name, Account Number, IFSC Code, Account Holder Name) are required' });
    }

    const cleanAccNo = accountNumber.toString().trim();
    if (!/^\d{9,18}$/.test(cleanAccNo)) {
      return res.status(400).json({ message: 'Invalid Account Number. Must be between 9 and 18 numeric digits.' });
    }

    const cleanIfsc = ifscCode.toString().trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      return res.status(400).json({ message: 'Invalid IFSC Code. Must be a valid 11-character Indian IFSC code (e.g. CNRB0001234, SBIN0001234).' });
    }

    const sanitizedBankDetails = {
      accountName: accountName.toString().trim(),
      accountNumber: cleanAccNo,
      ifscCode: cleanIfsc,
      bankName: bankName.toString().trim()
    };

    // 4. Deduct from balance immediately to prevent double withdrawal
    trainer.earnings.balance -= amount;
    await trainer.save();

    // 5. Create Payout Request
    const payout = await Payout.create({
      trainer: trainer._id,
      amount,
      bankDetails: sanitizedBankDetails,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Payout request submitted successfully',
      payout,
      newBalance: trainer.earnings.balance
    });
  } catch (error) {
    console.error('Error requesting payout:', error);
    res.status(500).json({ message: error.message });
  }
}

// ==========================================
// TRAINER: GET OWN PAYOUTS
// ==========================================
export const getTrainerPayouts = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    const payouts = await Payout.find({ trainer: trainer._id }).sort({ createdAt: -1 });
    res.json({ success: true, payouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==========================================
// ADMIN: GET ALL PAYOUTS
// ==========================================
export const getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find().populate({
      path: 'trainer',
      populate: { path: 'userId', select: 'name email avatar' }
    }).sort({ createdAt: -1 });

    res.json({ success: true, payouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ==========================================
// ADMIN: PROCESS PAYOUT
// ==========================================
export const processPayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body; // 'processed' or 'rejected'

    const payout = await Payout.findById(id).populate('trainer');
    if (!payout) return res.status(404).json({ message: 'Payout not found' });
    if (payout.status !== 'pending') return res.status(400).json({ message: 'Payout is already processed or rejected' });

    payout.status = status;
    payout.adminRemarks = adminRemarks || '';
    payout.processedAt = new Date();

    if (status === 'processed') {
      // Add to withdrawn amount
      payout.trainer.earnings.withdrawn += payout.amount;
      await payout.trainer.save();
    } else if (status === 'rejected') {
      // Refund the balance to the trainer
      payout.trainer.earnings.balance += payout.amount;
      await payout.trainer.save();
    }

    await payout.save();

    res.json({ success: true, message: `Payout marked as ${status}`, payout });
  } catch (error) {
    console.error('Error processing payout:', error);
    res.status(500).json({ message: error.message });
  }
}
