import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Wallet, 
  Settings, 
  HelpCircle,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: 'main' | 'dashboard' | 'wallet' | 'orders';
  setActiveTab: (tab: 'main' | 'dashboard' | 'wallet' | 'orders') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();
  
  const menuItems = [
    { 
      id: 'main', 
      label: profile?.role === 'seller' ? 'Produk Saya' : 'Marketplace', 
      icon: profile?.role === 'seller' ? <Store size={20} /> : <ShoppingBag size={20} />,
      show: true 
    },
    { 
      id: 'orders', 
      label: profile?.role === 'seller' ? 'Manajemen Pesanan' : 'Pesanan Saya', 
      icon: <LayoutDashboard size={20} />,
      show: true
    },
    { 
      id: 'dashboard', 
      label: 'AI Analytics', 
      icon: <BarChart3 size={20} />,
      show: profile?.role === 'seller'
    },
    { 
      id: 'wallet', 
      label: 'Dompet Digital', 
      icon: <Wallet size={20} />,
      show: true 
    },
  ];

  return (
    <aside className="w-64 bg-[#0c111d] border-r border-slate-800 flex flex-col h-full z-10">
      <div className="flex-1 py-8 px-4 space-y-2">
        {menuItems.filter(item => item.show).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
              {item.icon}
            </div>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
            {item.id === 'dashboard' && profile?.role === 'seller' && (
              <Sparkles size={12} className="ml-auto text-blue-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-2 border-t border-slate-800/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-colors text-sm font-medium">
          <Settings size={18} /> Pengaturan
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white transition-colors text-sm font-medium">
          <HelpCircle size={18} /> Bantuan
        </button>
      </div>
    </aside>
  );
};
