import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { Ruler, CheckCircle2, AlertCircle, ArrowRight, X, ShoppingBag, Eye } from 'lucide-react';
import { formatRupiah } from '../utils/format';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';

interface CabinetCalculatorProps {
  isOpen?: boolean;
  isInline?: boolean; // When rendered inline in HomePage matching Frame 2.png
  onClose?: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  products?: Product[];
}

export const CabinetCalculator: React.FC<CabinetCalculatorProps> = ({
  isOpen = true,
  isInline = false,
  onClose,
  onSelectProduct,
  onQuickAdd,
  products = PRODUCTS,
}) => {
  const [cabinetType, setCabinetType] = useState<string>('all');
  const [lebar, setLebar] = useState<string>('');
  const [panjang, setPanjang] = useState<string>('');
  const [tinggi, setTinggi] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  if (!isInline && !isOpen) return null;

  const numLebar = lebar.trim() && !isNaN(Number(lebar)) && Number(lebar) > 0 ? Number(lebar) : null;
  const numPanjang = panjang.trim() && !isNaN(Number(panjang)) && Number(panjang) > 0 ? Number(panjang) : null;
  const numTinggi = tinggi.trim() && !isNaN(Number(tinggi)) && Number(tinggi) > 0 ? Number(tinggi) : null;

  // Default kosong: Produk HANYA akan muncul saat seseorang menginputkan nilai dimensi numerik
  const hasNumericInput = Boolean(numLebar !== null || numPanjang !== null || numTinggi !== null);

  // Filter products matching specifications ONLY when user has inputted dimension values
  const matchedProducts = !hasNumericInput ? [] : products.filter((p) => {
    if (cabinetType === 'base' && p.categoryId !== 'base-units') return false;
    if (cabinetType === 'corner' && p.categoryId !== 'corner-units') return false;
    if (cabinetType === 'tall' && p.categoryId !== 'larder-units') return false;
    if (cabinetType === 'sink' && p.categoryId !== 'midway-sink') return false;

    // Check width if entered
    if (numLebar !== null && numLebar > 0) {
      const fitsWidth = p.cabinetWidths.some(w => Math.abs(w - numLebar) <= 100) || p.minCabinetDims.width <= numLebar;
      if (!fitsWidth) return false;
    }

    // Check depth/panjang if entered
    if (numPanjang !== null && numPanjang > 0) {
      if (p.minCabinetDims.depth > numPanjang) return false;
    }

    // Check height if entered
    if (numTinggi !== null && numTinggi > 0) {
      if (p.minCabinetDims.height > numTinggi) return false;
    }

    return true;
  });

  const handleReset = () => {
    setLebar('');
    setPanjang('');
    setTinggi('');
    setCabinetType('all');
    setHasSearched(false);
  };

  const content = (
    <div className="w-full space-y-6">
      {/* Title matching Frame 2.png: "Cabinet Calculator" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            Cabinet Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cari fitting hardware Higold yang presisi untuk ukuran kabinet kitchen set Anda
          </p>
        </div>
        {!isInline && onClose && (
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Row of Inputs matching Frame 2.png:
          Type | Lebar (Masukan Nomor) | Panjang (Masukan Nomor) | Tinggi (Masukan Nomor) | Cari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
        
        {/* 1. Type Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Type
          </label>
          <div className="relative">
            <select
              value={cabinetType}
              onChange={(e) => setCabinetType(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A] cursor-pointer"
            >
              <option value="all">Semua Tipe Kabinet</option>
              <option value="base">Kabinet Bawah (Base Unit)</option>
              <option value="corner">Sudut Mati (Corner L-Shape)</option>
              <option value="tall">Lemari Tinggi (Tall Larder)</option>
              <option value="sink">Wastafel & Dinding (Sink Area)</option>
            </select>
          </div>
        </div>

        {/* 2. Lebar (Masukan Nomor) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lebar (mm)
          </label>
          <input
            type="number"
            value={lebar}
            onChange={(e) => setLebar(e.target.value)}
            placeholder="Masukan Nomor (contoh: 800, 900)"
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A]"
          />
        </div>

        {/* 3. Panjang (Masukan Nomor) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Panjang / Kedalaman (mm)
          </label>
          <input
            type="number"
            value={panjang}
            onChange={(e) => setPanjang(e.target.value)}
            placeholder="Masukan Nomor (contoh: 550)"
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A]"
          />
        </div>

        {/* 4. Tinggi (Masukan Nomor) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tinggi (mm)
          </label>
          <input
            type="number"
            value={tinggi}
            onChange={(e) => setTinggi(e.target.value)}
            placeholder="Masukan Nomor (contoh: 700)"
            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A]"
          />
        </div>

        {/* 5. Button Cari matching Frame 2.png */}
        <div>
          <button
            type="button"
            onClick={() => setHasSearched(true)}
            className="w-full py-2.5 px-6 bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>Cari</span>
          </button>
        </div>

      </div>

      {/* Results Area matching Frame 2.png */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 min-h-[160px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${hasNumericInput ? 'bg-[#C8A15A]' : 'bg-slate-300'}`} />
            <span>
              {hasNumericInput 
                ? `Hardware Higold yang Kompatibel (${matchedProducts.length} Produk Ditemukan)`
                : 'Hardware Higold yang Kompatibel (Default Kosong)'}
            </span>
          </div>
          {hasNumericInput && (
            <span className="text-[11px] text-slate-500 font-mono">
              Ukuran Kabinet: {numLebar ?? '-'}mm (W) × {numPanjang ?? '-'}mm (D) × {numTinggi ?? '-'}mm (H)
            </span>
          )}
        </div>

        {!hasNumericInput ? (
          /* State Default Kosong sesuai permintaan: Menunggu pengguna menginputkan nilai */
          <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF6ED] text-[#C8A15A] flex items-center justify-center mx-auto border border-[#C8A15A]/30">
              <Ruler className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-800">
                Kalkulator Siap: Silakan Masukkan Nilai Dimensi Kabinet
              </div>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                Daftar produk hardware Higold akan langsung muncul secara otomatis begitu Anda menginputkan nilai ukuran pada kolom <strong>Lebar</strong>, <strong>Panjang</strong>, atau <strong>Tinggi</strong> kabinet di atas.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-[11px] text-slate-600 rounded-full border border-slate-200">
              <span>💡 Tips: Coba masukkan Lebar <strong>800</strong> atau <strong>900</strong> mm</span>
            </div>
          </div>
        ) : matchedProducts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <div className="text-sm font-bold text-slate-800">
              Tidak ada hardware dengan batas dimensi tersebut
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Coba sesuaikan lebar kabinet ke standar Higold (contoh: 600mm, 800mm, 900mm) atau hubungi tim teknis kami untuk solusi kustom.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedProducts.map((prod) => {
              // Find matching size variant if any
              const matchedVariant = (numLebar !== null && prod.variants?.find(v => Math.abs(v.sizeWidth - numLebar) <= 100)) || prod.variants?.[0];
              const displaySku = matchedVariant?.sku || prod.sku;
              const displayPrice = matchedVariant?.price || prod.price;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      onClick={() => onSelectProduct(prod)}
                      className="w-16 h-16 rounded bg-slate-50 overflow-hidden shrink-0 cursor-pointer border border-slate-100"
                    >
                      <ProductPlaceholderImage
                        type={prod.svgVisualType}
                        series={prod.series}
                        name={prod.name}
                        sku={displaySku}
                        imageUrl={prod.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold bg-amber-50 text-[#C8A15A] px-1.5 py-0.2 rounded border border-amber-200">
                          SKU: {displaySku}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded">
                          {prod.series}
                        </span>
                      </div>
                      <h4 
                        onClick={() => onSelectProduct(prod)}
                        className="text-xs font-semibold text-slate-900 hover:text-[#9A7B38] cursor-pointer line-clamp-2 leading-tight"
                      >
                        {prod.name}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-500">
                        Min: {prod.minCabinetDims.width}W × {prod.minCabinetDims.depth}D × {prod.minCabinetDims.height}H mm
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {formatRupiah(displayPrice)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        ✓ 100% Cocok
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                        title="Lihat Detail & CAD"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {onQuickAdd && (
                        <button
                          onClick={() => onQuickAdd(prod)}
                          className="px-3 py-1.5 bg-[#C8A15A] hover:bg-[#b89148] text-white rounded text-xs font-bold cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>+ Beli</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );

  if (isInline) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {content}
        </div>
      </section>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden my-4 sm:my-8 rounded-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {content}
      </div>
    </div>
  );
};
