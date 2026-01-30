import { GoogleGenAI } from "@google/genai";

export const askAiTutor = async (prompt: string, context: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please check your environment configuration.");
    return "The AI Tutor is currently unavailable because the API Key is not configured.";
  }

  try {
    // Initialize the client only when needed to avoid startup crashes
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful expert tutor in Numerical Analysis and Python programming. 
      Context: The user is currently studying "${context}".
      
      User Question: ${prompt}
      
      Provide a concise, clear explanation. If code is needed, use Python. Format math with plain text or standard ASCII if possible.`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while contacting the AI tutor.";
  }
};
