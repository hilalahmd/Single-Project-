import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trainer from './modules/trainers/trainer.model.js';

dotenv.config();

const fixDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    // Set expiry to 30 days from now for all approved trainers who don't have it
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const result = await Trainer.updateMany(
      { status: 'approved' },
      { $set: { subscriptionExpiresAt: thirtyDaysFromNow } }
    );
    
    console.log(`Updated ${result.modifiedCount} trainers.`);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

fixDb();
