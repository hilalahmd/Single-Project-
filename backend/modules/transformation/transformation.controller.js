import axios from 'axios';
import https from 'https';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Analyze Endpoint (Using Free Gemini API)
export const analyzeTransformation = async (req, res) => {
  try {
    const { images, goal } = req.body; 
    
    if (!images || !images.front) {
      return res.status(400).json({ message: "Front image is required for analysis." });
    }

    console.log("Analyzing image with Gemini (Free)...");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const base64Data = images.front.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Analyze this person's body based on their goal: "${goal}".
Return ONLY a valid JSON object in this exact format, with NO markdown code blocks:
{
  "currentAnalysis": {
    "estimatedBodyFat": "XX%",
    "bodyType": "Brief description",
    "visibleStrengths": "E.g., Good shoulder width",
    "keyAreas": "Areas to focus on"
  },
  "timelines": {
    "threeMonths": {
      "label": "3 Months",
      "projectedBodyFat": "XX%",
      "keyChanges": "Subtle progress description",
      "imagePrompt": "A photorealistic full-body shot of a person. Goal: ${goal}. Very subtle 3 months workout progress. The changes should be BARELY visible. Natural human body, unedited smartphone photo."
    },
    "sixMonths": {
      "label": "6 Months",
      "projectedBodyFat": "XX%",
      "keyChanges": "Noticeable progress",
      "imagePrompt": "A photorealistic full-body shot of a person. Goal: ${goal}. Realistic 6 months natural fitness progress. Noticeably slimmer and toned, but still a normal natural human body."
    },
    "oneYear": {
      "label": "1 Year",
      "projectedBodyFat": "XX%",
      "keyChanges": "Major transformation",
      "imagePrompt": "A photorealistic full-body shot of a person. Goal: ${goal}. 1 year fitness progress. Very fit and athletic natural body."
    }
  }
}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
    ]);

    let responseText = result.response.text();
    responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    const analysisJson = JSON.parse(responseText);

    res.json({ analysis: analysisJson });

  } catch (error) {
    console.error('Gemini Analysis error:', error);
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
}

// 2. Generate Image Endpoint (Stability AI SD3 - Handles any image size)
export const generateTransformationImage = async (req, res) => {
  try {
    const { prompt, originalImageBase64 } = req.body;

    if (!prompt || !originalImageBase64) {
      return res.status(400).json({ message: 'Image prompt and original photo are required.' });
    }

    console.log("Generating image using Stability AI SD3 Image-to-Image...");

    // Clean base64 string and create Blob
    const base64Data = originalImageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });

    // Prepare Multipart Form Data for SD3 API
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    formData.append('prompt', prompt);
    formData.append('mode', 'image-to-image');
    formData.append('strength', '0.65'); // 0.65 keeps body structure and face similar
    formData.append('model', 'sd3-medium');
    formData.append('output_format', 'jpeg');

    // Make API request using native fetch
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
       const err = await response.text();
       throw new Error(`Stability API Error: ${err}`);
    }

    const data = await response.json();
    const base64Image = data.image; // v2beta returns 'image' directly
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    res.json({ imageUrl });

  } catch (error) {
    console.error('Stability AI Error:', error.message);
    res.status(500).json({ message: 'Failed to generate image.' });
  }
}

