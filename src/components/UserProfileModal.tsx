import React, { useState, useEffect } from 'react';
import { UserProfile, Order } from '../types';
import { formatRupiah } from '../utils/format';
import { 
  X, User, EnvelopeSimple, Phone, MapPin, Camera, Check, 
  CheckCircle, Package, SignOut, ShieldCheck, Gift
} from '@phosphor-icons/react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onUpdateUserProfile: (profile: UserProfile | null) => void;
  orders: Order[];
  onSelectOrderReceipt?: (order: Order) => void;
}

const PRESET_AVATARS = [
  { id: 'av1', label: 'Eksekutif', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'av2', label: 'Arsitek Pro', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'av3', label: 'Desainer Interior', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { id: 'av4', label: 'Kontraktor', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { id: 'av5', label: 'Homeowner', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateUserProfile,
  orders,
  onSelectOrderReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Form states
  const [name, setName] = useState(userProfile?.name || 'Bpk. Hendra Gunawan');
  const [email, setEmail] = useState(userProfile?.email || 'hendra.gunawan@gmail.com');
  const [phone, setPhone] = useState(userProfile?.phone || '0812-8899-2311');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || PRESET_AVATARS[0].url);
  const [street, setStreet] = useState(userProfile?.address?.street || 'Jl. Pantai Indah Kapuk No. 88, Cluster Ebony');
  const [city, setCity] = useState(userProfile?.address?.city || 'Jakarta Utara');
  const [province, setProvince] = useState(userProfile?.address?.province || 'DKI Jakarta');
  const [postalCode, setPostalCode] = useState(userProfile?.address?.postalCode || '14470');
  const [deliveryNotes, setDeliveryNotes] = useState(userProfile?.address?.deliveryNotes || 'Titipkan ke pos satpam jika sedang keluar.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Points calculation from finished product orders
  const totalSpent = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const userPoints = Math.floor(totalSpent / 10000) + 1500;

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      if (userProfile.avatarUrl) setAvatarUrl(userProfile.avatarUrl);
      if (userProfile.address) {
        setStreet(userProfile.address.street || '');
        setCity(userProfile.address.city || '');
        setProvince(userProfile.address.province || '');
        setPostalCode(userProfile.address.postalCode || '');
        setDeliveryNotes(userProfile.address.deliveryNotes || '');
      }
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

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
      avatarUrl,
      address: {
        street: street.trim(),
        city: city.trim(),
        province: province.trim(),
        postalCode: postalCode.trim(),
        deliveryNotes: deliveryNotes.trim(),
      },
      accountType: userProfile?.accountType || 'retail',
      isEmailVerified: true,
      joinedDate: userProfile?.joinedDate || 'Okt 2024',
    };

    onUpdateUserProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari akun HIGOLD Indonesia?')) {
      try {
        localStorage.removeItem('higold_user_session');
      } catch {}
      onUpdateUserProfile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150 font-sans">
      <div 
        className="relative w-full max-w-[560px] bg-white shadow-2xl border border-neutral-200 rounded-md flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal with Higold Logo */}
        <div className="h-16 px-6 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/higold-logo.png"
              alt="HIGOLD"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <h2 className="text-sm font-bold text-neutral-900 leading-tight">
                Profil Pengguna & Pesanan
              </h2>
              <p className="text-[11px] text-neutral-500">
                HIGOLD Hardware Official Client Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
              title="Keluar dari Akun"
            >
              <SignOut weight="bold" className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Points & Account Type Banner */}
        <div className="px-6 py-3 bg-[#FAF6ED] border-b border-[#C8A15A]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift weight="fill" className="w-4 h-4 text-[#C8A15A]" />
            <span className="text-xs text-neutral-700">
              Poin Royalty Anda: <strong className="text-[#C8A15A] font-bold">{userPoints.toLocaleString('id-ID')} Poin</strong>
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-white border border-[#C8A15A]/40 text-[#8A6B29] font-bold uppercase rounded">
            {userProfile?.accountType === 'b2b' ? 'Mitra Kontraktor' : 'Member Retail'}
          </span>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-[#C8A15A] border-b-2 border-[#C8A15A] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Informasi Pribadi & Alamat</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-[#C8A15A] border-b-2 border-[#C8A15A] font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Riwayat Pesanan ({orders.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between bg-white text-xs">
          {activeTab === 'profile' ? (
            <div className="space-y-4">
              {saveSuccess && (
                <div className="p-2.5 bg-[#FAF6ED] border border-[#C8A15A]/40 text-[#8A6B29] text-xs rounded flex items-center gap-2 animate-in fade-in">
                  <CheckCircle weight="fill" className="w-4 h-4 text-[#C8A15A] shrink-0" />
                  <span>Pengaturan profil berhasil disimpan dan diperbarui!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                {/* Foto Profil */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-2">
                  <label className="block font-bold text-neutral-700 text-[11px] uppercase tracking-wider">
                    Foto Profil Pengguna
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-md overflow-hidden border-2 border-[#C8A15A] shrink-0 bg-neutral-900">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Foto Profil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-[#C8A15A]">HG</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-[11px] font-semibold cursor-pointer rounded">
                        <Camera className="w-3.5 h-3.5 text-[#C8A15A]" />
                        <span>Unggah Foto dari Perangkat</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                      <p className="text-[10px] text-neutral-400">
                        Format JPG/PNG atau pilih foto preset di bawah:
                      </p>
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setAvatarUrl(av.url)}
                        className={`w-9 h-9 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          avatarUrl === av.url ? 'border-[#C8A15A] ring-1 ring-[#C8A15A]' : 'border-neutral-300 opacity-60 hover:opacity-100'
                        }`}
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1 text-[11px] uppercase tracking-wider">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Bpk. Hendra Gunawan"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A] focus:bg-white font-sans font-medium"
                  />
                </div>

                {/* Nomor WhatsApp & Email */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C8A15A]" />
                      <span>Nomor WhatsApp <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A] focus:bg-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1 text-[11px] uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <EnvelopeSimple className="w-3 h-3 text-[#C8A15A]" />
                        <span>Email <span className="text-rose-500">*</span></span>
                      </span>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase">Terverifikasi</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@domain.com"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A] focus:bg-white font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Alamat Pengiriman */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A15A]" />
                    <span>Alamat Pengiriman Hardware</span>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Jalan, No. Bangunan, Ruko / Komplek"
                      className="w-full p-2 bg-white border border-neutral-300 text-neutral-800 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kota / Kab"
                      className="w-full p-2 bg-white border border-neutral-300 text-neutral-800 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Provinsi"
                      className="w-full p-2 bg-white border border-neutral-300 text-neutral-800 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Kode Pos"
                      className="w-full p-2 bg-white border border-neutral-300 text-neutral-800 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors shadow-xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Orders Tab */
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#C8A15A]" />
                <span>Riwayat Pesanan Anda ({orders.length})</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 border border-neutral-200 p-4 space-y-2 rounded">
                  <Package className="w-8 h-8 text-neutral-300 mx-auto" />
                  <div className="text-xs font-semibold text-neutral-700">Belum Ada Pesanan yang Dibuat</div>
                  <p className="text-[11px] text-neutral-500">
                    Pesanan hardware HIGOLD yang Anda buat akan langsung tercatat dan dapat dipantau di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-3 bg-neutral-50 border border-neutral-200 space-y-2 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-neutral-900">{ord.orderNumber}</span>
                        <span className="px-2 py-0.5 bg-[#FAF6ED] text-[#8A6B29] border border-[#C8A15A]/30 text-[10px] uppercase font-medium rounded">
                          {ord.trackingStatus}
                        </span>
                      </div>
                      <div className="text-neutral-600 text-[11px] space-y-1">
                        {ord.items.map((i) => (
                          <div key={i.id} className="flex justify-between">
                            <span className="truncate max-w-[240px]">{i.product.name} × {i.quantity}</span>
                            <span className="font-semibold text-neutral-900">{formatRupiah(i.product.price * i.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-[#C8A15A]">Total: {formatRupiah(ord.totalAmount)}</span>
                        {onSelectOrderReceipt && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectOrderReceipt(ord);
                            }}
                            className="text-[#9A7B38] hover:text-[#C8A15A] font-semibold underline text-[11px] cursor-pointer"
                          >
                            Faktur →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Controls with Explicit Logout */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 text-xs">
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer flex items-center gap-1.5"
            >
              <SignOut weight="bold" className="w-3.5 h-3.5" />
              <span>Keluar dari Akun (Logout)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
