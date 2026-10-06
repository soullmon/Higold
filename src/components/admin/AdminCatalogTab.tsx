import React, { useState } from 'react';
import { 
  Plus, PencilSimple, Trash, MagnifyingGlass, ArrowCounterClockwise, 
  Check, Package, Copy, FloppyDisk, Warning, 
  UploadSimple, Image as ImageIcon, SlidersHorizontal,
  ArrowSquareOut, Stack, CheckCircle, VideoCamera, Ruler, Play,
  Star
} from '@phosphor-icons/react';
import { Product, CategoryId, SubcategoryId, ProductSeries, CategoryInfo, CMSAccessRole, ProductMediaItem, ProductSizeVariant } from '../../types';
import { formatRupiah } from '../../utils/format';
import { ProductPlaceholderImage } from '../ProductPlaceholderImage';
import { ProductMediaUploader } from './ProductMediaUploader';

interface AdminCatalogTabProps {
  products: Product[];
  categories: CategoryInfo[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory?: (category: CategoryInfo) => void;
  onAddSubcategory?: (categoryId: string, subcategory: { id: SubcategoryId; name: string }) => void;
  currentRole: CMSAccessRole;
  isAddFormOpenInitial?: boolean;
}

export const AdminCatalogTab: React.FC<AdminCatalogTabProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onAddSubcategory,
  currentRole,
  isAddFormOpenInitial = false,
}) => {
  const [catalogSubTab, setCatalogSubTab] = useState<'products' | 'categories'>('products');
  const [viewMode, setViewMode] = useState<'list' | 'form'>(isAddFormOpenInitial ? 'form' : 'list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [selectedSubcatFilter, setSelectedSubcatFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIconUrl, setNewCatIconUrl] = useState('');
  const [initialSubcatName, setInitialSubcatName] = useState('');
  const [selectedCatForSubcat, setSelectedCatForSubcat] = useState<string | null>(null);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);

  const handleUploadCatIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewCatIconUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Size Variants State: Distinct SKU and size per variant
  const [sizeVariants, setSizeVariants] = useState<ProductSizeVariant[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: categories[0]?.id || 'corner-units',
    subcategoryId: categories[0]?.subcategories[0]?.id || 'swing-trays',
    series: 'Diamond' as ProductSeries,
    price: 3500000,
    originalPrice: 4000000,
    stockQuantity: 15,
    inStock: true,
    minWidth: 860,
    minDepth: 520,
    minHeight: 650,
    cabinetWidths: '900, 1000',
    openingDirections: 'Kiri (Left), Kanan (Right)',
    finishOptions: 'Diamond Grey Titanium, Satin Steel',
    material: 'SUS 304 Solid Stainless Steel & Tempered Glass',
    loadCapacity: '25 kg per baki / total 50 kg',
    softCloseMechanism: 'Heavy-duty hydraulic damping cylinder',
    warranty: '5 Tahun Garansi Mekanisme',
    shortDesc: 'Hardware kabinet dapur arsitektural dengan rel hidrolik soft-close.',
    fullDesc: 'Dirancang presisi untuk memaksimalkan ruang dan efisiensi penyimpanan interior.',
    features: 'Mekanisme hidrolik soft-close halus\nKapasitas beban heavy duty\nMaterial tahan korosi SUS 304',
    imageUrl: '',
    galleryImages: [] as string[],
    videoUrl: '',
    dimensionImageUrl: '',
    mediaList: [] as ProductMediaItem[],
    svgVisualType: 'swing-tray' as Product['svgVisualType'],
    isFeatured: false,
  });

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleToggleFeatured = (prod: Product) => {
    const updated: Product = { ...prod, isFeatured: !prod.isFeatured };
    onUpdateProduct(updated);
    showToast(`Produk "${prod.name}" ${!prod.isFeatured ? 'dijadikan' : 'dihapus dari'} Unggulan Beranda!`);
  };

  const getSubcategoriesForCategory = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.subcategories : [];
  };

  const handleAddVariant = () => {
    const nextWidth = sizeVariants.length > 0 ? sizeVariants[sizeVariants.length - 1].sizeWidth + 100 : 900;
    const baseSku = formData.sku.trim() || 'HGD-SKU';
    setSizeVariants(prev => [
      ...prev,
      {
        sizeWidth: nextWidth,
        sku: `${baseSku}-${nextWidth}`,
        price: Number(formData.price) || 3500000,
        originalPrice: Number(formData.originalPrice) || 4000000,
        stockQuantity: 10,
        dimensions: {
          width: nextWidth - 40,
          depth: Number(formData.minDepth) || 520,
          height: Number(formData.minHeight) || 650,
        }
      }
    ]);
  };

  const handleUpdateVariant = (index: number, field: string, val: any) => {
    setSizeVariants(prev => {
      const updated = [...prev];
      if (field.startsWith('dim_')) {
        const dimKey = field.replace('dim_', '') as 'width' | 'depth' | 'height';
        updated[index] = {
          ...updated[index],
          dimensions: {
            ...updated[index].dimensions,
            [dimKey]: Number(val),
          }
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: field === 'sku' ? val : Number(val),
        };
      }
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (sizeVariants.length <= 1) {
      alert('Minimal harus ada 1 ukuran dan SKU.');
      return;
    }
    setSizeVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setValidationError(null);
    const initialCat = categories[0]?.id || 'corner-units';
    const subcats = getSubcategoriesForCategory(initialCat);
    const initialSku = `HGD-${Math.floor(100 + Math.random() * 900)}`;

    const defaultVariants: ProductSizeVariant[] = [
      {
        sizeWidth: 900,
        sku: `${initialSku}-900`,
        price: 3500000,
        originalPrice: 4000000,
        stockQuantity: 12,
        dimensions: { width: 860, depth: 520, height: 650 },
      },
      {
        sizeWidth: 1000,
        sku: `${initialSku}-1000`,
        price: 3850000,
        originalPrice: 4400000,
        stockQuantity: 8,
        dimensions: { width: 960, depth: 520, height: 650 },
      },
    ];
    setSizeVariants(defaultVariants);

    setFormData({
      name: '',
      sku: initialSku,
      categoryId: initialCat,
      subcategoryId: subcats.length > 0 ? subcats[0].id : 'swing-trays',
      series: 'Diamond',
      price: 3500000,
      originalPrice: 4000000,
      stockQuantity: 20,
      inStock: true,
      minWidth: 860,
      minDepth: 520,
      minHeight: 650,
      cabinetWidths: '900, 1000',
      openingDirections: 'Kiri (Left), Kanan (Right)',
      finishOptions: 'Diamond Grey Titanium, Satin Steel',
      material: 'SUS 304 Solid Stainless Steel & Tempered Glass',
      loadCapacity: '25 kg per baki / total 50 kg',
      softCloseMechanism: 'Heavy-duty hydraulic damping cylinder',
      warranty: '5 Tahun Garansi Mekanisme',
      shortDesc: 'Hardware kabinet dapur arsitektural dengan rel hidrolik soft-close.',
      fullDesc: 'Dirancang presisi untuk memaksimalkan ruang kabinet dengan sistem redaman hidrolik berkualitas tinggi.',
      features: 'Mekanisme hidrolik soft-close halus\nKapasitas beban heavy-duty\nMaterial anti-karat SUS 304',
      imageUrl: '',
      galleryImages: [],
      videoUrl: '',
      dimensionImageUrl: '',
      mediaList: [],
      svgVisualType: 'swing-tray',
      isFeatured: false,
    });
    setViewMode('form');
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setValidationError(null);

    if (prod.variants && prod.variants.length > 0) {
      setSizeVariants([...prod.variants]);
    } else {
      const widths = prod.cabinetWidths && prod.cabinetWidths.length > 0 ? prod.cabinetWidths : [900];
      const generated: ProductSizeVariant[] = widths.map((w, idx) => ({
        sizeWidth: w,
        sku: idx === 0 ? prod.sku : `${prod.sku}-${w}`,
        price: prod.price,
        originalPrice: prod.originalPrice || prod.price * 1.15,
        stockQuantity: Math.max(1, Math.floor(prod.stockQuantity / widths.length)),
        dimensions: {
          width: prod.minCabinetDims?.width || (w - 40),
          depth: prod.minCabinetDims?.depth || 520,
          height: prod.minCabinetDims?.height || 650,
        }
      }));
      setSizeVariants(generated);
    }

    setFormData({
      name: prod.name,
      sku: prod.sku,
      categoryId: prod.categoryId,
      subcategoryId: prod.subcategoryId,
      series: prod.series,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price * 1.15,
      stockQuantity: prod.stockQuantity,
      inStock: prod.inStock,
      minWidth: prod.minCabinetDims?.width || 860,
      minDepth: prod.minCabinetDims?.depth || 520,
      minHeight: prod.minCabinetDims?.height || 650,
      cabinetWidths: prod.cabinetWidths ? prod.cabinetWidths.join(', ') : '900, 1000',
      openingDirections: prod.openingDirections ? prod.openingDirections.join(', ') : 'Kiri (Left), Kanan (Right)',
      finishOptions: prod.finishOptions ? prod.finishOptions.join(', ') : 'Diamond Grey Titanium',
      material: prod.material,
      loadCapacity: prod.loadCapacity,
      softCloseMechanism: prod.softCloseMechanism,
      warranty: prod.warranty,
      shortDesc: prod.shortDesc,
      fullDesc: prod.fullDesc,
      features: prod.features ? prod.features.join('\n') : '',
      imageUrl: prod.imageUrl || '',
      galleryImages: prod.galleryImages ? [...prod.galleryImages] : [],
      videoUrl: prod.videoUrl || '',
      dimensionImageUrl: prod.dimensionImageUrl || '',
      mediaList: prod.mediaList ? [...prod.mediaList] : [],
      svgVisualType: prod.svgVisualType || 'swing-tray',
      isFeatured: !!prod.isFeatured,
    });
    setViewMode('form');
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `hgd-${Date.now().toString(36)}`,
      sku: `${prod.sku}-COPY`,
      name: `${prod.name} (Duplikat)`,
    };
    onAddProduct(duplicated);
    showToast(`Produk "${duplicated.name}" berhasil diduplikasi!`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      setValidationError('Nama Produk dan SKU wajib diisi.');
      return;
    }

    const openingDirectionsArr = formData.openingDirections
      .split(/[,;]+/)
      .map(d => d.trim())
      .filter(Boolean);

    const finishOptionsArr = formData.finishOptions
      .split(/[,;]+/)
      .map(f => f.trim())
      .filter(Boolean);

    const featuresArr = formData.features
      .split(/\r?\n/)
      .map(f => f.trim())
      .filter(Boolean);

    const finalVariants: ProductSizeVariant[] = sizeVariants.length > 0
      ? sizeVariants
      : [
          {
            sizeWidth: Number(formData.minWidth) || 900,
            sku: formData.sku.trim(),
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice),
            stockQuantity: Number(formData.stockQuantity),
            dimensions: {
              width: Number(formData.minWidth),
              depth: Number(formData.minDepth),
              height: Number(formData.minHeight),
            }
          }
        ];

    const cabinetWidthsArr = finalVariants.map(v => v.sizeWidth);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `hgd-${Date.now().toString(36)}`,
      sku: finalVariants[0]?.sku || formData.sku.trim(),
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      series: formData.series,
      shortDesc: formData.shortDesc.trim(),
      fullDesc: formData.fullDesc.trim(),
      price: finalVariants[0]?.price || Number(formData.price),
      originalPrice: finalVariants[0]?.originalPrice || Number(formData.originalPrice),
      stockQuantity: finalVariants.reduce((sum, v) => sum + v.stockQuantity, 0) || Number(formData.stockQuantity),
      inStock: (finalVariants.reduce((sum, v) => sum + v.stockQuantity, 0) || Number(formData.stockQuantity)) > 0,
      minCabinetDims: {
        width: Number(formData.minWidth),
        depth: Number(formData.minDepth),
        height: Number(formData.minHeight),
      },
      cabinetWidths: cabinetWidthsArr,
      variants: finalVariants,
      openingDirections: openingDirectionsArr.length > 0 ? (openingDirectionsArr as any) : ['Universal'],
      finishOptions: finishOptionsArr.length > 0 ? finishOptionsArr : ['Titanium Grey'],
      material: formData.material.trim(),
      loadCapacity: formData.loadCapacity.trim(),
      softCloseMechanism: formData.softCloseMechanism.trim(),
      warranty: formData.warranty.trim(),
      features: featuresArr.length > 0 ? featuresArr : ['Mekanisme soft-close'],
      imageUrl: formData.imageUrl.trim() || undefined,
      galleryImages: formData.galleryImages && formData.galleryImages.length > 0 ? formData.galleryImages : undefined,
      videoUrl: formData.videoUrl.trim() || undefined,
      dimensionImageUrl: formData.dimensionImageUrl.trim() || undefined,
      mediaList: formData.mediaList && formData.mediaList.length > 0 ? formData.mediaList : undefined,
      svgVisualType: formData.svgVisualType,
      isFeatured: formData.isFeatured,
    };

    if (editingProduct) {
      onUpdateProduct(productPayload);
      showToast(`Produk "${productPayload.name}" berhasil diperbarui!`);
    } else {
      onAddProduct(productPayload);
      showToast(`Produk baru "${productPayload.name}" berhasil diinputkan ke sistem!`);
    }

    setViewMode('list');
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    const matchesSubcat = selectedSubcatFilter === 'all' || p.subcategoryId === selectedSubcatFilter;

    return matchesSearch && matchesCat && matchesSubcat;
  });

  const themeColorClass = currentRole === 'admin'
    ? 'bg-neutral-900 hover:bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/50'
    : 'bg-sky-500 hover:bg-sky-600 text-white';

  const themeToastClass = currentRole === 'admin'
    ? 'bg-neutral-900 text-white border border-[#D4AF37]'
    : 'bg-sky-600 text-white';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div className={`p-3 text-xs font-semibold rounded-lg flex items-center justify-between shadow-lg ${themeToastClass}`}>
          <div className="flex items-center gap-2">
            <CheckCircle weight="fill" className={`w-4 h-4 ${currentRole === 'admin' ? 'text-[#D4AF37]' : 'text-sky-200'}`} />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {/* Sub-tab Switcher: Input Barang vs Pembuatan Kategori */}
      <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setCatalogSubTab('products')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
              catalogSubTab === 'products'
                ? (currentRole === 'admin' ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white font-bold')
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Katalog & Input Barang
          </button>
          <button
            onClick={() => setCatalogSubTab('categories')}
            className={`px-4 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
              catalogSubTab === 'categories'
                ? (currentRole === 'admin' ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white font-bold')
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Pembuatan Kategori & Subkategori
          </button>
        </div>

        {catalogSubTab === 'categories' && (
          <button
            onClick={() => setIsAddCatModalOpen(true)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs ${
              currentRole === 'admin' ? 'bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800' : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
          >
            + Buat Kategori Baru
          </button>
        )}
      </div>

      {catalogSubTab === 'categories' ? (
        /* KELOLA & PEMBUATAN KATEGORI DALAM MENU KATALOG INPUT */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const catProducts = products.filter(p => p.categoryId === cat.id);

              return (
                <div key={cat.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center p-1 shrink-0">
                        {cat.iconUrl ? (
                          <img src={cat.iconUrl} alt={cat.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Package className="w-5 h-5 text-[#C8A15A]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{cat.name}</h4>
                        <p className="text-[11px] text-neutral-500">{cat.tagline}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-neutral-100 text-neutral-700 font-bold">
                      {catProducts.length} Produk
                    </span>
                  </div>

                  {/* Subcategories list */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                      Subkategori ({cat.subcategories.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <span key={sub.id} className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 rounded-md text-[11px] font-medium text-neutral-700">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Add Subcategory Trigger */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    {selectedCatForSubcat === cat.id ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          placeholder="Nama subkategori baru..."
                          value={newSubcatName}
                          onChange={(e) => setNewSubcatName(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs border border-neutral-300 rounded"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (!newSubcatName.trim()) return;
                            const subId = newSubcatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                            if (onAddSubcategory) {
                              onAddSubcategory(cat.id, { id: subId, name: newSubcatName.trim() });
                            }
                            setNewSubcatName('');
                            setSelectedCatForSubcat(null);
                            showToast(`Subkategori "${newSubcatName}" berhasil ditambahkan.`);
                          }}
                          className="px-2.5 py-1 bg-neutral-900 text-[#C8A15A] text-xs font-bold rounded"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setSelectedCatForSubcat(null)}
                          className="px-2 py-1 text-neutral-500 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedCatForSubcat(cat.id)}
                        className="text-xs font-bold text-[#C8A15A] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        + Tambah Subkategori ke {cat.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Buat Kategori Baru */}
          {isAddCatModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
                <div className={`p-4 text-white flex items-center justify-between ${
                  currentRole === 'admin' ? 'bg-neutral-950 border-b border-[#C8A15A]/50' : 'bg-sky-500'
                }`}>
                  <h3 className="font-bold text-sm text-white">Buat Kategori Baru</h3>
                  <button onClick={() => setIsAddCatModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatName.trim()) return;
                    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const newCat: CategoryInfo = {
                      id: slug,
                      name: newCatName.trim(),
                      tagline: newCatTagline.trim() || 'Koleksi Hardware Kabinet',
                      description: newCatDesc.trim() || 'Perangkat keras arsitektural kabinet dapur HIGOLD.',
                      heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80',
                      iconUrl: newCatIconUrl.trim() || undefined,
                      subcategories: initialSubcatName.trim()
                        ? [{ id: initialSubcatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: initialSubcatName.trim() }]
                        : [{ id: `${slug}-utama`, name: 'Produk Utama' }],
                      isCustom: true,
                    };
                    if (onAddCategory) onAddCategory(newCat);
                    setIsAddCatModalOpen(false);
                    setNewCatName('');
                    setNewCatTagline('');
                    setNewCatDesc('');
                    setNewCatIconUrl('');
                    setInitialSubcatName('');
                    showToast(`Kategori "${newCat.name}" dengan icon berhasil dibuat di Katalog Input!`);
                  }}
                  className="p-5 space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Nama Kategori *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pantry Pullout Units"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="Contoh: Penyimpanan Pantry Vertikal Mewah"
                      value={newCatTagline}
                      onChange={(e) => setNewCatTagline(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Deskripsi Singkat</label>
                    <textarea
                      rows={2}
                      placeholder="Keterangan singkat..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  {/* Unggah Gambar Icon Kategori */}
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                    <label className="block text-neutral-800 font-bold">
                      Gambar Icon Kategori (Dapat Diunggah Icon)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-2 border border-dashed border-neutral-400 hover:border-[#C8A15A] bg-white rounded-lg cursor-pointer text-xs font-semibold text-neutral-700 transition-colors">
                        <span>{newCatIconUrl ? 'Ganti File Icon' : 'Pilih File Icon (PNG/SVG/JPG)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadCatIcon}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Atau URL Icon..."
                        value={newCatIconUrl.startsWith('data:') ? '' : newCatIconUrl}
                        onChange={(e) => setNewCatIconUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                    {newCatIconUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-10 h-10 rounded border border-neutral-300 bg-white flex items-center justify-center p-1">
                          <img src={newCatIconUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[11px] text-emerald-700 font-semibold">✓ Icon berhasil dimuat</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Nama Subkategori Pertama</label>
                    <input
                      type="text"
                      placeholder="Contoh: 6 Tier Pantry Basket"
                      value={initialSubcatName}
                      onChange={(e) => setInitialSubcatName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddCatModalOpen(false)}
                      className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className={`px-5 py-2 font-bold rounded-lg cursor-pointer ${
                        currentRole === 'admin' ? 'bg-neutral-900 text-[#C8A15A]' : 'bg-sky-500 hover:bg-sky-600 text-white'
                      }`}
                    >
                      Simpan Kategori
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* DAFTAR & INPUT PRODUK */
        viewMode === 'form' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingProduct ? `Edit Spesifikasi: ${editingProduct.name}` : 'Input Barang / Produk Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                {currentRole === 'admin' ? 'Akses Admin' : 'Akses CS / Support'}: Lengkapi parameter dimensi kabinet, SKU, dan harga produk.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal & Kembali ke Daftar
            </button>
          </div>

          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Higold Diamond Style Swing Tray"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SKU / Kode Barang *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="HGD-SWG-900"
                  className="w-full p-2.5 font-mono bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Category & Subcategory Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Produk *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const subcats = getSubcategoriesForCategory(newCat);
                    setFormData({
                      ...formData,
                      categoryId: newCat,
                      subcategoryId: subcats.length > 0 ? subcats[0].id : 'umum',
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-medium focus:outline-none focus:border-sky-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subkategori / Sub-Produk *</label>
                <select
                  value={formData.subcategoryId}
                  onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-medium focus:outline-none focus:border-sky-500"
                >
                  {getSubcategoriesForCategory(formData.categoryId).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seri Hardware</label>
                <select
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="Diamond">Diamond Series</option>
                  <option value="Shearer">Shearer Series</option>
                  <option value="Arena">Arena Series</option>
                  <option value="Fashion">Fashion Series</option>
                  <option value="Stainless 304">Stainless 304 Series</option>
                </select>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Harga Jual Dasar (Rp) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Harga Coret / MSRP (Rp)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah Total Stok Unit *</label>
                <input
                  type="number"
                  min={0}
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>
            </div>

            {/* Multi-Size Variant & Distinct SKU Specifications Table (Requirement) */}
            <div className="p-4 bg-[#FAF9F6] border border-[#C8A15A]/40 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-[#C8A15A]" />
                    <span>Spesifikasi Ukuran & Nomor SKU Resmi (Beda Ukuran = Beda SKU)</span>
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Setiap barang memiliki ukuran tertentu dan SKU berbeda. Admin / CS dapat menambahkan beberapa ukuran dan SKU yang akan tampil pada modal produk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 bg-neutral-950 text-[#C8A15A] hover:bg-neutral-800 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Ukuran & SKU</span>
                </button>
              </div>

              {/* Table of Variants */}
              <div className="overflow-x-auto border border-neutral-200 rounded-lg bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-2.5">Lebar Kabinet (mm)</th>
                      <th className="px-3 py-2.5">Nomor SKU Resmi</th>
                      <th className="px-3 py-2.5">Harga Jual (Rp)</th>
                      <th className="px-3 py-2.5">Dimensi (L × D × T mm)</th>
                      <th className="px-3 py-2.5">Stok Unit</th>
                      <th className="px-3 py-2.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sizeVariants.map((variant, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={300}
                              step={50}
                              value={variant.sizeWidth}
                              onChange={(e) => handleUpdateVariant(idx, 'sizeWidth', e.target.value)}
                              className="w-20 px-2 py-1 border border-neutral-300 rounded font-bold text-neutral-900 bg-white"
                            />
                            <span className="text-[10px] text-neutral-500 font-mono">mm</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                            placeholder="Contoh: HGD-101002-900"
                            className="w-full min-w-[130px] px-2 py-1 border border-neutral-300 rounded font-mono font-bold text-neutral-900 bg-white"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            step={10000}
                            value={variant.price}
                            onChange={(e) => handleUpdateVariant(idx, 'price', e.target.value)}
                            className="w-28 px-2 py-1 border border-neutral-300 rounded font-semibold text-neutral-900 bg-white"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <input
                              type="number"
                              title="Lebar"
                              placeholder="W"
                              value={variant.dimensions?.width || variant.sizeWidth - 40}
                              onChange={(e) => handleUpdateVariant(idx, 'dim_width', e.target.value)}
                              className="w-14 px-1.5 py-1 border border-neutral-300 rounded text-center bg-white"
                            />
                            <span>×</span>
                            <input
                              type="number"
                              title="Kedalaman"
                              placeholder="D"
                              value={variant.dimensions?.depth || 520}
                              onChange={(e) => handleUpdateVariant(idx, 'dim_depth', e.target.value)}
                              className="w-14 px-1.5 py-1 border border-neutral-300 rounded text-center bg-white"
                            />
                            <span>×</span>
                            <input
                              type="number"
                              title="Tinggi"
                              placeholder="H"
                              value={variant.dimensions?.height || 650}
                              onChange={(e) => handleUpdateVariant(idx, 'dim_height', e.target.value)}
                              className="w-14 px-1.5 py-1 border border-neutral-300 rounded text-center bg-white"
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            value={variant.stockQuantity}
                            onChange={(e) => handleUpdateVariant(idx, 'stockQuantity', e.target.value)}
                            className="w-16 px-2 py-1 border border-neutral-300 rounded text-center font-semibold bg-white"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus varian ukuran ini"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lebar Min. Kabinet (mm)</label>
                <input
                  type="number"
                  value={formData.minWidth}
                  onChange={(e) => setFormData({ ...formData, minWidth: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kedalaman Min. (mm)</label>
                <input
                  type="number"
                  value={formData.minDepth}
                  onChange={(e) => setFormData({ ...formData, minDepth: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tinggi Min. (mm)</label>
                <input
                  type="number"
                  value={formData.minHeight}
                  onChange={(e) => setFormData({ ...formData, minHeight: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
            </div>

            {/* Material & Mechanism */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Material Utama</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kapasitas Beban</label>
                <input
                  type="text"
                  value={formData.loadCapacity}
                  onChange={(e) => setFormData({ ...formData, loadCapacity: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
            </div>

            {/* Modern Architectural Media Uploader: Images, Video & Dimension Drawings */}
            <div className="pt-2">
              <ProductMediaUploader
                imageUrl={formData.imageUrl}
                onChangeImageUrl={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                galleryImages={formData.galleryImages}
                onChangeGalleryImages={(imgs) => setFormData(prev => ({ ...prev, galleryImages: imgs }))}
                videoUrl={formData.videoUrl}
                onChangeVideoUrl={(url) => setFormData(prev => ({ ...prev, videoUrl: url }))}
                dimensionImageUrl={formData.dimensionImageUrl}
                onChangeDimensionImageUrl={(url) => setFormData(prev => ({ ...prev, dimensionImageUrl: url }))}
                mediaList={formData.mediaList}
                onChangeMediaList={(list) => setFormData(prev => ({ ...prev, mediaList: list }))}
                productName={formData.name}
                productSku={formData.sku}
              />
            </div>

            {/* Featured toggle checkbox in form */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between">
              <div>
                <label htmlFor="isFeaturedCheckbox" className="font-bold text-slate-900 text-xs flex items-center gap-1.5 cursor-pointer">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Tampilkan di Produk Unggulan Beranda (Flagship)</span>
                </label>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Produk ini akan tampil di bagian atas Beranda lengkap dengan 3 tombol aksi cepat.
                </p>
              </div>
              <input
                id="isFeaturedCheckbox"
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-5 h-5 text-amber-600 rounded cursor-pointer"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded cursor-pointer font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 rounded font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors ${themeColorClass}`}
              >
                <FloppyDisk weight="bold" className="w-4 h-4" />
                <span>{editingProduct ? 'Simpan Perubahan' : 'Inputkan Barang Sekarang'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* LIST MODE */
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU, nama produk, material..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-slate-800 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none font-medium text-slate-700"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <button
                onClick={handleOpenAddForm}
                className={`px-4 py-2 font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 ${themeColorClass}`}
              >
                <Plus className="w-4 h-4" />
                <span>Input Barang Baru</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Produk & Media</th>
                    <th className="py-3 px-4">SKU / Kategori</th>
                    <th className="py-3 px-4">Harga Jual</th>
                    <th className="py-3 px-4">Stok</th>
                    <th className="py-3 px-4">Unggulan Beranda</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        Tidak ada produk yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/90 transition-colors group">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-display text-sm font-semibold">{p.name}</div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                                {p.galleryImages && p.galleryImages.length > 0 && (
                                  <span className="text-sky-700 bg-sky-50 px-1 py-0.2 border border-sky-200 font-mono">
                                    📷 +{p.galleryImages.length}
                                  </span>
                                )}
                                {p.videoUrl && (
                                  <span className="text-[#9A7B38] bg-[#FAF6ED] px-1 py-0.2 border border-[#C8A15A]/30 flex items-center gap-0.5 font-medium">
                                    <VideoCamera className="w-2.5 h-2.5" /> Video
                                  </span>
                                )}
                                {p.dimensionImageUrl && (
                                  <span className="text-neutral-700 bg-neutral-100 px-1 py-0.2 border border-neutral-300 flex items-center gap-0.5 font-medium">
                                    <Ruler className="w-2.5 h-2.5" /> CAD
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] text-slate-800 block font-semibold">{p.sku}</span>
                          <span className="text-[10px] text-slate-500">{p.categoryId} · {p.subcategoryId}</span>
                          {p.variants && p.variants.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.variants.map((v, vIdx) => (
                                <span key={vIdx} className="text-[9px] font-mono bg-neutral-100 text-neutral-700 px-1 py-0.2 border border-neutral-200 rounded">
                                  {v.sizeWidth}mm: {v.sku}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-neutral-900 font-sans">
                          {formatRupiah(p.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold border ${
                            p.stockQuantity > 5 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}>
                            {p.stockQuantity} Unit
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            className={`px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5 border rounded-lg transition-colors cursor-pointer ${
                              p.isFeatured 
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' 
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                            }`}
                            title={p.isFeatured ? 'Produk aktif di Unggulan Beranda. Klik untuk hapus.' : 'Klik untuk jadikan Produk Unggulan di Beranda'}
                          >
                            <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                            <span>{p.isFeatured ? 'Unggulan' : 'Standar'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {deleteConfirmId === p.id ? (
                            <div className="flex items-center justify-end gap-1.5 animate-slide-up">
                              <span className="text-[11px] text-rose-700 font-semibold">Hapus?</span>
                              <button
                                onClick={() => {
                                  onDeleteProduct(p.id);
                                  setDeleteConfirmId(null);
                                  showToast(`Produk "${p.name}" telah dihapus.`);
                                }}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold cursor-pointer"
                              >
                                Ya
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] cursor-pointer"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditForm(p)}
                                title="Edit Produk & Media"
                                className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 cursor-pointer btn-press"
                              >
                                <PencilSimple className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                title="Duplikasi Produk"
                                className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 cursor-pointer btn-press"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                title="Hapus Produk"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer btn-press"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
