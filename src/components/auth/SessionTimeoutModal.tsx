import React from 'react';
import { Clock, ShieldAlert, LogIn, X } from 'lucide-react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onSignInAgain: () => void;
  onDismiss: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  onSignInAgain,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={onDismiss} 
        className="fixed inset-0"
      />

      <div className="relative w-full max-w-md bg-[#131d38] border border-[#FCA311]/40 rounded-3xl shadow-2xl p-6 text-center z-10 animate-scaleUp">
        {/* Glow Header */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FCA311]/10 border border-[#FCA311]/30 text-[#FCA311] flex items-center justify-center mb-4 ring-8 ring-[#FCA311]/5">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#FCA311] uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Security Protocol Enforced</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          Session Expired (30m Inactivity)
        </h3>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          You have been inactive for more than <span className="text-zinc-200 font-semibold">30 minutes</span>. To safeguard your account, saved custom rigs, and order data, RigForge has automatically logged you out.
        </p>

        <div className="bg-[#16223f] rounded-2xl p-4 border border-[#26365a] text-left text-xs text-zinc-300 space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-zinc-400">Idle Duration:</span>
            <span className="font-mono text-[#FCA311] font-semibold">30 Minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Session Status:</span>
            <span className="font-mono text-red-400 font-semibold">Terminated</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Cart &amp; Draft Rig:</span>
            <span className="font-mono text-emerald-400 font-semibold">Locally Preserved</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={onSignInAgain}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#e5920a] text-black flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-[0.99] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In Again</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:bg-[#1e2d4f] transition-colors"
          >
            Continue Browsing as Guest
          </button>
        </div>

        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
