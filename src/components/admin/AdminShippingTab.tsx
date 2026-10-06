import React, { useState } from 'react';
import { 
  Truck, MagnifyingGlass, Funnel, CheckCircle, Clock, 
  MapPin, Phone, CaretRight, ArrowsClockwise, 
  ShareNetwork, QrCode, FileText, DownloadSimple
} from '@phosphor-icons/react';
import { Order, OrderTrackingStatus, CMSAccessRole } from '../../types';

interface AdminShippingTabProps {
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderTrackingStatus) => void;
  currentRole: CMSAccessRole;
}

export const AdminShippingTab: React.FC<AdminShippingTabProps> = ({
  orders,
  onUpdateOrderStatus,
  currentRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingResiOrder, setEditingResiOrder] = useState<Order | null>(null);
  const [customResiInput, setCustomResiInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isRoleAdmin = currentRole === 'admin';

  // User requirement: "ketika admin atau cs mengatur ke pilihan di proses artinya data produk baru akan tercatat di pengiriman"
  // Therefore, only orders with status 'diproses' or 'selesai' (or payment verified) are logged in shipping.
  const shippingEligibleOrders = orders.filter((ord) => {
    const wf = ord.orderStatus;
    if (wf === 'menunggu_pembayaran' || wf === 'dibatalkan') return false;
    return true;
  });

  const filteredOrders = shippingEligibleOrders.filter((ord) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.trackingNumber.toLowerCase().includes(q) ||
      ord.customer.fullName.toLowerCase().includes(q) ||
      ord.customer.city.toLowerCase().includes(q) ||
      ord.shippingCarrier.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || ord.trackingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderTrackingStatus) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, newStatus);
      showToast(`Status pengiriman #${orderId} berhasil diubah.`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, trackingStatus: newStatus });
      }
    }
  };

  const handleExportShipping = () => {
    const header = 'No. Resi,Ekspedisi Kargo,No. Order,Tanggal Order,Nama Penerima,WhatsApp,Kota Tujuan,Alamat Lengkap,Status Pengiriman\n';
    const rows = filteredOrders.map(o => 
      `"${o.trackingNumber}","${o.shippingCarrier}","${o.orderNumber}","${o.createdAt}","${o.customer.fullName}","${o.customer.phone}","${o.customer.city}","${o.customer.address}","${o.trackingStatus}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HIGOLD_Data_Pengiriman_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Pengiriman berhasil diekspor ke CSV!');
  };

  const handleSaveResi = () => {
    if (!editingResiOrder) return;
    editingResiOrder.trackingNumber = customResiInput.trim() || editingResiOrder.trackingNumber;
    setEditingResiOrder(null);
    showToast(`Nomor resi untuk #${editingResiOrder.orderNumber} berhasil diperbarui.`);
  };

  const getStatusBadge = (status: OrderTrackingStatus) => {
    switch (status) {
      case 'sampai_tujuan':
        return { label: 'Sampai Tujuan', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'dalam_pengiriman':
        return { label: 'Dalam Pengiriman', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'diserahkan_kurir':
        return { label: 'Diserahkan Kurir', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'qc_gudang':
        return { label: 'QC Gudang', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'diproses':
      default:
        return { label: 'Diproses', bg: 'bg-neutral-100 text-neutral-700 border-neutral-300' };
    }
  };

  return (
    <div className="space-y-6">
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
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold ${isRoleAdmin ? 'text-white' : 'text-neutral-900'}`}>
                Manajemen Logistik & Pengiriman Hardware
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isRoleAdmin 
                  ? 'bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40' 
                  : 'bg-sky-100 text-sky-800'
              }`}>
                {isRoleAdmin ? 'Admin Emas' : 'CS Biru Langit'}
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${
              isRoleAdmin ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Pantau armada logistik, input nomor resi pengiriman kargo (JNE Trucking, J&T Cargo, SiCepat, Wahana), dan perbarui status pelacakan pesanan pembeli secara real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportShipping}
            className={`px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              isRoleAdmin ? 'bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950' : 'bg-white text-sky-700 hover:bg-sky-50'
            }`}
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
            <span>Export Data Pengiriman (CSV)</span>
          </button>
          <span className={`text-xs font-mono font-bold px-3 py-2 rounded-lg border ${
            isRoleAdmin ? 'bg-neutral-950 text-[#C8A15A] border-neutral-800' : 'bg-white text-sky-700 border-sky-200'
          }`}>
            {filteredOrders.length} Muatan Aktif
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <MagnifyingGlass className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor resi, order, kurir, kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-hidden bg-white cursor-pointer"
          >
            <option value="all">Semua Status Pengiriman</option>
            <option value="diproses">1. Diproses</option>
            <option value="qc_gudang">2. QC Gudang</option>
            <option value="diserahkan_kurir">3. Diserahkan Kurir</option>
            <option value="dalam_pengiriman">4. Dalam Pengiriman</option>
            <option value="sampai_tujuan">5. Sampai Tujuan</option>
          </select>
        </div>
      </div>

      {/* Shipping Shipments Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">No. Resi & Ekspedisi</th>
                <th className="px-4 py-3">Order Terkait</th>
                <th className="px-4 py-3">Tujuan Pengiriman</th>
                <th className="px-4 py-3">Penerima & WhatsApp</th>
                <th className="px-4 py-3">Status Pelacakan</th>
                <th className="px-4 py-3 text-right">Ubah Status / Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((ord) => {
                const statusInfo = getStatusBadge(ord.trackingStatus);
                const cleanPhone = ord.customer.phone.replace(/[^0-9]/g, '');
                const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

                return (
                  <tr key={ord.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-neutral-900 text-xs">{ord.trackingNumber}</div>
                      <div className="text-[11px] text-neutral-600 font-sans mt-0.5">{ord.shippingCarrier}</div>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-neutral-900">{ord.orderNumber}</div>
                      <div className="text-[10px] text-neutral-400">{ord.createdAt}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-neutral-900">{ord.customer.city}</div>
                      <div className="text-[10px] text-neutral-500 line-clamp-1 truncate max-w-xs">{ord.customer.address}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900">{ord.customer.fullName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{ord.customer.phone}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border ${statusInfo.bg}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={ord.trackingStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderTrackingStatus)}
                          className="px-2 py-1 text-[11px] border border-neutral-300 rounded font-semibold text-neutral-900 bg-white cursor-pointer"
                        >
                          <option value="diproses">Diproses</option>
                          <option value="qc_gudang">QC Gudang</option>
                          <option value="diserahkan_kurir">Diserahkan Kurir</option>
                          <option value="dalam_pengiriman">Dalam Pengiriman</option>
                          <option value="sampai_tujuan">Sampai Tujuan</option>
                        </select>

                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${ord.customer.fullName}, nomor resi pengiriman pesanan Anda #${ord.orderNumber} adalah: ${ord.trackingNumber} via ${ord.shippingCarrier}. Status: ${statusInfo.label}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                          title="Kirim Resi via WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
