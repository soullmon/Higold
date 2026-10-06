/**
 * Database Wilayah Kabupaten / Kota Seluruh Indonesia
 * Gudang Asal: Penjaringan, Jakarta Utara (Kawasan Industri Pluit 14450)
 * Aturan Ongkos Kirim Resmi HIGOLD:
 * - Jarak <= 10 km : GRATIS ONGKIR (Rp 0)
 * - Jarak > 10 km  : Berbayar sesuai tarif kurir logistik Biteship Gateway
 */

export interface IndonesiaCity {
  name: string;
  province: string;
  island: 'Jawa' | 'Sumatera' | 'Kalimantan' | 'Sulawesi' | 'Bali & Nusa Tenggara' | 'Maluku & Papua';
  distanceKm: number;
  isFree: boolean; // True HANYA jika distanceKm <= 10
}

export const INDONESIA_PROVINCES = [
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Kep. Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'Aceh',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Barat Daya',
];

export const INDONESIA_CITIES: IndonesiaCity[] = [
  // --- DKI JAKARTA ---
  // Gudang Asal: Penjaringan / Pluit, Jakarta Utara
  { name: 'Jakarta Utara', province: 'DKI Jakarta', island: 'Jawa', distanceKm: 5, isFree: true },
  { name: 'Jakarta Barat', province: 'DKI Jakarta', island: 'Jawa', distanceKm: 8, isFree: true },
  { name: 'Jakarta Pusat', province: 'DKI Jakarta', island: 'Jawa', distanceKm: 12, isFree: false },
  { name: 'Jakarta Selatan', province: 'DKI Jakarta', island: 'Jawa', distanceKm: 16, isFree: false },
  { name: 'Jakarta Timur', province: 'DKI Jakarta', island: 'Jawa', distanceKm: 22, isFree: false },
  { name: 'Kepulauan Seribu', province: 'DKI Jakarta', island: 'Jawa', distanceKm: 35, isFree: false },

  // --- BANTEN ---
  { name: 'Tangerang Kota', province: 'Banten', island: 'Jawa', distanceKm: 18, isFree: false },
  { name: 'Tangerang Selatan', province: 'Banten', island: 'Jawa', distanceKm: 24, isFree: false },
  { name: 'Kab. Tangerang', province: 'Banten', island: 'Jawa', distanceKm: 30, isFree: false },
  { name: 'Serang Kota', province: 'Banten', island: 'Jawa', distanceKm: 80, isFree: false },
  { name: 'Kab. Serang', province: 'Banten', island: 'Jawa', distanceKm: 85, isFree: false },
  { name: 'Cilegon Kota', province: 'Banten', island: 'Jawa', distanceKm: 95, isFree: false },
  { name: 'Kab. Lebak', province: 'Banten', island: 'Jawa', distanceKm: 110, isFree: false },
  { name: 'Kab. Pandeglang', province: 'Banten', island: 'Jawa', distanceKm: 120, isFree: false },

  // --- JAWA BARAT ---
  { name: 'Bekasi Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 28, isFree: false },
  { name: 'Kab. Bekasi (Cikarang)', province: 'Jawa Barat', island: 'Jawa', distanceKm: 42, isFree: false },
  { name: 'Depok Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 26, isFree: false },
  { name: 'Bogor Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 52, isFree: false },
  { name: 'Kab. Bogor (Cibinong)', province: 'Jawa Barat', island: 'Jawa', distanceKm: 48, isFree: false },
  { name: 'Karawang', province: 'Jawa Barat', island: 'Jawa', distanceKm: 65, isFree: false },
  { name: 'Purwakarta', province: 'Jawa Barat', island: 'Jawa', distanceKm: 88, isFree: false },
  { name: 'Subang', province: 'Jawa Barat', island: 'Jawa', distanceKm: 125, isFree: false },
  { name: 'Sukabumi Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 115, isFree: false },
  { name: 'Kab. Sukabumi', province: 'Jawa Barat', island: 'Jawa', distanceKm: 130, isFree: false },
  { name: 'Cianjur', province: 'Jawa Barat', island: 'Jawa', distanceKm: 105, isFree: false },
  { name: 'Bandung Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 150, isFree: false },
  { name: 'Bandung Barat (Padalarang)', province: 'Jawa Barat', island: 'Jawa', distanceKm: 142, isFree: false },
  { name: 'Kab. Bandung (Soreang)', province: 'Jawa Barat', island: 'Jawa', distanceKm: 165, isFree: false },
  { name: 'Cimahi Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 145, isFree: false },
  { name: 'Sumedang', province: 'Jawa Barat', island: 'Jawa', distanceKm: 185, isFree: false },
  { name: 'Garut', province: 'Jawa Barat', island: 'Jawa', distanceKm: 215, isFree: false },
  { name: 'Tasikmalaya Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 245, isFree: false },
  { name: 'Kab. Tasikmalaya', province: 'Jawa Barat', island: 'Jawa', distanceKm: 255, isFree: false },
  { name: 'Ciamis', province: 'Jawa Barat', island: 'Jawa', distanceKm: 275, isFree: false },
  { name: 'Banjar Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 290, isFree: false },
  { name: 'Pangandaran', province: 'Jawa Barat', island: 'Jawa', distanceKm: 330, isFree: false },
  { name: 'Cirebon Kota', province: 'Jawa Barat', island: 'Jawa', distanceKm: 218, isFree: false },
  { name: 'Kab. Cirebon', province: 'Jawa Barat', island: 'Jawa', distanceKm: 225, isFree: false },
  { name: 'Kuningan', province: 'Jawa Barat', island: 'Jawa', distanceKm: 245, isFree: false },
  { name: 'Majalengka', province: 'Jawa Barat', island: 'Jawa', distanceKm: 205, isFree: false },
  { name: 'Indramayu', province: 'Jawa Barat', island: 'Jawa', distanceKm: 195, isFree: false },

  // --- JAWA TENGAH & DI YOGYAKARTA ---
  { name: 'Semarang Kota', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 440, isFree: false },
  { name: 'Kab. Semarang (Ungaran)', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 460, isFree: false },
  { name: 'Salatiga Kota', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 480, isFree: false },
  { name: 'Surakarta (Solo)', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 520, isFree: false },
  { name: 'Sukoharjo', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 530, isFree: false },
  { name: 'Klaten', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 510, isFree: false },
  { name: 'Boyolali', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 495, isFree: false },
  { name: 'Karanganyar', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 535, isFree: false },
  { name: 'Sragen', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 540, isFree: false },
  { name: 'Wonogiri', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 560, isFree: false },
  { name: 'Yogyakarta Kota', province: 'DI Yogyakarta', island: 'Jawa', distanceKm: 530, isFree: false },
  { name: 'Sleman', province: 'DI Yogyakarta', island: 'Jawa', distanceKm: 520, isFree: false },
  { name: 'Bantul', province: 'DI Yogyakarta', island: 'Jawa', distanceKm: 540, isFree: false },
  { name: 'Kulon Progo (Wates)', province: 'DI Yogyakarta', island: 'Jawa', distanceKm: 495, isFree: false },
  { name: 'Gunungkidul (Wonosari)', province: 'DI Yogyakarta', island: 'Jawa', distanceKm: 565, isFree: false },
  { name: 'Magelang Kota', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 480, isFree: false },
  { name: 'Kab. Magelang', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 485, isFree: false },
  { name: 'Pekalongan Kota', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 340, isFree: false },
  { name: 'Tegal Kota', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 290, isFree: false },
  { name: 'Brebes', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 265, isFree: false },
  { name: 'Pemalang', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 315, isFree: false },
  { name: 'Batang', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 365, isFree: false },
  { name: 'Kendal', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 410, isFree: false },
  { name: 'Kudus', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 490, isFree: false },
  { name: 'Jepara', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 515, isFree: false },
  { name: 'Pati', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 525, isFree: false },
  { name: 'Rembang', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 560, isFree: false },
  { name: 'Blora', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 575, isFree: false },
  { name: 'Grobogan (Purwodadi)', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 505, isFree: false },
  { name: 'Banyumas (Purwokerto)', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 350, isFree: false },
  { name: 'Cilacap', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 375, isFree: false },
  { name: 'Purbalingga', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 360, isFree: false },
  { name: 'Banjarnegara', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 395, isFree: false },
  { name: 'Kebumen', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 430, isFree: false },
  { name: 'Purworejo', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 465, isFree: false },
  { name: 'Wonosobo', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 435, isFree: false },
  { name: 'Temanggung', province: 'Jawa Tengah', island: 'Jawa', distanceKm: 455, isFree: false },

  // --- JAWA TIMUR ---
  { name: 'Surabaya Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 780, isFree: false },
  { name: 'Sidoarjo', province: 'Jawa Timur', island: 'Jawa', distanceKm: 790, isFree: false },
  { name: 'Gresik', province: 'Jawa Timur', island: 'Jawa', distanceKm: 765, isFree: false },
  { name: 'Mojokerto Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 735, isFree: false },
  { name: 'Kab. Mojokerto', province: 'Jawa Timur', island: 'Jawa', distanceKm: 740, isFree: false },
  { name: 'Pasuruan Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 815, isFree: false },
  { name: 'Kab. Pasuruan', province: 'Jawa Timur', island: 'Jawa', distanceKm: 820, isFree: false },
  { name: 'Malang Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 850, isFree: false },
  { name: 'Batu Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 840, isFree: false },
  { name: 'Kab. Malang (Kepanjen)', province: 'Jawa Timur', island: 'Jawa', distanceKm: 865, isFree: false },
  { name: 'Kediri Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 740, isFree: false },
  { name: 'Kab. Kediri', province: 'Jawa Timur', island: 'Jawa', distanceKm: 745, isFree: false },
  { name: 'Blitar Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 810, isFree: false },
  { name: 'Madiun Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 630, isFree: false },
  { name: 'Kab. Madiun', province: 'Jawa Timur', island: 'Jawa', distanceKm: 635, isFree: false },
  { name: 'Jombang', province: 'Jawa Timur', island: 'Jawa', distanceKm: 710, isFree: false },
  { name: 'Nganjuk', province: 'Jawa Timur', island: 'Jawa', distanceKm: 680, isFree: false },
  { name: 'Bojonegoro', province: 'Jawa Timur', island: 'Jawa', distanceKm: 650, isFree: false },
  { name: 'Tuban', province: 'Jawa Timur', island: 'Jawa', distanceKm: 685, isFree: false },
  { name: 'Lamongan', province: 'Jawa Timur', island: 'Jawa', distanceKm: 730, isFree: false },
  { name: 'Probolinggo Kota', province: 'Jawa Timur', island: 'Jawa', distanceKm: 860, isFree: false },
  { name: 'Lumajang', province: 'Jawa Timur', island: 'Jawa', distanceKm: 900, isFree: false },
  { name: 'Jember', province: 'Jawa Timur', island: 'Jawa', distanceKm: 940, isFree: false },
  { name: 'Banyuwangi', province: 'Jawa Timur', island: 'Jawa', distanceKm: 1050, isFree: false },
  { name: 'Bangkalan (Madura)', province: 'Jawa Timur', island: 'Jawa', distanceKm: 805, isFree: false },
  { name: 'Sampang (Madura)', province: 'Jawa Timur', island: 'Jawa', distanceKm: 855, isFree: false },
  { name: 'Pamekasan (Madura)', province: 'Jawa Timur', island: 'Jawa', distanceKm: 900, isFree: false },
  { name: 'Sumenep (Madura)', province: 'Jawa Timur', island: 'Jawa', distanceKm: 950, isFree: false },

  // --- BALI & NUSA TENGGARA ---
  { name: 'Denpasar Kota', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1150, isFree: false },
  { name: 'Badung (Kuta/Seminyak/Canggu)', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1160, isFree: false },
  { name: 'Gianyar (Ubud)', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1170, isFree: false },
  { name: 'Tabanan', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1140, isFree: false },
  { name: 'Buleleng (Singaraja)', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1120, isFree: false },
  { name: 'Klungkung', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1180, isFree: false },
  { name: 'Karangasem', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1210, isFree: false },
  { name: 'Jembrana (Negara)', province: 'Bali', island: 'Bali & Nusa Tenggara', distanceKm: 1080, isFree: false },
  { name: 'Mataram Kota', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', distanceKm: 1250, isFree: false },
  { name: 'Lombok Barat', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', distanceKm: 1260, isFree: false },
  { name: 'Lombok Tengah (Praya)', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', distanceKm: 1275, isFree: false },
  { name: 'Lombok Timur', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', distanceKm: 1300, isFree: false },
  { name: 'Sumbawa (Sumbawa Besar)', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', distanceKm: 1400, isFree: false },
  { name: 'Bima Kota', province: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', distanceKm: 1550, isFree: false },
  { name: 'Kupang Kota', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', distanceKm: 1900, isFree: false },
  { name: 'Manggarai Barat (Labuan Bajo)', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', distanceKm: 1650, isFree: false },
  { name: 'Sikka (Maumere)', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', distanceKm: 1800, isFree: false },
  { name: 'Ende', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', distanceKm: 1780, isFree: false },
  { name: 'Sumba Timur (Waingapu)', province: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', distanceKm: 1720, isFree: false },

  // --- SUMATERA ---
  { name: 'Banda Aceh Kota', province: 'Aceh', island: 'Sumatera', distanceKm: 2300, isFree: false },
  { name: 'Aceh Besar (Jantho)', province: 'Aceh', island: 'Sumatera', distanceKm: 2320, isFree: false },
  { name: 'Lhokseumawe Kota', province: 'Aceh', island: 'Sumatera', distanceKm: 2150, isFree: false },
  { name: 'Langsa Kota', province: 'Aceh', island: 'Sumatera', distanceKm: 2000, isFree: false },
  { name: 'Medan Kota', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1850, isFree: false },
  { name: 'Deli Serdang (Lubuk Pakam)', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1860, isFree: false },
  { name: 'Binjai Kota', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1870, isFree: false },
  { name: 'Pematangsiantar Kota', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1780, isFree: false },
  { name: 'Tebing Tinggi Kota', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1800, isFree: false },
  { name: 'Asahan (Kisaran)', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1750, isFree: false },
  { name: 'Karo (Kabanjahe)', province: 'Sumatera Utara', island: 'Sumatera', distanceKm: 1820, isFree: false },
  { name: 'Padang Kota', province: 'Sumatera Barat', island: 'Sumatera', distanceKm: 1250, isFree: false },
  { name: 'Bukittinggi Kota', province: 'Sumatera Barat', island: 'Sumatera', distanceKm: 1280, isFree: false },
  { name: 'Payakumbuh Kota', province: 'Sumatera Barat', island: 'Sumatera', distanceKm: 1300, isFree: false },
  { name: 'Pariaman Kota', province: 'Sumatera Barat', island: 'Sumatera', distanceKm: 1260, isFree: false },
  { name: 'Solok Kota', province: 'Sumatera Barat', island: 'Sumatera', distanceKm: 1230, isFree: false },
  { name: 'Pekanbaru Kota', province: 'Riau', island: 'Sumatera', distanceKm: 1200, isFree: false },
  { name: 'Dumai Kota', province: 'Riau', island: 'Sumatera', distanceKm: 1320, isFree: false },
  { name: 'Kampar (Bangkinang)', province: 'Riau', island: 'Sumatera', distanceKm: 1230, isFree: false },
  { name: 'Siak (Siak Sri Indrapura)', province: 'Riau', island: 'Sumatera', distanceKm: 1260, isFree: false },
  { name: 'Batam Kota', province: 'Kepulauan Riau', island: 'Sumatera', distanceKm: 1100, isFree: false },
  { name: 'Tanjung Pinang Kota', province: 'Kepulauan Riau', island: 'Sumatera', distanceKm: 1120, isFree: false },
  { name: 'Bintan (Bandar Seri Bentan)', province: 'Kepulauan Riau', island: 'Sumatera', distanceKm: 1130, isFree: false },
  { name: 'Karimun (Tanjung Balai Karimun)', province: 'Kepulauan Riau', island: 'Sumatera', distanceKm: 1150, isFree: false },
  { name: 'Jambi Kota', province: 'Jambi', island: 'Sumatera', distanceKm: 800, isFree: false },
  { name: 'Muaro Jambi (Sengeti)', province: 'Jambi', island: 'Sumatera', distanceKm: 820, isFree: false },
  { name: 'Bungo (Muara Bungo)', province: 'Jambi', island: 'Sumatera', distanceKm: 920, isFree: false },
  { name: 'Palembang Kota', province: 'Sumatera Selatan', island: 'Sumatera', distanceKm: 550, isFree: false },
  { name: 'Prabumulih Kota', province: 'Sumatera Selatan', island: 'Sumatera', distanceKm: 520, isFree: false },
  { name: 'Lubuklinggau Kota', province: 'Sumatera Selatan', island: 'Sumatera', distanceKm: 650, isFree: false },
  { name: 'Ogan Ilir (Indralaya)', province: 'Sumatera Selatan', island: 'Sumatera', distanceKm: 535, isFree: false },
  { name: 'Banyuasin (Pangkalan Balai)', province: 'Sumatera Selatan', island: 'Sumatera', distanceKm: 570, isFree: false },
  { name: 'Muara Enim', province: 'Sumatera Selatan', island: 'Sumatera', distanceKm: 540, isFree: false },
  { name: 'Pangkal Pinang Kota', province: 'Kep. Bangka Belitung', island: 'Sumatera', distanceKm: 580, isFree: false },
  { name: 'Bangka (Sungailiat)', province: 'Kep. Bangka Belitung', island: 'Sumatera', distanceKm: 600, isFree: false },
  { name: 'Belitung (Tanjung Pandan)', province: 'Kep. Bangka Belitung', island: 'Sumatera', distanceKm: 480, isFree: false },
  { name: 'Bengkulu Kota', province: 'Bengkulu', island: 'Sumatera', distanceKm: 750, isFree: false },
  { name: 'Rejang Lebong (Curup)', province: 'Bengkulu', island: 'Sumatera', distanceKm: 780, isFree: false },
  { name: 'Bandar Lampung Kota', province: 'Lampung', island: 'Sumatera', distanceKm: 230, isFree: false },
  { name: 'Metro Kota', province: 'Lampung', island: 'Sumatera', distanceKm: 250, isFree: false },
  { name: 'Lampung Selatan (Kalianda)', province: 'Lampung', island: 'Sumatera', distanceKm: 195, isFree: false },
  { name: 'Lampung Tengah (Gunung Sugih)', province: 'Lampung', island: 'Sumatera', distanceKm: 270, isFree: false },

  // --- KALIMANTAN ---
  { name: 'Pontianak Kota', province: 'Kalimantan Barat', island: 'Kalimantan', distanceKm: 950, isFree: false },
  { name: 'Kubu Raya (Sungai Raya)', province: 'Kalimantan Barat', island: 'Kalimantan', distanceKm: 960, isFree: false },
  { name: 'Singkawang Kota', province: 'Kalimantan Barat', island: 'Kalimantan', distanceKm: 1050, isFree: false },
  { name: 'Sambas', province: 'Kalimantan Barat', island: 'Kalimantan', distanceKm: 1120, isFree: false },
  { name: 'Ketapang', province: 'Kalimantan Barat', island: 'Kalimantan', distanceKm: 850, isFree: false },
  { name: 'Palangka Raya Kota', province: 'Kalimantan Tengah', island: 'Kalimantan', distanceKm: 1100, isFree: false },
  { name: 'Kotawaringin Barat (Pangkalan Bun)', province: 'Kalimantan Tengah', island: 'Kalimantan', distanceKm: 850, isFree: false },
  { name: 'Kotawaringin Timur (Sampit)', province: 'Kalimantan Tengah', island: 'Kalimantan', distanceKm: 980, isFree: false },
  { name: 'Banjarmasin Kota', province: 'Kalimantan Selatan', island: 'Kalimantan', distanceKm: 1150, isFree: false },
  { name: 'Banjarbaru Kota', province: 'Kalimantan Selatan', island: 'Kalimantan', distanceKm: 1170, isFree: false },
  { name: 'Banjar (Martapura)', province: 'Kalimantan Selatan', island: 'Kalimantan', distanceKm: 1175, isFree: false },
  { name: 'Balikpapan Kota', province: 'Kalimantan Timur', island: 'Kalimantan', distanceKm: 1450, isFree: false },
  { name: 'Samarinda Kota', province: 'Kalimantan Timur', island: 'Kalimantan', distanceKm: 1550, isFree: false },
  { name: 'IKN Nusantara (Sepaku)', province: 'Kalimantan Timur', island: 'Kalimantan', distanceKm: 1480, isFree: false },
  { name: 'Kutai Kartanegara (Tenggarong)', province: 'Kalimantan Timur', island: 'Kalimantan', distanceKm: 1520, isFree: false },
  { name: 'Bontang Kota', province: 'Kalimantan Timur', island: 'Kalimantan', distanceKm: 1620, isFree: false },
  { name: 'Berau (Tanjung Redeb)', province: 'Kalimantan Timur', island: 'Kalimantan', distanceKm: 1850, isFree: false },
  { name: 'Tarakan Kota', province: 'Kalimantan Utara', island: 'Kalimantan', distanceKm: 1800, isFree: false },
  { name: 'Bulungan (Tanjung Selor)', province: 'Kalimantan Utara', island: 'Kalimantan', distanceKm: 1750, isFree: false },
  { name: 'Nunukan', province: 'Kalimantan Utara', island: 'Kalimantan', distanceKm: 1950, isFree: false },

  // --- SULAWESI ---
  { name: 'Makassar Kota', province: 'Sulawesi Selatan', island: 'Sulawesi', distanceKm: 1600, isFree: false },
  { name: 'Gowa (Sungguminasa)', province: 'Sulawesi Selatan', island: 'Sulawesi', distanceKm: 1610, isFree: false },
  { name: 'Maros', province: 'Sulawesi Selatan', island: 'Sulawesi', distanceKm: 1625, isFree: false },
  { name: 'Parepare Kota', province: 'Sulawesi Selatan', island: 'Sulawesi', distanceKm: 1720, isFree: false },
  { name: 'Palopo Kota', province: 'Sulawesi Selatan', island: 'Sulawesi', distanceKm: 1850, isFree: false },
  { name: 'Bone (Watampone)', province: 'Sulawesi Selatan', island: 'Sulawesi', distanceKm: 1700, isFree: false },
  { name: 'Mamuju Kota', province: 'Sulawesi Barat', island: 'Sulawesi', distanceKm: 1750, isFree: false },
  { name: 'Majene', province: 'Sulawesi Barat', island: 'Sulawesi', distanceKm: 1700, isFree: false },
  { name: 'Polewali Mandar', province: 'Sulawesi Barat', island: 'Sulawesi', distanceKm: 1680, isFree: false },
  { name: 'Palu Kota', province: 'Sulawesi Tengah', island: 'Sulawesi', distanceKm: 1950, isFree: false },
  { name: 'Donggala (Banawa)', province: 'Sulawesi Tengah', island: 'Sulawesi', distanceKm: 1980, isFree: false },
  { name: 'Poso', province: 'Sulawesi Tengah', island: 'Sulawesi', distanceKm: 2050, isFree: false },
  { name: 'Banggai (Luwuk)', province: 'Sulawesi Tengah', island: 'Sulawesi', distanceKm: 2200, isFree: false },
  { name: 'Kendari Kota', province: 'Sulawesi Tenggara', island: 'Sulawesi', distanceKm: 1850, isFree: false },
  { name: 'Baubau Kota (Buton)', province: 'Sulawesi Tenggara', island: 'Sulawesi', distanceKm: 1800, isFree: false },
  { name: 'Kolaka', province: 'Sulawesi Tenggara', island: 'Sulawesi', distanceKm: 1780, isFree: false },
  { name: 'Gorontalo Kota', province: 'Gorontalo', island: 'Sulawesi', distanceKm: 2200, isFree: false },
  { name: 'Bone Bolango (Suwawa)', province: 'Gorontalo', island: 'Sulawesi', distanceKm: 2210, isFree: false },
  { name: 'Manado Kota', province: 'Sulawesi Utara', island: 'Sulawesi', distanceKm: 2450, isFree: false },
  { name: 'Bitung Kota', province: 'Sulawesi Utara', island: 'Sulawesi', distanceKm: 2480, isFree: false },
  { name: 'Tomohon Kota', province: 'Sulawesi Utara', island: 'Sulawesi', distanceKm: 2430, isFree: false },
  { name: 'Minahasa (Tondano)', province: 'Sulawesi Utara', island: 'Sulawesi', distanceKm: 2440, isFree: false },
  { name: 'Kotamobagu Kota', province: 'Sulawesi Utara', island: 'Sulawesi', distanceKm: 2350, isFree: false },

  // --- MALUKU & PAPUA ---
  { name: 'Ambon Kota', province: 'Maluku', island: 'Maluku & Papua', distanceKm: 2600, isFree: false },
  { name: 'Maluku Tengah (Masohi)', province: 'Maluku', island: 'Maluku & Papua', distanceKm: 2650, isFree: false },
  { name: 'Tual Kota', province: 'Maluku', island: 'Maluku & Papua', distanceKm: 2900, isFree: false },
  { name: 'Ternate Kota', province: 'Maluku Utara', island: 'Maluku & Papua', distanceKm: 2700, isFree: false },
  { name: 'Tidore Kepulauan Kota', province: 'Maluku Utara', island: 'Maluku & Papua', distanceKm: 2710, isFree: false },
  { name: 'Halmahera Barat (Jailolo)', province: 'Maluku Utara', island: 'Maluku & Papua', distanceKm: 2750, isFree: false },
  { name: 'Jayapura Kota', province: 'Papua', island: 'Maluku & Papua', distanceKm: 3750, isFree: false },
  { name: 'Kab. Jayapura (Sentani)', province: 'Papua', island: 'Maluku & Papua', distanceKm: 3740, isFree: false },
  { name: 'Keerom (Waris)', province: 'Papua', island: 'Maluku & Papua', distanceKm: 3780, isFree: false },
  { name: 'Biak Numfor', province: 'Papua', island: 'Maluku & Papua', distanceKm: 3500, isFree: false },
  { name: 'Sorong Kota', province: 'Papua Barat Daya', island: 'Maluku & Papua', distanceKm: 3000, isFree: false },
  { name: 'Kab. Sorong (Aimas)', province: 'Papua Barat Daya', island: 'Maluku & Papua', distanceKm: 3020, isFree: false },
  { name: 'Raja Ampat (Waisai)', province: 'Papua Barat Daya', island: 'Maluku & Papua', distanceKm: 3080, isFree: false },
  { name: 'Manokwari', province: 'Papua Barat', island: 'Maluku & Papua', distanceKm: 3300, isFree: false },
  { name: 'Fakfak', province: 'Papua Barat', island: 'Maluku & Papua', distanceKm: 3200, isFree: false },
  { name: 'Timika (Mimika)', province: 'Papua Tengah', island: 'Maluku & Papua', distanceKm: 3450, isFree: false },
  { name: 'Nabire', province: 'Papua Tengah', island: 'Maluku & Papua', distanceKm: 3400, isFree: false },
  { name: 'Wamena (Jayawijaya)', province: 'Papua Pegunungan', island: 'Maluku & Papua', distanceKm: 3650, isFree: false },
  { name: 'Merauke', province: 'Papua Selatan', island: 'Maluku & Papua', distanceKm: 3800, isFree: false },
];

/**
 * Helper to find city data or fallback to generic distance
 */
export function getCityShippingData(cityName: string): { distanceKm: number; isFree: boolean; province: string } {
  const clean = cityName.toLowerCase().trim();
  const matched = INDONESIA_CITIES.find(c => 
    c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase())
  );

  if (matched) {
    return {
      distanceKm: matched.distanceKm,
      isFree: matched.distanceKm <= 10,
      province: matched.province,
    };
  }

  // Fallback for custom entered city:
  // If explicitly Jakarta Utara / Jakarta Barat within 10 km
  if (
    clean.includes('jakarta utara') || 
    clean.includes('penjaringan') || 
    clean.includes('pluit') || 
    clean.includes('pademangan') || 
    clean.includes('pantai indah kapuk') ||
    clean.includes('pik') ||
    clean.includes('muara karang') ||
    clean.includes('tanjung priok') ||
    clean.includes('jakarta barat') && (clean.includes('cengkareng') || clean.includes('grogol') || clean.includes('tambora'))
  ) {
    return { distanceKm: 6, isFree: true, province: 'DKI Jakarta' };
  }

  // Any other location in Indonesia > 10km
  return { distanceKm: 35, isFree: false, province: 'Indonesia' };
}
