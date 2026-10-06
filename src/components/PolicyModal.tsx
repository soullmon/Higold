import React, { useState, useEffect } from 'react';
import { OFFICIAL_COMPANY_INFO } from '../data/products';
import { ShieldCheck, Truck, HelpCircle, X, AlertTriangle, Building, Copy, Check, FileText, Lock, RotateCcw } from 'lucide-react';

export type PolicyTab = 'terms' | 'privacy' | 'howToOrder' | 'shipping' | 'returns' | 'payment' | 'warranty';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTab;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFICIAL_COMPANY_INFO.officialBank.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-scale">
      <div 
        className="relative w-full max-w-3xl bg-white shadow-2xl overflow-hidden my-8 rounded-none border border-slate-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#09090b] text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Kebijakan & Informasi Resmi Higold Indonesia
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                PT. Surya Gemilang Sejati · Distributor Tunggal Resmi Eksklusif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 text-slate-500 hover:text-white hover:bg-[#09090b] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('howToOrder')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'howToOrder'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            How To Order
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Shipping
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'returns'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Return & Exchange
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'payment'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rekening Resmi BCA
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto text-xs text-slate-600 space-y-4 leading-relaxed bg-white">
          {/* TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-200">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Syarat & Ketentuan Pembelian Resmi Higold</h3>
                <p className="text-slate-600 text-xs">
                  Seluruh produk perangkat keras (hardware) dapur Higold yang dibeli melalui website resmi atau distributor resmi terikat oleh ketentuan garansi dan spesifikasi asli pabrikan.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800">1. Keaslian Produk & Garansi</h4>
                <p>Setiap unit hardware dilengkapi nomor seri dan logo resmi Higold yang diverifikasi oleh PT Surya Gemilang Sejati. Masa garansi mekanisme soft-close berlaku selama 5 tahun sejak tanggal faktur penjualan.</p>

                <h4 className="font-bold text-slate-800">2. Toleransi & Ukuran Kabinet</h4>
                <p>Pembeli wajib memastikan ukuran bersih dalam kabinet kitchen set (Lebar, Kedalaman, dan Ketinggian) sesuai dengan lembar spesifikasi CAD yang tertera pada katalog sebelum melakukan instalasi.</p>

                <h4 className="font-bold text-slate-800">3. Pemesanan Khusus & Proyek B2B</h4>
                <p>Untuk pesanan dalam jumlah besar (kontraktor/arsitek interior), ketersediaan stok cadangan dan jadwal pengiriman bertahap dapat diatur melalui invoice resmi perusahaan.</p>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-sky-600" />
                  <span>Kebijakan Privasi Data Pengguna</span>
                </h3>
                <p className="text-slate-600 text-xs">
                  Higold Indonesia menghargai privasi Anda dan berkomitmen menjaga kerahasiaan data pribadi sesuai peraturan perundang-undangan perlindungan data yang berlaku di Indonesia.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Data Yang Dikumpulkan</h4>
                <p>Data kontak seperti nama lengkap, nomor WhatsApp, alamat pengiriman proyek, dan email digunakan murni untuk keperluan pengiriman pesanan, penerbitan invoice resmi, dan dukungan klaim garansi.</p>
                <p>Kami tidak pernah menjual atau membagikan data Anda kepada pihak ketiga yang tidak berhubungan dengan proses pengiriman kargo dan transaksi resmi.</p>
              </div>
            </div>
          )}

          {/* HOW TO ORDER */}
          {activeTab === 'howToOrder' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Panduan Pemesanan Online Cepat:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700">
                <li><strong>Pilih Produk & Ukuran:</strong> Jelajahi katalog pada menu PRODUCT, sesuaikan lebar kabinet (misal: 900mm) dan arah bukaan (Kiri/Kanan).</li>
                <li><strong>Tambah ke Keranjang:</strong> Klik tombol "+ Tambah Keranjang" untuk menampung item pilihan Anda.</li>
                <li><strong>Checkout & Verifikasi Alamat:</strong> Isi data proyek dan alamat pengiriman secara akurat untuk estimasi armada kargo.</li>
                <li><strong>Pembayaran Resmi BCA:</strong> Lakukan transfer ke rekening resmi PT Surya Gemilang Sejati.</li>
                <li><strong>Konfirmasi Instan:</strong> Kirimkan bukti transfer ke tim WhatsApp CS kami untuk penjadwalan pengiriman segera.</li>
              </ol>
            </div>
          )}

          {/* SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#9A7B38] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ketentuan Pengiriman & Logistik</h3>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Produk hardware Higold dikemas dengan boks berlapis foam busa density tinggi dan sudut proteksi sudut kayu untuk pengiriman jarak jauh ke seluruh Nusantara.
                  </p>
                </div>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                <li><strong>JABODETABEK:</strong> Pengiriman via kurir internal / Lalamove kargo 1-2 hari kerja.</li>
                <li><strong>Luar Kota / Antar Pulau:</strong> Bekerja sama dengan ekspedisi kargo tepercaya (Dakota Cargo, Baraka Sarana Tama, Indah Logistik) dengan asuransi pengiriman penuh.</li>
              </ul>
            </div>
          )}

          {/* RETURN & EXCHANGE */}
          {activeTab === 'returns' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF6ED] border border-[#C8A15A]/30 flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-[#C8A15A] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Kebijakan Retur & Penukaran Ukuran</h3>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Kami memahami kebutuhan penyesuaian lapangan dalam proyek kitchen set.
                  </p>
                </div>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                <li>Penukaran ukuran atau arah bukaan (misal: dari 900mm ke 1000mm) dapat dilakukan dalam waktu maksimal 7 hari sejak produk diterima, asalkan kemasan boks dan aksesoris baut/rel masih lengkap dan belum dibor/dipasang secara permanen.</li>
                <li>Biaya selisih harga dan ongkos kirim penukaran ditanggung oleh pemesan kecuali terdapat kesalahan pengiriman dari pihak gudang kami.</li>
              </ul>
            </div>
          )}

          {/* PAYMENT */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF6ED] border border-[#C8A15A]/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#8A6B29] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">
                    Pemberitahuan Keamanan Transaksi Online
                  </div>
                  <p className="text-slate-600 text-xs">
                    Waspada penipuan yang mengatasnamakan tim penjualan atau manajemen Higold Indonesia. Seluruh transaksi resmi hanya melalui rekening bank berbadan hukum PT Surya Gemilang Sejati.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#9A7B38]" />
                  <span>Daftar Rekening Resmi Perusahaan:</span>
                </div>

                <div className="bg-white p-4 border border-slate-200 font-sans space-y-2 text-xs shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Bank:</span>
                    <span className="text-slate-900 font-bold">{OFFICIAL_COMPANY_INFO.officialBank.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Kantor Cabang:</span>
                    <span className="text-slate-800">{OFFICIAL_COMPANY_INFO.officialBank.branch}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Nomor Rekening:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8A6B29] font-bold text-base font-mono">{OFFICIAL_COMPANY_INFO.officialBank.accountNumber}</span>
                      <button
                        onClick={handleCopy}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Salin</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Atas Nama:</span>
                    <span className="text-slate-900 font-bold">{OFFICIAL_COMPANY_INFO.officialBank.accountName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
