import React, { useState } from 'react';
import { OFFICIAL_COMPANY_INFO } from '../../data/products';
import { OFFICIAL_CS_STAFF, buildWhatsAppLink } from '../../data/csContacts';
import { CSContact } from '../../types';
import { 
  MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, 
  Check, Send, AlertTriangle, ShieldCheck, FileText, Upload, 
  Search, CheckCircle2, Headphones, Building2, User
} from 'lucide-react';

interface ContactPageProps {
  onOpenShowroom: () => void;
}

interface ComplaintTicket {
  id: string;
  category: string;
  customerName: string;
  phone: string;
  orderNumber: string;
  urgency: string;
  description: string;
  fileName?: string;
  createdAt: string;
  status: 'Diterima' | 'Investigasi Teknisi' | 'Kirim Sparepart' | 'Selesai';
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenShowroom }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'helpdesk' | 'track'>('info');
  const [selectedStaff, setSelectedStaff] = useState<CSContact>(OFFICIAL_CS_STAFF[0]);
  
  // General Inquiry Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProjectType, setFormProjectType] = useState('Rumah Tinggal Pribadi');
  const [formMessage, setFormMessage] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  // Helpdesk Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState('Klaim Garansi Mekanisme Soft-Close / Rel Hidrolik');
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cOrderNo, setCOrderNo] = useState('');
  const [cUrgency, setCUrgency] = useState('Mendesak (Proyek Sedang Pemasangan)');
  const [cDescription, setCDescription] = useState('');
  const [cFileName, setCFileName] = useState('');
  const [createdTicket, setCreatedTicket] = useState<ComplaintTicket | null>(null);

  // Ticket Tracking State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<ComplaintTicket | null>(null);
  const [trackError, setTrackError] = useState(false);

  // Pre-seeded tickets for demo tracking
  const [ticketsList, setTicketsList] = useState<ComplaintTicket[]>([
    {
      id: 'TKT-HG-2026-9481',
      category: 'Klaim Garansi Mekanisme Soft-Close / Rel Hidrolik',
      customerName: 'Bpk. Hendra Gunawan',
      phone: '0812-8877-6655',
      orderNumber: 'INV-HG-88219',
      urgency: 'Mendesak',
      description: 'Peredam damper swing tray sebelah kiri gerakannya terlalu lambat saat ditutup.',
      createdAt: '28 September 2026',
      status: 'Kirim Sparepart'
    }
  ]);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const fullMsg = `*INQUIRY KONSULTASI PRODUK HIGOLD*\nNama: ${formName}\nNomor Telepon: ${formPhone}\nTipe Proyek: ${formProjectType}\nPesan: ${formMessage || 'Saya ingin konsultasi hardware kitchen set.'}`;
    const link = buildWhatsAppLink(selectedStaff.whatsappNumber, fullMsg);
    
    setSubmittedInquiry(true);
    setTimeout(() => {
      window.location.href = link;
    }, 800);
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cPhone || !cDescription) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `TKT-HG-2026-${randomNum}`;
    const newTicket: ComplaintTicket = {
      id: newId,
      category: complaintCategory,
      customerName: cName,
      phone: cPhone,
      orderNumber: cOrderNo || 'Non-Order / Pertanyaan Teknis',
      urgency: cUrgency,
      description: cDescription,
      fileName: cFileName || undefined,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Diterima'
    };

    // Sync with CMS reports database
    try {
      const cmsTicket = {
        id: newId,
        ticketNumber: newId,
        customerName: cName,
        customerContact: cPhone,
        type: complaintCategory.includes('Garansi') ? 'warranty_claim' : 'complaint',
        title: `${complaintCategory} [${cOrderNo || 'Umum'}]`,
        description: cDescription,
        priority: cUrgency.includes('Mendesak') ? 'urgent' : 'medium',
        status: 'open',
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        updatedAt: 'Baru Masuk',
        notes: `Diajukan via Helpdesk Pengaduan Web. Urgensi: ${cUrgency}`,
      };
      const stored = localStorage.getItem('higold_cms_reports');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('higold_cms_reports', JSON.stringify([cmsTicket, ...list]));
    } catch (e) {
      console.error('Failed to sync ticket to CMS', e);
    }

    setTicketsList(prev => [newTicket, ...prev]);
    setCreatedTicket(newTicket);
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(false);
    const q = trackQuery.trim().toUpperCase();

    // Check CMS reports first for real-time status update
    try {
      const stored = localStorage.getItem('higold_cms_reports');
      if (stored) {
        const cmsList = JSON.parse(stored);
        const match = cmsList.find((r: any) => 
          (r.ticketNumber && r.ticketNumber.toUpperCase() === q) || 
          (r.id && r.id.toUpperCase() === q)
        );
        if (match) {
          let mappedStatus: ComplaintTicket['status'] = 'Diterima';
          if (match.status === 'in_progress') mappedStatus = 'Investigasi Teknisi';
          else if (match.status === 'resolved' || match.status === 'closed') mappedStatus = 'Selesai';
          else if (match.notes && match.notes.toLowerCase().includes('sparepart')) mappedStatus = 'Kirim Sparepart';

          setTrackedTicket({
            id: match.ticketNumber || match.id,
            category: match.title || 'Laporan Pelanggan',
            customerName: match.customerName,
            phone: match.customerContact,
            orderNumber: match.relatedProduct || 'Terdaftar di CMS',
            urgency: match.priority === 'urgent' ? 'Mendesak' : 'Standar',
            description: match.description,
            createdAt: match.createdAt,
            status: mappedStatus,
          });
          return;
        }
      }
    } catch {}

    const found = ticketsList.find(t => t.id.toUpperCase() === q || t.orderNumber.toUpperCase() === q);
    if (found) {
      setTrackedTicket(found);
    } else {
      setTrackedTicket(null);
      setTrackError(true);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[300px] sm:min-h-[360px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1920&q=80"
            alt="Higold Customer Service and Showroom"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Layanan Pelanggan Terpadu & Helpdesk Resmi
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Contact Us & Helpdesk Pengaduan
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Hubungi staf konsultan teknis, jadwalkan kunjungan ke Experience Center Pluit, atau ajukan pengaduan serta klaim garansi hardware dengan respon cepat.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-sans pb-px">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-5 py-3 uppercase font-semibold tracking-wider cursor-pointer border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'info'
                ? 'border-[#C8A15A] text-[#C8A15A]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Informasi Kontak & Showroom</span>
          </button>

          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`px-5 py-3 uppercase font-semibold tracking-wider cursor-pointer border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'helpdesk'
                ? 'border-[#C8A15A] text-[#C8A15A]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Headphones className="w-4 h-4 text-[#C8A15A]" />
            <span>Helpdesk Pengaduan & Garansi</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-3 uppercase font-semibold tracking-wider cursor-pointer border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'track'
                ? 'border-[#C8A15A] text-[#C8A15A]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Lacak Status Tiket</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: INFORMASI KONTAK LENGKAP & SHOWROOM ================= */}
      {activeTab === 'info' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          {/* Quick CS Contacts Bar */}
          <div>
            <div className="pb-4 border-b border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C8A15A]">Konsultan WhatsApp Resmi</div>
              <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
                4 Konsultan Teknis Higold Siap Membantu
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Pilih staf untuk konsultasi spesifikasi ukuran atau negosiasi proyek secara langsung.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {OFFICIAL_CS_STAFF.map((staff) => {
                const waLink = buildWhatsAppLink(
                  staff.whatsappNumber,
                  `Halo Kak ${staff.name}, saya ingin konsultasi produk hardware dapur Higold Indonesia.`
                );
                return (
                  <div
                    key={staff.id}
                    className="bg-white p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 bg-[#FAF6ED] text-[#C8A15A] border border-[#C8A15A]/30 flex items-center justify-center font-bold text-base mb-3 rounded-md">
                        {staff.name.charAt(0)}
                      </div>
                      <h3 className="text-base font-display font-bold text-slate-900">
                        {staff.name}
                      </h3>
                      <div className="text-xs text-neutral-600 font-medium">{staff.role}</div>
                      <div className="text-xs font-mono text-slate-500 mt-1">{staff.phone}</div>
                    </div>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors no-underline cursor-pointer shadow-2xs rounded-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat WhatsApp</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Showroom & General Inquiry Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Showroom Details Box */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold">
                  EXPERIENCE CENTER INDONESIA
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-1">
                  Showroom Pluit Jakarta
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Kunjungi showroom resmi kami untuk mencoba langsung tarikan rel hidrolik soft-close dan memeriksa detail material SUS 304.
                </p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Alamat Showroom:</strong>
                    <span className="text-slate-300 leading-relaxed">
                      {OFFICIAL_COMPANY_INFO.showroom.address}, {OFFICIAL_COMPANY_INFO.showroom.district}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Jam Operasional:</strong>
                    <span className="text-slate-300">
                      {OFFICIAL_COMPANY_INFO.showroom.operatingHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Telepon Kantor Pusat:</strong>
                    <span className="text-slate-300 font-mono">
                      (021) 668-9898 / (021) 669-1234
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Email Resmi:</strong>
                    <span className="text-slate-300 font-mono">
                      info@higold-indonesia.com
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenShowroom}
                  className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Buka Peta & Petunjuk Arah</span>
                </button>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Konsultasi Cepat</span>
                <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
                  Kirim Pesan atau Pertanyaan Penawaran
                </h3>
              </div>

              {submittedInquiry ? (
                <div className="p-6 bg-[#FAF6ED] border border-[#C8A15A]/30 text-center space-y-2">
                  <Check className="w-8 h-8 text-[#C8A15A] mx-auto" />
                  <div className="font-bold text-slate-900 text-sm">Mengalihkan ke WhatsApp Resmi...</div>
                  <p className="text-xs text-slate-600">
                    Terima kasih, Anda akan langsung terhubung dengan Kak {selectedStaff.name}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-4 text-xs font-sans">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap: *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Contoh: Bpk. Gunawan"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp: *</label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="0812xxxxxxx"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-[#C8A15A] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tipe Proyek:</label>
                      <select
                        value={formProjectType}
                        onChange={(e) => setFormProjectType(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-[#C8A15A]"
                      >
                        <option>Rumah Tinggal Pribadi</option>
                        <option>Desainer Interior / Konsultan</option>
                        <option>Kontraktor / Workshop Kitchen Set</option>
                        <option>Apartemen / Villa Komersial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pesan / Produk yang Diminati:</label>
                    <textarea
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Contoh: Saya membutuhkan penawaran Swing Tray 900mm untuk 2 unit kabinet sudut."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#09090b] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs btn-press"
                  >
                    <Send className="w-4 h-4 text-[#C8A15A]" />
                    <span>Kirim Pertanyaan via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 2: HELPDESK PENGADUAN & KLAIM GARANSI ================= */}
      {activeTab === 'helpdesk' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="bg-[#FAF6ED] border border-[#C8A15A]/30 p-6 flex items-start gap-4">
            <div className="p-2.5 bg-[#C8A15A] text-white shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">
                Helpdesk Pengaduan & Layanan Purna Jual Resmi
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Kami berkomitmen menindaklanjuti segala keluhan mengenai kerusakan pengiriman, klaim garansi mekanisme soft-close, ataupun suku cadang yang kurang dalam maksimal 1×24 jam kerja.
              </p>
            </div>
          </div>

          {createdTicket ? (
            /* Ticket Confirmation Screen */
            <div className="bg-white border-2 border-[#C8A15A] p-8 shadow-md space-y-6">
              <div className="flex items-center gap-3 text-[#C8A15A]">
                <CheckCircle2 className="w-8 h-8 text-[#C8A15A]" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#C8A15A] font-bold">PENGADUAN BERHASIL TERCATAT</div>
                  <h3 className="text-xl font-display font-bold text-slate-900">
                    Nomor Tiket Anda: <span className="font-mono text-[#C8A15A]">{createdTicket.id}</span>
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 space-y-2 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pelapor:</span>
                  <span className="font-bold text-slate-800">{createdTicket.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori Keluhan:</span>
                  <span className="font-semibold text-slate-800">{createdTicket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Awal:</span>
                  <span className="px-2 py-0.5 bg-[#FAF6ED] text-[#8A6B29] border border-[#C8A15A]/30 font-bold uppercase text-[10px]">
                    {createdTicket.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Pelaporan:</span>
                  <span className="font-mono text-slate-700">{createdTicket.createdAt}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                Tim teknis purna jual Higold akan menghubungi nomor WhatsApp <strong>{createdTicket.phone}</strong> segera. Anda juga dapat mempercepat penanganan dengan mengirim pesan langsung:
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={buildWhatsAppLink(
                    '6281299887766',
                    `Halo Tim Helpdesk Higold Indonesia, saya ingin follow up pengaduan saya dengan Nomor Tiket: *${createdTicket.id}* (${createdTicket.category}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer no-underline shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Eskalasi Cepat ke Tim Teknis WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setCreatedTicket(null);
                    setCDescription('');
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Ajukan Pengaduan Lain
                </button>
              </div>
            </div>
          ) : (
            /* Complaint Submission Form */
            <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Formulir Pengaduan Pelanggan Resmi</span>
                </span>
                <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
                  Sampaikan Kendala atau Klaim Garansi Anda
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Isi detail kendala teknis atau pengiriman di bawah ini untuk mendapatkan nomor tiket resmi.
                </p>
              </div>

              <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Pengaduan / Keluhan: *
                  </label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option>Klaim Garansi Mekanisme Soft-Close / Rel Hidrolik</option>
                    <option>Barang Rusak / Cacat Fisik Saat Pengiriman</option>
                    <option>Komponen / Aksesori / Sekrup Kurang atau Hilang</option>
                    <option>Kesulitan Pemasangan / Panduan Fitment Toleransi Kabinet</option>
                    <option>Lapisan Titanium Cacat / Keluhan Kualitas</option>
                    <option>Permintaan Kunjungan Teknisi ke Lokasi (Jabodetabek)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Pelapor / Pemilik: *</label>
                    <input
                      type="text"
                      required
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif: *</label>
                    <input
                      type="tel"
                      required
                      value={cPhone}
                      onChange={(e) => setCPhone(e.target.value)}
                      placeholder="0812xxxxxxx"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor Order / Invoice atau SKU:</label>
                    <input
                      type="text"
                      value={cOrderNo}
                      onChange={(e) => setCOrderNo(e.target.value)}
                      placeholder="Contoh: INV-HG-12903 atau HG-SWING-900"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tingkat Urgensi:</label>
                    <select
                      value={cUrgency}
                      onChange={(e) => setCUrgency(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-sky-500"
                    >
                      <option>Standar (Pertanyaan Teknis / Maintenance)</option>
                      <option>Menengah (Klaim Garansi Reguler)</option>
                      <option>Mendesak (Proyek Sedang Pemasangan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Deskripsi Lengkap Kendala / Pengaduan: *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={cDescription}
                    onChange={(e) => setCDescription(e.target.value)}
                    placeholder="Jelaskan secara terperinci apa yang terjadi, bagian mana yang mengalami kendala, dan kronologi singkat..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lampiran Foto / Video Bukti Kendala (Opsional):
                  </label>
                  <div className="border border-dashed border-slate-300 p-4 bg-slate-50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Upload className="w-5 h-5 text-[#8A6B29]" />
                      <span>{cFileName ? cFileName : 'Pilih file foto/video bukti kerusakan (JPG, PNG, MP4)'}</span>
                    </div>
                    <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 cursor-pointer font-semibold uppercase text-[10px]">
                      Pilih File
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCFileName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs btn-press"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pengaduan & Dapatkan Nomor Tiket</span>
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 3: LACAK STATUS TIKET PENGADUAN ================= */}
      {activeTab === 'track' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">Layanan Transparan</span>
              <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
                Lacak Status Penanganan Pengaduan Anda
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan Nomor Tiket (contoh: <code>TKT-HG-2026-9481</code>) atau Nomor Invoice untuk melihat perkembangan penanganan teknisi.
              </p>
            </div>

            <form onSubmit={handleTrackTicket} className="flex gap-2">
              <input
                type="text"
                required
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Masukkan Nomor Tiket (TKT-HG-...)"
                className="flex-1 p-3 bg-slate-50 border border-slate-300 font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Cari Tiket</span>
              </button>
            </form>

            {trackError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                Nomor tiket atau invoice tidak ditemukan dalam database pengaduan. Pastikan format sudah sesuai atau hubungi konsultan kami.
              </div>
            )}
          </div>

          {/* Ticket Tracking Progress Result */}
          {trackedTicket && (
            <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    STATUS TIKET PENGADUAN
                  </span>
                  <h4 className="text-lg font-bold font-mono text-sky-700">
                    {trackedTicket.id}
                  </h4>
                </div>
                <div className="px-3 py-1 bg-[#FAF6ED] text-[#8A6B29] border border-[#C8A15A]/30 font-bold text-xs uppercase tracking-wider inline-block">
                  Status: {trackedTicket.status}
                </div>
              </div>

              {/* Step indicator timeline */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans pt-2">
                <div className="space-y-1">
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#C8A15A] text-neutral-950 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px] block">1. Diterima</span>
                  <span className="text-[10px] text-slate-400 block">{trackedTicket.createdAt}</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                    trackedTicket.status !== 'Diterima' ? 'bg-[#C8A15A] text-neutral-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {trackedTicket.status !== 'Diterima' ? '✓' : '2'}
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px] block">2. Investigasi</span>
                  <span className="text-[10px] text-slate-400 block">Tim Teknis</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                    trackedTicket.status === 'Kirim Sparepart' || trackedTicket.status === 'Selesai' ? 'bg-[#C8A15A] text-neutral-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {trackedTicket.status === 'Kirim Sparepart' || trackedTicket.status === 'Selesai' ? '✓' : '3'}
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px] block">3. Tindak Lanjut</span>
                  <span className="text-[10px] text-slate-400 block">Sparepart/Kunjungan</span>
                </div>

                <div className="space-y-1">
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs ${
                    trackedTicket.status === 'Selesai' ? 'bg-[#C8A15A] text-neutral-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {trackedTicket.status === 'Selesai' ? '✓' : '4'}
                  </div>
                  <span className="font-semibold text-slate-800 text-[11px] block">4. Selesai</span>
                  <span className="text-[10px] text-slate-400 block">Solusi Tuntas</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 text-xs space-y-1.5 font-sans">
                <div><strong>Pelapor:</strong> {trackedTicket.customerName} ({trackedTicket.phone})</div>
                <div><strong>Kategori:</strong> {trackedTicket.category}</div>
                <div><strong>Deskripsi:</strong> {trackedTicket.description}</div>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={buildWhatsAppLink(
                    '6281299887766',
                    `Halo, saya ingin menanyakan perkembangan tiket *${trackedTicket.id}* atas nama ${trackedTicket.customerName}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer no-underline rounded-md shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Hubungi Teknisi Penanggung Jawab</span>
                </a>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
