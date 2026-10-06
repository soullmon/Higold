import React from 'react';
import { OFFICIAL_COMPANY_INFO } from '../../data/products';
import { Award, ShieldCheck, Check, Building2, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateCatalog: () => void;
  onOpenShowroom: () => void;
  onOpenWhatsApp: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateCatalog,
  onOpenShowroom,
  onOpenWhatsApp,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[360px] sm:min-h-[440px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Higold Indonesia Headquarter & Architecture"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Profil Perusahaan
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-semibold text-white tracking-tight">
              Tentang HIGOLD Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Membawa standar rekayasa perangkat keras dapur fungsional kelas dunia ke Indonesia, 
              dikelola resmi oleh <strong className="text-white font-medium">{OFFICIAL_COMPANY_INFO.legalEntity1}</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Heritage Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-sky-700">Warisan & Komitmen</div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-slate-900 leading-tight">
              Presisi Mekanikal untuk Dapur Impian yang Abadi
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              HIGOLD adalah pionir global dalam inovasi perangkat keras fungsional dapur, lemari pakaian, dan aksesoris arsitektural. Di Indonesia, produk kami telah dipercaya oleh ratusan biro arsitek, konsultan desain interior, developer residensial mewah, hingga ribuan pemilik hunian pribadi.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Setiap produk dirancang berdasarkan studi antropometri dapur: bagaimana tangan bergerak, bagaimana kabinet sudut mati dapat diakses tanpa membungkuk, dan bagaimana rel geser dapat meluncur senyap tanpa getaran meski menahan beban panci puluhan kilogram.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold font-sans text-slate-900">100.000×</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Uji Siklus Buka-Tutup LGA</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-sans text-sky-700">5 Tahun</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Garansi Mekanisme Resmi</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80"
              alt="Higold Manufacturing & Design Excellence"
              className="w-full h-[440px] object-cover shadow-xl rounded-none"
            />
          </div>
        </div>
      </section>

      {/* 4 Pillars of Engineering Excellence */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-sky-700">Standar Mutu</div>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-slate-900">
              4 Pilar Rekayasa Higold
            </h2>
            <p className="text-sm text-slate-600">
              Kombinasi material tanpa kompromi dan pengujian laboratorium independen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 shadow-sm rounded-none space-y-3">
              <div className="w-10 h-10 bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">SUS 304 Food-Grade</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kawat dan pelat baja tahan karat SUS 304 padat tebal, tahan terhadap uap air panas dan cipratan minyak dapur.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm rounded-none space-y-3">
              <div className="w-10 h-10 bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">PVD Nano Crystal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lapisan nano bionic pada sink dan faucet membuat air dan saus meluncur tanpa meninggalkan noda kerak air.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm rounded-none space-y-3">
              <div className="w-10 h-10 bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">Hidrolik Soft-Close</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Peredam hidrolik terintegrasi dengan pelumas suhu tinggi, mencegah benturan pintu kabinet seumur pemakaian.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm rounded-none space-y-3">
              <div className="w-10 h-10 bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-lg font-display font-semibold text-slate-900">International Awards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diakui dunia dengan puluhan penghargaan bergengsi Red Dot Design Award dan iF Design Award di Jerman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom & Legal Identity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        <div className="bg-white p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8A6B29]">Entitas Resmi & Keaslian Produk</div>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-slate-900">
              Jaminan Keaslian Distributor Tunggal Indonesia
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Seluruh produk Higold yang didistribusikan oleh <strong>PT. Surya Gemilang Sejati</strong> dilengkapi sertifikat keaslian dan nomor registrasi garansi resmi. Kami memiliki fasilitas pergudangan terintegrasi dan showroom display lengkap di Jakarta Utara.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8A6B29] shrink-0 mt-0.5" />
                <span>{OFFICIAL_COMPANY_INFO.showroom.address}, {OFFICIAL_COMPANY_INFO.showroom.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8A6B29] shrink-0" />
                <span>Hotline: {OFFICIAL_COMPANY_INFO.showroom.phone} / WA: {OFFICIAL_COMPANY_INFO.showroom.whatsappHotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8A6B29] shrink-0" />
                <span>Email Resmi: {OFFICIAL_COMPANY_INFO.showroom.email}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-3">
            <button
              onClick={onOpenShowroom}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer rounded-none flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Reservasi Kunjungan Showroom</span>
            </button>
            <button
              onClick={onNavigateCatalog}
              className="w-full py-3.5 px-6 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer rounded-none flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Lihat Seluruh Katalog Produk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
