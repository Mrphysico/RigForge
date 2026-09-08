import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalProps {
  onNotification?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNotification }) => {
  const { 
    authModalOpen, 
    authModalView, 
    closeAuthModal, 
    setAuthModalView,
  } = useAuthStore();

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b1329]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Dimmed backdrop */}
      <div onClick={closeAuthModal} className="fixed inset-0" />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#16223f] border border-[#26365a] rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Subtle Brand Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FCA311] to-transparent" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e2d4f] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View Switcher Tabs (Only shown on signin / signup) */}
        {authModalView !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#131d38] border border-[#26365a] mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthModalView('signin')}
              className={`py-2.5 rounded-xl transition-all ${
                authModalView === 'signin'
                  ? 'bg-[#1e2d4f] text-[#FCA311] shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthModalView('signup')}
              className={`py-2.5 rounded-xl transition-all ${
                authModalView === 'signup'
                  ? 'bg-[#1e2d4f] text-[#FCA311] shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Dynamic Forms */}
        {authModalView === 'signin' && (
          <SignInForm
            onSwitchToSignUp={() => setAuthModalView('signup')}
            onForgotPassword={() => setAuthModalView('forgot')}
            onNotification={onNotification}
          />
        )}

        {authModalView === 'signup' && (
          <SignUpForm
            onSwitchToSignIn={() => setAuthModalView('signin')}
            onNotification={onNotification}
          />
        )}

        {authModalView === 'forgot' && (
          <ForgotPasswordModal
            onBackToSignIn={() => setAuthModalView('signin')}
            onNotification={onNotification}
          />
        )}

        {/* Security Guarantee Badge */}
        <div className="mt-6 pt-4 border-t border-[#26365a] flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FCA311]" />
          <span>RigForge 256-bit TLS Encrypted &amp; Isolated Sessions</span>
        </div>
      </div>
    </div>
  );
};
