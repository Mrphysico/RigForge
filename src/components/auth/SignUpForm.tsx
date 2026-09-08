import React, { useState } from 'react';
import { User, Mail, Phone, Lock, AlertCircle, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onNotification?: (msg: string) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSwitchToSignIn,
  onNotification,
}) => {
  const { signup, socialLogin } = useAuthStore();
  // Zero hardcoded credentials - starts completely blank for each unique user
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please provide a valid email address (e.g. name@example.com).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    const res = await signup({
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim() || undefined,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (res.success) {
      const msg = res.message || 'Account created successfully. Please log in.';
      setSuccessMessage(msg);
      if (onNotification) {
        onNotification(msg);
      }
      // After successful registration, redirect them to Login
      setTimeout(() => {
        onSwitchToSignIn();
      }, 1500);
    } else {
      setError(res.error || 'Unable to create account. Please try again.');
    }
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setError(null);
    setSocialLoading(provider);
    const res = await socialLogin(provider);
    setSocialLoading(null);
    if (onNotification) {
      onNotification(res.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Social Registration Buttons */}
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
          or register with email
        </span>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <div>
            <div className="font-bold text-white">{successMessage}</div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">Redirecting you to Login...</div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 font-medium">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Rahul Sharma"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900 text-zinc-100 placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 font-medium">
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
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 font-medium">
            Phone Number <span className="text-zinc-500 text-[10px]">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900 text-zinc-100 placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 font-medium">
            Password <span className="text-red-400">*</span> <span className="text-zinc-500 text-[10px]">(min. 6 characters)</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
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

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 font-medium">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Re-enter password"
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-900 text-zinc-100 placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !!successMessage}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 flex items-center justify-center gap-2 shadow-glow-cyan transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switcher to Sign In */}
      <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-850">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 ml-1 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
