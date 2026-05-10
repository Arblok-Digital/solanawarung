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
      if (user) {
        await updateProfile(user.uid, sellerData);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (step === 'seller_form') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-lg w-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-slide-up relative z-10">
          <button 
            onClick={() => setStep('choose')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 transition-colors font-bold text-sm group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Store className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Profil Warung</h2>
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
                className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium placeholder:text-slate-300"
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
                className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium placeholder:text-slate-300"
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
                className="w-full px-5 py-4 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="">Pilih Kategori</option>
                <option value="Makanan & Minuman">Makanan & Minuman</option>
                <option value="Fashion">Fashion</option>
                <option value="Kerajinan">Kerajinan</option>
                <option value="Jasa">Jasa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={registering}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-400/10 rounded-full blur-[100px]"></div>

      <div className="max-w-lg w-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-slide-up relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <UserIcon size={36} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Pilih Peran Anda</h2>
        <p className="text-slate-400 mb-10 text-sm max-w-xs mx-auto">
          Selamat datang, <strong className="text-slate-600">{user?.displayName}</strong>! Tentukan peran Anda di marketplace.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleRoleSelect('seller')}
            disabled={registering}
            className="flex flex-col items-center p-8 bg-gradient-to-br from-slate-50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50 border-2 border-slate-100 hover:border-blue-300 rounded-2xl transition-all group disabled:opacity-50 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.03] active:scale-[0.97]"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all">
              <Store className="text-slate-400 group-hover:text-blue-500 transition-colors" size={24} />
            </div>
            <span className="font-black text-slate-700 text-lg">Seller</span>
            <span className="text-[11px] text-slate-400 mt-1">Jual produk UMKM</span>
          </button>
          <button 
            onClick={() => handleRoleSelect('buyer')}
            disabled={registering}
            className="flex flex-col items-center p-8 bg-gradient-to-br from-slate-50 to-purple-50/50 hover:from-purple-50 hover:to-pink-50 border-2 border-slate-100 hover:border-purple-300 rounded-2xl transition-all group disabled:opacity-50 cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.03] active:scale-[0.97]"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-lg group-hover:shadow-purple-500/10 transition-all">
              <ShoppingBag className="text-slate-400 group-hover:text-purple-500 transition-colors" size={24} />
            </div>
            <span className="font-black text-slate-700 text-lg">Buyer</span>
            <span className="text-[11px] text-slate-400 mt-1">Belanja produk lokal</span>
          </button>
        </div>
        {registering && (
          <div className="mt-6 flex justify-center">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};
