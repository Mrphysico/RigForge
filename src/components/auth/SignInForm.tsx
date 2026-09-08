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
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Form matching media_1788864996598.png */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
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
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-colors"
            />
          </div>
        </div>

        <div>
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
              className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-[#0066ff] focus:ring-[#0066ff]"
            />
            <span>Remember me</span>
          </label>

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#0066ff] hover:underline font-semibold cursor-pointer transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Action Button: Full-width vibrant blue button: "Sign In →" */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#0284C7] hover:bg-[#0369A1] flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2"
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
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
          <span className="bg-white px-3 text-slate-400 font-semibold">OR CONTINUE WITH</span>
        </div>
      </div>

      {/* Social Buttons: responsive 1 col mobile, 3 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {/* Real Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading || googleLoading}
          className="flex items-center justify-center gap-2 py-3 sm:py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50 min-h-[44px]"
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
          <span>Google</span>
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => onNotification?.('GitHub authentication coming soon.')}
          className="flex items-center justify-center gap-1.5 py-3 sm:py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all min-h-[44px]"
        >
          <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>

        {/* Discord Button */}
        <button
          type="button"
          onClick={() => onNotification?.('Discord authentication coming soon.')}
          className="flex items-center justify-center gap-1.5 py-3 sm:py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all min-h-[44px]"
        >
          <span className="text-[#5865F2] font-black text-sm">#</span>
          <span>Discord</span>
        </button>
      </div>

      {/* Switch to Sign Up */}
      <div className="text-xs text-center text-slate-500 pt-1">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-[#0066ff] hover:underline font-bold"
        >
          Create an account
        </button>
      </div>

      {/* Terms */}
      <div className="text-[11px] text-slate-500 text-center pt-2 leading-relaxed">
        By signing in, you agree to our{' '}
        <span className="text-[#0066ff] hover:underline cursor-pointer font-medium">Terms of Service</span> and{' '}
        <span className="text-[#0066ff] hover:underline cursor-pointer font-medium">Privacy Policy</span>.
      </div>
    </div>
  );
};
