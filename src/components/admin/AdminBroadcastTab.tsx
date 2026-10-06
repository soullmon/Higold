import React, { useState } from 'react';
import { 
  Broadcast, PaperPlaneRight, Users, CheckCircle, 
  ChatCircleText, Clock, EnvelopeSimple, Sparkle
} from '@phosphor-icons/react';
import { CMSAccessRole, CMSUser } from '../../types';

interface AdminBroadcastTabProps {
  users: CMSUser[];
  currentRole: CMSAccessRole;
}

export const AdminBroadcastTab: React.FC<AdminBroadcastTabProps> = ({
  users,
  currentRole,
}) => {
  const [broadcastTarget, setBroadcastTarget] = useState<string>('all');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [history, setHistory] = useState([
    {
      id: 'bc-1',
      title: 'Peluncuran Koleksi Titanium Diamond Series 2024',
      target: 'Semua Kontraktor & Retailer',
      channel: 'WhatsApp Broadcast',
      date: '01 Okt 2024, 10:00 WIB',
      recipients: 14,
      status: 'Terkirim',
    },
    {
      id: 'bc-2',
      title: 'Promo Diskon Ongkir Cargo Luar Jawa',
      target: 'Semua Pelanggan Pembeli',
      channel: 'WhatsApp & Email',
      date: '28 Sep 2024, 15:30 WIB',
      recipients: 32,
      status: 'Terkirim',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isRoleAdmin = currentRole === 'admin';

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageTitle.trim() || !messageBody.trim()) {
      alert('Judul dan pesan wajib diisi.');
      return;
    }

    const newHistory = {
      id: `bc-${Date.now().toString(36)}`,
      title: messageTitle.trim(),
      target: broadcastTarget === 'all' ? 'Seluruh Pengguna & Pelanggan' : `Mitra: ${broadcastTarget}`,
      channel: channel === 'whatsapp' ? 'WhatsApp Broadcast' : 'Email Blast',
      date: 'Baru saja',
      recipients: users.length,
      status: 'Terkirim',
    };

    setHistory([newHistory, ...history]);
    setMessageTitle('');
    setMessageBody('');
    showToast(`Pesan broadcast "${newHistory.title}" berhasil diproses & dikirimkan!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 text-white text-xs font-semibold rounded-lg shadow-xl flex items-center gap-2 ${
          isRoleAdmin ? 'bg-neutral-900 border border-[#C8A15A]' : 'bg-sky-500'
        }`}>
          <CheckCircle className={`w-4 h-4 ${isRoleAdmin ? 'text-[#C8A15A]' : 'text-white'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isRoleAdmin 
          ? 'bg-neutral-900 border-[#C8A15A]/40 text-neutral-100 shadow-sm' 
          : 'bg-sky-50 border-sky-200 text-sky-950 shadow-xs'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
            isRoleAdmin ? 'bg-[#C8A15A] text-neutral-950 font-bold' : 'bg-sky-500 text-white'
          }`}>
            <Broadcast className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold ${isRoleAdmin ? 'text-white' : 'text-neutral-900'}`}>
                Pusat Broadcast & Pengumuman Pelanggan
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isRoleAdmin 
                  ? 'bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40' 
                  : 'bg-sky-100 text-sky-800'
              }`}>
                {isRoleAdmin ? 'Admin Emas' : 'CS Biru Langit'}
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${
              isRoleAdmin ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Kirimkan pengumuman diskon proyek, informasi produk hardware terbaru, dan pemberitahuan layanan langsung ke kontak WhatsApp dan email pelanggan atau mitra rekanan B2B.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
            isRoleAdmin ? 'bg-neutral-950 text-[#C8A15A] border-neutral-800' : 'bg-white text-sky-700 border-sky-200'
          }`}>
            {users.length} Kontak Siap Broadcast
          </span>
        </div>
      </div>

      {/* Broadcast Compose Form */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
          <PaperPlaneRight className="w-4 h-4 text-[#C8A15A]" />
          <span>Kirim Pesan Broadcast Baru</span>
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-2xl text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Target Audiens *</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
              >
                <option value="all">Semua Pengguna Terdaftar</option>
                <option value="Kontraktor">Hanya Mitra Kontraktor</option>
                <option value="Retailer">Hanya Mitra Retailer</option>
                <option value="Konsultan">Hanya Konsultan Arsitek</option>
                <option value="Pelanggan">Hanya Pelanggan Pembeli</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Saluran Distribusi *</label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`flex-1 py-1.5 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                    channel === 'whatsapp' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' 
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <ChatCircleText className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`flex-1 py-1.5 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                    channel === 'email' 
                      ? 'bg-sky-50 border-sky-500 text-sky-700 font-bold' 
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  <EnvelopeSimple className="w-4 h-4" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">Judul / Headline Pesan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Diskon Khusus Arsitek & Kontraktor: Ekstra 10% Diamond Corner Series"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">Isi Pesan Broadcast *</label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan isi pesan broadcast Anda di sini..."
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900 leading-relaxed font-sans"
            />
          </div>

          <button
            type="submit"
            className={`px-5 py-2 font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center gap-2 ${
              isRoleAdmin ? 'bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800' : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
          >
            <PaperPlaneRight className="w-4 h-4" />
            <span>Kirim Broadcast Sekarang</span>
          </button>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-neutral-50 border-b border-neutral-200 font-bold text-xs text-neutral-900 uppercase tracking-wider">
          Riwayat Pengiriman Pesan Broadcast
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-100/60 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Judul Broadcast</th>
              <th className="px-4 py-3">Target Audiens</th>
              <th className="px-4 py-3">Saluran</th>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Penerima</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-semibold text-neutral-900">{h.title}</td>
                <td className="px-4 py-3 text-neutral-600">{h.target}</td>
                <td className="px-4 py-3 text-neutral-600 font-medium">{h.channel}</td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-[11px]">{h.date}</td>
                <td className="px-4 py-3 text-neutral-600 font-mono">{h.recipients} Kontak</td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
