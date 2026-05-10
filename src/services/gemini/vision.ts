import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductAnalysis } from '../../types';

// WARNING: Exposing API Key in client is insecure for production.
// Move to server-side proxy for production deployment.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
// Menggunakan model gemini-1.5-flash yang stabil
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysis> => {
  const prompt = `Analyze this UMKM product image for an Indonesian marketplace (SolanaWarung). 
  Return a JSON object with:
  - name: (a catchy product name)
  - category: (one of: Makanan, Minuman, Pakaian, Kerajinan, Elektronik, Lainnya)
  - description: (short compelling description in Indonesian)
  - estimatedPrice: (a reasonable price in Digital Rupiah/CBDC, where 1 unit = 1000 IDR approx. Return an absolute number like 15000)
  
  Only return JSON. No markdown tags.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as ProductAnalysis;
  } catch (error) {
    console.error('Gemini Vision error:', error);
    throw new Error('AI analysis failed to analyze product image');
  }
};
