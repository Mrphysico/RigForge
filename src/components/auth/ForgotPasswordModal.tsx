import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ForgotPasswordModalProps {
  onBackToSignIn: () => void;
  onNotification?: (msg: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onBackToSignIn,
  onNotification,
}) => {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    const result = await forgotPassword(cleanEmail);
    setLoading(false);

    setStatusMessage(result.message);
    if (onNotification) {
      onNotification(result.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="w-10 h-10 mx-auto rounded-xl bg-[#151515] border border-[#262626] text-[#FCA311] flex items-center justify-center mb-2 shadow-glow-orange">
          <KeyRound className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Reset Account Password
        </h3>
        <p className="text-xs text-[#A0A0A0]">
          Enter your registered email address and we will dispatch password reset instructions.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {statusMessage ? (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-3 text-center animate-fadeIn">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="leading-relaxed">{statusMessage}</p>
          <button
            type="button"
            onClick={onBackToSignIn}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#151515] hover:bg-zinc-800 text-white border border-[#262626] transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1.5 font-medium">
              Registered Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311]"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToSignIn}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-[#A0A0A0] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
