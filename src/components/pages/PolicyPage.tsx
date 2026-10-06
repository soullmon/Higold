import React, { useState, useEffect } from 'react';
import { OFFICIAL_COMPANY_INFO } from '../../data/products';
import { 
  ShieldCheck, Truck, HelpCircle, AlertTriangle, Building, 
  Copy, Check, FileText, Lock, RotateCcw, ArrowRight, Printer, 
  ChevronRight, MapPin, Phone, Mail, Clock, ExternalLink 
} from 'lucide-react';
import { PolicyTab } from '../PolicyModal';

export type PolicyPageTab = PolicyTab | 'showroom';

interface PolicyPageProps {
  initialTab?: PolicyPageTab;
  onNavigateHome: () => void;
  onOpenWhatsApp: (product?: string) => void;
  onNavigateContact: () => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
  initialTab = 'terms',
  onNavigateHome,
  onOpenWhatsApp,
  onNavigateContact,
}) => {
  const [activeTab, setActiveTab] = useState<PolicyPageTab>(initialTab);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFICIAL_COMPANY_INFO.officialBank.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const menuItems: { id: PolicyPageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'howToOrder', label: 'How to Order', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', label: 'Return & Exchange', icon: RotateCcw },
    { id: 'payment', label: 'Rekening Resmi & Verifikasi', icon: ShieldCheck },
    { id: 'showroom', label: 'Where to Find Us (Showroom)', icon: MapPin },
  ];

  const getPageTitle = (tab: PolicyPageTab) => {
    switch (tab) {
      case 'terms': return 'Syarat & Ketentuan Layanan (Terms & Conditions)';
      case 'privacy': return 'Kebijakan Privasi & Keamanan Data (Privacy Policy)';
      case 'howToOrder': return 'Panduan Pemesanan Hardware (How To Order)';
      case 'shipping': return 'Kebijakan Pengiriman & Peti Kayu (Shipping)';
      case 'returns': return 'Kebijakan Garansi & Retur (Return & Exchange)';
      case 'payment': return 'Verifikasi Rekening Resmi PT Surya Gemilang Sejati';
      case 'showroom': return 'Lokasi Showroom & Experience Center Higold';
      default: return 'Kebijakan & Informasi Resmi';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-sans mb-6">
        <button 
          onClick={onNavigateHome}
          className="hover:text-[#9A7B38] transition-colors cursor-pointer"
        >
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">Informasi & Kebijakan Resmi</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">{menuItems.find(m => m.id === activeTab)?.label}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 p-5 shadow-2xs">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3">
            DOKUMEN RESMI PERUSAHAAN
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8A15A]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#C8A15A]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </nav>

          {/* Official Distributor Seal Widget */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-[#8A6B29]" />
              <span>Distributor Tunggal Resmi</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Semua transaksi dan pengiriman dijamin langsung oleh entitas hukum resmi: <strong>PT Surya Gemilang Sejati</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWhatsApp()}
                className="w-full py-2.5 px-3 bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#8A6B29] border border-[#C8A15A]/30 text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Tanya Tim Legal / CS WhatsApp →
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area: Detailed Full Page */}
        <section className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-2xs">
          
          {/* Header of Content */}
          <div className="border-b border-slate-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A6B29] mb-1">
                PT SURYA GEMILANG SEJATI · DOKUMEN RESMI
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                {getPageTitle(activeTab)}
              </h1>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              title="Cetak Dokumen Resmi"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Dokumen</span>
            </button>
          </div>

          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-slate-50 border-l-4 border-slate-900 text-slate-800">
                Dokumen ini mengatur syarat dan ketentuan pemesanan, pembayaran, pengiriman, serta garansi seluruh produk perangkat keras dapur <strong>HIGOLD</strong> yang diimpor dan didistribusikan resmi oleh <strong>PT Surya Gemilang Sejati</strong> di seluruh wilayah Indonesia.
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  1. Keaslian Produk & Nomor Seri Resmi
                </h3>
                <p>
                  Seluruh unit produk yang dibeli melalui website resmi higold.co.id atau showroom resmi kami memiliki nomor seri terdaftar (Serial Number) dan hologram resmi distributor PT Surya Gemilang Sejati. Kami tidak melayani klaim garansi untuk produk yang dibeli dari jalur impor tidak resmi (black market).
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  2. Akurasi Dimensi & Fitment Kabinet
                </h3>
                <p>
                  Pembeli dan kontraktor bertanggung jawab memastikan kesesuaian ukuran internal kabinet (lebar, kedalaman, dan tinggi bersih) dengan lembar spesifikasi produk Higold. Tim konsultan teknis kami siap memberikan konsultasi gratis toleransi ukuran sebelum barang dikirim.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  3. Harga Resmi & Faktur Pajak
                </h3>
                <p>
                  Harga yang tertera merupakan harga resmi yang berlaku. Bagi pelanggan korporat (B2B, developer, arsitek), kami dapat menerbitkan Faktur Pajak resmi perusahaan (PPN) dengan melampirkan NPWP perusahaan pada saat pemesanan.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  4. Batasan Tanggung Jawab Instalasi
                </h3>
                <p>
                  Higold menyediakan panduan video instalasi terperinci, buku manual berbahasa Indonesia, dan layanan video call asistensi langsung ke tukang kayu Anda. Kerusakan akibat salah potong kabinet atau modifikasi paksa mekanisme di luar petunjuk teknis tidak ditanggung garansi.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-sky-50 border-l-4 border-sky-600 text-sky-900">
                PT Surya Gemilang Sejati berkomitmen melindungi privasi data setiap pelanggan, desainer interior, arsitek, dan kontraktor yang menggunakan layanan kami.
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  1. Data yang Kami Kumpulkan
                </h3>
                <p>
                  Kami hanya mengumpulkan data yang diperlukan untuk pemrosesan pesanan, pengiriman logistik ekspedisi, dan pendaftaran garansi resmi: Nama Lengkap, Nomor WhatsApp aktif, Alamat Pengiriman Proyek, serta catatan spesifikasi kabinet.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  2. Kerahasiaan Data & Anti-Spam
                </h3>
                <p>
                  Data pribadi Anda tidak akan pernah dijual, disewakan, atau dibagikan kepada pihak ketiga di luar kebutuhan logistik pengiriman (ekspedisi truk / peti kayu) dan pemenuhan garansi produk.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  3. Keamanan Informasi Finansial
                </h3>
                <p>
                  Kami tidak menyimpan data perbankan sensitif seperti PIN atau password. Semua pembayaran dilakukan secara transparan melalui transfer antar bank ke rekening atas nama PT Surya Gemilang Sejati.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO ORDER */}
          {activeTab === 'howToOrder' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <p>
                Pemesanan hardware kabinet dapur arsitektural Higold dapat dilakukan dengan mudah melalui 4 tahapan berikut:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                    01
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Pilih Produk & Cek Ukuran</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih produk hardware yang sesuai, periksa lebar kabinet (misal: 600mm, 800mm, 900mm) dan orientasi bukaan (Kiri/Kanan).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                    02
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Konsultasi Toleransi</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gunakan tombol "Konsultasi Ukuran" untuk berkonsultasi via WhatsApp dengan teknisi resmi kami guna memastikan kesesuaian ukuran kabinet.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                    03
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Checkout & Verifikasi Bank</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Selesaikan proses checkout pesanan dan lakukan pembayaran hanya ke Rekening BCA KCP Asemka atas nama PT Surya Gemilang Sejati.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200">
                  <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-2">
                    04
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Pengiriman Peti Kayu</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pesanan dipacking aman dengan busa tebal dan peti kayu, lalu dikirim via kurir khusus kargo dengan asuransi pengiriman penuh.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#8A6B29] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Standar Pengemasan Peti Kayu Ekstra Kuat</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Setiap unit perangkat keras Higold yang dikirim ke luar kota atau luar pulau dibungkus dengan kardus double-wall tebal dan rangka peti kayu solid untuk menjamin rel dan mekanisme hidrolik tiba tanpa cacat.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  1. Jangkauan Pengiriman
                </h3>
                <p>
                  Kami melayani pengiriman ke seluruh kota dan kabupaten di Indonesia (Jawa, Bali, Sumatera, Kalimantan, Sulawesi, hingga Papua) menggunakan jaringan ekspedisi kargo terpercaya.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  2. Estimasi Waktu Pengiriman
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Jabodetabek:</strong> 1-2 hari kerja (Armada Higold Express / Lalamove Kargo)</li>
                  <li><strong>Pulau Jawa & Bali:</strong> 2-4 hari kerja (Kargo Darat Cepat)</li>
                  <li><strong>Luar Pulau Jawa:</strong> 4-8 hari kerja (Kargo Laut / Udara Khusus)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  3. Ketentuan Bebas Ongkir (Free Shipping)
                </h3>
                <p>
                  Program <strong>Bebas Ongkir (Gratis Ongkos Kirim)</strong> berlaku untuk seluruh pesanan dengan alamat tujuan dalam <strong>jarak &le; 10 km</strong> dari Gudang Pusat HIGOLD Indonesia (Kawasan Industri Pluit, Penjaringan, Jakarta Utara). Untuk pengiriman dengan jarak lebih dari 10 km, ongkir dihitung otomatis melalui integrasi API Biteship Gateway sesuai kurir pilihan Anda.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  4. Asuransi & Pergantian Barang Rusak
                </h3>
                <p>
                  Semua pengiriman dilindungi asuransi pengiriman. Jika ditemukan kerusakan saat pembongkaran peti kayu, cukup kirimkan video unboxing ke CS kami dalam waktu 2x24 jam dan unit baru akan segera kami kirimkan sebagai pengganti.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: RETURN & EXCHANGE */}
          {activeTab === 'returns' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-[#FAF6ED] border-l-4 border-[#C8A15A] text-slate-800">
                Kami memberikan <strong>Jaminan Retur / Tukar Ukuran 100%</strong> apabila terjadi salah ukuran kabinet sebelum barang dipasang, serta garansi pergantian suku cadang seumur hidup untuk mekanisme rel hidrolik.
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  1. Ketentuan Tukar Ukuran (Exchange)
                </h3>
                <p>
                  Jika ukuran kabinet di lapangan berbeda dari rencana awal, Anda dapat mengajukan penukaran ukuran unit dalam waktu 7 (tujuh) hari kalender sejak barang diterima, dengan syarat unit belum dipasang, belum dimodifikasi, dan kemasan asli masih utuh.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  2. Klaim Garansi Kerusakan Mekanis
                </h3>
                <p>
                  Apabila rel peredam soft-close atau pegas hidrolik mengalami penurunan performa, tim teknis kami akan mengirimkan modul cadangan original atau teknisi ke lokasi Anda (Jabodetabek).
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  3. Prosedur Pengajuan
                </h3>
                <p>
                  Silakan buka menu <strong>Contact Us &gt; Helpdesk Pengaduan</strong> atau hubungi WhatsApp Customer Service dengan menyertakan Nomor Pesanan dan foto/video unit.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT & BANK VERIFICATION */}
          {activeTab === 'payment' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>PERINGATAN PENTING KEAMANAN TRANSAKSI:</span>
                </div>
                <p className="text-xs">
                  PT Surya Gemilang Sejati <strong>TIDAK PERNAH</strong> meminta transfer pembayaran ke rekening atas nama pribadi atau perorangan. Seluruh pembayaran resmi HANYA ditujukan ke rekening giro perusahaan berikut:
                </p>
              </div>

              <div className="p-6 bg-slate-50 border-2 border-[#C8A15A] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    REKENING RESMI PERUSAHAAN (VERIFIED)
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#FAF6ED] text-[#8A6B29] border border-[#C8A15A]/30 text-[10px] font-bold uppercase">
                    Terverifikasi Bank BCA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-[11px] text-slate-500">Nama Bank:</div>
                    <div className="font-bold text-slate-900 text-base">BANK CENTRAL ASIA (BCA)</div>
                    <div className="text-xs text-slate-600">Kantor Cabang Pembantu (KCP) Asemka, Jakarta</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Atas Nama Pemilik Rekening:</div>
                    <div className="font-bold text-slate-900 text-base uppercase">PT. SURYA GEMILANG SEJATI</div>
                    <div className="text-xs text-slate-600">Entitas Resmi Distributor Tunggal Higold</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-500">Nomor Rekening Giro Resmi:</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#8A6B29] tracking-wider">
                      {OFFICIAL_COMPANY_INFO.officialBank.accountNumber}
                    </div>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0 shadow-xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Nomor Rekening'}</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                  Konfirmasi Pembayaran
                </h3>
                <p>
                  Setelah melakukan transfer, silakan kirimkan bukti transfer kepada konsultan resmi kami atau melalui sistem checkout otomatis untuk langsung diproses surat jalan dan pengiriman.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: WHERE TO FIND US (SHOWROOM) */}
          {activeTab === 'showroom' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <div className="p-4 bg-slate-50 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-1 font-display">
                  Showroom & Flagship Experience Center Higold
                </h3>
                <p className="text-xs text-slate-600">
                  Kunjungi ruang pamer resmi kami untuk mencoba langsung seluruh koleksi hardware dapur fungsional dan berkonsultasi dengan konsultan interior kami.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#8A6B29] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Alamat Showroom Utama Jakarta</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {OFFICIAL_COMPANY_INFO.showroom.address}, {OFFICIAL_COMPANY_INFO.showroom.district}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#8A6B29] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Jam Operasional</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Senin - Jumat: 09:00 - 17:00 WIB<br />
                        Sabtu: 09:00 - 15:00 WIB<br />
                        Minggu & Hari Libur Nasional: Tutup (Kecuali Perjanjian Khusus)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#8A6B29] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Hotline & WhatsApp</h4>
                      <p className="text-xs text-slate-600 mt-1 font-mono">
                        Telp: {OFFICIAL_COMPANY_INFO.showroom.phone}<br />
                        WA Hotline: {OFFICIAL_COMPANY_INFO.showroom.whatsappHotline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onOpenWhatsApp()}
                      className="px-5 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Jadwalkan Kunjungan Showroom
                    </button>
                    <button
                      onClick={onNavigateContact}
                      className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      Buka Halaman Kontak Lengkap
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 overflow-hidden shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
                    alt="Higold Showroom Jakarta"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-slate-50 space-y-2 text-xs">
                    <div className="font-bold text-slate-900">Fasilitas Showroom:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Display Mockup Kabinet Dapur Skala 1:1</li>
                      <li>Koleksi Lengkap Diamond, Shearer, & Arena Series</li>
                      <li>Ruang Konsultasi Arsitek & Desainer Interior</li>
                      <li>Area Parkir Gratis & Keamanan 24 Jam</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
};
