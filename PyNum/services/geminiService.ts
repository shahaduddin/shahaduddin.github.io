import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const askAiTutor = async (prompt: string, context: string): Promise<string> => {
  try {
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