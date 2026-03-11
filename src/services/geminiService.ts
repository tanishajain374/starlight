import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Message {
  role: "user" | "model";
  text: string;
}

export async function chatWithMcBot(message: string, history: Message[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the Domino's Assistant, a helpful guide for the Domino's India website. 
        Your knowledge base is strictly limited to the information found on https://www.dominos.co.in/. 
        Help users with menu items, prices, current offers, and store locations.
        Maintain a friendly, professional, and enthusiastic tone. Use pizza-related emojis! 🍕🍕🍕`,
        tools: [{ urlContext: {} }]
      },
    });

    // The URL context tool needs the URL in the prompt or as a part of the request if not explicitly supported in the SDK's high level contents yet for this specific tool.
    // Actually, the documentation says: "The URL context tool lets you provide additional context... by including URLs in your request".
    // I will add the URL to the prompt to be safe and effective.
    
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Oops! Something went wrong in the kitchen. Please try again later.";
  }
}
