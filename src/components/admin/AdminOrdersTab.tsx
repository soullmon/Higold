import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, MagnifyingGlass, CheckCircle, Clock, 
  MapPin, Phone, Eye, Printer, CreditCard, QrCode,
  DownloadSimple, Check, Warning, XCircle, ArrowRight,
  ShieldCheck, Hourglass, FileText
} from '@phosphor-icons/react';
import { Order, CMSAccessRole, OrderWorkflowStatus } from '../../types';
import { formatRupiah } from '../../utils/format';
import { OFFICIAL_COMPANY_INFO } from '../../data/products';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: any) => void;
  onUpdateOrderWorkflowStatus?: (orderId: string, newWorkflowStatus: OrderWorkflowStatus) => void;
  currentRole: CMSAccessRole;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onUpdateOrderStatus,
  onUpdateOrderWorkflowStatus,
  currentRole,
}) => {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'all' | OrderWorkflowStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isRoleAdmin = currentRole === 'admin';

  // Helper to determine workflow status with fallback
  const getOrderWorkflowStatus = (ord: Order): OrderWorkflowStatus => {
    if (ord.orderStatus) return ord.orderStatus;
    if (ord.trackingStatus === 'sampai_tujuan') return 'selesai';
    if (ord.paymentStatus === 'confirmed' || ord.trackingStatus === 'dalam_pengiriman' || ord.trackingStatus === 'qc_gudang') {
      return 'diproses';
    }
    return 'menunggu_pembayaran';
  };

  // Counts for each tab
  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      menunggu_pembayaran: orders.filter(o => getOrderWorkflowStatus(o) === 'menunggu_pembayaran').length,
      diproses: orders.filter(o => getOrderWorkflowStatus(o) === 'diproses').length,
      selesai: orders.filter(o => getOrderWorkflowStatus(o) === 'selesai').length,
      dibatalkan: orders.filter(o => getOrderWorkflowStatus(o) === 'dibatalkan').length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const currentWf = getOrderWorkflowStatus(ord);
      if (activeWorkflowTab !== 'all' && currentWf !== activeWorkflowTab) {
        return false;
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        ord.orderNumber.toLowerCase().includes(q) ||
        (ord.invoiceNumber && ord.invoiceNumber.toLowerCase().includes(q)) ||
        ord.customer.fullName.toLowerCase().includes(q) ||
        ord.customer.phone.includes(q) ||
        ord.customer.city.toLowerCase().includes(q);

      const matchesPayment = paymentFilter === 'all' || ord.paymentMethod.includes(paymentFilter);
      return matchesSearch && matchesPayment;
    });
  }, [orders, activeWorkflowTab, searchQuery, paymentFilter]);

  // Update order status handler
  const handleSetWorkflow = (orderId: string, newStatus: OrderWorkflowStatus) => {
    if (onUpdateOrderWorkflowStatus) {
      onUpdateOrderWorkflowStatus(orderId, newStatus);
    } else if (onUpdateOrderStatus) {
      const tracking = newStatus === 'selesai' ? 'sampai_tujuan' : newStatus === 'diproses' ? 'diproses' : 'diproses';
      onUpdateOrderStatus(orderId, tracking);
    }

    if (newStatus === 'diproses') {
      showToast(`Pesanan #${orderId} telah DIKONFIRMASI! Data produk otomatis tercatat di Pengiriman.`);
    } else if (newStatus === 'selesai') {
      showToast(`Pesanan #${orderId} telah ditandai SELESAI.`);
    } else if (newStatus === 'dibatalkan') {
      showToast(`Pesanan #${orderId} telah DIBATALKAN.`);
    }

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
    }
    if (invoiceModalOrder && invoiceModalOrder.id === orderId) {
      setInvoiceModalOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
    }
  };

  // Export CSV
  const handleExportOrders = () => {
    const header = 'No. Order,No. Invoice,Tanggal,Nama Pembeli,WhatsApp,Email,Kota,Alamat,Daftar Produk,Metode Bayar,Total Transaksi (IDR),Status Alur,Status Kirim,No Resi\n';
    const rows = filteredOrders.map(o => {
      const itemsStr = o.items.map(i => `${i.product.name} (SKU:${i.selectedSku} x${i.quantity})`).join('; ');
      const wfStatus = getOrderWorkflowStatus(o);
      const invNum = o.invoiceNumber || `INV/2026/${o.orderNumber}`;
      return `"${o.orderNumber}","${invNum}","${o.createdAt}","${o.customer.fullName}","${o.customer.phone}","${o.customer.email || '-'}","${o.customer.city}","${o.customer.address}","${itemsStr}","${o.paymentMethod}","${o.totalAmount}","${wfStatus}","${o.trackingStatus}","${o.trackingNumber}"`;
    }).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HIGOLD_Data_Pesanan_${activeWorkflowTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Pesanan berhasil diekspor ke CSV!');
  };

  // Calculate 24-hour remaining time
  const get24HourRemaining = (createdAt: string) => {
    const createdTime = new Date(createdAt).getTime();
    if (isNaN(createdTime)) return '24 Jam';
    const deadline = createdTime + 24 * 60 * 60 * 1000;
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) return 'Batas Waktu Berakhir';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${mins}m tersisa`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 text-white text-xs font-semibold rounded-lg shadow-xl flex items-center gap-2 ${
          isRoleAdmin ? 'bg-neutral-900 border border-[#C8A15A]' : 'bg-sky-500'
        }`}>
          <CheckCircle className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-white'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isRoleAdmin 
          ? 'bg-neutral-900 border-[#C8A15A]/40 text-neutral-100 shadow-sm' 
          : 'bg-sky-50 border-sky-200 text-sky-950 shadow-xs'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
            isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white'
          }`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold ${isRoleAdmin ? 'text-white' : 'text-neutral-900'}`}>
                Manajemen Pesanan & Invoice Alur 24 Jam
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isRoleAdmin 
                  ? 'bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40' 
                  : 'bg-sky-100 text-sky-800'
              }`}>
                {isRoleAdmin ? 'Admin Akses' : 'CS Support'}
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${
              isRoleAdmin ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Alur Transaksi: User memesan → Muncul invoice batas bayar 24 jam → Jika bayar admin konfirmasi tahap selanjutnya ("Di Proses" akan otomatis tercatat di data Pengiriman) → Selesai.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportOrders}
            className={`px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              isRoleAdmin 
                ? 'bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950' 
                : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
            <span>Export Data Pesanan (CSV)</span>
          </button>
        </div>
      </div>

      {/* WORKFLOW TABS: Menunggu Pembayaran, Di Proses, Selesai, Dibatalkan */}
      <div className="bg-white p-2 rounded-xl border border-neutral-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveWorkflowTab('all')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeWorkflowTab === 'all'
              ? (isRoleAdmin ? 'bg-neutral-900 text-[#C8A15A] shadow-xs' : 'bg-sky-500 text-white')
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <span>Semua Pesanan</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            activeWorkflowTab === 'all' ? 'bg-[#C8A15A]/20 text-[#C8A15A]' : 'bg-neutral-100 text-neutral-600'
          }`}>
            {tabCounts.all}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('menunggu_pembayaran')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeWorkflowTab === 'menunggu_pembayaran'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <Hourglass className="w-3.5 h-3.5" />
          <span>Menunggu Pembayaran</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
            {tabCounts.menunggu_pembayaran}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('diproses')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeWorkflowTab === 'diproses'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-sky-800 hover:bg-sky-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Di Proses (Tercatat di Pengiriman)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-100 text-sky-800 font-bold">
            {tabCounts.diproses}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('selesai')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeWorkflowTab === 'selesai'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Selesai</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
            {tabCounts.selesai}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('dibatalkan')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeWorkflowTab === 'dibatalkan'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-800 hover:bg-rose-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Dibatalkan</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-100 text-rose-800 font-bold">
            {tabCounts.dibatalkan}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <MagnifyingGlass className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari no order, invoice, nama pembeli, WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden bg-white cursor-pointer"
          >
            <option value="all">Semua Metode Pembayaran</option>
            <option value="qris">QRIS Resmi</option>
            <option value="bca">Transfer Bank BCA</option>
            <option value="mandiri">Transfer Bank Mandiri</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">No. Order & Invoice</th>
                <th className="px-4 py-3">Pembeli & Kontak</th>
                <th className="px-4 py-3">Item Produk & SKU</th>
                <th className="px-4 py-3 text-right">Total Transaksi</th>
                <th className="px-4 py-3 text-center">Batas Waktu Bayar</th>
                <th className="px-4 py-3 text-center">Status Alur</th>
                <th className="px-4 py-3 text-right">Aksi Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    Tidak ada pesanan yang sesuai dengan filter pencarian ({activeWorkflowTab}).
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                  const wfStatus = getOrderWorkflowStatus(ord);
                  const remaining = get24HourRemaining(ord.createdAt);
                  const invNumber = ord.invoiceNumber || `INV/2026/${ord.orderNumber}`;

                  return (
                    <tr key={ord.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-neutral-900">{ord.orderNumber}</div>
                        <div className="text-[10px] text-[#C8A15A] font-semibold">{invNumber}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{ord.createdAt}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-neutral-900">{ord.customer.fullName}</div>
                        <div className="text-[11px] text-neutral-500">{ord.customer.city} · {ord.customer.phone}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-0.5 max-w-xs">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-neutral-700 truncate">
                              • <span className="font-semibold">{it.product.name}</span>
                              <span className="text-[10px] font-mono text-neutral-500 ml-1">
                                ({it.selectedWidth}mm | SKU: {it.selectedSku || it.product.sku}) ×{it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-neutral-900">
                        {formatRupiah(ord.totalAmount)}
                        <span className="block text-[10px] font-normal text-neutral-500">
                          {ord.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {wfStatus === 'menunggu_pembayaran' ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                            remaining === 'Batas Waktu Berakhir' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>{remaining}</span>
                          </span>
                        ) : wfStatus === 'diproses' ? (
                          <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 border border-sky-200 rounded">
                            Lunas Terverifikasi
                          </span>
                        ) : wfStatus === 'selesai' ? (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                            Transaksi Selesai
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 border border-rose-200 rounded">
                            Batal / Lewat 24 Jam
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {wfStatus === 'menunggu_pembayaran' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            Menunggu Bayar
                          </span>
                        )}
                        {wfStatus === 'diproses' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-300" title="Tercatat di Menu Pengiriman">
                            Di Proses (Kirim)
                          </span>
                        )}
                        {wfStatus === 'selesai' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            Selesai
                          </span>
                        )}
                        {wfStatus === 'dibatalkan' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                            Dibatalkan
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Invoice Button */}
                          <button
                            onClick={() => setInvoiceModalOrder(ord)}
                            className="px-2 py-1 bg-[#FAF6ED] hover:bg-[#F3EBD8] text-[#8A6B29] border border-[#C8A15A]/40 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Buka Lembar Invoice 24 Jam"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>

                          {/* Workflow transitions */}
                          {wfStatus === 'menunggu_pembayaran' && (
                            <>
                              <button
                                onClick={() => handleSetWorkflow(ord.id, 'diproses')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                                title="Konfirmasi pembayaran lunas dan teruskan ke Pengiriman"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Konfirmasi Bayar</span>
                              </button>
                              <button
                                onClick={() => handleSetWorkflow(ord.id, 'dibatalkan')}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-medium cursor-pointer"
                                title="Batalkan pesanan (belum bayar / lewat 24 jam)"
                              >
                                Batalkan
                              </button>
                            </>
                          )}

                          {wfStatus === 'diproses' && (
                            <button
                              onClick={() => handleSetWorkflow(ord.id, 'selesai')}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-[#C8A15A] rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Tandai pesanan selesai setelah kurir sampai tujuan"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Selesai</span>
                            </button>
                          )}

                          {/* WhatsApp Chat */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${ord.customer.fullName}, perihal pesanan Higold #${ord.orderNumber} (Invoice: ${invNumber}): status pesanan Anda adalah ${wfStatus.toUpperCase()}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
                            title="Chat WhatsApp Pembeli"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
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

      {/* 24-HOUR OFFICIAL INVOICE MODAL */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Invoice Top Header */}
            <div className="p-5 bg-neutral-950 text-white border-b border-[#C8A15A]/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C8A15A] text-neutral-950 font-extrabold flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    INVOICE RESMI HIGOLD INDONESIA
                  </h3>
                  <div className="text-xs text-[#C8A15A] font-mono mt-0.5">
                    {invoiceModalOrder.invoiceNumber || `INV/2026/${invoiceModalOrder.orderNumber}`} · No. Order: #{invoiceModalOrder.orderNumber}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Invoice Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* 24 Hour Countdown Notice */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                getOrderWorkflowStatus(invoiceModalOrder) === 'menunggu_pembayaran'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : getOrderWorkflowStatus(invoiceModalOrder) === 'dibatalkan'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wide">
                      {getOrderWorkflowStatus(invoiceModalOrder) === 'menunggu_pembayaran' 
                        ? 'Batas Waktu Pembayaran: 24 Jam' 
                        : getOrderWorkflowStatus(invoiceModalOrder) === 'dibatalkan'
                        ? 'Pesanan Telah Dibatalkan'
                        : 'Pembayaran Dikonfirmasi Lunas'}
                    </div>
                    <div className="text-[11px] mt-0.5">
                      {getOrderWorkflowStatus(invoiceModalOrder) === 'menunggu_pembayaran'
                        ? 'Jika belum bayar dalam kurun waktu 24 jam maka pesanan batal otomatis.'
                        : 'Data pesanan telah diproses dan tercatat di pengiriman.'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm">
                    {get24HourRemaining(invoiceModalOrder.createdAt)}
                  </span>
                </div>
              </div>

              {/* Customer and Company Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Ditagihkan Kepada:</span>
                  <div className="font-bold text-sm text-neutral-900">{invoiceModalOrder.customer.fullName}</div>
                  <div className="text-neutral-600">{invoiceModalOrder.customer.phone} · {invoiceModalOrder.customer.email || 'Tanpa Email'}</div>
                  <div className="text-neutral-600 mt-1">{invoiceModalOrder.customer.address}, {invoiceModalOrder.customer.city}</div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Penerbit Faktur Resmi:</span>
                  <div className="font-bold text-sm text-neutral-900">PT Surya Gemilang Sejati</div>
                  <div className="text-neutral-600">HIGOLD Flagship Experience Center</div>
                  <div className="text-neutral-600">Pluit, Jakarta Utara · NPWP: 01.345.678.9-023.000</div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <div className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                  Rincian Barang & Spesifikasi Ukuran / SKU
                </div>
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 text-[10px] uppercase">
                      <tr>
                        <th className="px-3 py-2">Produk</th>
                        <th className="px-3 py-2">Ukuran & SKU</th>
                        <th className="px-3 py-2 text-center">Jumlah</th>
                        <th className="px-3 py-2 text-right">Harga Satuan</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {invoiceModalOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2.5 font-semibold text-neutral-900">
                            {it.product.name}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-neutral-600">
                            {it.selectedWidth} mm · <strong className="text-neutral-900">{it.selectedSku || it.product.sku}</strong>
                          </td>
                          <td className="px-3 py-2.5 text-center font-bold">
                            {it.quantity}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-neutral-700">
                            {formatRupiah(it.product.price)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono font-bold text-neutral-900">
                            {formatRupiah(it.product.price * it.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total & Payment details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] space-y-1">
                  <span className="font-bold text-neutral-800 block">Metode Pembayaran Resmi:</span>
                  <div>
                    {invoiceModalOrder.paymentMethod === 'bank_transfer_bca' ? (
                      <div>Bank BCA: <strong className="font-mono">035-309-8877</strong> a/n PT Surya Gemilang Sejati</div>
                    ) : invoiceModalOrder.paymentMethod === 'bank_transfer_mandiri' ? (
                      <div>Bank Mandiri: <strong className="font-mono">122-00-1199882-1</strong> a/n PT Surya Gemilang Sejati</div>
                    ) : (
                      <div>QRIS Instant: <strong className="font-mono">HIGOLD INDONESIA (NMID: ID102435987112)</strong></div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-neutral-950 text-white rounded-xl text-right">
                  <span className="text-[11px] text-neutral-400 block">Total Tagihan Invoice</span>
                  <span className="text-xl font-mono font-extrabold text-[#C8A15A]">
                    {formatRupiah(invoiceModalOrder.totalAmount)}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getOrderWorkflowStatus(invoiceModalOrder) === 'menunggu_pembayaran' && (
                  <>
                    <button
                      onClick={() => handleSetWorkflow(invoiceModalOrder.id, 'diproses')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Konfirmasi Pembayaran Diterima (Proses Kirim)</span>
                    </button>
                    <button
                      onClick={() => handleSetWorkflow(invoiceModalOrder.id, 'dibatalkan')}
                      className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Batalkan Pesanan
                    </button>
                  </>
                )}
                {getOrderWorkflowStatus(invoiceModalOrder) === 'diproses' && (
                  <button
                    onClick={() => handleSetWorkflow(invoiceModalOrder.id, 'selesai')}
                    className="px-4 py-2 bg-neutral-900 text-[#C8A15A] font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Tandai Selesai</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Invoice</span>
                </button>
                <button
                  onClick={() => setInvoiceModalOrder(null)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
