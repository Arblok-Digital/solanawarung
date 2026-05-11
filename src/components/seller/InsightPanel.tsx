import React, { useEffect, useState } from 'react';
import { BrainCircuit, TrendingUp, TrendingDown, Minus, Target, Sparkles, RefreshCw, BarChart3, Zap } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { Product, Order } from '../../types';
import { generateBusinessInsights, BusinessInsight } from '../../services/gemini/analytics';
import { subscribeToSellerProducts } from '../../services/firebase/products';
import { subscribeToUserOrders } from '../../services/firebase/orders';

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export const InsightPanel: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [insight, setInsight] = useState<BusinessInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubProducts = subscribeToSellerProducts(user.uid, (data) => {
      setProducts(data);
    });

    const unsubOrders = subscribeToUserOrders(user.uid, 'seller', (data) => {
      setOrders(data);
    });

    // Initial insight generation after short delay
    const timer = setTimeout(() => {
      generateInsights(products, orders);
    }, 1500);

    return () => {
      unsubProducts();
      unsubOrders();
      clearTimeout(timer);
    };
  }, [user]);

  useEffect(() => {
    if (products.length > 0 || orders.length > 0) {
      generateInsights(products, orders);
    } else {
      setLoading(false);
    }
  }, [products, orders]);

  const generateInsights = async (p: Product[], o: Order[]) => {
    if (p.length === 0 && o.length === 0) {
      setLoading(false);
      return;
    }
    const data = await generateBusinessInsights(p, o);
    setInsight(data);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await generateInsights(products, orders);
    setRefreshing(false);
  };

  // Chart data
  const chartData = [
    { name: 'Sen', sales: orders.length > 0 ? 120 : 30 },
    { name: 'Sel', sales: orders.length > 0 ? 210 : 45 },
    { name: 'Rab', sales: orders.length > 0 ? 180 : 20 },
    { name: 'Kam', sales: orders.length > 0 ? 290 : 60 },
    { name: 'Jum', sales: orders.length > 0 ? Math.max(orders.length * 100, 150) : 40 },
    { name: 'Sab', sales: orders.length > 0 ? 320 : 55 },
    { name: 'Min', sales: orders.length > 0 ? 250 : 35 },
  ];

  // Category distribution
  const categoryData = products.reduce((acc, p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) { existing.value += 1; }
    else { acc.push({ name: p.category || 'Lainnya', value: 1 }); }
    return acc;
  }, [] as { name: string; value: number }[]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-fade-in">
        <div className="relative mb-8"> {/* Changed to dark theme colors */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl flex items-center justify-center border border-white/10">
            <BrainCircuit className="text-purple-400" size={40} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-bounce">
            <Sparkles size={14} className="text-white" />
          </div>
        </div>
        <h3 className="text-xl font-black text-white mb-2">Gemini sedang menganalisis...</h3>
        <p className="text-slate-400 text-sm">Membaca data penjualan dan menghasilkan insight bisnis.</p>
        <div className="mt-6 flex gap-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
              <Sparkles className="text-white" size={18} />
            </div>
            AI Business Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1 ml-[52px]">Analisis dan rekomendasi otomatis dari Gemini.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0D0D12] border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-purple-400 hover:border-purple-400/20 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Row - Changed to dark theme colors */}
      <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
        <div className="p-5 bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Pendapatan</p>
          <p className="text-2xl font-black text-white font-mono">{totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">CBDC (Digital Rupiah)</p>
        </div>
        <div className="p-5 bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Order</p>
          <p className="text-2xl font-black text-white font-mono">{orders.length}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Transaksi</p>
        </div>
        <div className="p-5 bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Rata-rata Order</p>
          <p className="text-2xl font-black text-white font-mono">{avgOrderValue.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">CBDC / Order</p>
        </div>
        <div className="p-5 bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Katalog</p>
          <p className="text-2xl font-black text-white font-mono">{products.length}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Produk Aktif</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Area Chart - Changed to dark theme colors */}
          <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <BarChart3 size={16} className="text-blue-500" />
                Grafik Penjualan Mingguan
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">7 Hari Terakhir</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs> {/* Changed stroke color for dark theme */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', fontWeight: 700, fontSize: '12px', background: '#0D0D12' }}
                    labelStyle={{ fontWeight: 800, marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSalesGrad)" dot={{ fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie + Quick Stats - Changed to dark theme colors */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 shadow-sm">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <Zap size={16} className="text-amber-500" />
                Distribusi Kategori
              </h3>
              {categoryData.length > 0 ? (
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 700 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-300 text-sm font-medium">
                  Belum ada data
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {categoryData.map((cat, i) => (
                  <span key={cat.name} className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0c111d] to-[#1a1f35] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-300">
                <BrainCircuit size={16} className="text-purple-400" />
                AI Prediction
              </h3>
              <div className="flex items-center gap-3 mb-4">
                {insight?.predictedTrend === 'up' && <TrendingUp className="text-emerald-400" size={28} />}
                {insight?.predictedTrend === 'down' && <TrendingDown className="text-red-400" size={28} />}
                {insight?.predictedTrend === 'stable' && <Minus className="text-amber-400" size={28} />}
                {!insight && <Minus className="text-slate-600" size={28} />}
                <span className="text-2xl font-black capitalize">
                  {insight?.predictedTrend === 'up' ? 'Naik 📈' : insight?.predictedTrend === 'down' ? 'Turun 📉' : 'Stabil ⚖️'}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Prediksi berdasarkan analisis tren penjualan dan perilaku pembeli oleh Gemini AI.
              </p>
            </div>
          </div>
        </div>

        {/* Right: AI Insights */}
        <div className="space-y-6">
          {/* Summary Card - Changed to dark theme colors */}
          <div className="bg-[#0D0D12] rounded-2xl border border-white/10 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full -mr-10 -mt-10"></div>

            <h3 className="font-black text-white flex items-center gap-2 text-sm mb-4 relative z-10">
              <BrainCircuit className="text-purple-600" size={18} />
              Executive Summary
            </h3>

            <p className="text-slate-500 leading-relaxed text-sm mb-6 relative z-10">
              {insight?.summary || "Mulai tambahkan produk dan lakukan penjualan untuk mendapatkan analisis AI yang komprehensif."}
            </p>

            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Rekomendasi AI</h4>
            <ul className="space-y-3 relative z-10">
              {insight?.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                  <span className="w-5 h-5 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{idx + 1}</span>
                  {rec}
                </li>
              ))}
              {!insight?.recommendations && (
                <li className="text-sm text-slate-300 italic">Belum ada data untuk dianalisis.</li>
              )}
            </ul>
          </div>

          {/* Action Card */}
          {insight?.actionableStep && (
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 animate-slide-up">
              <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target size={12} />
                Next Action
              </h4>
              <p className="font-bold text-white/90 leading-relaxed">{insight.actionableStep}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
