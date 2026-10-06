import React, { useState } from 'react';
import { 
  Users, Key, ShieldCheck, CheckCircle, 
  Eye, EyeSlash, Check, XCircle, WarningCircle, 
  PencilSimple, Plus, Headset, User, Buildings,
  DownloadSimple
} from '@phosphor-icons/react';
import { CMSUser, OfficialAccountType, AccountStatus, CMSAccessRole } from '../../types';
import { formatRupiah } from '../../utils/format';

export const ACCOUNT_TYPES_LIST: OfficialAccountType[] = [
  'Admin',
  'CS',
  'Pelanggan',
  'Kontraktor',
  'Retailer',
  'Konsultan',
  'Konsultan & Kontraktor',
];

interface AdminManageTabProps {
  users: CMSUser[];
  onUpdateUserRole: (userId: string, newRole: any) => void;
  onUpdateUserStatus: (userId: string, newStatus: AccountStatus) => void;
  onAddUser: (newUser: CMSUser) => void;
  adminEmail: string;
  onUpdateAdminEmail?: (newEmail: string) => void;
  currentRole: CMSAccessRole;
  onResetToDefault?: () => void;
}

export const AdminManageTab: React.FC<AdminManageTabProps> = ({
  users,
  onUpdateUserRole,
  onUpdateUserStatus,
  onAddUser,
  adminEmail,
  onUpdateAdminEmail,
  currentRole,
  onResetToDefault,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'credentials'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin / CS Credentials form state
  const [adminEmailInput, setAdminEmailInput] = useState(adminEmail || 'admin@higold.co.id');
  const [adminPasswordInput, setAdminPasswordInput] = useState('admin123');
  const [csPasswordInput, setCsPasswordInput] = useState('cs123');
  const [securityPinInput, setSecurityPinInput] = useState('2026');
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 bg-white rounded-lg border border-rose-200 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-md flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">
          Akses Kelola Dibatasi Khusus Master Administrator
        </h3>
        <p className="text-xs text-neutral-600 max-w-md mx-auto">
          Hanya Administrator utama yang memiliki wewenang untuk mengubah jenis akun pengguna, mengangkat peran staf, serta mengubah password kredensial login Admin dan CS.
        </p>
      </div>
    );
  }

  const getUserAccountType = (u: CMSUser): OfficialAccountType => {
    if (u.officialAccountType) return u.officialAccountType;
    if (u.role === 'admin') return 'Admin';
    if (u.role === 'cs_support') return 'CS';
    if (u.userCategory === 'kontraktor') return 'Kontraktor';
    if (u.userCategory === 'retailer') return 'Retailer';
    if (u.userCategory === 'konsultan') return 'Konsultan';
    if (u.userCategory === 'konsultan_dan_kontraktor') return 'Konsultan & Kontraktor';
    if (u.role === 'customer_pro') return 'Kontraktor';
    return 'Pelanggan';
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      (u.companyOrProject && u.companyOrProject.toLowerCase().includes(q));

    const userAccType = getUserAccountType(u);
    const matchesType = typeFilter === 'all' || userAccType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAccountTypeChange = (userId: string, newType: OfficialAccountType) => {
    let role: any = 'customer_regular';
    if (newType === 'Admin') role = 'admin';
    else if (newType === 'CS') role = 'cs_support';
    else if (['Kontraktor', 'Retailer', 'Konsultan', 'Konsultan & Kontraktor'].includes(newType)) {
      role = 'customer_pro';
    }

    onUpdateUserRole(userId, { role, officialAccountType: newType });
    setEditingUserId(null);
    showToast(`Jenis akun berhasil diubah menjadi: ${newType}`);
  };

  const handleExportUsers = () => {
    const header = 'Nama Pengguna,Email,Nomor WhatsApp,Jenis Akun Resmi,Status Akun,Perusahaan/Proyek,Total Transaksi,Total Belanja (IDR),Tanggal Bergabung\n';
    const rows = filteredUsers.map(u => {
      const accType = getUserAccountType(u);
      return `"${u.name}","${u.email}","${u.phone}","${accType}","${u.status}","${u.companyOrProject || '-'}","${u.totalOrders || 0}","${u.totalSpent || 0}","${u.joinedDate}"`;
    }).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HIGOLD_Data_Semua_User_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Semua User berhasil diekspor ke CSV!');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('higold_admin_account', JSON.stringify({
        email: adminEmailInput.trim(),
        password: adminPasswordInput.trim(),
        csPassword: csPasswordInput.trim(),
        pin: securityPinInput.trim(),
      }));
      if (onUpdateAdminEmail) onUpdateAdminEmail(adminEmailInput.trim());
    } catch {}
    showToast('Kredensial Password Login Admin & CS berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 border border-[#C8A15A] text-white text-xs font-semibold rounded-md shadow-xl flex items-center gap-2">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#C8A15A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 rounded-lg border bg-neutral-900 border-[#C8A15A]/40 text-neutral-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-md bg-[#C8A15A] text-neutral-950 font-bold flex items-center justify-center shrink-0">
            <Key weight="bold" className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Kelola Jenis Akun User & Password Kredensial Login
              </h2>
              <span className="px-2 py-0.5 bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/40 text-[10px] font-bold rounded uppercase tracking-wider">
                Admin Master
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed max-w-2xl">
              Ubah 7 jenis akun pengguna (Admin, CS, Pelanggan, Kontraktor, Retailer, Konsultan, Konsultan & Kontraktor) dan konfigurasikan kata sandi login khusus Admin & CS.
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 bg-neutral-950/60 p-1 rounded-md border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'users' ? 'bg-[#C8A15A] text-neutral-950' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Kelola Jenis Akun (7 Tipe)
          </button>
          <button
            onClick={() => setActiveSubTab('credentials')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              activeSubTab === 'credentials' ? 'bg-[#C8A15A] text-neutral-950' : 'text-neutral-300 hover:text-white'
            }`}
          >
            Password Kredensial Admin/CS
          </button>
        </div>
      </div>

      {/* 1. SUB-TAB: KELOLA JENIS AKUN */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Cari nama pengguna, email, perusahaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 text-xs border border-neutral-300 rounded-md focus:outline-hidden focus:border-[#C8A15A]"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-neutral-300 rounded-md bg-white cursor-pointer font-medium"
              >
                <option value="all">Semua 7 Jenis Akun</option>
                {ACCOUNT_TYPES_LIST.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExportUsers}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-[#C8A15A] font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                <DownloadSimple weight="bold" className="w-4 h-4" />
                <span>Export Semua User (CSV)</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Nama Pengguna & Email</th>
                  <th className="px-4 py-3">Perusahaan / Kantor</th>
                  <th className="px-4 py-3">Jenis Akun Saat Ini</th>
                  <th className="px-4 py-3">Akses Login CMS</th>
                  <th className="px-4 py-3 text-right">Ubah Jenis Akun (7 Tipe)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((u) => {
                  const accType = getUserAccountType(u);
                  const isEditing = editingUserId === u.id;
                  const isStaff = accType === 'Admin' || accType === 'CS';

                  return (
                    <tr key={u.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            accType === 'Admin' ? 'bg-[#C8A15A] text-neutral-950' : accType === 'CS' ? 'bg-sky-500 text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {accType === 'Admin' ? <ShieldCheck weight="fill" className="w-3.5 h-3.5" /> : accType === 'CS' ? <Headset weight="fill" className="w-3.5 h-3.5" /> : <User weight="bold" className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">{u.name}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-neutral-700">
                        {u.companyOrProject || 'Residensial / Personal'}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          accType === 'Admin'
                            ? 'bg-[#C8A15A]/15 text-[#9A7B38] border border-[#C8A15A]/40'
                            : accType === 'CS'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                        }`}>
                          {accType}
                        </span>
                      </td>

                      {/* Akses Login CMS: ONLY Admin and CS have CMS login access! No lock icon on regular users */}
                      <td className="px-4 py-3">
                        {isStaff ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            accType === 'Admin' ? 'bg-neutral-900 text-[#C8A15A]' : 'bg-sky-500 text-white'
                          }`}>
                            <Key weight="fill" className="w-3 h-3" />
                            <span>Kredensial Aktif</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-neutral-400">
                            User Reguler (Khusus Belanja)
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={accType}
                              onChange={(e) => handleAccountTypeChange(u.id, e.target.value as OfficialAccountType)}
                              className="px-2 py-1 text-xs border border-[#C8A15A] rounded-md font-bold text-neutral-900 bg-white"
                              autoFocus
                            >
                              {ACCOUNT_TYPES_LIST.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingUserId(u.id)}
                            className="px-3 py-1 bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Ubah Jenis Akun
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: PASSWORD KREDENSIAL LOGIN ADMIN / CS */}
      {activeSubTab === 'credentials' && (
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Key weight="bold" className="w-4 h-4 text-[#C8A15A]" />
              <span>Pengaturan Password & Kredensial Login CMS (Khusus Admin & CS)</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Kredensial login CMS ini hanya berlaku untuk akun berstatus Administrator dan Customer Service.
            </p>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Email Master Administrator</label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-neutral-900 focus:outline-hidden focus:border-[#C8A15A]"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Password Baru Administrator</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-neutral-900 pr-10 focus:outline-hidden focus:border-[#C8A15A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Password Petugas CS (cs@higold.co.id)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={csPasswordInput}
                onChange={(e) => setCsPasswordInput(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-neutral-900 focus:outline-hidden focus:border-[#C8A15A]"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Kode PIN Keamanan 2FA (4 Digit)</label>
              <input
                type="text"
                maxLength={4}
                required
                value={securityPinInput}
                onChange={(e) => setSecurityPinInput(e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md font-mono text-neutral-900 tracking-widest text-center text-sm font-bold focus:outline-hidden focus:border-[#C8A15A]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold rounded-md cursor-pointer transition-colors shadow-xs"
              >
                Simpan Password & PIN
              </button>

              {onResetToDefault && (
                <button
                  type="button"
                  onClick={onResetToDefault}
                  className="px-3 py-2 text-neutral-500 hover:text-neutral-800 text-[11px] underline cursor-pointer"
                >
                  Reset Kredensial Default
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
