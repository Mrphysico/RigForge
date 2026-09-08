import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Box, 
  ShoppingCart, 
  BookOpen, 
  ChevronRight
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockHardware';
import { ProductCard } from '../components/products/ProductCard';

interface HomePageProps {
  onNavigate: (page: 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support' | 'signin', category?: string) => void;
  onNotification?: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNotification }) => {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 pb-20 space-y-12 select-none">
      
      {/* ========================================================= */}
      {/* 4.2 HERO SECTION — DIAGONAL 4-COLOR CANVAS & BATTLESTATION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-[#0a0a0a] min-h-[760px] lg:min-h-[880px] flex flex-col justify-between pt-10 pb-4">
        
        {/* Full-bleed background split into diagonal red / gray-white / blue / yellow bands */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
          
          {/* Red Band (Left) - angled at ~17deg */}
          <div 
            className="absolute inset-0 bg-[#e2231a]" 
            style={{ clipPath: 'polygon(0% 0%, 25% 0%, 12% 100%, 0% 100%)' }}
          >
            <div 
              className="w-full h-full bg-cover bg-left-top opacity-55 mix-blend-luminosity"
              style={{ backgroundImage: `url('/images/hero-soldier-left.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/60" />
          </div>

          {/* Gray / White Ruins Band */}
          <div 
            className="absolute inset-0 bg-[#2b2d35]" 
            style={{ clipPath: 'polygon(25% 0%, 34% 0%, 21% 100%, 12% 100%)' }}
          >
            <div 
              className="w-full h-full bg-cover bg-center opacity-45 mix-blend-luminosity grayscale"
              style={{ backgroundImage: `url('/images/hero-city-ruins.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
          </div>

          {/* Blue Band */}
          <div 
            className="absolute inset-0 bg-[#1c3f8f]" 
            style={{ clipPath: 'polygon(34% 0%, 68% 0%, 55% 100%, 21% 100%)' }}
          >
            <div className="w-full h-full bg-gradient-to-b from-[#1c3f8f] via-[#0f2557] to-[#0a0a0a] opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60" />
          </div>

          {/* Yellow / Amber Parachute Band */}
          <div 
            className="absolute inset-0 bg-[#f2b705]" 
            style={{ clipPath: 'polygon(68% 0%, 92% 0%, 79% 100%, 55% 100%)' }}
          >
            <div 
              className="w-full h-full bg-cover bg-right-top opacity-55 mix-blend-multiply"
              style={{ backgroundImage: `url('/images/hero-parachute-drop.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-transparent to-black/60" />
          </div>

          {/* Far Right Dark Skyline Band */}
          <div 
            className="absolute inset-0 bg-[#0a0a0a]" 
            style={{ clipPath: 'polygon(92% 0%, 100% 0%, 100% 100%, 79% 100%)' }}
          >
            <div className="w-full h-full bg-gradient-to-l from-black via-[#0d162c] to-transparent" />
          </div>

          {/* Authentic High-Res Reference Artwork Overlay Blend */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-lighten bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('/images/media_home.jpg')` }}
          />
        </div>

        {/* ========================================================= */}
        {/* DECORATIVE FRAMING TEXT (LEFT & RIGHT EDGES) */}
        {/* ========================================================= */}
        {/* Left Band Vertical Stacked Copy: PLAY, BUILD, CONNECT (with red underline) */}
        <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex flex-col items-start gap-1 z-20 pointer-events-none">
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            PLAY
          </span>
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            BUILD
          </span>
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            CONNECT
          </span>
          <div className="w-8 h-[2.5px] bg-[#e2231a] mt-1.5" />
        </div>

        {/* Right Band Vertical Stacked Copy: BUILD, STREAM, GAME, REPEAT (with blue underline) */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1 z-20 pointer-events-none">
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            BUILD
          </span>
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            STREAM
          </span>
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            GAME
          </span>
          <span className="font-barlow font-bold text-xs sm:text-sm tracking-[0.25em] text-white uppercase leading-tight">
            REPEAT
          </span>
          <div className="w-8 h-[2.5px] bg-[#1c3f8f] mt-1.5" />
        </div>

        {/* Right Band Floating Eyebrow: MORE THAN GAMING (with yellow underline) */}
        <div className="absolute top-20 right-16 sm:right-32 lg:right-48 flex flex-col items-start z-20 pointer-events-none hidden md:flex">
          <span className="font-barlow font-bold text-xs tracking-[0.25em] text-white uppercase leading-tight">
            MORE
          </span>
          <span className="font-barlow font-bold text-xs tracking-[0.25em] text-white uppercase leading-tight">
            THAN
          </span>
          <span className="font-barlow font-bold text-xs tracking-[0.25em] text-white uppercase leading-tight">
            GAMING
          </span>
          <div className="w-7 h-[2px] bg-[#f2b705] mt-1" />
        </div>

        {/* ========================================================= */}
        {/* CENTER HERO CONTENT: EYEBROW, TITLE, SUBHEAD, BODY, CTAS */}
        {/* ========================================================= */}
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 pt-4 space-y-4">
          
          {/* 1. Small Eyebrow Line */}
          <div className="text-xs sm:text-[13px] font-mono font-bold tracking-[0.3em] text-white/90 uppercase">
            GEAR &nbsp;|&nbsp; BUILD &nbsp;|&nbsp; PLAY &nbsp;|&nbsp; TOGETHER
          </div>

          {/* 2. Giant Logo Lockup: RIGFORGE (RIG white, FORGE red) */}
          <h1 className="font-barlow font-black text-7xl sm:text-8xl md:text-9xl uppercase italic tracking-tighter leading-none text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]">
            RIG<span className="text-[#e2231a]">FORGE</span>
          </h1>

          {/* 3. Subheading Line: POWER YOUR PASSION */}
          <div className="font-barlow font-bold uppercase tracking-wider text-2xl sm:text-3xl md:text-4xl text-white">
            POWER YOUR PASSION
          </div>

          {/* 4. Body Paragraph */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-[500px] mx-auto leading-relaxed font-sans">
            A community-driven platform for gamers, creators, and PC builders. Share builds, get support, explore gear, and take your setup to the next level.
          </p>

          {/* 5. Two CTA Buttons Side by Side */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {/* Primary Red CTA: Get Started → */}
            <button
              onClick={() => onNavigate('signin')}
              className="rounded-full px-8 py-3 bg-[#e2231a] hover:bg-[#b71c17] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(226,35,26,0.6)] hover:shadow-[0_0_35px_rgba(226,35,26,0.8)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Dark Outlined CTA: Explore Builds */}
            <button
              onClick={() => onNavigate('builds')}
              className="rounded-full px-8 py-3 bg-black/60 hover:bg-white hover:text-black text-white font-semibold text-sm border border-white/30 hover:border-white transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <span>Explore Builds</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. GAMING DESK SETUP HERO STAGE (OVERLAPPING COLOR BANDS) */}
        {/* ========================================================= */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-6 sm:pt-8 flex justify-center">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
            <img
              src="/images/hero-desk-setup.jpg"
              alt="RigForge Custom Battlestation Desk Setup"
              className="w-full h-auto object-cover rounded-2xl border border-white/10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 4.3 FEATURE STRIP (BLACK BACKGROUND, 4 COLUMNS) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Red circle icon: Join Community */}
          <div
            onClick={() => onNavigate('community')}
            className="group p-5 rounded-2xl bg-[#0f1117] hover:bg-[#151922] border border-white/[0.08] hover:border-[#e2231a]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#e2231a] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(226,35,26,0.4)] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#e2231a] transition-colors">
                Join Community
              </h3>
              <p className="text-xs text-slate-400">Connect with gamers &amp; builders</p>
            </div>
          </div>

          {/* 2. White/outline circle icon: Share Your Build */}
          <div
            onClick={() => onNavigate('builds')}
            className="group p-5 rounded-2xl bg-[#0f1117] hover:bg-[#151922] border border-white/[0.08] hover:border-white/30 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-slate-200 transition-colors">
                Share Your Build
              </h3>
              <p className="text-xs text-slate-400">Showcase your setup</p>
            </div>
          </div>

          {/* 3. Blue circle icon: Explore Gear */}
          <div
            onClick={() => onNavigate('marketplace')}
            className="group p-5 rounded-2xl bg-[#0f1117] hover:bg-[#151922] border border-white/[0.08] hover:border-[#1c3f8f]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#1c3f8f] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(28,63,143,0.4)] group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#3b82f6] transition-colors">
                Explore Gear
              </h3>
              <p className="text-xs text-slate-400">Find the best components</p>
            </div>
          </div>

          {/* 4. Yellow circle icon: Learn & Grow */}
          <div
            onClick={() => onNavigate('guides')}
            className="group p-5 rounded-2xl bg-[#0f1117] hover:bg-[#151922] border border-white/[0.08] hover:border-[#f2b705]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#f2b705] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(242,183,5,0.4)] group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#f2b705] transition-colors">
                Learn &amp; Grow
              </h3>
              <p className="text-xs text-slate-400">Guides, tips and support</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4.4 THREE FEATURED CARDS (BOTTOM ROW, EQUAL-WIDTH) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Red Card — FEATURED BUILDS / INSANE SETUPS */}
          <div
            onClick={() => onNavigate('builds')}
            className="group relative rounded-2xl overflow-hidden border border-[#e2231a]/40 hover:border-[#e2231a] cursor-pointer shadow-xl transition-all duration-300 min-h-[220px] bg-cover bg-center flex flex-col justify-between p-6 sm:p-7 hover:scale-[1.025]"
            style={{ backgroundImage: `url('/images/card-pc-build-red.jpg')` }}
          >
            {/* Dark gradient overlay bottom-to-top */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 group-hover:bg-black/60 transition-colors duration-400" />

            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-mono tracking-widest font-bold text-[#e2231a] uppercase">
                FEATURED BUILDS
              </span>
              <h3 className="font-barlow text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                INSANE<br />SETUPS
              </h3>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4">
              <div className="w-9 h-9 rounded-full bg-[#e2231a] text-white flex items-center justify-center shadow-[0_0_15px_rgba(226,35,26,0.6)] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Gray/Blue Card — COMMUNITY / REAL PEOPLE */}
          <div
            onClick={() => onNavigate('community')}
            className="group relative rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 cursor-pointer shadow-xl transition-all duration-300 min-h-[220px] bg-cover bg-center flex flex-col justify-between p-6 sm:p-7 hover:scale-[1.025]"
            style={{ backgroundImage: `url('/images/card-community-soldier.jpg')` }}
          >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 group-hover:bg-black/60 transition-colors duration-400" />

            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-mono tracking-widest font-bold text-slate-300 uppercase">
                COMMUNITY
              </span>
              <h3 className="font-barlow text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                REAL PEOPLE
              </h3>
              <p className="text-xs text-slate-300 font-sans pt-1">
                Real Builds. Real Stories.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4">
              <div className="w-9 h-9 rounded-full bg-slate-900/90 border border-white/20 text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Yellow Card — GUIDES / LEVEL UP YOUR KNOWLEDGE */}
          <div
            onClick={() => onNavigate('guides')}
            className="group relative rounded-2xl overflow-hidden border border-[#f2b705]/40 hover:border-[#f2b705] cursor-pointer shadow-xl transition-all duration-300 min-h-[220px] bg-cover bg-center flex flex-col justify-between p-6 sm:p-7 hover:scale-[1.025]"
            style={{ backgroundImage: `url('/images/card-guides-soldier-gun.jpg')` }}
          >
            {/* Warm yellow gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-[#f2b705]/20 group-hover:bg-black/60 transition-colors duration-400" />

            <div className="relative z-10 space-y-1">
              <span className="text-[11px] font-mono tracking-widest font-bold text-[#f2b705] uppercase">
                GUIDES
              </span>
              <h3 className="font-barlow text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                LEVEL UP<br />YOUR KNOWLEDGE
              </h3>
              <p className="text-xs text-slate-300 font-sans pt-1">
                Build Smarter. Game Better.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4">
              <div className="w-9 h-9 rounded-full bg-slate-900/90 border border-[#f2b705]/40 text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* MARKETPLACE HARDWARE SHOWCASE */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono font-bold text-[#e2231a] uppercase tracking-wider">HOT DEALS</span>
            <h2 className="font-barlow text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              FEATURED HARDWARE
            </h2>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#e2231a] hover:text-white transition-colors cursor-pointer"
          >
            <span>View All Components</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNotification={onNotification}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
