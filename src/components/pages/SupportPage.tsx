import React, { useState } from 'react';
import { OFFICIAL_COMPANY_INFO } from '../../data/products';
import { ShieldCheck, Ruler, FileText, Truck, Copy, Check, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface SupportPageProps {
  onOpenCalculator: () => void;
  onOpenWhatsApp: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({
  onOpenCalculator,
  onOpenWhatsApp,
}) => {
  const [copiedBank, setCopiedBank] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyBank = () => {
    navigator.clipboard.writeText(OFFICIAL_COMPANY_INFO.officialBank.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const FAQS = [
    {
      q: 'Bagaimana cara klaim garansi 5 tahun mekanisme hidrolik Higold?',
      a: 'Cukup foto atau rekam video bagian mekanisme yang mengalami kendala teknis, lalu hubungi salah satu konsultan WhatsApp resmi kami bersama nomor pesanan/invoice Anda. Tim teknis PT. Surya Gemilang Sejati akan mengirimkan spare part pengganti resmi atau menjadwalkan teknisi lapangan untuk wilayah Jabodetabek.'
    },
    {
      q: 'Apakah pengiriman ke luar kota dan luar pulau aman dari benturan?',
      a: 'Sangat aman. Setiap produk Higold dikemas dalam kardus heavy-duty berperedam busa density tinggi. Untuk pengiriman kargo laut/darat ke luar Jawa, kami menyediakan opsi packing peti kayu kokoh dan asuransi kargo penuh.'
    },
    {
      q: 'Bagaimana jika ukuran kabinet saya sedikit berbeda dengan standar?',
      a: 'Gunakan fitur Kalkulator Kompatibilitas Ukuran Kabinet kami atau kirimkan denah/gambar 3D kitchen set Anda ke WhatsApp CS kami. Produk seperti Swing Trays dan Pandora Baskets memiliki toleransi spacer samping dan baki yang dapat diatur.'
    },
    {
      q: 'Apakah tersedia file CAD / 3D DWG untuk desainer interior?',
      a: 'Ya, kami menyediakan berkas CAD 2D/3D (DWG/DXF/3DS) lengkap untuk desainer interior dan biro arsitek guna memudahkan rendering SketchUp, 3ds Max, atau AutoCAD. Hubungi CS kami untuk mendapatkan link akses Google Drive file CAD resmi.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[320px] sm:min-h-[380px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=80"
            alt="Higold Support and Warranty"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Pusat Dukungan & Transparansi
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-semibold text-white tracking-tight">
              Dukungan & Garansi Resmi
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Panduan pengukuran kabinet kitchen set, ketentuan garansi hidrolik 5 tahun, 
              serta verifikasi rekening bank resmi anti-penipuan.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Official Bank Account Security Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#FAF6ED] p-6 sm:p-10 border border-[#C8A15A]/30 rounded-md shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A15A]">
              <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
              <span>Pemberitahuan Rekening Resmi Anti-Penipuan</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-slate-900">
              {OFFICIAL_COMPANY_INFO.officialBank.accountName}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {OFFICIAL_COMPANY_INFO.officialBank.disclaimer}
            </p>
            <div className="text-sm font-mono font-bold text-slate-900 pt-1">
              Bank BCA KCP Asemka: <span className="text-[#C8A15A] tracking-wider">035-309-8877</span>
            </div>
          </div>

          <button
            onClick={handleCopyBank}
            className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider border border-slate-200 shrink-0 flex items-center gap-2 cursor-pointer rounded-md shadow-xs"
          >
            {copiedBank ? <Check className="w-4 h-4 text-[#C8A15A]" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedBank ? 'No. Rekening Disalin' : 'Salin No. Rekening'}</span>
          </button>
        </div>
      </section>

      {/* 2. Warranty 5 Years Policy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#C8A15A]">Jaminan Mutu</div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-slate-900 leading-tight">
              Garansi Resmi Mekanisme 5 Tahun Penuh
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              PT. Surya Gemilang Sejati memberikan jaminan garansi mekanis selama 5 tahun untuk seluruh mekanisme damper hidrolik soft-close dan rel tandem geser Higold sejak tanggal pembelian resmi.
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5" />
                <span><strong>Cakupan Garansi:</strong> Kerusakan seal hidrolik (bocor oli), rel geser macet atau tidak dapat menutup lembut (*soft-close failure*), dan patah struktur kawat baja akibat cacat produksi pabrik.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5" />
                <span><strong>Layanan Penggantian:</strong> Penggantian suku cadang asli tanpa biaya untuk komponen yang memenuhi syarat garansi.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5" />
                <span><strong>Ketersediaan Spare Part:</strong> Gudang suku cadang terpusat di Pluit Jakarta Utara menjamin kelancaran pasokan jangka panjang.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenWhatsApp}
                className="px-6 py-3.5 bg-[#09090b] hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer rounded-md shadow-xs"
              >
                Konsultasi Klaim Garansi via WhatsApp
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-50 p-8 rounded-none space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Langkah Cepat Klaim Garansi
              </div>
              <div className="space-y-4 text-xs font-sans">
                <div className="flex gap-4">
                  <span className="w-6 h-6 bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <div className="font-semibold text-slate-900">Dokumentasikan Kendala</div>
                    <div className="text-slate-500 mt-0.5">Ambil video singkat 5-10 detik yang menunjukkan bagian gerak atau rel kabinet.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="w-6 h-6 bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <div className="font-semibold text-slate-900">Kirim ke WhatsApp Konsultan Kami</div>
                    <div className="text-slate-500 mt-0.5">Sertakan nama pemesan atau nomor faktur invoice resmi Anda.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="w-6 h-6 bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <div className="font-semibold text-slate-900">Pengiriman Spare Part / Tindakan Servis</div>
                    <div className="text-slate-500 mt-0.5">Tim teknis mengirimkan mekanisme pengganti langsung ke alamat Anda.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Measurement Guide Helper */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Panduan Teknis Arsitektur
            </div>
            <h3 className="text-3xl font-display font-semibold text-white">
              Cara Mengukur Ruang Bersih Dalam Kabinet Kitchen Set
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-2xl">
              Gunakan meteran untuk mengukur dimensi <strong>bagian dalam</strong> kabinet (internal clear space):
              Lebar Bersih (W), Kedalaman Bersih dari engsel pintu ke dinding belakang (D), dan Tinggi Bersih antar rak (H).
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={onOpenCalculator}
              className="py-4 px-6 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer rounded-none flex items-center justify-center gap-2"
            >
              <Ruler className="w-4 h-4" />
              <span>Buka Kalkulator Kompatibilitas</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 pb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-700">Bantuan & FAQ</div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-slate-600">
            Informasi lengkap seputar pembelian, pengiriman, dan instalasi produk Higold.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-200">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-display font-semibold text-base sm:text-lg text-slate-900 hover:text-[#9A7B38] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#C8A15A] shrink-0 ml-4" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-4" />}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
