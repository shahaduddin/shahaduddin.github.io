
import { GoogleGenAI } from "@google/genai";

export const askAiTutor = async (prompt: string, context: string): Promise<string> => {
  // process.env.API_KEY is defined via vite.config.ts 'define'
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Gemini API Key is missing. Please check your environment configuration.");
    return "The AI Tutor is currently unavailable because the API Key is not configured.";
  }

  try {
    // Correct initialization using named parameter
    const ai = new GoogleGenAI({ apiKey });
    
    /**
     * Using 'gemini-3-pro-preview' for Complex Text Tasks (Math & STEM).
     * This model provides much better accuracy for numerical analysis logic.
     */
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a helpful expert tutor in Numerical Analysis, Mathematics, and scientific programming (Python/Fortran). 
      
      The user is currently exploring the topic: "${context}".
      
      User Question: ${prompt}
      
      Instruction: 
      - Provide a concise, mathematically rigorous yet clear explanation. 
      - Use Python code snippets if helpful for implementation.
      - Format math using standard ASCII or clear text notation (e.g., x^2, sqrt(x), sum from i=0 to n).
      - If the question is irrelevant to numerical methods or math, politely redirect the user back to the studio's topics.`,
    });
    
    // Access response.text property directly as per latest SDK guidelines
    return response.text || "I processed your request but couldn't generate a text response. Please try rephrasing.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Graceful error handling for common API issues
    if (error instanceof Error && error.message.includes("API key not valid")) {
      return "The provided API key is invalid. Please check your system configuration.";
    }
    
    return "Sorry, I encountered an error while processing your request. Please try again in a moment.";
  }
};
