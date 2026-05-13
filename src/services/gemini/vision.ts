import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductAnalysis } from '../../types';

// WARNING: Exposing API Key in client is insecure for production.
// Move to server-side proxy for production deployment.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error("PENTING: VITE_GEMINI_API_KEY belum terpasang di .env! Fitur Scan Foto tidak akan jalan.");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Menggunakan model gemini-1.5-flash yang stabil
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: "application/json"
  }
});

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysis> => {
  const prompt = `Analisis gambar produk UMKM ini untuk marketplace Indonesia (SolanaWarung).
  Berikan respons dalam format JSON dengan field berikut:
  - name: (nama produk yang menarik)
  - category: (pilih satu: Makanan dan Minuman, Kerajinan Tangan, Pakaian, Pertanian, Elektronik, Lainnya)
  - description: (deskripsi singkat dan persuasif dalam Bahasa Indonesia)
  - estimatedPrice: (harga wajar dalam Rupiah, berikan angka bulat saja contoh: 15000)
  
  Hanya kembalikan JSON murni.`;

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
    
    if (!text) throw new Error('AI tidak memberikan respon');

    try {
      // Pembersihan JSON untuk menangani output markdown
      const cleanJson = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      return JSON.parse(cleanJson) as ProductAnalysis;
    } catch (e) {
      console.error('Parsing error in Vision:', text);
      throw new Error('Gagal memproses data produk dari AI');
    }

  } catch (error) {
    console.error('Gemini Vision error:', error);
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error('Model AI tidak ditemukan (404). Pastikan "Generative Language API" sudah ENABLED di Google Cloud Console.');
    }
    if (error instanceof Error && error.message.includes('403')) {
      throw new Error('Akses AI Ditolak (403). Periksa izin Service Account pada API Key "solana warung".');
    }
    if (error instanceof Error && error.message.includes('fetch')) {
      throw new Error('Gagal menghubungi server Gemini. Periksa koneksi atau validitas API Key di .env.');
    }
    throw new Error('Gagal menganalisis gambar. Pastikan API Key di .env sudah benar.');
  }
};
