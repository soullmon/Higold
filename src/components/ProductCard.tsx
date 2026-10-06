import React from 'react';
import { Product } from '../types';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatRupiah } from '../utils/format';
import { Star, MapPin, ShoppingCart, Check } from '@phosphor-icons/react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenWhatsAppConsult?: (productName: string) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  onOpenWhatsAppConsult,
  isAdded = false,
}) => {
  // Calculate discount percentage
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 14;

  const location = product.location || 'Jakarta Selatan';
  const rating = product.rating || 5.0;
  const soldCount = product.soldCount || 100;

  return (
    <article 
      onClick={() => onSelect(product)}
      className="group bg-white rounded-md border border-neutral-200 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* 1. Image Container */}
      <div className="relative overflow-hidden bg-neutral-100 aspect-4/3 sm:aspect-square">
        <ProductPlaceholderImage
          type={product.svgVisualType}
          series={product.series}
          name={product.name}
          sku={product.sku}
          imageUrl={product.imageUrl}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            className="text-xs sm:text-[13px] font-semibold text-neutral-900 group-hover:text-[#C8A15A] transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1.5">
            <div className="text-sm sm:text-base font-bold text-neutral-900 font-sans tracking-tight">
              {formatRupiah(product.price)}
            </div>

            {/* Strikethrough & discount */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-neutral-400 line-through">
                {formatRupiah(product.originalPrice || Math.round(product.price * 1.15))}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {discountPercent}%
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-600">
            <MapPin weight="fill" className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Rating & Sold count */}
          <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-600">
            <Star weight="fill" className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-neutral-800">{rating.toFixed(1)}</span>
            <span className="text-neutral-300">|</span>
            <span>{soldCount}+ terjual</span>
          </div>
        </div>

        {/* Quick Add Button / Action */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className={`w-full py-1.5 px-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              isAdded 
                ? 'bg-[#C8A15A] text-white font-bold' 
                : 'bg-neutral-50 hover:bg-[#C8A15A] text-neutral-700 hover:text-white border border-neutral-200'
            }`}
          >
            {isAdded ? (
              <>
                <Check weight="bold" className="w-3.5 h-3.5 text-white" />
                <span>Di Keranjang</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
