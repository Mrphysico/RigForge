import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  BarChart3, 
  Gamepad2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  User
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface SignInPageProps {
  onNavigate: (page: 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support' | 'signin') => void;
  onNotification?: (msg: string) => void;
  initialMode?: 'signin' | 'signup';
}

export const SignInPage: React.FC<SignInPageProps> = ({ 
  onNavigate, 
  onNotification,
  initialMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, signup, startGoogleLogin } = useAuthStore();

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

    if (mode === 'signup') {
      const cleanName = name.trim();
      if (!cleanName) {
        setError('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      const result = await signup({
        name: cleanName,
        email: cleanEmail,
        password,
        confirmPassword,
      });
      setLoading(false);

      if (result.success) {
        onNotification?.('Account created successfully! Welcome to RigForge.');
        onNavigate('home');
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } else {
      setLoading(true);
      const result = await login(cleanEmail, password);
      setLoading(false);

      if (result.success) {
        onNotification?.('Logged in successfully! Welcome back.');
        onNavigate('home');
      } else {
        setError(result.error || 'Invalid email or password.');
      }
    }
  };

  const handleGoogleClick = async () => {
    setError(null);
    setGoogleLoading(true);
    const result = await startGoogleLogin();
    setGoogleLoading(false);

    if (result.success) {
      onNotification?.('Logged in successfully with Google!');
      onNavigate('home');
    } else if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-10 select-none">
      
      {/* ========================================================= */}
      {/* DIAGONAL 4-COLOR TRI-SPLIT BACKGROUND (PAGE 2 SPECIFICATION) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        
        {/* Red Diagonal Band */}
        <div 
          className="absolute inset-0 bg-[#e2231a]" 
          style={{ clipPath: 'polygon(0% 0%, 28% 0%, 8% 100%, 0% 100%)' }}
        />

        {/* White Diagonal Band */}
        <div 
          className="absolute inset-0 bg-[#ffffff]" 
          style={{ clipPath: 'polygon(28% 0%, 52% 0%, 32% 100%, 8% 100%)' }}
        />

        {/* Blue Diagonal Band */}
        <div 
          className="absolute inset-0 bg-[#1c3f8f]" 
          style={{ clipPath: 'polygon(52% 0%, 77% 0%, 57% 100%, 32% 100%)' }}
        />

        {/* Yellow Diagonal Band */}
        <div 
          className="absolute inset-0 bg-[#f2b705]" 
          style={{ clipPath: 'polygon(77% 0%, 100% 0%, 80% 100%, 57% 100%)' }}
        />

        {/* Far Right Corner Blue */}
        <div 
          className="absolute inset-0 bg-[#0d2352]" 
          style={{ clipPath: 'polygon(100% 45%, 100% 100%, 80% 100%)' }}
        />

        {/* Left Edge Giant Faint Watermark "RIGFORGE" */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-white/[0.04] font-barlow font-black text-8xl sm:text-9xl tracking-widest uppercase pointer-events-none">
          RIGFORGE
        </div>
      </div>

      {/* ========================================================= */}
      {/* CORNER LABELS ON BACKGROUND (SECTION 5.1) */}
      {/* ========================================================= */}
      {/* Top-Left: RIGFORGE — */}
      <div 
        onClick={() => onNavigate('home')} 
        className="absolute top-6 left-8 text-xs font-mono font-bold tracking-[0.25em] text-white/80 cursor-pointer flex items-center gap-2 hover:text-white transition-colors z-20"
      >
        <span>RIGFORGE</span>
        <span className="w-6 h-[1.5px] bg-[#e2231a]" />
      </div>

      {/* Top-Right: BUILD PLAY CONNECT — */}
      <div className="absolute top-6 right-8 text-xs font-mono font-bold tracking-[0.25em] text-white/80 flex items-center gap-2 pointer-events-none z-20 hidden lg:flex">
        <span>BUILD PLAY CONNECT</span>
        <span className="w-6 h-[1.5px] bg-[#f2b705]" />
      </div>

      {/* Bottom-Left: NEXT GEN GAMING — */}
      <div className="absolute bottom-6 left-8 text-xs font-mono font-bold tracking-[0.25em] text-white/80 flex items-center gap-2 pointer-events-none z-20 hidden lg:flex">
        <span>NEXT GEN GAMING</span>
        <span className="w-6 h-[1.5px] bg-[#e2231a]" />
      </div>

      {/* Bottom-Right: POWERED BY COMMUNITY — */}
      <div className="absolute bottom-6 right-8 text-xs font-mono font-bold tracking-[0.25em] text-white/80 flex items-center gap-2 pointer-events-none z-20 hidden lg:flex">
        <span>POWERED BY COMMUNITY</span>
        <span className="w-6 h-[1.5px] bg-[#1c3f8f]" />
      </div>

      {/* ========================================================= */}
      {/* CENTERED AUTH CARD (SECTION 5.2) */}
      {/* ========================================================= */}
      <div className="auth-card relative w-full max-w-5xl rounded-[24px] sm:rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden z-10 flex flex-col md:flex-row border border-white/10 bg-[#0a0a0a] min-h-[520px] lg:min-h-[620px]">
        
        {/* Back to Home Button on mobile */}
        <button
          onClick={() => onNavigate('home')}
          className="absolute top-4 left-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 md:hidden transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Back to Home"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* ========================================================= */}
        {/* LEFT PANEL: DARK CYBER DISPLAY (~48% WIDTH) */}
        {/* ========================================================= */}
        <div className="auth-card__left w-full md:w-[48%] flex flex-col justify-between p-6 sm:p-8 md:p-10 bg-[#0a0a0a] text-white relative overflow-hidden flex-shrink-0">
          
          {/* RGB PC Tower Background Artwork Bleeding in from right edge */}
          <div 
            className="absolute top-0 right-0 w-[55%] h-full bg-no-repeat bg-cover bg-right-bottom pointer-events-none z-0 opacity-90"
            style={{
              backgroundImage: `url('/images/login-pc-tower.jpg')`
            }}
          />
          {/* Subtle left-to-right gradient so typography remains razor-sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none z-0" />

          {/* Top Logo Lockup & Eyebrow */}
          <div className="relative z-10 space-y-1">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-lg bg-[#e2231a] flex items-center justify-center font-barlow font-black text-white text-xl shadow-[0_0_12px_rgba(226,35,26,0.6)]">
                R
              </div>
              <span className="font-barlow font-black text-2xl tracking-wider uppercase italic text-white group-hover:text-[#e2231a] transition-colors">
                RIG<span className="text-[#e2231a]">FORGE</span>
              </span>
            </div>
            <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 font-semibold uppercase pt-1">
              GEAR | BUILD | PLAY | TOGETHER
            </div>
          </div>

          {/* Headline Stacked 3 Lines: BUILD (white) / YOUR (blue) / LEGACY (yellow) */}
          <div className="relative z-10 my-3 sm:my-4 space-y-2.5 sm:space-y-3.5 max-w-sm">
            <div className="font-barlow font-black tracking-tight leading-[0.88] uppercase text-3xl sm:text-5xl lg:text-6xl">
              <span className="text-[#ffffff] block">BUILD</span>
              <span className="text-[#1c3f8f] block drop-shadow-[0_0_12px_rgba(28,63,143,0.8)]">YOUR</span>
              <span className="text-[#f2b705] block drop-shadow-[0_0_12px_rgba(242,183,5,0.6)]">LEGACY</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Join a growing community of gamers, creators and builders. Manage your rigs, connect with others and take your setup to the next level.
            </p>

            {/* Row of 4 Icon + Label Mini-Features (Hidden on mobile <640px to prevent vertical bloat) */}
            <div className="hidden sm:grid grid-cols-4 gap-2 pt-3 text-center">
              {/* 1. Red gear icon */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e2231a] text-white flex items-center justify-center shadow-[0_0_15px_rgba(226,35,26,0.5)]">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-barlow font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  MANAGE<br />YOUR RIG
                </span>
              </div>

              {/* 2. White people icon */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-barlow font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  JOIN<br />COMMUNITY
                </span>
              </div>

              {/* 3. Blue bar-chart icon */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1c3f8f] text-white flex items-center justify-center shadow-[0_0_15px_rgba(28,63,143,0.6)]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-barlow font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  TRACK<br />PROGRESS
                </span>
              </div>

              {/* 4. Yellow controller icon */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f2b705] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(242,183,5,0.6)]">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-barlow font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  EXPLORE<br />MORE
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Tagline with short rule */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[10px] font-mono tracking-wider text-slate-400 uppercase hidden sm:block">
            <div className="w-8 h-[1.5px] bg-slate-500 mb-2" />
            <span>MORE THAN A PLATFORM / A COMMUNITY</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: LIGHT FORM CONTAINER (~52% WIDTH) */}
        {/* ========================================================= */}
        <div className="auth-card__right w-full md:w-[52%] bg-[#ffffff] text-slate-900 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top-Right Toggle Link */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {mode === 'signin'
                    ? 'Sign in to continue to RigForge'
                    : 'Join the RigForge community of builders'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-xs font-semibold text-[#1c3f8f] hover:underline flex items-center gap-1 transition-colors"
              >
                {mode === 'signin' ? (
                  <>
                    <span>New here? <strong>Create an account →</strong></span>
                  </>
                ) : (
                  <>
                    <span>Already have an account? <strong>Sign in →</strong></span>
                  </>
                )}
              </button>
            </div>

            {/* Tab Toggle: Sign In (solid blue pill) vs Create Account (outline pill) */}
            <div className="relative grid grid-cols-2 p-1 rounded-full bg-slate-100 mb-6 text-xs font-semibold select-none">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-2 rounded-full transition-all duration-200 z-10 font-bold ${
                  mode === 'signin'
                    ? 'bg-[#1c3f8f] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 rounded-full transition-all duration-200 z-10 font-bold ${
                  mode === 'signup'
                    ? 'bg-[#1c3f8f] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name field (in signup mode) */}
              {mode === 'signup' && (
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1c3f8f] focus:ring-1 focus:ring-[#1c3f8f] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email input */}
              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1c3f8f] focus:ring-1 focus:ring-[#1c3f8f] transition-all"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1c3f8f] focus:ring-1 focus:ring-[#1c3f8f] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (in signup mode) */}
              {mode === 'signup' && (
                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1c3f8f] focus:ring-1 focus:ring-[#1c3f8f] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#1c3f8f] focus:ring-[#1c3f8f]"
                  />
                  <span>Remember me</span>
                </label>

                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => onNotification?.('Password reset instructions sent to your email if registered.')}
                    className="text-[#1c3f8f] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Primary Action Button: Sign In → / Create Account → */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#1c3f8f] hover:bg-[#14306e] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider: OR CONTINUE WITH */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-semibold">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* 3 Social Buttons: full width stacked on mobile, 3-col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading || googleLoading}
                className="flex items-center justify-center gap-2 py-3 sm:py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50 min-h-[44px]"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#1c3f8f]" />
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
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
          </div>

          {/* Footer Microcopy */}
          <div className="text-[11px] text-slate-500 text-center pt-4 leading-relaxed">
            By signing in, you agree to our{' '}
            <span 
              onClick={() => onNotification?.('RigForge Terms: Standard fair use and customer protection policies apply.')}
              className="text-[#1c3f8f] hover:underline cursor-pointer font-medium"
            >
              Terms of Service
            </span> and{' '}
            <span 
              onClick={() => onNotification?.('RigForge Privacy Policy: Encrypted authentication and zero data sharing guaranteed.')}
              className="text-[#1c3f8f] hover:underline cursor-pointer font-medium"
            >
              Privacy Policy
            </span>.
          </div>
        </div>

      </div>
    </div>
  );
};
