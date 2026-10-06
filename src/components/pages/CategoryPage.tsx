import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../../data/products';
import { Product, CategoryId, SubcategoryId, ProductSeries, CategoryInfo } from '../../types';
import { ProductCard } from '../ProductCard';
import { 
  SquaresFour, ArrowBendDownRight, ArrowsClockwise, 
  Sparkle, Tray, CookingPot, CaretRight, SlidersHorizontal, 
  Check, Funnel
} from '@phosphor-icons/react';

interface CategoryPageProps {
  products: Product[];
  categories?: CategoryInfo[];
  categoryId: CategoryId | 'all';
  activeSubcategoryId?: string;
  initialSubcategoryId?: string;
  searchQuery?: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onSelectCategory: (categoryId: CategoryId | 'all', subcategoryId?: string) => void;
  onOpenCalculator?: () => void;
  onOpenWhatsAppConsult?: (productName: string) => void;
  quickAddedId?: string | null;
}

// Line art SVG illustrations for each category fallback
const CategoryLineArt: React.FC<{ type: string }> = ({ type }) => {
  if (type.includes('corner')) {
    return (
      <svg className="w-14 h-14 text-neutral-800 shrink-0" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="14" width="48" height="36" rx="2" />
        <line x1="8" y1="24" x2="56" y2="24" />
        <circle cx="16" cy="19" r="2" />
        <circle cx="24" cy="19" r="2" />
        <circle cx="48" cy="19" r="2" />
        <rect x="14" y="28" width="36" height="18" rx="1" />
        <line x1="20" y1="37" x2="44" y2="37" />
      </svg>
    );
  }
  if (type.includes('larder') || type.includes('tall')) {
    return (
      <svg className="w-14 h-14 text-neutral-800 shrink-0" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="28" y="10" width="8" height="18" />
        <path d="M14 42 L26 28 L38 28 L50 42 Z" />
        <rect x="12" y="42" width="40" height="6" rx="1" />
        <circle cx="32" cy="45" r="1.5" />
      </svg>
    );
  }
  if (type.includes('base') || type.includes('bawah')) {
    return (
      <svg className="w-14 h-14 text-neutral-800 shrink-0" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="14" y="10" width="36" height="44" rx="2" />
        <line x1="14" y1="18" x2="50" y2="18" />
        <circle cx="20" cy="14" r="1.5" />
        <circle cx="26" cy="14" r="1.5" />
        <circle cx="44" cy="14" r="1.5" />
        <rect x="20" y="24" width="24" height="24" rx="1" />
        <line x1="20" y1="32" x2="44" y2="32" />
        <line x1="20" y1="40" x2="44" y2="40" />
      </svg>
    );
  }
  if (type.includes('midway') || type.includes('dinding')) {
    return (
      <svg className="w-14 h-14 text-neutral-800 shrink-0" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="16" y="8" width="32" height="48" rx="2" />
        <line x1="16" y1="28" x2="48" y2="28" />
        <line x1="22" y1="16" x2="22" y2="22" strokeWidth="2" />
        <line x1="22" y1="34" x2="22" y2="42" strokeWidth="2" />
      </svg>
    );
  }
  // sink & faucet or default
  return (
    <svg className="w-14 h-14 text-neutral-800 shrink-0" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="18" y="8" width="28" height="48" rx="2" />
      <line x1="18" y1="24" x2="46" y2="24" />
      <line x1="18" y1="40" x2="46" y2="40" />
      <line x1="32" y1="8" x2="32" y2="56" />
      <circle cx="28" cy="20" r="1" />
      <circle cx="36" cy="20" r="1" />
    </svg>
  );
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  products,
  categories = CATEGORIES,
  categoryId,
  activeSubcategoryId,
  initialSubcategoryId,
  searchQuery,
  onSelectProduct,
  onQuickAdd,
  onSelectCategory,
  onOpenCalculator,
  onOpenWhatsAppConsult,
  quickAddedId,
}) => {
  const [activeSubcat, setActiveSubcat] = useState<string>(activeSubcategoryId || initialSubcategoryId || 'all');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Sync subcategory prop
  React.useEffect(() => {
    if (activeSubcategoryId) {
      setActiveSubcat(activeSubcategoryId);
    }
  }, [activeSubcategoryId]);

  // Current selected category object
  const currentCategoryObj = useMemo(() => {
    return categories.find(c => c.id === categoryId);
  }, [categories, categoryId]);

  // Subcategories pill tags: dynamically derived from the active category
  // User instruction: "jangan gunakan icon, buat hanya teks dalam capsul jadi setiap Kategori memiliki sub kategori sesuai yang admin buat"
  const subcatPills = useMemo(() => {
    if (currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0) {
      return [
        { id: 'all', name: 'All' },
        ...currentCategoryObj.subcategories
      ];
    }

    if (categoryId === 'all') {
      // Gather all unique subcategories across all categories
      const allSub: { id: string; name: string }[] = [];
      const seen = new Set<string>();
      categories.forEach(c => {
        (c.subcategories || []).forEach((s: { id: string; name: string }) => {
          if (!seen.has(s.id)) {
            seen.add(s.id);
            allSub.push(s);
          }
        });
      });
      return [{ id: 'all', name: 'All' }, ...allSub];
    }

    return [{ id: 'all', name: 'All' }];
  }, [currentCategoryObj, categories, categoryId]);

  // Reset activeSubcat to 'all' if category changes and the current subcat is not in the new pills
  React.useEffect(() => {
    if (activeSubcat !== 'all') {
      const exists = subcatPills.some(p => p.id === activeSubcat);
      if (!exists) {
        setActiveSubcat('all');
      }
    }
  }, [categoryId, subcatPills]);

  // Filter products
  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.shortDesc.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }

      // Category
      if (categoryId !== 'all' && p.categoryId !== categoryId) return false;

      // Subcategory
      if (activeSubcat !== 'all') {
        const pSub = (p.subcategoryId || '').toLowerCase();
        const pName = p.name.toLowerCase();
        const targetSub = activeSubcat.toLowerCase();
        if (pSub !== targetSub && !pSub.includes(targetSub) && !pName.includes(targetSub)) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, categoryId, activeSubcat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8 font-sans bg-white">
      
      {/* 1. HERO SLIDE BANNER (Matching ui.png) */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm aspect-21/9 max-h-[380px] bg-neutral-100">
        <img
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1800&q=85"
          alt="HIGOLD Kitchen Cabinet Banner"
          className="w-full h-full object-cover"
        />

        {/* Bottom-left Pagination Dots */}
        <div className="absolute bottom-4 left-6 flex items-center gap-1.5 z-10">
          <button 
            onClick={() => setActiveBannerIdx(0)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeBannerIdx === 0 ? 'bg-white w-4' : 'bg-white/60'}`}
          />
          <button 
            onClick={() => setActiveBannerIdx(1)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeBannerIdx === 1 ? 'bg-white w-4' : 'bg-white/60'}`}
          />
        </div>

        {/* Bottom-right Product Banner Name Tag */}
        <div className="absolute bottom-4 right-6 z-10">
          <span className="px-3.5 py-1.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-xs font-medium tracking-wide">
            {currentCategoryObj ? currentCategoryObj.name : 'Koleksi Flagship Kitchen Hardware'}
          </span>
        </div>
      </div>

      {/* 2. HEADING KATEGORI */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Kategori
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pilih kategori hardware kabinet sesuai kebutuhan arsitektural dapur Anda
          </p>
        </div>
        {categoryId !== 'all' && (
          <button
            onClick={() => {
              onSelectCategory('all');
              setActiveSubcat('all');
            }}
            className="text-xs font-bold text-[#C8A15A] hover:underline cursor-pointer"
          >
            Tampilkan Semua Kategori
          </button>
        )}
      </div>

      {/* 3. CATEGORY CARDS GRID (Dynamic based on categories created by admin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const isSelected = categoryId === cat.id;
          const count = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              onClick={() => {
                const nextId = isSelected ? 'all' : (cat.id as CategoryId);
                onSelectCategory(nextId);
                setActiveSubcat('all');
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected 
                  ? 'border-[#C8A15A] bg-[#FAF8F5] shadow-xs ring-1 ring-[#C8A15A]' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-bold text-sm text-neutral-900 truncate" title={cat.name}>
                  {cat.name}
                </div>
                <div className="text-[11px] text-neutral-400 font-medium">
                  {count} produk
                </div>
                <div className="text-[10px] text-neutral-400 pt-1 leading-relaxed line-clamp-2" title={cat.tagline || cat.description}>
                  {cat.tagline || cat.description || 'Cater to all three collections'}
                </div>
              </div>

              {/* Category Icon: Render uploaded icon or architectural line art */}
              <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-neutral-50/90 border border-neutral-200/80 p-1.5 transition-colors group-hover:border-[#C8A15A]/60">
                {cat.iconUrl ? (
                  <img
                    src={cat.iconUrl}
                    alt={cat.name}
                    className="max-w-full max-h-full object-contain drop-shadow-2xs"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                ) : null}
                <div style={{ display: cat.iconUrl ? 'none' : 'block' }}>
                  <CategoryLineArt type={cat.id || cat.name.toLowerCase()} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. SUBCATEGORY CAPSULES (HANYA TEKS TANPA ICON SESUAI PERMINTAAN USER) */}
      <div className="pt-2 border-t border-neutral-200">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {subcatPills.map((pill) => {
            const isSelected = activeSubcat === pill.id;

            return (
              <button
                key={pill.id}
                onClick={() => setActiveSubcat(pill.id)}
                className={`px-4 py-2 rounded-full border text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C8A15A] bg-[#FDFBF7] text-[#9A7B38] font-bold shadow-xs'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900'
                }`}
              >
                <span>{pill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. PRODUCT GRID (Matching ui.png) */}
      <div>
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200">
            <p className="text-sm font-semibold text-neutral-600">
              Tidak ada produk yang sesuai dengan kategori terpilih.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setActiveSubcat('all');
              }}
              className="mt-3 px-4 py-2 bg-neutral-900 text-[#C8A15A] rounded-lg text-xs font-semibold cursor-pointer"
            >
              Lihat Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {displayedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onOpenWhatsAppConsult={onOpenWhatsAppConsult}
                isAdded={quickAddedId === p.id}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
