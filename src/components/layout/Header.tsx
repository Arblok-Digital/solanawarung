import React, { useState, useEffect } from 'react';
import { LogOut, Wifi, Code, Database, Loader2, Sparkles, Coins } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Transaction, PublicKey } from '@solana/web3.js';
import { createMintToInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { CBDC_MINT } from '../../config/solana';
import { getCBDCBalance } from '../../services/solana/cbdc';

// Default styles for the wallet adapter modal - Wajib agar modal muncul
import '@solana/wallet-adapter-react-ui/styles.css';
// Custom style for Wallet Button to match our premium theme
import '../../styles/wallet-button.css';

export const Header: React.FC = () => {
  const { user, profile, logout, switchRole, seedData } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [minting, setMinting] = useState(false);

  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [cbdcBalance, setCbdcBalance] = useState<number>(0);

  const updateBalances = async () => {
    if (connected && publicKey) {
      // Fetch SOL
      const solBal = await connection.getBalance(publicKey);
      setBalance(solBal / LAMPORTS_PER_SOL);

      // Fetch Digital Rupiah (CBDC)
      const idrBal = await getCBDCBalance(publicKey);
      setCbdcBalance(idrBal);
    } else {
      setBalance(null);
      setCbdcBalance(0);
    }
  };

  useEffect(() => {
    updateBalances();
    const id = setInterval(updateBalances, 10000); // Polling per 10 detik
    return () => clearInterval(id);
  }, [publicKey, connected, connection]);

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
    <header className="h-14 md:h-16 bg-[#0c111d] text-white flex items-center justify-between px-3 md:px-8 shrink-0 shadow-lg z-20 relative">
      {/* Subtle gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
        <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center font-black text-base md:text-lg italic shadow-lg shadow-blue-500/20 shrink-0">S</div>
        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-black tracking-tight leading-none truncate">
            {profile?.role === 'seller' && profile?.warungName ? profile.warungName : 'SolanaWarung'}
          </h1>
          <div className="flex items-center gap-1 md:gap-1.5 mt-0.5">
            <Wifi size={7} className="text-emerald-400 shrink-0" />
            <span className="text-[8px] md:text-[9px] text-slate-300 uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold truncate">
              {profile?.role === 'seller' ? 'Powered by SolanaWarung • Devnet' : 'Buyer Space • Devnet'}
            </span>
          </div>
        </div>
      </div>

      {/* MINT CBDC SIMULATION (Devnet Only) */}
      {connected && (
        <button
          onClick={async () => {
            // 1. Validasi ketersediaan Wallet & Config
            if (!publicKey || !connected) return alert("Konekin wallet dulu bro!"); // Pastikan wallet konek
            if (!CBDC_MINT) return alert("Alamat Mint Digital Rupiah (CBDC_MINT) belum dikonfigurasi di src/config/solana.ts!"); // Safety check if config is missed

            setMinting(true);
            try {
              // 1. Ambil blockhash terbaru untuk strategi konfirmasi yang stabil
              const latestBlockhash = await connection.getLatestBlockhash();

              // 2. Konversi string/null ke Object PublicKey untuk menghindari error 'toBuffer'
              const mintPublicKey = new PublicKey(CBDC_MINT);

              // 3. Ambil Associated Token Address (ATA)
              const ata = await getAssociatedTokenAddress(mintPublicKey, publicKey);
              if (!ata) throw new Error("Gagal menghitung alamat Token Account.");

              const amount = 1000000 * Math.pow(10, 9); // Mint 1jt token (asumsi 9 desimal)

              const transaction = new Transaction().add(
                createMintToInstruction(
                  mintPublicKey,
                  ata,
                  publicKey, // Authority (User bertindak sebagai authority di dummy mint ini)
                  amount,
                  [],
                  TOKEN_PROGRAM_ID
                )
              );

              const signature = await sendTransaction(transaction, connection);

              // UX Optimis: Refresh saldo setelah 3 detik tanpa menunggu konfirmasi penuh
              setTimeout(() => {
                updateBalances();
              }, 3000);

              // 4. Konfirmasi transaksi dengan strategi Latest Blockhash (Anti-timeout)
              await connection.confirmTransaction({
                signature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
              }, 'confirmed');

              alert("✅ Minting Sukses! Saldo Digital Rupiah Anda telah diperbarui di blockchain Devnet.");
              updateBalances();
            } catch (err: any) {
              console.error("Minting gagal:", err);
              alert("Minting Gagal: " + (err.message || "User menolak transaksi atau authority tidak valid."));
            } finally {
              setMinting(false);
            }
          }}
          disabled={minting}
          className="hidden lg:flex items-center gap-2 px-3 h-[38px] bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-[10px] transition-all text-[9px] font-black uppercase tracking-widest cursor-pointer"
        >
          {minting ? <Loader2 size={10} className="animate-spin" /> : <Coins size={10} />}
          Mint IDR-D
        </button>
      )}

      <div className="flex items-center gap-1.5 md:gap-4">
        {/* Seed Data Button — icon only on mobile */}
        <button
          onClick={handleSeed}
          disabled={seeding}
          aria-label="Seed Data"
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 h-8 md:h-[38px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg md:rounded-[10px] transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest cursor-pointer group"
        >
          {seeding ? <Loader2 size={10} className="animate-spin" /> : <Database size={10} />}
          <span className="hidden sm:inline">Seed Data</span>
        </button>

        {/* Wallet Connector */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex gap-2 md:gap-4">
            {connected && balance !== null && (
              <div className="text-right hidden sm:block border-r border-slate-700/50 pr-3">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Solana</p>
                <p className="text-[11px] font-black text-[#14F195]">{balance.toFixed(4)}</p>
              </div>
            )}
            {connected && (
              <div className="text-right hidden sm:block border-r border-slate-700/50 pr-3">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">IDR-D</p>
                <p className="text-[11px] font-black text-blue-400">{cbdcBalance.toLocaleString('id-ID')}</p>
              </div>
            )}
          </div>
          <WalletMultiButton />
        </div>

        {/* Dev Mode Role Switcher — icon only on mobile */}
        <button
          onClick={toggleRole}
          aria-label={`Ganti ke mode ${profile?.role === 'seller' ? 'Pembeli' : 'Penjual'}`}
          className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 h-8 md:h-[38px] bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg md:rounded-[10px] transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest cursor-pointer group"
          title="Switch Role (Dev Mode)"
        >
          <Code size={10} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Switch to {profile?.role === 'seller' ? 'Buyer' : 'Seller'}</span>
        </button>

        {/* User info — desktop only */}
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

        {/* Logout — always visible */}
        <button
          onClick={logout}
          aria-label="Keluar dari akun"
          className="p-2 hover:bg-white/5 rounded-lg md:rounded-xl text-slate-500 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
