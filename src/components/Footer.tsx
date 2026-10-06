import React, { useState } from 'react';
import { OFFICIAL_COMPANY_INFO } from '../data/products';
import { CategoryId } from '../types';
import { NavPage } from './Navbar';
import { 
  MapPin, Phone, EnvelopeSimple, ArrowUpRight, 
  ShieldCheck, QrCode, CreditCard, Truck, Gear
} from '@phosphor-icons/react';

interface FooterProps {
  onNavigate: (page: NavPage, catId?: CategoryId | 'all') => void;
  onOpenWhatsApp: () => void;
  onOpenShowroom: () => void;
  onOpenCalculator: () => void;
  onSecretAdminAccess?: () => void;
  onOpenTrackingModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenWhatsApp,
  onOpenShowroom,
  onOpenCalculator,
  onSecretAdminAccess,
  onOpenTrackingModal,
}) => {
  const [clickCount, setClickCount] = useState(0);

  const handleCopyrightClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        if (onSecretAdminAccess) onSecretAdminAccess();
        return 0;
      }
      return next;
    });
    setTimeout(() => setClickCount(0), 1500);
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 text-xs font-sans border-t border-neutral-800">
      
      {/* 1. TOP HIGOLD BRAND HIGHLIGHTS */}
      <div className="border-b border-neutral-800 py-8 px-4 sm:px-8 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-neutral-900 border border-neutral-800 text-[#C8A15A] shrink-0 rounded">
              <ShieldCheck weight="fill" className="w-5 h-5 text-[#C8A15A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Garansi Mekanisme 5 Tahun</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                Sertifikasi uji ketahanan hidrolik LGA Jerman 100.000 siklus buka-tutup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-neutral-900 border border-neutral-800 text-[#C8A15A] shrink-0 rounded">
              <Truck weight="bold" className="w-5 h-5 text-[#C8A15A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Bebas Ongkir & Tracking Resi</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                Gratis ongkir radius &le; 10 km dari Gudang Pluit dan pelacakan resi kurir real-time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-neutral-900 border border-neutral-800 text-[#C8A15A] shrink-0 rounded">
              <QrCode weight="bold" className="w-5 h-5 text-[#C8A15A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">No. Rekening & QR Saja</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                Pembayaran transfer bank resmi BCA, Mandiri, dan QRIS NMID Terverifikasi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-neutral-900 border border-neutral-800 text-[#C8A15A] shrink-0 rounded">
              <MapPin weight="fill" className="w-5 h-5 text-[#C8A15A]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Showroom Flagship Pluit</div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                Experience center langsung di Pluit Raya No. 12, Jakarta Utara.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN FOOTER DIRECTORY (4 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Higold Profile & Showroom Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/higold-logo.png"
                alt="HIGOLD"
                className="h-8 w-auto object-contain bg-neutral-900/80 p-1 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex items-baseline tracking-widest font-serif">
                <span className="text-xl font-black text-[#C8A15A]">
                  HIGOLD
                </span>
                <span className="text-xs text-neutral-400 font-bold ml-1">® INDONESIA</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Distributor resmi perangkat keras arsitektural dan sistem penyimpanan kabinet dapur premium HIGOLD di Indonesia. Menghadirkan solusi tata ruang elegan, presisi rekayasa robotik, dan material stainless steel SUS 304 food-grade.
            </p>

            <div className="space-y-1.5 text-xs text-neutral-400 pt-1 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <MapPin weight="fill" className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                <span>{OFFICIAL_COMPANY_INFO.showroom.address}, {OFFICIAL_COMPANY_INFO.showroom.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone weight="bold" className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                <span>Hotline: {OFFICIAL_COMPANY_INFO.showroom.whatsappHotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple weight="bold" className="w-3.5 h-3.5 text-[#C8A15A] shrink-0" />
                <span>Email: {OFFICIAL_COMPANY_INFO.showroom.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigasi Cepat Koleksi Produk */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-800 pb-2">
              Kategori Produk
            </div>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => onNavigate('category', 'corner-units')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Corner Basket Series (Penyimpanan Sudut)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'tall-units')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Larder Pull-Out (Pantry Bertingkat)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'base-units')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Base Pull-Out Basket (Bawah Meja)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'wall-units')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Elevator Basket (Kabinet Atas Hidrolik)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'all')} className="text-[#C8A15A] font-bold hover:underline cursor-pointer flex items-center gap-1 mt-1">
                  <span>Lihat Seluruh Katalog</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Layanan & Informasi Konsumen */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-800 pb-2">
              Layanan Pelanggan
            </div>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={onOpenCalculator} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Kalkulator Kabinet Dapur
                </button>
              </li>
              <li>
                <button onClick={() => onOpenTrackingModal && onOpenTrackingModal()} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Cek Resi & Status Kirim
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Ketentuan Bebas Ongkir
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('returns')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Klaim Garansi 5 Tahun
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('payment')} className="hover:text-[#C8A15A] transition-colors cursor-pointer text-left">
                  Metode Pembayaran Resmi
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp CS & Showroom */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-800 pb-2">
              Layanan CS & Showroom
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Tim arsitek dan customer service kami siap membantu pemilihan spesifikasi hardware kabinet dapur Anda.
            </p>

            <button
              onClick={onOpenWhatsApp}
              className="w-full py-2.5 px-3 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-md shadow-xs"
            >
              <Phone weight="bold" className="w-3.5 h-3.5 text-neutral-950" />
              <span>Chat WhatsApp Resmi</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-md"
            >
              Hubungi Service Center
            </button>
          </div>

        </div>
      </div>

      {/* 3. COPYRIGHT & BOTTOM BAR */}
      <div className="border-t border-neutral-900 bg-black py-4 px-4 sm:px-8 text-[11px] text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div 
            onClick={handleCopyrightClick}
            className="cursor-pointer select-none"
            title="Higold Indonesia"
          >
            © {new Date().getFullYear()} <strong>HIGOLD INDONESIA</strong> · PT Surya Gemilang Sejati. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button onClick={() => onNavigate('terms')} className="hover:text-[#C8A15A] cursor-pointer">
              Syarat & Ketentuan
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('privacy')} className="hover:text-[#C8A15A] cursor-pointer">
              Kebijakan Privasi
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
};
