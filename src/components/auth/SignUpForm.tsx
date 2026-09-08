import React, { useState } from 'react';
import { User, Mail, Phone, Lock, AlertCircle, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, Cpu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onNotification?: (msg: string) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSwitchToSignIn,
  onNotification,
}) => {
  const { signup, openAccountChooser } = useAuthStore();
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
      setError('Password must be at least 6 characters long.');
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
      const msg = 'Account created successfully. Please sign in.';
      setSuccessMessage(msg);
      if (onNotification) {
        onNotification(msg);
      }
      // Redirect to Login tab after brief feedback
      setTimeout(() => {
        onSwitchToSignIn();
      }, 1400);
    } else {
      setError(res.error || 'Unable to create account. Please try again.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#262626] flex items-center justify-center shadow-glow-orange mb-3">
          <Cpu className="w-6 h-6 text-[#FCA311]" />
        </div>
        <div className="text-xl font-black tracking-wider text-white font-mono uppercase">
          RIG<span className="text-[#FCA311]">FORGE</span>
        </div>
        <p className="text-xs text-[#A0A0A0] mt-1">
          Create your personal account to configure, price, and save battle rigs.
        </p>
      </div>

      {/* Google Sign-in Trigger */}
      <div>
        <button
          type="button"
          onClick={openAccountChooser}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-[#262626] bg-[#0D0D0D] hover:bg-[#151515] hover:border-[#FCA311]/40 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 group"
        >
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
          <span className="group-hover:text-[#FCA311] transition-colors">Sign up with Google</span>
        </button>
      </div>

      {/* Or Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#262626] w-full" />
        <span className="bg-[#111111] px-3 text-[10px] font-mono text-[#A0A0A0] uppercase tracking-wider">
          or sign up with email
        </span>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-medium">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Your full name"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-medium">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-medium">
            Phone Number <span className="text-zinc-500">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-medium">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Min 6 chars"
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-medium">
              Confirm <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Repeat password"
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#0D0D0D] text-white placeholder-zinc-500 rounded-xl border border-[#262626] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </span>
          ) : (
            <>
              <span>Create RigForge Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switcher to Sign In */}
      <div className="text-center text-xs text-[#A0A0A0] pt-3 border-t border-[#262626]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-[#FCA311] hover:underline font-bold ml-1 cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
