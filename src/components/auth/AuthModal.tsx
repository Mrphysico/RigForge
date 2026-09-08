import React from 'react';
import { 
  X, 
  Users, 
  BarChart3, 
  Gamepad2, 
  Cpu
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface AuthModalProps {
  onNotification?: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNotification }) => {
  const { 
    authModalOpen, 
    authModalView, 
    closeAuthModal, 
    setAuthModalView,
  } = useAuthStore();

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Deep Frosted Blur Backdrop with Atmospheric Neon Glows */}
      <div 
        onClick={closeAuthModal} 
        className="fixed inset-0 bg-[#07090E]/85 backdrop-blur-xl overflow-hidden pointer-events-auto"
      >
        {/* Angled dynamic color stripes matching reference */}
        <div className="absolute inset-0 pointer-events-none opacity-40 sm:opacity-50">
          {/* Left Red Angle */}
          <div className="absolute -top-40 -left-40 w-[55%] h-[150%] bg-gradient-to-br from-[#FF1F29] to-[#990011] transform -rotate-12 blur-2xl" />
          {/* Center White Stripe */}
          <div className="absolute -top-40 left-[28%] w-[18%] h-[150%] bg-white/20 transform -rotate-12 blur-xl" />
          {/* Blue Angle */}
          <div className="absolute -top-40 left-[45%] w-[25%] h-[150%] bg-[#0284C7]/40 transform -rotate-12 blur-2xl" />
          {/* Right Yellow Angle */}
          <div className="absolute -top-40 right-[-10%] w-[38%] h-[150%] bg-[#F59E0B]/30 transform -rotate-12 blur-2xl" />
        </div>

        {/* Slanted Typography Corner Tags */}
        <div className="absolute top-6 left-8 text-xs font-mono font-bold tracking-widest text-white/70 hidden lg:block">
          RIGFORGE ——
        </div>
        <div className="absolute top-6 right-8 text-xs font-mono font-bold tracking-widest text-white/70 hidden lg:block">
          BUILD PLAY CONNECT ——
        </div>
        <div className="absolute bottom-6 left-8 text-xs font-mono font-bold tracking-widest text-white/70 hidden lg:block">
          NEXT GEN GAMING ——
        </div>
        <div className="absolute bottom-6 right-8 text-xs font-mono font-bold tracking-widest text-white/70 hidden lg:block">
          POWERED BY COMMUNITY
        </div>
      </div>

      {/* Main Split Modal Card */}
      <div className="relative w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 max-h-[94vh] border border-white/10">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 z-30 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================= */}
        {/* LEFT COLUMN: DARK CYBER/GAMING DISPLAY (6 COLS) */}
        {/* ========================================================= */}
        <div className="hidden md:flex md:col-span-6 flex-col justify-between p-8 sm:p-10 bg-gradient-to-b from-[#0E121C] via-[#07090E] to-[#040810] text-white relative overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FF1F29]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#0284C7]/20 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-teko italic font-bold text-3xl tracking-wider uppercase">
                RIG<span className="text-[#FF1F29]">FORGE</span>
              </span>
            </div>
            <div className="text-[11px] font-mono tracking-[0.18em] text-slate-400 font-semibold uppercase">
              RIGFORGE | GEAR · BUILD · PLAY · TOGETHER
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 my-4 space-y-4">
            <div className="font-teko font-black tracking-tight leading-[0.9] uppercase text-6xl lg:text-7xl">
              <span className="text-white block">BUILD</span>
              <span className="text-[#0284C7] block">YOUR</span>
              <span className="text-[#FACC15] block">LEGACY</span>
            </div>

            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Join a growing community of gamers, creators, and PC builders. Manage your rigs, connect with others, and take your setup to the next level.
            </p>

            {/* Glowing Custom PC Rig Showcase */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#07090E] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80"
                alt="RigForge Battle Rig"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 right-3 text-sm font-black font-teko italic text-[#FF1F29] bg-[#07090E]/80 px-2 py-0.5 rounded-lg border border-[#FF1F29]/30">
                R
              </div>
            </div>

            {/* Icon Row: MANAGE RIG, JOIN TEAM, TRACK RIG, EXPLORE */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#FF1F29] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,31,41,0.5)]">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-teko font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  MANAGE<br />RIG
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-teko font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  JOIN<br />TEAM
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-[0_0_15px_rgba(2,132,199,0.5)]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-teko font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  TRACK<br />RIG
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#FACC15] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-teko font-bold tracking-wider text-slate-300 leading-tight uppercase">
                  EXPLORE
                </span>
              </div>
            </div>
          </div>

          {/* Lower text */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            — MORE THAN A PLATFORM • A COMMUNITY
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CRISP WHITE CARD (6 COLS) */}
        {/* ========================================================= */}
        <div className="md:col-span-6 bg-white text-slate-900 p-8 sm:p-10 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Switcher Link */}
            {authModalView !== 'forgot' && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {authModalView === 'signin' ? 'Welcome Back' : 'Create Your Account'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {authModalView === 'signin'
                      ? 'Sign in to continue to RigForge'
                      : 'Join the RigForge builder community'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAuthModalView(authModalView === 'signin' ? 'signup' : 'signin')}
                  className="text-xs font-semibold text-[#0284C7] hover:underline flex items-center gap-1 transition-colors"
                >
                  {authModalView === 'signin' ? 'New here? Create an account →' : 'Already have an account? Sign in →'}
                </button>
              </div>
            )}

            {/* Pill Tabs Switcher (matching reference image) */}
            {authModalView !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 mb-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthModalView('signin')}
                  className={`py-2 rounded-lg transition-all ${
                    authModalView === 'signin'
                      ? 'bg-[#0066ff] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModalView('signup')}
                  className={`py-2 rounded-lg transition-all ${
                    authModalView === 'signup'
                      ? 'bg-[#0066ff] text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Dynamic Active Form */}
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
          </div>
        </div>
      </div>
    </div>
  );
};
