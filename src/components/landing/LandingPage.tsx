import React, { useState, useEffect } from 'react';
import {
  Search, Camera, Wallet, TrendingUp, UserPlus, Store,
  CheckCircle, Package, ArrowRight, ShieldCheck, Plus,
} from 'lucide-react';
import { RoadmapSection } from './RoadmapSection';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-x-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
            --bg-color: #0A0A0F;
            --primary-green: #14F195;
            --primary-purple: #9945FF;
            --text-white: #FFFFFF;
            --text-dim: #94A3B8;
            --card-bg: rgba(255, 255, 255, 0.03);
            --border-color: rgba(255, 255, 255, 0.08);
            --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal { opacity: 0; transform: translateY(30px); transition: var(--transition); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid var(--border-color); }
        .hero-glow-1 { position: absolute; top: -10%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(153, 69, 255, 0.1) 0%, transparent 70%); z-index: -1; }
        .hero-glow-2 { position: absolute; bottom: 0%; left: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(20, 241, 149, 0.05) 0%, transparent 70%); z-index: -1; }
        .btn { padding: 14px 28px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; font-size: 13px; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: none; }
        .btn-primary { background: linear-gradient(135deg, var(--primary-green), #10c77b); color: #000; box-shadow: 0 10px 20px -5px rgba(20, 241, 149, 0.3); }
        .btn-secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-white); border: 1px solid var(--border-color); backdrop-filter: blur(10px); }
        .faq-content { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease; }
        .faq-item.active .faq-content { max-height: 200px; padding-bottom: 24px; }
        .faq-item.active .faq-icon { transform: rotate(45deg); color: var(--primary-green); }
        .tab-content { display: none; }
        .tab-content.active { display: block; animation: fade-in 0.5s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      ` }} />

      <nav className="h-[90px] flex items-center justify-between fixed top-0 left-0 right-0 z-[1000] bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 flex justify-between items-center w-full">
          <div className="flex items-center gap-3 font-extrabold text-xl tracking-tighter">
            <div className="w-9 h-9 bg-gradient-to-br from-[#14F195] to-[#9945FF] rounded-xl flex items-center justify-center font-black text-lg italic text-white">S</div>
            <span>SolanaWarung</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/vision.html" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Visi &amp; Misi</a>
            <button onClick={onEnter} className="btn btn-secondary">Masuk Marketplace</button>
          </div>
        </div>
      </nav>

      <main id="main-content">
        <section id="hero" className="pt-[180px] pb-[100px] relative text-center">
          <div className="hero-glow-bg"></div>
          <div className="hero-glow-1"></div>
          <div className="hero-glow-2"></div>
          <div className="container mx-auto px-6">
            <span className="hero-badge hero-badge-float reveal inline-block bg-[#9945FF]/10 border border-[#9945FF]/20 text-[#c084fc] px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-6">Web3 for UMKM Indonesia</span>
            <h1 className="reveal text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Jualan Lebih Mudah.<br /><span className="highlight-safe">Dibayar Lebih Aman</span>.<br /><span className="highlight-ai">Tumbuh dengan AI</span>.
            </h1>
            <p className="reveal text-lg text-[#94A3B8] max-w-[700px] mx-auto mb-10 font-medium">
              SolanaWarung adalah marketplace UMKM Indonesia pertama yang menggunakan Gemini AI untuk listing produk otomatis dan Digital Rupiah untuk transaksi yang transparan.
            </p>

            <div className="hero-actions reveal flex justify-center gap-4 mb-14">
              <button onClick={onEnter} className="btn btn-primary">Mulai Jualan Gratis <ArrowRight size={16} /></button>
              <a href="/vision.html" className="btn btn-secondary">Visi &amp; Misi CBDC</a>
            </div>

            <div className="stats-grid reveal grid grid-cols-1 md:grid-cols-3 max-w-[800px] mx-auto border-t border-white/10 pt-10">
              <div className="stat-item p-4">
                <h2 className="text-xl font-extrabold mb-1">10.000+</h2>
                <p className="text-[11px] uppercase tracking-widest text-[#94A3B8]">Seller UMKM</p>
              </div>
              <div className="stat-item p-4">
                <h2 className="text-xl font-extrabold mb-1">Rp 0</h2>
                <p className="text-[11px] uppercase tracking-widest text-[#94A3B8]">Biaya Pendaftaran</p>
              </div>
              <div className="stat-item p-4">
                <h2 className="text-xl font-extrabold mb-1">Gemini AI</h2>
                <p className="text-[11px] uppercase tracking-widest text-[#94A3B8]">Listing Otomatis</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-[100px] bg-gradient-to-b from-transparent to-white/[0.01]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-[60px] reveal">
              <h2 className="text-[40px] font-extrabold tracking-tight">Kenalan Dulu sama SolanaWarung</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="reveal p-10 rounded-[32px] glass hover:border-[#14F195] transition-all">
                <div className="w-[60px] h-[60px] bg-[#14F195]/10 rounded-[18px] flex items-center justify-center text-[#14F195] mb-6"><Camera size={28} /></div>
                <h3 className="text-[22px] font-extrabold mb-3">Foto, Langsung Jadi Produk</h3>
                <p className="text-[#94A3B8] text-[15px] leading-relaxed">Cukup foto produkmu, AI kami langsung analisis dan buatkan deskripsi, kategori, serta estimasi harga yang tepat.</p>
              </div>
              <div className="reveal p-10 rounded-[32px] glass hover:border-[#14F195] transition-all">
                <div className="w-[60px] h-[60px] bg-[#14F195]/10 rounded-[18px] flex items-center justify-center text-[#14F195] mb-6"><Wallet size={28} /></div>
                <h3 className="text-[22px] font-extrabold mb-3">Bayar Pakai Digital Rupiah</h3>
                <p className="text-[#94A3B8] text-[15px] leading-relaxed">Transaksi menggunakan Digital Rupiah yang aman. Dana pembeli ditahan dulu sampai barang dikonfirmasi diterima.</p>
              </div>
              <div className="reveal p-10 rounded-[32px] glass hover:border-[#14F195] transition-all">
                <div className="w-[60px] h-[60px] bg-[#14F195]/10 rounded-[18px] flex items-center justify-center text-[#14F195] mb-6"><TrendingUp size={28} /></div>
                <h3 className="text-[22px] font-extrabold mb-3">Dapat Saran Bisnis AI</h3>
                <p className="text-[#94A3B8] text-[15px] leading-relaxed">Setiap minggu, AI kami analisis penjualanmu dan kasih saran optimasi stok dan ide produk baru.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-to" className="py-[100px]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-[60px] reveal">
              <h2 className="text-[40px] font-extrabold tracking-tight">Cara Menggunakan</h2>
            </div>

            <div className="reveal p-8 md:p-[60px] rounded-[40px] glass">
              <div className="flex bg-black/20 p-1.5 rounded-2xl w-fit mx-auto mb-[60px]">
                <button onClick={() => setActiveTab('seller')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'seller' ? 'bg-[#9945FF] text-white shadow-lg' : 'text-[#94A3B8]'}`}>Mode Seller</button>
                <button onClick={() => setActiveTab('buyer')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'buyer' ? 'bg-[#9945FF] text-white shadow-lg' : 'text-[#94A3B8]'}`}>Mode Buyer</button>
              </div>

              <div id="seller-steps" className={`tab-content ${activeTab === 'seller' ? 'active' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">01</span>
                    <UserPlus className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Daftar Akun</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Proses cuma 30 detik pakai akun Google. Gak perlu form ribet.</p>
                  </div>
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">02</span>
                    <Store className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Aktifkan Toko</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Satu klik tombol "Jadikan Seller" di profil, tokomu langsung live.</p>
                  </div>
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">03</span>
                    <Camera className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Foto Produkmu</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Upload foto dari HP. AI langsung bikin deskripsi & kategori otomatis.</p>
                  </div>
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">04</span>
                    <CheckCircle className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Terima Pesanan</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Konfirmasi pesanan, kirim barang, dana langsung masuk dompet digital.</p>
                  </div>
                </div>
              </div>

              <div id="buyer-steps" className={`tab-content ${activeTab === 'buyer' ? 'active' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">01</span>
                    <Search className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Browse Produk</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Cari produk UMKM favoritmu langsung tanpa harus login dulu.</p>
                  </div>
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">02</span>
                    <Wallet className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Isi Saldo</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Top-up saldo Digital Rupiah instan buat mulai belanja aman.</p>
                  </div>
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">03</span>
                    <ShieldCheck className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Bayar Aman</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Dana dilindungi sistem Escrow. Aman dari penipuan jual-beli.</p>
                  </div>
                  <div className="step-item relative">
                    <span className="step-num text-5xl font-black text-white/5 absolute -top-3 -left-3">04</span>
                    <Package className="text-[#9945FF] mb-5 relative z-10" size={50} />
                    <h2 className="text-lg font-extrabold mb-2 relative z-10">Terima Barang</h2>
                    <p className="text-sm text-[#94A3B8] relative z-10">Barang sampai, konfirmasi, dan dukung UMKM lokal terus berkembang.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION ROADMAP — Responsive React Component */}
        <RoadmapSection />

        <section id="faq" className="py-[100px]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-[60px] reveal">
              <h2 className="text-[40px] font-extrabold tracking-tight">Pertanyaan Sering Diajukan</h2>
            </div>

            <div className="faq-grid max-w-[800px] mx-auto flex flex-col gap-4">
              {[
                { q: "Apakah SolanaWarung gratis?", a: "Daftar dan buka toko di SolanaWarung sepenuhnya gratis. Tidak ada biaya bulanan. Kami hanya mengambil komisi sangat kecil dari setiap transaksi yang berhasil." },
                { q: "Harus paham Blockchain?", a: "Sama sekali tidak. Kamu cukup daftar dengan akun Google. Teknologi blockchain bekerja \"di balik layar\" untuk keamanan tanpa kamu harus pusing cara kerjanya." },
                { q: "Apa itu Digital Rupiah?", a: "Digital Rupiah adalah versi digital Rupiah yang transparan dan aman. Saat ini kami menggunakan simulasi berbasis CBDC agar sistem siap saat BI meluncurkannya nanti." },
                { q: "Gimana kalau barang gak datang?", a: "Dana kamu ditahan oleh sistem Escrow kami. Seller baru terima uang setelah barang dikonfirmasi sampai. Kalau ada masalah, dana bisa dikembalikan 100%." }
              ].map((item, idx) => (
                <div key={idx} className={`faq-item reveal glass rounded-2xl overflow-hidden transition-all ${openFaq === idx ? 'active' : ''}`}>
                  <div className="faq-header p-8 flex justify-between items-center cursor-pointer" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    <h3 className="font-bold text-base">{item.q}</h3>
                    <Plus size={20} className="faq-icon" />
                  </div>
                  <div className="faq-content px-8 text-[#94A3B8] text-sm leading-relaxed">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta-final" className="py-[100px] text-center">
          <div className="container mx-auto px-6">
            <div className="cta-box reveal bg-gradient-to-br from-[#13131F] to-[#0A0A0F] border border-white/10 p-20 rounded-[40px] relative overflow-hidden">
              <h2 className="text-5xl font-black mb-4 relative z-10 leading-tight">Siap Bawa Warungmu ke Level Berikutnya?</h2>
              <p className="text-[#94A3B8] text-lg mb-10 relative z-10">Bergabung dengan ribuan UMKM Indonesia yang sudah pakai SolanaWarung. Gratis, mudah, dan bertenaga AI.</p>
              <button onClick={onEnter} className="btn btn-primary text-base px-10 py-5">Mulai Sekarang — Gratis</button>
              <span className="block mt-4 text-xs text-white/30 relative z-10">Tidak perlu kartu kredit. Daftar dengan akun Google dalam 30 detik.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="footer-grid flex justify-between flex-wrap gap-10 mb-[60px]">
            <div className="footer-info max-w-[300px]">
              <div className="logo flex items-center gap-3 font-extrabold text-xl mb-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#14F195] to-[#9945FF] rounded-xl flex items-center justify-center italic text-white">S</div>
                <span>SolanaWarung</span>
              </div>
              <p className="text-sm text-[#94A3B8]">From warung to the world. Platform marketplace UMKM masa depan bertenaga AI.</p>
            </div>
            <div className="footer-links flex gap-20">
              <div className="link-col">
                <h3 className="text-sm font-extrabold uppercase tracking-widest mb-5">Platform</h3>
                <div className="space-y-3">
                  <a href="#" onClick={(e) => { e.preventDefault(); onEnter(); }} className="block text-sm text-[#94A3B8] hover:text-[#14F195]">Marketplace</a>
                  <a href="#how-to" className="block text-sm text-[#94A3B8] hover:text-[#14F195]">Cara Pakai</a>
                </div>
              </div>
              <div className="link-col">
                <h3 className="text-sm font-extrabold uppercase tracking-widest mb-5">Perusahaan</h3>
                <div className="space-y-3">
                  <a href="#" className="block text-sm text-[#94A3B8] hover:text-[#14F195]">Tentang Kami</a>
                  <a href="#" className="block text-sm text-[#94A3B8] hover:text-[#14F195]">Hubungi Kami</a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom flex justify-between items-center pt-10 border-t border-white/5 text-[11px] text-white/20 font-bold uppercase tracking-widest">
            <span className="text-slate-400">&copy; 2026 SolanaWarung — Arblok Digital, Tasikmalaya</span>
            <span className="flex items-center gap-2 text-slate-400">Dibangun dengan Gemini AI × Google Cloud × Solana</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
