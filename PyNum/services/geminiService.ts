import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the Google GenAI SDK
// Hard requirement: Use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends a message history to the Gemini AI tutor for a context-aware response.
 * @param history The current list of messages in the chat session.
 * @param context The specific numerical analysis topic being studied.
 */
export const askAiTutor = async (history: ChatMessage[], context: string): Promise<string> => {
  try {
    // Format the conversation history for the model
    const conversationStr = history.map(msg => 
      `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.text}`
    ).join('\n');

    const prompt = `You are a world-class expert tutor in Numerical Analysis and Python programming. 
Context: The student is currently studying the algorithm or topic: "${context}".

Instruction: Provide a concise, clear, and mathematically rigorous explanation. If the student asks for code, provide clean, idiomatic Python. Use LaTeX or clear ASCII for mathematical formulas.

Conversation History:
${conversationStr}

Assistant:`;

    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex STEM and coding tasks
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    // Access .text as a property, not a method
    return response.text || "I'm sorry, I couldn't generate a helpful response right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Check for specific common errors
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
      return "Error: The AI model is currently unavailable or the API key is invalid. Please verify your configuration.";
    }
    
    return "Sorry, I encountered an error while contacting the AI tutor. Please try again in a moment.";
  }
};