import React, { useState } from 'react';
import { 
  Gift, AirplaneTilt, Coin, Plus, CheckCircle, 
  Trash, Tag, CalendarBlank, Users, Check, X, 
  CurrencyDollar, Sparkle, Clock, ArrowRight, WarningCircle,
  Eye, CaretRight
} from '@phosphor-icons/react';
import { PointRewardItem, PromotionCampaign, PointRedemptionClaim, CMSAccessRole } from '../../types';
import { INITIAL_POINT_REWARDS, INITIAL_PROMOTIONS, INITIAL_POINT_CLAIMS } from '../../data/promotionData';
import { formatRupiah } from '../../utils/format';

interface AdminPromotionTabProps {
  currentRole: CMSAccessRole;
}

export const AdminPromotionTab: React.FC<AdminPromotionTabProps> = ({ currentRole }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rewards' | 'promotions' | 'claims'>('rewards');
  const [rewards, setRewards] = useState<PointRewardItem[]>(INITIAL_POINT_REWARDS);
  const [promotions, setPromotions] = useState<PromotionCampaign[]>(INITIAL_PROMOTIONS);
  const [claims, setClaims] = useState<PointRedemptionClaim[]>(INITIAL_POINT_CLAIMS);

  // New Reward Modal
  const [isAddRewardOpen, setIsAddRewardOpen] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardCategory, setRewardCategory] = useState<'travel' | 'gold_bar' | 'hardware' | 'voucher'>('travel');
  const [rewardPoints, setRewardPoints] = useState(5000);
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardStock, setRewardStock] = useState(10);
  const [rewardImage, setRewardImage] = useState('');

  // New Promo Modal
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(15);
  const [promoMinSpend, setPromoMinSpend] = useState(5000000);
  const [promoTarget, setPromoTarget] = useState<'all' | 'kontraktor' | 'retailer' | 'konsultan'>('all');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardTitle.trim()) return;

    const newRew: PointRewardItem = {
      id: `rew-${Date.now().toString(36)}`,
      title: rewardTitle.trim(),
      category: rewardCategory,
      pointsRequired: Number(rewardPoints),
      description: rewardDesc.trim() || 'Hadiah eksklusif program royalty poin pembeli Higold Indonesia.',
      stock: Number(rewardStock),
      imageUrl: rewardImage.trim() || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
      badge: rewardCategory === 'travel' ? 'Wisata & Traveling' : rewardCategory === 'gold_bar' ? 'Logam Mulia' : 'Voucher Diskon',
    };

    setRewards([newRew, ...rewards]);
    setIsAddRewardOpen(false);
    setRewardTitle('');
    setRewardDesc('');
    showToast(`Hadiah Point Reward "${newRew.title}" berhasil ditambahkan!`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim() || !promoCode.trim()) return;

    const newPromo: PromotionCampaign = {
      id: `promo-${Date.now().toString(36)}`,
      title: promoTitle.trim(),
      code: promoCode.trim().toUpperCase(),
      discountPercent: Number(promoDiscount),
      minSpend: Number(promoMinSpend),
      startDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      endDate: '31 Des 2024',
      status: 'active',
      targetAudience: promoTarget,
      usedCount: 0,
    };

    setPromotions([newPromo, ...promotions]);
    setIsAddPromoOpen(false);
    setPromoTitle('');
    setPromoCode('');
    showToast(`Promosi Voucher "${newPromo.code}" berhasil diterbitkan!`);
  };

  const handleUpdateClaimStatus = (claimId: string, status: 'approved' | 'shipped') => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status } : c));
    showToast(`Status klaim reward berhasil diubah menjadi: ${status === 'approved' ? 'Disetujui' : 'Terkirim'}`);
  };

  const handleDeleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
    showToast('Hadiah reward telah dihapus.');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 border border-[#C8A15A] text-white text-xs font-semibold rounded-md shadow-xl flex items-center gap-2">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#C8A15A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 rounded-lg border bg-neutral-950 border-[#C8A15A]/40 text-neutral-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[#C8A15A] text-neutral-950 font-bold flex items-center justify-center shrink-0">
            <Gift weight="bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Manajemen Promosi & Program Point Reward Pembeli
              </h2>
              <span className="px-2 py-0.5 bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40 text-[10px] font-bold rounded uppercase tracking-wider">
                Royalty Points
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed max-w-2xl">
              Atur promosi diskon belanja, kelola katalog penukaran point reward (Gratis traveling ke Eropa/Italia, Emas Logam Mulia, Voucher belanja), serta verifikasi klaim penukaran dari pelanggan.
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-md border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveSubTab('rewards')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'rewards' ? 'bg-[#C8A15A] text-neutral-950' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Point Rewards ({rewards.length})
          </button>
          <button
            onClick={() => setActiveSubTab('promotions')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'promotions' ? 'bg-[#C8A15A] text-neutral-950' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Promosi Diskon ({promotions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('claims')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'claims' ? 'bg-[#C8A15A] text-neutral-950' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Klaim Hadiah ({claims.length})
          </button>
        </div>
      </div>

      {/* 1. SUB-TAB: POINT REWARDS (Traveling, Emas, dll) */}
      {activeSubTab === 'rewards' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                Katalog Hadiah Point Reward Pembeli
              </h3>
              <p className="text-xs text-neutral-500">
                Poin yang diperoleh dari setiap pembelian dapat ditukarkan pelanggan dengan reward berikut:
              </p>
            </div>
            <button
              onClick={() => setIsAddRewardOpen(true)}
              className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>Buat Reward Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((rew) => (
              <div key={rew.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative h-40 bg-neutral-100 overflow-hidden">
                    <img src={rew.imageUrl} alt={rew.title} className="w-full h-full object-cover" />
                    {rew.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-neutral-950/80 text-[#C8A15A] text-[10px] font-bold rounded border border-[#C8A15A]/30">
                        {rew.badge}
                      </span>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-white/90 text-neutral-900 font-mono text-[10px] font-bold rounded">
                      Sisa Kuota: {rew.stock}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1 text-[#9A7B38] font-bold text-xs">
                      <Coin weight="fill" className="w-4 h-4 text-[#C8A15A]" />
                      <span>{rew.pointsRequired.toLocaleString('id-ID')} Poin</span>
                    </div>
                    <h4 className="font-bold text-xs text-neutral-900 line-clamp-2">
                      {rew.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-3">
                      {rew.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 capitalize">
                    Kategori: {rew.category}
                  </span>
                  <button
                    onClick={() => handleDeleteReward(rew.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus Reward"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: PROMOSI & DISKON */}
      {activeSubTab === 'promotions' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                Daftar Kampanye Promosi & Kupon Diskon Aktif
              </h3>
              <p className="text-xs text-neutral-500">
                Kelola diskon borongan arsitek, cashback kemitraan B2B, dan voucher belanja toko.
              </p>
            </div>
            <button
              onClick={() => setIsAddPromoOpen(true)}
              className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>Buat Promosi Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Promosi & Judul</th>
                  <th className="px-4 py-3">Kode Kupon</th>
                  <th className="px-4 py-3">Besaran Diskon</th>
                  <th className="px-4 py-3">Minimal Belanja</th>
                  <th className="px-4 py-3">Target Sasaran</th>
                  <th className="px-4 py-3 text-center">Penggunaan</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {promotions.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-neutral-900">{p.title}</div>
                      <div className="text-[10px] text-neutral-400">Periode: {p.startDate} – {p.endDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold px-2 py-0.5 bg-[#FAF6ED] text-[#9A7B38] border border-[#C8A15A]/30 rounded">
                        {p.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-neutral-900">
                      {p.discountPercent}% Diskon
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-700">
                      {formatRupiah(p.minSpend)}
                    </td>
                    <td className="px-4 py-3 capitalize text-neutral-600">
                      {p.targetAudience}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-neutral-900">
                      {p.usedCount}x
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] rounded uppercase">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB: KLAIM PENUKARAN POIN */}
      {activeSubTab === 'claims' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
              Permintaan Penukaran Poin Hadiah dari Pembeli
            </h3>
            <p className="text-xs text-neutral-500">
              Verifikasi dan proses penukaran hadiah yang diajukan oleh pengguna:
            </p>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">ID & Tanggal Klaim</th>
                  <th className="px-4 py-3">Nama Pemohon (Pelanggan)</th>
                  <th className="px-4 py-3">Hadiah yang Diklaim</th>
                  <th className="px-4 py-3">Poin Ditukarkan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {claims.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-neutral-900">{c.id}</div>
                      <div className="text-[10px] text-neutral-500">{c.claimDate}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-neutral-900">{c.userName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{c.userPhone}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">
                      {c.rewardTitle}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[#9A7B38]">
                      {c.pointsSpent.toLocaleString('id-ID')} Pts
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'shipped' 
                          ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                          : c.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {c.status === 'shipped' ? 'Terkirim' : c.status === 'approved' ? 'Disetujui' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.status === 'pending' ? (
                        <button
                          onClick={() => handleUpdateClaimStatus(c.id, 'approved')}
                          className="px-3 py-1 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          Setujui Klaim
                        </button>
                      ) : c.status === 'approved' ? (
                        <button
                          onClick={() => handleUpdateClaimStatus(c.id, 'shipped')}
                          className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          Tandai Terkirim
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-medium">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Buat Reward Baru */}
      {isAddRewardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg border border-neutral-300 max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-sm text-neutral-900">
                Buat Hadiah Point Reward Baru
              </h3>
              <button onClick={() => setIsAddRewardOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama Hadiah / Reward *</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Gratis Traveling ke Jepang 5D4N / Emas Antam 10g"
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:border-[#C8A15A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kategori Hadiah</label>
                  <select
                    value={rewardCategory}
                    onChange={(e) => setRewardCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white"
                  >
                    <option value="travel">Traveling & Wisata</option>
                    <option value="gold_bar">Emas / Logam Mulia</option>
                    <option value="hardware">Hardware / Produk Dapur</option>
                    <option value="voucher">Voucher Potongan Belanja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Poin yang Dibutuhkan</label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={rewardPoints}
                    onChange={(e) => setRewardPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Stok Kuota Hadiah</label>
                  <input
                    type="number"
                    min={1}
                    value={rewardStock}
                    onChange={(e) => setRewardStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">URL Foto Hadiah (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={rewardImage}
                    onChange={(e) => setRewardImage(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Deskripsi Detail Hadiah</label>
                <textarea
                  rows={2}
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  placeholder="Penjelasan benefit, akomodasi tiket, atau syarat penukaran..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRewardOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold rounded-md cursor-pointer"
                >
                  Simpan Hadiah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Buat Promo Baru */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-lg border border-neutral-300 max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-sm text-neutral-900">
                Terbitkan Kampanye Promosi / Kupon Diskon Baru
              </h3>
              <button onClick={() => setIsAddPromoOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Judul Promosi *</label>
                <input
                  type="text"
                  required
                  placeholder="cth. Promo Arsitektur Akhir Tahun"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:border-[#C8A15A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kode Kupon / Voucher *</label>
                  <input
                    type="text"
                    required
                    placeholder="cth. ARSITEK20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono uppercase focus:border-[#C8A15A]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Persentase Diskon (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Minimal Nilai Transaksi (IDR)</label>
                  <input
                    type="number"
                    step={500000}
                    value={promoMinSpend}
                    onChange={(e) => setPromoMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Sasaran Mitra</label>
                  <select
                    value={promoTarget}
                    onChange={(e) => setPromoTarget(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white capitalize"
                  >
                    <option value="all">Semua Pengguna</option>
                    <option value="kontraktor">Khusus Kontraktor</option>
                    <option value="retailer">Khusus Retailer</option>
                    <option value="konsultan">Khusus Konsultan</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold rounded-md cursor-pointer"
                >
                  Terbitkan Promosi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
