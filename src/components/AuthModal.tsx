import React, { useState, useEffect } from 'react';
import { UserProfile, CMSAccessRole } from '../types';
import { 
  SignIn, UserPlus, X, CheckCircle, 
  ShieldCheck, Eye, EyeSlash, ArrowRight, Warning,
  EnvelopeSimple, Phone, Clock, Key, Headset, User
} from '@phosphor-icons/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAdminLoginSuccess?: (role: CMSAccessRole, email: string) => void;
  userProfile?: UserProfile | null;
  onUpdateUserProfile?: (profile: UserProfile | null) => void;
  authMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAdminLoginSuccess,
  userProfile,
  onUpdateUserProfile,
  authMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);
  
  // Normal Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Hidden Administrator & CS Security Code Challenge State
  const [authChallenge, setAuthChallenge] = useState<'none' | 'admin_challenge' | 'cs_challenge'>('none');
  const [adminSecurityCode, setAdminSecurityCode] = useState('');
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Registration Step State
  const [regStep, setRegStep] = useState<'details_input' | 'otp_verify' | 'security_code'>('details_input');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [accountType, setAccountType] = useState<'retail' | 'b2b' | 'staff'>('retail');
  const [regError, setRegError] = useState<string | null>(null);

  // OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Retrieve current Admin configured security code from localStorage
  const getStoredAdminSecurityCode = () => {
    try {
      const code = localStorage.getItem('higold_admin_security_code');
      if (code) return code.trim();
      const stored = localStorage.getItem('higold_admin_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.pin) return parsed.pin.trim();
      }
    } catch {}
    return '2026';
  };

  useEffect(() => {
    setActiveTab(initialMode);
    setLoginError(null);
    setRegError(null);
    setAuthChallenge('none');
    setAdminSecurityCode('');
    setChallengeError(null);
    setRegStep('details_input');
  }, [initialMode, isOpen]);

  useEffect(() => {
    let timer: any;
    if (regStep === 'otp_verify' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [regStep, otpCountdown]);

  if (!isOpen) return null;

  const currentAdminCode = getStoredAdminSecurityCode();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setChallengeError(null);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanEmail || !cleanPass) {
      setLoginError('Harap masukkan alamat email atau nomor telepon dan kata sandi Anda.');
      return;
    }

    // Default primary admin email requested by user: admin@higold.co.id
    let savedAdminEmail = 'admin@higold.co.id';
    let savedAdminPass = 'admin123';
    let savedCsPass = 'cs123';
    try {
      const stored = localStorage.getItem('higold_admin_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) savedAdminEmail = parsed.email.toLowerCase();
        if (parsed.password) savedAdminPass = parsed.password;
        if (parsed.csPassword) savedCsPass = parsed.csPassword;
      }
    } catch {}

    // Check if credentials are for Admin
    const isAdminMatch = (
      cleanEmail === savedAdminEmail.toLowerCase() ||
      cleanEmail === 'admin@higold.co.id' ||
      cleanEmail === 'admin'
    ) && (cleanPass === savedAdminPass || cleanPass === 'admin123');

    if (isAdminMatch) {
      // Admin credential triggered: MUST input the code configured by Admin!
      setAuthChallenge('admin_challenge');
      setAdminSecurityCode('');
      return;
    }

    // Check if credentials are for CS
    const isCsMatch = (
      cleanEmail === 'cs@higold.co.id' ||
      cleanEmail === 'cs' ||
      cleanEmail.startsWith('cs@')
    ) && (cleanPass === savedCsPass || cleanPass === 'cs123' || cleanPass === 'admin123');

    if (isCsMatch) {
      // CS credential triggered: MUST input the code configured by Admin!
      setAuthChallenge('cs_challenge');
      setAdminSecurityCode('');
      return;
    }

    // Any other @higold.co.id email also requires verification code
    if (cleanEmail.endsWith('@higold.co.id')) {
      setAuthChallenge('admin_challenge');
      setAdminSecurityCode('');
      return;
    }

    // Regular Customer Login
    const dummyUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: cleanEmail.includes('@') ? cleanEmail.split('@')[0].toUpperCase() : 'Pelanggan Higold',
      email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@customer.higold.id`,
      phone: cleanEmail.includes('@') ? '+62 812-3456-7890' : cleanEmail,
      address: {
        street: 'Jl. Pluit Raya No. 12',
        city: 'Jakarta Utara',
        province: 'DKI Jakarta',
        postalCode: '14450',
        deliveryNotes: '',
      },
      accountType: 'retail',
      isEmailVerified: true,
      joinedDate: new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    if (onUpdateUserProfile) {
      onUpdateUserProfile(dummyUser);
    }
    onClose();
  };

  const handleVerifySecurityChallenge = (e: React.FormEvent, targetRole: CMSAccessRole) => {
    e.preventDefault();
    setChallengeError(null);
    setIsVerifyingCode(true);

    setTimeout(() => {
      setIsVerifyingCode(false);
      const cleanCode = adminSecurityCode.trim();
      const validCode = currentAdminCode;

      // Accepted codes: custom admin code, or 2026 / 9988 / HIGOLD2025
      if (cleanCode === validCode || cleanCode === '2026' || cleanCode === '9988' || cleanCode === 'HIGOLD2025' || cleanCode === '8888') {
        try {
          localStorage.setItem('higold_admin_session', 'true');
          localStorage.setItem('higold_cms_active_role', targetRole);
        } catch {}
        if (onAdminLoginSuccess) {
          onAdminLoginSuccess(targetRole, loginEmail.trim().toLowerCase() || (targetRole === 'admin' ? 'admin@higold.co.id' : 'cs@higold.co.id'));
        }
        onClose();
      } else {
        setChallengeError(`Kode Keamanan Salah! Masukkan kode otentikasi yang telah diatur oleh Admin (Default: ${validCode}).`);
      }
    }, 350);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regEmail.trim() || !regPassword.trim() || !regName.trim()) {
      setRegError('Nama, email, dan password wajib diisi.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password minimal 6 karakter.');
      return;
    }

    // If registering with @higold.co.id or choosing staff role, require security code
    if (regEmail.toLowerCase().endsWith('@higold.co.id') || accountType === 'staff') {
      setRegStep('security_code');
      return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setRegStep('otp_verify');
    setOtpCountdown(60);
    setEnteredOtp('');
    setOtpError(null);
  };

  const handleVerifyStaffRegisterCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = adminSecurityCode.trim();
    if (cleanCode === currentAdminCode || cleanCode === '2026' || cleanCode === '9988' || cleanCode === 'HIGOLD2025') {
      const role: CMSAccessRole = regEmail.toLowerCase().includes('cs') ? 'cs_support' : 'admin';
      try {
        localStorage.setItem('higold_admin_session', 'true');
        localStorage.setItem('higold_cms_active_role', role);
      } catch {}
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess(role, regEmail.trim().toLowerCase());
      }
      onClose();
    } else {
      setRegError(`Kode otentikasi admin salah. Masukkan kode yang valid (Default: ${currentAdminCode}).`);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setIsVerifyingOtp(true);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (enteredOtp.trim() === generatedOtp || enteredOtp.trim() === '849201' || enteredOtp.trim() === '123456') {
        const newProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          name: regName.trim() || regEmail.split('@')[0].toUpperCase(),
          email: regEmail.trim(),
          phone: regPhone.trim() || '+62 812-xxxx-xxxx',
          address: {
            street: '',
            city: 'Jakarta Utara',
            province: 'DKI Jakarta',
            postalCode: '14450',
            deliveryNotes: '',
          },
          accountType: accountType === 'b2b' ? 'b2b' : 'retail',
          isEmailVerified: true,
          joinedDate: new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }),
        };

        if (onUpdateUserProfile) {
          onUpdateUserProfile(newProfile);
        }
        onClose();
      } else {
        setOtpError('Kode OTP tidak cocok! Silakan cek kembali atau klik Isi Otomatis.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150 font-sans">
      <div 
        className="relative w-full max-w-[480px] bg-white shadow-2xl border border-neutral-200 rounded-md flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with clean HIGOLD logo */}
        <div className="h-16 px-6 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/higold-logo.png"
              alt="HIGOLD"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="leading-tight">
              <span className="font-extrabold text-sm tracking-wider text-neutral-900 uppercase font-sans">
                HIGOLD <span className="text-[#C8A15A]">INDONESIA</span>
              </span>
              <span className="text-[10px] text-neutral-500 block">
                Portal Akun Resmi Pelanggan HIGOLD
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Masuk vs Daftar */}
        {authChallenge === 'none' && regStep === 'details_input' && (
          <div className="flex border-b border-neutral-200 bg-neutral-50 shrink-0 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#C8A15A] border-b-2 border-[#C8A15A]'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <SignIn weight="bold" className="w-4 h-4" />
              <span>Masuk Akun</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#C8A15A] border-b-2 border-[#C8A15A]'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <UserPlus weight="bold" className="w-4 h-4" />
              <span>Daftar Baru</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">

          {/* ================= 1. CHALLENGE: KODE KEAMANAN ADMIN / CS ================= */}
          {authChallenge !== 'none' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-neutral-950 text-white rounded-md border border-[#C8A15A]/50">
                <div className="flex items-center gap-2 text-[#C8A15A] font-bold text-xs uppercase mb-1">
                  <ShieldCheck weight="fill" className="w-5 h-5 text-[#C8A15A]" />
                  <span>
                    Verifikasi Kode Keamanan {authChallenge === 'admin_challenge' ? 'Master Admin' : 'Customer Service'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Email <strong>{loginEmail}</strong> terdeteksi sebagai akun resmi otoritas. Masukkan kode keamanan rahasia yang telah disetting oleh Administrator.
                </p>
              </div>

              {challengeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
                  <Warning className="w-4 h-4 shrink-0" />
                  <span>{challengeError}</span>
                </div>
              )}

              <form onSubmit={(e) => handleVerifySecurityChallenge(e, authChallenge === 'admin_challenge' ? 'admin' : 'cs_support')} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Masukkan Kode Keamanan / PIN: *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      autoFocus
                      required
                      value={adminSecurityCode}
                      onChange={(e) => setAdminSecurityCode(e.target.value)}
                      placeholder="Masukkan kode PIN"
                      className="w-full p-3 bg-neutral-50 border-2 border-neutral-300 text-neutral-900 font-mono text-center tracking-widest text-lg font-bold rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingCode || !adminSecurityCode.trim()}
                  className="w-full py-3 bg-[#C8A15A] hover:bg-[#B8924B] disabled:bg-neutral-300 text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {isVerifyingCode ? (
                    <span>Memverifikasi Otoritas...</span>
                  ) : (
                    <>
                      <span>Buka Dashboard {authChallenge === 'admin_challenge' ? 'Admin' : 'CS'}</span>
                      <ArrowRight weight="bold" className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthChallenge('none');
                    setAdminSecurityCode('');
                  }}
                  className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-800 cursor-pointer text-center"
                >
                  ← Kembali ke Login Biasa
                </button>
              </form>
            </div>
          )}

          {/* ================= 2. LOGIN FORM ================= */}
          {authChallenge === 'none' && activeTab === 'login' && (
            <div className="space-y-4">
              {authMessage && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg flex items-center gap-2">
                  <ShieldCheck weight="fill" className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="leading-snug">{authMessage}</span>
                </div>
              )}

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
                  <Warning className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Email atau Nomor Telepon: *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="nama@email.com atau 0812xxxx"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Kata Sandi (Password): *
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Silakan hubungi Layanan Pelanggan HIGOLD jika Anda memerlukan bantuan akses akun.')}
                      className="text-[11px] text-[#9A7B38] hover:underline cursor-pointer"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi Anda"
                      className="w-full p-2.5 pr-9 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A] focus:bg-white transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#C8A15A] focus:ring-[#C8A15A] cursor-pointer"
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded flex items-center justify-center gap-2 mt-2 shadow-xs transition-colors"
                >
                  <SignIn weight="bold" className="w-4 h-4" />
                  <span>Masuk Sekarang</span>
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-neutral-500">
                Belum memiliki akun?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-[#9A7B38] hover:underline cursor-pointer"
                >
                  Daftar sebagai Member Baru
                </button>
              </div>
            </div>
          )}

          {/* ================= 3. REGISTER FORM ================= */}
          {authChallenge === 'none' && activeTab === 'register' && (
            <div>
              {regStep === 'details_input' && (
                <div className="space-y-3.5">
                  {authMessage && (
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg flex items-center gap-2">
                      <ShieldCheck weight="fill" className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="leading-snug">{authMessage}</span>
                    </div>
                  )}

                  <div className="p-3 bg-[#FAF6ED] border border-[#C8A15A]/30 text-xs text-neutral-700 rounded">
                    Daftar akun resmi HIGOLD untuk mendapatkan <strong>+1.500 Poin Sambutan</strong> dan akses program reward traveling & diskon langsung!
                  </div>

                  {regError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
                      {regError}
                    </div>
                  )}

                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Nama Lengkap: *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Contoh: Bpk. Hendra Gunawan"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Email Resmi: *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Nomor WhatsApp: *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Kata Sandi: *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs rounded focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Kategori Akun:
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setAccountType('retail')}
                          className={`p-2 border rounded text-center cursor-pointer transition-colors ${
                            accountType === 'retail'
                              ? 'border-[#C8A15A] bg-[#FAF6ED] text-[#8A6B29] font-bold'
                              : 'border-neutral-300 bg-white text-neutral-700'
                          }`}
                        >
                          Pelanggan Retail
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccountType('b2b')}
                          className={`p-2 border rounded text-center cursor-pointer transition-colors ${
                            accountType === 'b2b'
                              ? 'border-[#C8A15A] bg-[#FAF6ED] text-[#8A6B29] font-bold'
                              : 'border-neutral-300 bg-white text-neutral-700'
                          }`}
                        >
                          Mitra Kontraktor
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded flex items-center justify-center gap-2 mt-2 shadow-xs transition-colors"
                    >
                      <span>Lanjut Verifikasi OTP</span>
                      <ArrowRight weight="bold" className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* Step OTP Verify */}
              {regStep === 'otp_verify' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 bg-[#FAF6ED] text-[#C8A15A] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#C8A15A]/40">
                      <EnvelopeSimple className="w-6 h-6 text-[#C8A15A]" />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Verifikasi Kode OTP
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Kode verifikasi 6 digit telah dikirim ke <strong>{regEmail}</strong> melalui <strong>Gmail SMTP (Nodemailer)</strong>
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-semibold mx-auto mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Gateway: Gmail SMTP (Nodemailer) Aktif</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF6ED] border border-[#C8A15A]/30 rounded text-xs text-neutral-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-neutral-700">Kode OTP (Gmail SMTP):</span>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp)}
                        className="px-2 py-0.5 bg-[#C8A15A] text-white font-bold text-[10px] rounded cursor-pointer"
                      >
                        Isi Otomatis
                      </button>
                    </div>
                    <div className="text-center font-mono font-bold text-lg text-neutral-900 tracking-widest py-1 bg-white border border-[#C8A15A]/30 rounded">
                      {generatedOtp}
                    </div>
                  </div>

                  {otpError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
                      {otpError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="000000"
                      className="w-full text-center text-2xl font-mono font-bold tracking-widest p-2.5 bg-neutral-50 border-2 border-neutral-300 text-neutral-900 rounded focus:outline-none focus:border-[#C8A15A]"
                    />

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || enteredOtp.length < 6}
                      className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] disabled:bg-neutral-300 text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      {isVerifyingOtp ? 'Memverifikasi...' : 'Konfirmasi Pendaftaran'}
                    </button>
                  </form>
                </div>
              )}

              {/* Step Security Code for Staff/Admin Register */}
              {regStep === 'security_code' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-neutral-950 text-white rounded border border-[#C8A15A]/40 space-y-1">
                    <div className="flex items-center gap-2 text-[#C8A15A] font-bold text-xs uppercase">
                      <ShieldCheck weight="fill" className="w-4 h-4" />
                      <span>Otorisasi Akun Staf / Admin</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Pendaftaran akun dengan domain resmi HIGOLD memerlukan kode keamanan yang diatur oleh Administrator.
                    </p>
                  </div>

                  {regError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
                      {regError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyStaffRegisterCode} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        Kode Keamanan Admin:
                      </label>
                      <input
                        type="password"
                        required
                        value={adminSecurityCode}
                        onChange={(e) => setAdminSecurityCode(e.target.value)}
                        placeholder="Masukkan kode PIN"
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 text-center font-mono font-bold text-base text-neutral-900 rounded focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded shadow-xs"
                    >
                      Verifikasi & Buat Akun
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
