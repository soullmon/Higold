import React from 'react';
import { 
  Package, Users, ChatCircleText, 
  Lifebuoy, UploadSimple, ArrowUpRight, CheckCircle, 
  Clock, WarningCircle, Warning, ShieldCheck, Headset,
  Plus, Check, PaperPlaneTilt, Phone, Star,
  ArrowRight, TrendUp, CurrencyDollar,
  ShoppingBag, Trophy, ChartBar, Truck, Sparkle
} from '@phosphor-icons/react';
import { formatRupiah } from '../../utils/format';
import { Product, CMSAccessRole, CMSUser, ProductReview, CustomerReportTicket, Order } from '../../types';
import { AdminTab } from './AdminSidebar';
import { INITIAL_CUSTOMER_ORDERS } from '../../data/cmsData';

interface AdminDashboardTabProps {
  products: Product[];
  users: CMSUser[];
  reviews: ProductReview[];
  reports: CustomerReportTicket[];
  orders?: Order[];
  currentRole: CMSAccessRole;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  products,
  users,
  reviews,
  reports,
  orders = INITIAL_CUSTOMER_ORDERS,
  currentRole,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const isRoleAdmin = currentRole === 'admin';
  const activeOrders = orders && orders.length > 0 ? orders : INITIAL_CUSTOMER_ORDERS;

  // Inventory & Product stats
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stockQuantity, 0);
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5);

  // User stats
  const pendingUsers = users.filter(u => u.status === 'pending_approval');
  const proPartners = users.filter(u => 
    u.officialAccountType === 'Kontraktor' || 
    u.officialAccountType === 'Retailer' || 
    u.officialAccountType === 'Konsultan' || 
    u.officialAccountType === 'Konsultan & Kontraktor' ||
    u.role === 'customer_pro'
  );

  // Support & tickets
  const openReports = reports.filter(r => r.status === 'open' || r.status === 'in_progress');
  const urgentReports = reports.filter(r => r.priority === 'urgent' || r.priority === 'high');
  const unrepliedReviews = reviews.filter(r => !r.reply);

  // Orders & Financial overview
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const newOrdersCount = activeOrders.filter(o => o.trackingStatus === 'diproses' || o.trackingStatus === 'qc_gudang').length;
  const customersCount = activeOrders.length;

  // Best seller calculation (Terlaris)
  const bestSellers = [...products]
    .map(p => ({
      ...p,
      calculatedSold: (p.soldCount || 0) + (p.price < 5000000 ? 12 : 5),
      calculatedRevenue: (p.price * ((p.soldCount || 0) + (p.price < 5000000 ? 12 : 5))),
    }))
    .sort((a, b) => b.calculatedSold - a.calculatedSold)
    .slice(0, 5);

  // ==========================================
  // 1. DASHBOARD KHUSUS CS (Customer Service) - THEME BIRU LANGIT (SKY BLUE)
  // ==========================================
  if (!isRoleAdmin) {
    return (
      <div className="space-y-6">
        {/* CS Welcome Banner - Biru Langit (Sky Blue) Bukan Biru Tua */}
        <div className="bg-sky-500 p-6 rounded-lg text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-md bg-white/20 text-white flex items-center justify-center shrink-0">
              <Headset weight="bold" className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Meja Operasional Layanan Pelanggan (CS Desk)
                </h2>
                <span className="px-2 py-0.5 bg-white/25 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Operasional CS Aktif
                </span>
              </div>
              <p className="text-xs text-sky-100 mt-1 max-w-2xl leading-relaxed">
                Prioritas kerja CS: memproses pesanan baru pembeli, mengonfirmasi pengiriman, merespons ulasan pembeli, dan menangani tiket kendala pelanggan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <ShoppingBag weight="bold" className="w-4 h-4" />
              <span>Kelola Pesanan Masuk ({newOrdersCount})</span>
            </button>
          </div>
        </div>

        {/* CS 4 Key Operational Metrics Cards - Biru Langit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pesanan Masuk Perlu Follow-up */}
          <div 
            onClick={() => onNavigateTab('orders')}
            className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-sky-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Pesanan Masuk</span>
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <ShoppingBag weight="bold" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-sky-700">{newOrdersCount} Pesanan</div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
              <span>Perlu konfirmasi pembayaran/resi</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
            </div>
          </div>

          {/* Card 2: Pelanggan yang Sudah Membeli */}
          <div 
            onClick={() => onNavigateTab('customers')}
            className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-sky-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Data Pelanggan</span>
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users weight="bold" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-neutral-900">{customersCount} Pembeli</div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
              <span>Data kontak & alamat kirim</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
            </div>
          </div>

          {/* Card 3: Tiket Kendala Pelanggan */}
          <div 
            onClick={() => onNavigateTab('reports')}
            className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-sky-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Tiket Bantuan / Garansi</span>
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <Lifebuoy weight="bold" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-neutral-900">{openReports.length} Kasus</div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
              <span>{urgentReports.length} Prioritas Mendesak</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
            </div>
          </div>

          {/* Card 4: Ulasan Menunggu Balasan CS */}
          <div 
            onClick={() => onNavigateTab('reviews')}
            className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-sky-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Ulasan Pembeli</span>
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center">
                <ChatCircleText weight="bold" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-neutral-900">{unrepliedReviews.length} Menunggu Respon</div>
            <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
              <span>Total {reviews.length} ulasan produk</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
            </div>
          </div>
        </div>

        {/* CS Main Task Sections: Pesanan Masuk & Tiket Kendala */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section: Pesanan Terbaru Membutuhkan Tindakan */}
          <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
                  <ShoppingBag weight="bold" className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Pesanan Masuk Terbaru
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Pesanan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {activeOrders.slice(0, 4).map((order) => (
                <div 
                  key={order.id}
                  onClick={() => onNavigateTab('orders')}
                  className="p-3 rounded-md border border-neutral-100 bg-neutral-50 hover:bg-sky-50/50 hover:border-sky-300 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-neutral-900">{order.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        order.paymentStatus === 'confirmed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.paymentStatus === 'confirmed' ? 'Lunas' : 'Menunggu Verifikasi'}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-600">
                      <strong>{order.customer.fullName}</strong> ({order.customer.city}) · {order.items.length} Barang
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-neutral-900">
                      {formatRupiah(order.totalAmount)}
                    </div>
                    <div className="text-[10px] text-neutral-500 capitalize">
                      Status: {order.trackingStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Tiket Bantuan & Garansi Aktif */}
          <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Lifebuoy weight="bold" className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Tiket Pengaduan & Garansi
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('reports')}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Tiket</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {reports.slice(0, 4).map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => onNavigateTab('reports')}
                  className="p-3 rounded-md border border-neutral-100 bg-neutral-50 hover:bg-sky-50/50 hover:border-sky-300 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-neutral-900">{ticket.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        ticket.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-800 font-medium truncate max-w-xs">
                      {ticket.title}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {ticket.customerName} ({ticket.customerContact})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded capitalize ${
                      ticket.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CS Quick Actions Bar */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-neutral-700 uppercase tracking-wider">Aksi Cepat CS:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('catalog')}
              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>Input Barang Baru</span>
            </button>
            <button
              onClick={() => onNavigateTab('shipping')}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
            >
              <Truck weight="bold" className="w-3.5 h-3.5" />
              <span>Input Resi Pengiriman</span>
            </button>
            <button
              onClick={() => onNavigateTab('broadcast')}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
            >
              <PaperPlaneTilt weight="bold" className="w-3.5 h-3.5" />
              <span>Broadcast WA Pelanggan</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. DASHBOARD KHUSUS ADMIN (Master Administrator) - THEME EMAS
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Admin Welcome Banner - Emas / Elegan */}
      <div className="bg-neutral-950 p-6 rounded-lg border border-[#C8A15A]/40 text-neutral-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-md bg-[#C8A15A] text-neutral-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
            <ShieldCheck weight="fill" className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Dashboard Eksekutif Master Administrator
              </h2>
              <span className="px-2 py-0.5 bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40 text-[10px] font-bold rounded uppercase tracking-wider">
                Akses Penuh
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Pusat kendali operasional & finansial HIGOLD: Total nilai inventaris, pesanan baru, produk terlaris, data pelanggan pembeli, analitik penjualan, dan manajemen 7 jenis akun pengguna.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('financial')}
            className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <CurrencyDollar weight="bold" className="w-4 h-4" />
            <span>Flow Keuangan Finansial</span>
          </button>
        </div>
      </div>

      {/* Admin 5 Overview Metrics Grid - Emas / Neutral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Nilai Inventaris */}
        <div 
          onClick={() => onNavigateTab('catalog')}
          className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-[#C8A15A] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Total Inventaris</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-[#C8A15A] flex items-center justify-center">
              <Package weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-neutral-900 font-mono">{formatRupiah(totalInventoryValue)}</div>
          <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>{products.length} SKU Aktif</span>
            <ArrowUpRight className="w-3 h-3 text-[#C8A15A]" />
          </div>
        </div>

        {/* Card 2: Pesanan Baru (Emas / Amber, No Blue) */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-[#C8A15A] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Pesanan Baru</span>
            <div className="w-7 h-7 rounded-md bg-[#FAF6ED] text-[#C8A15A] flex items-center justify-center">
              <ShoppingBag weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-[#8A6B29]">{newOrdersCount} Order</div>
          <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Perlu diproses</span>
            <ArrowUpRight className="w-3 h-3 text-[#C8A15A]" />
          </div>
        </div>

        {/* Card 3: Pelanggan yang Sudah Membeli */}
        <div 
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-[#C8A15A] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Pelanggan Pembeli</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-700">{customersCount} Orang</div>
          <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Riwayat transaksi</span>
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
          </div>
        </div>

        {/* Card 4: Omzet Finansial */}
        <div 
          onClick={() => onNavigateTab('financial')}
          className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-[#C8A15A] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Total Omzet</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-[#C8A15A] flex items-center justify-center">
              <TrendUp weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-neutral-900 font-mono">{formatRupiah(totalRevenue)}</div>
          <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Kas masuk valid</span>
            <ArrowUpRight className="w-3 h-3 text-[#C8A15A]" />
          </div>
        </div>

        {/* Card 5: Approval Akun B2B */}
        <div 
          onClick={() => onNavigateTab('manage')}
          className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs hover:border-[#C8A15A] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Approval Akun</span>
            <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-neutral-900">{pendingUsers.length} Menunggu</div>
          <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>{proPartners.length} Mitra Terdaftar</span>
            <ArrowUpRight className="w-3 h-3 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Row 2: Produk Terlaris (Best Sellers) & Analitik Penjualan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1-2: Produk Terlaris (Terlaris Ranking) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-50 text-[#C8A15A] flex items-center justify-center">
                <Trophy weight="bold" className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Produk Terlaris (Best Seller Performance)
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Ranking produk hardware paling diminati arsitek, desainer, dan retail
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('catalog')}
              className="text-xs text-[#9A7B38] hover:text-[#7A6129] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Katalog Lengkap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2">Rank</th>
                  <th className="px-3 py-2">Produk & SKU</th>
                  <th className="px-3 py-2">Seri</th>
                  <th className="px-3 py-2 text-center">Unit Terjual</th>
                  <th className="px-3 py-2 text-right">Harga Satuan</th>
                  <th className="px-3 py-2 text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bestSellers.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-3 py-3 font-mono font-bold">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] ${
                        idx === 0 
                          ? 'bg-[#C8A15A] text-neutral-950 font-black' 
                          : idx === 1 
                          ? 'bg-neutral-200 text-neutral-800' 
                          : idx === 2 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'text-neutral-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-bold text-neutral-900 truncate max-w-xs">{item.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{item.sku}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                        {item.series}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-neutral-900 font-mono">
                      {item.calculatedSold} pcs
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-neutral-600">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-[#9A7B38]">
                      {formatRupiah(item.calculatedRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom 3: Analitik Stok & Peringatan Inventaris */}
        <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 pb-3">
              <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center">
                <ChartBar weight="bold" className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                Peringatan Stok Rendah
              </h3>
            </div>

            <div className="space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-md text-xs flex items-center gap-2">
                  <CheckCircle weight="bold" className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Semua produk dalam level stok aman (&gt; 5 unit).</span>
                </div>
              ) : (
                lowStockProducts.slice(0, 4).map(p => (
                  <div key={p.id} className="p-2.5 rounded-md border border-amber-200 bg-amber-50/60 flex items-center justify-between text-xs">
                    <div className="truncate max-w-[170px]">
                      <div className="font-bold text-neutral-900 truncate">{p.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{p.sku}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                        Sisa: {p.stockQuantity} pcs
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <button
              onClick={onOpenAddProduct}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-[#C8A15A] border border-[#C8A15A]/40 font-bold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>Input Barang Baru ke Katalog</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
