import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Initialize dot env
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected!")

    // Dynamically import models
    const User = (await import('./modules/users/user.model.js')).default
    const Trainer = (await import('./modules/trainers/trainer.model.js')).default

    console.log("Fetching Trainers...")
    const trainers = await Trainer.find({ status: 'approved' }).populate('userId', 'name email')
    
    let dbText = `\n\n## Live Database Context (Trainers)\n`
    if (trainers.length === 0) {
      dbText += "Currently, there are no approved trainers in the system.\n"
    } else {
      trainers.forEach(t => {
        if (t.userId) {
          dbText += `Trainer Name: ${t.userId.name}. Role: ${t.role}. Specialties: ${t.specialties.join(', ')}. Languages: ${t.languagesSpoken.join(', ')}. Bio: ${t.bio}. Rating: ${t.rating} stars. Price: ${t.pricing?.wellnessMonthly || 0} INR.\n`
        }
      })
    }

    console.log("Fetching Users Overview...")
    const userCount = await User.countDocuments({ role: 'user' })
    dbText += `\n## Live Database Context (Users)\n`
    dbText += `The FitForge platform currently has ${userCount} active users registered.\n`

    // Fetch README
    console.log("Reading frontend README.md...")
    const readmePath = path.join(__dirname, '..', 'frontend', 'README.md')
    let readmeText = ""
    if (fs.existsSync(readmePath)) {
      readmeText = fs.readFileSync(readmePath, 'utf-8')
    } else {
      console.warn("frontend/README.md not found.")
    }

    // Append to knowledge base
    const kbPath = path.join(__dirname, 'modules', 'rag', 'knowledge_base.txt')
    
    // We add a separator to ensure chunking works well
    const textToAppend = `\n\n## About the Codebase (README)\n${readmeText}\n\n${dbText}\n`
    
    fs.appendFileSync(kbPath, textToAppend, 'utf-8')

    console.log("Successfully extracted database and README to knowledge_base.txt!")
    console.log("You can now restart your backend server to re-initialize RAG.")
    
  } catch (error) {
    console.error("Extraction failed:", error)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

run()
