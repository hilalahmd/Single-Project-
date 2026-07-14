import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const managers = await User.find({ 
      $or: [
        { role: 'manager' }, 
        { adminRole: { $exists: true } }
      ] 
    });
    
    console.log("Found managers:");
    managers.forEach(m => {
      console.log(`Email: ${m.email}, Role: ${m.role}, isVerified: ${m.isVerified}, adminRole: ${m.adminRole}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
