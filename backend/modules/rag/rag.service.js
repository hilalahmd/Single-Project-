import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

// 1. Vector Store (Database)
const vectorStore = []

// 2. Cosine Similarity (Maths)
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// 3. Get Embedding API
async function getEmbedding(text) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "embedding-001" }) 
  const result = await model.embedContent(text)
  return result.embedding.values
}

// 4. Initialize RAG
export async function initializeRAG() {
  console.log("🤖 Initializing RAG Engine...")
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    const filePath = path.join(__dirname, 'knowledge_base.txt')
    if (!fs.existsSync(filePath)) return console.warn("⚠️ knowledge_base.txt missing!")
    
    const text = fs.readFileSync(filePath, 'utf-8')
    const chunks = text.split('\n\n').filter(chunk => chunk.trim().length > 10)
    
    vectorStore.length = 0 
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk)
      vectorStore.push({ text: chunk.trim(), embedding: embedding })
    }
    console.log("✅ RAG Knowledge Base successfully loaded into Vector Memory!")
  } catch (error) {
    console.error("❌ Error initializing RAG:", error.message)
  }
}

// 5. Search Function
export async function searchKnowledgeBase(query, topK = 3) {
  if (vectorStore.length === 0) return "" 
  const queryEmbedding = await getEmbedding(query)
  const results = vectorStore.map(item => ({
    text: item.text,
    score: cosineSimilarity(queryEmbedding, item.embedding)
  }))
  results.sort((a, b) => b.score - a.score)
  const topMatches = results.slice(0, topK)
  return topMatches.map(match => match.text).join('\n\n')
}

// 6. Generate Answer (The Chatbot)
export async function askRAGChatbot(query) {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing!')
  
  const context = await searchKnowledgeBase(query)
  const prompt = `
You are FitForge AI, a helpful and knowledgeable fitness assistant.
Use the following pieces of retrieved context to answer the user's question. 
If you don't know the answer based on the context, you can use your general fitness knowledge, but prioritize the context if it's relevant.
Keep the answer concise, friendly and use markdown formatting (bolding, bullet points) to make it look good.

--- RETRIEVED CONTEXT ---
${context}
-------------------------

User Question: ${query}
Answer:`

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) 
  const result = await model.generateContent(prompt)
  return result.response.text()
}
