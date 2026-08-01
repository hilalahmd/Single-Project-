<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,100:434343&height=180&section=header&text=FitForge&fontSize=45&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=AI-Powered%20Fitness%20Ecosystem&descAlignY=55&descSize=18"/>

<a href="https://fitforge-hd.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white"/></a>
<img src="https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=react&logoColor=white" alt="MERN Stack" />
<img src="https://img.shields.io/badge/AI_Powered-Gemini_&_RAG-000000?style=for-the-badge&logo=google&logoColor=white" alt="AI Powered" />
<img src="https://img.shields.io/badge/WebRTC-Live_Video-000000?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC" />

<p><strong>An intelligent, real-time, AI-driven fitness coaching platform built with the MERN stack.</strong></p>

</div>

---

## 📖 Overview

**FitForge** is a comprehensive, multi-role health and fitness platform that bridges the gap between fitness enthusiasts, certified personal trainers, and management. By leveraging cutting-edge **Generative AI**, **Vision AI**, and **Real-Time Communication Protocols**, FitForge delivers a highly personalized, interactive, and automated fitness experience.

Unlike standard fitness apps, FitForge features a custom **Retrieval-Augmented Generation (RAG)** engine for intelligent health queries, seamless **1-on-1 WebRTC Video Coaching**, and an automated **Food Macro Analysis Pipeline** powered by Google Gemini Vision AI.

---

## ✨ Key Features

### 🤖 AI-Powered Innovations
- **Vision AI Food Tracker:** Upload meal images to automatically detect the food and calculate accurate nutritional macros (Protein, Carbs, Fats) using the Google Gemini Vision API and Cloudinary.
- **Generative AI Plan Builder:** Instantly generates highly personalized 30-day workout and diet plans based on user biometrics (BMR, TDEE), goals, and cultural dietary preferences.
- **RAG Chatbot Assistant:** A custom-built vector memory chatbot that acts as a 24/7 fitness assistant, providing context-aware answers to complex health queries.

### ⚡ Real-Time Infrastructure
- **Live 1-on-3 Video Sessions:** Built-in video coaching powered by raw **WebRTC** and **Socket.io** signaling for ultra-low latency, peer-to-peer fitness classes.
- **Instant Messaging & Presence:** Real-time chat functionality and live user-status tracking across the entire platform.

### 🔐 Multi-Tier Architecture & Security
- **Role-Based Access Control (RBAC):** Secure routing and tailored dashboards for 4 distinct roles: **Admin, Manager, Trainer, and Client**.
- **Robust Security:** JWT-based stateless authentication with HttpOnly cookies, bcrypt password hashing, rate limiting, and Helmet.js header security.

### 📈 Scalability & Performance
- **Cloud Media Streaming:** Integrated with **Cloudinary** for image processing and delivery, drastically reducing the MongoDB storage footprint.
- **Advanced Aggregations:** Complex MongoDB aggregation pipelines powering the Admin and Manager dashboards to track revenue, trainer performance, and user engagement metrics instantly.

---

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,tailwind&theme=light" height="45"/>
<img src="https://skillicons.dev/icons?i=nodejs,express,socketio&theme=light" height="45"/>
<img src="https://skillicons.dev/icons?i=mongodb&theme=light" height="45"/>
<img src="https://skillicons.dev/icons?i=git,github,vercel,render&theme=light" height="45"/>

</div>

### **Frontend**
- **React.js** (Vite)
- **Tailwind CSS** (Responsive UI)
- **React Router** (Protected routing)
- **Context API & Hooks** (State Management)
- **Framer Motion** (Fluid micro-animations)

### **Backend**
- **Node.js & Express.js** (RESTful APIs)
- **MongoDB & Mongoose** (Database & ODM)
- **Socket.io** (Real-time signaling & Chat)
- **WebRTC** (P2P Video Streaming)

### **AI & Cloud Integrations**
- **Google Gemini API** (Vision & Text Generation)
- **Custom RAG Engine** (Vector Embeddings & Contextual Chat)
- **Cloudinary** (Cloud Media Storage)
- **JWT & bcrypt** (Security)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Google Gemini API Key

### Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/hilalahmd/FitForge.git
   cd FitForge
```

2. **Install Dependencies:**
```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
```

3. **Set up Environment Variables:**
   Create a `.env` file in the `backend` directory and add the following:
```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. **Run the Application:**
```bash
   # Start the backend server (from /backend)
   npm run dev

   # Start the frontend client (from /frontend)
   npm run dev
```

---

## 🛡️ Architecture & Folder Structure

The project follows a highly modular, clean architecture separating concerns into distinct routes, controllers, models, and services.
