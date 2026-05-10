import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const MOCK_PRODUCTS = [
  { name: 'Sambal Matah Spesial', category: 'Makanan', price: 25000, stock: 50, description: 'Sambal khas Bali dengan bahan segar pilihan.' },
  { name: 'Kopi Luwak Arabika', category: 'Minuman', price: 150000, stock: 20, description: 'Kopi premium dengan aroma yang sangat khas.' },
  { name: 'Batik Tulis Solo', category: 'Pakaian', price: 350000, stock: 5, description: 'Batik tulis asli dengan motif parang klasik.' },
  { name: 'Kripik Tempe Renyah', category: 'Makanan', price: 15000, stock: 100, description: 'Camilan sehat dan gurih tanpa pengawet.' },
  { name: 'Tas Rotan Handmade', category: 'Kerajinan', price: 120000, stock: 15, description: 'Tas anyaman rotan estetik untuk fashion harian.' },
];

export const seedDemoData = async (userId: string) => {
  try {
    console.log('Seeding demo data for:', userId);
    
    // 1. Seed Products
    const productRefs = [];
    const IMAGE_IDS = [
      '1586201375761-83865001e31c', // Sambal
      '1495474472287-4d71bcdd2085', // Kopi
      '1523381294911-8d3cead13475', // Batik
      '1621939514649-280e2ee10f6a', // Tempe
      '1590736961143-74073bc6363a'  // Tas
    ];

    for (let i = 0; i < MOCK_PRODUCTS.length; i++) {
      const p = MOCK_PRODUCTS[i];
      const docRef = await addDoc(collection(db, 'products'), {
        ...p,
        sellerId: userId,
        imageUrl: `https://images.unsplash.com/photo-${IMAGE_IDS[i]}?auto=format&fit=crop&q=80&w=400`,
        createdAt: serverTimestamp(),
      });
      productRefs.push({ id: docRef.id, ...p });
    }

    // 2. Seed Orders (Penjualan Seminggu Terakhir)
    const now = new Date();
    for (let i = 0; i < 15; i++) {
      const randomProduct = productRefs[Math.floor(Math.random() * productRefs.length)];
      const randomDayAgo = Math.floor(Math.random() * 7);
      const orderDate = new Date();
      orderDate.setDate(now.getDate() - randomDayAgo);

      await addDoc(collection(db, 'orders'), {
        buyerId: 'demo-buyer-id',
        sellerId: userId,
        productId: randomProduct.id,
        productName: randomProduct.name,
        amount: randomProduct.price,
        status: 'COMPLETED',
        transactionSignature: 'SIMULATED-SEED-' + Math.random().toString(36).substring(7),
        createdAt: orderDate,
      });
    }

    return true;
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
};
