import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './modules/plans/plan.model.js';
import Workout from './modules/workout/workout.model.js';

dotenv.config();

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hilalahmdpp10:B658qjSjSSTtE7bA@cluster0.89s1sbq.mongodb.net/fitforge?retryWrites=true&w=majority');
    console.log('MongoDB Connected');

    const clientId = '6a434d0ef2a1783bfd30e99f';
    
    const plan = await Plan.findOne({ clientId });
    console.log('Plan found:', plan);

    if (plan) {
      const workout = await Workout.find({ planId: plan._id });
      console.log('Workouts found:', JSON.stringify(workout, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

testDB();
