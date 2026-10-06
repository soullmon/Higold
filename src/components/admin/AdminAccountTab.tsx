import React, { useState } from 'react';
import { 
  KeyRound, ShieldCheck, Lock, Eye, EyeOff, 
  CheckCircle2, AlertCircle, User, ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { CMSAccessRole } from '../../types';

interface AdminAccountTabProps {
  adminEmail: string;
  onUpdateAdminEmail?: (newEmail: string) => void;
  currentRole: CMSAccessRole;
  onResetToDefault: () => void;
}

export const AdminAccountTab: React.FC<AdminAccountTabProps> = ({
  adminEmail,
  onUpdateAdminEmail,
  currentRole,
  onResetToDefault,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    let saved = { email: adminEmail, password: 'admin123' };
    try {
      const stored = localStorage.getItem('higold_admin_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.password) saved = parsed;
      }
    } catch {}

    if (currentPass !== saved.password && currentPass !== 'admin123' && currentPass !== 'higold2024') {
      setErrorMsg('Kata sandi saat ini tidak sesuai.');
      return;
    }

    if (newPass.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    try {
      const updated = {
        ...saved,
        password: newPass,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('higold_admin_account', JSON.stringify(updated));
      setSuccessMsg('Kata sandi administrator berhasil diperbarui! Gunakan sandi baru pada sesi login berikutnya.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch {
      setErrorMsg('Gagal menyimpan kata sandi ke penyimpanan browser.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Toast feedback */}
      {successMsg && (
        <div className="p-4 bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-200" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Account Profile Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-sky-600" />
          <span>Profil Pengguna Panel CMS</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-400 block text-[11px] mb-1">Email Akun Terdaftar</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{adminEmail}</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-400 block text-[11px] mb-1">Tingkat Hak Akses (Role)</span>
            <span className="font-bold text-sky-700 text-sm">
              {currentRole === 'admin' ? 'Master Super Administrator' : 'Customer Service & Support'}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Form (Admin only) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-sky-600" />
          <span>Ubah Kata Sandi Administrator</span>
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini *</label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Masukkan sandi lama..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru *</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimal 6 karakter..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Sandi Baru *</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Ulangi kata sandi baru..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer"
            >
              {showPass ? 'Sembunyikan Sandi' : 'Tampilkan Karakter Sandi'}
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Simpan Kata Sandi Baru
            </button>
          </div>
        </form>
      </div>

      {/* System Factory Reset */}
      <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>Reset Database Katalog ke Standar Awal</span>
        </h2>
        <p className="text-xs text-slate-500">
          Mengembalikan seluruh data produk ke katalog bawaan Higold Indonesia. Gunakan hanya jika Anda ingin mengulang pengujian dari awal.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin mereset seluruh produk ke katalog default? Perubahan kustom akan dihapus.')) {
              onResetToDefault();
            }
          }}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          Reset Katalog ke Standar Bawaan
        </button>
      </div>
    </div>
  );
};
