import React, { useState } from 'react';
import { 
  FolderTree, Plus, Layers, CheckCircle2, 
  Trash2, Edit2, ShieldAlert, FolderPlus, Upload, Image as ImageIcon, X
} from 'lucide-react';
import { CategoryInfo, SubcategoryId, CMSAccessRole, Product } from '../../types';

interface AdminCategoriesTabProps {
  categories: CategoryInfo[];
  products: Product[];
  onAddCategory: (category: CategoryInfo) => void;
  onUpdateCategory?: (category: CategoryInfo) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onAddSubcategory: (categoryId: string, subcategory: { id: SubcategoryId; name: string }) => void;
  currentRole: CMSAccessRole;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubcategory,
  currentRole,
}) => {
  const isRoleAdmin = currentRole === 'admin';
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [selectedCatForSubcat, setSelectedCatForSubcat] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Category State
  const [catName, setCatName] = useState('');
  const [catTagline, setCatTagline] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catHeroImg, setCatHeroImg] = useState('');
  const [catIconUrl, setCatIconUrl] = useState('');
  const [catIconType, setCatIconType] = useState('corner-units');
  const [initialSubcatName, setInitialSubcatName] = useState('');

  // Editing Category State
  const [editName, setEditName] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editHeroImg, setEditHeroImg] = useState('');
  const [editIconUrl, setEditIconUrl] = useState('');

  // New Subcategory State
  const [subcatName, setSubcatName] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadIcon = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isEditing) {
        setEditIconUrl(result);
      } else {
        setCatIconUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openEditModal = (cat: CategoryInfo) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditTagline(cat.tagline || '');
    setEditDesc(cat.description || '');
    setEditHeroImg(cat.heroImage || '');
    setEditIconUrl(cat.iconUrl || '');
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editName.trim()) {
      alert('Nama Kategori wajib diisi.');
      return;
    }

    const updatedCategory: CategoryInfo = {
      ...editingCategory,
      name: editName.trim(),
      tagline: editTagline.trim(),
      description: editDesc.trim(),
      heroImage: editHeroImg.trim() || editingCategory.heroImage,
      iconUrl: editIconUrl.trim() || undefined,
    };

    if (onUpdateCategory) {
      onUpdateCategory(updatedCategory);
    }
    setEditingCategory(null);
    showToast(`Kategori "${updatedCategory.name}" berhasil diperbarui dengan icon baru!`);
  };

  const handleDeleteCat = (catId: string, catNameStr: string) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${catNameStr}"?`)) {
      if (onDeleteCategory) {
        onDeleteCategory(catId);
        showToast(`Kategori "${catNameStr}" berhasil dihapus.`);
      }
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('Nama Kategori wajib diisi.');
      return;
    }

    const slug = catName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Parse subcategories from comma-separated input or single
    const rawSubcats = initialSubcatName
      .split(/[,;\n]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const generatedSubcats = rawSubcats.length > 0
      ? rawSubcats.map((name, idx) => ({
          id: `${slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || idx}`,
          name,
        }))
      : [{ id: `${slug}-utama`, name: 'Produk Utama' }];

    const newCategory: CategoryInfo = {
      id: slug,
      name: catName.trim(),
      tagline: catTagline.trim() || 'Solusi Hardware Interior Premium',
      description: catDesc.trim() || 'Inovasi hardware dapur dan kabinet dengan standar kualitas terbaik.',
      heroImage: catHeroImg.trim() || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80',
      iconUrl: catIconUrl.trim() || undefined,
      iconType: catIconType,
      subcategories: generatedSubcats,
      isCustom: true,
    };

    onAddCategory(newCategory);
    setIsAddCatModalOpen(false);
    setCatName('');
    setCatTagline('');
    setCatDesc('');
    setCatHeroImg('');
    setCatIconUrl('');
    setInitialSubcatName('');
    showToast(`Kategori baru "${newCategory.name}" dengan icon berhasil dibuat!`);
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatForSubcat || !subcatName.trim()) return;

    const slug = subcatName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    onAddSubcategory(selectedCatForSubcat, {
      id: slug,
      name: subcatName.trim(),
    });

    const targetCat = categories.find(c => c.id === selectedCatForSubcat);
    setSelectedCatForSubcat(null);
    setSubcatName('');
    showToast(`Subkategori baru "${subcatName}" berhasil ditambahkan ke kategori ${targetCat?.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {/* Header Info Banner */}
      <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isRoleAdmin
          ? 'bg-neutral-900 border-[#C8A15A]/40 text-neutral-100 shadow-sm'
          : 'bg-sky-50 border-sky-200 text-sky-950 shadow-xs'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
            isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white'
          }`}>
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold ${isRoleAdmin ? 'text-white' : 'text-neutral-900'}`}>
                Manajemen Kategori & Icon Hardware
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isRoleAdmin
                  ? 'bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40'
                  : 'bg-sky-100 text-sky-700 border border-sky-300'
              }`}>
                {isRoleAdmin ? 'Admin Emas' : 'CS Biru Langit'}
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${
              isRoleAdmin ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Kelola kategori kabinet, unggah icon gambar (PNG, SVG, JPG) untuk icon kategori, dan atur subkategori produk.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCatModalOpen(true)}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 ${
            isRoleAdmin
              ? 'bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950'
              : 'bg-sky-600 hover:bg-sky-700 text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Buat Kategori Baru</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const categoryProducts = products.filter(p => p.categoryId === cat.id);

          return (
            <div 
              key={cat.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shrink-0 relative group">
                      {cat.iconUrl ? (
                        <img 
                          src={cat.iconUrl} 
                          alt={cat.name} 
                          className="max-w-full max-h-full object-contain" 
                        />
                      ) : (
                        <FolderTree className={`w-7 h-7 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-500'}`} />
                      )}
                      {cat.iconUrl && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Custom Icon Aktif" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          ID: {cat.id}
                        </span>
                        {cat.iconUrl && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                            Icon Gambar
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{cat.name}</h3>
                      <p className={`text-xs font-medium ${isRoleAdmin ? 'text-[#9A7B38]' : 'text-sky-600'}`}>{cat.tagline}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full shrink-0">
                    {categoryProducts.length} Produk
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {cat.description}
                </p>

                {/* Subcategories List */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Subkategori / Sub-Produk ({cat.subcategories.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCatForSubcat(cat.id)}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Sub</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => {
                      const subProductCount = categoryProducts.filter(p => p.subcategoryId === sub.id).length;
                      return (
                        <span 
                          key={sub.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded text-[11px]"
                        >
                          <span className="font-medium">{sub.name}</span>
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1 rounded-full font-mono">
                            {subProductCount}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer action buttons: Edit Kategori & Ganti Icon, Hapus */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {cat.isCustom ? 'Kategori Khusus (Custom)' : 'Kategori Utama Sistem'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Edit & Ganti Icon</span>
                  </button>

                  {cat.isCustom && onDeleteCategory && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCat(cat.id, cat.name)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Category */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg p-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Buat Kategori Produk Baru</h3>
              <button 
                type="button"
                onClick={() => setIsAddCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Kategori baru akan langsung dapat dipilih saat input produk, navigasi, dan tampil di katalog.
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Contoh: Smart Kitchen Automation"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tagline / Slogan Kategori
                </label>
                <input
                  type="text"
                  value={catTagline}
                  onChange={(e) => setCatTagline(e.target.value)}
                  placeholder="Contoh: Otomatisasi Motorik & Sensor Dapur Pintar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Lengkap Kategori
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Penjelasan fungsi kategori untuk pengunjung website..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subkategori (Pisahkan dengan koma atau baris baru)
                </label>
                <input
                  type="text"
                  value={initialSubcatName}
                  onChange={(e) => setInitialSubcatName(e.target.value)}
                  placeholder="Contoh: Swing Trays, Magic Corner, Lazy Susan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Subkategori ini akan muncul sebagai kapsul tombol di bawah kategori pada halaman produk.
                </span>
              </div>

              {/* Unggah Icon Kategori */}
              <div className="space-y-2 p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl">
                <label className="block font-semibold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>Unggah Gambar Icon Kategori</span>
                  </span>
                  {catIconUrl && (
                    <button
                      type="button"
                      onClick={() => setCatIconUrl('')}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                    >
                      Hapus Icon
                    </button>
                  )}
                </label>
                <p className="text-[11px] text-slate-600">
                  Pilih file gambar (PNG, SVG, JPG, WebP) dari komputer Anda atau masukkan URL gambar icon. Gambar ini akan menjadi icon kategori resmi di website.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <label className="p-3 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-lg flex items-center justify-center gap-2 cursor-pointer bg-white transition-colors text-center">
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span className="text-xs text-sky-900 font-bold truncate">
                      {catIconUrl ? 'Ganti File Icon' : 'Pilih Gambar Icon'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadIcon(e, false)}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={catIconUrl.startsWith('data:') ? '' : catIconUrl}
                    onChange={(e) => setCatIconUrl(e.target.value)}
                    placeholder="Atau Tempel URL Gambar..."
                    className="p-2.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                  />
                </div>

                {catIconUrl && (
                  <div className="flex items-center gap-3 pt-2 border-t border-sky-200">
                    <div className="w-14 h-14 rounded-lg border border-sky-300 bg-white flex items-center justify-center p-2 shrink-0 shadow-2xs">
                      <img src={catIconUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Gambar Icon Berhasil Dimuat</span>
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Icon ini akan tampil di kartu kategori produk dan filter katalog.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Hero Banner Gambar (Opsional)
                </label>
                <input
                  type="url"
                  value={catHeroImg}
                  onChange={(e) => setCatHeroImg(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Kategori Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Category & Upload Icon */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg p-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Kategori & Unggah Icon</h3>
                <p className="text-xs text-slate-500">ID Kategori: <strong className="font-mono text-slate-800">{editingCategory.id}</strong></p>
              </div>
              <button 
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} className="space-y-4 text-xs mt-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tagline / Slogan Kategori
                </label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Unggah / Ganti Gambar Icon Kategori */}
              <div className={`space-y-2 p-3.5 rounded-xl border ${
                isRoleAdmin ? 'bg-amber-50/70 border-amber-200' : 'bg-sky-50/70 border-sky-200'
              }`}>
                <label className="block font-semibold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className={`w-4 h-4 ${isRoleAdmin ? 'text-amber-700' : 'text-sky-600'}`} />
                    <span>Gambar Icon Kategori (Upload / Ganti Icon)</span>
                  </span>
                  {editIconUrl && (
                    <button
                      type="button"
                      onClick={() => setEditIconUrl('')}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                    >
                      Hapus Icon
                    </button>
                  )}
                </label>
                <p className="text-[11px] text-slate-600">
                  Unggah file gambar baru (PNG, SVG, JPG, WebP) untuk menggantikan gambar icon kategori ini di website.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <label className={`p-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer bg-white transition-colors text-center ${
                    isRoleAdmin ? 'border-amber-400 hover:border-amber-600' : 'border-sky-300 hover:border-sky-500'
                  }`}>
                    <Upload className={`w-4 h-4 ${isRoleAdmin ? 'text-amber-700' : 'text-sky-600'}`} />
                    <span className={`text-xs font-bold truncate ${isRoleAdmin ? 'text-amber-900' : 'text-sky-900'}`}>
                      {editIconUrl ? 'Pilih Gambar Lain' : 'Pilih File Icon'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadIcon(e, true)}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    value={editIconUrl.startsWith('data:') ? '' : editIconUrl}
                    onChange={(e) => setEditIconUrl(e.target.value)}
                    placeholder="Atau Masukkan URL Gambar..."
                    className={`p-2.5 bg-white border border-slate-300 rounded text-xs focus:outline-none font-mono text-[11px] ${
                      isRoleAdmin ? 'focus:border-amber-500' : 'focus:border-sky-500'
                    }`}
                  />
                </div>

                {editIconUrl && (
                  <div className={`flex items-center gap-3 pt-2 border-t ${
                    isRoleAdmin ? 'border-amber-200' : 'border-sky-200'
                  }`}>
                    <div className={`w-14 h-14 rounded-lg border bg-white flex items-center justify-center p-2 shrink-0 shadow-2xs ${
                      isRoleAdmin ? 'border-amber-300' : 'border-sky-300'
                    }`}>
                      <img src={editIconUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Icon Gambar Aktif</span>
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Gambar icon ini akan tampil pada kartu kategori di halaman katalog produk.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Hero Banner Gambar (Opsional)
                </label>
                <input
                  type="url"
                  value={editHeroImg}
                  onChange={(e) => setEditHeroImg(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded font-bold cursor-pointer shadow-xs ${
                    isRoleAdmin ? 'bg-[#C8A15A] hover:bg-[#B8924B]' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  Simpan Perubahan & Icon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Subcategory to specific category */}
      {selectedCatForSubcat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-sm p-6 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-1">Tambah Subkategori Baru</h3>
            <p className="text-xs text-slate-500 mb-4">
              Kategori target: <strong>{categories.find(c => c.id === selectedCatForSubcat)?.name}</strong>
            </p>

            <form onSubmit={handleCreateSubcategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Subkategori *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={subcatName}
                  onChange={(e) => setSubcatName(e.target.value)}
                  placeholder="Contoh: Pull Down Upper Cabinet Rack"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCatForSubcat(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold cursor-pointer shadow-xs"
                >
                  Tambah Subkategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
