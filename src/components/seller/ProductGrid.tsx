import React from 'react';
import { Package } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-[1.5rem] overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 animate-pulse"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-3 bg-slate-100 rounded-full w-full animate-pulse"></div>
              <div className="h-5 bg-slate-100 rounded-full w-1/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
          <Package size={36} className="text-slate-200" />
        </div>
        <h3 className="text-lg font-bold text-slate-400 mb-2">Belum ada produk</h3>
        <p className="text-sm text-slate-300 max-w-xs">
          Klik tombol "Tambah Produk" di atas untuk mulai mendaftarkan produk UMKM Anda dengan bantuan AI.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};
