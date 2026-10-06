import React from 'react';
import { 
  ShieldCheck, Headset, ArrowSquareOut, 
  List, SignOut
} from '@phosphor-icons/react';
import { CMSAccessRole } from '../../types';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  currentRole: CMSAccessRole;
  adminEmail: string;
  onNavigateHome: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  onToggleMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  currentRole,
  adminEmail,
  onNavigateHome,
  onLogout,
  onToggleMobileSidebar,
}) => {
  const isRoleAdmin = currentRole === 'admin';

  const getTitles = () => {
    const titles: Record<AdminTab, { title: string; subtitle: string }> = {
      dashboard: {
        title: isRoleAdmin ? 'Dashboard Overview Eksekutif' : 'Dashboard Overview CS Desk',
        subtitle: 'Total inventaris, pesanan baru, produk terlaris, analitik penjualan, dan metrik operasional',
      },
      catalog: {
        title: 'Katalog Input Barang & Kategori',
        subtitle: 'Manajemen unggah produk, foto/video, spesifikasi teknis kabinet, serta pembuatan kategori & subkategori',
      },
      categories: {
        title: 'Manajemen Kategori & Icon Hardware',
        subtitle: 'Unggah file icon (PNG/SVG/JPG), atur nama dan deskripsi kategori, serta subkategori produk kabinet',
      },
      orders: {
        title: 'Manajemen Pesanan Masuk',
        subtitle: 'Konfirmasi pembayaran QRIS/Transfer Bank, periksa rincian order, dan faktur',
      },
      shipping: {
        title: 'Logistik & Pengiriman Ekspedisi',
        subtitle: 'Pantau status pelacakan kurir kargo, input nomor resi pengiriman, dan update sampai tujuan',
      },
      reports: {
        title: 'Laporan & Tiket Kendala Pelanggan',
        subtitle: 'Pusat penanganan komplain, klaim garansi 5 tahun, dan konsultasi instalasi teknis',
      },
      reviews: {
        title: 'Ulasan & Kepuasan Pembeli',
        subtitle: 'Moderasi ulasan produk, ulasan bintang pembeli, dan kirimkan balasan resmi CS/Admin',
      },
      design: {
        title: 'Desain Website & Katalog PDF',
        subtitle: 'Ganti banner header slide beranda, atur nama produk banner, unggah e-katalog PDF, dan portofolio',
      },
      promotion: {
        title: 'Manajemen Promosi & Diskon Proyek',
        subtitle: 'Atur voucher promo, diskon khusus kontraktor B2B, flash sale hardware, dan royalti poin',
      },
      broadcast: {
        title: 'Pusat Broadcast Pengumuman',
        subtitle: 'Kirimkan notifikasi dan promosi langsung ke WhatsApp dan email pembeli atau mitra B2B',
      },
      customers: {
        title: 'Pelanggan (Data Orang yang Sudah Membeli)',
        subtitle: 'Histori data pembeli resmi, daftar barang yang dibeli, nomor telepon WhatsApp, dan alamat kirim',
      },
      financial: {
        title: 'Flow Keuangan Finansial (Admin Only)',
        subtitle: 'Arus kas masuk & keluar, omzet penjualan, laba bersih, saldo rekening BCA/Mandiri, dan settlement QRIS',
      },
      manage: {
        title: 'Kelola Jenis Akun & Password Login (Admin Only)',
        subtitle: 'Kelola 7 jenis akun pengguna (Admin, CS, Pelanggan, Kontraktor, Retailer, Konsultan) dan password kredensial',
      },
    };

    return titles[activeTab] || titles.dashboard;
  };

  const { title, subtitle } = getTitles();

  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-10 shadow-xs">
      {/* Left: Mobile trigger & Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
        >
          <List className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {activeTab === 'financial' && isRoleAdmin && (
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#C8A15A]/15 text-[#9A7B38] border border-[#C8A15A]/40 rounded">
                Admin Exclusive
              </span>
            )}
          </h1>
          <p className="text-[11px] text-neutral-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Authenticated Role Status, Store Link, and Direct Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Verified Role Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border ${
          isRoleAdmin
            ? 'bg-neutral-950 text-[#C8A15A] border-neutral-800'
            : 'bg-sky-500 text-white border-sky-600'
        }`}>
          {isRoleAdmin ? (
            <>
              <ShieldCheck weight="fill" className="w-4 h-4 text-[#C8A15A] shrink-0" />
              <span>Full Admin (Emas)</span>
            </>
          ) : (
            <>
              <Headset weight="fill" className="w-4 h-4 text-white shrink-0" />
              <span>CS Desk (Biru Langit)</span>
            </>
          )}
        </div>

        {/* View Storefront button */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer border border-neutral-300 rounded-lg"
          title="Buka Website HIGOLD"
        >
          <ArrowSquareOut className="w-4 h-4" />
          <span className="hidden sm:inline">Lihat Web</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer border border-rose-200"
          title="Keluar dari sesi CMS"
        >
          <SignOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
