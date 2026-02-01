
import { GoogleGenAI } from "@google/genai";

export const askAiTutor = async (prompt: string, context: string): Promise<string> => {
  // Use process.env.API_KEY directly as required by guidelines
  if (!process.env.API_KEY) {
    console.error("Gemini API Key is missing.");
    return "The AI Tutor is currently unavailable because the API Key is not configured.";
  }

  try {
    // Correct initialization using named parameter and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for educational tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful expert tutor in Numerical Analysis and Python programming. 
      Context: The user is currently studying "${context}".
      
      User Question: ${prompt}
      
      Provide a concise, clear explanation. If code is needed, use Python. Format math with plain text or standard ASCII if possible.`,
    });
    
    // Access .text property directly (not a method)
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while contacting the AI tutor.";
  }
};
