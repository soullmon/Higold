import React from 'react';

interface ProductVisualProps {
  type: string;
  series: string;
  name: string;
  className?: string;
  showDimensions?: boolean;
  minCabinet?: { width: number; depth: number; height: number };
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  series,
  name,
  className = 'w-full h-56',
  showDimensions = false,
  minCabinet
}) => {
  const getAccentColor = () => {
    switch (series) {
      case 'Diamond':
        return { primary: '#C8A15A', secondary: '#fdfbf7', stroke: '#525252', accent: '#D4AF37' };
      case 'Shearer':
        return { primary: '#B8924B', secondary: '#fdfbf7', stroke: '#525252', accent: '#C8A15A' };
      case 'Arena':
        return { primary: '#9A7B38', secondary: '#fdfbf7', stroke: '#525252', accent: '#C8A15A' };
      case 'Fashion':
        return { primary: '#C8A15A', secondary: '#fdfbf7', stroke: '#262626', accent: '#B8924B' };
      default:
        return { primary: '#C8A15A', secondary: '#fdfbf7', stroke: '#525252', accent: '#C8A15A' };
    }
  };

  const colors = getAccentColor();

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-[#ffffff] to-[#faf9f6] flex items-center justify-center p-4 border border-neutral-200 rounded-md group ${className}`}>
      {/* Background architectural precision grid in subtle silver */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Subtle warm ambient highlight */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none bg-[#C8A15A]"
      />

      {/* SVG Schematics tailored with stainless steel & gold accents */}
      <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
        {type === 'swing-tray' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <defs>
              <linearGradient id="trayGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="metalBevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C8A15A" />
                <stop offset="100%" stopColor="#9A7B38" />
              </linearGradient>
            </defs>
            {/* Cabinet frame hint */}
            <path d="M 30 180 L 140 180 L 140 30" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" fill="none" />
            <text x="35" y="195" fill="#64748b" fontSize="10" fontFamily="sans-serif">CORNER 900mm</text>
            
            {/* Hydraulic Pivot Column */}
            <rect x="135" y="35" width="12" height="145" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="141" cy="70" r="5" fill="#0284c7" />
            <circle cx="141" cy="140" r="5" fill="#0284c7" />

            {/* Bottom Swing Tray (Swung outward) */}
            <g transform="translate(10, 20)">
              <path d="M 130 120 C 180 100, 260 110, 270 140 C 275 160, 230 185, 170 180 C 130 175, 120 150, 130 120 Z" fill="url(#trayGradLight)" stroke="url(#metalBevelLight)" strokeWidth="2.5" />
              <path d="M 140 128 C 180 112, 245 120, 255 142 C 258 155, 222 173, 172 170 C 138 166, 132 148, 140 128 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              {/* Anti-slip diamond pattern lines */}
              <line x1="170" y1="135" x2="220" y2="155" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="190" y1="130" x2="240" y2="150" stroke="#94a3b8" strokeWidth="1.2" />
            </g>

            {/* Top Swing Tray (Upper tier) */}
            <g transform="translate(-10, -35)">
              <path d="M 140 90 C 190 70, 270 80, 280 110 C 285 130, 240 155, 180 150 C 140 145, 130 120, 140 90 Z" fill="url(#trayGradLight)" stroke="#0284c7" strokeWidth="2" />
              <path d="M 150 98 C 190 82, 255 90, 265 112 C 268 125, 232 143, 182 140 C 148 136, 142 118, 150 98 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="210" cy="115" r="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
              <text x="205" y="119" fill="#0284c7" fontSize="10" fontWeight="bold">H</text>
            </g>
            
            {/* Hydraulic arm */}
            <line x1="140" y1="85" x2="180" y2="95" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="140" y1="155" x2="195" y2="165" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {type === 'magic-corner' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            {/* Dual tandem sliding basket mechanism */}
            <rect x="30" y="40" width="260" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="40" y="32" fill="#64748b" fontSize="10" fontFamily="sans-serif">CABINET INTERIOR DEPTH 530mm</text>
            
            {/* Back baskets (Rear unit) */}
            <rect x="45" y="55" width="105" height="55" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="45" y="120" width="105" height="55" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Wire lines */}
            <line x1="55" y1="65" x2="140" y2="65" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="55" y1="75" x2="140" y2="75" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="55" y1="130" x2="140" y2="130" stroke="#cbd5e1" strokeWidth="2" />

            {/* Linkage mechanism bar */}
            <line x1="150" y1="80" x2="180" y2="95" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="150" y1="145" x2="180" y2="160" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="150" cy="80" r="4" fill="#0284c7" />
            <circle cx="180" cy="95" r="4" fill="#0284c7" />

            {/* Front articulated pullout baskets */}
            <g transform="translate(170, 0)">
              <rect x="10" y="50" width="115" height="60" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              <rect x="10" y="118" width="115" height="60" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              {/* Glass insert panel */}
              <rect x="15" y="54" width="105" height="18" rx="2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
              <rect x="15" y="122" width="105" height="18" rx="2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
              <text x="35" y="67" fill="#0369a1" fontSize="9" fontWeight="bold">SHEARER CORE</text>
            </g>
          </svg>
        )}

        {type === 'show-hand' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <path d="M 40 180 L 150 180 L 150 30" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
            <path d="M 120 40 L 280 40 L 280 180 L 120 180 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            
            {/* Extended Rotated Hand Tray 1 */}
            <path d="M 70 80 L 220 50 L 260 110 L 110 140 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <path d="M 80 85 L 210 58 L 245 105 L 118 132 Z" fill="#f0f7ff" stroke="#cbd5e1" strokeWidth="1" />
            
            {/* Extended Rotated Hand Tray 2 */}
            <path d="M 90 120 L 240 90 L 280 150 L 130 180 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
            <path d="M 100 125 L 230 98 L 265 145 L 138 172 Z" fill="#f0f7ff" stroke="#94a3b8" strokeWidth="1" />
            
            <circle cx="90" cy="120" r="5" fill="#0284c7" />
            <circle cx="280" cy="150" r="4" fill="#0284c7" />
            <line x1="90" y1="120" x2="130" y2="180" stroke="#0284c7" strokeWidth="2.5" />
            <text x="145" y="160" fill="#0284c7" fontSize="10" fontWeight="bold">SHOW HAND 100% EXTENSION</text>
          </svg>
        )}

        {type === 'revolving' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <line x1="160" y1="20" x2="160" y2="200" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <circle cx="160" cy="70" r="8" fill="#0284c7" />
            <circle cx="160" cy="150" r="8" fill="#0284c7" />

            <path d="M 160 70 L 90 40 A 85 85 0 1 1 160 125 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <line x1="160" y1="70" x2="90" y2="40" stroke="#64748b" strokeWidth="2" />
            <line x1="160" y1="70" x2="160" y2="125" stroke="#64748b" strokeWidth="2" />
            <path d="M 160 70 A 55 55 0 1 1 160 110" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M 160 70 A 30 30 0 1 1 160 95" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

            <path d="M 160 150 L 90 120 A 85 85 0 1 1 160 205 Z" fill="#ffffff" stroke="#475569" strokeWidth="2.5" />
            <line x1="160" y1="150" x2="90" y2="120" stroke="#475569" strokeWidth="2.5" />
            <line x1="160" y1="150" x2="160" y2="205" stroke="#475569" strokeWidth="2.5" />
            <text x="175" y="180" fill="#64748b" fontSize="10" fontFamily="sans-serif">SUS 304 SOLID</text>
          </svg>
        )}

        {type === 'tall-larder' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="95" y="15" width="130" height="190" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="160" y1="15" x2="160" y2="205" stroke="#94a3b8" strokeWidth="2" />
            
            {[30, 60, 90, 120, 150, 180].map((y, index) => (
              <g key={index} transform={`translate(${index % 2 === 0 ? 0 : 4}, 0)`}>
                <rect x="105" y={y} width="110" height="18" rx="2" fill="#f0f7ff" stroke="#0284c7" strokeWidth="1.2" />
                <line x1="110" y1={y + 9} x2="210" y2={y + 9} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="112" cy={y + 9} r="2" fill="#0284c7" />
                <circle cx="208" cy={y + 9} r="2" fill="#0284c7" />
              </g>
            ))}
            
            <rect x="90" y="12" width="140" height="5" fill="#0284c7" rx="1" />
            <rect x="90" y="203" width="140" height="5" fill="#0284c7" rx="1" />
            <text x="235" y="115" fill="#1e293b" fontSize="9" fontWeight="bold">6-TIER PANTRY</text>
            <text x="235" y="130" fill="#0284c7" fontSize="8" fontFamily="sans-serif">70KG LOAD</text>
          </svg>
        )}

        {type === 'swivel-tall' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="110" y="20" width="100" height="180" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {[38, 72, 106, 140, 174].map((y, index) => (
              <g key={index}>
                <rect x="118" y={y} width="84" height="22" rx="3" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
                <rect x="122" y={y + 2} width="76" height="18" rx="2" fill="#e2e8f0" />
                <line x1="145" y1={y + 3} x2="145" y2={y + 19} stroke="#94a3b8" strokeWidth="1" />
                <line x1="170" y1={y + 3} x2="170" y2={y + 19} stroke="#94a3b8" strokeWidth="1" />
              </g>
            ))}
            <path d="M 215 110 A 30 30 0 0 1 245 140" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="3,3" />
            <polygon points="247,143 241,135 249,134" fill="#0284c7" />
            <text x="220" y="95" fill="#0284c7" fontSize="9" fontWeight="bold">SWIVEL 90°</text>
            <text x="220" y="108" fill="#64748b" fontSize="8">Oak + Metal</text>
          </svg>
        )}

        {type === 'base-basket' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="110" y="30" width="100" height="160" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="118" y="45" width="84" height="40" rx="3" fill="#f0f7ff" stroke="#0284c7" strokeWidth="1.5" />
            <line x1="130" y1="52" x2="150" y2="52" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <line x1="160" y1="52" x2="175" y2="52" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <line x1="130" y1="65" x2="190" y2="65" stroke="#94a3b8" strokeWidth="1.5" />

            <rect x="118" y="105" width="84" height="70" rx="3" fill="#f0f7ff" stroke="#0284c7" strokeWidth="1.5" />
            <rect x="125" y="115" width="16" height="45" rx="3" fill="#e2e8f0" stroke="#64748b" />
            <rect x="145" y="112" width="18" height="48" rx="3" fill="#cbd5e1" stroke="#475569" />
            <rect x="168" y="118" width="22" height="42" rx="3" fill="#e2e8f0" stroke="#64748b" />

            <rect x="105" y="190" width="110" height="6" rx="2" fill="#0284c7" />
            <text x="50" y="105" fill="#64748b" fontSize="9" fontFamily="sans-serif">WIDTH 300mm</text>
          </svg>
        )}

        {type === 'pandora' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="35" y="55" width="250" height="110" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M 45 130 L 45 75 L 275 75 L 275 130 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            
            {[65, 80, 95, 110, 125, 140, 155, 170].map((x, index) => (
              <line key={index} x1={x} y1="85" x2={x} y2="120" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            ))}

            <circle cx="210" cy="102" r="18" fill="#f0f7ff" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="245" cy="102" r="14" fill="#f0f7ff" stroke="#0284c7" strokeWidth="1.5" />

            <rect x="42" y="145" width="236" height="10" rx="2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
            <text x="45" y="45" fill="#0284c7" fontSize="10" fontWeight="bold">PANDORA 600 - 900mm</text>
            <text x="200" y="45" fill="#64748b" fontSize="9" fontFamily="sans-serif">SUS 304 SOLID</text>
          </svg>
        )}

        {type === 'garbage-cleaning' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="50" y="45" width="220" height="135" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="65" y="65" width="85" height="95" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="160" y="65" width="85" height="95" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="60" y="55" width="190" height="8" rx="2" fill="#0284c7" />
            <path d="M 90 75 L 125 75" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <path d="M 185 75 L 220 75" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <text x="75" y="125" fill="#0284c7" fontSize="10" fontWeight="bold">ORGANIC 15L</text>
            <text x="168" y="125" fill="#64748b" fontSize="10" fontWeight="bold">RECYCLE 15L</text>
          </svg>
        )}

        {type === 'midway-rack' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="25" y="45" width="270" height="12" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
            <rect x="40" y="60" width="70" height="75" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="45" y1="95" x2="105" y2="95" stroke="#cbd5e1" strokeWidth="1.5" />
            
            <g transform="translate(125, 60)">
              <rect x="0" y="0" width="55" height="80" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <path d="M 10 20 C 15 50, 40 50, 45 20" stroke="#64748b" strokeWidth="2.5" fill="none" />
              <path d="M 10 45 C 15 70, 40 70, 45 45" stroke="#64748b" strokeWidth="2.5" fill="none" />
            </g>

            <g transform="translate(195, 60)">
              <rect x="0" y="0" width="50" height="35" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="5" y="40" width="40" height="20" rx="10" fill="#e2e8f0" />
            </g>

            {[255, 270, 285].map((x, i) => (
              <path key={i} d={`M ${x} 57 C ${x} 70, ${x-5} 70, ${x-5} 80 C ${x-5} 90, ${x} 90, ${x} 85`} fill="none" stroke="#0284c7" strokeWidth="2.5" />
            ))}

            <text x="40" y="165" fill="#475569" fontSize="9" fontWeight="bold">MODULAR BACKSPLASH SYSTEM</text>
          </svg>
        )}

        {type === 'sink' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="30" y="35" width="260" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="45" y="50" width="230" height="120" rx="10" fill="#1e293b" stroke="#0284c7" strokeWidth="2" />
            
            <circle cx="210" cy="110" r="22" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="210" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            
            <path d="M 65 65 L 65 85" stroke="#475569" strokeWidth="2" />
            <path d="M 65 65 L 85 65" stroke="#475569" strokeWidth="2" />
            
            <rect x="60" y="60" width="80" height="100" rx="3" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="75" y1="65" x2="75" y2="155" stroke="#64748b" strokeWidth="1.5" />
            <line x1="90" y1="65" x2="90" y2="155" stroke="#64748b" strokeWidth="1.5" />
            <line x1="105" y1="65" x2="105" y2="155" stroke="#64748b" strokeWidth="1.5" />

            <text x="50" y="200" fill="#0284c7" fontSize="9" fontWeight="bold">NANO BLACK PVD 3.0mm</text>
            <text x="180" y="200" fill="#64748b" fontSize="9" fontFamily="sans-serif">780 x 450 x 230mm</text>
          </svg>
        )}

        {type === 'faucet' && (
          <svg viewBox="0 0 320 220" className="w-full h-full max-h-52 drop-shadow-sm">
            <rect x="70" y="170" width="40" height="15" rx="3" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1.5" />
            <path d="M 90 170 L 90 80 C 90 30, 200 30, 200 90 L 200 115" fill="none" stroke="#64748b" strokeWidth="12" strokeLinecap="round" />
            <path d="M 90 170 L 90 80 C 90 30, 200 30, 200 90 L 200 115" fill="none" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
            
            <rect x="192" y="115" width="16" height="35" rx="3" fill="#0284c7" />
            <circle cx="200" cy="145" r="4" fill="#ffffff" />
            
            <path d="M 95 130 L 130 115" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
            
            <line x1="197" y1="155" x2="194" y2="190" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="203" y1="155" x2="206" y2="190" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3,3" />

            <text x="110" y="195" fill="#0284c7" fontSize="9" fontWeight="bold">MAGNETIC DOCKING</text>
          </svg>
        )}
      </div>

      {/* Dimensional overlay callout */}
      {showDimensions && minCabinet && (
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between text-[11px] font-sans text-slate-700">
          <span>Min: W{minCabinet.width} × D{minCabinet.depth} × H{minCabinet.height}mm</span>
          <span className="text-sky-700 font-semibold">{series}</span>
        </div>
      )}
    </div>
  );
};
