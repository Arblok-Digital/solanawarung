import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, ShieldCheck, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, increment, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const WalletPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) return;

    // 1. Listen to Wallet Balance
    const walletRef = doc(db, 'wallets', user.uid);
    const unsubWallet = onSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        setBalance(doc.data().saldo || 0);
      } else {
        // Init wallet if not exists
        setBalance(0);
      }
    });

    // 2. Listen to Transactions
    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const unsubTx = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txs);
    });

    return () => {
      unsubWallet();
      unsubTx();
    };
  }, [user]);

  const handleTopUp = async () => {
    if (!user || !topUpAmount) return;
    setIsProcessing(true);
    try {
      // 1. Update Balance (pake setDoc + merge biar auto-create kalau belum ada)
      const walletRef = doc(db, 'wallets', user.uid);
      const { setDoc } = await import('firebase/firestore');
      await setDoc(walletRef, {
        uid: user.uid,
        saldo: increment(topUpAmount),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Record Transaction
      await addDoc(collection(db, 'transactions'), {
        uid: user.uid,
        jumlah: topUpAmount,
        jenis: 'masuk',
        keterangan: 'Top Up Digital Rupiah',
        status: 'berhasil',
        timestamp: serverTimestamp()
      });

      alert(`✅ Berhasil isi saldo Rp ${topUpAmount.toLocaleString('id-ID')}`);
      setTopUpAmount(null);
    } catch (err) {
      console.error('Top up error:', err);
      alert('Gagal isi saldo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-700 p-3 md:p-0">
      {/* Hero Wallet Card */}
      <div className="relative overflow-hidden bg-[#0c111d] rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-600/20 blur-[80px] md:blur-[100px] -mr-16 md:-mr-32 -mt-16 md:-mt-32"></div>
        <div className="absolute bottom-0 left-0 w-36 md:w-48 h-36 md:h-48 bg-purple-600/10 blur-[60px] md:blur-[80px] -ml-12 md:-ml-24 -mb-12 md:-mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest">
              <ShieldCheck size={12} /> Keamanan Terjamin On-Chain
            </div>
            <h2 className="text-xs md:text-sm font-medium text-slate-400">Total Saldo Digital Rupiah</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-6xl font-black tracking-tight">
                Rp {balance.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            <button 
              onClick={() => document.getElementById('topup-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> Isi Saldo
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/10">
              <ArrowUpRight size={16} /> Kirim
            </button>
          </div>
        </div>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-[11px] md:text-xs font-medium text-slate-400 border-t border-white/5 pt-4 md:pt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Status: Aktif
          </div>
          <div className="flex items-center gap-2">
            <Wallet size={14} className="text-blue-500" />
            Wallet: {profile?.walletAddress ? `${profile.walletAddress.substring(0, 6)}...${profile.walletAddress.substring(38)}` : 'Demo Account'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Up Section */}
        <div id="topup-section" className="lg:col-span-1 space-y-6">
          <div className="bg-[#0D0D12] rounded-[2rem] p-6 border border-white/5 shadow-sm">
            <h3 className="text-base font-black text-white mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" /> Isi Saldo Instan
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[50000, 100000, 250000, 500000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border
                    ${topUpAmount === amt 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-blue-300'}`}
                >
                  Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
            <button
              onClick={handleTopUp}
              disabled={!topUpAmount || isProcessing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-blue-500/20 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Proses Isi Saldo
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="font-black text-sm mb-2 relative z-10">Mengenal Digital Rupiah</h4>
            <p className="text-[11px] text-indigo-100 leading-relaxed relative z-10">
              Uang elektronik resmi dari Bank Indonesia yang memungkinkan transaksi instan dan aman di ekosistem SolanaWarung.
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2">
          <div className="bg-[#0D0D12] rounded-[2rem] border border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <History size={18} className="text-blue-600" /> Riwayat Transaksi
              </h3>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Lihat Semua</button>
            </div>
            
            <div className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                        ${tx.jenis === 'masuk' ? 'bg-emerald-900/20 text-emerald-400' : 'bg-blue-900/20 text-blue-400'}`}>
                        {tx.jenis === 'masuk' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{tx.keterangan}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {tx.timestamp?.toDate().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) || 'Memproses...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.jenis === 'masuk' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.jenis === 'masuk' ? '+' : '-'} Rp {tx.jumlah.toLocaleString('id-ID')}
                      </p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Success</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Belum ada transaksi</p>
                  <p className="text-[10px] text-slate-300 mt-1">Transaksi Anda akan muncul di sini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
