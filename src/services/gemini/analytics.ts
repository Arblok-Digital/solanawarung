import { GoogleGenerativeAI } from '@google/generative-ai';
import { Order, Product } from '../../types';

// Retrieve the API key from Vite's env variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("PENTING: VITE_GEMINI_API_KEY belum terpasang di .env! Fitur Analitik tidak akan jalan.");
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
  if (!apiKey) {
    console.warn("generateBusinessInsights dibatalkan: API Key kosong.");
    return null;
  }
  
  // Minimal data check to avoid empty prompts
  if (products.length === 0) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
      }
    });
    
    const response = result.response;
    let text = response.text().trim();
    
    try {
      // Pembersihan JSON yang lebih agresif untuk mencegah error parsing
      const cleanJson = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleanJson) as BusinessInsight;
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON response:', text);
      return {
        summary: "Gagal menganalisis data saat ini.",
        recommendations: ["Coba lagi dalam beberapa saat"],
        predictedTrend: "stable",
        actionableStep: "Refresh halaman dashboard"
      };
    }
  } catch (error) {
    console.error('Failed to generate business insights:', error);
    if (error instanceof Error && error.message.includes('404')) {
      console.warn("TIP: Error 404. Pastikan 'Generative Language API' sudah di-enable di project gen-lang-client-0343011251.");
    }
    if (error instanceof Error && error.message.includes('403')) {
      console.warn("TIP: Error 403. Cek apakah Service Account 'vertex-express' punya role 'Generative Language Client' di IAM.");
    }
    return null;
  }
};
