import { GoogleGenerativeAI } from '@google/generative-ai';
import { Order, Product } from '../../types';

// Retrieve the API key from Vite's env variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Gemini API Key is missing. Analytics will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export interface BusinessInsight {
  summary: string;
  recommendations: string[];
  predictedTrend: 'up' | 'down' | 'stable';
  actionableStep: string;
}

export const generateBusinessInsights = async (
  products: Product[],
  orders: Order[]
): Promise<BusinessInsight | null> => {
  if (!apiKey) return null;
  if (products.length === 0 && orders.length === 0) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert Business Analyst for Indonesian micro-businesses (UMKM).
      Analyze the following data for a 'Warung' (shop) on a Solana-based marketplace.
      
      Products:
      ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, stock: p.stock, category: p.category })))}
      
      Recent Orders:
      ${JSON.stringify(orders.map(o => ({ productName: o.productName, amount: o.amount, status: o.status })))}
      
      Provide a highly concise, professional, and actionable business insight in Indonesian.
      Return EXACTLY in this JSON format without markdown wrapping:
      {
        "summary": "Short 2 sentence overview of sales health",
        "recommendations": ["Tip 1", "Tip 2"],
        "predictedTrend": "up" | "down" | "stable",
        "actionableStep": "One immediate action the seller should take today"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean up potential markdown from the response
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText) as BusinessInsight;
    
  } catch (error) {
    console.error('Failed to generate business insights:', error);
    return null;
  }
};
