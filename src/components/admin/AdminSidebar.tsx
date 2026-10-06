import React from 'react';
import { 
  SquaresFour, Package, ShoppingBag, Truck, 
  Lifebuoy, ChatCircleText, PaintBrush, Broadcast, 
  Users, CurrencyDollar, Gear, ShieldCheck, 
  Headset, CaretLeft, CaretRight, ArrowSquareOut, SignOut,
  Gift, FolderSimple
} from '@phosphor-icons/react';
import { CMSAccessRole } from '../../types';

export type AdminTab = 
  | 'dashboard'   // 1. Dashboard overview
  | 'catalog'     // 2. Katalog input (termasuk Kategori)
  | 'categories'  // 3. Kategori & Icon Hardware
  | 'orders'      // 4. Pesanan
  | 'shipping'    // 5. Pengiriman
  | 'promotion'   // 6. Promosi & Reward Poin (Admin)
  | 'reports'     // 7. Laporan
  | 'reviews'     // 8. Ulasan
  | 'design'      // 9. Desain website
  | 'broadcast'   // 10. Broadcast
  | 'customers'   // 11. Pelanggan
  | 'financial'   // 12. Keuangan (Admin only)
  | 'manage';     // 13. Kelola (Admin only)

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentRole: CMSAccessRole;
  onNavigateHome: () => void;
  onLogout: () => void;
  adminEmail: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  counts: {
    products: number;
    categories: number;
    users: number;
    reviews: number;
    reports: number;
    orders?: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onNavigateHome,
  onLogout,
  adminEmail,
  isCollapsed,
  onToggleCollapse,
  counts,
}) => {
  const isRoleAdmin = currentRole === 'admin';

  // Admin Menu items: Includes Promotion for point rewards & campaigns
  const adminMenuItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard Overview',
      icon: SquaresFour,
      badge: null,
    },
    {
      id: 'catalog' as AdminTab,
      label: 'Katalog Input',
      icon: Package,
      badge: counts.products,
    },
    {
      id: 'categories' as AdminTab,
      label: 'Kategori & Icon',
      icon: FolderSimple,
      badge: counts.categories,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Pesanan',
      icon: ShoppingBag,
      badge: counts.orders || 5,
    },
    {
      id: 'shipping' as AdminTab,
      label: 'Pengiriman',
      icon: Truck,
      badge: null,
    },
    {
      id: 'promotion' as AdminTab,
      label: 'Promosi & Poin Reward',
      icon: Gift,
      badge: 'Traveling/Promo',
    },
    {
      id: 'reports' as AdminTab,
      label: 'Laporan',
      icon: Lifebuoy,
      badge: counts.reports,
    },
    {
      id: 'reviews' as AdminTab,
      label: 'Ulasan',
      icon: ChatCircleText,
      badge: counts.reviews,
    },
    {
      id: 'design' as AdminTab,
      label: 'Desain Website',
      icon: PaintBrush,
      badge: 'Banner/PDF',
    },
    {
      id: 'broadcast' as AdminTab,
      label: 'Broadcast',
      icon: Broadcast,
      badge: 'WA/Email',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Pelanggan',
      icon: Users,
      badge: counts.orders || 5,
    },
    {
      id: 'financial' as AdminTab,
      label: 'Keuangan',
      icon: CurrencyDollar,
      badge: 'Kas/Omzet',
    },
    {
      id: 'manage' as AdminTab,
      label: 'Kelola',
      icon: Gear,
      badge: 'Akun & PIN',
    },
  ];

  // CS Menu Items (Excludes Keuangan, Kelola, and Promotion settings)
  const csMenuItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard Overview',
      icon: SquaresFour,
      badge: null,
    },
    {
      id: 'catalog' as AdminTab,
      label: 'Katalog Input',
      icon: Package,
      badge: counts.products,
    },
    {
      id: 'categories' as AdminTab,
      label: 'Kategori & Icon',
      icon: FolderSimple,
      badge: counts.categories,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Pesanan',
      icon: ShoppingBag,
      badge: counts.orders || 5,
    },
    {
      id: 'shipping' as AdminTab,
      label: 'Pengiriman',
      icon: Truck,
      badge: null,
    },
    {
      id: 'reports' as AdminTab,
      label: 'Laporan',
      icon: Lifebuoy,
      badge: counts.reports,
    },
    {
      id: 'reviews' as AdminTab,
      label: 'Ulasan',
      icon: ChatCircleText,
      badge: counts.reviews,
    },
    {
      id: 'design' as AdminTab,
      label: 'Desain Website',
      icon: PaintBrush,
      badge: 'Banner/PDF',
    },
    {
      id: 'broadcast' as AdminTab,
      label: 'Broadcast',
      icon: Broadcast,
      badge: 'WA/Email',
    },
    {
      id: 'customers' as AdminTab,
      label: 'Pelanggan',
      icon: Users,
      badge: counts.orders || 5,
    },
  ];

  const menuItems = isRoleAdmin ? adminMenuItems : csMenuItems;

  return (
    <aside 
      className="bg-neutral-950 text-neutral-300 flex flex-col shrink-0 border-r border-neutral-800 transition-all duration-200 select-none"
      style={{ width: isCollapsed ? '4.5rem' : '16rem' }}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 bg-black flex items-center justify-between border-b border-neutral-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src="/higold-logo.png"
              alt="HIGOLD"
              className="h-6 w-auto object-contain bg-white/10 p-0.5 rounded"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="font-extrabold text-xs tracking-wider text-white uppercase font-sans">
              HIGOLD <span className={isRoleAdmin ? 'text-[#C8A15A]' : 'text-sky-400'}>CMS</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
              isRoleAdmin
                ? 'bg-neutral-900 text-[#C8A15A] border border-[#C8A15A]/40'
                : 'bg-sky-950/70 text-sky-300 border border-sky-500/40'
            }`}>
              {isRoleAdmin ? 'ADMIN' : 'CS'}
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer ml-auto"
          title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {isCollapsed ? <CaretRight className="w-4 h-4" /> : <CaretLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Authenticated Role Status Badge */}
      <div className="p-3 border-b border-neutral-800/80 bg-neutral-900/60">
        {!isCollapsed ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Hak Akses Terverifikasi
              </span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                isRoleAdmin
                  ? 'bg-[#C8A15A]/15 text-[#C8A15A] border-[#C8A15A]/40'
                  : 'bg-sky-500/15 text-sky-300 border-sky-400/30'
              }`}>
                Sesi Aktif
              </span>
            </div>
            
            <div className={`p-2 rounded-md border flex items-center gap-2.5 ${
              isRoleAdmin
                ? 'bg-neutral-950 border-[#C8A15A]/40 text-[#C8A15A]'
                : 'bg-sky-950/40 border-sky-500/40 text-sky-200'
            }`}>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white font-bold'
              }`}>
                {isRoleAdmin ? (
                  <ShieldCheck weight="fill" className="w-4 h-4" />
                ) : (
                  <Headset weight="fill" className="w-4 h-4" />
                )}
              </div>
              <div className="overflow-hidden leading-tight">
                <div className="font-bold text-[11px] truncate text-white">
                  {isRoleAdmin ? 'Master Administrator' : 'Customer Service Desk'}
                </div>
                <div className="text-[10px] text-neutral-400 truncate">
                  {isRoleAdmin ? 'Tema Emas (Akses Penuh)' : 'Tema Biru Langit (Operasional CS)'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1" title={isRoleAdmin ? 'Master Admin (Emas)' : 'Customer Service (Biru Langit)'}>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
              isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950' : 'bg-sky-500 text-white'
            }`}>
              {isRoleAdmin ? (
                <ShieldCheck weight="fill" className="w-4 h-4" />
              ) : (
                <Headset weight="fill" className="w-4 h-4" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          const activeClass = isRoleAdmin
            ? 'bg-[#C8A15A] text-neutral-950 font-bold shadow-xs'
            : 'bg-sky-500 text-white font-bold shadow-xs';

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors text-left cursor-pointer ${
                isActive
                  ? activeClass
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${
                isActive
                  ? (isRoleAdmin ? 'text-neutral-950' : 'text-white')
                  : 'text-neutral-400'
              }`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      isActive 
                        ? (isRoleAdmin ? 'bg-neutral-950/20 text-neutral-950' : 'bg-white/20 text-white') 
                        : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-2 border-t border-neutral-800 space-y-1 bg-black">
        <button
          onClick={onNavigateHome}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
          title="Buka Website HIGOLD"
        >
          <ArrowSquareOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Lihat Website Toko</span>}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
          title="Keluar dari CMS"
        >
          <SignOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Keluar (Logout)</span>}
        </button>

        {!isCollapsed && (
          <div className="px-3 py-2 pt-2 border-t border-neutral-800 text-[10px] text-neutral-500 truncate">
            <span className="block text-neutral-300 font-medium truncate">{adminEmail}</span>
            <span className="text-neutral-500">HIGOLD Hardware Management</span>
          </div>
        )}
      </div>
    </aside>
  );
};
