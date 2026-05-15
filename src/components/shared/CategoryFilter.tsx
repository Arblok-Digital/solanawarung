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
    <div className="w-full mt-24 py-6 px-8 bg-[#060608]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl flex relative z-20">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-4 mt-6 mb-8 w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`
                  flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black shadow-lg shadow-emerald-500/20 scale-105' 
                    : 'btn-category-inactive text-slate-300 border border-white/5'
                  }
                `}
              >
                <Icon size={14} className={isActive ? 'animate-pulse' : ''} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};