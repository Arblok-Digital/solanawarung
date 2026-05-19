import React, { useState } from 'react';
import {
  ShoppingBag, Bot, Wallet, BarChart3, Truck, ShieldCheck,
  Sparkles, Globe, CreditCard, Database, Code, Zap,
  ChevronDown, ExternalLink
} from 'lucide-react';

const PHASES = [
  {
    year: '2026',
    title: 'Dominasi Lokal',
    status: 'Aktif Sekarang',
    statusColor: 'bg-[#14F195]/10 text-[#14F195] border-[#14F195]/25',
    yearColor: 'text-[#14F195]',
    dotColor: 'bg-[#14F195] shadow-[0_0_0_4px_rgba(20,241,149,0.15)]',
    borderColor: 'border-[#14F195]/20',
    features: [
      { icon: <Bot size={18} />, title: 'AI Product Listing', desc: 'Gemini Vision analisis foto otomatis' },
      { icon: <Wallet size={18} />, title: 'Mock CBDC Wallet', desc: 'Internal e-wallet Digital Rupiah' },
      { icon: <ShieldCheck size={18} />, title: 'Smart Contract Escrow', desc: 'Anchor program Solana devnet' },
      { icon: <BarChart3 size={18} />, title: 'AI Analytics', desc: 'Saran bisnis bahasa Indonesia' },
      { icon: <Globe size={18} />, title: 'Mobile-First PWA', desc: 'Jalan di HP Android entry-level' },
      { icon: <ShoppingBag size={18} />, title: 'Seller Dashboard', desc: 'Kelola toko, konfirmasi order' },
    ],
    kpis: [
      { value: '10K', label: 'Target Seller' },
      { value: 'Rp50M', label: 'GMV / Bulan' },
      { value: '60%', label: 'Retensi Seller' },
    ],
  },
  {
    year: '2027–28',
    title: 'Infrastruktur',
    status: 'Berikutnya',
    statusColor: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    yearColor: 'text-purple-400',
    dotColor: 'bg-purple-500',
    borderColor: 'border-purple-500/20',
    features: [
      { icon: <CreditCard size={18} />, title: 'SW Pay API', desc: 'Stripe-nya Indonesia untuk CBDC' },
      { icon: <Truck size={18} />, title: 'Logistik API', desc: 'JNE, J&T, SiCepat terintegrasi' },
      { icon: <Database size={18} />, title: 'SW Credit', desc: 'Pinjaman dari data on-chain' },
      { icon: <ShieldCheck size={18} />, title: 'Digital Rupiah BI', desc: 'Integrasi begitu BI launch' },
      { icon: <Code size={18} />, title: 'Solana Mainnet', desc: 'Migrasi dari devnet' },
      { icon: <BarChart3 size={18} />, title: 'B2B Data Intel', desc: 'Jual insight ke brand besar' },
    ],
    kpis: [
      { value: '100K', label: 'Seller Aktif' },
      { value: 'Rp1T', label: 'GMV / Bulan' },
      { value: '3', label: 'Revenue Streams' },
    ],
  },
  {
    year: '2029–31',
    title: 'Ekspansi ASEAN',
    status: 'Rencana',
    statusColor: 'bg-blue-500/8 text-blue-400 border-blue-500/20',
    yearColor: 'text-blue-400',
    dotColor: 'bg-blue-500',
    borderColor: 'border-blue-500/20',
    features: [
      { icon: <Globe size={18} />, title: '5 Negara ASEAN', desc: 'Vietnam, Thailand, Filipina, Bangladesh' },
      { icon: <ShieldCheck size={18} />, title: 'CBDC Gateway', desc: 'Lisensi bank sentral ASEAN' },
      { icon: <Zap size={18} />, title: 'Cross-border Trade', desc: 'UMKM ekspor tanpa bank koresponden' },
      { icon: <Bot size={18} />, title: 'Multilingual AI', desc: 'Thai, Tagalog, Vietnamese' },
      { icon: <Wallet size={18} />, title: 'DeFi Liquidity', desc: 'Working capital dari pool' },
      { icon: <Database size={18} />, title: 'Multi-CBDC', desc: 'Digital Baht, Peso, Dong' },
    ],
    kpis: [
      { value: '5', label: 'Negara' },
      { value: '$1B', label: 'GMV / Tahun' },
      { value: '7', label: 'CBDC Integrated' },
    ],
  },
  {
    year: '2032–35',
    title: 'Platform Economy',
    status: 'Visi Besar',
    statusColor: 'bg-amber-500/8 text-amber-400 border-amber-500/20',
    yearColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
    borderColor: 'border-amber-500/20',
    features: [
      { icon: <ShoppingBag size={18} />, title: 'SW App Store', desc: 'Developer bangun di atas infrastruktur SW' },
      { icon: <Code size={18} />, title: 'SW Chain', desc: 'App-chain sendiri di Solana SVM' },
      { icon: <Sparkles size={18} />, title: 'SW Token', desc: 'Utility token governance + kredit' },
      { icon: <ShieldCheck size={18} />, title: 'Sovereign Identity', desc: 'NFT identity seller lintas negara' },
      { icon: <Bot size={18} />, title: 'AI Agent Merchant', desc: 'Kelola toko otonom 24/7' },
      { icon: <BarChart3 size={18} />, title: 'IPO', desc: 'Target listing bursa ASEAN' },
    ],
    kpis: [
      { value: '1M+', label: 'Seller ASEAN' },
      { value: '$10B', label: 'GMV / Tahun' },
      { value: 'IPO', label: 'Target' },
    ],
  },
];

export const RoadmapSection: React.FC = () => {
  const [openPhase, setOpenPhase] = useState<number | null>(0);

  const togglePhase = (index: number) => {
    setOpenPhase(openPhase === index ? null : index);
  };

  return (
    <section id="roadmap" className="py-16 md:py-24 bg-[#060608]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-[#14F195]/10 border border-[#14F195]/20 text-[#14F195] px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
            Visi & Strategi
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Roadmap Ekosistem
          </h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
            Dari MVP kompetisi sampai platform economy dan IPO.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-8">
          {/* Vertical Line */}
          <div className="absolute left-[11px] md:left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#14F195] via-purple-500 via-blue-500 to-amber-500 opacity-30" />

          <div className="space-y-4">
            {PHASES.map((phase, index) => {
              const isOpen = openPhase === index;
              return (
                <div key={index} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 md:-left-8 top-5 w-4 h-4 rounded-full border-2 border-[#060608] z-10 ${phase.dotColor}`}
                  />

                  {/* Card */}
                  <div
                    className={`bg-[#0D0D12] border ${isOpen ? phase.borderColor : 'border-white/5'} rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-300`}
                  >
                    {/* Header — Always Visible */}
                    <button
                      onClick={() => togglePhase(index)}
                      className="w-full flex items-center justify-between p-4 md:p-6 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3 md:gap-5 min-w-0">
                        <span className={`text-2xl md:text-4xl font-black ${phase.yearColor} shrink-0`}>
                          {phase.year}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-base md:text-xl font-black text-white truncate">
                            {phase.title}
                          </h3>
                          <span
                            className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${phase.statusColor}`}
                          >
                            {phase.status}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 shrink-0 ml-2 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Body — Collapsible */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 md:px-6 pb-6">
                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                          {phase.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-3 p-3 md:p-4 bg-white/[0.02] rounded-xl border border-white/5"
                            >
                              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                {feat.icon}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs md:text-sm font-bold text-white leading-tight">
                                  {feat.title}
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 leading-relaxed">
                                  {feat.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* KPIs */}
                        <div className="flex flex-wrap gap-4 md:gap-8 pt-4 border-t border-white/5">
                          {phase.kpis.map((kpi, kIdx) => (
                            <div key={kIdx}>
                              <span className={`text-xl md:text-3xl font-black ${phase.yearColor}`}>
                                {kpi.value}
                              </span>
                              <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                {kpi.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Link to Full Ecosystem Page */}
        <div className="text-center mt-8">
          <a
            href="/solanawarung-ecosystem.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#14F195] transition-colors font-bold"
          >
            <ExternalLink size={14} />
            Lihat Ekosistem Lengkap (Desktop)
          </a>
        </div>
      </div>
    </section>
  );
};
