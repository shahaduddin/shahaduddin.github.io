
import { GoogleGenAI } from "@google/genai";

/**
 * Expert tutor in Numerical Analysis using 'gemini-3-pro-preview'.
 * The API key is injected at build time by Vite from process.env.API_KEY.
 */
export const askAiTutor = async (prompt: string, context: string): Promise<string> => {
  try {
    // Initialize exactly as specified: new GoogleGenAI({ apiKey: process.env.API_KEY })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
    
    if (error instanceof Error && (error.message.includes("API_KEY_INVALID") || error.message.includes("not found"))) {
      return "The AI service is misconfigured. Please verify the API key in system settings.";
    }
    
    return "Sorry, I encountered an error while processing your request. Please try again in a moment.";
  }
};
