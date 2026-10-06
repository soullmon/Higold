import React, { useState } from 'react';
import { 
  FileText, Upload, Image as ImageIcon, CheckCircle, 
  Trash, Plus, Eye, Download, Buildings, Sparkle,
  VideoCamera, FilmStrip, Play
} from '@phosphor-icons/react';
import { PdfCatalogItem, CompanyOfficialConfig, CMSAccessRole } from '../../types';

interface AdminDesignTabProps {
  pdfCatalogs: PdfCatalogItem[];
  onAddPdfCatalog: (item: PdfCatalogItem) => void;
  onUpdatePdfCatalog: (item: PdfCatalogItem) => void;
  onDeletePdfCatalog: (id: string) => void;
  companyConfig: CompanyOfficialConfig;
  onUpdateCompanyConfig: (config: CompanyOfficialConfig) => void;
  currentRole: CMSAccessRole;
}

interface PartnerItem {
  id: string;
  name: string;
  type: string;
  city: string;
  iconUrl?: string;
}

export interface HeroSlideItem {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  tag: string;
}

export const INITIAL_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 1,
    badge: 'HIGOLD GLOBAL HEADQUARTERS',
    title: 'Pusat Inovasi Perangkat Keras Arsitektural Dunia',
    subtitle: 'Higold Global Headquarters & Smart Robotic Center. Rekayasa presisi berstandar Jerman dengan uji ketahanan 100.000 siklus bebas hambatan.',
    ctaText: 'Jelajahi Produk Kami',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
    tag: 'Gedung Pusat Higold',
  },
  {
    id: 2,
    badge: 'SMART ROBOTIC FACTORY & EXPERIENCE CENTER',
    title: 'Presisi Rekayasa Robotik & Ergonomi Dapur Mewah',
    subtitle: 'Memadukan material aviation grade aluminum, teknologi nano coating bionik lotus leaf, dan sistem peredam hidrolik soft-close tak bersuara.',
    ctaText: 'Kunjungi Showroom Pluit',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1800&q=85',
    tag: 'Higold Experience Center',
  },
  {
    id: 3,
    badge: 'REDDOT BEST OF THE BEST AWARD',
    title: 'Koleksi Flagship Dapur Kontemporer Kelas Dunia',
    subtitle: 'Dipercaya oleh ribuan kontraktor, arsitek, dan pemilik hunian prestisius di lebih dari 86 negara di seluruh dunia.',
    ctaText: 'Buka Halaman Produk',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    tag: 'Higold Flagship Kitchen',
  },
];

export interface PortfolioVideoAdminItem {
  id: string;
  title: string;
  category: 'instalasi' | 'uji-beban' | 'before-after' | 'workshop';
  categoryLabel: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  technicianName: string;
  projectLocation: string;
  description: string;
  keySteps: string[];
}

export const INITIAL_PORTFOLIO_VIDEOS: PortfolioVideoAdminItem[] = [
  {
    id: 'vid-1',
    title: 'Instalasi Presisi Diamond Swing Tray 900mm pada Kabinet Sudut L',
    category: 'instalasi',
    categoryLabel: 'Hardware Instalasi',
    duration: '03:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    technicianName: 'Agus Santoso (Higold Fitting Specialist)',
    projectLocation: 'Residensi Privat, Kebayoran Baru, Jakarta',
    description: 'Pemasangan tiang sentral SUS 304, penyetelan level tray atas-bawah, dan kalibrasi damper hidrolik soft-close.',
    keySteps: [
      'Pengeboran dasar kabinet dengan template toleransi 1:1',
      'Pemasangan braket tiang sentral stainless steel SUS 304',
      'Penyetelan ketinggian tray (rentang vertikal 50mm)',
      'Uji kelancaran ayunan sudut dan redaman soft-close'
    ]
  },
  {
    id: 'vid-2',
    title: 'Perakitan Rak Pantry Tall Larder 6 Susun dengan Rel Sinkronisasi Beban Berat',
    category: 'instalasi',
    categoryLabel: 'Hardware Instalasi',
    duration: '04:20',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    technicianName: 'Rudi Hartono (Senior Field Technician)',
    projectLocation: 'Penthouse Dharmawangsa, Jakarta Selatan',
    description: 'Pemasangan unit pantry tinggi 2 meter dengan rel tandem atas-bawah tersinkronisasi daya tampung beban 70kg dinamis.',
    keySteps: [
      'Pemasangan rel tandem dasar heavy-duty',
      'Penyelarasan vertikal rel pemandu atas kabinet',
      'Penguncian rangka mekanis & klip tray keranjang',
      'Uji beban dinamis 70kg dan kelancaran tarikan'
    ]
  },
  {
    id: 'vid-3',
    title: 'Uji Ketahanan & Daya Angkut Beban 70kg Seri Shearer Basket Dapur',
    category: 'uji-beban',
    categoryLabel: 'Quality Control',
    duration: '02:50',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595514535415-dae92493e87d?auto=format&fit=crop&w=800&q=80',
    technicianName: 'Tim Quality Control Higold Workshop',
    projectLocation: 'Pusat Rekayasa & Showroom Pluit, Jakarta Utara',
    description: 'Uji defleksi pelat aluminium aerospace dan tes siklus buka tutup 100.000 kali standar sertifikasi LGA Jerman.',
    keySteps: [
      'Penempatan pemberat kalibrasi 70kg merata',
      'Pengukuran defleksi rel slide saat ditarik maksimal',
      'Pengecekan integritas peredam hidrolik soft-close',
      'Inspeksi pelapis nano titanium anti gores'
    ]
  }
];

const DEFAULT_PARTNERS: PartnerItem[] = [
  { id: 'p-1', name: 'Karsa Kitchen Studio', type: 'Kitchen Builder', city: 'Jakarta' },
  { id: 'p-2', name: 'Lippo Karawaci Homes', type: 'Developer', city: 'Tangerang' },
  { id: 'p-3', name: 'Pakubuwono Residence', type: 'Luxury Apartment', city: 'Jakarta Selatan' },
  { id: 'p-4', name: 'Ciputra World Interior', type: 'Commercial Partner', city: 'Surabaya' },
  { id: 'p-5', name: 'Graha Padma Architect', type: 'Architect Studio', city: 'Semarang' },
  { id: 'p-6', name: 'Balaraja Kitchen Mitra', type: 'Contractor Partner', city: 'Banten' },
];

export const AdminDesignTab: React.FC<AdminDesignTabProps> = ({
  pdfCatalogs,
  onAddPdfCatalog,
  onUpdatePdfCatalog,
  onDeletePdfCatalog,
  companyConfig,
  onUpdateCompanyConfig,
  currentRole,
}) => {
  const [activeSection, setActiveSection] = useState<'banner' | 'pdf' | 'portfolio' | 'partners'>('banner');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Banner settings state: 3 Hero Slides corresponding to Homepage
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(() => {
    try {
      const saved = localStorage.getItem('higold_homepage_hero_slides');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_HERO_SLIDES;
  });
  const [selectedSlideIdx, setSelectedSlideIdx] = useState<number>(0);

  // Portfolio Videos State
  const [portfolioVideos, setPortfolioVideos] = useState<PortfolioVideoAdminItem[]>(() => {
    try {
      const saved = localStorage.getItem('higold_portfolio_videos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PORTFOLIO_VIDEOS;
  });

  // Video upload form state
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState<'instalasi' | 'uji-beban' | 'before-after' | 'workshop'>('instalasi');
  const [newVideoDuration, setNewVideoDuration] = useState('03:30');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoThumbnail, setNewVideoThumbnail] = useState('');
  const [newVideoTechnician, setNewVideoTechnician] = useState('');
  const [newVideoLocation, setNewVideoLocation] = useState('');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoSteps, setNewVideoSteps] = useState('');

  // Partner Icons state (Admin right for Web Design)
  const [partners, setPartners] = useState<PartnerItem[]>(() => {
    try {
      const saved = localStorage.getItem('higold_partner_icons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PARTNERS;
  });

  const [partnerName, setPartnerName] = useState('');
  const [partnerType, setPartnerType] = useState('Kitchen Builder');
  const [partnerCity, setPartnerCity] = useState('');
  const [partnerIconUrl, setPartnerIconUrl] = useState('');

  const handleUploadSlideImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...heroSlides];
      updated[selectedSlideIdx] = {
        ...updated[selectedSlideIdx],
        imageUrl: reader.result as string,
      };
      setHeroSlides(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHeroSlides = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('higold_homepage_hero_slides', JSON.stringify(heroSlides));
      window.dispatchEvent(new Event('higold_hero_slides_updated'));
    } catch {}
    showToast('3 Banner Header Hero berhasil diperbarui dan disimpan!');
  };

  const handleUploadVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewVideoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadVideoThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewVideoThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) {
      alert('Judul video dan file/URL video wajib diisi.');
      return;
    }
    const catLabels: Record<string, string> = {
      'instalasi': 'Hardware Instalasi',
      'uji-beban': 'Quality Control (QC)',
      'before-after': 'Before & After Kitchen',
      'workshop': 'Pabrik & Workshop',
    };
    const keyStepsArr = newVideoSteps
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);

    const newVideo: PortfolioVideoAdminItem = {
      id: `vid-${Date.now().toString(36)}`,
      title: newVideoTitle.trim(),
      category: newVideoCategory,
      categoryLabel: catLabels[newVideoCategory] || 'Portofolio Higold',
      duration: newVideoDuration.trim() || '03:00',
      videoUrl: newVideoUrl.trim(),
      thumbnailUrl: newVideoThumbnail.trim() || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      technicianName: newVideoTechnician.trim() || 'Tim Spesialis Higold',
      projectLocation: newVideoLocation.trim() || 'Jakarta, Indonesia',
      description: newVideoDesc.trim() || 'Dokumentasi teknis pengerjaan hardware kabinet dapur arsitektural Higold.',
      keySteps: keyStepsArr.length > 0 ? keyStepsArr : ['Pengeboran presisi', 'Pemasangan rel', 'Kalibrasi damper soft-close'],
    };

    const updated = [newVideo, ...portfolioVideos];
    setPortfolioVideos(updated);
    try {
      localStorage.setItem('higold_portfolio_videos', JSON.stringify(updated));
      window.dispatchEvent(new Event('higold_portfolio_videos_updated'));
    } catch {}

    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoThumbnail('');
    setNewVideoTechnician('');
    setNewVideoLocation('');
    setNewVideoDesc('');
    setNewVideoSteps('');
    showToast(`Video portofolio "${newVideo.title}" berhasil diunggah!`);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = portfolioVideos.filter(v => v.id !== id);
    setPortfolioVideos(updated);
    try {
      localStorage.setItem('higold_portfolio_videos', JSON.stringify(updated));
      window.dispatchEvent(new Event('higold_portfolio_videos_updated'));
    } catch {}
    showToast('Video portofolio berhasil dihapus.');
  };

  const handleResetVideos = () => {
    setPortfolioVideos(INITIAL_PORTFOLIO_VIDEOS);
    try {
      localStorage.setItem('higold_portfolio_videos', JSON.stringify(INITIAL_PORTFOLIO_VIDEOS));
      window.dispatchEvent(new Event('higold_portfolio_videos_updated'));
    } catch {}
    showToast('Video portofolio direset ke video bawaan resmi.');
  };

  const handleUploadPartnerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPartnerIconUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) {
      alert('Nama perusahaan / studio mitra wajib diisi');
      return;
    }
    const newP: PartnerItem = {
      id: `partner_${Date.now()}`,
      name: partnerName.trim(),
      type: partnerType,
      city: partnerCity.trim() || 'Indonesia',
      iconUrl: partnerIconUrl || undefined,
    };
    const updated = [newP, ...partners];
    setPartners(updated);
    try {
      localStorage.setItem('higold_partner_icons', JSON.stringify(updated));
      window.dispatchEvent(new Event('higold_partners_updated'));
    } catch {}
    setPartnerName('');
    setPartnerCity('');
    setPartnerIconUrl('');
    showToast(`Logo mitra "${newP.name}" berhasil ditambahkan ke beranda website!`);
  };

  const handleDeletePartner = (id: string) => {
    const updated = partners.filter(p => p.id !== id);
    setPartners(updated);
    try {
      localStorage.setItem('higold_partner_icons', JSON.stringify(updated));
      window.dispatchEvent(new Event('higold_partners_updated'));
    } catch {}
    showToast('Logo mitra berhasil dihapus dari beranda.');
  };

  const handleResetPartners = () => {
    setPartners(DEFAULT_PARTNERS);
    try {
      localStorage.setItem('higold_partner_icons', JSON.stringify(DEFAULT_PARTNERS));
      window.dispatchEvent(new Event('higold_partners_updated'));
    } catch {}
    showToast('Daftar mitra berhasil direset ke bawaan.');
  };

  // New PDF Form state
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfCategory, setNewPdfCategory] = useState<'master' | 'technical' | 'sink' | 'manual'>('master');
  const [newPdfPages, setNewPdfPages] = useState(48);
  const [newPdfSize, setNewPdfSize] = useState('14.2 MB');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreatePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdfTitle.trim()) {
      alert('Judul e-katalog PDF wajib diisi.');
      return;
    }

    const created: PdfCatalogItem = {
      id: `pdf-${Date.now().toString(36)}`,
      title: newPdfTitle.trim(),
      filename: `HIGOLD_${newPdfTitle.trim().replace(/\s+/g, '_')}_2024.pdf`,
      category: newPdfCategory,
      categoryLabel: newPdfCategory.toUpperCase(),
      fileSize: newPdfSize,
      pageCount: newPdfPages,
      year: '2024/2025',
      description: 'E-Katalog resmi spesifikasi hardware arsitektural kabinet dapur HIGOLD.',
      downloadCount: 1,
    };

    onAddPdfCatalog(created);
    setNewPdfTitle('');
    showToast(`Katalog PDF "${created.title}" berhasil diunggah.`);
  };

  const isRoleAdmin = currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 text-white text-xs font-semibold rounded-lg shadow-xl flex items-center gap-2 ${
          isRoleAdmin ? 'bg-neutral-900 border border-[#C8A15A]' : 'bg-sky-500'
        }`}>
          <CheckCircle className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-white'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isRoleAdmin 
          ? 'bg-neutral-900 border-[#C8A15A]/40 text-neutral-100 shadow-sm' 
          : 'bg-sky-50 border-sky-200 text-sky-950 shadow-xs'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
            isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white'
          }`}>
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold ${isRoleAdmin ? 'text-white' : 'text-neutral-900'}`}>
                Desain Website, Banner Header & Katalog PDF
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isRoleAdmin 
                  ? 'bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40' 
                  : 'bg-sky-100 text-sky-800'
              }`}>
                {isRoleAdmin ? 'Admin Emas' : 'CS Biru Langit'}
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${
              isRoleAdmin ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Kelola tampilan banner header hero, nama produk banner yang tampil di beranda, upload file katalog PDF arsitektural, dan materi konten halaman portofolio HIGOLD.
            </p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-lg border text-xs ${
          isRoleAdmin ? 'bg-neutral-950/40 border-neutral-800' : 'bg-white border-sky-200 shadow-2xs'
        }`}>
          <button
            onClick={() => setActiveSection('banner')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeSection === 'banner'
                ? (isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-600 text-white font-bold shadow-xs')
                : (isRoleAdmin ? 'text-neutral-300 hover:text-white' : 'text-sky-700 hover:text-sky-950')
            }`}
          >
            Banner Header
          </button>
          <button
            onClick={() => setActiveSection('pdf')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeSection === 'pdf'
                ? (isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-600 text-white font-bold shadow-xs')
                : (isRoleAdmin ? 'text-neutral-300 hover:text-white' : 'text-sky-700 hover:text-sky-950')
            }`}
          >
            Katalog PDF
          </button>
          <button
            onClick={() => setActiveSection('portfolio')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeSection === 'portfolio'
                ? (isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-600 text-white font-bold shadow-xs')
                : (isRoleAdmin ? 'text-neutral-300 hover:text-white' : 'text-sky-700 hover:text-sky-950')
            }`}
          >
            Unggahan Video Portofolio
          </button>
          <button
            onClick={() => setActiveSection('partners')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeSection === 'partners'
                ? (isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-600 text-white font-bold shadow-xs')
                : (isRoleAdmin ? 'text-neutral-300 hover:text-white' : 'text-sky-700 hover:text-sky-950')
            }`}
          >
            Logo Mitra & Proyek
          </button>
        </div>
      </div>

      {/* 1. SECTION: BANNER HEADER (3 GAMBAR SESUAI HALAMAN UTAMA) */}
      {activeSection === 'banner' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">
                Pengaturan 3 Slide Banner Header Beranda
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Setiap slide dapat diunggah gambarnya dan teks disesuaikan dengan 3 slide utama di halaman beranda.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSlideIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSlideIdx === idx
                      ? (isRoleAdmin ? 'bg-neutral-950 text-[#C8A15A] shadow-xs' : 'bg-sky-600 text-white shadow-xs')
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Slide #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveHeroSlides} className="space-y-4 max-w-3xl text-xs">
            {/* Slide Editor */}
            {heroSlides[selectedSlideIdx] && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">
                      Badge Atas (Header Tag):
                    </label>
                    <input
                      type="text"
                      value={heroSlides[selectedSlideIdx].badge}
                      onChange={(e) => {
                        const updated = [...heroSlides];
                        updated[selectedSlideIdx] = { ...updated[selectedSlideIdx], badge: e.target.value };
                        setHeroSlides(updated);
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">
                      Tag / Label Lokasi:
                    </label>
                    <input
                      type="text"
                      value={heroSlides[selectedSlideIdx].tag}
                      onChange={(e) => {
                        const updated = [...heroSlides];
                        updated[selectedSlideIdx] = { ...updated[selectedSlideIdx], tag: e.target.value };
                        setHeroSlides(updated);
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Judul Utama Slide #{selectedSlideIdx + 1}:
                  </label>
                  <input
                    type="text"
                    value={heroSlides[selectedSlideIdx].title}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[selectedSlideIdx] = { ...updated[selectedSlideIdx], title: e.target.value };
                      setHeroSlides(updated);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Deskripsi / Subtitle:
                  </label>
                  <textarea
                    rows={2}
                    value={heroSlides[selectedSlideIdx].subtitle}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[selectedSlideIdx] = { ...updated[selectedSlideIdx], subtitle: e.target.value };
                      setHeroSlides(updated);
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>

                {/* Image Upload for Header Slide */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <label className="block text-neutral-800 font-bold">
                    Unggah Gambar Banner Slide #{selectedSlideIdx + 1}:
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadSlideImage}
                      className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 cursor-pointer"
                    />
                    <span className="text-neutral-400 text-xs">atau masukkan URL gambar:</span>
                    <input
                      type="url"
                      value={heroSlides[selectedSlideIdx].imageUrl}
                      onChange={(e) => {
                        const updated = [...heroSlides];
                        updated[selectedSlideIdx] = { ...updated[selectedSlideIdx], imageUrl: e.target.value };
                        setHeroSlides(updated);
                      }}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 border border-neutral-300 rounded-lg font-mono text-[11px] bg-white"
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Pratinjau Slide #{selectedSlideIdx + 1} Beranda:
                  </label>
                  <div className="relative w-full aspect-21/9 max-h-[220px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                    <img 
                      src={heroSlides[selectedSlideIdx].imageUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className={`text-[9px] font-mono uppercase tracking-wider ${
                        isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-400'
                      }`}>
                        {heroSlides[selectedSlideIdx].badge}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {heroSlides[selectedSlideIdx].title}
                      </h4>
                      <p className="text-[10px] text-neutral-300 line-clamp-1 mt-0.5">
                        {heroSlides[selectedSlideIdx].subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className={`px-5 py-2.5 font-bold rounded-lg cursor-pointer transition-colors shadow-xs ${
                  isRoleAdmin ? 'bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800' : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
              >
                Simpan 3 Banner Header Beranda
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. SECTION: KATALOG PDF */}
      {activeSection === 'pdf' && (
        <div className="space-y-6">
          {/* Upload Form */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
            <h3 className="font-bold text-sm text-neutral-900 mb-3">
              Unggah File e-Katalog PDF Baru
            </h3>
            <form onSubmit={handleCreatePdf} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 font-medium mb-1">Judul Katalog *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Master Catalog Kitchen Hardware 2024"
                  value={newPdfTitle}
                  onChange={(e) => setNewPdfTitle(e.target.value)}
                  className={`w-full px-3 py-2 border border-neutral-300 rounded-lg ${
                    isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Kategori</label>
                <select
                  value={newPdfCategory}
                  onChange={(e) => setNewPdfCategory(e.target.value as any)}
                  className={`w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white ${
                    isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                  }`}
                >
                  <option value="master">Master Catalog</option>
                  <option value="technical">Technical Specs</option>
                  <option value="sink">Sink & Faucet</option>
                  <option value="manual">Installation Guide</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className={`w-full py-2 font-bold rounded-lg cursor-pointer transition-colors shadow-xs ${
                    isRoleAdmin ? 'bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800' : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  Unggah PDF
                </button>
              </div>
            </form>
          </div>

          {/* PDF List */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Katalog PDF</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Ukuran File</th>
                  <th className="px-4 py-3">Halaman</th>
                  <th className="px-4 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {pdfCatalogs.map((pdf) => (
                  <tr key={pdf.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-semibold text-neutral-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{pdf.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 font-mono text-neutral-700">
                        {pdf.categoryLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-600">{pdf.fileSize}</td>
                    <td className="px-4 py-3 font-mono text-neutral-600">{pdf.pageCount} Hal</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDeletePdfCatalog(pdf.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Hapus PDF"
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
      )}

      {/* 3. SECTION: UNGGAHAN VIDEO PORTOFOLIO (Permintaan User: Ubah Konten Portofolio Jadi Unggahan Video) */}
      {activeSection === 'portfolio' && (
        <div className="space-y-6">
          {/* Form Unggah Video Baru */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <VideoCamera weight="bold" className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-600'}`} />
                  <span>Unggah Video Portofolio & Dokumentasi Teknis Baru</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Video yang diunggah di sini akan otomatis tampil di halaman Portofolio untuk pelanggan dan arsitek.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetVideos}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
              >
                Reset ke Video Bawaan
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Judul Video Portofolio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Instalasi Presisi Magic Corner Basket 900mm"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Kategori Video *
                  </label>
                  <select
                    value={newVideoCategory}
                    onChange={(e) => setNewVideoCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white cursor-pointer"
                  >
                    <option value="instalasi">Hardware Instalasi (Pemasangan)</option>
                    <option value="uji-beban">Quality Control (Uji Beban & Daya Tahan)</option>
                    <option value="before-after">Before & After Kitchen</option>
                    <option value="workshop">Pabrik & Workshop Experience</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Durasi Video (mm:ss)
                  </label>
                  <input
                    type="text"
                    placeholder="03:45"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Nama Teknisi / Spesialis
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Agus Santoso (Higold Fitting Specialist)"
                    value={newVideoTechnician}
                    onChange={(e) => setNewVideoTechnician(e.target.value)}
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Lokasi Proyek / Showroom
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Residensi Kebayoran Baru, Jakarta"
                    value={newVideoLocation}
                    onChange={(e) => setNewVideoLocation(e.target.value)}
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  />
                </div>
              </div>

              {/* Unggah Video File & Thumbnail Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <label className="block text-neutral-800 font-semibold mb-1">
                    File Video (.mp4, .webm) atau URL Stream *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="https://.../video.mp4 atau pilih file di samping"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className={`w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-hidden ${
                        isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                      }`}
                    />
                    <label className={`px-3 py-2 text-white rounded-lg cursor-pointer shrink-0 font-medium flex items-center gap-1.5 shadow-xs ${
                      isRoleAdmin ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-sky-600 hover:bg-sky-700'
                    }`}>
                      <Upload className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-white'}`} />
                      <span>Unggah</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleUploadVideoFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Bisa berupa tautan CDN MP4 atau unggah file video langsung dari komputer.
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-800 font-semibold mb-1">
                    Thumbnail Gambar Cover Video
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... atau unggah gambar"
                      value={newVideoThumbnail}
                      onChange={(e) => setNewVideoThumbnail(e.target.value)}
                      className={`w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-hidden ${
                        isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                      }`}
                    />
                    <label className={`px-3 py-2 text-white rounded-lg cursor-pointer shrink-0 font-medium flex items-center gap-1.5 shadow-xs ${
                      isRoleAdmin ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-sky-600 hover:bg-sky-700'
                    }`}>
                      <ImageIcon className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-white'}`} />
                      <span>Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadVideoThumb}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Gambar poster yang tampil sebelum video diputar.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Deskripsi Pengerjaan Teknis
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan detail instalasi, tantangan arsitektural, atau hasil uji beban..."
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                    isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Tahapan Kunci (Pisahkan dengan baris baru / Enter)
                </label>
                <textarea
                  rows={2}
                  placeholder={"1. Pengeboran dasar kabinet dengan template 1:1\n2. Pemasangan braket tiang sentral SUS 304\n3. Uji kelancaran ayunan sudut"}
                  value={newVideoSteps}
                  onChange={(e) => setNewVideoSteps(e.target.value)}
                  className={`w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-[11px] focus:outline-hidden ${
                    isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                  }`}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className={`px-5 py-2.5 font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-2 ${
                    isRoleAdmin 
                      ? 'bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800' 
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  <Plus weight="bold" className="w-4 h-4" />
                  <span>Tambahkan Video ke Portofolio</span>
                </button>
              </div>
            </form>
          </div>

          {/* Daftar Video Portofolio Aktif */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FilmStrip weight="bold" className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-600'}`} />
                <span>Daftar Video Portofolio yang Tampil di Halaman Portofolio ({portfolioVideos.length} Video)</span>
              </h4>
              <span className="text-[11px] text-neutral-500">
                Tersinkronisasi otomatis dengan halaman /portofolio
              </span>
            </div>

            <div className="divide-y divide-neutral-100">
              {portfolioVideos.map((vid) => (
                <div key={vid.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-200">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                          <Play weight="fill" className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-white text-[9px] font-mono rounded">
                        {vid.duration}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isRoleAdmin 
                            ? 'bg-[#FAF6ED] text-[#9A7B38] border border-[#C8A15A]/30' 
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {vid.categoryLabel}
                        </span>
                        <span className="text-[11px] text-neutral-500">{vid.projectLocation}</span>
                      </div>
                      <h5 className="font-bold text-xs text-neutral-900 line-clamp-1">{vid.title}</h5>
                      <p className="text-[11px] text-neutral-500 line-clamp-1">{vid.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <a
                      href={vid.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Putar Video</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      title="Hapus Video"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Konfigurasi Showroom Pendukung */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-xs text-neutral-800 border-b border-neutral-100 pb-2">
              Informasi Tambahan Showroom Resmi & Kontak Reservasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Showroom Resmi</label>
                <input
                  type="text"
                  value={companyConfig.showroomTitle}
                  onChange={(e) => onUpdateCompanyConfig({ ...companyConfig, showroomTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Alamat Showroom</label>
                <input
                  type="text"
                  value={companyConfig.showroomAddress}
                  onChange={(e) => onUpdateCompanyConfig({ ...companyConfig, showroomAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Jam Operasional</label>
                <input
                  type="text"
                  value={companyConfig.showroomOperatingHours}
                  onChange={(e) => onUpdateCompanyConfig({ ...companyConfig, showroomOperatingHours: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">WhatsApp Reservasi</label>
                <input
                  type="text"
                  value={companyConfig.showroomWhatsapp}
                  onChange={(e) => onUpdateCompanyConfig({ ...companyConfig, showroomWhatsapp: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => showToast('Informasi kontak showroom berhasil diperbarui.')}
                className={`px-4 py-1.5 font-bold rounded-md cursor-pointer transition-colors ${
                  isRoleAdmin
                    ? 'bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800'
                    : 'bg-sky-600 text-white hover:bg-sky-700'
                }`}
              >
                Simpan Info Showroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION: LOGO MITRA & REKANAN PROYEK (Hak Akses Admin Desain Web) */}
      {activeSection === 'partners' && (
        <div className="space-y-6">
          {/* Card Form Tambah Mitra */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">
                  Kelola Logo & Icon Mitra Website
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Khusus hak akses Admin: Tambah, ubah, atau hapus icon mitra yang tampil di halaman beranda.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetPartners}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
              >
                Reset ke Default
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Nama Perusahaan / Studio Mitra *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Contoh: Karsa Kitchen Studio"
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Kategori / Bidang Mitra
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value)}
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white cursor-pointer focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  >
                    <option value="Kitchen Builder">Kitchen Builder</option>
                    <option value="Kontraktor">Kontraktor & Pelaksana</option>
                    <option value="Arsitek">Arsitek & Desain Interior</option>
                    <option value="Developer Properti">Developer Properti</option>
                    <option value="Retailer Showroom">Retailer Showroom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Kota / Wilayah (Opsional)
                  </label>
                  <input
                    type="text"
                    value={partnerCity}
                    onChange={(e) => setPartnerCity(e.target.value)}
                    placeholder="Contoh: Jakarta, Surabaya, Bali"
                    className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden ${
                      isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Unggah File Icon (PNG / JPG / SVG)
                  </label>
                  <label className={`w-full px-3 py-2 border border-dashed border-neutral-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer bg-neutral-50 transition-colors ${
                    isRoleAdmin ? 'hover:border-[#C8A15A]' : 'hover:border-sky-500'
                  }`}>
                    <Upload className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-600'}`} />
                    <span className="text-neutral-600 truncate">
                      {partnerIconUrl ? 'Icon Terpilih (Ganti)' : 'Pilih File Icon dari Komputer'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPartnerFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Atau Masukkan URL Gambar Icon Eksternal (Opsional)
                </label>
                <input
                  type="url"
                  value={partnerIconUrl.startsWith('data:') ? '' : partnerIconUrl}
                  onChange={(e) => setPartnerIconUrl(e.target.value)}
                  placeholder="https://domain.com/logo-mitra.png"
                  className={`w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-[11px] focus:outline-hidden ${
                    isRoleAdmin ? 'focus:border-[#C8A15A]' : 'focus:border-sky-500'
                  }`}
                />
              </div>

              {/* Preview Icon Jika Ada */}
              {partnerIconUrl && (
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded border border-neutral-200 p-1">
                    <img src={partnerIconUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 block">Pratinjau Icon Mitra</span>
                    <span className="text-[11px] text-neutral-500">Icon ini akan langsung tampil di beranda website</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className={`px-5 py-2.5 font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-2 ${
                    isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 hover:bg-[#b8924b]' : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Icon Mitra ke Website</span>
                </button>
              </div>
            </form>
          </div>

          {/* Daftar Icon Mitra Aktif */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">
                  Daftar Icon Mitra Aktif ({partners.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Semua icon di bawah tampil langsung di barisan mitra pada halaman beranda utama.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-white border border-neutral-200 flex items-center justify-center shrink-0 p-1">
                      {p.iconUrl ? (
                        <img src={p.iconUrl} alt={p.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Buildings className={`w-5 h-5 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-600'}`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900 truncate" title={p.name}>
                        {p.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {p.type} · {p.city}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePartner(p.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors cursor-pointer shrink-0"
                    title="Hapus Logo Mitra"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
