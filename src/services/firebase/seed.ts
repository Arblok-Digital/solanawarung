import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const MOCK_PRODUCTS = [
  { name: 'Sambal Matah Spesial', category: 'Makanan dan Minuman', price: 25000, stock: 50, description: 'Sambal khas Bali dengan bahan segar pilihan.', isAiAnalyzed: true },
  { name: 'Kopi Luwak Arabika', category: 'Makanan dan Minuman', price: 150000, stock: 20, description: 'Kopi premium dengan aroma yang sangat khas.', isAiAnalyzed: true },
  { name: 'Batik Tulis Solo', category: 'Pakaian', price: 350000, stock: 5, description: 'Batik tulis asli dengan motif parang klasik.', isAiAnalyzed: true },
  { name: 'Kripik Tempe Renyah', category: 'Makanan dan Minuman', price: 15000, stock: 100, description: 'Camilan sehat dan gurih tanpa pengawet.', isAiAnalyzed: true },
  { name: 'Tas Rotan Handmade', category: 'Kerajinan Tangan', price: 120000, stock: 15, description: 'Tas anyaman rotan estetik untuk fashion harian.', isAiAnalyzed: true },
];

export const seedDemoData = async (userId: string) => {
  if (!userId) {
    console.error('Seed Error: userId is undefined. Pastikan sudah login.');
    throw new Error('User ID tidak valid');
  }

  try {
    // Debug log untuk memastikan project ID benar
    console.log(`[SEED] Memulai Seeding pada Project: ${db.app.options.projectId}`);
    console.log('Initializing Wallet for:', userId);

    // 0. Initialize Wallet & Initial Balance
    console.log('[SEED] Creating/Updating Wallet...');
    await setDoc(doc(db, 'wallets', userId), {
      uid: userId,
      saldo: 5000000,
      updatedAt: serverTimestamp()
    });

    console.log('Cleaning existing data for:', userId);
    
    // 1. Clear Existing Products for this seller
    console.log('[SEED] Clearing Products...');
    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', userId));
    const productsSnap = await getDocs(productsQuery);
    for (const d of productsSnap.docs) {
      await deleteDoc(d.ref);
    }

    // 2. Clear Existing Orders for this seller/buyer
    console.log('[SEED] Clearing Orders...');
    const ordersQuery = query(collection(db, 'orders'), where('sellerId', '==', userId));
    const ordersSnap = await getDocs(ordersQuery);
    for (const d of ordersSnap.docs) {
      await deleteDoc(d.ref);
    }

    // Clear Existing Transactions
    console.log('[SEED] Clearing Transactions...');
    const txQuery = query(collection(db, 'transactions'), where('uid', '==', userId));
    const txSnap = await getDocs(txQuery);
    for (const d of txSnap.docs) {
      await deleteDoc(d.ref);
    }

    console.log('Clean up complete. Seeding new data...');
    
    // 3. Seed Products
    const productRefs = [];
    const IMAGE_IDS = [
      '1512132411229-c30391241dd8', // Sambal/Food (Updated)
      '1495474472287-4d71bcdd2085', // Kopi
      '1523381294911-8d3cead13475', // Batik/Cloth
      '1599487488170-d11ec9c172f0', // Kripik/Snack (Updated)
      '1584917865442-de89df76afd3'  // Tas/Craft (Updated)
    ];

    for (let i = 0; i < MOCK_PRODUCTS.length; i++) {
      const p = MOCK_PRODUCTS[i];
      const docRef = await addDoc(collection(db, 'products'), {
        ...p,
        sellerId: userId,
        status: 'aktif',
        foto: `https://images.unsplash.com/photo-${IMAGE_IDS[i]}?auto=format&fit=crop&q=80&w=400`,
        imageUrl: `https://images.unsplash.com/photo-${IMAGE_IDS[i]}?auto=format&fit=crop&q=80&w=400`, // Keep for backward compatibility
        createdAt: serverTimestamp(),
      });
      productRefs.push({ id: docRef.id, ...p });
    }

    // 4. Seed Orders (Penjualan Seminggu Terakhir)
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
        status: 'COMPLETED', // Mencerminkan Settlement (Flow 03)
        escrowId: 'escrow-' + Math.random().toString(36).substring(7),
        transactionSignature: 'SIMULATED-SEED-' + Math.random().toString(36).substring(7),
        createdAt: orderDate,
      });

      // Add to transaction ledger
      await addDoc(collection(db, 'transactions'), {
        uid: userId,
        jumlah: randomProduct.price,
        jenis: 'masuk',
        keterangan: `Penjualan ${randomProduct.name}`,
        status: 'berhasil',
        timestamp: orderDate
      });
    }

    return true;
  } catch (error) {
    console.error('[SEED ERROR]:', error);
    if (error instanceof Error && error.message.includes('permissions')) {
      console.error('SOLUSI: Ubah Firestore Security Rules di Firebase Console menjadi "allow read, write: if request.auth != null;"');
    }
    throw error;
  }
};
