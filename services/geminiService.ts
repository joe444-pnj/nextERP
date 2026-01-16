import { GoogleGenAI } from "@google/genai";
import { MOCK_INVENTORY, MOCK_SALES } from "../constants";

export const generateERPInsight = async (prompt: string): Promise<string> => {
  // Check for API key in env vars (Standard Vite way)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback Mock Response for Demo/GitHub
    console.warn("No API Key found. Using Mock AI response.");
    return generateMockResponse(prompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemContext = `
      You are the AI Assistant for 'Grand Market', a busy supermarket.
      You are helping a cashier or inventory manager.
      
      CURRENT INVENTORY:
      ${JSON.stringify(MOCK_INVENTORY.map(i => `${i.name}: ${i.stockLevel} units @ $${i.price}`))}
      
      TODAY'S SALES:
      ${JSON.stringify(MOCK_SALES.slice(0, 5))}

      Your role:
      - Answer questions about stock availability.
      - Suggest items to restock (low stock items).
      - Analyze sales trends briefly.
      - Keep answers short, friendly, and helpful for a busy worker.
      - Do not provide code unless asked.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Updated to stable model or use 'gemini-pro'
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      config: {
        systemInstruction: {
          parts: [{ text: systemContext }]
        },
      }
    });

    return response.response.text() || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback on error too
    return generateMockResponse(prompt);
  }
};

const generateMockResponse = (prompt: string): string => {
  const p = prompt.toLowerCase();
  if (p.includes('stock') || p.includes('inventory')) {
    const lowStock = MOCK_INVENTORY.filter(i => i.stockLevel < 10).map(i => i.name).join(', ');
    return `Based on current inventory, we have low stock on: ${lowStock}. Everything else looks good!`;
  }
  if (p.includes('sale') || p.includes('revenue')) {
    return "Sales are trending up today! Total revenue is solid. Keep up the good work.";
  }
  return "I am currently in 'Demo Mode' because no API Key was detected. I can still simulate checking your inventory! Try asking about 'low stock'.";
};