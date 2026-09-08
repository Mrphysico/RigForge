import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

interface AuthModalProps {
  onNotification?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNotification }) => {
  const { 
    authModalOpen, 
    authModalView, 
    closeAuthModal, 
    setAuthModalView,
    accountChooserOpen,
    closeAccountChooser,
  } = useAuthStore();

  return (
    <>
      {/* Google Account Chooser Modal (supports prompt='select_account') */}
      <GoogleAccountChooserModal
        isOpen={accountChooserOpen}
        onClose={closeAccountChooser}
        onSuccess={onNotification}
      />

      {/* Main Authentication Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          {/* Dimmed backdrop */}
          <div onClick={closeAuthModal} className="fixed inset-0" />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-[#111111] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            {/* Subtle Brand Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#FCA311] to-transparent" />

            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* View Switcher Tabs (Only shown on signin / signup) */}
            {authModalView !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0D0D0D] border border-[#262626] mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthModalView('signin')}
                  className={`py-2 rounded-lg transition-all ${
                    authModalView === 'signin'
                      ? 'bg-[#151515] text-[#FCA311] shadow-sm font-bold'
                      : 'text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalView('signup')}
                  className={`py-2 rounded-lg transition-all ${
                    authModalView === 'signup'
                      ? 'bg-[#151515] text-[#FCA311] shadow-sm font-bold'
                      : 'text-[#A0A0A0] hover:text-white'
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
            <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-center gap-2 text-[10px] font-mono text-[#A0A0A0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FCA311]" />
              <span>RigForge 256-bit TLS Encrypted &amp; Isolated Sessions</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
