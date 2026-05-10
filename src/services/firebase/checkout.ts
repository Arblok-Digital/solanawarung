import { doc, runTransaction, serverTimestamp, collection, Transaction } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface CheckoutParams {
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  amount: number;
  sellerName: string;
}

export const processCheckout = async ({ buyerId, sellerId, productId, productName, amount, sellerName }: CheckoutParams) => {
  try {
    await runTransaction(db, async (transaction: Transaction) => {
      // 1. Get Wallet Balance
      const walletRef = doc(db, 'wallets', buyerId);
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists() || (walletDoc.data().saldo || 0) < amount) {
        throw new Error('Saldo Digital Rupiah Anda tidak cukup.');
      }

      // 2. Get Product Stock
      const productRef = doc(db, 'products', productId);
      const productDoc = await transaction.get(productRef);

      if (!productDoc.exists() || (productDoc.data().stock || 0) <= 0) {
        throw new Error('Stok produk sudah habis.');
      }

      // 3. Deduct Balance from Buyer
      transaction.update(walletRef, {
        saldo: walletDoc.data().saldo - amount,
        updatedAt: serverTimestamp()
      });

      // 4. Update Product Stock
      transaction.update(productRef, {
        stock: productDoc.data().stock - 1
      });

      // 5. Create Order
      const orderRef = doc(collection(db, 'orders'));
      transaction.set(orderRef, {
        buyerId,
        sellerId,
        productId,
        productName,
        sellerName,
        amount,
        status: 'MENUNGGU_KONFIRMASI',
        transactionSignature: 'SIMULATED-' + Date.now(),
        createdAt: serverTimestamp()
      });

      // 6. Record Transaction for Buyer
      const txRef = doc(collection(db, 'transactions'));
      transaction.set(txRef, {
        uid: buyerId,
        jumlah: amount,
        jenis: 'keluar',
        keterangan: `Pembelian ${productName}`,
        status: 'berhasil',
        timestamp: serverTimestamp()
      });

      // 7. Create Escrow Record
      const escrowRef = doc(collection(db, 'escrow'));
      transaction.set(escrowRef, {
        orderId: orderRef.id,
        buyerId,
        sellerId,
        jumlah: amount,
        status: 'HOLD',
        createdAt: serverTimestamp()
      });
    });

    return true;
  } catch (error: any) {
    console.error('Checkout failed:', error);
    throw error;
  }
};
