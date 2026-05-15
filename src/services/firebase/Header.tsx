import React, { useState } from 'react';
import { LogOut, Wifi, Code, Database, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Custom style for Wallet Button to match our premium theme
import '../../styles/wallet-button.css';

export const Header: React.FC = () => {
  const { user, profile, logout, switchRole, seedData } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const toggleRole = () => {
    const nextRole = profile?.role === 'seller' ? 'buyer' : 'seller';
    switchRole(nextRole);
  };

  const handleSeed = async () => {
    if (confirm('Generate mock products and sales data?')) {
      setSeeding(true);
      try {
        await seedData();
        alert('✅ Mock data generated successfully!');
        window.location.reload(); // Refresh to show new data
      } catch (err) {
        alert('Failed to seed data');
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <header className="h-16 bg-[#0c111d] text-white flex items-center justify-between px-8 shrink-0 shadow-lg z-20 relative">
      {/* Subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-lg italic shadow-lg shadow-blue-500/20">S</div>
        <div>
          <h1 className="text-base font-black tracking-tight leading-none">
            {profile?.role === 'seller' && profile?.warungName ? profile.warungName : 'SolanaWarung'}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Wifi size={8} className="text-emerald-400" />
            <span className="text-[9px] text-slate-300 uppercase tracking-[0.2em] font-bold">
              {profile?.role === 'seller' ? 'Powered by SolanaWarung • Devnet' : 'Buyer Space • Devnet'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Seed Data Button */}
        <button 
          onClick={handleSeed}
          disabled={seeding}
          aria-label="Generate data demo"
          className="flex items-center gap-2 px-4 h-[38px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-[10px] transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer group"
        >
          {seeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />}
          Seed Data
        </button>

        {/* Wallet Connector */}
        <div className="wallet-adapter-wrapper">
          <WalletMultiButton>
            Web3 Wallet
          </WalletMultiButton>
        </div>

        {/* Dev Mode Role Switcher */}
        <button 
          onClick={toggleRole}
          aria-label={`Ganti ke mode ${profile?.role === 'seller' ? 'Pembeli' : 'Penjual'}`}
          className="flex items-center gap-2 px-4 h-[38px] bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-[10px] transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer group"
          title="Switch Role (Dev Mode)"
        >
          <Code size={12} className="group-hover:rotate-12 transition-transform" />
          Switch to {profile?.role === 'seller' ? 'Buyer' : 'Seller'}
        </button>

        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-medium border-r border-slate-700/50 pr-4">
          <div className="text-right">
            <p className="text-slate-200 text-xs font-bold leading-tight">{user?.displayName || 'User'}</p>
            <p className="text-slate-500 text-[10px]">{user?.email || 'Demo Mode'}</p>
          </div>
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="profile" 
              className="w-7 h-7 rounded-full border-2 border-slate-700 shadow-sm" 
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <button 
          onClick={logout}
          aria-label="Keluar dari akun"
          className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
