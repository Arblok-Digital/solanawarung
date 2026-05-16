import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Order, OrderStatus } from '../../types';
import { subscribeToUserOrders, updateOrderStatus } from '../../services/firebase/orders';

export const OrdersPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (!user || !profile) return;

    const unsub = subscribeToUserOrders(user.uid, profile.role, (data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user, profile]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
    } catch (err) {
      alert('Gagal mengupdate status pesanan');
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_ESCROW: return 'bg-amber-900/20 text-amber-400 border-amber-900/50';
      case 'PROCESSING': return 'bg-purple-900/20 text-purple-400 border-purple-900/50';
      case OrderStatus.ESCROW: return 'bg-blue-900/20 text-blue-400 border-blue-900/50';
      case OrderStatus.COMPLETED: return 'bg-emerald-900/20 text-emerald-400 border-emerald-900/50';
      case OrderStatus.CANCELLED: return 'bg-red-900/20 text-red-400 border-red-900/50';
      default: return 'bg-gray-900/20 text-gray-400 border-gray-900/50';
    }
  };

  const filteredOrders = activeFilter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === activeFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-pulse">
        <Package className="text-slate-200 mb-4" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat daftar pesanan...</p>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="text-[#14F195]" size={28} />
            {profile?.role === 'seller' ? 'Manajemen Pesanan' : 'Pesanan Saya'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {profile?.role === 'seller' 
              ? 'Pantau dan kelola pesanan masuk dari pembeli.' 
              : 'Pantau status barang yang Anda beli di marketplace.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-sm overflow-x-auto no-scrollbar">
          {['ALL', ...Object.values(OrderStatus)].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${activeFilter === filter 
                  ? 'bg-[#9945FF] text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#0D0D12] rounded-[2rem] border border-white/5 p-6 md:p-8 hover:shadow-2xl transition-all group border-l-4" 
                 style={{ borderLeftColor: order.status === OrderStatus.PENDING_ESCROW ? '#f59e0b' : order.status === OrderStatus.ESCROW ? '#3b82f6' : '#10b981' }}>
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                    <Package className="text-slate-600" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-black text-white">{order.productName || 'Produk UMKM'}</h4>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status as OrderStatus)}`}>
                        {order.status === OrderStatus.PENDING_ESCROW && 'Pesanan Baru'}
                        {order.status === 'PROCESSING' && 'Sedang Disiapkan'}
                        {order.status === OrderStatus.ESCROW && 'Dalam Pengiriman'}
                        {order.status === OrderStatus.COMPLETED && 'Selesai'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Clock size={12}/> {order.createdAt?.toDate?.()?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Baru saja'}</span>
                      <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-blue-500"/> ID: {order.id?.substring(0, 8) || '...'}</span>
                      {order.transactionSignature && (
                        <a href={`https://explorer.solana.com/tx/${order.transactionSignature}?cluster=devnet`} target="_blank" rel="noreferrer" 
                           className="flex items-center gap-1.5 text-blue-500 hover:underline">
                          <ExternalLink size={12}/> Solana Explorer
                        </a>
                      )}
                    </div>

                    {/* Trust Indicator for Buyer (R19) */}
                    {profile?.role === 'buyer' && order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                      <div className="mt-3 flex items-center gap-2 bg-[#14F195]/5 border border-[#14F195]/10 px-3 py-1.5 rounded-lg w-fit animate-pulse">
                        <ShieldCheck size={12} className="text-[#14F195]" />
                        <span className="text-[9px] font-black text-[#14F195] uppercase tracking-widest">
                          Dana Anda Aman di Rekening Bersama Otomatis (Escrow)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="text-right md:pr-6 md:border-r border-slate-100 w-full md:w-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                    <p className="text-xl font-black text-[#14F195]">Rp {order.amount?.toLocaleString('id-ID') || '0'}</p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Seller Actions */}
                    {profile?.role === 'seller' && order.status === OrderStatus.PENDING_ESCROW && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'PROCESSING' as OrderStatus)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#9945FF] hover:bg-[#7B5EA7] text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#9945FF]/20 transition-all active:scale-95"
                      >
                        <Package size={14} /> Terima & Proses
                      </button>
                    )}

                    {profile?.role === 'seller' && order.status === 'PROCESSING' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, OrderStatus.ESCROW)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                      >
                        <Truck size={14} /> Kirim Pesanan
                      </button>
                    )}
                    
                    {profile?.role === 'seller' && order.status === OrderStatus.ESCROW && (
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs bg-blue-900/20 px-4 py-3 rounded-2xl border border-blue-900/50">
                        <Loader2 className="animate-spin" size={14} /> Menunggu Buyer
                      </div>
                    )}

                    {/* Buyer Processing State Info */}
                    {profile?.role === 'buyer' && order.status === 'PROCESSING' && (
                      <div className="flex items-center gap-2 text-purple-400 font-black text-[10px] uppercase tracking-widest bg-purple-900/20 px-6 py-3.5 rounded-2xl border border-purple-900/50">
                        <Clock size={14} /> Seller Sedang Menyiapkan Barang
                      </div>
                    )}

                    {/* Buyer Actions */}
                    {profile?.role === 'buyer' && order.status === OrderStatus.ESCROW && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, OrderStatus.COMPLETED)} // Changed to dark theme colors
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95"
                      >
                        <CheckCircle2 size={14} /> Pesanan Diterima
                      </button>
                    )}

                    {order.status === OrderStatus.COMPLETED && (
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-900/20 px-6 py-3.5 rounded-2xl border border-emerald-900/50">
                        <CheckCircle2 size={16} /> Selesai
                      </div>
                    )}

                    <button className="p-3.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-card bg-[#0D0D12] rounded-[3rem] p-20 border border-white/5 text-center shadow-sm">
            <div className="empty-state-glow w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14F195]">
              <Package size={32} className="relative z-10" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Belum ada pesanan</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
              {profile?.role === 'seller' 
                ? 'Promosikan produk Anda untuk mendapatkan pesanan pertama!' 
                : 'Jelajahi marketplace dan temukan produk UMKM menarik!'}
            </p>
            {profile?.role === 'buyer' && (
              <button className="bg-[#14F195] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#14F195]/20 hover:scale-105 transition-all">
                Mulai Belanja
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-12 bg-gradient-to-br from-[#0D0D12] to-[#111118] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-black/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-blue-900/20 rounded-3xl flex items-center justify-center shrink-0 border border-blue-900/30">
            <ShieldCheck size={40} className="text-blue-400" /> {/* Blue-400 is fine for accent */}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black mb-2">Keamanan Rekening Bersama (Escrow)</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Setiap transaksi di SolanaWarung menggunakan sistem Escrow berbasis Smart Contract. Dana pembeli diamankan oleh sistem dan hanya akan diteruskan ke penjual setelah pembeli melakukan konfirmasi penerimaan barang.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-900/20 border border-emerald-900/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={12} /> On-Chain Verified
          </div>
        </div>
      </div>
    </div>
  );
};
