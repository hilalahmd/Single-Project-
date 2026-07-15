import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const TrainerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profilePhoto: String,
});
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
});

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitforge');
  const User = mongoose.model('User', UserSchema);
  const Trainer = mongoose.model('Trainer', TrainerSchema);

  const users = await User.find({ name: /WELLNESSTEST/i });
  console.log("Users found:", users.length);
  for (let u of users) {
    const t = await Trainer.findOne({ userId: u._id });
    console.log(`User: ${u.name}, Role: ${u.role}, Trainer Profile Photo: ${t ? t.profilePhoto : 'No Trainer Record'}`);
  }
  process.exit(0);
}
check();
