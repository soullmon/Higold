import React from 'react';
import { House, SquaresFour, Calculator, ShoppingCart, User } from '@phosphor-icons/react';
import { NavPage } from './Navbar';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
  currentPage: NavPage;
  cartCount: number;
  userProfile?: UserProfile | null;
  onNavigate: (page: NavPage) => void;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'profile') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  cartCount,
  userProfile,
  onNavigate,
  onOpenCart,
  onOpenCalculator,
  onOpenAuth,
}) => {
  return (
    <nav 
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom select-none"
      aria-label="Navigasi Utama Ponsel"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Beranda */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentPage === 'home'
              ? 'text-[#C8A15A] font-bold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <House className="w-5 h-5 mb-0.5" weight={currentPage === 'home' ? 'fill' : 'regular'} />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* 2. Katalog */}
        <button
          onClick={() => {
            onNavigate('category');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentPage === 'category'
              ? 'text-[#C8A15A] font-bold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <SquaresFour className="w-5 h-5 mb-0.5" weight={currentPage === 'category' ? 'fill' : 'regular'} />
          <span className="text-[10px] tracking-tight">Katalog</span>
        </button>

        {/* 3. Kalkulator Kabinet (Highlighted Center) */}
        <button
          onClick={onOpenCalculator}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-neutral-600 hover:text-[#C8A15A] transition-colors cursor-pointer relative group"
        >
          <div className="w-8 h-8 rounded-full bg-[#171717] group-hover:bg-[#C8A15A] text-white flex items-center justify-center shadow-sm -mt-2 transition-colors">
            <Calculator className="w-4 h-4 text-[#C8A15A] group-hover:text-white" weight="bold" />
          </div>
          <span className="text-[10px] text-neutral-600 group-hover:text-[#C8A15A] tracking-tight font-medium mt-0.5">
            Kalkulator
          </span>
        </button>

        {/* 4. Keranjang */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C8A15A] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Keranjang</span>
        </button>

        {/* 5. Akun / Profil */}
        <button
          onClick={() => {
            if (userProfile) {
              onNavigate('profile');
            } else {
              onOpenAuth('login');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentPage === 'profile'
              ? 'text-[#C8A15A] font-bold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          {userProfile ? (
            <div className="w-5 h-5 rounded-full bg-[#C8A15A] text-white text-[10px] font-bold flex items-center justify-center mb-0.5 shadow-xs">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
          ) : (
            <User className="w-5 h-5 mb-0.5" weight={currentPage === 'profile' ? 'fill' : 'regular'} />
          )}
          <span className="text-[10px] tracking-tight truncate max-w-14">
            {userProfile ? 'Profil' : 'Masuk'}
          </span>
        </button>
      </div>
    </nav>
  );
};
