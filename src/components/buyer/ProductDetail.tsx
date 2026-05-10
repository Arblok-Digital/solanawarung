import React, { useState } from 'react';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, Package, Star, Clock, Loader2 } from 'lucide-react';
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

  const handlePurchase = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    const confirmMsg = `Konfirmasi Pembelian:\n\nProduk: ${product.name}\nHarga: Rp ${product.price.toLocaleString('id-ID')}\n\nLanjutkan pembayaran dengan Digital Rupiah?`;
    
    if (confirm(confirmMsg)) {
      setLoading(true);
      try {
        await processCheckout({
          buyerId: user.uid,
          sellerId: product.sellerId || '',
          productId: product.id || '',
          productName: product.name,
          amount: product.price,
          sellerName: 'Toko UMKM'
        });

        alert('✅ PEMBAYARAN BERHASIL!\n\nDana Anda telah diamankan di Rekening Bersama. Penjual akan segera memproses pesanan Anda.');
        onBack();
      } catch (error: any) {
        alert('Gagal: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold text-sm uppercase tracking-widest">Kembali ke Pasar</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-2xl border border-slate-100">
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
            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
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

          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Harga Digital Rupiah</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-blue-600">Rp {product.price.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Package size={16} className="text-blue-600" /> Deskripsi Produk
            </h4>
            <p className="text-slate-500 leading-relaxed">
              {product.description || 'Produk UMKM berkualitas tinggi yang dibuat dengan bahan pilihan dan proses yang terjaga mutunya.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Pengiriman</p>
                <p className="text-xs font-bold text-slate-700">Nasional</p>
              </div>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Proses</p>
                <p className="text-xs font-bold text-slate-700">1-2 Hari</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onPurchase ? () => onPurchase(product) : handlePurchase}
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
    </div>
  );
};
