import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductAnalysis } from '../../types';

// WARNING: Exposing API Key in client is insecure for production.
// Move to server-side proxy for production deployment.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error("PENTING: VITE_GEMINI_API_KEY belum terpasang di .env! Fitur Scan Foto tidak akan jalan.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

// --- FUNGSI SEMENTARA UNTUK DEBUGGING MODEL ---
export const checkModels = async () => {
  console.log("--- Memeriksa Model Gemini yang Tersedia ---");
  try {
    const { models } = await genAI.listModels();
    for (const model of models) {
      console.log(`Nama Model: ${model.name}, Versi: ${model.version}, Supports generateContent: ${model.supportedGenerationMethods?.includes('generateContent')}`);
    }
    console.log("--- Selesai Memeriksa Model ---");
    console.log("Cari model yang 'supportedGenerationMethods' nya mengandung 'generateContent'.");
    console.log("Jika 'gemini-2.5-flash' tidak muncul atau tidak mendukung generateContent, gunakan nama model yang lain.");
  } catch (error) {
    console.error("Gagal mengambil daftar model:", error);
    console.error("Pastikan API Key Anda valid dan 'Generative Language API' sudah di-enable di Google Cloud Console.");
  }
};
// --- AKHIR FUNGSI SEMENTARA ---

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysis> => {
  const prompt = `Analisis gambar produk UMKM ini untuk marketplace Indonesia (SolanaWarung).
  Berikan respons dalam format JSON dengan field berikut:
  - name: (nama produk yang menarik)
  - category: (pilih satu: Makanan, Minuman, Fashion, Kerajinan, Elektronik, Digital, Jasa, Lainnya)
  - description: (deskripsi singkat dan persuasif dalam Bahasa Indonesia)
  - estimatedPrice: (harga wajar dalam Rupiah, berikan angka bulat saja contoh: 15000)
  
  PENTING: Gunakan kategori yang paling sesuai dari daftar di atas.
  Hanya kembalikan JSON murni.`;

  try {
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
        ]
      }],
      generationConfig: {
        temperature: 0.4,
      }
    });

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
