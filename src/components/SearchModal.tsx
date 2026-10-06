import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products = PRODUCTS,
}) => {
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSeries = selectedSeries === 'all' || p.series === selectedSeries;
      const q = query.toLowerCase().trim();
      if (!q) return matchesSeries;

      const matchesText =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.series.toLowerCase().includes(q) ||
        p.cabinetWidths.some((w) => w.toString().includes(q)) ||
        p.features.some((f) => f.toLowerCase().includes(q));

      return matchesSeries && matchesText;
    });
  }, [products, query, selectedSeries]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 sm:pt-20 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden rounded-none animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C8A15A] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari hardware (e.g. Magic Corner, Swing Tray, 900mm, SUS 304, Sink)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer rounded-none"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer rounded-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Series Filter Tabs - Square */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 uppercase tracking-wider font-semibold">Filter Seri:</span>
          {['all', 'Diamond', 'Shearer', 'Arena', 'Fashion', 'Stainless 304'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSeries(s)}
              className={`px-3 py-1 transition-colors shrink-0 cursor-pointer rounded-none text-xs uppercase tracking-wider ${
                selectedSeries === s
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? 'Semua Seri' : s}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100 bg-white">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              Tidak ditemukan produk dengan kata kunci &quot;{query}&quot;.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onClose();
                  onSelectProduct(p);
                }}
                className="py-3 px-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50 transition-colors rounded-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 bg-slate-100 overflow-hidden shrink-0 rounded-none">
                    <ProductPlaceholderImage
                      type={p.svgVisualType}
                      series={p.series}
                      name={p.name}
                      sku={p.sku}
                      imageUrl={p.imageUrl}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
                      <span className="text-[#9A7B38] font-semibold">{p.series}</span>
                      <span>·</span>
                      <span className="font-mono">{p.sku}</span>
                      <span>·</span>
                      <span>W{p.minCabinetDims.width}mm</span>
                    </div>
                    <div className="text-sm font-display font-semibold text-slate-900 group-hover:text-[#9A7B38] transition-colors truncate">
                      {p.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-sans font-bold text-slate-900">
                    {formatRupiah(p.price)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#9A7B38] transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
