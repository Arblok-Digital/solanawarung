import React from 'react';
import { 
  Package, Trash2, Sparkles, ShoppingCart, Pencil,
  Utensils, Coffee, Shirt, Gem, Laptop, Globe, Briefcase 
} from 'lucide-react';
import { Product } from '../../types';

const categoryConfig: { [key: string]: { icon: React.ElementType, color: string, keyword: string } } = {
  'Makanan': { icon: Utensils, color: 'text-orange-400', keyword: 'culinary,food,indonesia' },
  'Minuman': { icon: Coffee, color: 'text-blue-400', keyword: 'beverage,drink,coffee' },
  'Fashion': { icon: Shirt, color: 'text-pink-400', keyword: 'fashion,clothing,batik' },
  'Kerajinan': { icon: Gem, color: 'text-yellow-400', keyword: 'craft,handmade,art' },
  'Elektronik': { icon: Laptop, color: 'text-cyan-400', keyword: 'gadget,technology' },
  'Digital': { icon: Globe, color: 'text-purple-400', keyword: 'digital,abstract,nft' },
  'Jasa': { icon: Briefcase, color: 'text-green-400', keyword: 'professional,service,consultant' },
  'Lainnya': { icon: Package, color: 'text-gray-400', keyword: 'product,box' },
};

// Fungsi untuk mendapatkan URL gambar demo yang sinkron dengan kategori
const getDemoImageUrl = (category: string, name: string) => {
  const config = categoryConfig[category] || categoryConfig['Lainnya'];
  // Menggunakan Unsplash Source untuk gambar yang relevan dan High Quality
  return `https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800&keyword=${config.keyword},${encodeURIComponent(name)}`;
};

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const config = categoryConfig[product.category] || categoryConfig['Lainnya'];
  const PlaceholderIcon = config.icon;
  const PlaceholderColor = config.color;

  // Jika imageUrl kosong atau mengandung kata 'placeholder', gunakan Smart Mapping Unsplash
  const displayImage = (!product.imageUrl || product.imageUrl.includes('placeholder')) 
    ? getDemoImageUrl(product.category, product.name)
    : product.imageUrl;

  return (
    <div 
      className="rounded-[2rem] border border-white/5 bg-[#0D0D12] overflow-hidden group hover:shadow-2xl hover:shadow-[#14F195]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : null}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-4">
          <div className="flex gap-2">
            <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl text-[#14F195] shadow-lg shadow-black/20">
              <ShoppingCart size={16} />
            </div>
          </div>
          <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[10px] font-black text-slate-400 shadow-lg shadow-black/20">
            Stok: {product.stock}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={10}/> {product.category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-white mb-1 line-clamp-1 text-[15px]">{product.name}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#14F195]">{product.price.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">CBDC</span>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"
                aria-label="Edit Produk"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDelete && (
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  product.id && onDelete(product.id);
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                aria-label="Hapus Produk"
              >
                <Trash2 size={16} />
              </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
