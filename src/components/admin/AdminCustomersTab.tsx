import React, { useState, useMemo } from 'react';
import { 
  Users, MagnifyingGlass, Funnel, ShoppingBag, Eye, Phone, 
  MapPin, CheckCircle, Clock, DownloadSimple, Star,
  Crown, TrendUp, Sparkle, CaretDown, Check, WarningCircle
} from '@phosphor-icons/react';
import { Order, CMSAccessRole } from '../../types';
import { formatRupiah } from '../../utils/format';

interface AdminCustomersTabProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: any) => void;
  currentRole: CMSAccessRole;
}

interface CustomerAggregate {
  id: string; // phone or unique key
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalOrders: number;
  totalProductsCount: number; // total units of hardware purchased
  totalSpent: number; // total nominal rupiah
  lastOrderDate: string;
  isFavorite: boolean;
  orders: Order[];
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  orders,
  currentRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorite' | 'top_spender' | 'top_quantity'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAggregate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent Favorite Customers IDs in LocalStorage
  const [favoriteCustomerIds, setFavoriteCustomerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('higold_favorite_customers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['081299887766', '081377889900']; // default favorites
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isRoleAdmin = currentRole === 'admin';

  // Toggle Favorite Customer (Star)
  const handleToggleFavorite = (customerId: string, customerName: string) => {
    setFavoriteCustomerIds(prev => {
      let updated: string[];
      if (prev.includes(customerId)) {
        updated = prev.filter(id => id !== customerId);
        showToast(`Pelanggan "${customerName}" dihapus dari daftar favorit.`);
      } else {
        updated = [...prev, customerId];
        showToast(`Bintang ditambahkan! "${customerName}" sekarang menjadi Pelanggan Favorit ⭐`);
      }
      try {
        localStorage.setItem('higold_favorite_customers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Aggregate orders by unique customer
  const aggregatedCustomers: CustomerAggregate[] = useMemo(() => {
    const map = new Map<string, CustomerAggregate>();

    orders.forEach((ord) => {
      const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
      const key = cleanPhone || ord.customer.fullName.toLowerCase().trim();

      const orderItemCount = ord.items.reduce((sum, it) => sum + (it.quantity || 1), 0);

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          fullName: ord.customer.fullName,
          phone: ord.customer.phone,
          email: ord.customer.email || '-',
          city: ord.customer.city,
          address: ord.customer.address,
          totalOrders: 1,
          totalProductsCount: orderItemCount,
          totalSpent: ord.totalAmount,
          lastOrderDate: ord.createdAt,
          isFavorite: favoriteCustomerIds.includes(key),
          orders: [ord],
        });
      } else {
        const existing = map.get(key)!;
        existing.totalOrders += 1;
        existing.totalProductsCount += orderItemCount;
        existing.totalSpent += ord.totalAmount;
        existing.orders.push(ord);
        if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = ord.createdAt;
        }
      }
    });

    // Update favorite flags
    const result = Array.from(map.values()).map(c => ({
      ...c,
      isFavorite: favoriteCustomerIds.includes(c.id),
    }));

    return result;
  }, [orders, favoriteCustomerIds]);

  // Specific 4 key metrics required by User:
  // 1. Jumlah Pelanggan
  const totalCustomersCount = aggregatedCustomers.length;

  // 2. Paling banyak belanja produk (units)
  const topProductCustomer = useMemo(() => {
    if (aggregatedCustomers.length === 0) return null;
    return [...aggregatedCustomers].sort((a, b) => b.totalProductsCount - a.totalProductsCount)[0];
  }, [aggregatedCustomers]);

  // 3. Pelanggan dengan nominal paling banyak (Top Spender)
  const topSpenderCustomer = useMemo(() => {
    if (aggregatedCustomers.length === 0) return null;
    return [...aggregatedCustomers].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  }, [aggregatedCustomers]);

  // 4. Pelanggan favorit
  const favoriteCustomersCount = aggregatedCustomers.filter(c => c.isFavorite).length;

  // Filtered customer list
  const displayedCustomers = useMemo(() => {
    return aggregatedCustomers.filter((c) => {
      if (filterMode === 'favorite' && !c.isFavorite) return false;
      if (filterMode === 'top_spender' && topSpenderCustomer && c.id !== topSpenderCustomer.id) return false;
      if (filterMode === 'top_quantity' && topProductCustomer && c.id !== topProductCustomer.id) return false;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      return (
        c.fullName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      // Favorites first, then total spent
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.totalSpent - a.totalSpent;
    });
  }, [aggregatedCustomers, filterMode, searchQuery, topSpenderCustomer, topProductCustomer]);

  // Export CSV Data Pelanggan
  const handleExportCustomers = () => {
    const header = 'Nama Pelanggan,No WhatsApp,Email,Kota,Alamat,Total Transaksi Pesanan,Total Unit Produk Dipesan,Total Belanja (IDR),Status Favorit,Pesanan Terakhir\n';
    const rows = displayedCustomers.map(c => 
      `"${c.fullName}","${c.phone}","${c.email}","${c.city}","${c.address}","${c.totalOrders}","${c.totalProductsCount}","${c.totalSpent}","${c.isFavorite ? 'FAVORIT' : 'REGULER'}","${c.lastOrderDate}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HIGOLD_Data_Pelanggan_Lengkap_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Pelanggan berhasil diekspor ke CSV!');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 border border-[#C8A15A] text-white text-xs font-semibold rounded-md shadow-xl flex items-center gap-2">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#C8A15A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-5 rounded-lg border text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isRoleAdmin ? 'bg-neutral-950 border-[#C8A15A]/40' : 'bg-sky-500 border-sky-600'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 font-bold ${
            isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950' : 'bg-white text-sky-700'
          }`}>
            <Users weight="bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Analitik & Data Pelanggan HIGOLD
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isRoleAdmin ? 'bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40' : 'bg-white/20 text-white border border-white/30'
              }`}>
                {totalCustomersCount} Pelanggan Terdaftar
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${isRoleAdmin ? 'text-neutral-300' : 'text-sky-100'}`}>
              Pantau peringkat pembeli unit hardware terbanyak, nominal transaksi terbesar, dan tandai pelanggan favorit dengan bintang untuk penanganan prioritas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCustomers}
            className={`px-4 py-2 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              isRoleAdmin ? 'bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950' : 'bg-white text-sky-700 hover:bg-sky-50'
            }`}
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
            <span>Export Data Pelanggan (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 MANDATORY METRIC CARDS AS REQUESTED BY USER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Jumlah Pelanggan */}
        <div 
          onClick={() => setFilterMode('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'all' 
              ? 'bg-[#FAF6ED] border-[#C8A15A] ring-1 ring-[#C8A15A] shadow-xs' 
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">1. Jumlah Pelanggan</span>
            <Users className="w-4 h-4 text-[#C8A15A]" />
          </div>
          <div className="text-2xl font-black text-neutral-900 font-mono">
            {totalCustomersCount}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            Total pembeli unik terdata di sistem
          </div>
        </div>

        {/* 2. Paling Banyak Belanja Produk */}
        <div 
          onClick={() => setFilterMode(filterMode === 'top_quantity' ? 'all' : 'top_quantity')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'top_quantity' 
              ? 'bg-[#FAF6ED] border-[#C8A15A] ring-1 ring-[#C8A15A] shadow-xs' 
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">2. Terbanyak Unit Produk</span>
            <ShoppingBag className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-base font-extrabold text-neutral-900 truncate" title={topProductCustomer?.fullName}>
            {topProductCustomer ? topProductCustomer.fullName : '-'}
          </div>
          <div className="text-xs font-bold text-sky-700 font-mono mt-0.5">
            {topProductCustomer ? `${topProductCustomer.totalProductsCount} Unit Produk Hardware` : '0 Unit'}
          </div>
        </div>

        {/* 3. Pelanggan dengan Nominal Paling Banyak */}
        <div 
          onClick={() => setFilterMode(filterMode === 'top_spender' ? 'all' : 'top_spender')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'top_spender' 
              ? 'bg-[#FAF6ED] border-[#C8A15A] ring-1 ring-[#C8A15A] shadow-xs' 
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">3. Nominal Terbesar (Top)</span>
            <Crown className="w-4 h-4 text-[#C8A15A]" />
          </div>
          <div className="text-base font-extrabold text-neutral-900 truncate" title={topSpenderCustomer?.fullName}>
            {topSpenderCustomer ? topSpenderCustomer.fullName : '-'}
          </div>
          <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
            {topSpenderCustomer ? formatRupiah(topSpenderCustomer.totalSpent) : 'Rp 0'}
          </div>
        </div>

        {/* 4. Pelanggan Favorite (Admin dapat memberi bintang) */}
        <div 
          onClick={() => setFilterMode(filterMode === 'favorite' ? 'all' : 'favorite')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterMode === 'favorite' 
              ? 'bg-[#FAF6ED] border-amber-400 ring-1 ring-amber-400 shadow-xs' 
              : 'bg-white border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">4. Pelanggan Favorit ⭐</span>
            <Star weight="fill" className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {favoriteCustomersCount}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Ditandai bintang oleh Admin</span>
            <span className="text-[#C8A15A] font-bold underline">Filter</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <MagnifyingGlass className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pelanggan, WhatsApp, kota, alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterMode === 'all' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Semua ({aggregatedCustomers.length})
          </button>
          <button
            onClick={() => setFilterMode('favorite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              filterMode === 'favorite' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Star weight="fill" className="w-3.5 h-3.5" />
            <span>Favorit ({favoriteCustomersCount})</span>
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center">Favorit</th>
                <th className="px-4 py-3">Nama Pelanggan & Kontak</th>
                <th className="px-4 py-3">Domisili / Kota</th>
                <th className="px-4 py-3 text-center">Total Unit Produk</th>
                <th className="px-4 py-3 text-right">Akumulasi Belanja</th>
                <th className="px-4 py-3 text-center">Pesanan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    Tidak ada pelanggan yang cocok dengan pencarian atau filter ({filterMode}).
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((cust) => {
                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                  const isTopSpender = topSpenderCustomer?.id === cust.id;
                  const isTopQty = topProductCustomer?.id === cust.id;

                  return (
                    <tr key={cust.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Favorite Star Button */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(cust.id, cust.fullName)}
                          className="p-1 rounded-full hover:bg-amber-50 cursor-pointer transition-colors"
                          title={cust.isFavorite ? 'Klik untuk hapus favorit' : 'Klik untuk jadikan Pelanggan Favorit ⭐'}
                        >
                          <Star
                            weight={cust.isFavorite ? 'fill' : 'regular'}
                            className={`w-5 h-5 ${cust.isFavorite ? 'text-amber-500' : 'text-neutral-300 hover:text-amber-400'}`}
                          />
                        </button>
                      </td>

                      {/* Name & Phone */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900 text-sm">{cust.fullName}</span>
                          {cust.isFavorite && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                              ⭐ Favorit
                            </span>
                          )}
                          {isTopSpender && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                              👑 Top Spender
                            </span>
                          )}
                          {isTopQty && (
                            <span className="px-1.5 py-0.2 bg-sky-100 text-sky-800 text-[9px] font-bold rounded">
                              📦 Terbanyak Unit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                          {cust.phone} · {cust.email}
                        </div>
                      </td>

                      {/* City & Address */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-neutral-900">{cust.city}</div>
                        <div className="text-[10px] text-neutral-500 line-clamp-1 max-w-xs">{cust.address}</div>
                      </td>

                      {/* Total Product Count */}
                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 font-bold font-mono rounded-md text-xs">
                          {cust.totalProductsCount} Unit
                        </span>
                      </td>

                      {/* Total Nominal Spent */}
                      <td className="px-4 py-3 text-right font-mono font-bold text-neutral-900">
                        {formatRupiah(cust.totalSpent)}
                      </td>

                      {/* Total Orders Frequency */}
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-mono text-[11px] font-semibold rounded">
                          {cust.totalOrders}x Transaksi
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo Bapak/Ibu ${cust.fullName}, terima kasih atas kepercayaan Anda memilih hardware kabinet dapur resmi HIGOLD Indonesia.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                            title="Chat WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[#C8A15A] font-bold rounded text-xs transition-colors cursor-pointer"
                            title="Lihat Riwayat Pesanan Pelanggan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-neutral-950 text-white border-b border-[#C8A15A]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C8A15A]" />
                <h3 className="font-bold text-sm text-white">
                  Profil Pelanggan: {selectedCustomer.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Kontak WhatsApp:</span>
                  <strong className="text-neutral-900 font-mono">{selectedCustomer.phone}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Email:</span>
                  <span className="text-neutral-900">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Unit Dibeli:</span>
                  <span className="font-bold text-sky-700 font-mono">{selectedCustomer.totalProductsCount} Unit Produk</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Nilai Belanja:</span>
                  <span className="font-bold text-emerald-700 font-mono">{formatRupiah(selectedCustomer.totalSpent)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Alamat Pengiriman Kargo:</span>
                  <span className="text-neutral-800">{selectedCustomer.address}, {selectedCustomer.city}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                  Riwayat Transaksi Pesanan Pelanggan Ini ({selectedCustomer.orders.length})
                </div>
                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                  {selectedCustomer.orders.map((ord) => (
                    <div key={ord.id} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-neutral-900 font-mono">#{ord.orderNumber}</div>
                        <div className="text-[10px] text-neutral-500">{ord.createdAt} · Resi: {ord.trackingNumber}</div>
                        <div className="text-[11px] text-neutral-700 mt-1">
                          {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-neutral-900">{formatRupiah(ord.totalAmount)}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{ord.trackingStatus.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
