import * as XLSX from 'xlsx';
import { Product } from '../types';

export interface ParsedImportRow {
  isValid: boolean;
  errors: string[];
  product: Partial<Product>;
  rawRow: Record<string, any>;
}

export interface ImportResult {
  totalRows: number;
  validRows: ParsedImportRow[];
  invalidRows: ParsedImportRow[];
}

// Convert cell to clean string
const cleanStr = (val: any): string => {
  if (val === undefined || val === null) return '';
  return String(val).trim();
};

// Convert cell to number
const cleanNum = (val: any, fallback = 0): number => {
  if (val === undefined || val === null) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
};

// Map row object with loose keys to Product structure
export const mapRawRowToProduct = (row: Record<string, any>, rowIndex: number): ParsedImportRow => {
  const errors: string[] = [];
  
  // Find fields by multiple possible names (ID or EN)
  const getVal = (...keys: string[]): any => {
    for (const k of keys) {
      const lowerK = k.toLowerCase().replace(/[\s_-]+/g, '');
      for (const rowKey of Object.keys(row)) {
        const cleanRowKey = rowKey.toLowerCase().replace(/[\s_-]+/g, '');
        if (cleanRowKey === lowerK) {
          return row[rowKey];
        }
      }
    }
    return undefined;
  };

  const name = cleanStr(getVal('nama', 'namaproduk', 'name', 'productname'));
  const sku = cleanStr(getVal('sku', 'kodebarang', 'kode', 'productcode')) || `HGD-IMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const categoryId = cleanStr(getVal('kategori', 'kategoriid', 'category', 'categoryid')) || 'corner-units';
  const subcategoryId = cleanStr(getVal('subkategori', 'subkategoriid', 'subcategory', 'subcategoryid')) || 'swing-trays';
  const series = cleanStr(getVal('seri', 'series', 'productseries')) || 'Diamond';
  
  const price = cleanNum(getVal('harga', 'hargajual', 'price', 'sellingprice'), 0);
  const originalPrice = cleanNum(getVal('hargacoret', 'hargasubtotal', 'originalprice', 'listprice'), price > 0 ? price * 1.15 : 0);
  const stockQuantity = cleanNum(getVal('stok', 'stock', 'jumlahstok', 'quantity'), 10);
  
  const minWidth = cleanNum(getVal('lebarmin', 'lebarminimal', 'minwidth', 'width'), 860);
  const minDepth = cleanNum(getVal('kedalamanmin', 'kedalamanminimal', 'mindepth', 'depth'), 520);
  const minHeight = cleanNum(getVal('tinggimin', 'tinggiminimal', 'minheight', 'height'), 650);

  const cabinetWidthsRaw = cleanStr(getVal('ukurankabinet', 'lebarkabinet', 'cabinetwidths', 'cabinetwidth'));
  const cabinetWidths = cabinetWidthsRaw 
    ? cabinetWidthsRaw.split(/[,;\s]+/).map(w => cleanNum(w)).filter(w => w > 0)
    : [900, 1000];

  const openingDirectionsRaw = cleanStr(getVal('arahbukaan', 'openingdirections', 'direction'));
  const openingDirections = openingDirectionsRaw 
    ? (openingDirectionsRaw.split(/[,;]+/).map(s => s.trim()) as any)
    : ['Kiri (Left)', 'Kanan (Right)'];

  const finishOptionsRaw = cleanStr(getVal('finishing', 'finishoptions', 'warna'));
  const finishOptions = finishOptionsRaw 
    ? finishOptionsRaw.split(/[,;]+/).map(s => s.trim())
    : ['Diamond Grey Titanium', 'Satin Stainless Steel'];

  const material = cleanStr(getVal('material', 'bahan')) || 'SUS 304 Solid Stainless Steel & Tempered Glass';
  const loadCapacity = cleanStr(getVal('kapasitasbeban', 'loadcapacity', 'kapasitas')) || '25 kg per baki / total 50 kg';
  const softCloseMechanism = cleanStr(getVal('mekanisme', 'softclose', 'softclosemechanism')) || 'Heavy-duty hydraulic damping cylinder';
  const warranty = cleanStr(getVal('garansi', 'warranty')) || '5 Tahun Garansi Mekanisme';
  
  const shortDesc = cleanStr(getVal('deskripsisingkat', 'shortdesc', 'ringkasan')) || `${name} dengan mekanisme soft-close premium Higold.`;
  const fullDesc = cleanStr(getVal('deskripsilengkap', 'fulldesc', 'deskripsi')) || `Hardware kabinet dapur arsitektural kualitas tinggi untuk kenyamanan dan estetika interior modern.`;
  
  const featuresRaw = cleanStr(getVal('fitur', 'fiturutama', 'features'));
  const features = featuresRaw 
    ? featuresRaw.split(/[\n,;]+/).map(f => f.trim()).filter(Boolean)
    : ['Mekanisme soft-close hidrolik', 'Material tahan korosi SUS 304', 'Kapasitas beban heavy duty'];

  const imageUrl = cleanStr(getVal('gambar', 'urlgambar', 'imageurl', 'image', 'foto'));

  // Validations
  if (!name) {
    errors.push(`Baris ${rowIndex + 1}: Nama Produk wajib diisi`);
  }
  if (price <= 0) {
    errors.push(`Baris ${rowIndex + 1}: Harga harus lebih dari 0`);
  }

  const generatedId = `hgd-imp-${Date.now().toString(36)}-${rowIndex}-${Math.floor(Math.random() * 1000)}`;

  const product: Partial<Product> = {
    id: generatedId,
    sku,
    name,
    categoryId,
    subcategoryId,
    series: series as any,
    price,
    originalPrice,
    stockQuantity,
    inStock: stockQuantity > 0,
    minCabinetDims: {
      width: minWidth,
      depth: minDepth,
      height: minHeight,
    },
    cabinetWidths: cabinetWidths.length > 0 ? cabinetWidths : [900],
    openingDirections,
    finishOptions,
    material,
    loadCapacity,
    softCloseMechanism,
    warranty,
    shortDesc,
    fullDesc,
    features,
    imageUrl: imageUrl || undefined,
    svgVisualType: 'swing-tray',
  };

  return {
    isValid: errors.length === 0,
    errors,
    product,
    rawRow: row,
  };
};

// Parse Excel / CSV File
export const parseExcelOrCsvFile = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON array
        const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const validRows: ParsedImportRow[] = [];
        const invalidRows: ParsedImportRow[] = [];

        rawRows.forEach((row, idx) => {
          // Skip completely empty rows
          const hasContent = Object.values(row).some(v => cleanStr(v) !== '');
          if (!hasContent) return;

          const parsed = mapRawRowToProduct(row, idx);
          if (parsed.isValid) {
            validRows.push(parsed);
          } else {
            invalidRows.push(parsed);
          }
        });

        resolve({
          totalRows: validRows.length + invalidRows.length,
          validRows,
          invalidRows,
        });
      } catch (err) {
        reject(new Error(`Gagal membaca file Excel/CSV: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file dari penyimpanan lokal.'));
    };

    reader.readAsBinaryString(file);
  });
};

// Parse Tab-Separated or Comma-Separated pasted text (from Google Sheets or Excel)
export const parsePastedSpreadsheetText = (rawText: string): ImportResult => {
  const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return { totalRows: 0, validRows: [], invalidRows: [] };
  }

  // Detect delimiter: tab or comma or semicolon
  const firstLine = lines[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let delimiter = '\t';
  if (commaCount > tabCount && commaCount > semiCount) delimiter = ',';
  else if (semiCount > tabCount && semiCount > commaCount) delimiter = ';';

  // Check if first line is a header
  const headers = lines[0].split(delimiter).map(h => cleanStr(h));
  const hasHeaderNames = headers.some(h => 
    /nama|name|sku|kode|harga|price|kategori|stok/i.test(h)
  );

  const startIdx = hasHeaderNames ? 1 : 0;
  const columnHeaders = hasHeaderNames 
    ? headers 
    : ['nama', 'sku', 'kategori', 'subkategori', 'seri', 'harga', 'stok', 'material'];

  const rawRows: Record<string, any>[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(delimiter);
    const rowObj: Record<string, any> = {};
    columnHeaders.forEach((colName, cIdx) => {
      rowObj[colName] = cols[cIdx] ? cleanStr(cols[cIdx]) : '';
    });
    rawRows.push(rowObj);
  }

  const validRows: ParsedImportRow[] = [];
  const invalidRows: ParsedImportRow[] = [];

  rawRows.forEach((row, idx) => {
    const parsed = mapRawRowToProduct(row, idx);
    if (parsed.isValid) {
      validRows.push(parsed);
    } else {
      invalidRows.push(parsed);
    }
  });

  return {
    totalRows: validRows.length + invalidRows.length,
    validRows,
    invalidRows,
  };
};

// Parse JSON text array
export const parseBulkJsonText = (jsonString: string): ImportResult => {
  try {
    const parsed = JSON.parse(jsonString);
    const rowsArray = Array.isArray(parsed) ? parsed : [parsed];

    const validRows: ParsedImportRow[] = [];
    const invalidRows: ParsedImportRow[] = [];

    rowsArray.forEach((row, idx) => {
      const mapped = mapRawRowToProduct(row, idx);
      if (mapped.isValid) {
        validRows.push(mapped);
      } else {
        invalidRows.push(mapped);
      }
    });

    return {
      totalRows: validRows.length + invalidRows.length,
      validRows,
      invalidRows,
    };
  } catch (err) {
    throw new Error(`Format JSON tidak valid: ${(err as Error).message}`);
  }
};

// Download official Excel template (.xlsx)
export const downloadOfficialExcelTemplate = () => {
  const sampleData = [
    {
      'Nama Produk': 'Higold Diamond Style Swing Tray V2',
      'SKU': 'HGD-SWG-V2',
      'Kategori': 'corner-units',
      'Subkategori': 'swing-trays',
      'Seri': 'Diamond',
      'Harga': 6950000,
      'Harga Coret': 7800000,
      'Stok': 15,
      'Lebar Minimal (mm)': 860,
      'Kedalaman Minimal (mm)': 520,
      'Tinggi Minimal (mm)': 650,
      'Ukuran Kabinet (mm)': '900, 1000',
      'Arah Bukaan': 'Kiri (Left), Kanan (Right)',
      'Finishing': 'Diamond Grey Titanium',
      'Material': 'SUS 304 Solid Stainless Steel',
      'Kapasitas Beban': '25 kg per baki / total 50 kg',
      'Deskripsi Singkat': 'Sistem baki putar sudut kabinet dapur dengan rel hidrolik soft-close.',
      'Fitur': 'Rel soft-close ganda, Baki anti-slip berlian, Sudut bukaan 90 derajat',
    },
    {
      'Nama Produk': 'Higold Slim Multi Larder Pantry 6 Tier',
      'SKU': 'HGD-LDR-6T',
      'Kategori': 'larder-units',
      'Subkategori': 'tall-pantry',
      'Seri': 'Shearer',
      'Harga': 18500000,
      'Harga Coret': 21000000,
      'Stok': 8,
      'Lebar Minimal (mm)': 450,
      'Kedalaman Minimal (mm)': 520,
      'Tinggi Minimal (mm)': 1950,
      'Ukuran Kabinet (mm)': '450, 600',
      'Arah Bukaan': 'Universal',
      'Finishing': 'Matte Dark Anthracite',
      'Material': 'Space Aluminum & Tempered Glass',
      'Kapasitas Beban': '10 kg per tier / total 70 kg',
      'Deskripsi Singkat': 'Pantry vertikal tinggi 6 tingkat dengan mekanisme sinkronisasi pintu.',
      'Fitur': 'Rel sinkron hidrolik, Baki dapat diatur ketinggiannya, Desain kaca tempered',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  
  // Set nice column widths
  ws['!cols'] = [
    { wch: 35 }, // Nama Produk
    { wch: 15 }, // SKU
    { wch: 18 }, // Kategori
    { wch: 18 }, // Subkategori
    { wch: 15 }, // Seri
    { wch: 12 }, // Harga
    { wch: 12 }, // Harga Coret
    { wch: 8 },  // Stok
    { wch: 18 }, // Lebar Minimal
    { wch: 20 }, // Kedalaman Minimal
    { wch: 18 }, // Tinggi Minimal
    { wch: 20 }, // Ukuran Kabinet
    { wch: 25 }, // Arah Bukaan
    { wch: 25 }, // Finishing
    { wch: 30 }, // Material
    { wch: 30 }, // Kapasitas Beban
    { wch: 40 }, // Deskripsi Singkat
    { wch: 45 }, // Fitur
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Produk HIGOLD');

  XLSX.writeFile(wb, 'Template_Impor_Produk_HIGOLD.xlsx');
};

// Download CSV template
export const downloadOfficialCsvTemplate = () => {
  const csvContent = 
    `Nama Produk,SKU,Kategori,Subkategori,Seri,Harga,Harga Coret,Stok,Lebar Minimal (mm),Kedalaman Minimal (mm),Tinggi Minimal (mm),Ukuran Kabinet (mm),Arah Bukaan,Finishing,Material,Kapasitas Beban,Deskripsi Singkat,Fitur\n` +
    `"Higold Diamond Style Swing Tray V2","HGD-SWG-V2","corner-units","swing-trays","Diamond",6950000,7800000,15,860,520,650,"900, 1000","Kiri (Left), Kanan (Right)","Diamond Grey Titanium","SUS 304 Solid Stainless Steel","25 kg per baki","Sistem baki putar sudut kabinet dapur","Rel soft-close ganda; Baki anti-slip"\n` +
    `"Higold Slim Multi Larder Pantry 6 Tier","HGD-LDR-6T","larder-units","tall-pantry","Shearer",18500000,21000000,8,450,520,1950,"450, 600","Universal","Matte Dark Anthracite","Space Aluminum & Tempered Glass","10 kg per tier","Pantry vertikal tinggi 6 tingkat","Rel sinkron hidrolik; Kaca tempered"`;

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Template_Impor_Produk_HIGOLD.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
