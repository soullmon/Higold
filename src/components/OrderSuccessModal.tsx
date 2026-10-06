import React, { useState } from 'react';
import { Order } from '../types';
import { OFFICIAL_COMPANY_INFO } from '../data/products';
import { OFFICIAL_CS_STAFF, buildWhatsAppLink } from '../data/csContacts';
import { formatRupiah } from '../utils/format';
import { printOrDownloadInvoice } from '../utils/generateInvoice';
import { CheckCircle2, Copy, Check, MessageSquare, X, Truck, QrCode, CreditCard, Clock, MapPin, Printer, Download, FileText, ArrowRight } from 'lucide-react';

import { UserProfile } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
  userProfile?: UserProfile | null;
  onRequireAuth?: (mode?: 'login' | 'register', message?: string) => void;
  onOpenInvoiceViewer?: (order: Order) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders,
  userProfile,
  onRequireAuth,
  onOpenInvoiceViewer,
}) => {
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [copiedResi, setCopiedResi] = useState<boolean>(false);
  const [selectedStaffIndex, setSelectedStaffIndex] = useState<number>(0);

  if (!order) return null;

  const handleCopyAccount = () => {
    const accNum = order.paymentMethod === 'bank_transfer_mandiri' 
      ? OFFICIAL_COMPANY_INFO.mandiriBank.accountNumber 
      : OFFICIAL_COMPANY_INFO.officialBank.accountNumber;
    navigator.clipboard.writeText(accNum);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleCopyResi = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2500);
  };

  const handleDownloadInvoice = () => {
    if (!userProfile) {
      if (onRequireAuth) {
        onRequireAuth('login', 'Silakan Masuk atau Buat Akun terlebih dahulu untuk mengunduh nota PDF resmi.');
      }
      return;
    }
    if (onOpenInvoiceViewer) {
      onOpenInvoiceViewer(order);
    } else {
      printOrDownloadInvoice(order);
    }
  };

  // Structured WhatsApp Message Confirmation generator (user requirement)
  const getWhatsAppLink = () => {
    const staff = OFFICIAL_CS_STAFF[selectedStaffIndex];
    const itemsSummary = order.items
      .map((i) => `• ${i.product.name} (Ukuran: ${i.selectedWidth}mm | SKU: ${i.selectedSku}) × ${i.quantity} = ${formatRupiah(i.product.price * i.quantity)}`)
      .join('\n');

    const paymentLabel = 
      order.paymentMethod === 'bank_transfer_bca' ? 'Transfer Bank BCA (035-309-8877 a/n PT Surya Gemilang Sejati)' :
      order.paymentMethod === 'bank_transfer_mandiri' ? 'Transfer Bank Mandiri (122-00-1199882-1 a/n PT Surya Gemilang Sejati)' :
      'QRIS Resmi Statis Toko (NMID: ID102435987112)';

    const message = 
`*KONFIRMASI PESANAN & PEMBAYARAN MANUAL*
━━━━━━━━━━━━━━━━━━━━━
*Nomor Nota / Invoice :* ${order.invoiceNumber || `INV/2026/${order.orderNumber}`}
*Nomor Resi (Biteship) :* ${order.trackingNumber}

*Rincian Produk:*
${itemsSummary}

*Ongkir dari Biteship :* ${order.isFreeShipping ? 'Rp 0 (BEBAS ONGKIR)' : formatRupiah(order.shippingCost)} (${order.shippingCarrier})
*Subtotal Produk      :* ${formatRupiah(order.subtotal)}
*TOTAL HARGA / TAGIHAN :* *${formatRupiah(order.totalAmount)}*

*Metode Pembayaran :* ${paymentLabel}

*Alamat Tujuan:*
${order.customer.fullName} (${order.customer.phone})
${order.customer.address}, ${order.customer.city}

Halo CS ${staff.name}, saya telah melakukan checkout di website. Saya akan mentransfer/scan QR sesuai nominal nota di atas dan melampirkan bukti transfer di chat ini. Mohon verifikasi pembayaran saya agar pesanan dapat segera dikirim. Terima kasih!`;

    return buildWhatsAppLink(staff.whatsappNumber, message);
  };

  const whatsappHref = getWhatsAppLink();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto font-sans">
      <div 
        className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden my-4 sm:my-8 rounded-2xl animate-in fade-in zoom-in-95 border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Pesanan Berhasil Dibuat!
              </h2>
              <div className="text-xs text-slate-500 font-sans flex items-center gap-2 mt-0.5">
                <span>No. Pesanan: <strong className="text-slate-900 font-mono">{order.orderNumber}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto bg-white text-xs">
          
          {/* 0. Point Reward Earned Banner */}
          <div className="p-4 bg-[#FAF6ED] border border-[#C8A15A]/40 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C8A15A] text-neutral-950 flex items-center justify-center font-bold shrink-0">
                <Check className="w-5 h-5 text-neutral-950 stroke-[3]" />
              </div>
              <div>
                <span className="text-[10px] text-[#8A6B29] font-bold uppercase tracking-wider block">
                  Bonus Point Reward Pembeli Diterbitkan!
                </span>
                <span className="text-sm font-extrabold text-neutral-900">
                  +{Math.max(100, Math.floor(order.totalAmount / 10000)).toLocaleString('id-ID')} Poin Ditambahkan ke Akun Anda
                </span>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Tukarkan poin Anda di menu Profil untuk Gratis Traveling ke Bali / Italia & Emas Batangan Antam.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="px-3 py-1.5 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold rounded-lg text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Lihat Poin
            </button>
          </div>

          {/* 1. Nota Digital & Resi Pengiriman Biteship Header Card */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 shadow-md border border-[#C8A15A]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-700 pb-3">
              <div>
                <div className="text-[10px] text-[#C8A15A] font-bold uppercase tracking-wider">
                  Nota / Invoice Digital Resmi
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {order.invoiceNumber || `INV/2026/${order.orderNumber}`}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="px-3.5 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Unduh / Cetak Nota Digital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                <span className="text-[10px] text-neutral-400 block font-medium">Logistik (API Biteship):</span>
                <span className="font-semibold text-sky-400 block truncate">{order.shippingCarrier}</span>
                <span className="font-mono text-[11px] text-neutral-200">Resi AWB: {order.trackingNumber}</span>
              </div>

              <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                <span className="text-[10px] text-neutral-400 block font-medium">Total Tagihan Nota:</span>
                <span className="font-bold text-base text-[#D4AF37] font-mono">{formatRupiah(order.totalAmount)}</span>
                <span className="text-[10px] text-neutral-300 block">Metode: Transfer Manual / QRIS</span>
              </div>
            </div>
          </div>

          {/* 1.5. INVOICE RESMI & BATAS WAKTU PEMBAYARAN 24 JAM */}
          <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-amber-950 text-xs uppercase tracking-wide">
                  Invoice Pemesanan — Batas Waktu Bayar 24 Jam
                </span>
              </div>
              <span className="px-2 py-0.5 bg-amber-200/70 text-amber-900 font-bold rounded text-[10px] uppercase font-mono">
                24 Jam Tersisa
              </span>
            </div>
            <div className="text-[11px] text-amber-900 leading-relaxed">
              Tagihan invoice resmi: <strong className="font-mono">{order.invoiceNumber || `INV/2026/${order.orderNumber}`}</strong>.
              Harap selesaikan pembayaran dalam kurun waktu <strong>24 jam</strong>. Jika belum dibayar dalam batas waktu tersebut, pesanan otomatis <strong>dibatalkan</strong> oleh sistem.
            </div>
          </div>

          {/* 2. Instruksi Pembayaran (No Rekening / QRIS Saja) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                {order.paymentMethod === 'qris' ? (
                  <QrCode className="w-4 h-4 text-rose-600" />
                ) : (
                  <CreditCard className="w-4 h-4 text-[#8A6B29]" />
                )}
                <span>Instruksi Pembayaran Resmi:</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                Total: {formatRupiah(order.totalAmount)}
              </span>
            </div>

            {order.paymentMethod === 'qris' ? (
              /* QRIS Display */
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <div className="w-36 h-36 bg-slate-100 rounded-lg mx-auto flex items-center justify-center border border-slate-300 p-2">
                  <div className="w-full h-full border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500">
                    <QrCode className="w-16 h-16 text-slate-800" />
                    <span className="text-[9px] font-bold font-mono mt-1">SCAN QRIS</span>
                  </div>
                </div>
                <div className="font-bold text-slate-900 text-xs">
                  {OFFICIAL_COMPANY_INFO.qrisInfo.merchantName}
                </div>
                <div className="text-[10px] text-slate-500">
                  NMID: {OFFICIAL_COMPANY_INFO.qrisInfo.nmid} · Berlaku untuk semua e-wallet & mobile banking
                </div>
              </div>
            ) : (
              /* Bank Transfer BCA / Mandiri Display */
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold text-[11px]">
                    {order.paymentMethod === 'bank_transfer_mandiri' ? 'Bank Mandiri (IDR)' : 'Bank BCA (IDR)'}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    Rekening Giro Resmi
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-base font-mono font-bold text-slate-900">
                      {order.paymentMethod === 'bank_transfer_mandiri' 
                        ? OFFICIAL_COMPANY_INFO.mandiriBank.accountNumber 
                        : OFFICIAL_COMPANY_INFO.officialBank.accountNumber}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">
                      a/n PT SURYA GEMILANG SEJATI
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAccount ? 'Tersalin' : 'Salin No. Rek'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Instruksi Pembayaran & Konfirmasi WhatsApp (Sesuai Permintaan Spesifikasi User) */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                Instruksi Pembayaran & Konfirmasi WhatsApp:
              </span>
            </div>
            
            <ol className="list-decimal list-inside text-[11px] text-emerald-900 space-y-1 leading-relaxed">
              <li>Lakukan transfer manual ke rekening bank / scan QRIS sesuai nominal total tagihan nota di atas.</li>
              <li>Simpan foto atau screenshot struk bukti transfer Anda.</li>
              <li>Klik tombol hijau <strong>"Kirim Konfirmasi ke WhatsApp"</strong> di bawah untuk mengirim data nota dan melampirkan bukti transfer ke WhatsApp admin.</li>
            </ol>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer no-underline text-center"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Kirim Konfirmasi ke WhatsApp</span>
            </a>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 cursor-pointer font-medium"
            >
              Lanjut Belanja di Katalog
            </button>
            <button
              type="button"
              onClick={onViewOrders}
              className="text-[#C8A15A] font-bold hover:underline cursor-pointer"
            >
              Lihat Riwayat Pesanan Saya &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
