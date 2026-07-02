import { GoogleGenerativeAI } from '@google/generative-ai'

export function getGenAI() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}
