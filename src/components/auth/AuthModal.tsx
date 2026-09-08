import React from 'react';
import { X, ShieldCheck, Cpu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

interface AuthModalProps {
  onNotification?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNotification }) => {
  const { authModalOpen, authModalView, closeAuthModal, setAuthModalView } = useAuthStore();

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Dimmed backdrop */}
      <div 
        onClick={closeAuthModal} 
        className="fixed inset-0"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8">
        {/* Neon Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan mb-3">
            <Cpu className="w-7 h-7 text-zinc-950 stroke-[2.2]" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {authModalView === 'signin' ? 'Welcome Back to RigForge' : 'Join the RigForge Community'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            {authModalView === 'signin'
              ? 'Sign in to access saved builds, order telemetry, and GST invoicing.'
              : 'Create an account to configure custom rigs with automated email verification.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthModalView('signin')}
            className={`py-2 rounded-lg transition-all ${
              authModalView === 'signin'
                ? 'bg-zinc-800 text-cyan-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalView('signup')}
            className={`py-2 rounded-lg transition-all ${
              authModalView === 'signup'
                ? 'bg-zinc-800 text-cyan-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Dynamic Forms */}
        {authModalView === 'signin' ? (
          <SignInForm
            onSwitchToSignUp={() => setAuthModalView('signup')}
            onNotification={onNotification}
          />
        ) : (
          <SignUpForm
            onSwitchToSignIn={() => setAuthModalView('signin')}
            onNotification={onNotification}
          />
        )}

        {/* Security badge footer */}
        <div className="mt-6 pt-4 border-t border-zinc-850 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>256-Bit Encrypted Credentials Storage</span>
        </div>
      </div>
    </div>
  );
};
