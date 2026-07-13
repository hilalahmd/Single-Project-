import mongoose from 'mongoose';
import connectDB from '../backend/config/db.js';
import { User } from '../backend/modules/users/user.model.js';
import Trainer from '../backend/modules/trainers/trainer.model.js';
import Chat from '../backend/modules/chat/chat.model.js';

async function setup() {
  await connectDB();
  const client = await User.findOne({ role: 'user' });
  const trainer = await Trainer.findOne();
  
  if(client && trainer) {
    console.log('Client ID:', client._id.toString());
    console.log('Trainer ID:', trainer._id.toString());
    
    // Create a dummy chat
    const participants = [client._id, trainer._id];
    let chat = await Chat.findOne({ participants: { $all: participants } });
    if(!chat) {
       chat = await Chat.create({ participants });
       console.log('Dummy chat created!');
    } else {
       console.log('Chat already exists!');
    }
  } else {
    console.log('Could not find user or trainer');
  }
  process.exit(0);
}
setup();
