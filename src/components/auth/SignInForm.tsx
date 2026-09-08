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
  const { login, socialLogin } = useAuthStore();
  // Zero hardcoded credentials - each user must supply their own email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

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

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setError(null);
    setSocialLoading(provider);
    const res = await socialLogin(provider);
    setSocialLoading(null);
    if (onNotification) onNotification(res.message);
  };

  return (
    <div className="space-y-5">
      {/* Social Login Buttons */}
      <div className="space-y-2.5">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocial('google')}
          disabled={socialLoading !== null || loading}
          className="w-full py-2.5 px-4 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
        >
          {socialLoading === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
          )}
          <span>Continue with Google</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleSocial('facebook')}
          disabled={socialLoading !== null || loading}
          className="w-full py-2.5 px-4 rounded-xl border border-[#1877F2]/40 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] hover:text-white font-medium text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {socialLoading === 'facebook' ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#1877F2]" />
          ) : (
            <svg className="w-4 h-4 flex-shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>Continue with Facebook</span>
        </button>
      </div>

      {/* Or Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-zinc-800 w-full" />
        <span className="bg-zinc-950 px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          or sign in with credentials
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900 text-zinc-100 placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">
              Password <span className="text-red-400">*</span>
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-900 text-zinc-100 placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 flex items-center justify-center gap-2 shadow-glow-cyan transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In to RigForge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switcher to Sign Up */}
      <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-850">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 ml-1 cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};
