import React from 'react';
import { Order, UserProfile } from '../types';
import { formatRupiah } from '../utils/format';
import { OFFICIAL_COMPANY_INFO } from '../data/products';
import { downloadInvoicePdf, printInvoiceIframe } from '../utils/generateInvoice';
import { X, Printer, Download, Clock, QrCode, CreditCard, ShieldCheck, CheckCircle2, MessageSquare, Truck, Lock } from 'lucide-react';
import { OFFICIAL_CS_STAFF, buildWhatsAppLink } from '../data/csContacts';

interface InvoiceViewerModalProps {
  isOpen: boolean;
  order: Order | null;
  userProfile?: UserProfile | null;
  onClose: () => void;
  onRequireAuth?: () => void;
}

export const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({
  isOpen,
  order,
  userProfile,
  onClose,
  onRequireAuth,
}) => {
  if (!isOpen || !order) return null;

  const isBca = order.paymentMethod === 'bank_transfer_bca';
  const isMandiri = order.paymentMethod === 'bank_transfer_mandiri';

  const handleDownloadPdf = () => {
    if (!userProfile) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    downloadInvoicePdf(order);
  };

  const handlePrint = () => {
    if (!userProfile) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    printInvoiceIframe(order);
  };

  // WhatsApp confirmation message
  const getWhatsAppHref = () => {
    const staff = OFFICIAL_CS_STAFF[0];
    const itemsSummary = order.items
      .map((i) => `• ${i.product.name} (${i.selectedWidth}mm) × ${i.quantity} = ${formatRupiah(i.product.price * i.quantity)}`)
      .join('\n');

    const paymentLabel = 
      isBca ? 'Transfer Bank BCA (035-309-8877 a.n PT Surya Gemilang Sejati)' :
      isMandiri ? 'Transfer Bank Mandiri (122-00-1199882-1 a.n PT Surya Gemilang Sejati)' :
      'QRIS Statis Toko';

    const msg = `*KONFIRMASI PEMBAYARAN NOTA HIGOLD*
━━━━━━━━━━━━━━━━━━━━━
*Nomor Nota :* ${order.invoiceNumber || `INV/2026/${order.orderNumber}`}
*Nomor Resi (Biteship) :* ${order.trackingNumber}

*Rincian Produk:*
${itemsSummary}

*Ongkir Biteship :* ${order.isFreeShipping ? 'Rp 0 (Bebas Ongkir)' : formatRupiah(order.shippingCost)} (${order.shippingCarrier})
*TOTAL HARGA :* *${formatRupiah(order.totalAmount)}*
*Metode Bayar :* ${paymentLabel}

Halo CS ${staff.name}, saya telah menyelesaikan pembayaran via transfer/QRIS sesuai nota resmi. Berikut saya lampirkan bukti transfer untuk segera diproses. Terima kasih!`;

    return buildWhatsAppLink(staff.whatsappNumber, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto font-sans select-none">
      <div 
        className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden my-4 sm:my-8 border border-neutral-200 animate-in fade-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C8A15A]">
              Pratinjau Dokumen Nota / Invoice Digital
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ({order.invoiceNumber || `INV/2026/${order.orderNumber}`})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              title="Cetak Nota / Simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-[#C8A15A]" />
              <span>Cetak / Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Unduh File PDF Asli"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate Warning if Not Logged In */}
        {!userProfile && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Perhatian:</strong> Anda sedang melihat nota sebagai tamu. Untuk mengunduh PDF resmi atau checkout pesanan, Anda harus terdaftar atau masuk.
              </span>
            </div>
            <button
              onClick={onRequireAuth}
              className="px-3 py-1 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold rounded text-xs shrink-0 cursor-pointer"
            >
              Masuk / Daftar Akun
            </button>
          </div>
        )}

        {/* Printable & Visible Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-white text-neutral-800 text-xs">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#C8A15A] pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-950 tracking-wider font-serif">
                HIGOLD OFFICIAL INDONESIA
              </h2>
              <p className="text-[11px] text-neutral-600 font-semibold mt-0.5">
                PT. SURYA GEMILANG SEJATI <span className="font-normal text-neutral-500">(Distributor Tunggal Resmi)</span>
              </p>
              <p className="text-[11px] text-neutral-500">
                Gudang Pusat: Jl. Pluit Raya No. 8, Penjaringan, Jakarta Utara 14450
              </p>
              <p className="text-[11px] text-neutral-500">
                Hotline WA: 0812-9988-7766 | Email: order@higold.co.id
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-lg font-black text-[#C8A15A] uppercase tracking-wide block">
                NOTA INVOICE RESMI
              </span>
              <span className="text-xs font-mono font-bold text-neutral-900 block mt-0.5">
                {order.invoiceNumber || `INV/2026/${order.orderNumber}`}
              </span>
              <span className="text-[11px] text-neutral-500 block">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleDateString('id-ID')}
              </span>
              <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded text-[10px] uppercase mt-2">
                Menunggu Pembayaran (Batas 24 Jam)
              </span>
            </div>
          </div>

          {/* Penerima & Pengiriman Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Penerima Pesanan:
              </div>
              <div className="text-sm font-bold text-neutral-900">
                {order.customer.fullName}
              </div>
              <div className="text-neutral-600">
                WhatsApp: <strong>{order.customer.phone}</strong>
              </div>
              {order.customer.email && (
                <div className="text-neutral-600">
                  Email: {order.customer.email}
                </div>
              )}
              <div className="text-neutral-600 text-[11px] leading-relaxed">
                Alamat: {order.customer.address}, {order.customer.city}
              </div>
            </div>

            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Pengiriman Logistik (API Biteship):
              </div>
              <div className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-600" />
                <span>{order.shippingCarrier}</span>
              </div>
              <div className="text-sky-900 font-mono text-[11px]">
                No. Resi AWB: <strong className="bg-sky-200/80 px-2 py-0.5 rounded">{order.trackingNumber}</strong>
              </div>
              <div className="text-[11px] text-neutral-600">
                Asal: Gudang Penjaringan, Pluit, Jakarta Utara 14450
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                {order.isFreeShipping ? 'Bebas Ongkir (Jarak <= 10 km)' : `Ongkir: ${formatRupiah(order.shippingCost)}`}
              </div>
            </div>
          </div>

          {/* Table of Products */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 text-center w-12">No</th>
                  <th className="p-3">Produk & Spesifikasi</th>
                  <th className="p-3 text-center w-16">Qty</th>
                  <th className="p-3 text-right w-28">Harga</th>
                  <th className="p-3 text-right w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-neutral-50/60' : 'bg-white'}>
                    <td className="p-3 text-center font-medium text-neutral-500">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{it.product.name}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Lebar: {it.selectedWidth}mm | SKU: {it.selectedSku}
                      </div>
                    </td>
                    <td className="p-3 text-center font-semibold text-neutral-800">{it.quantity}x</td>
                    <td className="p-3 text-right font-medium text-neutral-700">{formatRupiah(it.product.price)}</td>
                    <td className="p-3 text-right font-bold text-neutral-900">{formatRupiah(it.product.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="max-w-xs ml-auto space-y-1.5 text-xs pt-1">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal Produk:</span>
              <span className="font-semibold text-neutral-900">{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Ongkir (API Biteship):</span>
              <span className="font-semibold text-neutral-900">
                {order.isFreeShipping ? 'Rp 0 (Bebas Ongkir <= 10 km)' : formatRupiah(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-300 text-sm font-bold text-neutral-950">
              <span>Total Tagihan:</span>
              <span className="text-[#C8A15A] font-mono text-base">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2">
            <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
              {isBca || isMandiri ? <CreditCard className="w-4 h-4 text-amber-700" /> : <QrCode className="w-4 h-4 text-amber-700" />}
              <span>Instruksi Transfer Langsung ke Rekening Resmi (Manual):</span>
            </div>
            {isBca ? (
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <span className="text-[11px] text-neutral-500 block">Bank BCA (IDR) — Rekening Giro Resmi:</span>
                <span className="text-base font-mono font-black text-neutral-900">035-309-8877</span>
                <span className="text-[11px] text-neutral-700 block">a.n PT SURYA GEMILANG SEJATI</span>
              </div>
            ) : isMandiri ? (
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <span className="text-[11px] text-neutral-500 block">Bank Mandiri (IDR) — Rekening Giro Resmi:</span>
                <span className="text-base font-mono font-black text-neutral-900">122-00-1199882-1</span>
                <span className="text-[11px] text-neutral-700 block">a.n PT SURYA GEMILANG SEJATI</span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <span className="text-[11px] text-neutral-500 block">Scan QRIS Statis Toko:</span>
                <span className="text-sm font-mono font-bold text-neutral-900">NMID: {OFFICIAL_COMPANY_INFO.qrisInfo.nmid}</span>
                <span className="text-[11px] text-neutral-700 block">Merchant: {OFFICIAL_COMPANY_INFO.qrisInfo.merchantName}</span>
              </div>
            )}
            <p className="text-[11px] text-amber-900 font-medium">
              Batas Waktu Pembayaran: <strong>24 Jam</strong> sejak nota diterbitkan.
            </p>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
            <div className="text-xs font-bold text-emerald-950">
              Konfirmasi Pembayaran ke WhatsApp Admin:
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Setelah transfer / scan QRIS sesuai total tagihan, kirim konfirmasi dan bukti bayar ke WhatsApp Admin agar nomor resi Biteship langsung aktif untuk pengiriman barang.
            </p>
            <a
              href={getWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Konfirmasi ke WhatsApp Admin Sekarang</span>
            </a>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 italic">
            HIGOLD Indonesia — Dokumen Sah Elektronik
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white border border-neutral-300 hover:border-[#C8A15A] text-neutral-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Cetak Nota
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
