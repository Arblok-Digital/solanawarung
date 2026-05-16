import { doc, runTransaction, serverTimestamp, collection, Transaction } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { OrderStatus } from '../../types';

interface CheckoutParams {
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  amount: number;
  sellerName: string;
  txHash?: string;
  orderId?: string;
}

/**
 * FLOW 02: Checkout (Invisible Blockchain)
 * Menggunakan Firestore Transaction (R09) untuk menjamin saldo & stok sinkron.
 */
export const processCheckout = async ({ buyerId, sellerId, productId, productName, amount, sellerName, txHash, orderId }: CheckoutParams) => {
  return await runTransaction(db, async (transaction: Transaction) => {
    // 0. Idempotency Check (Check if order already exists)
    const finalOrderId = orderId || doc(collection(db, 'orders')).id;
    const orderRef = doc(db, 'orders', finalOrderId);
    const existingOrder = await transaction.get(orderRef);
    if (existingOrder.exists()) {
      return finalOrderId;
    }

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
      stock: (productDoc.data().stock || 1) - 1
    });

    // 5. Create Escrow Record
    const escrowRef = doc(collection(db, 'escrow'));
    
    // 6. Create Order
    transaction.set(orderRef, {
      buyerId,
      sellerId,
      productId,
      productName: productName,
      amount: amount,
      status: OrderStatus.PENDING_ESCROW,
      escrowId: escrowRef.id,
      txHash: txHash || 'SIMULATED-TX-' + Math.random().toString(36).substring(7),
      createdAt: serverTimestamp()
    });

    // 7. Record Transaction for Buyer Ledger
    const txRef = doc(collection(db, 'transactions'));
    transaction.set(txRef, {
      uid: buyerId,
      jumlah: amount,
      jenis: 'keluar',
      keterangan: `Pembelian ${productName}`,
      status: 'berhasil',
      timestamp: serverTimestamp()
    });

    // 8. Finalize Escrow Record
    transaction.set(escrowRef, {
      orderId: finalOrderId,
      buyerId,
      sellerId,
      jumlah: amount,
      status: OrderStatus.PENDING_ESCROW,
      createdAt: serverTimestamp()
    });

    return orderRef.id;
  });
};
