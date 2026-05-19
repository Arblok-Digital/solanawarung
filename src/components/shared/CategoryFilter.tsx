import React from 'react';
import { 
  LayoutGrid, Utensils, Coffee, Shirt, Gem, 
  Laptop, Globe, Briefcase, MoreHorizontal 
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'Semua', icon: LayoutGrid },
  { id: 'Makanan', name: 'Makanan', icon: Utensils },
  { id: 'Minuman', name: 'Minuman', icon: Coffee },
  { id: 'Fashion', name: 'Fashion', icon: Shirt },
  { id: 'Kerajinan', name: 'Kerajinan', icon: Gem },
  { id: 'Elektronik', name: 'Elektronik', icon: Laptop },
  { id: 'Digital', name: 'Digital', icon: Globe },
  { id: 'Jasa', name: 'Jasa', icon: Briefcase },
  { id: 'Lainnya', name: 'Lainnya', icon: MoreHorizontal },
];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="w-full py-3 md:py-4">
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0
                ${isActive 
                  ? 'bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/10'
                }
              `}
            >
              <Icon size={12} className={isActive ? 'animate-pulse' : ''} />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};