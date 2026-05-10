import React from 'react';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, Package, Star, Clock } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onPurchase: (product: Product) => void;
  loading?: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onPurchase,
  loading = false
}) => {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-colors font-bold text-sm group cursor-pointer"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Pasar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="space-y-4 animate-slide-up">
          <div className="aspect-square rounded-[2rem] overflow-hidden border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-50 shadow-xl shadow-slate-200/30">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={64} className="text-slate-200" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col animate-slide-in-right">
          <div className="mb-6">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
              {product.category}
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3 leading-tight">{product.name}</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gradient">{product.price.toLocaleString()}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">CBDC</span>
            </div>
          </div>

          {/* Rating mock */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} className={i <= 4 ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-bold">4.0 • Produk UMKM Terverifikasi</span>
          </div>

          <div className="space-y-6 mb-8 flex-1">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Deskripsi Produk</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center gap-3 group hover:shadow-md hover:shadow-blue-100 transition-all">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Escrow</p>
                  <p className="text-xs font-bold text-blue-700">Dana Aman On-chain</p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-center gap-3 group hover:shadow-md hover:shadow-emerald-100 transition-all">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase">Pengiriman</p>
                  <p className="text-xs font-bold text-emerald-700">JNE / Grab / Gojek</p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-2xl border border-purple-100/50 flex items-center gap-3 group hover:shadow-md hover:shadow-purple-100 transition-all">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                  <Package size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-purple-400 uppercase">Stok</p>
                  <p className="text-xs font-bold text-purple-700">{product.stock} tersedia</p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-2xl border border-amber-100/50 flex items-center gap-3 group hover:shadow-md hover:shadow-amber-100 transition-all">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase">Kondisi</p>
                  <p className="text-xs font-bold text-amber-700">Baru & Segar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="space-y-3">
            <button 
              onClick={() => onPurchase(product)}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-xl shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <ShoppingCart size={22} />
              )}
              Beli Sekarang
            </button>
            <p className="text-center text-[10px] text-slate-400 font-medium">
              🔐 Dilindungi Smart Contract Solana • Pembayaran Digital Rupiah (CBDC)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
