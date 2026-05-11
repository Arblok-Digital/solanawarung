import React, { useState } from 'react';
import { Store, ShoppingBag, User as UserIcon, Loader2, ArrowLeft, MapPin, Tag, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/firebase/auth';

export const RoleSelector: React.FC = () => {
  const { user, registerRole } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [step, setStep] = useState<'choose' | 'seller_form'>('choose');
  const [sellerData, setSellerData] = useState({
    warungName: '',
    location: '',
    category: '',
  });

  const handleRoleSelect = async (role: 'seller' | 'buyer') => {
    if (role === 'seller') {
      setStep('seller_form');
      return;
    }
    setRegistering(true);
    try {
      await registerRole(role);
    } finally {
      setRegistering(false);
    }
  };

  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await registerRole('seller');
      if (user && user.uid) {
        await updateProfile(user.uid, sellerData as any);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (step === 'seller_form') {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-[#0A0A0F] relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#9945FF]/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-lg w-full glass rounded-[2rem] p-10 animate-slide-up relative z-10 border border-white/10 shadow-2xl shadow-black/50">
          <button 
            onClick={() => setStep('choose')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold text-sm group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-[#14F195] to-[#9945FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#9945FF]/20">
              <Store className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Profil Warung</h2>
              <p className="text-slate-400 text-sm">Lengkapi data warung Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSellerSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Store size={12} /> Nama Warung
              </label>
              <input 
                type="text" required
                value={sellerData.warungName}
                onChange={(e) => setSellerData({...sellerData, warungName: e.target.value})}
                placeholder="Warung Berkah Jaya"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14F195]/50 focus:border-[#14F195] transition-all font-medium placeholder:text-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Lokasi
              </label>
              <input 
                type="text" required
                value={sellerData.location}
                onChange={(e) => setSellerData({...sellerData, location: e.target.value})}
                placeholder="Jakarta Selatan"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14F195]/50 focus:border-[#14F195] transition-all font-medium placeholder:text-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> Kategori Bisnis
              </label>
              <select 
                required
                value={sellerData.category}
                onChange={(e) => setSellerData({...sellerData, category: e.target.value})}
                className="w-full px-5 py-4 bg-[#111116] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14F195]/50 focus:border-[#14F195] transition-all font-medium appearance-none cursor-pointer text-white"
              >
                <option value="" className="text-slate-500">Pilih Kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Pakaian">Pakaian</option>
                <option value="Kerajinan">Kerajinan</option>
                <option value="Jasa">Jasa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={registering}
              className="w-full py-4 bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#9945FF]/25 disabled:opacity-50 cursor-pointer"
            >
              {registering ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
              Buka Warung Sekarang
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#14F195]/10 rounded-full blur-[100px]"></div>

      <div className="max-w-lg w-full glass rounded-[2rem] p-10 animate-slide-up relative z-10 border border-white/10 shadow-2xl shadow-black/50 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#14F195]/20 to-[#9945FF]/20 text-[#14F195] border border-[#14F195]/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <UserIcon size={36} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Pilih Peran Anda</h2>
        <p className="text-slate-400 mb-10 text-sm max-w-xs mx-auto">
          Selamat datang, <strong className="text-white">{user?.displayName}</strong>! Tentukan peran Anda di marketplace.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleRoleSelect('seller')}
            disabled={registering}
            className="flex flex-col items-center p-8 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-[#9945FF]/50 rounded-2xl transition-all group disabled:opacity-50 cursor-pointer hover:shadow-lg hover:shadow-[#9945FF]/20 hover:scale-[1.03] active:scale-[0.97]" // Already dark, but ensuring consistency
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-lg transition-all border border-white/5">
              <Store className="text-slate-400 group-hover:text-[#9945FF] transition-colors" size={24} />
            </div>
            <span className="font-black text-white text-lg">Seller</span>
            <span className="text-[11px] text-slate-400 mt-1">Jual produk UMKM</span>
          </button>
          <button 
            onClick={() => handleRoleSelect('buyer')}
            disabled={registering}
            className="flex flex-col items-center p-8 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-[#14F195]/50 rounded-2xl transition-all group disabled:opacity-50 cursor-pointer hover:shadow-lg hover:shadow-[#14F195]/20 hover:scale-[1.03] active:scale-[0.97]"
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-lg transition-all border border-white/5">
              <ShoppingBag className="text-slate-400 group-hover:text-[#14F195] transition-colors" size={24} />
            </div>
            <span className="font-black text-white text-lg">Buyer</span>
            <span className="text-[11px] text-slate-400 mt-1">Belanja produk lokal</span>
          </button>
        </div>
        {registering && (
          <div className="mt-6 flex justify-center">
            <Loader2 className="animate-spin text-[#14F195]" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};
