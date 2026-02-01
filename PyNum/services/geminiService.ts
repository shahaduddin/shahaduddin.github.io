
import { GoogleGenAI } from "@google/genai";

/**
 * Expert tutor in Numerical Analysis.
 * Optimized with gemini-3-flash-preview for high performance and reliability.
 */
export const askAiTutor = async (prompt: string, context: string): Promise<string> => {
  // Robustly extract the API Key provided by Vite's 'define'
  let apiKey = '';
  try {
    // This is replaced by a string literal during build by Vite
    apiKey = process.env.API_KEY || '';
  } catch (e) {
    console.error("AI Tutor Config Error: process.env.API_KEY is not defined in this environment.", e);
  }

  // Pre-flight check for API Key presence
  if (!apiKey || apiKey === "undefined" || apiKey === '""') {
    return "The AI Tutor is currently offline. Please ensure your 'GEMINI_API_KEY' is correctly configured in your project secrets.";
  }

  try {
    // Initializing SDK as per Google GenAI guidelines
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful expert tutor in Numerical Analysis, Mathematics, and scientific programming (Python/Fortran). 
      
      The user is exploring: "${context}".
      
      User Question: ${prompt}
      
      Instructions: 
      - Provide a concise, mathematically rigorous yet clear explanation. 
      - Use Python or Fortran code snippets if helpful for implementation.
      - Use standard math notation (e.g., x^2, sqrt(x), sum from i=0 to n).
      - Maintain a professional academic tone.`,
    });
    
    // Direct property access for the generated text
    const text = response.text;
    
    if (!text) {
      throw new Error("The AI model returned an empty response.");
    }
    
    return text;
  } catch (error: any) {
    console.error("Gemini AI Tutor Error:", error);

    // Provide specific feedback for common configuration issues
    if (error?.message?.includes("API_KEY_INVALID") || error?.status === 403) {
      return "Critical Error: The provided Gemini API Key is invalid or has expired. Please update your environment secrets.";
    }
    
    if (error?.message?.includes("model not found") || error?.status === 404) {
      return "Model Error: 'gemini-3-flash-preview' is currently restricted or unavailable for your API key.";
    }

    // Fallback error message with specific detail to help the user debug
    return `AI Tutor Error: ${error?.message || 'Connection timed out. Please try again in a moment.'}`;
  }
};
