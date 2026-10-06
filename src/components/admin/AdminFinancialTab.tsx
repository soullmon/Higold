import React, { useState, useMemo } from 'react';
import { 
  TrendUp, ArrowUpRight, ArrowDownLeft, CurrencyDollar, 
  CreditCard, QrCode, DownloadSimple, Funnel, MagnifyingGlass, 
  CalendarBlank, CheckCircle, Warning, ShieldCheck, 
  Buildings, ArrowsClockwise
} from '@phosphor-icons/react';
import { CMSAccessRole, Order } from '../../types';
import { FinancialLogItem, INITIAL_FINANCIAL_LOGS } from '../../data/cmsData';
import { formatRupiah } from '../../utils/format';

interface AdminFinancialTabProps {
  currentRole: CMSAccessRole;
  orders?: Order[];
}

export const AdminFinancialTab: React.FC<AdminFinancialTabProps> = ({ currentRole, orders = [] }) => {
  const [baseLogs, setBaseLogs] = useState<FinancialLogItem[]>(INITIAL_FINANCIAL_LOGS);
  const [typeFilter, setTypeFilter] = useState<'all' | 'inflow' | 'outflow'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize financial logs with real paid/processed orders
  // "Sekarang jumlah Keuangan harus sesuai"
  const logs = useMemo(() => {
    // Generate order logs for confirmed or processed orders
    const confirmedOrders = orders.filter(o => 
      o.orderStatus === 'diproses' || 
      o.orderStatus === 'selesai' || 
      o.paymentStatus === 'confirmed'
    );

    const orderLogs: FinancialLogItem[] = confirmedOrders.map(o => {
      const pMethod = o.paymentMethod === 'qris' 
        ? 'QRIS' 
        : o.paymentMethod === 'bank_transfer_mandiri' 
        ? 'Transfer Bank Mandiri' 
        : 'Transfer Bank BCA';

      return {
        id: `fin-${o.id}`,
        orderNumber: o.orderNumber,
        date: o.createdAt ? o.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        customerName: o.customer.fullName,
        accountType: 'Pelanggan',
        type: 'inflow',
        paymentMethod: pMethod as any,
        category: 'Penjualan Produk',
        amount: o.totalAmount,
        description: `Pembayaran #${o.orderNumber} (${o.customer.fullName}) - ${o.items.length} item`,
        referenceNo: o.invoiceNumber || o.orderNumber,
        status: 'verified',
      };
    });

    // Merge without duplicate reference numbers
    const existingRef = new Set(orderLogs.map(l => l.referenceNo));
    const nonDuplicatedBase = baseLogs.filter(l => !existingRef.has(l.referenceNo));

    return [...orderLogs, ...nonDuplicatedBase];
  }, [orders, baseLogs]);

  // If role is CS, block access (as explicitly requested by user)
  if (currentRole !== 'admin') {
    return (
      <div className="p-8 bg-white rounded-lg border border-rose-200 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-md flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">
          Akses Finansial Dibatasi Khusus Master Administrator
        </h3>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          Role Customer Service (CS) tidak memiliki izin untuk melihat flow keuangan, saldo rekening, omzet transaksi, dan rekonsiliasi kas perusahaan HIGOLD.
        </p>
      </div>
    );
  }

  // Calculate metrics
  const totalInflow = logs
    .filter(l => l.type === 'inflow')
    .reduce((sum, l) => sum + l.amount, 0);

  const totalOutflow = logs
    .filter(l => l.type === 'outflow')
    .reduce((sum, l) => sum + l.amount, 0);

  const netCashFlow = totalInflow - totalOutflow;

  const bcaBalance = logs
    .filter(l => l.paymentMethod === 'Transfer Bank BCA')
    .reduce((sum, l) => l.type === 'inflow' ? sum + l.amount : sum - l.amount, 142500000);

  const qrisSettled = logs
    .filter(l => l.paymentMethod === 'QRIS')
    .reduce((sum, l) => sum + l.amount, 48900000);

  // Filter logs
  const filteredLogs = logs.filter(l => {
    const matchesType = typeFilter === 'all' || l.type === typeFilter;
    const matchesMethod = methodFilter === 'all' || l.paymentMethod === methodFilter;
    const matchesSearch = 
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesMethod && matchesSearch;
  });

  const handleDownloadCsv = () => {
    const header = 'ID Transaksi,Tanggal,Tipe,Metode Pembayaran,Kategori,Deskripsi,Pelanggan/Rekanan,Status,Jumlah (IDR)\n';
    const rows = filteredLogs.map(l => 
      `"${l.referenceNo}","${l.date}","${l.type}","${l.paymentMethod}","${l.category}","${l.description}","${l.customerName || '-'}","${l.status}","${l.amount}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HIGOLD_Laporan_Keuangan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan Keuangan CSV berhasil diunduh!');
  };

  const handleToggleReconcile = (logId: string) => {
    setBaseLogs(prev => prev.map(l => {
      if (l.id === logId) {
        const nextStatus = l.status === 'verified' ? 'pending_reconciliation' : 'verified';
        return { ...l, status: nextStatus };
      }
      return l;
    }));
    showToast('Status rekonsiliasi mutasi diperbarui.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 border border-[#C8A15A] text-white text-xs font-semibold rounded-md shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#C8A15A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Exclusive Top Banner */}
      <div className="p-5 rounded-lg border bg-neutral-950 border-[#C8A15A]/40 text-neutral-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[#C8A15A] text-neutral-950 font-bold flex items-center justify-center shrink-0">
            <CurrencyDollar weight="bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Flow Keuangan & Arus Kas Finansial HIGOLD
              </h2>
              <span className="px-2 py-0.5 bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40 text-[10px] font-bold rounded uppercase tracking-wider">
                Khusus Admin
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed max-w-2xl">
              Pantau arus kas masuk (pembayaran invoice QRIS & Transfer Bank), beban logistik kargo, laba bersih, serta status mutasi rekening perbankan resmi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
            <span>Ekspor Laporan (CSV / Excel)</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pemasukan (Inflow) */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Total Arus Masuk</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-700 font-mono">
            {formatRupiah(totalInflow)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            Penjualan retail + borongan proyek
          </div>
        </div>

        {/* Card 2: Pengeluaran & Beban Operasional */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Biaya Logistik & Outflow</span>
            <div className="w-7 h-7 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-rose-700 font-mono">
            {formatRupiah(totalOutflow)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            Ekspedisi kargo + restock pabrik
          </div>
        </div>

        {/* Card 3: Saldo Kas Bersih (Net Cash Flow) */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Net Arus Kas</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-[#C8A15A] flex items-center justify-center">
              <TrendUp weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-neutral-900 font-mono">
            {formatRupiah(netCashFlow)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            Margin surplus operasional
          </div>
        </div>

        {/* Card 4: Saldo Settlement Rekening */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">Kas Terverifikasi</span>
            <div className="w-7 h-7 rounded-md bg-[#FAF6ED] text-[#C8A15A] flex items-center justify-center">
              <CreditCard weight="bold" className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-[#8A6B29] font-mono">
            {formatRupiah(bcaBalance + qrisSettled)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">
            BCA ({formatRupiah(bcaBalance)}) + QRIS
          </div>
        </div>
      </div>

      {/* Mutasi Transaksi Table Section */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs p-5 space-y-4">
        {/* Controls: Search, Type Filter, Method Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="relative w-full sm:w-72">
            <MagnifyingGlass className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari no. invoice, keterangan, rekanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-hidden focus:border-[#C8A15A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-neutral-300 rounded-md bg-white text-neutral-700 font-medium cursor-pointer"
            >
              <option value="all">Semua Arus Kas</option>
              <option value="inflow">Arus Masuk (+)</option>
              <option value="outflow">Arus Keluar (-)</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-neutral-300 rounded-md bg-white text-neutral-700 font-medium cursor-pointer"
            >
              <option value="all">Semua Metode Pembayaran</option>
              <option value="Transfer Bank BCA">Transfer Bank BCA</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
            </select>
          </div>
        </div>

        {/* Mutasi Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
              <tr>
                <th className="px-3 py-2.5">No. Referensi / Invoice</th>
                <th className="px-3 py-2.5">Tanggal</th>
                <th className="px-3 py-2.5">Metode Bayar</th>
                <th className="px-3 py-2.5">Kategori / Keterangan</th>
                <th className="px-3 py-2.5">Pihak / Rekanan</th>
                <th className="px-3 py-2.5 text-right">Jumlah</th>
                <th className="px-3 py-2.5 text-center">Rekonsiliasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLogs.map((log) => {
                const isInflow = log.type === 'inflow';

                return (
                  <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-3 py-3 font-mono font-bold text-neutral-900">
                      {log.referenceNo}
                    </td>

                    <td className="px-3 py-3 text-neutral-600 whitespace-nowrap">
                      {log.date}
                    </td>

                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-neutral-800">
                        {log.paymentMethod.includes('QRIS') ? (
                          <QrCode className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5 text-[#8A6B29]" />
                        )}
                        <span>{log.paymentMethod}</span>
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="font-bold text-neutral-900">{log.category}</div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-xs">{log.description}</div>
                    </td>

                    <td className="px-3 py-3 text-neutral-700">
                      {log.customerName || '-'}
                    </td>

                    <td className={`px-3 py-3 text-right font-mono font-bold whitespace-nowrap ${
                      isInflow ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isInflow ? '+' : '-'} {formatRupiah(log.amount)}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleToggleReconcile(log.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          log.status === 'verified' || log.status === 'settled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                        title="Klik untuk ubah status rekonsiliasi"
                      >
                        {log.status === 'verified' || log.status === 'settled' ? 'Terverifikasi' : 'Pending'}
                      </button>
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
