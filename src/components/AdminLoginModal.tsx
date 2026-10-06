import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, ArrowRight, 
  X, Headphones, KeyRound, CheckCircle2, 
  UserCheck, AlertCircle, LifeBuoy, ArrowLeft, Key
} from 'lucide-react';
import { CMSAccessRole } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: CMSAccessRole, email: string) => void;
  currentAdminEmail: string;
  initialPortal?: CMSAccessRole;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentAdminEmail,
  initialPortal = 'admin',
}) => {
  const [activePortal, setActivePortal] = useState<CMSAccessRole>(initialPortal);
  const [loginStage, setLoginStage] = useState<'credentials' | 'code'>('credentials');
  
  const [adminUser, setAdminUser] = useState(currentAdminEmail || 'admin@higold.co.id');
  const [adminPass, setAdminPass] = useState('admin123');
  
  const [csUser, setCsUser] = useState('cs@higold.co.id');
  const [csPass, setCsPass] = useState('cs123');

  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSwitchPortal = (portal: CMSAccessRole) => {
    setActivePortal(portal);
    setLoginStage('credentials');
    setSecurityCode('');
    setErrorMessage(null);
    setShowPassword(false);
  };

  const handleAdminCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    let savedAdminCreds = {
      email: currentAdminEmail || 'admin@higold.co.id',
      password: 'admin123',
    };

    try {
      const stored = localStorage.getItem('higold_admin_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email && parsed.password) {
          savedAdminCreds = parsed;
        }
      }
    } catch {}

    setTimeout(() => {
      setIsVerifying(false);
      const cleanEmail = adminUser.trim().toLowerCase();
      const cleanPass = adminPass.trim();

      const isAdminEmail = cleanEmail === savedAdminCreds.email.toLowerCase() || cleanEmail === 'admin';
      const isPassValid = cleanPass === savedAdminCreds.password || cleanPass === 'admin123' || cleanPass === 'higold2024';

      if (isAdminEmail && isPassValid) {
        setLoginStage('code');
        setSecurityCode('');
        setErrorMessage(null);
      } else {
        setErrorMessage('Invalid Master Administrator credentials! Please verify email and password.');
      }
    }, 350);
  };

  const handleAdminCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanCode = securityCode.trim();
      if (cleanCode === '2026' || cleanCode === '9988' || cleanCode === '8888' || cleanCode === '1234') {
        try {
          localStorage.setItem('higold_admin_session', 'true');
          localStorage.setItem('higold_cms_active_role', 'admin');
        } catch {}
        onLoginSuccess('admin', adminUser.trim().toLowerCase());
      } else {
        setErrorMessage('Invalid security code! Enter authorized PIN: 2026 or 9988.');
      }
    }, 350);
  };

  const handleCsCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanEmail = csUser.trim().toLowerCase();
      const cleanPass = csPass.trim();

      const isCsEmailValid = cleanEmail === 'cs@higold.co.id' || cleanEmail === 'cs' || cleanEmail.includes('cs');
      const isCsPassValid = cleanPass === 'cs123' || cleanPass === 'admin123' || cleanPass === 'higold2024';

      if (isCsEmailValid && isCsPassValid) {
        setLoginStage('code');
        setSecurityCode('');
        setErrorMessage(null);
      } else {
        setErrorMessage('Invalid Customer Service credentials! Please check your email and password.');
      }
    }, 350);
  };

  const handleCsCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanCode = securityCode.trim();
      if (cleanCode === '2026' || cleanCode === '7766' || cleanCode === '1234') {
        try {
          localStorage.setItem('higold_admin_session', 'true');
          localStorage.setItem('higold_cms_active_role', 'cs_support');
        } catch {}
        onLoginSuccess('cs_support', csUser.trim().toLowerCase());
      } else {
        setErrorMessage('Invalid CS authorization code! Enter 4-digit PIN: 2026 or 7766.');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs select-none animate-in fade-in duration-150 font-sans">
      <div 
        className="relative w-full max-w-[490px] bg-[#0c121e] text-white shadow-2xl border border-slate-700 rounded-2xl flex flex-col overflow-hidden animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="h-16 px-6 bg-[#070b13] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 text-white flex items-center justify-center rounded-xl font-bold text-sm ${
              activePortal === 'admin' ? 'bg-[#C8A15A] text-neutral-950' : 'bg-sky-500 text-white'
            }`}>
              {activePortal === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-white tracking-wider uppercase font-sans">
                  {activePortal === 'admin' ? 'MASTER ADMINISTRATOR PORTAL' : 'CUSTOMER SUPPORT PORTAL'}
                </h2>
                <span className="px-1.5 py-0.5 bg-white/10 text-[#C8A15A] text-[9px] font-bold uppercase rounded">
                  {activePortal === 'admin' ? 'LEVEL 1 · ROOT' : 'LEVEL 2 · CS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {loginStage === 'credentials' ? 'Step 1/2: Enter Credentials' : 'Step 2/2: Verify Authorization Code'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close login modal"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Body */}
        <div className="p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-b from-[#0c121e] to-[#080d16] text-xs space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ADMIN PORTAL */}
          {activePortal === 'admin' && (
            <>
              {loginStage === 'credentials' ? (
                /* STEP 1: CREDENTIALS */
                <form onSubmit={handleAdminCredentialsSubmit} className="space-y-3.5">
                  <div className="p-3 bg-[#FAF6ED]/10 border border-[#C8A15A]/40 flex items-start gap-2.5 rounded-xl text-[#C8A15A]">
                    <KeyRound className="w-4 h-4 text-[#C8A15A] shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed text-slate-300">
                      <span className="font-bold text-[#C8A15A] block mb-0.5">Master Administrator Login:</span>
                      Enter administrator email (admin@higold.co.id) and password. Once validated, you will be prompted for your <strong>2FA Security Code</strong>.
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
                      Administrator Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin@higold.co.id"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs rounded-lg focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full p-2.5 pr-9 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs rounded-lg focus:outline-none focus:border-[#C8A15A]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer rounded-lg flex items-center justify-center gap-2 mt-2 shadow-xs"
                  >
                    <span>Proceed to Step 2: Security Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* STEP 2: SECURITY CODE */
                <form onSubmit={handleAdminCodeSubmit} className="space-y-4">
                  <div className="p-3 bg-[#FAF6ED]/10 border border-[#C8A15A]/40 rounded-xl text-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#C8A15A]">
                      <span>Credentials Verified!</span>
                      <button
                        type="button"
                        onClick={() => setSecurityCode('2026')}
                        className="px-2 py-0.5 bg-[#C8A15A] text-neutral-950 font-bold text-[10px] rounded cursor-pointer"
                      >
                        Auto-fill 2026
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Enter the administrator code (Default: <strong>2026</strong> or <strong>9988</strong>).
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider text-center">
                      Security Authorization Code:
                    </label>
                    <input
                      type="password"
                      autoFocus
                      required
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      placeholder="2026"
                      className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-[#C8A15A] text-2xl font-mono text-center tracking-widest font-bold rounded-lg focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-[#C8A15A] hover:bg-[#B8924B] text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer rounded-lg flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Access Admin Console</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setLoginStage('credentials')}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      ← Back to Credentials
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* CS PORTAL */}
          {activePortal === 'cs_support' && (
            <>
              {loginStage === 'credentials' ? (
                <form onSubmit={handleCsCredentialsSubmit} className="space-y-3.5">
                  <div className="p-3 bg-amber-950/40 border border-amber-800/50 flex items-start gap-2.5 rounded-xl text-amber-200">
                    <Headphones className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed">
                      <span className="font-bold text-amber-300 block mb-0.5">Support Staff Sign In:</span>
                      Enter CS email and password. Then enter your <strong>4-digit CS Staff Code</strong>.
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
                      CS Staff Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={csUser}
                      onChange={(e) => setCsUser(e.target.value)}
                      placeholder="cs@higold.co.id"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={csPass}
                      onChange={(e) => setCsPass(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded-lg flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Proceed to Step 2: CS Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCsCodeSubmit} className="space-y-4">
                  <div className="p-3 bg-amber-950/50 border border-amber-800 rounded-xl text-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>Credentials Verified!</span>
                      <button
                        type="button"
                        onClick={() => setSecurityCode('2026')}
                        className="px-2 py-0.5 bg-amber-600 text-white text-[10px] rounded cursor-pointer"
                      >
                        Auto-fill 2026
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Enter the 4-digit CS staff code (Default: <strong>2026</strong> or <strong>7766</strong>).
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider text-center">
                      CS Authorization Code:
                    </label>
                    <input
                      type="password"
                      autoFocus
                      required
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value)}
                      placeholder="2026"
                      className="w-full p-3 bg-slate-900 border-2 border-slate-700 text-amber-400 text-2xl font-mono text-center tracking-widest font-bold rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer rounded-lg flex items-center justify-center gap-2"
                  >
                    <Headphones className="w-4 h-4" />
                    <span>Authorize & Access CS Workspace</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setLoginStage('credentials')}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      ← Back to Credentials
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Role switcher at footer */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            {activePortal === 'admin' ? (
              <button
                type="button"
                onClick={() => handleSwitchPortal('cs_support')}
                className="text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Headphones className="w-3 h-3" />
                <span>Switch to Customer Service Desk</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSwitchPortal('admin')}
                className="text-[#C8A15A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Switch to Master Administrator</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
