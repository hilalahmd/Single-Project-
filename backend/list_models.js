import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    console.log("Checking API Key format:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    
    // Using fetch directly to debug the API response
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    
    if (data.error) {
      console.error("API ERROR:", data.error.message);
      console.error("DETAILS:", data.error.details);
    } else {
      console.log("AVAILABLE MODELS:");
      data.models.forEach(m => console.log(m.name));
    }
  } catch (error) {
    console.error("FAILED:", error);
  }
}
run();
