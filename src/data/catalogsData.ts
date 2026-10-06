import { PdfCatalogItem, CompanyOfficialConfig } from '../types';
import { OFFICIAL_COMPANY_INFO } from './products';

export const INITIAL_PDF_CATALOGS: PdfCatalogItem[] = [
  {
    id: 'pdf-1',
    title: 'Higold Master Kitchen Hardware Catalog 2024/2025 (Official Edition)',
    filename: 'HIGOLD-Master-Catalog-2024-2025.pdf',
    category: 'master',
    categoryLabel: 'Master Catalog',
    fileSize: '48.5 MB',
    pageCount: 148,
    year: '2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Katalog utama komprehensif berisi seluruh lini produk: Corner Units, Tall Units, Base Units, Wall Storage, dan Kitchen Sinks beserta spesifikasi teknis dan dimensi kabinet.',
    downloadCount: 1420
  },
  {
    id: 'pdf-2',
    title: 'Buku Spesifikasi & Gambar Kerja CAD Corner Units (Swing Tray & Magic Corner)',
    filename: 'HIGOLD-Corner-Units-Technical-CAD.pdf',
    category: 'technical',
    categoryLabel: 'Gambar Kerja CAD',
    fileSize: '18.2 MB',
    pageCount: 56,
    year: '2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Cetak biru arsitektural lengkap dengan dimensi bukaan pintu, sudut putar 90°-180°, radius ayun baki, dan diagram toleransi celah kabinet 800mm-1000mm.',
    downloadCount: 980
  },
  {
    id: 'pdf-3',
    title: 'Katalog Seri Tall Larder Pantry & Pull-Out Storage System',
    filename: 'HIGOLD-Tall-Larder-Pantry-Series.pdf',
    category: 'technical',
    categoryLabel: 'Larder Series',
    fileSize: '14.0 MB',
    pageCount: 42,
    year: '2024/2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
    description: 'Spesifikasi sistem penyimpanan kabinet tinggi 4 hingga 6 susun, kapasitas beban rel per tingkat, mekanisme sinkronisasi, dan panduan perakitan frame baja.',
    downloadCount: 750
  },
  {
    id: 'pdf-4',
    title: 'Brosur Sink Nano Stainless Steel SUS 304 & Arsitektural Faucet Collection',
    filename: 'HIGOLD-Stainless-SUS304-Sink-Collection.pdf',
    category: 'sink',
    categoryLabel: 'Sink & Faucet',
    fileSize: '22.4 MB',
    pageCount: 68,
    year: '2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    description: 'Koleksi bak cuci piring undermount & topmount dengan teknologi titanium nano-coating anti gores, ketebalan 1.2mm SUS 304, dan kran mixer fleksibel.',
    downloadCount: 610
  },
  {
    id: 'pdf-5',
    title: 'Buku Panduan Instalasi & Pemotongan Toleransi Kabinet untuk Workshop',
    filename: 'HIGOLD-Workshop-Installation-Manual.pdf',
    category: 'manual',
    categoryLabel: 'Panduan Tukang',
    fileSize: '8.8 MB',
    pageCount: 34,
    year: '2024',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    description: 'Panduan praktis lapangan berbahasa Indonesia untuk desainer interior, tukang kayu, dan kontraktor mengenai posisi lubang sekrup dan penyesuaian leveling rel.',
    downloadCount: 1150
  },
  {
    id: 'pdf-6',
    title: 'Sertifikat Uji LGA Jerman & Buku Garansi Mekanisme Resmi Higold',
    filename: 'HIGOLD-LGA-Germany-Warranty-Certificate.pdf',
    category: 'manual',
    categoryLabel: 'Sertifikasi Resmi',
    fileSize: '4.5 MB',
    pageCount: 20,
    year: '2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80',
    description: 'Dokumentasi hasil uji laboratorium ketahanan 100.000 kali buka-tutup peredam hidrolik dan lembar kartu garansi resmi distributor PT Surya Gemilang Sejati.',
    downloadCount: 890
  }
];

export const INITIAL_COMPANY_CONFIG: CompanyOfficialConfig = {
  bankName: OFFICIAL_COMPANY_INFO.officialBank.bankName,
  bankBranch: OFFICIAL_COMPANY_INFO.officialBank.branch,
  bankAccountNumber: OFFICIAL_COMPANY_INFO.officialBank.accountNumber,
  bankAccountName: OFFICIAL_COMPANY_INFO.officialBank.accountName,
  mandiriAccountNumber: '122-00-9876543-2',
  mandiriAccountName: 'PT SURYA GEMILANG SEJATI',
  qrisMerchantName: 'HIGOLD INDONESIA OFFICIAL (NMID: ID1020304050)',
  freeShippingMaxDistanceKm: 30,
  showroomTitle: OFFICIAL_COMPANY_INFO.showroom.title,
  showroomAddress: OFFICIAL_COMPANY_INFO.showroom.address,
  showroomDistrict: OFFICIAL_COMPANY_INFO.showroom.district,
  showroomOperatingHours: OFFICIAL_COMPANY_INFO.showroom.operatingHours,
  showroomPhone: OFFICIAL_COMPANY_INFO.showroom.phone,
  showroomWhatsapp: OFFICIAL_COMPANY_INFO.showroom.whatsappHotline,
  welcomeVoucherAmount: 500000,
  memberDiscountPercent: 5,
  proDiscountPercent: 15,
};
