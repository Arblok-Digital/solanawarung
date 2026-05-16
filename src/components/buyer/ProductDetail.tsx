import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, Package, Star, Clock, Loader2, Wallet, CreditCard, X, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { processCheckout } from '../../services/firebase/checkout';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onPurchase?: (product: Product) => Promise<void>;
  loading?: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onPurchase, 
  loading: parentLoading 
}: ProductDetailProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const handleFinalCheckout = async (method: 'web3' | 'internal') => {
    setShowPaymentOptions(false);
    
    if (method === 'internal') {
      // Opsi B: Dompet Digital (Simulasi/Internal)
      setLoading(true);
      try {
        await processCheckout({
          buyerId: user.uid,
          sellerId: user.uid, // MOCK: Same ID for demo visualization
          productId: product.id || '',
          productName: product.name,
          amount: product.price,
          sellerName: 'Toko UMKM (Simulasi)'
        });

        alert('✅ PEMBAYARAN BERHASIL!\n\nDana Anda telah diamankan di Rekening Bersama. Penjual akan segera memproses pesanan Anda.');
        onBack();
      } catch (error: any) {
        alert('Gagal: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Opsi A: Real Web3 (Solana/CBDC)
      if (onPurchase) {
        await onPurchase(product);
      }
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      alert('Silakan login terlebih dahulu.');
      return;
    }
    setShowPaymentOptions(true);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto animate-in fade-in duration-500 relative">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-widest">Kembali ke Pasar</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-[#0D0D12] shadow-2xl border border-white/5">
          <img 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block">
              {product.category}
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <span>(48 Ulasan)</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-emerald-500">Tersedia {product.stock} unit</span>
            </div>
          </div>

          <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Harga Digital Rupiah</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-blue-600">Rp {product.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Package size={16} className="text-blue-600" /> Deskripsi Produk
            </h4>
            <p className="text-slate-500 leading-relaxed">
              {product.description || 'Produk UMKM berkualitas tinggi yang dibuat dengan bahan pilihan dan proses yang terjaga mutunya.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900/20 text-blue-400 rounded-xl flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Pengiriman</p>
                <p className="text-xs font-bold text-white">Nasional</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-900/20 text-purple-400 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Proses</p>
                <p className="text-xs font-bold text-white">1-2 Hari</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handlePurchaseClick}
              disabled={loading || parentLoading || product.stock === 0}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading || parentLoading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
              {product.stock === 0 ? 'Stok Habis' : 'Beli Sekarang'}
            </button>
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Pembayaran Aman & Otomatis
              </p>
              <p className="text-[9px] text-slate-300 font-medium">Dana Anda diamankan sistem sebelum diterima penjual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pilihan Pembayaran */}
      {showPaymentOptions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D0D12] border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white tracking-tight">Metode Pembayaran</h3>
              <button onClick={() => setShowPaymentOptions(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Opsi Web3 */}
              <button 
                onClick={() => handleFinalCheckout('web3')}
                className="w-full p-5 rounded-[1.5rem] border border-[#14f195]/20 bg-[#14f195]/5 hover:bg-[#14f195]/10 hover:border-[#14f195]/40 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#14f195]/20 flex items-center justify-center text-[#14f195] group-hover:scale-110 transition-transform">
                  <Wallet size={24} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-sm text-white uppercase tracking-wider">Real Web3 Transaction</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Via Solana Devnet & Wallet</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-[#14f195] transition-colors" />
              </button>

              {/* Opsi Dompet Digital Biasa */}
              <button 
                onClick={() => handleFinalCheckout('internal')}
                className="w-full p-5 rounded-[1.5rem] border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <CreditCard size={24} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-black text-sm text-white uppercase tracking-wider">Dompet Digital Warung</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Saldo Internal (Simulasi Cepat)</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>

            <p className="mt-6 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed px-4">
              Semua transaksi dilindungi oleh sistem Escrow Otomatis SolanaWarung
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
