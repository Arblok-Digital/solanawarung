import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Wallet,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface BottomNavProps {
  activeTab: 'main' | 'dashboard' | 'wallet' | 'orders';
  setActiveTab: (tab: 'main' | 'dashboard' | 'wallet' | 'orders') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();

  const menuItems = [
    {
      id: 'main' as const,
      label: profile?.role === 'seller' ? 'Produk' : 'Market',
      icon: profile?.role === 'seller' ? Store : ShoppingBag,
    },
    {
      id: 'orders' as const,
      label: 'Pesanan',
      icon: LayoutDashboard,
    },
    {
      id: 'dashboard' as const,
      label: 'AI',
      icon: BarChart3,
      show: profile?.role === 'seller',
    },
    {
      id: 'wallet' as const,
      label: 'Wallet',
      icon: Wallet,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c111d]/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {menuItems
          .filter((item) => item.show !== false)
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all cursor-pointer min-w-0 ${
                  isActive
                    ? 'text-[#14F195]'
                    : 'text-slate-500 active:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                  {item.id === 'dashboard' && profile?.role === 'seller' && (
                    <Sparkles
                      size={10}
                      className="absolute -top-1 -right-1.5 text-blue-400 animate-pulse"
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wide truncate ${
                    isActive ? 'text-[#14F195]' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#14F195] rounded-full" />
                )}
              </button>
            );
          })}
      </div>
    </nav>
  );
};
