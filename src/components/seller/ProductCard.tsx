import React from 'react';
import { Package, Trash2, Eye, Sparkles, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div 
      onClick={() => onEdit?.(product)}
      className="rounded-[1.5rem] border border-slate-100 bg-white overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package size={40} className="text-slate-200" />
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
          <div className="flex gap-2">
            <div className="p-2.5 bg-white/95 backdrop-blur rounded-xl text-blue-600 shadow-lg">
              <ShoppingCart size={16} />
            </div>
          </div>
          <span className="px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-black text-slate-600 shadow-lg">
            Stok: {product.stock}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={10}/> {product.category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h4 className="font-bold text-slate-800 mb-1 line-clamp-1 text-[15px]">{product.name}</h4>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-blue-600">{product.price.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">CBDC</span>
          </div>
          {onDelete && (
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  product.id && onDelete(product.id);
                }}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
          )}
        </div>
      </div>
    </div>
  );
};
