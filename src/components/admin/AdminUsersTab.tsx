import React, { useState } from 'react';
import { 
  Users, MagnifyingGlass, Funnel, ShieldCheck, Headset, 
  Briefcase, User, CheckCircle, XCircle, WarningCircle, 
  Plus, Check, ChatCircleDots, EnvelopeSimple, ArrowSquareOut, Phone,
  PencilSimple, CaretDown
} from '@phosphor-icons/react';
import { CMSUser, OfficialAccountType, AccountStatus, CMSAccessRole } from '../../types';
import { formatRupiah } from '../../utils/format';

interface AdminUsersTabProps {
  users: CMSUser[];
  onUpdateUserRole: (userId: string, newRole: any) => void;
  onUpdateUserStatus: (userId: string, newStatus: AccountStatus) => void;
  onAddUser: (newUser: CMSUser) => void;
  currentRole: CMSAccessRole;
}

export const ACCOUNT_TYPES_LIST: OfficialAccountType[] = [
  'Admin',
  'CS',
  'Pelanggan',
  'Kontraktor',
  'Retailer',
  'Konsultan',
  'Konsultan & Kontraktor',
];

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateUserRole,
  onUpdateUserStatus,
  onAddUser,
  currentRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

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
    const matchesType = accountTypeFilter === 'all' || userAccType === accountTypeFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAccountTypeChange = (userId: string, newType: OfficialAccountType) => {
    if (currentRole !== 'admin') {
      alert('Akses Ditolak: Hanya Administrator yang berwenang mengubah jenis akun.');
      return;
    }

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

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 border border-[#C8A15A] text-white text-xs font-semibold rounded-md shadow-xl flex items-center gap-2">
          <CheckCircle weight="fill" className="w-4 h-4 text-[#C8A15A]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Cari user, email, instansi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-3 py-1.5 text-xs border border-neutral-300 rounded-md"
          />

          <select
            value={accountTypeFilter}
            onChange={(e) => setAccountTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-neutral-300 rounded-md bg-white font-medium"
          >
            <option value="all">Semua Jenis Akun</option>
            {ACCOUNT_TYPES_LIST.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 uppercase text-[10px]">
            <tr>
              <th className="px-4 py-3">Nama & Email</th>
              <th className="px-4 py-3">Perusahaan / Kantor</th>
              <th className="px-4 py-3">Jenis Akun</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredUsers.map((u) => {
              const accType = getUserAccountType(u);
              const isEditing = editingUserId === u.id;

              return (
                <tr key={u.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-bold text-neutral-900">{u.name}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{u.companyOrProject || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FAF6ED] text-[#9A7B38] border border-[#C8A15A]/30">
                      {accType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={accType}
                          onChange={(e) => handleAccountTypeChange(u.id, e.target.value as OfficialAccountType)}
                          className="px-2 py-1 text-xs border border-[#C8A15A] rounded-md font-bold"
                          autoFocus
                        >
                          {ACCOUNT_TYPES_LIST.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <button onClick={() => setEditingUserId(null)} className="p-1 text-neutral-400">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingUserId(u.id)}
                        className="px-3 py-1 bg-neutral-900 text-[#C8A15A] hover:bg-neutral-800 rounded-md text-xs font-semibold"
                      >
                        Ubah Akun
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
  );
};
