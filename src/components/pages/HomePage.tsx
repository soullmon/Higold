import React, { useState, useEffect } from 'react';
import { Product, CategoryId, UserProfile, CMSUser, UserCategoryType } from '../../types';
import { ProductCard } from '../ProductCard';
import { CabinetCalculator } from '../CabinetCalculator';
import { 
  ArrowRight, ShieldCheck, Buildings, PhoneCall, 
  Truck, CaretRight, CaretLeft,
  CheckCircle, Medal, Clock, Star, Users,
  Crown, Check, Phone, EnvelopeSimple
} from '@phosphor-icons/react';
import { NavPage } from '../Navbar';
import { formatRupiah } from '../../utils/format';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onNavigateAllCatalog: () => void;
  onNavigateCategory: (catId: CategoryId, subcatId?: string) => void;
  onOpenCalculator: () => void;
  onOpenWhatsApp: () => void;
  onOpenShowroom: () => void;
  onOpenAuth?: (mode?: 'login' | 'register' | 'profile') => void;
  onNavigatePage?: (page: NavPage) => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateSupport?: () => void;
  quickAddedId?: string | null;
  userProfile?: UserProfile | null;
  onRegisterMember?: (newUser: CMSUser) => void;
  onCustomerRegistered?: (newProfile: UserProfile) => void;
}

interface PartnerLogo {
  id: string;
  name: string;
  type: string;
  city: string;
  iconUrl?: string;
}

const DEFAULT_PARTNERS: PartnerLogo[] = [
  { id: 'p-1', name: 'Karsa Kitchen Studio', type: 'Kitchen Builder', city: 'Jakarta' },
  { id: 'p-2', name: 'Lippo Karawaci Homes', type: 'Developer', city: 'Tangerang' },
  { id: 'p-3', name: 'Pakubuwono Residence', type: 'Luxury Apartment', city: 'Jakarta Selatan' },
  { id: 'p-4', name: 'Ciputra World Interior', type: 'Commercial Partner', city: 'Surabaya' },
  { id: 'p-5', name: 'Graha Padma Architect', type: 'Architect Studio', city: 'Semarang' },
  { id: 'p-6', name: 'Balaraja Kitchen Mitra', type: 'Contractor Partner', city: 'Banten' },
];

const renderDefaultPartnerIcon = (index: number) => {
  switch (index % 6) {
    case 0:
      return (
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10L18 3L30 10V26L18 33L6 26V10Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
          <path d="M18 3V33M6 10L30 26M6 26L30 10" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4"/>
        </svg>
      );
    case 1:
      return (
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="12" width="10" height="20" rx="1" stroke="currentColor" strokeWidth="1.75"/>
          <rect x="20" y="6" width="10" height="26" rx="1" stroke="currentColor" strokeWidth="1.75"/>
          <line x1="10" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="10" y1="22" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="24" y1="11" x2="26" y2="11" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="24" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="24" y1="21" x2="26" y2="21" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );
    case 2:
      return (
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 29H30M9 29V14M15 29V14M21 29V14M27 29V14M7 14L18 6L29 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 3:
      return (
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 5L30 27H6L18 5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
          <path d="M18 13L25 27H11L18 13Z" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5"/>
        </svg>
      );
    case 4:
      return (
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="1.75"/>
          <path d="M18 6V30M6 18H30" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/>
          <rect x="13.5" y="13.5" width="9" height="9" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );
    case 5:
    default:
      return (
        <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 8L26 24M26 8L10 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6"/>
        </svg>
      );
  }
};

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onQuickAdd,
  onNavigateAllCatalog,
  onNavigateCategory,
  onOpenCalculator,
  onOpenWhatsApp,
  onOpenShowroom,
  onOpenAuth,
  onNavigatePage,
  onNavigateContact,
  onNavigateSupport,
  quickAddedId,
  userProfile,
  onRegisterMember,
}) => {
  // 1. Auto Slide Hero (Linked to Admin Desain Web 3 Header Banner uploads)
  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroBuildingSlides, setHeroBuildingSlides] = useState(() => {
    try {
      const saved = localStorage.getItem('higold_homepage_hero_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: any, idx: number) => ({
            id: s.id || idx + 1,
            badge: s.badge || 'HIGOLD OFFICIAL ARCHITECTURAL HARDWARE',
            title: s.title,
            subtitle: s.subtitle,
            ctaText: s.ctaText || 'Jelajahi Produk Kami',
            action: idx === 1 ? onOpenShowroom : onNavigateAllCatalog,
            imageUrl: s.imageUrl,
            tag: s.tag || `Slide ${idx + 1}`,
          }));
        }
      }
    } catch {}

    return [
      {
        id: 1,
        badge: 'HIGOLD GLOBAL HEADQUARTERS',
        title: 'Pusat Inovasi Perangkat Keras Arsitektural Dunia',
        subtitle: 'Higold Global Headquarters & Smart Robotic Center. Rekayasa presisi berstandar Jerman dengan uji ketahanan 100.000 siklus bebas hambatan.',
        ctaText: 'Jelajahi Produk Kami',
        action: onNavigateAllCatalog,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
        tag: 'Gedung Pusat Higold',
      },
      {
        id: 2,
        badge: 'SMART ROBOTIC FACTORY & EXPERIENCE CENTER',
        title: 'Presisi Rekayasa Robotik & Ergonomi Dapur Mewah',
        subtitle: 'Memadukan material aviation grade aluminum, teknologi nano coating bionik lotus leaf, dan sistem peredam hidrolik soft-close tak bersuara.',
        ctaText: 'Kunjungi Showroom Pluit',
        action: onOpenShowroom,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1800&q=85',
        tag: 'Higold Experience Center',
      },
      {
        id: 3,
        badge: 'REDDOT BEST OF THE BEST AWARD',
        title: 'Koleksi Flagship Dapur Kontemporer Kelas Dunia',
        subtitle: 'Dipercaya oleh ribuan kontraktor, arsitek, dan pemilik hunian prestisius di lebih dari 86 negara di seluruh dunia.',
        ctaText: 'Buka Halaman Produk',
        action: onNavigateAllCatalog,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
        tag: 'Higold Flagship Kitchen',
      }
    ];
  });

  const HERO_BUILDING_SLIDES = heroBuildingSlides;

  // Auto-slide effect every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BUILDING_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [HERO_BUILDING_SLIDES.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_BUILDING_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_BUILDING_SLIDES.length) % HERO_BUILDING_SLIDES.length);
  };

  // 2. Partner Icons State (Admin right via Desain Web menu)
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogo[]>(() => {
    try {
      const saved = localStorage.getItem('higold_partner_icons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PARTNERS;
  });

  useEffect(() => {
    const handlePartnerUpdate = () => {
      try {
        const saved = localStorage.getItem('higold_partner_icons');
        if (saved) setPartnerLogos(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', handlePartnerUpdate);
    window.addEventListener('higold_partners_updated', handlePartnerUpdate);
    return () => {
      window.removeEventListener('storage', handlePartnerUpdate);
      window.removeEventListener('higold_partners_updated', handlePartnerUpdate);
    };
  }, []);

  // 3. Quick Registration State (5 User Types)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCategory, setRegCategory] = useState<UserCategoryType>('kontraktor');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    if (onRegisterMember) {
      const newUser: CMSUser = {
        id: `usr_${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim() || `${regPhone.replace(/\D/g, '')}@partner.higold.co.id`,
        phone: regPhone.trim(),
        role: regCategory === 'user' ? 'customer_regular' : 'customer_pro',
        userCategory: regCategory,
        royaltyTier: 'bronze',
        royaltyPoints: 100,
        status: 'active',
        companyOrProject: regName,
        joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalOrders: 0,
        totalSpent: 0,
      };
      onRegisterMember(newUser);
    }

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setRegName('');
      setRegPhone('');
      setRegEmail('');
    }, 4500);
  };

  const activeHero = HERO_BUILDING_SLIDES[currentSlide];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-sans">
      
      {/* ================= 1. HERO SLIDER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="relative overflow-hidden group aspect-16/9 sm:aspect-21/9 min-h-[340px] sm:min-h-[460px] flex items-center bg-neutral-900 border border-neutral-200 rounded-lg">
          
          {/* Background image & overlay */}
          <div className="absolute inset-0">
            <img
              src={activeHero.imageUrl}
              alt={activeHero.title}
              className="w-full h-full object-cover transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-transparent" />
          </div>

          {/* Slide Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-8 text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A] text-white text-[11px] font-bold tracking-widest uppercase rounded">
              <ShieldCheck weight="fill" className="w-3.5 h-3.5" />
              <span>{activeHero.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white font-serif">
              {activeHero.title}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-xl font-normal">
              {activeHero.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={activeHero.action}
                className="px-6 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer rounded-md shadow-xs"
              >
                <span>{activeHero.ctaText}</span>
                <ArrowRight weight="bold" className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer rounded-md"
              >
                Kalkulator Kabinet
              </button>
            </div>
          </div>

          {/* Slider Prev / Next Controls */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer rounded-md"
            aria-label="Slide Sebelumnya"
          >
            <CaretLeft weight="bold" className="w-5 h-5 text-[#C8A15A]" />
          </button>

          <button
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer rounded-md"
            aria-label="Slide Berikutnya"
          >
            <CaretRight weight="bold" className="w-5 h-5 text-[#C8A15A]" />
          </button>

          {/* Slide Indicator */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
            {HERO_BUILDING_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-7 h-1 transition-colors cursor-pointer rounded-full ${
                  currentSlide === idx ? 'bg-[#C8A15A]' : 'bg-white/40'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. TENTANG HIGOLD (CLEAN LUXURY - GOLD PRIMARY) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white text-neutral-900 p-8 sm:p-12 border border-neutral-200 rounded-lg shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF6ED] border border-[#C8A15A]/40 text-[#9A7B38] text-xs font-bold uppercase tracking-wider rounded">
                <Medal weight="bold" className="w-4 h-4 text-[#C8A15A]" />
                <span>Pioneer in Architectural Hardware Excellence</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif leading-tight text-neutral-900">
                Tentang Higold: Inovasi Perangkat Keras Dapur Standar Dunia
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Didirikan dengan visi merevolusi fungsionalitas dan estetika ruang dapur, <strong>HIGOLD</strong> adalah pemimpin global dalam manufaktur perangkat keras interior cerdas. Berkolaborasi dengan studio desain legendaris <strong>Pininfarina (Italia)</strong> dan institusi pengujian mekanik <strong>LGA Jerman</strong>, Higold menghadirkan teknologi gerak presisi tak bersuara dan ketahanan hingga 100.000 kali buka-tutup.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                <div className="p-3.5 bg-[#FAF9F6] border border-neutral-200/80 rounded-md">
                  <div className="text-2xl font-bold text-[#C8A15A] font-mono">100.000×</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 uppercase tracking-wider">Uji Ketahanan LGA</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Sertifikasi daya tahan hidrolik resmi Jerman</div>
                </div>

                <div className="p-3.5 bg-[#FAF9F6] border border-neutral-200/80 rounded-md">
                  <div className="text-2xl font-bold text-[#C8A15A] font-mono">SUS 304</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 uppercase tracking-wider">Food-Grade Steel</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Stainless steel murni anti karat seumur hidup</div>
                </div>

                <div className="p-3.5 bg-[#FAF9F6] border border-neutral-200/80 rounded-md">
                  <div className="text-2xl font-bold text-[#C8A15A] font-mono">86+ Negara</div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 uppercase tracking-wider">Jaringan Global</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Showroom & distributor resmi di seluruh benua</div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={onNavigateAllCatalog}
                  className="px-5 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-md shadow-xs"
                >
                  Lihat Seluruh Koleksi Produk
                </button>
                <button
                  onClick={onOpenWhatsApp}
                  className="text-xs font-semibold text-neutral-700 hover:text-[#C8A15A] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Phone weight="bold" className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>Konsultasi Teknis Showroom</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-4/3 overflow-hidden border border-neutral-200 rounded-md">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                  alt="Higold Kitchen Mechanism"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 font-mono flex items-center justify-between rounded-b-md mt-1">
                <span>Distributor Resmi: PT Surya Gemilang Sejati</span>
                <span className="text-[#C8A15A] font-bold">Jakarta Showroom</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. MITRA & PARTNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white border-y border-neutral-100 py-8 sm:py-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="text-[11px] font-bold text-[#C8A15A] uppercase tracking-widest font-mono">
              Trusted by Industry Professionals
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight font-serif">
              Mitra & Rekanan Proyek Higold Indonesia
            </h2>
            <p className="text-xs text-neutral-500">
              Higold dipercaya sebagai hardware resmi oleh pengembang properti terkemuka, kontraktor arsitektur, dan studio kitchen builder di seluruh Indonesia.
            </p>
          </div>

          {/* Simple Hanya Icon Tanpa Kotak Border */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 py-4">
            {partnerLogos.map((p, idx) => (
              <div
                key={p.id}
                className="flex flex-col items-center justify-center gap-2 group cursor-default transition-transform duration-200 hover:-translate-y-1"
                title={`${p.name} — ${p.type} (${p.city || 'Indonesia'})`}
              >
                {p.iconUrl ? (
                  <img
                    src={p.iconUrl}
                    alt={p.name}
                    className="h-9 sm:h-11 w-auto max-w-[120px] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                ) : (
                  <div className="text-neutral-400 group-hover:text-[#C8A15A] transition-colors duration-300 flex items-center justify-center">
                    {renderDefaultPartnerIcon(idx)}
                  </div>
                )}
                <span className="text-[11px] font-medium text-neutral-500 group-hover:text-neutral-900 transition-colors text-center tracking-tight max-w-[120px] truncate">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-xs text-neutral-500 border-t border-neutral-100/80">
            <span>Ingin bermitra dengan Higold sebagai Kontraktor / Konsultan? </span>
            <button
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="font-bold text-[#C8A15A] hover:underline cursor-pointer ml-1"
            >
              Daftar Akun Mitra Sekarang &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ================= 4. PRODUK UNGGULAN & KOLEKSI FLAGSHIP ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-3">
            <div>
              <div className="text-xs font-bold text-[#C8A15A] uppercase tracking-widest font-mono">
                Flagship Architectural Collection
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight mt-1 font-serif">
                Produk Unggulan Higold
              </h2>
            </div>
            <div>
              <button
                onClick={onNavigateAllCatalog}
                className="px-4 py-2 bg-white border border-[#C8A15A] hover:bg-[#FAF6ED] text-[#9A7B38] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded-md"
              >
                <span>Buka Seluruh Halaman Produk</span>
                <ArrowRight weight="bold" className="w-3.5 h-3.5 text-[#C8A15A]" />
              </button>
            </div>
          </div>

          {/* Product Grid (8 Featured Products) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
                isAdded={quickAddedId === prod.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. CABINET CALCULATOR ================= */}
      <section id="cabinet-calculator-section" className="max-w-7xl mx-auto px-4 sm:px-8 scroll-mt-28">
        <CabinetCalculator
          isInline={true}
          onSelectProduct={onSelectProduct}
          onQuickAdd={onQuickAdd}
          products={products}
        />
      </section>

      {/* ================= 6. AJAKAN REGISTER & 5 JENIS PENGGUNA (CLEAN LUXURY - GOLD) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white text-neutral-900 p-6 sm:p-10 border border-neutral-200 rounded-lg shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Royalty Membership Benefits */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF6ED] border border-[#C8A15A]/40 text-[#9A7B38] text-xs font-bold uppercase tracking-wider rounded">
                <Crown weight="bold" className="w-4 h-4 text-[#C8A15A]" />
                <span>Program Royalty & Kemitraan Higold Indonesia</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-serif leading-tight">
                Bergabunglah Bersama Higold: <br />
                Pilih Kategori Akun Sesuai Kebutuhan Anda
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Kami menyediakan skema diskon proyek khusus, poin cashback loyalty, dan file gambar kerja CAD teknis gratis untuk 5 jenis kategori pengguna:
              </p>

              {/* 5 User Types */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: '1. Kontraktor', desc: 'Diskon borongan proyek B2B, opsi tempo invoice, dan prioritas ketersediaan stok.' },
                  { title: '2. Retailer', desc: 'Margin toko kompetitif, materi POS display showroom, dan katalog cetak fisik.' },
                  { title: '3. User (Reguler)', desc: 'Garansi resmi 5 tahun, konsultasi ukuran kabinet gratis, dan opsi bebas ongkir.' },
                  { title: '4. Konsultan', desc: 'Akses penuh file 3D CAD/DWG, sampel material display, dan skema komisi referensi.' },
                  { title: '5. Konsultan & Kontraktor', desc: 'Solusi terpadu: spesifikasi desain interior sekaligus pengadaan perangkat keras langsung.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF9F6] border border-neutral-200 rounded-md">
                    <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                      <CheckCircle weight="fill" className="w-3.5 h-3.5 text-[#C8A15A]" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Registration Form */}
            <div className="lg:col-span-5 bg-[#FAF9F6] text-neutral-900 p-6 sm:p-8 border border-neutral-200 rounded-lg">
              <h3 className="text-base font-bold text-neutral-900 uppercase tracking-tight mb-1">
                Registrasi Cepat Member & Partner
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Dapatkan Welcome Voucher dan tingkatan Royalty Membership seketika.
              </p>

              {regSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center rounded-md animate-in fade-in">
                  <CheckCircle weight="fill" className="w-8 h-8 text-[#C8A15A] mx-auto" />
                  <div className="text-sm font-bold">Pendaftaran Berhasil!</div>
                  <p className="text-xs text-emerald-700">
                    Akun Anda telah terdaftar sebagai kategori <strong>{regCategory}</strong>. Tim CS Higold akan menghubungi via WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInlineRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nama Lengkap / Perusahaan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="cth. PT Karsa Cipta / Bpk. Hendra"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Kategori Akun Pengguna *
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value as UserCategoryType)}
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-[#C8A15A]"
                    >
                      <option value="kontraktor">Kontraktor Proyek</option>
                      <option value="retailer">Retailer Toko / Kitchen Studio</option>
                      <option value="user">User / Pemilik Hunian</option>
                      <option value="konsultan">Konsultan Arsitektur & Interior</option>
                      <option value="konsultan_dan_kontraktor">Konsultan & Kontraktor Terpadu</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-md shadow-xs mt-2"
                  >
                    Daftar Sebagai Member Resmi Higold
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
