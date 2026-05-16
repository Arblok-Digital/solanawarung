import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { getAllProducts } from '../../services/firebase/products';
import { processCheckout } from '../../services/firebase/checkout';
import { createEscrowTransaction } from '../../services/solana/escrow';
import { Product, OrderStatus } from '../../types';
import { ProductGrid } from '../seller/ProductGrid';
import { ProductDetail } from './ProductDetail';
import { useAuth } from '../../hooks/useAuth';
import { CategoryFilter } from '../shared/CategoryFilter';

const CATEGORIES = ['all', 'Makanan', 'Minuman', 'Fashion', 'Kerajinan', 'Elektronik', 'Digital', 'Jasa', 'Lainnya'];

export const BuyerStorefront: React.FC = () => {
  const { user } = useAuth();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getAllProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal ambil produk:", err);
        setLoading(false);
      });
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = async (product: Product) => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk bertransaksi.');
      return;
    }

    if (!wallet.connected || !wallet.publicKey) {
      try {
        if (!wallet.wallet) {
          setVisible(true);
          return;
        }
        await wallet.connect();
      } catch (err) {
        console.error('Wallet connection error:', err);
        return;
      }
    }

    setPurchaseLoading(true);
    const orderId = `ORD-${Date.now()}`;
    let signature = "";
    
    try {
      let sellerPubkey: PublicKey;
      try {
        sellerPubkey = new PublicKey(product.sellerId);
      } catch (e) {
        sellerPubkey = new PublicKey("2GsHVNZnTijNshVp6BmHjXTm9MtWeBW4j4FVNCCXaQhW");
      }

      // 1. Create On-Chain Escrow Transaction
      const tx = await createEscrowTransaction(
        wallet, 
        sellerPubkey, 
        orderId, 
        product.price * 100
      );

      // 2. Send Transaction (FAST TRACK)
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      signature = await wallet.sendTransaction(tx, connection, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      console.log("Transaction sent. Signature:", signature);

      // 3. Robust Confirmation & Polling Logic
      let confirmed = false;
      try {
        // First try standard confirmation
        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, 'confirmed');
        confirmed = true;
      } catch (confirmError: any) {
        console.warn("Initial confirmation failed, starting manual polling...", confirmError.message);
        
        // Polling loop (Max 30 seconds for devnet)
        const pollStart = Date.now();
        while (Date.now() - pollStart < 30000) {
          const status = await connection.getSignatureStatus(signature);
          if (status?.value) {
            if (status.value.err) {
              throw new Error(`On-chain Transaction Error: ${JSON.stringify(status.value.err)}`);
            }
            if (status.value.confirmationStatus === 'confirmed' || status.value.confirmationStatus === 'finalized') {
              confirmed = true;
              break;
            }
          }
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      if (!confirmed) {
        throw new Error("Gagal konfirmasi transaksi dalam 30 detik. Silakan cek wallet Anda.");
      }

      // 4. Sync with Firebase (Initial Status: PENDING_ESCROW for demo flow)
      await processCheckout({
        buyerId: user.uid,
        sellerId: product.sellerId || '',
        productId: product.id || '',
        productName: product.name,
        amount: product.price,
        sellerName: 'Toko UMKM',
        txHash: signature,
        orderId: orderId
      });

      alert(`✅ PEMBELIAN WEB3 BERHASIL!\n\nDana Anda telah diamankan di Smart Contract (Escrow).\n\nSignature: ${signature}\n\nLihat di Solana Explorer:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Transaction failed:', error);
      alert('Transaksi Web3 Gagal: ' + (error.message || 'Error tidak diketahui'));
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
        onPurchase={handlePurchase}
        loading={purchaseLoading}
      />
    );
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    // Case-insensitive matching untuk kategori
    const matchesCategory = activeCategory === 'all' || 
      p.category?.toLowerCase() === activeCategory.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-10 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0c111d] to-[#161b2c] rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#14F195] rounded-full animate-pulse"></div>
            <span className="text-[#14F195] text-[10px] font-black uppercase tracking-[0.3em]">AI-Powered Marketplace</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Pasar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">SolanaWarung</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            Temukan produk UMKM terbaik Indonesia. Aman, instan, dan transparan dengan teknologi Digital Rupiah.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="space-y-6">
        <div className="relative group flex-1 w-full max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk UMKM (contoh: Kopi Gayo)..."
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#14F195]/10 focus:border-[#14F195]/50 transition-all shadow-sm font-bold text-white placeholder:text-slate-600"
          />
        </div>
        
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </section>
      
      {/* Product Grid Container */}
      <section className="min-h-[400px]">
        <ProductGrid 
          products={filteredProducts} 
          loading={loading} 
          onEdit={handleProductClick}
        />
      </section>
    </div>
  );
};
