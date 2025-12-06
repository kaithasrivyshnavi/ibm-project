import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Classification } from "../types";

const GEMINI_MODEL = "gemini-2.5-flash"; // Fast and capable multimodal model

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are an expert image forensic analyst specializing in detecting AI-generated synthetic media (Deepfakes, Midjourney, Stable Diffusion, DALL-E).
      
      Analyze the provided image meticulously. Look for the following common AI generation artifacts:
      1. Texture Irregularities: Over-smoothing of skin, plastic-like hair, or strange fabric patterns.
      2. Anatomical Mistakes: Incorrect number of fingers, asymmetrical eyes, malformed ears, or strange limb positioning.
      3. Lighting Inconsistencies: Shadows that don't match light sources, impossible reflections in eyes or mirrors.
      4. Background Logic: Nonsensical objects, blurring that doesn't follow depth-of-field rules, or warped architecture.
      5. Text/Details: Garbled text or illegible signs in the background.

      Provide a JSON response with a strict classification, a confidence score (0-100), detailed reasoning, and specific metric scores.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: {
              type: Type.STRING,
              enum: ["REAL", "AI", "UNCERTAIN"],
              description: "The final verdict: REAL, AI, or UNCERTAIN.",
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Confidence in the classification from 0 to 100.",
            },
            summary: {
              type: Type.STRING,
              description: "A one-sentence summary of the finding.",
            },
            detailedReasoning: {
              type: Type.STRING,
              description: "A detailed paragraph explaining why the model made this decision, citing specific visual evidence.",
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                textureQuality: { type: Type.NUMBER, description: "0-100 score on natural texture." },
                lightingConsistency: { type: Type.NUMBER, description: "0-100 score on logical lighting." },
                anatomicalCorrectness: { type: Type.NUMBER, description: "0-100 score on anatomy (hands, eyes, etc)." },
                backgroundLogic: { type: Type.NUMBER, description: "0-100 score on background coherence." },
                noisePattern: { type: Type.NUMBER, description: "0-100 score on natural pixel noise." },
              },
              required: ["textureQuality", "lightingConsistency", "anatomicalCorrectness", "backgroundLogic", "noisePattern"],
            },
            detectedArtifacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific artifacts found (e.g., '6 fingers', 'mismatched earrings').",
            },
          },
          required: ["classification", "confidenceScore", "summary", "detailedReasoning", "metrics", "detectedArtifacts"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini.");
    }

    const data = JSON.parse(text) as AnalysisResult;
    return data;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};
