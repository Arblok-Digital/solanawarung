// @ts-nocheck
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Order, Product } from '../../types';

// Retrieve the API key from Vite's env variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Gemini API Key is missing. Analytics will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey ?? '');

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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Anda adalah ahli Analisis Bisnis untuk UMKM Indonesia.
      Analisis data berikut untuk sebuah 'Warung' di marketplace SolanaWarung yang menggunakan Digital Rupiah.
      
      Data Produk:
      ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price, stock: p.stock, category: p.category })))}
      
      Data Pesanan Terakhir:
      ${JSON.stringify(orders.map(o => ({ productName: o.productName, amount: o.amount, status: o.status })))}
      
      Berikan insight bisnis yang sangat ringkas, profesional, dan mudah dipahami dalam Bahasa Indonesia.
      Kembalikan data HANYA dalam format JSON ini:
      {
        "summary": "Ringkasan maksimal 2 kalimat tentang kondisi penjualan saat ini",
        "recommendations": ["Tips praktis 1", "Tips praktis 2"],
        "predictedTrend": "up" | "down" | "stable",
        "actionableStep": "Satu langkah nyata yang harus dilakukan penjual hari ini"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return JSON.parse(text) as BusinessInsight;
    
  } catch (error) {
    console.error('Failed to generate business insights:', error);
    return null;
  }
};
