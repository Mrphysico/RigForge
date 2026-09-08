import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Gamepad2, 
  Settings
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050a14]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      {/* Dimmed backdrop */}
      <div onClick={closeAuthModal} className="fixed inset-0" />

      {/* Main Split Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#08111f] border border-[#1e2d4f] rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#142244] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================= */}
        {/* LEFT COLUMN: CINEMATIC "BUILD YOUR LEGACY" (5 COLS) */}
        {/* ========================================================= */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-b from-[#050a14] via-[#08111f] to-[#0d172e] border-r border-[#1e2d4f] relative overflow-hidden">
          {/* Ambient Glow Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff1e2d]/15 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#0066ff]/15 blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff1e2d] to-[#b30012] flex items-center justify-center text-white font-mono font-black text-sm shadow-glow-red">
                R
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white font-mono">
                RIG<span className="text-[#ff1e2d]">FORGE</span>
              </span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-slate-400">
              GEAR | BUILD | PLAY | TOGETHER
            </div>
          </div>

          {/* Center Graphic & Title */}
          <div className="relative z-10 my-6 space-y-4">
            <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight leading-[1.05]">
              <span className="text-white block">BUILD</span>
              <span className="text-[#0066ff] block">YOUR</span>
              <span className="text-[#ffd000] block">LEGACY</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Join a growing community of gamers, creators and builders. Manage your rigs, connect with others and take your setup to the next level.
            </p>

            {/* Glowing Battle Rig Visual */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#1e2d4f] bg-[#050a14] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"
                alt="RigForge Battle Rig"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-transparent to-transparent opacity-80" />
            </div>

            {/* 4 Circular Feature Badges */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-[#ff1e2d] text-white flex items-center justify-center shadow-glow-red">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-slate-300 leading-tight">
                  MANAGE RIG
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-slate-300 leading-tight">
                  JOIN COMM.
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-[#0066ff] text-white flex items-center justify-center shadow-glow-blue">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-slate-300 leading-tight">
                  TRACK PROG.
                </span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-[#ffd000] text-slate-950 flex items-center justify-center shadow-glow-yellow">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-semibold text-slate-300 leading-tight">
                  EXPLORE
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Branding Tag */}
          <div className="relative z-10 pt-4 border-t border-[#1e2d4f] text-[10px] font-mono text-slate-400">
            —— MORE THAN A PLATFORM / A COMMUNITY
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: HIGH-CONTRAST AUTHENTICATION FORM (7 COLS) */}
        {/* ========================================================= */}
        <div className="md:col-span-7 p-6 sm:p-8 bg-[#0d172e] flex flex-col justify-between">
          <div>
            {/* Header Switcher */}
            {authModalView !== 'forgot' && (
              <div className="flex items-center justify-between pb-4 border-b border-[#1e2d4f] mb-6">
                <div>
                  <h3 className="text-xl font-black text-white font-mono">
                    {authModalView === 'signin' ? 'Welcome Back' : 'Create Your Account'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {authModalView === 'signin'
                      ? 'Sign in to continue to RigForge'
                      : 'Join the RigForge builder community'}
                  </p>
                </div>

                <div className="flex p-1 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAuthModalView('signin')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      authModalView === 'signin'
                        ? 'bg-[#0066ff] text-white shadow-glow-blue font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthModalView('signup')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      authModalView === 'signup'
                        ? 'bg-[#ff1e2d] text-white shadow-glow-red font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Forms */}
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

          {/* Security Guarantee Badge */}
          <div className="mt-6 pt-4 border-t border-[#1e2d4f] flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0066ff]" />
            <span>RigForge 256-bit TLS Encrypted &amp; Isolated Sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
