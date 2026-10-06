import React, { useState } from 'react';
import { 
  FileText, Download, Plus, Edit2, Trash2, Save, 
  CheckCircle2, Building, ShieldCheck, MapPin, Phone, 
  Clock, Tag, Eye, ArrowUpRight, AlertCircle,
  Star, ExternalLink
} from 'lucide-react';
import { PdfCatalogItem, CompanyOfficialConfig, Product, CMSAccessRole } from '../../types';
import { formatRupiah } from '../../utils/format';

interface AdminContentTabProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  pdfCatalogs: PdfCatalogItem[];
  onAddPdfCatalog: (item: PdfCatalogItem) => void;
  onUpdatePdfCatalog: (item: PdfCatalogItem) => void;
  onDeletePdfCatalog: (id: string) => void;
  companyConfig: CompanyOfficialConfig;
  onUpdateCompanyConfig: (config: CompanyOfficialConfig) => void;
  currentRole: CMSAccessRole;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  products,
  onUpdateProduct,
  pdfCatalogs,
  onAddPdfCatalog,
  onUpdatePdfCatalog,
  onDeletePdfCatalog,
  companyConfig,
  onUpdateCompanyConfig,
  currentRole,
}) => {
  const [activeSection, setActiveSection] = useState<'pdf' | 'company' | 'featured'>('pdf');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PDF Form modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PdfCatalogItem | null>(null);
  const [pdfFormData, setPdfFormData] = useState({
    title: '',
    filename: '',
    category: 'master' as PdfCatalogItem['category'],
    categoryLabel: 'Master Catalog',
    fileSize: '25.0 MB',
    pageCount: 60,
    year: '2025',
    description: '',
  });

  // Company Config State
  const [configForm, setConfigForm] = useState<CompanyOfficialConfig>({ ...companyConfig });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddPdf = () => {
    setEditingPdf(null);
    setPdfFormData({
      title: '',
      filename: `HIGOLD-Catalog-${new Date().getFullYear()}.pdf`,
      category: 'master',
      categoryLabel: 'Master Catalog',
      fileSize: '15.0 MB',
      pageCount: 50,
      year: new Date().getFullYear().toString(),
      description: '',
    });
    setIsPdfModalOpen(true);
  };

  const handleOpenEditPdf = (pdf: PdfCatalogItem) => {
    setEditingPdf(pdf);
    setPdfFormData({
      title: pdf.title,
      filename: pdf.filename,
      category: pdf.category,
      categoryLabel: pdf.categoryLabel,
      fileSize: pdf.fileSize,
      pageCount: pdf.pageCount,
      year: pdf.year,
      description: pdf.description,
    });
    setIsPdfModalOpen(true);
  };

  const handleSavePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFormData.title.trim()) return;

    if (editingPdf) {
      const updated: PdfCatalogItem = {
        ...editingPdf,
        title: pdfFormData.title.trim(),
        filename: pdfFormData.filename.trim() || 'HIGOLD-Catalog.pdf',
        category: pdfFormData.category,
        categoryLabel: pdfFormData.categoryLabel,
        fileSize: pdfFormData.fileSize,
        pageCount: Number(pdfFormData.pageCount) || 50,
        year: pdfFormData.year,
        description: pdfFormData.description.trim(),
      };
      onUpdatePdfCatalog(updated);
      showToast('Katalog PDF berhasil diperbarui!');
    } else {
      const newItem: PdfCatalogItem = {
        id: `pdf-${Date.now()}`,
        title: pdfFormData.title.trim(),
        filename: pdfFormData.filename.trim() || 'HIGOLD-Catalog.pdf',
        category: pdfFormData.category,
        categoryLabel: pdfFormData.categoryLabel,
        fileSize: pdfFormData.fileSize,
        pageCount: Number(pdfFormData.pageCount) || 50,
        year: pdfFormData.year,
        description: pdfFormData.description.trim(),
        downloadCount: 0,
      };
      onAddPdfCatalog(newItem);
      showToast('Katalog PDF baru berhasil ditambahkan!');
    }

    setIsPdfModalOpen(false);
  };

  const handleSaveCompanyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyConfig(configForm);
    showToast('Informasi perusahaan & kebijakan berhasil disimpan!');
  };

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-4 bg-[#C8A15A] text-neutral-950 text-xs font-bold rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-neutral-950" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-neutral-950 hover:opacity-80">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-600 block">
            PENGATURAN KONTEN & FITUR WEBSITE
          </span>
          <h1 className="text-xl font-bold font-display text-slate-900 mt-1">
            Kelola Konten, Katalog PDF, & Kebijakan Resmi
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Semua perubahan di tab ini langsung diterapkan dan sinkron ke halaman Beranda, Portfolio, dan Kebijakan.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSection('pdf')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'pdf' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katalog PDF ({pdfCatalogs.length})
          </button>
          <button
            onClick={() => setActiveSection('featured')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'featured' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Produk Unggulan ({featuredProducts.length})
          </button>
          <button
            onClick={() => setActiveSection('company')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeSection === 'company' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Info Perusahaan & Bank
          </button>
        </div>
      </div>

      {/* SECTION 1: KELOLA PUSAT UNDUHAN KATALOG PDF */}
      {activeSection === 'pdf' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar E-Katalog PDF Resmi (Pusat Unduhan Portfolio)
              </h2>
              <p className="text-xs text-slate-500">
                Katalog yang aktif di sini tampil pada halaman Portfolio dalam daftar berjajar horizontal.
              </p>
            </div>
            <button
              onClick={handleOpenAddPdf}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Katalog PDF</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {pdfCatalogs.map((pdf) => (
                <div key={pdf.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="w-10 h-12 bg-red-50 text-red-600 border border-red-200 rounded flex flex-col items-center justify-center p-1 shrink-0">
                      <FileText className="w-5 h-5 mb-0.5" />
                      <span className="text-[8px] font-mono font-bold uppercase">PDF</span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-bold uppercase rounded">
                          {pdf.categoryLabel}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {pdf.fileSize} · {pdf.pageCount} Hal · Thn {pdf.year}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          · {pdf.downloadCount}+ Unduhan
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        {pdf.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-1 font-sans">
                        {pdf.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleOpenEditPdf(pdf)}
                      className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Data Katalog"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus katalog "${pdf.title}"?`)) {
                          onDeletePdfCatalog(pdf.id);
                          showToast('Katalog PDF berhasil dihapus.');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Katalog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUK UNGGULAN BERANDA */}
      {activeSection === 'featured' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Kelola Produk Unggulan Beranda (Flagship Showcase)
            </h2>
            <p className="text-xs text-slate-500">
              Produk dengan status Unggulan akan otomatis tampil di bagian atas Beranda dengan kartu eksklusif dan 3 tombol aksi cepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => {
              const isF = !!p.isFeatured;
              return (
                <div 
                  key={p.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isF ? 'bg-amber-50/50 border-amber-300 shadow-xs' : 'bg-white border-slate-200 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{p.sku}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                        isF ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isF ? '★ Unggulan' : 'Standar'}
                      </span>
                    </div>

                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-2">
                      <img src={p.imageUrl || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80'} alt={p.name} className="w-full h-full object-cover" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{formatRupiah(p.price)}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onUpdateProduct({ ...p, isFeatured: !isF });
                        showToast(`Status produk "${p.name}" diperbarui: ${!isF ? 'Aktif di Unggulan' : 'Dinonaktifkan dari Unggulan'}`);
                      }}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isF 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isF ? 'fill-white' : 'text-slate-400'}`} />
                      <span>{isF ? 'Hapus dari Unggulan' : 'Jadikan Unggulan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: PENGATURAN INFORMASI PERUSAHAAN & BANK */}
      {activeSection === 'company' && (
        <form onSubmit={handleSaveCompanyConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-4xl">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Informasi Resmi Perusahaan, Rekening Bank, & Showroom
            </h2>
            <p className="text-xs text-slate-500">
              Data di bawah ini disinkronkan ke footer, halaman kebijakan, banner rekening resmi, dan formulir showroom.
            </p>
          </div>

          {/* Bank BCA Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Rekening Resmi Pembayaran PT Surya Gemilang Sejati</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={configForm.bankName}
                  onChange={(e) => setConfigForm({ ...configForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kantor Cabang (Branch)</label>
                <input
                  type="text"
                  value={configForm.bankBranch}
                  onChange={(e) => setConfigForm({ ...configForm, bankBranch: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Rekening Giro Resmi *</label>
                <input
                  type="text"
                  required
                  value={configForm.bankAccountNumber}
                  onChange={(e) => setConfigForm({ ...configForm, bankAccountNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold text-sky-800 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pemilik Rekening *</label>
                <input
                  type="text"
                  required
                  value={configForm.bankAccountName}
                  onChange={(e) => setConfigForm({ ...configForm, bankAccountName: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Showroom Details */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              <span>Lokasi & Kontak Showroom Experience Center</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap Showroom</label>
                <input
                  type="text"
                  value={configForm.showroomAddress}
                  onChange={(e) => setConfigForm({ ...configForm, showroomAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Kota</label>
                <input
                  type="text"
                  value={configForm.showroomDistrict}
                  onChange={(e) => setConfigForm({ ...configForm, showroomDistrict: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Operasional</label>
                <input
                  type="text"
                  value={configForm.showroomOperatingHours}
                  onChange={(e) => setConfigForm({ ...configForm, showroomOperatingHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon Hotline</label>
                <input
                  type="text"
                  value={configForm.showroomPhone}
                  onChange={(e) => setConfigForm({ ...configForm, showroomPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Resmi</label>
                <input
                  type="text"
                  value={configForm.showroomWhatsapp}
                  onChange={(e) => setConfigForm({ ...configForm, showroomWhatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Member Program Benefit Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>Nilai Benefit Program Member Beranda</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Welcome Voucher (Rp)</label>
                <input
                  type="number"
                  value={configForm.welcomeVoucherAmount}
                  onChange={(e) => setConfigForm({ ...configForm, welcomeVoucherAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diskon Member Retail (%)</label>
                <input
                  type="number"
                  value={configForm.memberDiscountPercent}
                  onChange={(e) => setConfigForm({ ...configForm, memberDiscountPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diskon Mitra Kontraktor Pro (%)</label>
                <input
                  type="number"
                  value={configForm.proDiscountPercent}
                  onChange={(e) => setConfigForm({ ...configForm, proDiscountPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Informasi</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal Add / Edit PDF */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">
                {editingPdf ? 'Edit Data E-Katalog PDF' : 'Tambah E-Katalog PDF Baru'}
              </h3>
              <button onClick={() => setIsPdfModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSavePdf} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul E-Katalog *</label>
                <input
                  type="text"
                  required
                  value={pdfFormData.title}
                  onChange={(e) => setPdfFormData({ ...pdfFormData, title: e.target.value })}
                  placeholder="Contoh: Higold Master Kitchen Catalog 2025/2026"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Dokumen</label>
                  <select
                    value={pdfFormData.category}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      const labels: Record<string, string> = {
                        master: 'Master Catalog',
                        technical: 'Gambar Kerja CAD',
                        sink: 'Sink & Faucet',
                        manual: 'Buku Panduan',
                      };
                      setPdfFormData({
                        ...pdfFormData,
                        category: val,
                        categoryLabel: labels[val] || 'E-Katalog',
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                  >
                    <option value="master">Master Catalog</option>
                    <option value="technical">Gambar Kerja CAD</option>
                    <option value="sink">Sink & Faucet</option>
                    <option value="manual">Buku Panduan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Terbit</label>
                  <input
                    type="text"
                    value={pdfFormData.year}
                    onChange={(e) => setPdfFormData({ ...pdfFormData, year: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ukuran File (cth: 48.5 MB)</label>
                  <input
                    type="text"
                    value={pdfFormData.fileSize}
                    onChange={(e) => setPdfFormData({ ...pdfFormData, fileSize: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Halaman</label>
                  <input
                    type="number"
                    value={pdfFormData.pageCount}
                    onChange={(e) => setPdfFormData({ ...pdfFormData, pageCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={pdfFormData.description}
                  onChange={(e) => setPdfFormData({ ...pdfFormData, description: e.target.value })}
                  placeholder="Katalog komprehensif berisi seluruh lini hardware kabinet dapur arsitektural..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Simpan Katalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
