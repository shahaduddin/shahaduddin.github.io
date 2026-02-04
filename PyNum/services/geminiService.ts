import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Sends a message history to the Gemini AI tutor.
 * Initializes the client only when needed to prevent app crashes on load.
 */
export const askAiTutor = async (history: ChatMessage[], context: string): Promise<string> => {
  try {
    // 1. Retrieve Key (Support both Vite standard and your custom define)
    // Note: In Vite, it's best practice to use import.meta.env.VITE_GEMINI_API_KEY
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

    // 2. Safety Check: If no key, return a polite message instead of crashing
    if (!apiKey) {
      console.warn("Gemini API Key is missing.");
      return "System Error: API Key is not configured. Please contact the administrator.";
    }

    // 3. Initialize Client LAZILY (Just-in-time)
    const ai = new GoogleGenAI({ apiKey });

    // Format the conversation history
    const conversationStr = history.map(msg => 
      `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.text}`
    ).join('\n');

    const prompt = `You are a world-class expert tutor in Numerical Analysis and Python programming. 
Context: The student is currently studying the algorithm or topic: "${context}".

Instruction: Provide a concise, clear, and mathematically rigorous explanation. If the student asks for code, provide clean, idiomatic Python. Use LaTeX or clear ASCII for mathematical formulas.

Conversation History:
${conversationStr}

Assistant:`;

    // 4. Generate Content
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Switched to Flash (faster/cheaper) or use 'gemini-1.5-pro'
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    // 5. Safe Response Handling
    // The new SDK structure might require navigating the response object differently
    const answer = response.text?.(); 
    
    return answer || "I'm sorry, I couldn't generate a helpful response right now.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Graceful error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) return "Configuration Error: Invalid API Key.";
      if (error.message.includes("404")) return "Error: Model unavailable.";
    }
    
    return "Sorry, I encountered an error while contacting the AI tutor. Please try again in a moment.";
  }
};