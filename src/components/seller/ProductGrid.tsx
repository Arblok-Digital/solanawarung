import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'main' | 'dashboard' | 'wallet' | 'orders';
  setActiveTab: (tab: 'main' | 'dashboard' | 'wallet' | 'orders') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="w-full h-full bg-[#060608] font-sans text-[#F0EEE8] flex flex-col relative">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row relative w-full min-h-0">
        <aside className="hidden md:flex md:w-64 bg-[#0c111d] border-r border-white/5 z-30 flex-col shrink-0 relative h-full">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <section className="flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden bg-[#060608] pb-24 md:pb-8">
          <div className="container px-4 sm:px-6">{children}</div>
        </section>
      </main>
      <BottomNav className="fixed bottom-0 left-0 right-0 z-50" activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};// ... imports tetap sama ...

export const OrdersPanel: React.FC<OrdersPanelProps> = ({ onOrderCreated }) => {
  // ... existing state and logic ...

  return (
    <div className="p-4 sm:p-6 animate-fade-in w-full mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="text-[#14F195]" size={24} />
            {profile?.role === 'seller' ? 'Pesanan' : 'Pesanan Saya'}
          </h2>
          <p className="text-slate-400 text-xs">
            {profile?.role === 'seller' 
              ? 'Kelola pesanan dari pembeli' 
              : 'Status barang yang Anda beli'}
          </p>
        </div>

        {/* Filter buttons - simplified for mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['ALL', OrderStatus.PENDING_ESCROW, OrderStatus.ESCROW, OrderStatus.COMPLETED].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap
                ${activeFilter === filter 
                  ? 'bg-[#9945FF] text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Order items - simplified for mobile */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-[#0D0D12] rounded-xl border border-white/5 p-4">
            {/* Simplified order card */}
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                <Package size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{order.productName}</h4>
                <p className="text-xs text-slate-400">
                  Rp {order.amount?.toLocaleString('id-ID') || '0'}
                </p>
              </div>
            </div>
            {/* Mobile action buttons */}
            <div className="mt-3 flex justify-end">
              <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};// ... imports tetap sama ...

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 rounded-xl animate-pulse aspect-square" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          className="w-full h-full"
        />
      ))}
    </div>
  );
};import React from 'react';
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
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-3 bg-white/5 rounded-full w-full animate-pulse"></div>
              <div className="h-5 bg-white/5 rounded-full w-1/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-[#0D0D12] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center shadow-sm mb-6">
          <Package size={36} className="text-gray-700" />
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
