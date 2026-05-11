import React, { useState } from 'react';
import { Sparkles, Shield, Zap, Globe, Mail, Lock, Loader2, ArrowRight, UserCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginPageProps {
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  const { login, loginEmail, loginDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      await loginEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginDemo();
    } catch (err: any) {
      setError(err.message || 'Demo login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0e1a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/[0.05] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit">
          <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
        </div>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full glass rounded-[2.5rem] p-10 text-center relative z-10 animate-slide-up shadow-2xl shadow-black/20">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-6 opacity-80"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <span className="text-white text-3xl font-black italic">S</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-1 tracking-tight">SolanaWarung</h1>
        <p className="text-gradient text-[11px] font-bold uppercase tracking-[0.3em] mb-6">AI × Blockchain × UMKM</p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold">
            <Sparkles size={10}/> Gemini AI
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
            <Shield size={10}/> Escrow
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold">
            <Zap size={10}/> Solana
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold">
            <Globe size={10}/> CBDC
          </span>
        </div>
        
        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3 mb-4 text-left">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm font-medium"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm font-medium"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-medium text-center bg-red-500/10 rounded-lg py-2 px-3">{error}</p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-blue-500/25 disabled:opacity-50 cursor-pointer text-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            Masuk dengan Email
          </button>
        </form>

        <p className="text-slate-600 text-[11px] mb-3">Belum punya akun? Otomatis terdaftar saat login pertama.</p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">atau</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Google Login */}
        <button 
          onClick={login}
          disabled={loading}
          className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg group cursor-pointer disabled:opacity-50 text-sm mb-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        {/* Demo Login */}
        <button 
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] cursor-pointer disabled:opacity-50 text-sm"
        >
          <UserCircle size={16} />
          Masuk Mode Demo
        </button>

        {/* Tombol Kembali ke Beranda */}
        <button 
          onClick={onBackToLanding}
          disabled={loading}
          className="w-full py-3 px-6 bg-transparent border border-white/10 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.97] cursor-pointer disabled:opacity-50 text-sm mt-4"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </button>
        
        <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-[0.25em] font-bold">
          Google Vibe Coding Competition 2026
        </p>
      </div>
    </div>
  );
};
