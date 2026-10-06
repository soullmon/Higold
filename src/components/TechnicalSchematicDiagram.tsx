import React from 'react';
import { Product } from '../types';

interface TechnicalSchematicDiagramProps {
  product: Product;
  className?: string;
}

export const TechnicalSchematicDiagram: React.FC<TechnicalSchematicDiagramProps> = ({
  product,
  className = 'w-full h-full',
}) => {
  const minW = product.minCabinetDims.width;
  const minD = product.minCabinetDims.depth;
  const minH = product.minCabinetDims.height;
  const nominalW = product.cabinetWidths[0] || 900;
  const type = product.svgVisualType;

  return (
    <div className={`relative bg-white border border-slate-200 p-2 flex flex-col justify-between select-none ${className}`}>
      {/* Top Header Label */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-slate-100 pb-1 mb-1">
        <span className="font-semibold text-slate-600">CAD SCHEMATIC · {product.sku}</span>
        <span>CLEARANCE: W{minW} × D{minD}mm</span>
      </div>

      {/* SVG Technical Drawing */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[110px] overflow-hidden">
        <svg viewBox="0 0 320 130" className="w-full h-full max-h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dimension Guidelines */}
          <line x1="15" y1="12" x2="115" y2="12" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="15" y1="8" x2="15" y2="16" stroke="#94a3b8" strokeWidth="1" />
          <line x1="115" y1="8" x2="115" y2="16" stroke="#94a3b8" strokeWidth="1" />
          <text x="65" y="10" fontSize="8" fill="#64748b" textAnchor="middle" fontFamily="monospace">W={nominalW}</text>

          {/* Top Down View: Cabinet Corner Box */}
          <rect x="15" y="20" width="100" height="95" stroke="#334155" strokeWidth="1.5" fill="#f8fafc" />
          <rect x="15" y="20" width="45" height="95" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          
          {/* Internal Tray / Mechanism Swing Trajectory */}
          {type === 'magic-corner' ? (
            <>
              {/* Magic Corner Slide path */}
              <rect x="25" y="32" width="35" height="35" stroke="#0284c7" strokeWidth="1.2" fill="#e0f2fe" fillOpacity="0.4" />
              <rect x="25" y="72" width="35" height="35" stroke="#0284c7" strokeWidth="1.2" fill="#e0f2fe" fillOpacity="0.4" />
              <path d="M 60 50 L 95 50" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
              <rect x="65" y="28" width="40" height="42" stroke="#0369a1" strokeWidth="1.2" fill="#bae6fd" fillOpacity="0.5" />
            </>
          ) : type === 'tall-larder' || type === 'swivel-tall' ? (
            <>
              {/* Larder Pantry Tier Lines */}
              <rect x="30" y="25" width="70" height="85" stroke="#0284c7" strokeWidth="1.2" fill="#e0f2fe" fillOpacity="0.3" />
              <line x1="30" y1="42" x2="100" y2="42" stroke="#0284c7" strokeWidth="1" />
              <line x1="30" y1="59" x2="100" y2="59" stroke="#0284c7" strokeWidth="1" />
              <line x1="30" y1="76" x2="100" y2="76" stroke="#0284c7" strokeWidth="1" />
              <line x1="30" y1="93" x2="100" y2="93" stroke="#0284c7" strokeWidth="1" />
              <path d="M 65 110 L 65 122" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="2 2" />
            </>
          ) : (
            <>
              {/* Swing Tray S-shape Kidney curve in top-down view */}
              <path
                d="M 30 35 C 50 25, 80 40, 75 70 C 70 95, 45 105, 30 95 C 20 85, 20 50, 30 35 Z"
                stroke="#0284c7"
                strokeWidth="1.2"
                fill="#e0f2fe"
                fillOpacity="0.4"
              />
              {/* Extended Tray Swing Arc */}
              <path
                d="M 70 70 A 50 50 0 0 1 110 105"
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <path
                d="M 65 55 C 85 45, 115 60, 110 88 C 105 108, 85 115, 68 108 Z"
                stroke="#0369a1"
                strokeWidth="1.2"
                fill="#bae6fd"
                fillOpacity="0.5"
              />
            </>
          )}

          {/* Door indicator & Labels */}
          <line x1="60" y1="115" x2="115" y2="115" stroke="#0f172a" strokeWidth="2.5" />
          <text x="88" y="125" fontSize="7" fill="#475569" textAnchor="middle" fontFamily="sans-serif">Pintu Bukaan</text>

          {/* Depth dimension */}
          <line x1="120" y1="20" x2="120" y2="115" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="116" y1="20" x2="124" y2="20" stroke="#94a3b8" strokeWidth="1" />
          <line x1="116" y1="115" x2="124" y2="115" stroke="#94a3b8" strokeWidth="1" />
          <text x="126" y="70" fontSize="7.5" fill="#64748b" textAnchor="start" fontFamily="monospace">D={minD}</text>

          {/* Vertical Divider */}
          <line x1="160" y1="15" x2="160" y2="120" stroke="#e2e8f0" strokeWidth="1" />

          {/* 3D Isometric Cabinet Representation (Right Panel) */}
          <g transform="translate(175, 15)">
            {/* Height dimension */}
            <line x1="5" y1="15" x2="5" y2="95" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="2" y1="15" x2="8" y2="15" stroke="#94a3b8" strokeWidth="1" />
            <line x1="2" y1="95" x2="8" y2="95" stroke="#94a3b8" strokeWidth="1" />
            <text x="7" y="58" fontSize="7" fill="#64748b" textAnchor="middle" transform="rotate(-90 7 58)" fontFamily="monospace">H={minH}</text>

            {/* Isometric Cabinet outline */}
            <polygon points="25,35 65,15 110,32 70,52" stroke="#64748b" strokeWidth="1.2" fill="#f8fafc" />
            <polygon points="25,35 70,52 70,105 25,85" stroke="#64748b" strokeWidth="1.2" fill="#f1f5f9" />
            <polygon points="70,52 110,32 110,85 70,105" stroke="#64748b" strokeWidth="1.2" fill="#e2e8f0" />

            {/* Interior Wireframe Mechanism */}
            {/* Center Axis Pole */}
            <line x1="52" y1="30" x2="52" y2="90" stroke="#0284c7" strokeWidth="2" />
            
            {/* Top Tray Shelf */}
            <ellipse cx="52" cy="50" rx="20" ry="8" stroke="#0284c7" strokeWidth="1.2" fill="#bae6fd" fillOpacity="0.6" />
            
            {/* Bottom Tray Shelf Swung outward */}
            <ellipse cx="65" cy="80" rx="22" ry="9" stroke="#0369a1" strokeWidth="1.4" fill="#38bdf8" fillOpacity="0.5" />
            
            {/* Mechanical Support Arm */}
            <path d="M 52 82 L 65 80" stroke="#0f172a" strokeWidth="1.5" />
            
            {/* Annotation tags */}
            <text x="65" y="105" fontSize="7" fill="#0369a1" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Higold 3D Assembly</text>
          </g>
        </svg>
      </div>

      {/* Bottom Technical Note matching Higold Official Catalog */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono border-t border-slate-100 pt-1 mt-1">
        <span>MIN. INTERNAL CLEARANCE</span>
        <span className="font-bold text-slate-500">HIGOLD INDONESIA · CAD REF</span>
      </div>
    </div>
  );
};
