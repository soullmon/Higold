import React, { useState, useEffect } from 'react';
import { UserProfile, Order, PointRewardItem } from '../../types';
import { INITIAL_POINT_REWARDS } from '../../data/promotionData';
import { formatRupiah } from '../../utils/format';
import { 
  User, EnvelopeSimple, Phone, MapPin, Camera, Check, 
  CheckCircle, Package, ShieldCheck, 
  Trash, ArrowRight, ShoppingBag, Clock,
  FileText, ArrowLeft, Gift, MagnifyingGlass,
  SignOut, AirplaneTilt, Coin, Tag, Sparkle
} from '@phosphor-icons/react';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  onUpdateUserProfile: (profile: UserProfile | null) => void;
  orders: Order[];
  onSelectOrderReceipt?: (order: Order) => void;
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onOpenWhatsApp: (orderNumber?: string) => void;
  initialTab?: 'profile' | 'orders' | 'rewards';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  onUpdateUserProfile,
  orders,
  onSelectOrderReceipt,
  onNavigateHome,
  onNavigateCatalog,
  onOpenWhatsApp,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'rewards'>(initialTab);

  const [name, setName] = useState(userProfile?.name || 'Pelanggan Higold');
  const [email, setEmail] = useState(userProfile?.email || 'customer@higold.co.id');
  const [phone, setPhone] = useState(userProfile?.phone || '+62 812-8899-2311');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [street, setStreet] = useState(userProfile?.address?.street || 'Jl. Pantai Indah Kapuk No. 88');
  const [city, setCity] = useState(userProfile?.address?.city || 'Jakarta Utara');
  const [province, setProvince] = useState(userProfile?.address?.province || 'DKI Jakarta');
  const [postalCode, setPostalCode] = useState(userProfile?.address?.postalCode || '14470');
  const [deliveryNotes, setDeliveryNotes] = useState(userProfile?.address?.deliveryNotes || '');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [claimToast, setClaimToast] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // User Point System
  const totalSpent = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const basePoints = Math.floor(totalSpent / 10000) + 1500; // 1 point per 10k + 1500 welcome points
  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('higold_user_loyalty_points');
      if (saved) return Number(saved);
    } catch {}
    return basePoints;
  });

  const [claimedRewards, setClaimedRewards] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('higold_claimed_rewards');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setAvatarUrl(userProfile.avatarUrl || '');
      if (userProfile.address) {
        setStreet(userProfile.address.street || '');
        setCity(userProfile.address.city || '');
        setProvince(userProfile.address.province || '');
        setPostalCode(userProfile.address.postalCode || '');
        setDeliveryNotes(userProfile.address.deliveryNotes || '');
      }
    }
  }, [userProfile]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Nama lengkap, email, dan nomor WhatsApp wajib diisi.');
      return;
    }

    const updatedProfile: UserProfile = {
      id: userProfile?.id || `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      address: {
        street: street.trim(),
        city: city.trim(),
        province: province.trim(),
        postalCode: postalCode.trim(),
        deliveryNotes: deliveryNotes.trim(),
      },
      accountType: userProfile?.accountType || 'retail',
      isEmailVerified: true,
      joinedDate: userProfile?.joinedDate || new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onUpdateUserProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun HIGOLD?')) {
      try {
        localStorage.removeItem('higold_user_session');
      } catch {}
      onUpdateUserProfile(null);
      onNavigateHome();
    }
  };

  const handleClaimReward = (reward: PointRewardItem) => {
    if (userPoints < reward.pointsRequired) {
      alert(`Poin Anda (${userPoints.toLocaleString('id-ID')}) belum mencukupi untuk klaim reward "${reward.title}" (${reward.pointsRequired.toLocaleString('id-ID')} Poin). Tingkatkan belanja produk jadi untuk menambah poin!`);
      return;
    }

    if (window.confirm(`Gunakan ${reward.pointsRequired.toLocaleString('id-ID')} Poin untuk menukarkan hadiah "${reward.title}"?`)) {
      const newPoints = userPoints - reward.pointsRequired;
      setUserPoints(newPoints);
      try {
        localStorage.setItem('higold_user_loyalty_points', newPoints.toString());
        const updatedClaimed = [...claimedRewards, reward.id];
        setClaimedRewards(updatedClaimed);
        localStorage.setItem('higold_claimed_rewards', JSON.stringify(updatedClaimed));
      } catch {}

      setClaimToast(`Selamat! Klaim reward "${reward.title}" berhasil diajukan. Tim CS Higold akan memproses pengiriman voucher/tiket Anda.`);
      setTimeout(() => setClaimToast(null), 5000);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.items.some((it) => it.product.name.toLowerCase().includes(q) || it.product.sku.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 font-sans select-none">
      
      {/* Toast Save Success */}
      {saveSuccess && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-neutral-950 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border border-[#C8A15A] shadow-2xl flex items-center gap-3 animate-fade-in max-w-[calc(100vw-2rem)]">
          <div className="w-7 h-7 rounded-sm bg-[#C8A15A] text-neutral-950 flex items-center justify-center shrink-0">
            <Check weight="bold" className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#C8A15A] uppercase tracking-wider">Profil Diperbarui</div>
            <div className="text-xs text-neutral-300">Perubahan berhasil disimpan ke akun Anda.</div>
          </div>
        </div>
      )}

      {/* Toast Reward Claim Success */}
      {claimToast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-md bg-neutral-950 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg border border-[#C8A15A] shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-sm bg-[#C8A15A] text-neutral-950 flex items-center justify-center shrink-0">
            <Gift weight="fill" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#C8A15A] uppercase tracking-wider">Klaim Reward Sukses</div>
            <div className="text-xs text-neutral-300 leading-snug">{claimToast}</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Logout Action */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
            <button 
              onClick={onNavigateHome}
              className="hover:text-[#C8A15A] cursor-pointer flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <span>/</span>
            <span className="text-neutral-900 font-bold">Akun Profil Saya</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateCatalog}
              className="text-xs font-bold text-[#9A7B38] hover:text-[#C8A15A] cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>Belanja Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Logout Button in Header */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-bold rounded-md border border-neutral-300 hover:border-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Keluar dari Akun"
            >
              <SignOut weight="bold" className="w-3.5 h-3.5" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-md border border-neutral-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md bg-neutral-900 border-2 border-[#C8A15A] shrink-0 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#C8A15A]">
                      {name.charAt(0) || 'U'}
                    </span>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-none bg-[#FAF6ED] text-[#8A6B29] text-[10px] font-bold border border-[#C8A15A]/30 uppercase tracking-wider">
                    {userProfile?.accountType === 'b2b' ? 'Mitra Kontraktor' : 'Member Resmi'}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 truncate">
                    {name}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate">
                    {email}
                  </p>
                </div>
              </div>

              {/* Stats: Orders & Loyalty Points */}
              <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200">
                  <div className="text-[10px] uppercase text-neutral-500 font-bold">Total Pesanan</div>
                  <div className="text-lg font-bold text-neutral-900 mt-0.5">{orders.length}</div>
                </div>
                <div className="p-3 bg-[#FAF6ED] rounded-md border border-[#C8A15A]/40">
                  <div className="text-[10px] uppercase text-[#8A6B29] font-bold">Poin Royalty</div>
                  <div className="text-sm font-bold text-[#C8A15A] mt-1 truncate">
                    {userPoints.toLocaleString('id-ID')} Pts
                  </div>
                </div>
              </div>

              {/* Point Royalty Promotion Banner */}
              <div className="p-3.5 bg-[#FAF6ED] border border-[#C8A15A]/40 rounded-md text-xs text-neutral-700 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-neutral-900">
                  <Gift weight="fill" className="w-4 h-4 text-[#C8A15A]" />
                  <span>Program Reward Belanja Produk Jadi</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-snug">
                  Setiap pembelian produk hardware jadi senilai Rp 10.000 mendapatkan 1 Poin Reward. Kumpulkan poin dan tukarkan dengan hadiah traveling gratis, emas batangan, atau voucher diskon proyek!
                </p>
              </div>

              {/* Navigation Menu in Sidebar */}
              <div className="space-y-1.5 pt-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full p-3 text-left font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer rounded-md border ${
                    activeTab === 'profile'
                      ? 'bg-[#C8A15A] text-white border-[#C8A15A]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>Data Diri & Alamat Kirim</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full p-3 text-left font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer rounded-md border ${
                    activeTab === 'orders'
                      ? 'bg-[#C8A15A] text-white border-[#C8A15A]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Riwayat Pesanan ({orders.length})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full p-3 text-left font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer rounded-md border ${
                    activeTab === 'rewards'
                      ? 'bg-[#C8A15A] text-white border-[#C8A15A]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AirplaneTilt weight="fill" className="w-4 h-4 text-[#C8A15A]" />
                    <span>Klaim Poin Reward & Traveling</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FAF6ED] text-[#8A6B29] font-bold rounded">
                    {userPoints} Pts
                  </span>
                </button>
              </div>

              {/* Bottom Logout Button in Card */}
              <div className="pt-3 border-t border-neutral-200">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 bg-neutral-50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-bold uppercase tracking-wider rounded-md border border-neutral-200 hover:border-rose-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <SignOut weight="bold" className="w-4 h-4" />
                  <span>Keluar dari Akun (Logout)</span>
                </button>
              </div>
            </div>

            {/* Support Callout */}
            <div className="bg-neutral-950 text-white p-5 rounded-md border border-neutral-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C8A15A] flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                <span>Layanan Konsultan Pelanggan Resmi</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Perlu bantuan faktur pajak proyek, jadwal pengiriman khusus, atau konsultasi ukuran kabinet?
              </p>
              <button
                onClick={() => onOpenWhatsApp()}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>WhatsApp Care Hotline</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="lg:col-span-8">
            
            {/* Top Tab Bar */}
            <div className="flex items-center border border-neutral-200 rounded-md mb-6 bg-white p-1 shadow-2xs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-[#C8A15A] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Data Diri & Alamat</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-md ${
                  activeTab === 'orders'
                    ? 'bg-[#C8A15A] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Riwayat Pesanan</span>
              </button>

              <button
                onClick={() => setActiveTab('rewards')}
                className={`flex-1 py-2.5 px-4 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-md ${
                  activeTab === 'rewards'
                    ? 'bg-[#C8A15A] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <Gift weight="fill" className="w-4 h-4" />
                <span>Poin & Reward Hadiah</span>
              </button>
            </div>

            {/* TAB 1: Profile Info Form */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-md border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 font-serif">
                    Informasi Akun & Alamat Pengiriman
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Data ini digunakan untuk pengiriman hardware dapur dan cetak faktur pesanan resmi.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                  {/* Photo upload section */}
                  <div className="p-4 bg-neutral-50 rounded-md border border-neutral-200 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-md bg-neutral-900 border border-[#C8A15A] shrink-0 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#C8A15A]" />
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="font-bold text-neutral-800">Foto Profil Akun</div>
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-white border border-neutral-300 rounded-md font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors shadow-2xs">
                          <span>Unggah Foto Baru</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-3 py-1.5 text-rose-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Nama Lengkap: *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Email Resmi: *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Nomor WhatsApp Aktif: *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">Jenis Kemitraan Akun:</label>
                      <input
                        type="text"
                        disabled
                        value={userProfile?.accountType === 'b2b' ? 'Mitra Kontraktor & Retailer (B2B)' : 'Pelanggan Retail Resmi (B2C)'}
                        className="w-full p-2.5 bg-neutral-100 border border-neutral-200 text-neutral-500 rounded-md cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <h3 className="font-bold text-sm text-neutral-900 mb-3">
                      Alamat Pengiriman Utama
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block font-bold text-neutral-800 mb-1">Alamat Jalan & Nomor Bangunan:</label>
                        <input
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="Contoh: Jl. Pluit Raya No. 12, Ruko Grand Pluit Blok A"
                          className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-neutral-800 mb-1">Kota / Kabupaten:</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-neutral-800 mb-1">Provinsi:</label>
                          <input
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-neutral-800 mb-1">Kode Pos:</label>
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A] font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-neutral-800 mb-1">Catatan Khusus untuk Kurir:</label>
                        <textarea
                          rows={2}
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Contoh: Titipkan ke satpam pos depan bila rumah sedang sepi."
                          className="w-full p-2.5 bg-white border border-neutral-300 text-neutral-900 rounded-md focus:outline-none focus:border-[#C8A15A]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <SignOut weight="bold" className="w-4 h-4" />
                      <span>Keluar dari Akun</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider rounded-md cursor-pointer transition-colors shadow-xs"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Orders List */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-md border border-neutral-200 p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 font-serif">
                      Daftar Riwayat Pesanan ({orders.length})
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Pantau nomor resi kurir, status verifikasi bank, dan faktur resmi.
                    </p>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <MagnifyingGlass className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Cari No. Pesanan / SKU..."
                      className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 text-xs rounded-md focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-neutral-50 rounded-md border border-neutral-200 p-6 space-y-3">
                    <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                    <div className="text-sm font-bold text-neutral-800">Belum Ada Pesanan Ditemukan</div>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Pesanan hardware yang Anda checkout akan langsung tercatat di sini lengkap dengan tracking pengiriman.
                    </p>
                    <button
                      onClick={onNavigateCatalog}
                      className="px-5 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                      Buka Katalog Produk
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((ord) => {
                      const earnedPts = Math.floor(ord.totalAmount / 10000);
                      return (
                        <div
                          key={ord.id}
                          className="p-4 sm:p-5 bg-white rounded-md border border-neutral-200 hover:border-[#C8A15A]/60 transition-colors shadow-2xs space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-neutral-900">
                                {ord.orderNumber}
                              </span>
                              <span className="text-neutral-400">•</span>
                              <span className="text-neutral-500">{ord.createdAt}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#FAF6ED] text-[#8A6B29] border border-[#C8A15A]/30 text-[10px] font-bold uppercase rounded">
                                +{earnedPts} Poin Didapat
                              </span>
                              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase rounded">
                                {ord.trackingStatus}
                              </span>
                            </div>
                          </div>

                          {/* Items list */}
                          <div className="space-y-2">
                            {ord.items.map((it) => (
                              <div key={it.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 max-w-[70%]">
                                  <span className="font-medium text-neutral-800 truncate">
                                    {it.product.name}
                                  </span>
                                  <span className="text-neutral-400 text-[11px]">× {it.quantity}</span>
                                </div>
                                <span className="font-bold text-neutral-900">
                                  {formatRupiah(it.product.price * it.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div>
                              <span className="text-neutral-500 mr-2">Total Pembayaran:</span>
                              <span className="font-bold text-sm text-[#C8A15A]">
                                {formatRupiah(ord.totalAmount)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {onSelectOrderReceipt && (
                                <button
                                  onClick={() => onSelectOrderReceipt(ord)}
                                  className="px-3 py-1 bg-white border border-neutral-300 hover:border-[#C8A15A] text-neutral-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                                >
                                  Lihat Faktur Resmi
                                </button>
                              )}
                              <button
                                onClick={() => onOpenWhatsApp(ord.orderNumber)}
                                className="px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                              >
                                Lacak via WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Points & Rewards Redemption */}
            {activeTab === 'rewards' && (
              <div className="bg-white rounded-md border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#FAF6ED] rounded-md border border-[#C8A15A]/40">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8A6B29] tracking-wider block">
                      Saldo Poin Royalty Aktif
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#C8A15A] font-serif mt-0.5">
                      {userPoints.toLocaleString('id-ID')} <span className="text-sm font-sans font-medium text-neutral-600">Poin Higold</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      Didapatkan otomatis setiap Anda menyelesaikan pembelian produk kabinet dan hardware jadi.
                    </p>
                  </div>

                  <button
                    onClick={onNavigateCatalog}
                    className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    + Tambah Poin Belanja
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-neutral-900 font-serif mb-1">
                    Katalog Hadiah Reward yang Dapat Ditukarkan
                  </h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Pilih hadiah eksklusif traveling ke Italia atau Bali, logam mulia emas murni, atau voucher belanja hardware:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INITIAL_POINT_REWARDS.map((rew) => {
                      const isClaimed = claimedRewards.includes(rew.id);
                      const canAfford = userPoints >= rew.pointsRequired;

                      return (
                        <div
                          key={rew.id}
                          className="bg-white rounded-md border border-neutral-200 overflow-hidden flex flex-col justify-between hover:border-[#C8A15A]/60 transition-colors shadow-2xs group"
                        >
                          <div className="relative aspect-16/9 bg-neutral-100 overflow-hidden">
                            <img
                              src={rew.imageUrl}
                              alt={rew.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-neutral-950/85 text-[#C8A15A] text-[10px] font-bold uppercase rounded-none">
                              {rew.badge}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#C8A15A] text-white font-bold text-xs rounded shadow-xs">
                              {rew.pointsRequired.toLocaleString('id-ID')} Poin
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#C8A15A] transition-colors leading-snug">
                                {rew.title}
                              </h4>
                              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                                {rew.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                              <span className="text-[11px] text-neutral-500">
                                Sisa Kuota: <strong>{rew.stock} unit</strong>
                              </span>

                              <button
                                type="button"
                                disabled={isClaimed || !canAfford}
                                onClick={() => handleClaimReward(rew)}
                                className={`px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs ${
                                  isClaimed
                                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                                    : canAfford
                                    ? 'bg-[#C8A15A] hover:bg-[#B8924B] text-white'
                                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 border border-neutral-300'
                                }`}
                              >
                                {isClaimed ? '✓ Sudah Diklaim' : canAfford ? 'Klaim Hadiah' : 'Poin Belum Cukup'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
