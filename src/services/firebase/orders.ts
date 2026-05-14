import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  runTransaction,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order, OrderStatus } from '../../types';

const COLLECTION_NAME = 'orders';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...orderData,
    createdAt: serverTimestamp(),
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus, signature?: string) => {
  return await runTransaction(db, async (transaction) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const orderDoc = await transaction.get(docRef);
    
    if (!orderDoc.exists()) {
      throw new Error("Pesanan tidak ditemukan");
    }

    const orderData = orderDoc.data() as Order;
    const updateData: any = { 
      status,
      updatedAt: serverTimestamp()
    };
    
    if (signature) {
      updateData.transactionSignature = signature;
    }

    // FLOW 03: Escrow Release Logic
    // Jika status berubah menjadi COMPLETED, tambahkan saldo ke seller
    if (status === 'COMPLETED' && orderData.status !== 'COMPLETED') {
      const sellerWalletRef = doc(db, 'wallets', orderData.sellerId);
      const sellerWalletDoc = await transaction.get(sellerWalletRef);

      if (sellerWalletDoc.exists()) {
        const currentSaldo = sellerWalletDoc.data().saldo || 0;
        
        // Update Saldo Seller
        transaction.update(sellerWalletRef, {
          saldo: currentSaldo + orderData.amount,
          updatedAt: serverTimestamp()
        });

        // Catat di Ledger Transaksi Seller
        const txRef = doc(collection(db, 'transactions'));
        transaction.set(txRef, {
          uid: orderData.sellerId,
          jumlah: orderData.amount,
          jenis: 'masuk',
          keterangan: `Pencairan dana pesanan #${id.substring(0, 5)}`,
          status: 'berhasil',
          timestamp: serverTimestamp()
        });
      }
    }

    transaction.update(docRef, updateData);
  });
};

export const subscribeToUserOrders = (userId: string, role: 'buyer' | 'seller', callback: (orders: Order[]) => void) => {
  const field = role === 'buyer' ? 'buyerId' : 'sellerId';
  const q = query(
    collection(db, COLLECTION_NAME), 
    where(field, '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    callback(orders);
  });
};
