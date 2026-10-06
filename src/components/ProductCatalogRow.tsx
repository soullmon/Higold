import React from 'react';
import { Product } from '../types';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatRupiah } from '../utils/format';
import { ShoppingBag, Check, MessageSquare, Eye, Video, Ruler, ShieldCheck } from 'lucide-react';

interface ProductCatalogRowProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenWhatsAppConsult?: (productName: string) => void;
  isAdded?: boolean;
}

export const ProductCatalogRow: React.FC<ProductCatalogRowProps> = ({
  product,
  onSelect,
  onQuickAdd,
  onOpenWhatsAppConsult,
  isAdded = false,
}) => {
  const minD = product.minCabinetDims?.depth || 520;
  const minH = product.minCabinetDims?.height || 650;

  // Generate spec table rows for each cabinet size
  const specRows = product.cabinetWidths.map((w, idx) => ({
    artNo: idx === 0 ? product.sku : `${product.sku}-${w}`,
    cabinet: `≥${w}mm`,
    dimensions: `${w - 125}×${minD - 45}×(${minH - 80}-${minH + 30})mm`,
    weightCapacity: product.loadCapacity || '15 kg per rak',
    remark: product.finishOptions[idx % product.finishOptions.length] || 'Nano Titanium Coating',
  }));

  const hasVideo = !!product.videoUrl || (product.mediaList && product.mediaList.some(m => m.type === 'video'));
  const hasCAD = !!product.dimensionImageUrl || (product.mediaList && product.mediaList.some(m => m.type === 'dimension'));

  return (
    <article className="bg-white p-5 sm:p-6 hover:bg-neutral-50 transition-colors font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* 1. Left: Product Photograph */}
        <div 
          onClick={() => onSelect(product)}
          className="lg:col-span-4 cursor-pointer group relative overflow-hidden bg-neutral-100 border border-neutral-200 aspect-4/3 sm:aspect-square flex items-center justify-center shadow-xs"
        >
          <ProductPlaceholderImage
            type={product.svgVisualType}
            series={product.series}
            name={product.name}
            sku={product.sku}
            imageUrl={product.imageUrl}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Media Badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
            {hasVideo && (
              <span className="px-2 py-0.5 bg-black/85 text-[#D4AF37] text-[10px] font-mono flex items-center gap-1 shadow-xs font-semibold">
                <Video className="w-3 h-3 text-[#D4AF37]" />
                <span>VIDEO</span>
              </span>
            )}
            {hasCAD && (
              <span className="px-2 py-0.5 bg-black/85 text-[#D4AF37] text-[10px] font-mono flex items-center gap-1 shadow-xs font-semibold">
                <Ruler className="w-3 h-3 text-[#D4AF37]" />
                <span>CAD</span>
              </span>
            )}
          </div>

          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-neutral-950 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
            {product.series}
          </div>

          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/80 text-white text-[11px] font-mono">
            {product.sku}
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-white text-neutral-900 text-[10px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm font-semibold">
            <Eye className="w-3 h-3 text-[#D4AF37]" />
            <span>Detail</span>
          </div>
        </div>

        {/* 2. Right: Product Information, Price & Specification Table */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-900 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                Higold Official
              </span>
              <span className="text-xs text-neutral-400">German LGA Quality Tested</span>
            </div>

            <h3 
              onClick={() => onSelect(product)}
              className="text-lg sm:text-xl font-bold text-neutral-950 hover:text-[#D4AF37] transition-colors cursor-pointer leading-tight"
            >
              {product.name}
            </h3>

            <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-2">
              <span>Seri: <strong className="font-semibold text-neutral-900">{product.series}</strong></span>
              <span>·</span>
              <span>Garansi: <strong className="font-semibold text-neutral-900">{product.warranty || '5 Tahun Mekanisme'}</strong></span>
              <span>·</span>
              <span>Stok: <strong className="font-semibold text-neutral-950">Tersedia ({product.stockQuantity ?? 12} unit)</strong></span>
            </div>

            {/* Price */}
            <div className="mt-2.5 flex items-baseline gap-2.5">
              <span className="text-base sm:text-lg font-black text-neutral-950 tabular-nums">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through tabular-nums">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {product.shortDesc}
            </p>

            {/* Specification Table */}
            <div className="mt-3.5 border border-neutral-200 overflow-x-auto bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-2 px-3 font-bold">ART. NO (SKU)</th>
                    <th className="py-2 px-3 font-bold">LEBAR KABINET</th>
                    <th className="py-2 px-3 font-bold">W × D × H</th>
                    <th className="py-2 px-3 font-bold">KAPASITAS BEBAN</th>
                    <th className="py-2 px-3 font-bold">FINISHING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800 text-xs">
                  {specRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-neutral-950">{row.artNo}</td>
                      <td className="py-2 px-3 text-neutral-800 font-medium">{row.cabinet}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-neutral-600">{row.dimensions}</td>
                      <td className="py-2 px-3 font-medium">{row.weightCapacity}</td>
                      <td className="py-2 px-3 text-neutral-500 text-[11px]">{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-3 border-t border-neutral-200">
            <button
              onClick={() => onQuickAdd(product)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                isAdded
                  ? 'bg-neutral-950 text-[#D4AF37]'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-[#D4AF37]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Ditambahkan</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+ Keranjang</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenWhatsAppConsult ? onOpenWhatsAppConsult(product.name) : undefined}
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-neutral-300"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Konsultasi WhatsApp</span>
            </button>

            <button
              onClick={() => onSelect(product)}
              className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-600" />
              <span>Lihat Detail</span>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
