import React, { useState } from 'react';
import { ProductVisual } from './ProductVisual';

interface ProductPlaceholderImageProps {
  type?: string;
  series?: string;
  name: string;
  sku?: string;
  imageUrl?: string;
  className?: string;
  showDimensions?: boolean;
  minCabinet?: { width: number; depth: number; height: number };
}

// Curated high-resolution genuine architectural furniture photographs
const FALLBACK_CATEGORY_PHOTOS: Record<string, string> = {
  'swing-tray': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  'magic-corner': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
  'show-hand': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  'revolving': 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
  'tall-larder': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
  'swivel-tall': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'base-basket': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  'pandora': 'https://images.unsplash.com/photo-1595514535415-dae92493e87d?auto=format&fit=crop&w=800&q=80',
  'garbage-cleaning': 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
  'midway-rack': 'https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&w=800&q=80',
  'sink': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'faucet': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
};

export const ProductPlaceholderImage: React.FC<ProductPlaceholderImageProps> = ({
  type = 'default',
  series = 'Hardware',
  name,
  sku,
  imageUrl,
  className = 'w-full h-52',
  showDimensions = false,
  minCabinet,
}) => {
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  const fallbackPhoto = FALLBACK_CATEGORY_PHOTOS[type] || FALLBACK_CATEGORY_PHOTOS.default;
  const targetPhoto = (!imgFailed && imageUrl) ? imageUrl : fallbackPhoto;

  if (imgFailed) {
    // When external photo fails, fall back to high precision vector visual
    return (
      <ProductVisual
        type={type}
        series={series}
        name={name}
        className={className}
        showDimensions={showDimensions}
        minCabinet={minCabinet}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-50 flex items-center justify-center group ${className}`}>
      <img
        src={targetPhoto}
        alt={name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Series badge (clean luxury rectangular tag, no capsule/pill, no blue) */}
      <div className="absolute top-2 left-2 z-10">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-none bg-neutral-900/90 text-[#C8A15A] text-[10px] font-bold tracking-wider uppercase">
          {series}
        </span>
      </div>

      {showDimensions && minCabinet && (
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono tracking-tight">
          Min W{minCabinet.width} × D{minCabinet.depth}mm
        </div>
      )}
    </div>
  );
};
