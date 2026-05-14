import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  collection 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product, Order } from '../../types';

/**
 * FLOW 02: Checkout (Proses Pembeli Membeli)
 * Menggunakan Firestore Transaction (R09) untuk "Invisible Blockchain"
 */
export const processCheckout = async (
  buyerId: string, 
  product: any, // Menggunakan any sementara karena perbedaan interface name/nama
  walletAddress?: string
) => {
  return await runTransaction(db, async (transaction) => {
    // 1. Ambil Wallet Buyer
    const buyerWalletRef = doc(db, 'wallets', buyerId);
    const buyerWalletDoc = await transaction.get(buyerWalletRef);

    if (!buyerWalletDoc.exists()) {
      throw new Error("Dompet tidak ditemukan. Silakan isi saldo terlebih dahulu.");
    }

    const currentBalance = buyerWalletDoc.data().saldo || 0;
    const productPrice = product.harga || product.price;

    // 2. Validasi Saldo (Mock CBDC)
    if (currentBalance < productPrice) {
      throw new Error("Saldo Digital Rupiah tidak cukup.");
    }

    // 3. Potong Saldo Buyer
    transaction.update(buyerWalletRef, {
      saldo: currentBalance - productPrice,
      updatedAt: serverTimestamp()
    });

    // 4. Buat Record Escrow (Status: HELD)
    const escrowRef = doc(collection(db, 'escrow'));
    transaction.set(escrowRef, {
      buyerId,
      sellerId: product.sellerId,
      jumlah: productPrice,
      status: 'menunggu',
      createdAt: serverTimestamp()
    });

    // 5. Buat Order (Flow 02)
    const orderRef = doc(collection(db, 'orders'));
    const orderData = {
      buyerId,
      sellerId: product.sellerId,
      productId: product.id,
      productName: product.nama || product.name,
      amount: productPrice,
      status: 'menunggu',
      escrowId: escrowRef.id,
      // Simulasi TX Hash jika wallet Web3 belum terkoneksi (R19)
      txHash: walletAddress ? `SOL-TX-${Math.random().toString(36).substring(7)}` : 'SIMULATED-TX',
      createdAt: serverTimestamp()
    };
    transaction.set(orderRef, orderData);

    // 6. Catat di Ledger Transaksi Buyer
    const txRef = doc(collection(db, 'transactions'));
    transaction.set(txRef, {
      uid: buyerId,
      jumlah: productPrice,
      jenis: 'keluar',
      keterangan: `Pembelian ${product.nama || product.name}`,
      status: 'berhasil',
      timestamp: serverTimestamp()
    });

    return orderRef.id;
  });
};