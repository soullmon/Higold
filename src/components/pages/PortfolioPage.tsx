import React, { useState } from 'react';
import { 
  Play, DownloadSimple, FileText, FilmStrip, HardDrive, X,
  Check, ArrowRight, Clock, VideoCamera, ShieldCheck, Lock
} from '@phosphor-icons/react';
import { downloadOfficialCatalogPdf } from '../../utils/downloadPdf';
import { INITIAL_PDF_CATALOGS } from '../../data/catalogsData';
import { PdfCatalogItem, UserProfile } from '../../types';

interface VideoItem {
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

const VIDEO_WORKS: VideoItem[] = [
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

interface PortfolioPageProps {
  onOpenWhatsApp: (productOrTopic?: string) => void;
  pdfCatalogs?: PdfCatalogItem[];
  onExploreProduct?: () => void;
  userProfile?: UserProfile | null;
  onRequireAuth?: (initialMode?: 'login' | 'register', reason?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onOpenWhatsApp,
  pdfCatalogs: propCatalogs,
  onExploreProduct,
  userProfile,
  onRequireAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'pdf'>('all');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Dynamic Portfolio Videos loaded from Admin Web Design uploads
  const [videosList, setVideosList] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('higold_portfolio_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return VIDEO_WORKS;
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('higold_portfolio_videos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVideosList(parsed);
          }
        }
      } catch {}
    };
    window.addEventListener('higold_portfolio_videos_updated', handleUpdate);
    return () => window.removeEventListener('higold_portfolio_videos_updated', handleUpdate);
  }, []);

  const catalogs = propCatalogs && propCatalogs.length > 0 ? propCatalogs : INITIAL_PDF_CATALOGS;

  const handleDownloadPdf = (pdf: PdfCatalogItem) => {
    if (!userProfile) {
      if (onRequireAuth) {
        onRequireAuth('login', `Silakan Masuk atau Buat Akun terlebih dahulu untuk mengunduh e-Katalog PDF resmi "${pdf.title}".`);
      }
      return;
    }
    downloadOfficialCatalogPdf(pdf);
    setDownloadSuccessToast(`Mengunduh: ${pdf.title}`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 font-sans select-none">
      
      {/* Toast Notification for PDF Download */}
      {downloadSuccessToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-neutral-950 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border border-[#C8A15A] shadow-2xl flex items-center gap-3 animate-fade-in font-sans max-w-[calc(100vw-2rem)]">
          <div className="w-7 h-7 rounded-sm bg-[#C8A15A] text-neutral-950 flex items-center justify-center shrink-0">
            <Check weight="bold" className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#C8A15A] uppercase tracking-wider">Unduhan Dimulai</div>
            <div className="text-xs text-neutral-300 line-clamp-1">{downloadSuccessToast}</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF6ED] text-[#C8A15A] border border-[#C8A15A]/40 rounded-none text-xs font-bold uppercase tracking-wider">
            <FilmStrip className="w-3.5 h-3.5" />
            <span>DOKUMENTASI TEKNIS & PORTFOLIO RESMI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Video Pemasangan & Pusat Unduhan Katalog PDF
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans">
            Dokumentasi video instalasi di lapangan dan pusat unduhan resmi e-katalog spesifikasi hardware, gambar kerja CAD arsitektur, serta sertifikasi uji ketahanan LGA Jerman.
          </p>
        </div>

        {/* Tab Switcher: All, Video, PDF Catalogs */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-sans">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-md border transition-all cursor-pointer font-bold ${
              activeTab === 'all'
                ? 'bg-[#C8A15A] text-white border-[#C8A15A] shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            Semua Portfolio ({videosList.length + catalogs.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-5 py-2.5 rounded-md border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-[#C8A15A] text-white border-[#C8A15A] shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <VideoCamera weight="bold" className="w-4 h-4" />
            <span>Video Instalasi ({videosList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-5 py-2.5 rounded-md border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              activeTab === 'pdf'
                ? 'bg-[#C8A15A] text-white border-[#C8A15A] shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
            <span>Katalog PDF ({catalogs.length})</span>
          </button>
        </div>

        {/* ================= SECTION 1: VIDEOS ================= */}
        {(activeTab === 'all' || activeTab === 'video') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C8A15A] flex items-center gap-1.5">
                  <FilmStrip className="w-4 h-4" />
                  <span>DOKUMENTASI INSTALASI LAPANGAN</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
                  Video Panduan Perakitan & Fitting Hardware
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Saksikan pemasangan bertahap, uji redaman hidrolik soft-close, dan fitting presisi tinggi oleh teknisi spesialis Higold.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosList.map((vid) => (
                <article
                  key={vid.id}
                  className="bg-white rounded-md border border-neutral-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
                >
                  {/* Video Thumbnail with Play Button Overlay */}
                  <div 
                    onClick={() => setPlayingVideo(vid)}
                    className="relative aspect-16/10 bg-neutral-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Category & Duration Badges */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-none bg-neutral-950/85 text-[#C8A15A] text-[10px] font-mono tracking-wider uppercase font-bold">
                      {vid.categoryLabel}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-none bg-neutral-950/85 text-white text-[10px] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C8A15A]" />
                      <span>{vid.duration}</span>
                    </div>

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#C8A15A] group-hover:bg-[#B8924B] text-neutral-950 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110">
                        <Play weight="fill" className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>

                    {/* Technician Name */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] text-neutral-300 font-sans truncate">
                      Teknisi: <span className="text-white font-medium">{vid.technicianName}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 
                        onClick={() => setPlayingVideo(vid)}
                        className="text-sm font-bold text-neutral-900 group-hover:text-[#C8A15A] transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {vid.title}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-600 line-clamp-2 leading-relaxed font-sans">
                        {vid.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-sans">
                      <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[180px]">
                        📍 {vid.projectLocation}
                      </span>
                      <button
                        onClick={() => setPlayingVideo(vid)}
                        className="text-xs font-bold text-[#9A7B38] hover:text-[#C8A15A] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Putar Video</span>
                        <Play weight="bold" className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 2: PDF CATALOG DOWNLOAD CENTER ================= */}
        {(activeTab === 'all' || activeTab === 'pdf') && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C8A15A] flex items-center gap-1.5">
                  <DownloadSimple weight="bold" className="w-4 h-4" />
                  <span>PUSAT UNDUHAN DOKUMEN DIGITAL RESMI</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
                  Unduh E-Katalog PDF Resmi Higold Indonesia
                </h2>
                <p className="text-xs text-neutral-500 font-sans mt-0.5">
                  Download langsung brosur teknis beresolusi tinggi, lembar gambar kerja CAD kabinet, dan sertifikat garansi resmi.
                </p>
              </div>
            </div>

            {/* Proteksi Akses PDF: Hanya Pengguna Terdaftar / Login */}
            {!userProfile && (
              <div className="p-4 bg-neutral-900 border border-[#C8A15A]/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-200 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C8A15A]/20 border border-[#C8A15A]/40 flex items-center justify-center shrink-0">
                    <Lock weight="bold" className="w-5 h-5 text-[#C8A15A]" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Dokumen Resmi Terproteksi untuk Pengguna Terdaftar</span>
                    <span className="text-neutral-300 text-[11px]">
                      Sesuai kebijakan HIGOLD Indonesia, hanya pengguna atau mitra yang telah masuk (login) yang dapat mengunduh file e-Katalog PDF dan CAD resmi.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRequireAuth?.('login', 'Silakan Masuk atau Buat Akun terlebih dahulu untuk mengunduh e-Katalog PDF resmi HIGOLD.')}
                  className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold rounded-md text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
                >
                  Masuk / Daftar Akun
                </button>
              </div>
            )}

            {/* Simple, clean, fast list */}
            <div className="space-y-3">
              {catalogs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="bg-white rounded-md border border-neutral-200 p-4 sm:p-5 shadow-2xs hover:border-[#C8A15A]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  {/* Left: Document Icon & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-14 bg-[#FAF6ED] text-[#C8A15A] border border-[#C8A15A]/30 rounded-md shrink-0 flex flex-col items-center justify-center p-1 transition-colors">
                      <FileText weight="fill" className="w-6 h-6 mb-0.5 text-[#C8A15A]" />
                      <span className="text-[9px] font-mono font-bold uppercase">PDF</span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-none text-[10px] font-bold uppercase tracking-wider">
                          {pdf.categoryLabel}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          Edisi {pdf.year}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{pdf.fileSize}</span>
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          {pdf.pageCount} Halaman
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#C8A15A] transition-colors leading-snug">
                        {pdf.title}
                      </h3>
                      
                      <p className="text-xs text-neutral-600 leading-relaxed font-sans line-clamp-2 max-w-3xl">
                        {pdf.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Direct Download Button (Requires Login) */}
                  <div className="shrink-0 flex items-center sm:self-center">
                    {userProfile ? (
                      <button
                        onClick={() => handleDownloadPdf(pdf)}
                        className="w-full sm:w-auto py-2.5 px-5 bg-[#C8A15A] hover:bg-[#B8924B] text-white text-xs font-bold rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs hover:shadow"
                        title="Unduh Katalog PDF"
                      >
                        <DownloadSimple weight="bold" className="w-4 h-4" />
                        <span>Unduh PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDownloadPdf(pdf)}
                        className="w-full sm:w-auto py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold rounded-md flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs border border-neutral-700 hover:border-[#C8A15A]"
                        title="Masuk untuk mengunduh Katalog PDF resmi"
                      >
                        <Lock weight="bold" className="w-4 h-4 text-[#C8A15A]" />
                        <span>Masuk untuk Unduh PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ================= VIDEO MODAL ================= */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg max-w-4xl w-full text-white overflow-hidden shadow-2xl">
            {/* Header Modal */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#C8A15A] uppercase tracking-widest block font-bold">
                  HIGOLD INDONESIA OFFICIAL VIDEO
                </span>
                <h3 className="text-base font-bold text-white line-clamp-1">
                  {playingVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Tutup Video"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-16/9 bg-black">
              <video
                src={playingVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            </div>

            {/* Video Details */}
            <div className="p-5 bg-neutral-900/90 space-y-3 font-sans text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-neutral-400 font-mono text-[11px] pb-2 border-b border-neutral-800">
                <span>Teknisi: <strong className="text-[#C8A15A]">{playingVideo.technicianName}</strong></span>
                <span>Lokasi: {playingVideo.projectLocation}</span>
                <span>Durasi: {playingVideo.duration}</span>
              </div>
              
              <p className="text-neutral-300 leading-relaxed">
                {playingVideo.description}
              </p>

              <div>
                <span className="text-neutral-400 font-semibold block mb-1">Langkah Kunci Perakitan:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-neutral-300">
                  {playingVideo.keySteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#C8A15A] font-mono font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    onOpenWhatsApp(playingVideo.title);
                    setPlayingVideo(null);
                  }}
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Konsultasi Hardware via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
