import React, { useState } from 'react';
import { 
  Upload, FileSpreadsheet, Download, CheckCircle2, 
  AlertTriangle, Copy, Table, FileText, ArrowRight,
  RefreshCw, Check, Layers, AlertCircle
} from 'lucide-react';
import { Product, CMSAccessRole } from '../../types';
import { 
  parseExcelOrCsvFile, 
  parsePastedSpreadsheetText, 
  parseBulkJsonText, 
  downloadOfficialExcelTemplate, 
  downloadOfficialCsvTemplate,
  ImportResult,
  ParsedImportRow
} from '../../utils/excelImport';
import { formatRupiah } from '../../utils/format';

interface AdminImportTabProps {
  onBatchImportProducts: (products: Product[]) => void;
  currentRole: CMSAccessRole;
}

export const AdminImportTab: React.FC<AdminImportTabProps> = ({
  onBatchImportProducts,
  currentRole,
}) => {
  const [importMode, setImportMode] = useState<'excel' | 'paste' | 'json'>('excel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await parseExcelOrCsvFile(file);
      setImportResult(result);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process pasted spreadsheet text
  const handleProcessPastedText = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Silakan tempel (paste) data spreadsheet terlebih dahulu.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = parsePastedSpreadsheetText(pastedText);
      setImportResult(result);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process JSON input
  const handleProcessJsonText = () => {
    if (!jsonText.trim()) {
      setErrorMsg('Silakan masukkan format JSON terlebih dahulu.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = parseBulkJsonText(jsonText);
      setImportResult(result);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Final Commit Import to Catalog
  const handleCommitImport = () => {
    if (!importResult || importResult.validRows.length === 0) return;

    const newProducts = importResult.validRows.map(r => r.product as Product);
    onBatchImportProducts(newProducts);
    
    setSuccessToast(`Berhasil mengimpor ${newProducts.length} produk baru ke katalog HIGOLD!`);
    setImportResult(null);
    setPastedText('');
    setJsonText('');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-4 bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-200" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {/* Top Method Explainer Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-sky-600" />
            <span>Metode Input Data Otomatis & Massal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mendukung 3 metode otomatis: <strong>Upload Excel/CSV</strong>, <strong>Copy-Paste Tabular Spreadsheet</strong> (tanpa unduh file), atau <strong>JSON Import</strong> (integrasi ERP/API).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadOfficialExcelTemplate}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Unduh Template Excel (.xlsx)</span>
          </button>

          <button
            onClick={downloadOfficialCsvTemplate}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Import Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => { setImportMode('excel'); setImportResult(null); setErrorMsg(null); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            importMode === 'excel'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>1. Upload File Excel / CSV</span>
        </button>

        <button
          onClick={() => { setImportMode('paste'); setImportResult(null); setErrorMsg(null); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            importMode === 'paste'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>2. Paste Spreadsheet (Google Sheets)</span>
        </button>

        <button
          onClick={() => { setImportMode('json'); setImportResult(null); setErrorMsg(null); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            importMode === 'json'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Format JSON (Otomatis API/Batch)</span>
        </button>
      </div>

      {/* Mode 1: File Upload */}
      {importMode === 'excel' && (
        <div className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 text-center transition-colors">
          <input
            type="file"
            id="excel-file-input"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label 
            htmlFor="excel-file-input"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Pilih atau Tarik File Excel (.xlsx, .xls) / CSV ke sini
            </span>
            <span className="text-xs text-slate-400 mt-1 max-w-sm">
              Sistem akan memvalidasi kolom nama produk, harga, SKU, dimensi kabinet, dan kategori secara otomatis.
            </span>
            <span className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs">
              Pilih Berkas dari Komputer
            </span>
          </label>
        </div>
      )}

      {/* Mode 2: Copy-Paste Spreadsheet */}
      {importMode === 'paste' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tempel (Paste) Baris Tabel dari Google Sheets / Excel
            </label>
            <span className="text-[11px] text-slate-400">
              Cukup blok kolom tabel spreadsheet Anda, lalu tekan Ctrl+V di sini
            </span>
          </div>
          <textarea
            rows={6}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Nama Produk [TAB] SKU [TAB] Kategori [TAB] Harga [TAB] Stok&#10;Higold Corner Swing V3 [TAB] HGD-SW-03 [TAB] corner-units [TAB] 7200000 [TAB] 10"
            className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleProcessPastedText}
            disabled={isProcessing}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {isProcessing ? 'Memproses Data...' : 'Analisis & Tampilkan Pratinjau'}
          </button>
        </div>
      )}

      {/* Mode 3: JSON Import */}
      {importMode === 'json' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Format Array JSON Produk
            </label>
            <span className="text-[11px] text-slate-400">
              Format baku untuk ekspor-impor antar sistem / ERP
            </span>
          </div>
          <textarea
            rows={6}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[&#10;  { "name": "Higold Slim Larder", "sku": "HGD-LDR-01", "price": 12500000, "stockQuantity": 5 }&#10;]'
            className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleProcessJsonText}
            disabled={isProcessing}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {isProcessing ? 'Memproses JSON...' : 'Analisis & Tampilkan Pratinjau'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Import Preview Grid */}
      {importResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pratinjau Hasil Pembacaan Data ({importResult.validRows.length} Produk Valid)
              </h3>
              <p className="text-xs text-slate-500">
                Silakan periksa baris data di bawah sebelum menambahkan ke katalog live.
              </p>
            </div>

            <button
              onClick={handleCommitImport}
              disabled={importResult.validRows.length === 0}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Impor {importResult.validRows.length} Produk ke Katalog Sekarang</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-80 border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Produk</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Harga</th>
                  <th className="py-2.5 px-3">Stok</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {importResult.validRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.product.name}</td>
                    <td className="py-2.5 px-3 font-mono">{r.product.sku}</td>
                    <td className="py-2.5 px-3">{r.product.categoryId}</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">{formatRupiah(r.product.price || 0)}</td>
                    <td className="py-2.5 px-3">{r.product.stockQuantity} Unit</td>
                    <td className="py-2.5 px-3 truncate max-w-xs">{r.product.material}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold">
                        Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
