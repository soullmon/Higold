import React, { useState } from 'react';
import { 
  X, Check, DownloadSimple, DeviceMobile, 
  AppleLogo, GoogleChromeLogo, Desktop, 
  Sparkle, ShieldCheck, WifiSlash, Lightning, ShareNetwork
} from '@phosphor-icons/react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install, isStandalone } = usePWAInstall();
  
  // Default to iOS tab if on iOS device, otherwise Android/Chrome
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
      if (/android/.test(ua)) return 'android';
    }
    return 'android';
  });

  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-install-title"
      >
        {/* Header with Luxury Brand Accent */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white p-5 sm:p-6 relative border-b border-[#C8A15A]/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-13 h-13 rounded-xl bg-neutral-900 border border-[#C8A15A]/60 p-2 shrink-0 flex items-center justify-center shadow-lg">
              <img 
                src="/pwa-192x192.png" 
                alt="HIGOLD App Icon" 
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8A15A] bg-[#C8A15A]/15 px-2 py-0.5 rounded-full border border-[#C8A15A]/30">
                  Official Web App
                </span>
                {isStandalone && (
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Terpasang
                  </span>
                )}
              </div>
              <h2 id="pwa-install-title" className="text-base sm:text-lg font-bold text-white mt-1 leading-tight font-serif tracking-wide">
                Panduan Pasang Aplikasi HIGOLD
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Akses cepat katalog hardware dapur mewah langsung dari layar beranda Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm text-neutral-700">
          {/* Status Alert if installed */}
          {installSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">Aplikasi Berhasil Dipasang!</div>
                <div className="text-xs text-emerald-700">Ikon HIGOLD kini tersedia di layar utama perangkat Anda.</div>
              </div>
            </div>
          ) : isInstallable ? (
            /* Quick 1-Click Install Button if supported by browser */
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                  <Sparkle className="w-4 h-4 text-[#C8A15A]" weight="fill" />
                  <span>Dukungan Instalasi 1-Klik Tersedia</span>
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  Browser Anda mendukung pemasangan instan tanpa langkah manual.
                </div>
              </div>
              <button
                onClick={handleDirectInstall}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <DownloadSimple className="w-4 h-4" weight="bold" />
                <span>Pasang Sekarang</span>
              </button>
            </div>
          ) : null}

          {/* Platform Tab Switcher */}
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Pilih Panduan Perangkat:
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-neutral-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <GoogleChromeLogo className="w-4 h-4 text-emerald-600" />
                <span>Android / Chrome</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <AppleLogo className="w-4 h-4 text-neutral-900" weight="fill" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Desktop className="w-4 h-4 text-sky-600" />
                <span>PC / Laptop</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions per Platform */}
          <div className="bg-neutral-50 rounded-xl p-4 sm:p-5 border border-neutral-200">
            {activeTab === 'android' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 pb-2 border-b border-neutral-200">
                  <DeviceMobile className="w-4 h-4 text-[#C8A15A]" />
                  <span>Langkah Instalasi di Android (Google Chrome / Edge / Brave):</span>
                </div>
                
                <ol className="space-y-3 text-xs sm:text-sm text-neutral-700 list-none pl-0">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>
                      Ketuk tombol menu <strong>Tiga Titik (⋮)</strong> di pojok kanan atas browser Google Chrome.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>
                      Pilih menu <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>
                      Ketuk <strong>"Instal"</strong> saat dialog konfirmasi muncul. Ikon HIGOLD resmi akan muncul otomatis di beranda HP Anda!
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'ios' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 pb-2 border-b border-neutral-200">
                  <AppleLogo className="w-4 h-4 text-neutral-900" weight="fill" />
                  <span>Langkah Instalasi di iPhone / iPad (Safari):</span>
                </div>

                <ol className="space-y-3 text-xs sm:text-sm text-neutral-700 list-none pl-0">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#C8A15A] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <span>Buka website ini di <strong>Safari</strong>, lalu ketuk tombol <strong>Bagikan / Share</strong> </span>
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 mx-1 bg-neutral-200 rounded text-neutral-800 text-xs">
                        <ShareNetwork className="w-3.5 h-3.5 inline mr-1" /> Share
                      </span>
                      <span>di bilah bawah layar.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#C8A15A] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>
                      Gulir menu ke bawah lalu ketuk opsi <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong> bertanda ikon tambah (+).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#C8A15A] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>
                      Ketuk <strong>"Tambah" (Add)</strong> di sudut kanan atas. Selesai! HIGOLD kini dapat diakses langsung layaknya aplikasi native tanpa URL bar.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 pb-2 border-b border-neutral-200">
                  <Desktop className="w-4 h-4 text-sky-600" />
                  <span>Langkah Instalasi di Komputer / Laptop (Windows, Mac, Linux):</span>
                </div>

                <ol className="space-y-3 text-xs sm:text-sm text-neutral-700 list-none pl-0">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>
                      Perhatikan bilah alamat (address bar) di bagian atas browser Chrome atau Edge Anda.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>
                      Klik ikon <strong>Instal Aplikasi</strong> (ikon monitor atau tanda tambah ⊕) di sebelah kanan address bar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>
                      Pilih <strong>"Instal"</strong>. HIGOLD akan terbuka dalam jendela aplikasi tersendiri yang elegan dan bebas gangguan.
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Keuntungan Memasang Web App HIGOLD */}
          <div>
            <div className="text-xs font-bold text-neutral-900 mb-2.5">
              Keunggulan Aplikasi Web HIGOLD:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-100/70 border border-neutral-200/80 flex items-start gap-2">
                <Lightning className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" weight="fill" />
                <div>
                  <div className="font-semibold text-neutral-900">Performa Lebih Cepat</div>
                  <div className="text-neutral-500 text-[11px]">Aset disimpan lokal, loading halaman instan.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100/70 border border-neutral-200/80 flex items-start gap-2">
                <WifiSlash className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" weight="bold" />
                <div>
                  <div className="font-semibold text-neutral-900">Mendukung Akses Offline</div>
                  <div className="text-neutral-500 text-[11px]">Buka e-katalog bahkan saat koneksi lemah.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100/70 border border-neutral-200/80 flex items-start gap-2">
                <DeviceMobile className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900">Mode Layar Penuh (App)</div>
                  <div className="text-neutral-500 text-[11px]">Tampilan bersih tanpa bilah pencarian browser.</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100/70 border border-neutral-200/80 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" weight="fill" />
                <div>
                  <div className="font-semibold text-neutral-900">Ringan & Hemat Memori</div>
                  <div className="text-neutral-500 text-[11px]">Ukuran di bawah 2MB, tidak membebani HP.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500 hidden sm:block">
            Teknologi Progressive Web App (PWA) Standar Internasional
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer text-center ml-auto"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-neutral-900 text-white border border-[#C8A15A] px-3.5 py-2 text-xs font-medium shadow-2xl animate-bounce">
      <span className="h-2 w-2 rounded-full bg-[#C8A15A] animate-pulse" />
      <span>Mode Offline — Menampilkan katalog lokal yang tersimpan.</span>
    </div>
  );
};
