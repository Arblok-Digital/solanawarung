import React from 'react';
import { 
  Store, 
  ShoppingBag, 
  LayoutDashboard, 
  BrainCircuit, 
  Zap, 
  Coins, 
  ArrowDownCircle, 
  Loader2,
  Sparkles,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../../hooks/useAuth';
import { getSolBalance, requestAirdrop } from '../../services/solana/wallet';
import { getCBDCBalance } from '../../services/solana/cbdc';

interface SidebarProps {
  activeTab: 'main' | 'dashboard';
  setActiveTab: (tab: 'main' | 'dashboard') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = React.useState<number | null>(null);
  const [cbdcBalance, setCbdcBalance] = React.useState<number | null>(null);
  const [airdropping, setAirdropping] = React.useState(false);

  React.useEffect(() => {
    if (connected && publicKey) {
      getSolBalance(publicKey).then(setSolBalance);
      getCBDCBalance(publicKey).then(setCbdcBalance);
    }
  }, [connected, publicKey]);

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setAirdropping(true);
    const success = await requestAirdrop(publicKey);
    if (success) {
      const newBalance = await getSolBalance(publicKey);
      setSolBalance(newBalance);
    }
    setAirdropping(false);
  };

  return (
    <aside className="w-[280px] bg-[#f8f9fb] border-r border-slate-200/80 flex flex-col shrink-0 overflow-hidden">
      {/* Navigation */}
      <div className="p-5 space-y-1.5">
        <button 
          onClick={() => setActiveTab('main')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'main' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
              : 'text-slate-500 hover:bg-white hover:shadow-sm'
          }`}
        >
          {profile?.role === 'seller' ? <Store size={18}/> : <ShoppingBag size={18}/>}
          {profile?.role === 'seller' ? 'Toko Saya' : 'Marketplace'}
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25' 
              : 'text-slate-500 hover:bg-white hover:shadow-sm'
          }`}
        >
          <BrainCircuit size={18}/>
          AI Insights
        </button>
      </div>

      {/* System Status */}
      <div className="px-5 py-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">System Status</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <Sparkles size={12} className="text-blue-500" />
                Gemini Vision
              </span>
              <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                <TrendingUp size={12} className="text-purple-500" />
                Analytics Engine
              </span>
              <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-[90%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-5"><div className="h-px bg-slate-200/80"></div></div>

      {/* Wallet Section */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Wallet size={10} /> Solana Wallet
        </h3>
        
        <div className="wallet-adapter-wrapper">
          <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !rounded-2xl !h-auto !py-3 !px-4 !font-bold !text-[12px] !w-full !transition-all hover:!opacity-90 active:!scale-[0.97] !shadow-lg !shadow-blue-500/20" />
        </div>
        
        {connected && publicKey && (
          <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
            {/* SOL Balance */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">SOL Balance</span>
                <Coins size={14} className="text-amber-500" />
              </div>
              <div className="text-xl font-black text-slate-800 flex items-baseline gap-1 font-mono">
                {solBalance !== null ? solBalance.toFixed(4) : '—'}
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">SOL</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-slate-100"></div>
            
            {/* CBDC Balance */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Digital Rupiah</span>
                <Zap size={14} className="text-blue-500" />
              </div>
              <div className="text-xl font-black text-blue-600 flex items-baseline gap-1 font-mono">
                {cbdcBalance !== null ? cbdcBalance.toLocaleString() : '—'}
                <span className="text-[10px] text-slate-400 uppercase font-sans font-bold ml-1">CBDC</span>
              </div>
            </div>

            {/* Airdrop Button */}
            <button 
              onClick={handleAirdrop}
              disabled={airdropping}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-[10px] font-black text-slate-500 hover:text-blue-600 transition-all disabled:opacity-50 cursor-pointer"
            >
              {airdropping ? <Loader2 size={12} className="animate-spin"/> : <ArrowDownCircle size={12}/>}
              REQUEST DEVNET AIRDROP
            </button>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      <div className="p-5 mt-auto">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100/50 rounded-2xl">
          <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
            <strong className="text-blue-800">💡 Tips AI:</strong> Foto dengan pencahayaan terang membuat Gemini Vision menganalisis produk Anda lebih akurat.
          </p>
        </div>
      </div>
    </aside>
  );
};
