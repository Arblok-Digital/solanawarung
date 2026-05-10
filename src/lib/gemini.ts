import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const analyzeProductImage = async (base64Image: string) => {
  const prompt = `Analyze this UMKM product image for an Indonesian marketplace (SolanaWarung). 
  Return a JSON object with:
  - name: (a catchy product name)
  - category: (one of: Makanan, Minuman, Pakaian, Kerajinan, Elektronik, Lainnya)
  - description: (short compelling description in Indonesian)
  - estimatedPrice: (a reasonable price in Digital Rupiah/CBDC, keeping in mind 1 CBDC is roughly 1 IDR or similar scale as defined for the competition - let's assume 1 unit = 1000 IDR for simplicity in display, or just return absolute value like 15000)
  
  Only return JSON. No markdown tags.`;

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
  try {
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
  } catch (error) {
    console.error('Failed to parse Gemini response:', text);
    throw new Error('AI analysis failed to return valid JSON');
  }
};
