import React, { useState } from 'react';
import { 
  DeviceMobile, MagnifyingGlass, ShoppingCart, 
  MapPin, CaretDown, User, Check, List, X,
  House, SquaresFour, FileText, Wrench, Calculator,
  Info, PhoneCall, ShieldCheck, WhatsappLogo, DownloadSimple
} from '@phosphor-icons/react';
import { CategoryId, CategoryInfo, UserProfile } from '../types';
import { INDONESIA_CITIES } from '../data/indonesiaRegions';

export type NavPage = 
  | 'home' 
  | 'category' 
  | 'portfolio' 
  | 'contact' 
  | 'support' 
  | 'admin'
  | 'profile'
  | 'terms'
  | 'privacy'
  | 'howToOrder'
  | 'shipping'
  | 'returns'
  | 'payment'
  | 'showroom'
  | 'promo'
  | 'about';

interface NavbarProps {
  currentPage: NavPage;
  activeCategory: CategoryId | 'all';
  cartCount: number;
  cartTotalAmount?: number;
  searchQuery?: string;
  categories?: CategoryInfo[];
  userProfile?: UserProfile | null;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onSearchChange?: (q: string) => void;
  onSearchSubmit?: () => void;
  onNavigate: (page: NavPage, catId?: CategoryId | 'all', subcatId?: string) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWhatsApp: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'profile') => void;
  onOpenTrackingModal?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenPWAInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activeCategory,
  cartCount,
  cartTotalAmount = 0,
  searchQuery = '',
  categories = [],
  userProfile,
  selectedCity = 'Jakarta Pusat',
  onSelectCity,
  onSearchChange,
  onSearchSubmit,
  onNavigate,
  onOpenCart,
  onOpenSearch,
  onOpenWhatsApp,
  onOpenCalculator,
  onOpenAuth,
  onOpenTrackingModal,
  onOpenAdminLogin,
  onOpenPWAInstall,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(selectedCity);
  const [citySearchFilter, setCitySearchFilter] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredNavbarCities = INDONESIA_CITIES.filter((c) => {
    if (!citySearchFilter.trim()) return true;
    const q = citySearchFilter.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q);
  });

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localQuery);
    }
    if (onSearchSubmit) {
      onSearchSubmit();
    } else {
      onNavigate('category', 'all');
    }
  };

  const handleCitySelect = (cityName: string) => {
    setCurrentCity(cityName);
    if (onSelectCity) onSelectCity(cityName);
    setIsCityDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white font-sans select-none border-b border-neutral-200">
      
      {/* ================= BARIS 1: INSTALL APP - NAV LINKS - CART - MASUK/DAFTAR ================= */}
      <div className="bg-[#FAF9F6] border-b border-neutral-200/70 px-3 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Install Web App with Interactive Guidance */}
          <button
            type="button"
            onClick={onOpenPWAInstall}
            className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium hover:text-[#C8A15A] transition-colors cursor-pointer group shrink-0"
            title="Panduan & Pasang Aplikasi Web HIGOLD"
          >
            <DeviceMobile className="w-4 h-4 text-[#C8A15A] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-neutral-800 group-hover:text-[#C8A15A]">Install Web App</span>
            <span className="hidden sm:inline text-[9px] bg-[#C8A15A]/15 text-[#9A7B38] font-bold px-1.5 py-0.5 rounded border border-[#C8A15A]/30">
              Panduan
            </span>
          </button>

          {/* Center: Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
                currentPage === 'home' || currentPage === 'about'
                  ? 'text-[#C8A15A] font-semibold border-b-2 border-[#C8A15A]'
                  : 'text-neutral-600 hover:text-[#C8A15A]'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => onNavigate('category', 'all')}
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
                currentPage === 'category'
                  ? 'text-[#C8A15A] font-semibold border-b-2 border-[#C8A15A]'
                  : 'text-neutral-600 hover:text-[#C8A15A]'
              }`}
            >
              Product
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
                currentPage === 'portfolio'
                  ? 'text-[#C8A15A] font-semibold border-b-2 border-[#C8A15A]'
                  : 'text-neutral-600 hover:text-[#C8A15A]'
              }`}
            >
              Portfolio
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 ${
                currentPage === 'contact' || currentPage === 'support'
                  ? 'text-[#C8A15A] font-semibold border-b-2 border-[#C8A15A]'
                  : 'text-neutral-600 hover:text-[#C8A15A]'
              }`}
            >
              Service
            </button>

            <button
              type="button"
              onClick={onOpenCalculator}
              className="text-xs sm:text-sm font-medium transition-colors cursor-pointer py-1 text-neutral-600 hover:text-[#C8A15A]"
            >
              Kalkulator Kabinet
            </button>
          </nav>

          {/* Right: Cart, Divider, User / Masuk & Daftar (Responsive) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 text-neutral-800 hover:text-[#C8A15A] transition-colors cursor-pointer"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C8A15A] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Subtle Divider */}
            <div className="h-4 w-px bg-neutral-300 mx-0.5" />

            {/* User Session or Masuk / Daftar */}
            {userProfile ? (
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-md transition-colors cursor-pointer text-left"
              >
                <div className="w-5 h-5 rounded-full bg-[#C8A15A] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-neutral-800 truncate max-w-[70px] sm:max-w-[110px]">
                  {userProfile.name}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-3.5 py-1 text-xs font-semibold rounded-md border border-[#C8A15A] text-[#9A7B38] bg-white hover:bg-[#FAF6ED] transition-colors cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-2.5 sm:px-3.5 py-1 text-xs font-bold rounded-md bg-[#C8A15A] hover:bg-[#B8924B] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BARIS 2: HAMBURGER (MOBILE) - LOGO - SEARCH BAR - DIKIRIM KE ================= */}
      <div className="bg-white px-3 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-6">
          
          {/* Mobile Hamburger Menu Button (screens < md) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 -ml-1 text-neutral-800 hover:text-[#C8A15A] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            <List className="w-6 h-6" />
          </button>

          {/* 1. LOGO HIGOLD® RESMI */}
          <button
            onClick={() => onNavigate('home')}
            className="cursor-pointer text-left focus:outline-none shrink-0 flex items-center gap-2 group"
            title="HIGOLD Indonesia"
          >
            <img
              src="/higold-logo.png"
              alt="HIGOLD"
              className="h-6 sm:h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                if (sibling) sibling.style.display = 'flex';
              }}
            />
            <div className="hidden sm:flex items-baseline font-serif tracking-widest">
              <span className="text-xl sm:text-2xl font-extrabold text-[#C8A15A] uppercase group-hover:text-[#B8924B] transition-colors">
                HIGOLD
              </span>
              <span className="text-[10px] text-[#C8A15A] font-bold ml-0.5">®</span>
            </div>
          </button>

          {/* 2. SEARCH BAR (Center Responsive) */}
          <div className="flex-1 max-w-2xl min-w-0">
            <form onSubmit={handleFormSearch} className="relative flex items-center">
              <div className="w-full relative flex items-center border border-neutral-300 rounded-md bg-white hover:border-neutral-400 focus-within:border-[#C8A15A] transition-colors">
                <MagnifyingGlass className="w-4 h-4 text-neutral-400 ml-2.5 sm:ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={onSearchChange ? searchQuery : localQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalQuery(val);
                    if (onSearchChange) onSearchChange(val);
                  }}
                  placeholder="Cari hardware di HIGOLD..."
                  className="w-full pl-2 sm:pl-2.5 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
                />
              </div>
            </form>
          </div>

          {/* 3. DIKIRIM KE [KOTA] (Right) */}
          <div className="relative shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer py-1"
            >
              <MapPin className="w-4 h-4 text-[#C8A15A] shrink-0" />
              <span className="text-neutral-500 hidden lg:inline">Dikirim ke</span>
              <span className="font-bold text-neutral-900 truncate max-w-[80px] sm:max-w-[130px]">{currentCity}</span>
              <CaretDown className="w-3.5 h-3.5 text-neutral-600" />
            </button>

            {/* City Selector Dropdown */}
            {isCityDropdownOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-72 bg-white border border-neutral-200 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in"
                onMouseLeave={() => setIsCityDropdownOpen(false)}
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-2">
                  <div className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                    Pilih Wilayah Pengiriman
                  </div>
                  <span className="text-[10px] text-[#C8A15A] font-semibold">Seluruh Indonesia</span>
                </div>

                {/* Search input for cities */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={citySearchFilter}
                    onChange={(e) => setCitySearchFilter(e.target.value)}
                    placeholder="Cari Kota / Kabupaten..."
                    className="w-full pl-2.5 pr-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-[#C8A15A]"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-neutral-50 py-1">
                  {filteredNavbarCities.length === 0 ? (
                    <div className="p-3 text-center text-xs text-neutral-400">
                      Kota/Kabupaten tidak ditemukan
                    </div>
                  ) : (
                    filteredNavbarCities.map((c) => {
                      const isFreeOngkir = c.distanceKm <= 10;
                      return (
                        <button
                          key={c.name}
                          onClick={() => handleCitySelect(c.name)}
                          className={`w-full text-left px-2.5 py-2 text-xs flex items-center justify-between rounded hover:bg-neutral-50 cursor-pointer ${
                            currentCity === c.name ? 'font-bold text-[#C8A15A] bg-[#FAF6ED]/40' : 'text-neutral-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                              <span>{c.province}</span>
                              <span>•</span>
                              <span>{c.distanceKm} km</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isFreeOngkir ? (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                Bebas Ongkir
                              </span>
                            ) : (
                              <span className="text-[9px] text-neutral-400">
                                Biteship
                              </span>
                            )}
                            {currentCity === c.name && <Check className="w-3.5 h-3.5 text-[#C8A15A]" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= RESPONSIVE MOBILE MENU DRAWER (SLIDE-OVER) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
            
            {/* Drawer Top Header */}
            <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-[#C8A15A]/30">
              <div className="flex items-center gap-2">
                <img src="/higold-logo.png" alt="HIGOLD" className="h-6 w-auto object-contain" />
                <span className="font-serif font-bold text-sm tracking-widest text-[#C8A15A]">HIGOLD</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card / Auth Action */}
            <div className="p-4 bg-[#FAF9F6] border-b border-neutral-200">
              {userProfile ? (
                <div 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('profile');
                  }}
                  className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-neutral-200 cursor-pointer shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C8A15A] text-white font-bold text-sm flex items-center justify-center">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-neutral-900 truncate">{userProfile.name}</div>
                    <div className="text-[11px] text-neutral-500 truncate">{userProfile.email}</div>
                    <span className="inline-block mt-0.5 text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                      Pelanggan Resmi
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg border border-[#C8A15A] text-[#9A7B38] bg-white hover:bg-[#FAF6ED] transition-colors"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#C8A15A] hover:bg-[#B8924B] text-white transition-colors shadow-xs"
                  >
                    Daftar Akun
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Menu Links */}
            <div className="p-3 space-y-1 flex-1">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1.5">
                Menu Utama
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('home');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  currentPage === 'home' ? 'bg-[#FAF6ED] text-[#C8A15A] font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <House className="w-4 h-4 text-[#C8A15A]" />
                <span>Beranda</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('category', 'all');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  currentPage === 'category' ? 'bg-[#FAF6ED] text-[#C8A15A] font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <SquaresFour className="w-4 h-4 text-[#C8A15A]" />
                <span>Katalog Produk Hardware</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('portfolio');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  currentPage === 'portfolio' ? 'bg-[#FAF6ED] text-[#C8A15A] font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <FileText className="w-4 h-4 text-[#C8A15A]" />
                <span>Portofolio & Unduh e-Katalog PDF</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCalculator();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <Calculator className="w-4 h-4 text-[#C8A15A]" />
                <span>Kalkulator Kabinet Dapur</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('about');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  currentPage === 'about' ? 'bg-[#FAF6ED] text-[#C8A15A] font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Info className="w-4 h-4 text-[#C8A15A]" />
                <span>Tentang HIGOLD</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('contact');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  currentPage === 'contact' ? 'bg-[#FAF6ED] text-[#C8A15A] font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-[#C8A15A]" />
                <span>Kontak & Showroom</span>
              </button>

              {/* Install Web App CTA in Drawer */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenPWAInstall) onOpenPWAInstall();
                  }}
                  className="w-full p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 text-[#C8A15A] flex items-center justify-center">
                      <DeviceMobile className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-[#C8A15A]">
                        Pasang Aplikasi Web
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Buka panduan instalasi di HP Anda
                      </div>
                    </div>
                  </div>
                  <DownloadSimple className="w-4 h-4 text-[#C8A15A]" />
                </button>
              </div>

              {/* WhatsApp Consultation Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenWhatsApp();
                  }}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <WhatsappLogo className="w-4 h-4" weight="fill" />
                  <span>Konsultasi WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Bottom Footer inside Drawer */}
            <div className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-[11px] text-neutral-500">
              <span>HIGOLD Indonesia Official</span>
              {onOpenAdminLogin && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="text-neutral-400 hover:text-neutral-700 text-[10px] underline"
                >
                  CMS Staff
                </button>
              )}
            </div>

          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

    </header>
  );
};
