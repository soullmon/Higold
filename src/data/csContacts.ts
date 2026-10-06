import { CSContact } from '../types';

export const OFFICIAL_CS_STAFF: CSContact[] = [
  {
    id: 'cs-putri',
    name: 'Putri',
    role: 'Senior Kitchen Hardware Consultant',
    phone: '+62 812-8899-2311',
    whatsappNumber: '6281288992311',
    avatarColor: 'from-amber-600 to-amber-800',
    status: 'Online · Respon Cepat (< 5 Menit)',
    specialty: 'Konsultasi Dimensi Kabinet, Corner Units & Tall Pantry',
  },
  {
    id: 'cs-denisya',
    name: 'Denisya',
    role: 'Product Specialist & Project B2B',
    phone: '+62 813-7722-4412',
    whatsappNumber: '6281377224412',
    avatarColor: 'from-zinc-600 to-zinc-800',
    status: 'Online · Respon Cepat (< 10 Menit)',
    specialty: 'Penawaran Khusus Desainer Interior, Kontraktor & Showroom',
  },
  {
    id: 'cs-yenny',
    name: 'Yenny',
    role: 'Customer Care & Logistics Lead',
    phone: '+62 811-9988-5543',
    whatsappNumber: '6281199885543',
    avatarColor: 'from-amber-700 to-stone-900',
    status: 'Online · Respon Cepat',
    specialty: 'Pengiriman Kargo Luar Kota, Ekspedisi & Garansi Resmi',
  },
  {
    id: 'cs-tasya',
    name: 'Tasya',
    role: 'Kitchen Set Technical Advisor',
    phone: '+62 815-1133-7764',
    whatsappNumber: '6281511337764',
    avatarColor: 'from-stone-600 to-zinc-900',
    status: 'Online · Respon Cepat',
    specialty: 'Panduan Instalasi Hidrolik Soft-Close & Sink Fitting',
  },
];

export const INQUIRY_TEMPLATES = [
  {
    id: 'cabinet-check',
    title: 'Konsultasi Dimensi Kabinet',
    text: 'Halo [NAMA_CS], saya ingin konsultasi apakah ukuran kabinet kitchen set saya kompatibel dengan produk Higold. Mohon bantuannya.'
  },
  {
    id: 'b2b-quote',
    title: 'Penawaran Proyek Interior / B2B',
    text: 'Halo [NAMA_CS], saya dari pihak kontraktor/desainer interior ingin meminta penawaran harga khusus proyek kitchen hardware Higold.'
  },
  {
    id: 'showroom-visit',
    title: 'Jadwal Demo di Showroom Pluit',
    text: 'Halo [NAMA_CS], saya ingin menjadwalkan kunjungan ke Showroom Higold di Komp. Pergudangan Bisnis Pluit Jakarta Utara.'
  },
  {
    id: 'order-track',
    title: 'Cek Stok & Status Pesanan',
    text: 'Halo [NAMA_CS], saya ingin memastikan ketersediaan stok produk dan opsi pengiriman kargo ke lokasi saya.'
  }
];

export function buildWhatsAppLink(number: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}
