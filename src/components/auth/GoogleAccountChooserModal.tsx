import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { GoogleAuthProfile } from '../../services/auth/googleOAuth';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

// Default Google accounts pool for quick testing on shared devices
const PRESET_GOOGLE_ACCOUNTS: GoogleAuthProfile[] = [
  {
    sub: 'google-sub-alpha-90210',
    name: 'Arth Rakesh Jadav',
    email: 'jadavarth07@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
  },
  {
    sub: 'google-sub-beta-88412',
    name: 'Devraj Singhania',
    email: 'devraj.rigforge@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
  },
  {
    sub: 'google-sub-gamma-77123',
    name: 'Priya Sharma',
    email: 'priya.sharma.gaming@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
];

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle, user: currentUser } = useAuthStore();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [loadingSub, setLoadingSub] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = async (profile: GoogleAuthProfile) => {
    setErrorMessage(null);
    setLoadingSub(profile.sub);

    const result = await loginWithGoogle(profile);
    setLoadingSub(null);

    if (result.success) {
      onClose();
      if (onSuccess) onSuccess(result.message);
    } else {
      setErrorMessage(result.error || 'Google account authentication failed.');
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) {
      setErrorMessage('Please provide both name and a valid Google email.');
      return;
    }

    const cleanEmail = customEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email format.');
      return;
    }

    // Stable deterministic Google sub based on email
    let hash = 0;
    for (let i = 0; i < cleanEmail.length; i++) {
      hash = ((hash << 5) - hash) + cleanEmail.charCodeAt(i);
      hash |= 0;
    }
    const derivedSub = 'google-sub-' + Math.abs(hash).toString(36) + '-' + cleanEmail.split('@')[0];

    const profile: GoogleAuthProfile = {
      sub: derivedSub,
      name: customName.trim(),
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${derivedSub}`,
    };

    await handleSelectAccount(profile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div onClick={onClose} className="fixed inset-0" />

      <div className="relative w-full max-w-md bg-[#111111] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Subtle orange glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FCA311] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Choose an account</h2>
          <p className="text-xs text-[#A0A0A0] mt-0.5">
            to continue to <span className="font-semibold text-white">RigForge India</span>
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#151515] border border-[#262626] text-[10px] font-mono text-[#FCA311]">
            <ShieldCheck className="w-3 h-3 text-[#FCA311]" />
            <span>OAuth 2.0 • prompt=select_account</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Account List */}
        {!showCustomForm ? (
          <div className="space-y-2">
            {PRESET_GOOGLE_ACCOUNTS.map((acc) => {
              const isCurrentlyActive = currentUser?.email.toLowerCase() === acc.email.toLowerCase();
              const isLoading = loadingSub === acc.sub;

              return (
                <button
                  key={acc.sub}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  disabled={loadingSub !== null}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all active:scale-[0.99] ${
                    isCurrentlyActive
                      ? 'bg-[#151515] border-[#FCA311]/50 shadow-glow-orange'
                      : 'bg-[#0D0D0D] border-[#262626] hover:border-[#FCA311]/40 hover:bg-[#151515]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#262626] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                        <span>{acc.name}</span>
                        {isCurrentlyActive && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FCA311]/20 text-[#FCA311] font-mono font-normal">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#A0A0A0] font-mono truncate">{acc.email}</div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#FCA311]" />
                    ) : isCurrentlyActive ? (
                      <Check className="w-4 h-4 text-[#FCA311]" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Use Another Account Button */}
            <button
              type="button"
              onClick={() => setShowCustomForm(true)}
              className="w-full p-3 rounded-2xl border border-dashed border-[#262626] hover:border-[#FCA311]/50 bg-[#0D0D0D]/50 hover:bg-[#151515] text-left flex items-center gap-3 transition-all text-xs font-semibold text-zinc-300 hover:text-white mt-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#151515] border border-[#262626] flex items-center justify-center flex-shrink-0 text-[#FCA311]">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">Use another account</div>
                <div className="text-[11px] text-[#A0A0A0]">Sign in with a different Google account</div>
              </div>
            </button>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1.5">
                Google Full Name
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1.5">
                Google Email Address
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#262626] bg-[#151515] hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
              >
                Back to Accounts
              </button>
              <button
                type="submit"
                disabled={loadingSub !== null}
                className="flex-1 py-2.5 rounded-xl bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-orange transition-all"
              >
                {loadingSub ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Security Notice */}
        <div className="mt-6 pt-4 border-t border-[#262626] text-center text-[11px] text-[#A0A0A0]">
          To continue, Google will share your name, email address, and profile picture with RigForge.
        </div>
      </div>
    </div>
  );
};
