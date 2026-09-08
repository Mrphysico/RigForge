import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onForgotPassword?: () => void;
  onNotification?: (msg: string) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSwitchToSignUp,
  onForgotPassword,
  onNotification,
}) => {
  const { login, startGoogleLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(cleanEmail, password);
    setLoading(false);

    if (result.success) {
      if (onNotification) onNotification('Logged in successfully! Welcome back.');
    } else {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleGoogleClick = async () => {
    setError(null);
    setGoogleLoading(true);
    const result = await startGoogleLogin();
    setGoogleLoading(false);

    if (result.success) {
      if (onNotification) onNotification('Logged in successfully with Google!');
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1 font-medium">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#050a14] text-white placeholder-slate-500 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#0066ff] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1 font-medium">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#050a14] text-white placeholder-slate-500 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#0066ff] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[#1e2d4f] bg-[#050a14] text-[#0066ff] focus:ring-0"
            />
            <span>Remember me</span>
          </label>

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#0066ff] hover:underline cursor-pointer transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Primary Action Button (Blue / Red) */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#0066ff] hover:bg-[#0052cc] text-white flex items-center justify-center gap-2 shadow-glow-blue transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1e2d4f]" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
          <span className="bg-[#0d172e] px-3 text-slate-400">OR CONTINUE WITH</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* Real Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading || googleLoading}
          className="col-span-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#050a14] hover:bg-[#142244] border border-[#1e2d4f] hover:border-slate-400 text-white text-xs font-semibold transition-all disabled:opacity-50"
          title="Sign in with your Google Account"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#0066ff]" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
          )}
          <span className="hidden sm:inline">Google</span>
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => onNotification?.('GitHub authentication coming soon.')}
          className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#050a14] hover:bg-[#142244] border border-[#1e2d4f] hover:border-slate-400 text-white text-xs font-semibold transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </button>

        {/* Discord Button */}
        <button
          type="button"
          onClick={() => onNotification?.('Discord authentication coming soon.')}
          className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#050a14] hover:bg-[#142244] border border-[#1e2d4f] hover:border-slate-400 text-white text-xs font-semibold transition-all"
        >
          <span className="text-[#5865F2] font-bold text-sm">#</span>
          <span className="hidden sm:inline">Discord</span>
        </button>
      </div>

      {/* Switcher link */}
      <div className="text-center text-xs text-slate-400 pt-1">
        New here?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-[#0066ff] hover:underline font-bold ml-1 cursor-pointer"
        >
          Create an account &gt;
        </button>
      </div>

      {/* Terms */}
      <div className="text-[10px] text-slate-400 text-center pt-2 leading-relaxed">
        By signing in, you agree to our{' '}
        <span className="text-slate-300 hover:underline cursor-pointer">Terms of Service</span> and{' '}
        <span className="text-slate-300 hover:underline cursor-pointer">Privacy Policy</span>.
      </div>
    </div>
  );
};
