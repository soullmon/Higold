import React, { useState } from 'react';
import { 
  MessageSquare, Star, Reply, CheckCircle2, 
  Eye, EyeOff, ShieldCheck, Headphones, Send
} from 'lucide-react';
import { ProductReview, CMSAccessRole } from '../../types';

interface AdminReviewsTabProps {
  reviews: ProductReview[];
  onReplyReview: (reviewId: string, replyText: string, authorName: string, role: CMSAccessRole) => void;
  onToggleStatus: (reviewId: string) => void;
  currentRole: CMSAccessRole;
  currentEmail: string;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  onReplyReview,
  onToggleStatus,
  currentRole,
  currentEmail,
}) => {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const handleSendReply = (reviewId: string) => {
    if (!replyInput.trim()) return;

    const authorName = currentRole === 'admin' ? 'Bambang Soedirjo (Super Admin)' : 'Rina Wardani (CS Senior)';
    onReplyReview(reviewId, replyInput.trim(), authorName, currentRole);
    setSelectedReviewId(null);
    setReplyInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <span>Moderasi & Balas Ulasan Produk</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dapat diakses penuh oleh <strong>Administrator</strong> dan <strong>Tim CS / Support</strong> untuk membalas tanggapan kepuasan pelanggan secara profesional.
          </p>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Bintang:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none"
          >
            <option value="all">Semua Bintang</option>
            <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
            <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
            <option value={3}>⭐⭐⭐ (3 Bintang)</option>
            <option value={2}>⭐⭐ (2 Bintang)</option>
            <option value={1}>⭐ (1 Bintang)</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Belum ada ulasan untuk filter yang dipilih.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>{rev.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({rev.customerEmail})</span>
                    </div>
                    <div className="text-[11px] text-sky-700 font-medium">
                      Produk: {rev.productName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                "{rev.comment}"
              </p>

              {/* Official Reply if exists */}
              {rev.reply && (
                <div className="ml-4 pl-3 border-l-2 border-sky-500 py-1 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-900">
                    <span className="flex items-center gap-1 text-sky-700">
                      {rev.reply.role === 'admin' ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      ) : (
                        <Headphones className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {rev.reply.author}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">· {rev.reply.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "{rev.reply.text}"
                  </p>
                </div>
              )}

              {/* Action Buttons: Reply & Moderate */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedReviewId(selectedReviewId === rev.id ? null : rev.id)}
                  className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>{rev.reply ? 'Edit Balasan Resmi' : 'Tulis Balasan CS / Admin'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleStatus(rev.id)}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer text-[11px]"
                >
                  {rev.status === 'published' ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Status: Ditampilkan (Publik)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Status: Disembunyikan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Reply Form */}
              {selectedReviewId === rev.id && (
                <div className="mt-3 p-3 bg-sky-50/50 border border-sky-200 rounded-lg space-y-2 animate-in fade-in">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <span>Balas ulasan sebagai:</span>
                    <strong className="text-sky-800">
                      {currentRole === 'admin' ? 'Administrator Resmi HIGOLD' : 'Customer Service HIGOLD'}
                    </strong>
                  </div>
                  <textarea
                    rows={2}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="Tulis tanggapan apresiasi atau solusi teknis untuk pembeli..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReviewId(null)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendReply(rev.id)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim Balasan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
