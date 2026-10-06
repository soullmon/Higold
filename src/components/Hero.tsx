import React from 'react';
import { ArrowRight, Compass, MapPin } from 'lucide-react';
import { CategoryId } from '../types';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenCalculator: () => void;
  onOpenShowroom: () => void;
  onSelectCategory: (cat: CategoryId) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenCalculator,
  onOpenShowroom,
  onSelectCategory,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f7ff] via-[#ffffff] to-[#f8fafc] border-b border-slate-200/80 pt-8 pb-14 sm:pt-10 sm:pb-16 lg:py-20">
      {/* Background subtle architectural blueprint grid in soft light blue */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-sky-200/40 via-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Main Hero Copy (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#9A7B38] uppercase">
              <span>Sistem Perangkat Keras Dapur Arsitektural</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">Garansi 5 Tahun</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-slate-900 leading-[1.12] text-balance">
              Presisi Mekanikal untuk Dapur Impian Anda
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Tingkatkan fungsionalitas kabinet dapur dengan sistem cerdas Higold: 
              dari rak ayun sudut mati (Corner Units), larder pantry tinggi hidrolik, hingga bak cuci piring nano black stainless SUS 304.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-[#C8A15A]/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Lihat Katalog & Pesan Online</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#9A7B38]" />
                <span>Cek Ukuran Kabinet Dapur</span>
              </button>
            </div>

            {/* Adjacent Proof Rigor */}
            <div className="pt-6 border-t border-slate-200/90 grid grid-cols-3 gap-3 sm:gap-4 text-left">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 font-sans tabular-nums">100.000×</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Siklus Buka-Tutup LGA</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-[#9A7B38] font-sans tabular-nums">SUS 304</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Food Grade Stainless</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-slate-900 font-sans tabular-nums">5 Tahun</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Garansi Mekanisme Resmi</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Spotlight (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-white p-4 sm:p-6 border border-slate-200/90 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Koleksi Unggulan</span>
                <span className="text-[#9A7B38] font-semibold tracking-wide">HIGOLD SHOW HAND</span>
              </div>

              {/* Architectural Schematic representation */}
              <div className="my-4 relative h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3">
                <svg viewBox="0 0 340 220" className="w-full h-full drop-shadow-xs">
                  <rect x="20" y="20" width="300" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  
                  {/* Cabinet corner boundary lines */}
                  <line x1="20" y1="120" x2="160" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
                  <line x1="160" y1="20" x2="160" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
                  
                  {/* Pull out mechanism with dual tray presentation */}
                  <g transform="translate(140, 40)">
                    <path d="M 0 0 L 130 -15 L 155 75 L 25 90 Z" fill="#ffffff" stroke="#C8A15A" strokeWidth="2.5" />
                    <circle cx="25" cy="90" r="5" fill="#C8A15A" />
                    <circle cx="155" cy="75" r="4" fill="#C8A15A" />
                    <path d="M 12 12 L 120 0 L 140 70 L 32 82 Z" fill="#FAF6ED" />
                  </g>
                  
                  <g transform="translate(100, 75)">
                    <path d="M 0 0 L 140 -15 L 165 75 L 25 90 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.8" />
                  </g>

                  {/* Dimension overlay tags */}
                  <rect x="35" y="35" width="85" height="24" rx="4" fill="#FAF6ED" stroke="#C8A15A" strokeWidth="1" />
                  <text x="42" y="51" fill="#8A6B29" fontSize="10" fontFamily="sans-serif" fontWeight="bold">W: 900-1000mm</text>
                  
                  <text x="35" y="180" fill="#475569" fontSize="11" fontWeight="bold">Diamond Style Corner</text>
                  <text x="210" y="180" fill="#8A6B29" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Ready Stock</text>
                </svg>
              </div>

              {/* Fast feature triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <button
                  onClick={() => onSelectCategory('corner-units')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-slate-800 font-semibold group-hover:text-[#9A7B38]">Unit Sudut (Corner)</div>
                  <div className="text-[11px] text-slate-500">Swing & Magic Corner</div>
                </button>
                <button
                  onClick={() => onSelectCategory('larder-units')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-slate-800 font-semibold group-hover:text-[#9A7B38]">Pantry Tinggi (Larder)</div>
                  <div className="text-[11px] text-slate-500">6-Tiers & Swivel 90°</div>
                </button>
              </div>

              {/* Showroom Visit Anchor */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9A7B38]" />
                  <span>Showroom Pluit, Jakarta Utara</span>
                </div>
                <button 
                  onClick={onOpenShowroom}
                  className="text-[#9A7B38] hover:text-[#7A6129] font-semibold cursor-pointer"
                >
                  Jadwalkan Kunjungan →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
