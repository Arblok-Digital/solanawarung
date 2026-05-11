import React, { useState, useEffect } from 'react';
import { 
  Search, Camera, Wallet, TrendingUp, UserPlus, Store, 
  CheckCircle, Package, ArrowRight, ShieldCheck, Database, 
  LogOut, Wifi, Code, Sparkles, ChevronDown, Plus, 
  Rocket, CircleDollarSign, Lock, Smartphone, Globe, Shield,
  AlertCircle, Zap
} from 'lucide-react';

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
  }, [activeTab]); // Re-observe when tab changes

  const faqs = [
    { q: "Apakah SolanaWarung gratis?", a: "Ya, daftar dan buka toko di SolanaWarung sepenuhnya gratis. Tidak ada biaya bulanan. Kami hanya mengambil komisi kecil dari setiap transaksi yang berhasil." },
    { q: "Apakah saya harus paham blockchain untuk pakai SolanaWarung?", a: "Sama sekali tidak. Kamu cukup daftar dengan akun Google dan langsung bisa jual atau beli. Teknologi blockchain bekerja di balik layar tanpa kamu perlu tahu cara kerjanya." },
    { q: "Apa itu Digital Rupiah dan apa bedanya dengan saldo biasa?", a: "Digital Rupiah adalah versi digital dari Rupiah yang dicatat di sistem yang transparan dan tidak bisa dimanipulasi. Di SolanaWarung saat ini kami menggunakan simulasi Digital Rupiah. Ketika Bank Indonesia resmi meluncurkan Digital Rupiah, sistem kami sudah siap untuk berintegrasi langsung." },
    { q: "Bagaimana kalau saya sudah bayar tapi barang tidak datang?", a: "Dana kamu tidak langsung ke seller saat kamu bayar. Dana ditahan oleh sistem escrow kami. Seller baru mendapat dana setelah mereka konfirmasi pengiriman. Kalau ada masalah, kamu bisa ajukan komplain dan dana dikembalikan." },
    { q: "Produk apa saja yang bisa dijual di SolanaWarung?", a: "Semua produk legal bisa dijual. Fokus kami adalah produk UMKM Indonesia seperti makanan dan minuman, kerajinan tangan, pakaian, hasil pertanian, dan produk rumahan lainnya." },
    { q: "Apakah data saya aman?", a: "Ya. Kami menggunakan Firebase Authentication dari Google untuk keamanan akun. Data transaksi dicatat di sistem yang terdesentralisasi sehingga tidak bisa diubah oleh pihak manapun termasuk kami." }
  ];

  return (
    <div className="h-screen overflow-y-auto bg-[#0A0A0F] text-white font-sans overflow-x-hidden selection:bg-[#14F195]/30">
      <style>{`
        .reveal { transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .step-card { transition: all 0.4s ease; border: 1px solid rgba(255,255,255,0.05); }
        .step-card:hover { transform: translateY(-5px); border-color: rgba(153, 69, 255, 0.3); background: rgba(153, 69, 255, 0.05); }
      `}</style>

      {/* Hero (Sudah ada, tapi dipastikan render onEnter) */}
      <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#14F195] to-[#9945FF] rounded-xl flex items-center justify-center font-black text-lg italic">S</div>
            <span className="font-black text-xl tracking-tight">SolanaWarung</span>
          </div>
          <button onClick={onEnter} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition-all">Masuk Marketplace</button>
        </div>
      </nav>

      <section className="pt-40 pb-20 relative text-center">
        <div className="container mx-auto px-6">
          <span className="hero-badge reveal px-4 py-2 bg-[#9945FF]/10 border border-[#9945FF]/20 text-[#9945FF] rounded-full text-[11px] font-black uppercase tracking-widest mb-8 inline-block">Web3 UMKM Marketplace</span>
          <h1 className="reveal text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Jualan Lebih Mudah.<br/>Dibayar Lebih Aman.<br/>Tumbuh dengan AI.
          </h1>
          <p className="reveal text-lg text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            SolanaWarung adalah marketplace UMKM Indonesia pertama yang menggunakan Gemini AI untuk listing produk otomatis dan Digital Rupiah untuk transaksi yang transparan.
          </p>
          <div className="hero-actions reveal flex flex-wrap justify-center gap-4 mb-20">
            <button onClick={onEnter} className="px-8 py-4 bg-[#14F195] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-all flex items-center gap-2">Mulai Jualan Gratis <ArrowRight size={16} /></button>
            <button onClick={onEnter} className="px-8 py-4 glass hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all">Lihat Marketplace</button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — APA ITU SOLANAWARUNG */}
      <section id="about" className="py-24 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black tracking-tight mb-4">Kenalan Dulu sama SolanaWarung</h2>
            <p className="text-slate-400">Platform masa depan untuk UMKM Indonesia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="reveal p-10 rounded-[2.5rem] glass hover:border-[#14F195]/50 transition-all">
              <div className="w-14 h-14 bg-[#14F195]/10 rounded-2xl flex items-center justify-center text-[#14F195] mb-8"><Camera size={28} /></div>
              <h3 className="text-2xl font-black mb-4">Foto, Langsung Jadi Produk</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Cukup foto produkmu, AI kami langsung analisis dan buatkan deskripsi, kategori, serta estimasi harga yang tepat. Tidak perlu mengetik panjang-panjang.</p>
            </div>
            <div className="reveal p-10 rounded-[2.5rem] glass hover:border-[#14F195]/50 transition-all">
              <div className="w-14 h-14 bg-[#14F195]/10 rounded-2xl flex items-center justify-center text-[#14F195] mb-8"><Wallet size={28} /></div>
              <h3 className="text-2xl font-black mb-4">Bayar Pakai Digital Rupiah</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Transaksi menggunakan Digital Rupiah yang aman dan transparan. Dana pembeli ditahan dulu sampai barang dikonfirmasi diterima.</p>
            </div>
            <div className="reveal p-10 rounded-[2.5rem] glass hover:border-[#14F195]/50 transition-all">
              <div className="w-14 h-14 bg-[#14F195]/10 rounded-2xl flex items-center justify-center text-[#14F195] mb-8"><TrendingUp size={28} /></div>
              <h3 className="text-2xl font-black mb-4">Dapat Saran Bisnis dari AI</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Setiap minggu, AI kami analisis penjualanmu dan kasih saran: produk apa yang perlu direstok, jam ramai pembeli, dan ide produk baru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CARA PAKAI (MANUAL BOOK VISUAL) */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black tracking-tight">Cara Menggunakan</h2>
          </div>

          <div className="reveal p-8 md:p-16 rounded-[3rem] glass">
            <div className="flex bg-black/40 p-1.5 rounded-2xl w-fit mx-auto mb-16">
              <button onClick={() => setActiveTab('seller')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'seller' ? 'bg-[#9945FF] text-white shadow-lg shadow-[#9945FF]/30' : 'text-slate-500 hover:text-white'}`}>Seller (Penjual)</button>
              <button onClick={() => setActiveTab('buyer')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'buyer' ? 'bg-[#9945FF] text-white shadow-lg shadow-[#9945FF]/30' : 'text-slate-500 hover:text-white'}`}>Buyer (Pembeli)</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeTab === 'seller' ? (
                <>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <UserPlus className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 1 — Daftar Akun</h4>
                    <p className="text-sm text-slate-400">Klik tombol Daftar Sekarang, masuk menggunakan akun Google. Proses cuma 30 detik. Tidak perlu isi form panjang.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Store className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 2 — Aktifkan Toko</h4>
                    <p className="text-sm text-slate-400">Setelah masuk, buka halaman Profil dan klik tombol Jadikan Seller. Tokomu langsung aktif dan siap menerima pembeli.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Camera className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 3 — Foto Produkmu</h4>
                    <p className="text-sm text-slate-400">Buka menu Tambah Produk, upload foto produkmu. Bisa dari kamera HP langsung atau galeri. Satu foto cukup.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Sparkles className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 4 — AI Bekerja</h4>
                    <p className="text-sm text-slate-400">Klik Analisis AI. Dalam detik, nama produk, kategori, deskripsi, dan estimasi harga terisi otomatis. Tinggal cek & edit.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Rocket className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 5 — Produk Live</h4>
                    <p className="text-sm text-slate-400">Klik Simpan Produk. Produkmu langsung muncul di marketplace dan bisa ditemukan pembeli dari seluruh Indonesia.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <CircleDollarSign className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 6 — Terima Pesanan</h4>
                    <p className="text-sm text-slate-400">Setelah kamu konfirmasi barang sudah dikirim, dana dari pembeli langsung masuk ke dompet Digital Rupiahmu.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Search className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 1 — Browse Produk</h4>
                    <p className="text-sm text-slate-400">Langsung lihat semua produk tanpa login. Untuk membeli, daftar dulu pakai akun Google. Gratis dan cepat.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Wallet className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 2 — Isi Dompet</h4>
                    <p className="text-sm text-slate-400">Buka menu Dompet dan klik Isi Saldo. Pilih nominal yang kamu mau. Saldo langsung siap digunakan belanja.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <Package className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 3 — Pilih Produk</h4>
                    <p className="text-sm text-slate-400">Browse marketplace, cari produk UMKM Indonesia. Semua produk dijual langsung oleh penjual lokal.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <ShieldCheck className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 4 — Bayar Aman</h4>
                    <p className="text-sm text-slate-400">Saat kamu bayar, dana ditahan oleh sistem escrow sampai seller kirim barang. Kamu aman dari penipuan.</p>
                  </div>
                  <div className="step-card p-8 rounded-3xl reveal">
                    <CheckCircle className="text-[#9945FF] mb-6" size={32} />
                    <h4 className="text-lg font-black mb-2">Step 5 — Konfirmasi</h4>
                    <p className="text-sm text-slate-400">Setelah barang diterima, seller konfirmasi dan transaksi selesai. Riwayat belanjamu tersimpan rapi.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — KENAPA SOLANAWARUNG */}
      <section className="py-24 bg-[#14F195]/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black tracking-tight">Kenapa SolanaWarung?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14F195] border border-[#14F195]/20"><Rocket size={32} /></div>
              <h4 className="text-xl font-bold mb-4">Listing Produk 3 Menit</h4>
              <p className="text-slate-400 text-sm">Dengan bantuan AI, seller tidak perlu skill fotografi atau copywriting. Foto, klik, langsung jual.</p>
            </div>
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14F195] border border-[#14F195]/20"><Shield size={32} /></div>
              <h4 className="text-xl font-bold mb-4">Transaksi Transparan</h4>
              <p className="text-slate-400 text-sm">Setiap transaksi tercatat di blockchain. Tidak bisa dimanipulasi, tidak bisa digelapkan oleh pihak manapun.</p>
            </div>
            <div className="reveal text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14F195] border border-[#14F195]/20"><Globe size={32} /></div>
              <h4 className="text-xl font-bold mb-4">Siap Era Digital Rupiah</h4>
              <p className="text-slate-400 text-sm">SolanaWarung dibangun dengan fondasi CBDC. Ketika BI resmi luncurkan Digital Rupiah, kami sudah siap.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FAQ accordion */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black tracking-tight">Tanya Jawab (FAQ)</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="reveal glass rounded-[1.5rem] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-8 py-6 flex justify-between items-center text-left">
                  <span className="font-bold text-sm md:text-base">{faq.q}</span>
                  <Plus size={20} className={`text-[#14F195] transition-transform ${openFaq === idx ? 'rotate-45' : ''}`} />
                </button>
                <div className={`px-8 transition-all duration-300 overflow-hidden ${openFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA penutup */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="reveal p-16 md:p-24 rounded-[4rem] glass text-center relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] to-[#13131F]">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Siap Bawa Warungmu ke Level Berikutnya?</h2>
            <p className="text-lg text-slate-400 mb-12">Bergabung dengan ribuan UMKM Indonesia yang sudah pakai SolanaWarung. Gratis, mudah, dan bertenaga AI.</p>
            <button onClick={onEnter} className="px-12 py-5 bg-[#14F195] text-black font-black uppercase text-sm tracking-widest rounded-2xl shadow-2xl shadow-[#14F195]/40 hover:scale-105 transition-all">Mulai Sekarang — Gratis</button>
            <p className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Tidak perlu kartu kredit. Daftar dengan akun Google dalam 30 detik.</p>
          </div>
        </div>
      </section>

      {/* SECTION VISI & MISI */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0A0A0F] to-[#130A1F]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-4 py-2 border border-[#14F195] text-[#14F195] rounded-full text-[11px] font-black uppercase tracking-widest mb-6 bg-transparent">VISI &amp; MISI</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 max-w-4xl mx-auto">SolanaWarung Dibangun untuk Masa Depan Ekonomi Digital Indonesia</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">Kami tidak hanya membangun marketplace. Kami membangun infrastruktur pembayaran digital yang siap ketika Bank Indonesia resmi meluncurkan Digital Rupiah.</p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="reveal p-8 rounded-[2rem] glass hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#14F195]/10 flex items-center justify-center text-[#14F195] border border-[#14F195]/20 mb-6">
                <AlertCircle size={24} />
              </div>
              <h4 className="text-xl font-bold mb-4">60 Juta UMKM Belum Tersentuh</h4>
              <p className="text-slate-400 text-sm leading-relaxed">78% transaksi UMKM Indonesia masih tunai. Tidak ada jejak digital, tidak ada kredit score, tidak ada akses ke sistem keuangan modern.</p>
            </div>
            <div className="reveal p-8 rounded-[2rem] glass hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#9945FF]/10 flex items-center justify-center text-[#9945FF] border border-[#9945FF]/20 mb-6">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-bold mb-4">AI + Blockchain + CBDC</h4>
              <p className="text-slate-400 text-sm leading-relaxed">SolanaWarung menjawab dengan tiga lapis: marketplace berbasis AI untuk onboarding mudah, smart contract escrow untuk keamanan, dan infrastruktur CBDC untuk masa depan.</p>
            </div>
            <div className="reveal p-8 rounded-[2rem] glass hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 mb-6">
                <Globe size={24} />
              </div>
              <h4 className="text-xl font-bold mb-4">Dari Indonesia ke ASEAN</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Fase 1 dominasi lokal Indonesia. Fase 2 jual infrastruktur payment API. Fase 3 ekspansi ke Vietnam, Thailand, Filipina. Fase 4 platform economy dan IPO.</p>
            </div>
          </div>

          {/* Roadmap */}
          <div className="reveal max-w-5xl mx-auto mb-20 relative">
            <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-white/10"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative text-center md:text-left mt-8 md:mt-0">
                <span className="absolute -top-10 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 text-[10px] font-black text-[#14F195] tracking-widest bg-[#0A0A0F] px-2 py-1 rounded">SEKARANG</span>
                <div className="w-6 h-6 rounded-full bg-[#14F195] mx-auto md:mx-0 mb-6 shadow-[0_0_15px_rgba(20,241,149,0.5)] border-4 border-[#0A0A0F] relative z-10"></div>
                <h5 className="font-black text-lg text-[#14F195] mb-2">2026</h5>
                <p className="font-bold text-white text-sm">Dominasi Lokal</p>
              </div>
              <div className="relative text-center md:text-left mt-8 md:mt-0">
                <div className="w-6 h-6 rounded-full bg-[#9945FF] mx-auto md:mx-0 mb-6 border-4 border-[#0A0A0F] relative z-10"></div>
                <h5 className="font-black text-lg text-[#9945FF] mb-2">2027-2028</h5>
                <p className="font-bold text-white text-sm">Infrastruktur</p>
              </div>
              <div className="relative text-center md:text-left mt-8 md:mt-0">
                <div className="w-6 h-6 rounded-full bg-slate-500 mx-auto md:mx-0 mb-6 border-4 border-[#0A0A0F] relative z-10"></div>
                <h5 className="font-black text-lg text-slate-400 mb-2">2029-2031</h5>
                <p className="font-bold text-white text-sm">Ekspansi ASEAN</p>
              </div>
              <div className="relative text-center md:text-left mt-8 md:mt-0">
                <div className="w-6 h-6 rounded-full bg-slate-700 mx-auto md:mx-0 mb-6 border-4 border-[#0A0A0F] relative z-10"></div>
                <h5 className="font-black text-lg text-slate-500 mb-2">2032-2035</h5>
                <p className="font-bold text-white text-sm">Platform Economy</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="reveal text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <a href="#" onClick={(e) => e.preventDefault()} className="px-8 py-4 bg-[#14F195] text-black font-black uppercase text-xs tracking-widest rounded-xl shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:-translate-y-1 transition-all">Visi &amp; Roadmap (Coming Soon)</a>
              <button onClick={onEnter} className="px-8 py-4 glass hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all">Mulai Jualan Sekarang</button>
            </div>
            <p className="text-xs text-slate-500 font-medium">Dibangun dengan Gemini AI · Firebase · Solana Blockchain · Google Cloud</p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-[#14F195] to-[#9945FF] rounded-xl flex items-center justify-center font-black text-lg italic">S</div>
                <span className="font-black text-xl tracking-tight">SolanaWarung</span>
              </div>
              <p className="text-slate-500 text-sm">"From warung to the world."</p>
            </div>
            <div className="flex gap-12 md:gap-24">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Link</h5>
                <div className="space-y-3 text-sm text-slate-500">
                  <a href="#" className="block hover:text-[#14F195]">Marketplace</a>
                  <a href="#" className="block hover:text-[#14F195]">Cara Pakai</a>
                </div>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Info</h5>
                <div className="space-y-3 text-sm text-slate-500">
                  <a href="#" className="block hover:text-[#14F195]">Tentang Kami</a>
                  <a href="#" className="block hover:text-[#14F195]">Hubungi Kami</a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:row justify-between items-center pt-10 border-t border-white/5 text-[10px] font-bold text-slate-600 uppercase tracking-widest gap-4">
            <span>&copy; 2026 SolanaWarung — Arblok Digital, Tasikmalaya, Indonesia</span>
            <span>Dibangun dengan Gemini AI × Google Cloud × Solana</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
