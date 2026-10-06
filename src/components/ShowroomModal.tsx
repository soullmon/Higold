import React, { useState } from 'react';
import { OFFICIAL_COMPANY_INFO } from '../data/products';
import { MapPin, Clock, Phone, CheckCircle, ExternalLink, X, Building2 } from 'lucide-react';

interface ShowroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess?: () => void;
}

export const ShowroomModal: React.FC<ShowroomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Rumah Pribadi');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 - 12:00 WIB');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white shadow-2xl overflow-hidden my-4 sm:my-8 rounded-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Sharp Square */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FAF6ED] text-[#C8A15A] rounded-none border border-[#C8A15A]/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Higold Showroom & Experience Center Pluit
              </h2>
              <p className="text-xs text-slate-500">
                Uji langsung mekanisme peredam hidrolik soft-close, ketebalan SUS 304, dan kapasitas beban
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 text-slate-400 hover:text-slate-900 cursor-pointer rounded-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto bg-white">
          {/* Left: Location & Showroom Information (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 space-y-3 text-xs rounded-none">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#9A7B38]" />
                <span>Alamat Showroom Resmi</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {OFFICIAL_COMPANY_INFO.showroom.address},<br />
                {OFFICIAL_COMPANY_INFO.showroom.district}
              </p>
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-start gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-[#9A7B38] shrink-0 mt-0.5" />
                  <span>{OFFICIAL_COMPANY_INFO.showroom.operatingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-[#9A7B38] shrink-0" />
                  <span>{OFFICIAL_COMPANY_INFO.showroom.phone}</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Komp+Pergudangan+Bisnis+Pluit+Jl+Pluit+Raya+120"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center py-2.5 px-3 bg-white hover:bg-slate-100 text-[#8A6B29] text-xs font-semibold uppercase tracking-wider border border-slate-200 transition-colors shadow-xs rounded-none"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Petunjuk Arah Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>

            {/* What you can see in showroom */}
            <div className="p-4 bg-slate-50 text-xs text-slate-600 space-y-2 rounded-none">
              <div className="text-slate-900 font-semibold uppercase tracking-wider text-[11px]">Tersedia Unit Demo Lengkap:</div>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                <li>Diamond & Shearer Magic Corner Unit</li>
                <li>Show Hand & Swing Tray 100% Extensible</li>
                <li>6-Tier Diamond Tall Pantry Unit</li>
                <li>Pandora Multipurpose & Sink Nano Black</li>
              </ul>
            </div>
          </div>

          {/* Right: Booking Form (7 cols) */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="p-8 bg-[#FAF6ED] border border-[#C8A15A]/30 text-center space-y-3 rounded-none">
                <CheckCircle className="w-10 h-10 text-[#C8A15A] mx-auto" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Jadwal Kunjungan Berhasil Diajukan!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih, <strong>{name}</strong>. Tim Customer Service kami akan menghubungi Anda via WhatsApp di <strong>{phone}</strong> untuk konfirmasi kedatangan pada tanggal <strong>{date}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 bg-white text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-100 rounded-none shadow-xs"
                >
                  Ubah Jadwal Kunjungan
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                  Formulir Reservasi Demo Showroom
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Nama Lengkap:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Bpk. Hendra / Ibu Ratna"
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 focus:border-slate-400 focus:outline-none rounded-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Nomor WhatsApp:
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 focus:border-slate-400 focus:outline-none font-sans rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Tipe Proyek:
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 focus:border-slate-400 focus:outline-none rounded-none"
                    >
                      <option value="Rumah Pribadi">Renovasi / Rumah Pribadi</option>
                      <option value="Desainer Interior">Desainer Interior / Studio</option>
                      <option value="Kontraktor Kitchen Set">Kontraktor Kitchen Set / B2B</option>
                      <option value="Developer">Developer Residensial / Apartemen</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Rencana Tanggal Kunjungan:
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 focus:border-slate-400 focus:outline-none rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Pilihan Sesi Jam:
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 focus:border-slate-400 focus:outline-none rounded-none"
                    >
                      <option value="10:00 - 12:00 WIB">Pagi (10:00 - 12:00 WIB)</option>
                      <option value="13:00 - 15:00 WIB">Siang (13:00 - 15:00 WIB)</option>
                      <option value="15:00 - 17:00 WIB">Sore (15:00 - 17:00 WIB)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Catatan Tambahan (Opsional):
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sebutkan tipe produk yang ingin dicoba khusus..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2.5 focus:border-slate-400 focus:outline-none rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer rounded-none shadow-md mt-2"
                >
                  Konfirmasi Reservasi Kunjungan
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
