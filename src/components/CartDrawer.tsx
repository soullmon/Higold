import React from 'react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/format';
import { 
  X, Trash, ShoppingBag, ArrowRight, ShieldCheck, 
  Truck, Plus, Minus, Tag
} from '@phosphor-icons/react';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Points earned preview for finished products
  const estimatedPoints = Math.floor(subtotal / 10000);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans select-none">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#FAF6ED] text-[#C8A15A] border border-[#C8A15A]/30 flex items-center justify-center">
                <ShoppingBag weight="bold" className="w-4 h-4 text-[#C8A15A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 leading-tight">
                  Keranjang Belanja
                </h2>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {totalCount} item dalam keranjang
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto text-neutral-400 border border-neutral-200">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-neutral-900">Keranjang Anda Kosong</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Jelajahi koleksi Corner Unit, Tall Larder, dan Sistem Dapur Premium HIGOLD untuk memulai.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExploreProducts();
                  }}
                  className="px-6 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Jelajahi Katalog Produk
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-md border border-neutral-200 flex gap-3 relative group shadow-2xs hover:border-[#C8A15A]/60 transition-colors"
                >
                  {/* Photo Thumbnail */}
                  <div className="w-20 h-20 bg-neutral-50 rounded-md overflow-hidden shrink-0 border border-neutral-200">
                    <ProductPlaceholderImage
                      type={item.product.svgVisualType}
                      series={item.product.series}
                      name={item.product.name}
                      sku={item.product.sku}
                      imageUrl={item.product.imageUrl}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {item.product.name}
                    </h4>

                    {/* Variant specs */}
                    <div className="text-[11px] text-neutral-500 mt-0.5 space-y-0.5 font-mono">
                      <div>Lebar: ≥{item.selectedWidth}mm</div>
                      {item.selectedOpening && (
                        <div>Arah: {item.selectedOpening}</div>
                      )}
                      <div className="truncate">SKU: {item.selectedSku}</div>
                    </div>

                    {/* Price & Quantity stepper */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="text-xs font-bold text-neutral-900 font-sans">
                        {formatRupiah(item.product.price * item.quantity)}
                      </div>

                      <div className="flex items-center bg-neutral-100 rounded-md border border-neutral-300 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-700 hover:text-neutral-950 text-xs cursor-pointer font-bold"
                          title="Kurangi"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-neutral-900 min-w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-700 hover:text-neutral-950 text-xs cursor-pointer font-bold"
                          title="Tambah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Hapus item"
                    className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-[#FAF9F6] space-y-3">
              {/* Point Reward Earned Banner */}
              {estimatedPoints > 0 && (
                <div className="flex items-center gap-2 p-2 bg-[#FAF6ED] border border-[#C8A15A]/30 rounded-md text-xs text-[#8A6B29]">
                  <Tag weight="fill" className="w-4 h-4 text-[#C8A15A] shrink-0" />
                  <span>Dapatkan <strong>+{estimatedPoints.toLocaleString('id-ID')} Poin Hadiah</strong> dari transaksi ini!</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal Produk:</span>
                  <span className="text-neutral-900 tabular-nums font-semibold">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#C8A15A]" />
                    <span>Ongkir & Pengiriman:</span>
                  </span>
                  <span className="text-neutral-500 italic">Dihitung saat checkout</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Total Estimasi:</span>
                  <span className="text-[#C8A15A] tabular-nums text-base">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-600 bg-white p-2.5 rounded-md border border-neutral-200">
                <ShieldCheck weight="fill" className="w-4 h-4 text-[#C8A15A] shrink-0" />
                <span>Pembayaran Resmi Transfer Bank BCA / Mandiri & QRIS NMID</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer rounded-md shadow-xs"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
