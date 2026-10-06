import { Order } from '../types';
import { formatRupiah } from './format';
import { OFFICIAL_COMPANY_INFO } from '../data/products';

/**
 * Clean printable / PDF trigger for official HIGOLD invoice without bundling errors.
 * Opens native browser print dialog configured for "Save as PDF" / Print.
 */
export function printInvoiceIframe(order: Order): void {
  const existingIframe = document.getElementById('higold-print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'higold-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    return;
  }

  doc.open();
  doc.write(generateInvoiceHtml(order));
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      // Fallback: open printable window
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(generateInvoiceHtml(order));
        printWin.document.close();
        printWin.focus();
        printWin.print();
      }
    }
  }, 350);
}

/**
 * Downloads official Nota Invoice as an offline HTML document or triggers print-to-PDF
 */
export function downloadInvoicePdf(order: Order): void {
  // Trigger print-to-PDF dialog directly
  printInvoiceIframe(order);

  // Also trigger clean offline HTML receipt download
  try {
    const htmlContent = generateInvoiceHtml(order);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NOTA_INVOICE_HIGOLD_${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch {}
}

/**
 * Default wrapper: triggers print and PDF save
 */
export function printOrDownloadInvoice(order: Order): void {
  printInvoiceIframe(order);
}

export function generateInvoiceHtml(order: Order): string {
  const isBca = order.paymentMethod === 'bank_transfer_bca';
  const isMandiri = order.paymentMethod === 'bank_transfer_mandiri';

  const paymentTitle = isBca 
    ? 'Transfer Bank BCA (Manual Verifikasi)' 
    : isMandiri 
    ? 'Transfer Bank Mandiri (Manual Verifikasi)' 
    : 'QRIS Statis Toko (Scan & Pay)';

  const itemsRows = order.items.map((it, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
        <strong style="color: #0f172a;">${it.product.name}</strong><br>
        <span style="font-size: 11px; color: #64748b;">Ukuran: ${it.selectedWidth} mm | SKU: ${it.selectedSku}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 600;">${it.quantity}x</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatRupiah(it.product.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">${formatRupiah(it.product.price * it.quantity)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Nota Resmi - ${order.orderNumber} - HIGOLD Indonesia</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; background: #fff; font-size: 12px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #C8A15A; padding-bottom: 12px; margin-bottom: 16px; }
    .company h2 { margin: 0 0 4px 0; color: #0f172a; font-size: 18px; letter-spacing: 0.5px; }
    .company p { margin: 2px 0; color: #64748b; font-size: 11px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0; color: #C8A15A; font-size: 18px; text-transform: uppercase; }
    .invoice-title p { margin: 2px 0; font-size: 11px; }
    .badge { display: inline-block; padding: 3px 8px; background: #fef3c7; color: #92400e; font-weight: bold; font-size: 10px; border-radius: 4px; margin-top: 4px; text-transform: uppercase; }
    .section-grid { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
    .card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; }
    .card h4 { margin: 0 0 6px 0; font-size: 10px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #0f172a; color: #fff; padding: 7px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
    .totals { width: 320px; margin-left: auto; margin-bottom: 16px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9; font-size: 11px; }
    .totals-row.grand { font-size: 14px; font-weight: bold; color: #0f172a; border-top: 2px solid #C8A15A; border-bottom: 2px solid #C8A15A; padding: 7px 0; }
    .payment-box { background: #fefce8; border: 1px dashed #ca8a04; border-radius: 6px; padding: 10px 12px; margin-bottom: 16px; }
    .payment-box h3 { margin: 0 0 4px 0; font-size: 12px; color: #854d0e; }
    .instruction-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 10px 12px; margin-bottom: 14px; color: #166534; font-size: 11px; }
    .footer { text-align: center; color: #94a3b8; font-size: 10px; margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="company">
      <h2>HIGOLD OFFICIAL INDONESIA</h2>
      <p><strong>PT. SURYA GEMILANG SEJATI</strong> (Distributor Tunggal Resmi)</p>
      <p>Showroom & Gudang Pusat: Jl. Pluit Raya No. 8, Penjaringan, Jakarta Utara 14450</p>
      <p>WhatsApp Konfirmasi Admin: 0812-9988-7766 | Email: order@higold.co.id</p>
    </div>
    <div class="invoice-title">
      <h1>NOTA INVOICE PEMESANAN</h1>
      <p>No. Nota: <strong>${order.invoiceNumber || `INV/2026/${order.orderNumber}`}</strong></p>
      <p>Tanggal: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleDateString('id-ID')}</p>
      <span class="badge">Menunggu Pembayaran (Batas 24 Jam)</span>
    </div>
  </div>

  <div class="section-grid">
    <div class="card">
      <h4>Penerima Pesanan</h4>
      <p style="margin: 0; font-weight: bold; font-size: 12px; color: #0f172a;">${order.customer.fullName}</p>
      <p style="margin: 2px 0;">WhatsApp: <strong>${order.customer.phone}</strong></p>
      <p style="margin: 2px 0;">Email: ${order.customer.email || '-'}</p>
      <p style="margin: 2px 0; color: #475569;">Alamat: ${order.customer.address}, ${order.customer.city}</p>
    </div>

    <div class="card" style="background: #f0f9ff; border-color: #bae6fd;">
      <h4 style="color: #0369a1; border-color: #bae6fd;">Logistik Pengiriman (API Biteship)</h4>
      <p style="margin: 0; font-weight: bold; color: #0284c7;">${order.shippingCarrier}</p>
      <p style="margin: 2px 0;">No. Resi Resmi (AWB): <strong style="font-family: monospace; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; color: #0369a1;">${order.trackingNumber}</strong></p>
      <p style="margin: 2px 0; color: #64748b;">Asal: Gudang Penjaringan, Pluit, Jakarta Utara 14450</p>
      <p style="margin: 2px 0; font-size: 10px; color: #0284c7;">Status Resi: Terbit Otomatis via API Biteship Gateway</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px; text-align: center;">No</th>
        <th>Rincian Produk Hardware Kabinet</th>
        <th style="width: 55px; text-align: center;">Qty</th>
        <th style="width: 120px; text-align: right;">Harga Satuan</th>
        <th style="width: 130px; text-align: right;">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal Produk:</span>
      <span>${formatRupiah(order.subtotal)}</span>
    </div>
    <div class="totals-row">
      <span>Ongkir (API Biteship):</span>
      <span>${order.isFreeShipping ? 'GRATIS (Radius <= 10 km)' : formatRupiah(order.shippingCost)}</span>
    </div>
    <div class="totals-row grand">
      <span>Total Tagihan:</span>
      <span style="color: #b45309;">${formatRupiah(order.totalAmount)}</span>
    </div>
  </div>

  <div class="payment-box">
    <h3>Instruksi Pembayaran Manual (${paymentTitle})</h3>
    ${isBca ? `
      <p style="margin: 3px 0;">Silakan transfer tepat sebesar <strong>${formatRupiah(order.totalAmount)}</strong> ke rekening BCA:</p>
      <p style="margin: 3px 0; font-size: 14px; font-family: monospace; color: #0f172a;"><strong>Bank BCA: 035-309-8877</strong></p>
      <p style="margin: 3px 0;">Atas Nama: <strong>PT. SURYA GEMILANG SEJATI</strong> (Distributor Resmi HIGOLD)</p>
    ` : isMandiri ? `
      <p style="margin: 3px 0;">Silakan transfer tepat sebesar <strong>${formatRupiah(order.totalAmount)}</strong> ke rekening Mandiri:</p>
      <p style="margin: 3px 0; font-size: 14px; font-family: monospace; color: #0f172a;"><strong>Bank Mandiri: 122-00-1199882-1</strong></p>
      <p style="margin: 3px 0;">Atas Nama: <strong>PT. SURYA GEMILANG SEJATI</strong> (Distributor Resmi HIGOLD)</p>
    ` : `
      <p style="margin: 3px 0;">Scan QRIS Statis Toko sebesar <strong>${formatRupiah(order.totalAmount)}</strong>:</p>
      <p style="margin: 3px 0; font-size: 12px; font-family: monospace;">NMID: <strong>${OFFICIAL_COMPANY_INFO.qrisInfo.nmid}</strong> · Merchant: <strong>${OFFICIAL_COMPANY_INFO.qrisInfo.merchantName}</strong></p>
    `}
    <p style="margin: 3px 0 0 0; font-size: 10px; color: #92400e;">Batas Waktu Pembayaran: <strong>24 Jam</strong> sejak nota ini diterbitkan.</p>
  </div>

  <div class="instruction-box">
    <strong>Langkah Konfirmasi WhatsApp Selanjutnya:</strong>
    <ol style="margin: 4px 0 0 15px; padding: 0;">
      <li>Lakukan transfer manual via ATM / m-Banking / scan QRIS sesuai total tagihan di atas.</li>
      <li>Simpan bukti transfer / struk pembayaran.</li>
      <li>Kirim bukti bayar ke WhatsApp Admin: <strong>0812-9988-7766</strong> dengan menyertakan Nomor Nota <strong>${order.orderNumber}</strong>.</li>
      <li>Admin gudang akan memverifikasi pembayaran Anda dan nomor resi Biteship langsung aktif untuk pengiriman!</li>
    </ol>
  </div>

  <div class="footer">
    <p>Terima kasih telah berbelanja hardware kabinet dapur arsitektural di HIGOLD Indonesia.</p>
    <p>Dokumen nota ini sah dan diterbitkan secara digital oleh sistem penjualan HIGOLD Indonesia.</p>
  </div>

</body>
</html>
  `;
}
