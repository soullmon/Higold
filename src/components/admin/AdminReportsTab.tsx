import React, { useState } from 'react';
import { 
  LifeBuoy, CheckCircle2, Clock, AlertTriangle, 
  Send, Phone, Mail, User, ShieldCheck, Headphones,
  Search, Filter, ChevronDown
} from 'lucide-react';
import { CustomerReportTicket, CMSAccessRole } from '../../types';

interface AdminReportsTabProps {
  reports: CustomerReportTicket[];
  onUpdateTicketStatus: (ticketId: string, status: CustomerReportTicket['status']) => void;
  onAddTicketResponse: (ticketId: string, message: string, sender: string, senderRole: CMSAccessRole) => void;
  currentRole: CMSAccessRole;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  reports,
  onUpdateTicketStatus,
  onAddTicketResponse,
  currentRole,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = reports.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.relatedProduct && t.relatedProduct.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleSendResponse = (ticketId: string) => {
    if (!responseMsg.trim()) return;
    const sender = currentRole === 'admin' ? 'Bambang Soedirjo (Super Admin)' : 'Rina Wardani (CS Senior)';
    onAddTicketResponse(ticketId, responseMsg.trim(), sender, currentRole);
    setResponseMsg('');
  };

  const getPriorityBadge = (priority: CustomerReportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'medium':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getStatusBadge = (status: CustomerReportTicket['status']) => {
    switch (status) {
      case 'open':
        return { label: 'Terbuka (Open)', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'in_progress':
        return { label: 'Sedang Diproses', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'resolved':
        return { label: 'Selesai (Resolved)', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'closed':
      default:
        return { label: 'Ditutup', bg: 'bg-slate-50 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-600" />
            <span>Pusat Laporan & Tiket CS (Customer Support Desk)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola klaim garansi, pertanyaan teknis kabinet, kendala instalasi, dan inquiry proyek B2B pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none"
          >
            <option value="all">Semua Status Tiket</option>
            <option value="open">Terbuka (Open)</option>
            <option value="in_progress">Sedang Diproses</option>
            <option value="resolved">Selesai (Resolved)</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Tidak ada tiket laporan yang sesuai.
          </div>
        ) : (
          filteredTickets.map((tkt) => {
            const statusInfo = getStatusBadge(tkt.status);
            const isExpanded = selectedTicketId === tkt.id;

            return (
              <div 
                key={tkt.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Header */}
                <div 
                  onClick={() => setSelectedTicketId(isExpanded ? null : tkt.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                        {tkt.ticketNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityBadge(tkt.priority)}`}>
                        Prioritas: {tkt.priority}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${statusInfo.bg}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {tkt.title}
                    </h3>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Oleh: <strong>{tkt.customerName}</strong> ({tkt.customerContact})</span>
                      <span>·</span>
                      <span>Dibuat: {tkt.createdAt}</span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="flex items-center gap-2 shrink-0"
                  >
                    <label className="text-[11px] font-semibold text-slate-500">Status:</label>
                    <select
                      value={tkt.status}
                      onChange={(e) => onUpdateTicketStatus(tkt.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded shadow-2xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="open">Terbuka (Open)</option>
                      <option value="in_progress">Sedang Diproses</option>
                      <option value="resolved">Selesai (Resolved)</option>
                      <option value="closed">Tutup Tiket</option>
                    </select>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-4">
                  <div className="pt-3">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Detail Laporan & Kendala:
                    </span>
                    <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                      {tkt.description}
                    </p>
                  </div>

                  {tkt.relatedProduct && (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Terkait Produk:</span> {tkt.relatedProduct}
                    </div>
                  )}

                  {/* Conversation History */}
                  {tkt.responses && tkt.responses.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Riwayat Respon Tim Support ({tkt.responses.length}):
                      </span>
                      {tkt.responses.map((resp) => (
                        <div key={resp.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              {resp.senderRole === 'admin' ? (
                                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                              ) : (
                                <Headphones className="w-3.5 h-3.5 text-amber-600" />
                              )}
                              {resp.sender}
                            </span>
                            <span className="text-slate-400">{resp.timestamp}</span>
                          </div>
                          <p className="text-slate-700">{resp.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Box */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kirim Tanggapan / Solusi ke Pelanggan:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedTicketId === tkt.id ? responseMsg : ''}
                        onChange={(e) => {
                          setSelectedTicketId(tkt.id);
                          setResponseMsg(e.target.value);
                        }}
                        placeholder="Ketik catatan tindak lanjut penanganan atau solusi untuk pelanggan..."
                        className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendResponse(tkt.id)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim Respon</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
