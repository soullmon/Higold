import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductMediaItem } from '../types';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { TechnicalSchematicDiagram } from './TechnicalSchematicDiagram';
import { formatRupiah } from '../utils/format';
import { getProductMediaItems } from '../utils/media';
import { 
  X, Check, ShoppingBag, ShieldCheck, Ruler, MessageCircle, 
  FileText, Image as ImageIcon, Video, Play, Pause, 
  Maximize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  Volume2, VolumeX, Eye, RotateCcw, Star
} from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    selectedWidth: number,
    selectedOpening: string | undefined,
    selectedFinish: string,
    quantity: number,
    selectedSku?: string
  ) => void;
  onOpenWhatsAppConsult: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenWhatsAppConsult,
}) => {
  const [selectedWidth, setSelectedWidth] = useState<number>(product?.cabinetWidths[0] ?? 900);
  const [selectedOpening, setSelectedOpening] = useState<string | undefined>(
    product?.openingDirections ? product.openingDirections[0] : undefined
  );
  const [selectedFinish, setSelectedFinish] = useState<string>(product?.finishOptions[0] ?? 'Titanium Grey');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [dimensionViewMode, setDimensionViewMode] = useState<'uploaded' | 'schematic'>('uploaded');
  const [dimensionZoom, setDimensionZoom] = useState<number>(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

  // Dynamic Size Variant details: Each size can have a distinct SKU and price!
  const selectedVariant = product?.variants?.find((v) => v.sizeWidth === selectedWidth);
  const currentSku = selectedVariant?.sku || product?.sku || '';
  const currentPrice = selectedVariant?.price || product?.price || 0;
  const currentOriginalPrice = selectedVariant?.originalPrice || product?.originalPrice;
  const currentStock = selectedVariant?.stockQuantity || product?.stockQuantity || 0;

  const mediaItems: ProductMediaItem[] = React.useMemo(() => {
    return product ? getProductMediaItems(product) : [];
  }, [product]);

  useEffect(() => {
    if (product) {
      setSelectedWidth(product.cabinetWidths[0] || 900);
      setSelectedOpening(product.openingDirections ? product.openingDirections[0] : undefined);
      setSelectedFinish(product.finishOptions[0] || 'Titanium Grey');
      setQuantity(1);
      setActiveIndex(0);
      setDimensionZoom(1);
      setDimensionViewMode(product.dimensionImageUrl ? 'uploaded' : 'schematic');
      setIsVideoPlaying(false);
    }
  }, [product]);

  useEffect(() => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [activeIndex]);

  if (!product) return null;

  const activeMedia = mediaItems[activeIndex] || mediaItems[0];
  const hasMultipleMedia = mediaItems.length > 1;

  const handlePrevMedia = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  };

  const handleNextMedia = () => {
    setActiveIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  };

  const handleAdd = () => {
    onAddToCart(product, selectedWidth, selectedOpening, selectedFinish, quantity, currentSku);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-scale font-sans">
        <div 
          className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden my-4 sm:my-8 rounded-2xl border border-slate-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close product modal"
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[92vh] overflow-y-auto">
            {/* LEFT COLUMN: MEDIA VIEW */}
            <div className="md:col-span-6 bg-slate-50 p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
              <div className="space-y-4">
                
                {/* Header Info Bar: SKU + Series + Stock */}
                <div className="flex items-center justify-between text-xs font-sans tracking-wider border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                      SKU: {currentSku}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-950 text-[#D4AF37] font-mono text-[10px] uppercase font-bold tracking-wider border border-neutral-800">
                      {product.series}
                    </span>
                  </div>
                  <span className="text-slate-600 font-medium text-[11px]">
                    Stok: <strong className="text-slate-950 font-bold">{currentStock}</strong> unit
                  </span>
                </div>

                {/* PRIMARY MEDIA VIEWPORT */}
                <div className="relative aspect-4/3 bg-black overflow-hidden group border border-neutral-800 flex items-center justify-center">
                  
                  {/* VIDEO */}
                  {activeMedia && activeMedia.type === 'video' ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video
                        ref={videoRef}
                        src={activeMedia.url}
                        playsInline
                        loop
                        muted={isVideoMuted}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        className="w-full h-full object-contain"
                      />

                      <div 
                        onClick={toggleVideoPlay}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer transition-opacity group"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVideoPlay();
                          }}
                          className="p-4 bg-[#D4AF37] hover:bg-[#c5a059] text-neutral-950 transition-all cursor-pointer shadow-xl"
                        >
                          {isVideoPlaying ? (
                            <Pause className="w-6 h-6 text-neutral-950" />
                          ) : (
                            <Play className="w-6 h-6 ml-0.5 fill-neutral-950 text-neutral-950" />
                          )}
                        </button>
                      </div>

                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/90 text-[#D4AF37] text-[10px] font-mono flex items-center gap-1.5 shadow-md font-semibold border border-neutral-800">
                        <span>VIDEO DEMO</span>
                      </div>

                      <button
                        onClick={toggleVideoMute}
                        className="absolute bottom-3 right-3 p-2 bg-black/80 hover:bg-black text-[#D4AF37] cursor-pointer border border-neutral-800"
                        title={isVideoMuted ? "Unmute" : "Mute"}
                      >
                        {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : activeMedia && activeMedia.type === 'dimension' ? (
                    /* DIMENSIONS */
                    <div className="relative w-full h-full flex items-center justify-center bg-white p-2">
                      {dimensionViewMode === 'uploaded' && activeMedia.url ? (
                        <img
                          src={activeMedia.url}
                          alt="CAD Technical Drawing"
                          style={{ transform: `scale(${dimensionZoom})` }}
                          className="w-full h-full object-contain transition-transform duration-200"
                        />
                      ) : (
                        <TechnicalSchematicDiagram
                          product={product}
                          className="w-full h-full"
                        />
                      )}

                      <div className="absolute top-3 left-3 flex items-center gap-1">
                        <button
                          onClick={() => setDimensionViewMode('uploaded')}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${
                            dimensionViewMode === 'uploaded' ? 'bg-neutral-950 text-[#D4AF37]' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          CAD Blueprint
                        </button>
                        <button
                          onClick={() => setDimensionViewMode('schematic')}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${
                            dimensionViewMode === 'schematic' ? 'bg-neutral-950 text-[#D4AF37]' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          Schematic Diagram
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* PHOTOGRAPH */
                    <div className="relative w-full h-full">
                      <ProductPlaceholderImage
                        type={product.svgVisualType}
                        series={product.series}
                        name={product.name}
                        sku={product.sku}
                        imageUrl={activeMedia?.url || product.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Previous / Next Media Navigation Controls */}
                  {hasMultipleMedia && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevMedia}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 transition-all cursor-pointer shadow-md opacity-0 group-hover:opacity-100"
                        title="Previous photo/video"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMedia}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 transition-all cursor-pointer shadow-md opacity-0 group-hover:opacity-100"
                        title="Next photo/video"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Expand Fullscreen */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-2.5 left-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* THUMBNAIL ROW */}
                {hasMultipleMedia && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {mediaItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative w-14 h-14 overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeIndex === idx ? 'border-[#D4AF37]' : 'border-neutral-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white">
                            <Play className="w-4 h-4 fill-white" />
                          </div>
                        ) : (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cabinet Clearance Box */}
              <div className="mt-4 p-4 bg-white space-y-2 text-xs border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                    <Ruler className="w-4 h-4 text-[#D4AF37]" />
                    <span>Internal Cabinet Minimum Clearance</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">Tolerance ±2mm</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 font-sans text-center pt-1 text-neutral-700">
                  <div className="bg-neutral-50 p-2 border border-neutral-200">
                    <div className="text-[9px] uppercase text-neutral-500 font-semibold">Min. Width</div>
                    <div className="font-bold text-neutral-950 text-sm font-mono">{product.minCabinetDims.width}mm</div>
                  </div>
                  <div className="bg-neutral-50 p-2 border border-neutral-200">
                    <div className="text-[9px] uppercase text-neutral-500 font-semibold">Min. Depth</div>
                    <div className="font-bold text-neutral-950 text-sm font-mono">{product.minCabinetDims.depth}mm</div>
                  </div>
                  <div className="bg-neutral-50 p-2 border border-neutral-200">
                    <div className="text-[9px] uppercase text-neutral-500 font-semibold">Min. Height</div>
                    <div className="font-bold text-neutral-950 text-sm font-mono">{product.minCabinetDims.height}mm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SPECS & ACTIONS */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-900 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    Higold Official
                  </span>
                  <span>·</span>
                  <span className="text-neutral-600 font-medium">Garansi {product.warranty || '5 Tahun Mekanisme'}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 leading-snug">
                  {product.name}
                </h2>

                {/* Price in Bold */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-950 tabular-nums">
                    {formatRupiah(currentPrice)}
                  </span>
                  {currentOriginalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {formatRupiah(currentOriginalPrice)}
                    </span>
                  )}
                  <span className="text-[11px] px-2 py-0.5 bg-[#D4AF37]/25 text-neutral-950 font-bold border border-[#D4AF37]">
                    {currentStock > 0 ? `Ready Stock (${currentStock} unit)` : 'Pre-order'}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {product.fullDesc}
                </p>

                {/* Configuration Options */}
                <div className="mt-5 pt-4 border-t border-neutral-200 space-y-3.5">
                  {/* Cabinet Width */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
                        1. Ukuran Kabinet (Beda Ukuran Beda No SKU):
                      </label>
                      <span className="text-[11px] font-mono text-neutral-950 font-bold bg-neutral-100 px-2 py-0.5 border border-neutral-300">
                        SKU: {currentSku}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.cabinetWidths.map((width) => {
                        const variantItem = product.variants?.find(v => v.sizeWidth === width);
                        return (
                          <button
                            key={width}
                            type="button"
                            onClick={() => setSelectedWidth(width)}
                            className={`px-3 py-1.5 text-xs transition-all cursor-pointer border text-left flex flex-col items-center ${
                              selectedWidth === width
                                ? 'bg-neutral-950 text-[#D4AF37] font-bold border-neutral-950 shadow-xs'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                            }`}
                          >
                            <span className="font-bold">{width} mm</span>
                            {variantItem?.sku && (
                              <span className={`text-[9px] font-mono mt-0.5 ${
                                selectedWidth === width ? 'text-[#D4AF37]' : 'text-neutral-400'
                              }`}>
                                {variantItem.sku}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Opening Direction */}
                  {product.openingDirections && product.openingDirections.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                        2. Arah Bukaan Pintu:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.openingDirections.map((dir) => (
                          <button
                            key={dir}
                            type="button"
                            onClick={() => setSelectedOpening(dir)}
                            className={`px-3 py-1.5 text-xs transition-all cursor-pointer border ${
                              selectedOpening === dir
                                ? 'bg-neutral-950 text-[#D4AF37] font-bold border-neutral-950'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                            }`}
                          >
                            {dir}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Finish Options */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                      {product.openingDirections ? '3' : '2'}. Pilihan Finishing Material:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.finishOptions.map((finish) => (
                        <button
                          key={finish}
                          type="button"
                          onClick={() => setSelectedFinish(finish)}
                          className={`px-3 py-1.5 text-xs transition-all cursor-pointer border ${
                            selectedFinish === finish
                              ? 'bg-neutral-950 text-[#D4AF37] font-bold border-neutral-950'
                              : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                          }`}
                        >
                          {finish}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">Jumlah:</span>
                    <div className="flex items-center bg-neutral-100 border border-neutral-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-neutral-700 hover:text-black transition-colors cursor-pointer text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 text-xs font-semibold text-neutral-950">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                        className="px-3 py-1 text-neutral-700 hover:text-black transition-colors cursor-pointer text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-neutral-700 font-semibold">
                      Subtotal: <strong className="text-neutral-950 font-black">{formatRupiah(product.price * quantity)}</strong>
                    </span>
                  </div>
                </div>

                {/* Tabel Spesifikasi Ukuran & SKU Resmi Higold (Permintaan User: Setiap Barang Memiliki Ukuran Tertentu & SKU Berbeda) */}
                <div className="mt-4 pt-3 border-t border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                      Tabel Ukuran & SKU Resmi Higold:
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Klik baris untuk memilih ukuran
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 text-[10px] uppercase">
                        <tr>
                          <th className="px-2.5 py-1.5">Ukuran</th>
                          <th className="px-2.5 py-1.5">No. SKU</th>
                          <th className="px-2.5 py-1.5">Dimensi (L×D×T)</th>
                          <th className="px-2.5 py-1.5 text-right">Harga</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {product.cabinetWidths.map((width) => {
                          const variant = product.variants?.find(v => v.sizeWidth === width);
                          const isCurrent = selectedWidth === width;
                          const varSku = variant?.sku || `${product.sku}-${width}`;
                          const varPrice = variant?.price || product.price;
                          const varDims = variant?.dimensions 
                            ? `${variant.dimensions.width}×${variant.dimensions.depth}×${variant.dimensions.height}mm`
                            : `${width - 40}×${product.minCabinetDims?.depth || 520}×${product.minCabinetDims?.height || 650}mm`;

                          return (
                            <tr
                              key={width}
                              onClick={() => setSelectedWidth(width)}
                              className={`cursor-pointer transition-colors ${
                                isCurrent ? 'bg-[#FAF6ED] font-bold text-neutral-900' : 'hover:bg-neutral-50 text-neutral-600'
                              }`}
                            >
                              <td className="px-2.5 py-1.5 font-bold">
                                {width} mm {isCurrent && <span className="text-[#C8A15A] ml-1">●</span>}
                              </td>
                              <td className="px-2.5 py-1.5 font-mono text-[11px] font-semibold text-neutral-900">
                                {varSku}
                              </td>
                              <td className="px-2.5 py-1.5 font-mono text-[10px] text-neutral-500">
                                {varDims}
                              </td>
                              <td className="px-2.5 py-1.5 text-right font-bold text-neutral-900">
                                {formatRupiah(varPrice)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 pt-3 border-t border-neutral-200 text-xs space-y-1.5">
                  <div className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] mb-1">
                    Spesifikasi Mekanisme Utama:
                  </div>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-neutral-600">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar Bottom */}
              <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`w-full py-3 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAddedFeedback
                        ? 'bg-neutral-950 text-[#D4AF37]'
                        : 'bg-neutral-950 hover:bg-neutral-800 text-[#D4AF37]'
                    }`}
                  >
                    {isAddedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-[#D4AF37]" />
                        <span>Dimasukkan ke Keranjang!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                        <span>+ Masukkan Keranjang</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenWhatsAppConsult(product.name)}
                    className="w-full py-3 px-4 font-bold text-xs uppercase tracking-wider bg-white hover:bg-neutral-100 text-neutral-900 flex items-center justify-center gap-2 transition-colors cursor-pointer border border-neutral-300"
                  >
                    <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span>Konsultasi WhatsApp</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                  <span className="flex items-center gap-1.5 text-neutral-600 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
                    <span>Garansi Mekanis Resmi 5 Tahun Higold Indonesia</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    SKU: {currentSku}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX PREVIEW */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-scale"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-black/50 cursor-pointer shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {activeMedia && activeMedia.type === 'video' ? (
              <video
                src={activeMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] shadow-2xl rounded-lg"
              />
            ) : (
              <img
                src={activeMedia?.url}
                alt={product.name}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg"
              />
            )}

            <div className="mt-3 text-center text-xs font-mono text-slate-300">
              {product.name} · Media {activeIndex + 1} of {mediaItems.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
