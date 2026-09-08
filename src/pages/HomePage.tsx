import React from 'react';
import { 
  ArrowRight, 
  Users, 
  Box, 
  ShoppingCart, 
  BookOpen, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_PRODUCTS } from '../data/mockHardware';
import { ProductCard } from '../components/products/ProductCard';

interface HomePageProps {
  onNavigate: (page: 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support', category?: string) => void;
  onNotification: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNotification }) => {
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-20 space-y-12 select-none">
      {/* ========================================================= */}
      {/* HERO SECTION — TRICOLOR DIAGONAL SLASH CANVAS & BATTLESTATION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#07090E] min-h-[640px] lg:min-h-[720px] flex items-center">
        {/* Tricolor Diagonal Slash Canvas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
          {/* Subtle Ambient Radial Neon Glows */}
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#FF1F29]/15 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-96 bg-[#0284C7]/15 blur-[140px] rounded-full" />
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#F59E0B]/15 blur-[120px] rounded-full" />

          {/* Left Slash (Red Band): Angled at +14deg with tactical soldier duotone silhouette */}
          <div 
            className="absolute -top-32 -left-20 w-[42vw] min-w-[340px] h-[150%] bg-gradient-to-r from-[#FF1F29]/25 via-[#FF1F29]/10 to-transparent border-r border-[#FF1F29]/30"
            style={{ transform: 'rotate(14deg)', transformOrigin: 'top left' }}
          >
            {/* Tactical Soldier Duotone Texture */}
            <div className="absolute inset-0 opacity-25 mix-blend-screen bg-no-repeat bg-contain bg-left-bottom"
              style={{
                backgroundImage: `radial-gradient(ellipse at 30% 50%, rgba(255, 31, 41, 0.4) 0%, transparent 70%)`
              }}
            />
            {/* Stylized tactical soldier silhouette overlay */}
            <svg className="absolute bottom-16 left-12 w-64 h-80 opacity-20 text-[#FF1F29]" viewBox="0 0 100 120" fill="currentColor">
              <path d="M50 10 C45 10 40 15 40 22 C40 26 42 29 45 31 C35 34 25 45 25 60 L25 90 L35 90 L35 115 L65 115 L65 90 L75 90 L75 60 C75 45 65 34 55 31 C58 29 60 26 60 22 C60 15 55 10 50 10 Z" />
              <circle cx="50" cy="20" r="8" fill="#FF1F29" />
              <polygon points="45,45 55,45 60,65 40,65" fill="#ffffff" opacity="0.3" />
            </svg>
          </div>

          {/* Center Slice: Ruined battlefield / gothic warzone city skyline silhouette fading into deep slate/black */}
          <div className="absolute bottom-0 left-0 right-0 h-48 opacity-25">
            <svg className="w-full h-full text-slate-800" viewBox="0 0 1200 200" preserveAspectRatio="none" fill="currentColor">
              <polygon points="0,200 0,160 30,160 35,110 45,110 50,140 80,140 90,80 100,80 105,130 140,130 160,50 170,50 175,120 220,120 240,90 260,90 280,150 320,150 340,70 350,70 360,110 400,110 430,40 440,40 450,130 490,130 520,80 540,80 560,140 620,140 650,60 660,60 670,120 720,120 750,90 770,90 800,160 850,160 880,50 890,50 900,130 950,130 980,70 1000,70 1030,140 1100,140 1140,80 1160,80 1200,160 1200,200" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/80 to-transparent" />
          </div>

          {/* Right Slash (Yellow/Gold Band): Angled at -14deg with airdrop supply crate & parachute */}
          <div 
            className="absolute -top-32 -right-20 w-[40vw] min-w-[320px] h-[150%] bg-gradient-to-l from-[#F59E0B]/25 via-[#FACC15]/10 to-transparent border-l border-[#F59E0B]/30"
            style={{ transform: 'rotate(-14deg)', transformOrigin: 'top right' }}
          >
            {/* Airdrop Supply Crate with Parachute Amber Duotone */}
            <div className="absolute top-36 right-20 opacity-30 text-[#FACC15]">
              <svg className="w-40 h-52" viewBox="0 0 100 130" fill="currentColor">
                {/* Parachute canopy */}
                <path d="M10 45 C10 15 90 15 90 45 C80 45 75 35 65 35 C55 35 50 45 40 45 C30 45 25 35 15 35 C12 35 10 45 10 45 Z" fill="#FACC15" />
                {/* Parachute suspension lines */}
                <line x1="15" y1="45" x2="40" y2="90" stroke="#FACC15" strokeWidth="1.5" />
                <line x1="38" y1="45" x2="45" y2="90" stroke="#FACC15" strokeWidth="1.5" />
                <line x1="62" y1="45" x2="55" y2="90" stroke="#FACC15" strokeWidth="1.5" />
                <line x1="85" y1="45" x2="60" y2="90" stroke="#FACC15" strokeWidth="1.5" />
                {/* Supply Crate */}
                <rect x="35" y="90" width="30" height="30" rx="3" fill="#D97706" stroke="#FACC15" strokeWidth="2" />
                <line x1="35" y1="90" x2="65" y2="120" stroke="#FACC15" strokeWidth="1.5" />
                <line x1="65" y1="90" x2="35" y2="120" stroke="#FACC15" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Authentic High-Res Hero Artwork Overlay Blend */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-luminosity bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url('/images/hero-desktop.jpg')` }}
          />
        </div>

        {/* ========================================================= */}
        {/* DECORATIVE FRAMING TEXT */}
        {/* ========================================================= */}
        {/* Left Edge Vertical Caption */}
        <div className="hidden xl:flex items-center gap-3 absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-xs font-teko font-bold tracking-[0.35em] text-slate-500 uppercase z-20 pointer-events-none">
          <span>PLAY | BUILD | CONNECT</span>
          <span className="w-10 h-[1.5px] bg-[#FF1F29]" />
        </div>

        {/* Right Edge Vertical Caption */}
        <div className="hidden xl:flex items-center gap-3 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 origin-center text-xs font-teko font-bold tracking-[0.35em] text-slate-500 uppercase z-20 pointer-events-none">
          <span className="w-10 h-[1.5px] bg-[#FACC15]" />
          <span>BUILD | STREAM | GAME | REPEAT</span>
        </div>

        {/* Floating Pill Badge near Right Angle */}
        <div className="absolute top-6 right-6 sm:right-16 z-20 rounded-full px-4 py-1.5 bg-[#0E121C]/85 border border-[#F59E0B]/40 text-[#FACC15] text-[11px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.3)] backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-ping" />
          <span>MORE THAN GAMING</span>
        </div>

        {/* ========================================================= */}
        {/* HERO CONTAINER: TYPOGRAPHY (LEFT) & BATTLESTATION (RIGHT) */}
        {/* ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Hero Typography & CTAs (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Small Kicker */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs font-mono font-bold tracking-[0.25em] text-slate-400">
                <span className="text-[#FF1F29]">GEAR</span>
                <span className="text-slate-600">|</span>
                <span className="text-[#0284C7]">BUILD</span>
                <span className="text-slate-600">|</span>
                <span className="text-[#FACC15]">PLAY</span>
                <span className="text-slate-600">|</span>
                <span className="text-white">TOGETHER</span>
              </div>

              {/* Massive Condensed Italic Title */}
              <div className="space-y-1">
                <h1 className="font-teko italic font-black uppercase text-7xl sm:text-8xl lg:text-9xl leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                  RIG<span className="text-[#FF1F29]">FORGE</span>
                </h1>
                {/* Subhead */}
                <div className="font-teko font-bold italic uppercase tracking-wider text-2xl sm:text-4xl text-white">
                  POWER YOUR PASSION
                </div>
              </div>

              {/* Paragraph */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                A community-driven platform for gamers, creators, and PC builders. Share builds, get support, explore gear, and take your setup to the next level.
              </p>

              {/* CTA Button Pair */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Primary Red Pill Button */}
                <button
                  onClick={() => openAuthModal('signup')}
                  className="w-full sm:w-auto rounded-full px-8 py-3.5 bg-[#FF1F29] hover:bg-[#E01923] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,31,41,0.6)] hover:shadow-[0_0_35px_rgba(255,31,41,0.8)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Dark Glass Pill Button */}
                <button
                  onClick={() => onNavigate('builds')}
                  className="w-full sm:w-auto rounded-full px-8 py-3.5 bg-[#0E121C]/90 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-sm border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
                >
                  <span>Explore Builds</span>
                </button>
              </div>

              {/* Telemetry Stat Pill Bar */}
              <div className="grid grid-cols-4 gap-2 pt-6 border-t border-white/10 text-center max-w-lg mx-auto lg:mx-0">
                <div className="p-2 rounded-xl bg-[#0E121C]/60 border border-white/5">
                  <div className="text-xl sm:text-2xl font-teko font-black text-white">10K+</div>
                  <div className="text-[10px] text-slate-400 font-mono">Builds</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0E121C]/60 border border-white/5">
                  <div className="text-xl sm:text-2xl font-teko font-black text-[#0284C7]">50K+</div>
                  <div className="text-[10px] text-slate-400 font-mono">Community</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0E121C]/60 border border-white/5">
                  <div className="text-xl sm:text-2xl font-teko font-black text-[#FACC15]">1K+</div>
                  <div className="text-[10px] text-slate-400 font-mono">Components</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0E121C]/60 border border-white/5">
                  <div className="text-xl sm:text-2xl font-teko font-black text-[#FF1F29]">24/7</div>
                  <div className="text-[10px] text-slate-400 font-mono">Support</div>
                </div>
              </div>
            </div>

            {/* Right Column: Battlestation Desk Graphic Stage (6 cols) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Battlestation Desk Stage Frame */}
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-[#0E121C]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 group">
                
                {/* Dual-Tone Ambient Backlight Glow behind desk */}
                <div className="absolute top-4 left-4 w-48 h-48 bg-[#38BDF8]/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-48 h-48 bg-[#FF1F29]/25 blur-3xl pointer-events-none" />

                {/* Main Desk Artwork Stage Container */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#07090E] aspect-[16/11]">
                  
                  {/* Visual Battlestation Render */}
                  <img
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85"
                    alt="Custom RigForge Gaming Battlestation"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/40 to-transparent" />

                  {/* Curved Ultrawide Monitor Glow & On-Screen Typography Overlay */}
                  <div className="absolute top-6 left-6 right-28 rounded-xl border border-sky-400/40 bg-black/70 backdrop-blur-sm p-3 shadow-[0_0_25px_rgba(56,189,248,0.35)] flex flex-col items-center justify-center text-center">
                    <div className="text-[9px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
                      ULTRAWIDE 240HZ DISPLAY
                    </div>
                    <div className="font-teko uppercase font-bold text-lg sm:text-xl tracking-widest text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
                      GOOD GAMES BETTER PEOPLE
                    </div>
                  </div>

                  {/* Liquid-Cooled Vertical PC Case on Right */}
                  <div className="absolute top-4 right-4 bottom-14 w-20 sm:w-24 rounded-xl border border-[#38BDF8]/50 bg-black/80 backdrop-blur-md p-2 flex flex-col justify-between items-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    {/* 3 Circular Neon Cooling Fans (Cyan Glow) */}
                    <div className="space-y-1.5 w-full flex flex-col items-center">
                      {[1, 2, 3].map((fan) => (
                        <div key={fan} className="w-8 h-8 rounded-full border-2 border-[#38BDF8] flex items-center justify-center shadow-[0_0_10px_#38BDF8] animate-spin" style={{ animationDuration: '6s' }}>
                          <div className="w-3 h-3 rounded-full bg-[#38BDF8]/60" />
                        </div>
                      ))}
                    </div>

                    {/* Illuminated 'R' Logo */}
                    <div className="w-7 h-7 rounded-lg bg-[#FF1F29] text-white font-teko font-black text-sm flex items-center justify-center shadow-[0_0_15px_#FF1F29]">
                      R
                    </div>
                  </div>

                  {/* Gaming Chair Silhouette & Peripheral Desk Glow Below */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                    <div className="space-y-0.5">
                      <div className="text-xs font-teko uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF1F29]" />
                        <span>FLAGSHIP BATTLE RIG</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        AM5 · Ryzen 7800X3D · RTX 4080 · 360mm AIO
                      </div>
                    </div>

                    {/* Slogan Marker */}
                    <div className="rounded-lg px-2.5 py-1 bg-[#0E121C]/90 border border-[#F59E0B]/40 text-[#FACC15] text-[9px] font-mono font-bold tracking-widest uppercase">
                      BUILT FOR A BETTER TOMORROW
                    </div>
                  </div>

                </div>

                {/* Peripheral RGB Desk Underglow Strip */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                    <span>RGB Mechanical Deck</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF1F29] shadow-[0_0_8px_#FF1F29]" />
                    <span>Wireless Laser Optic</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4-PILLAR FEATURE BAR (GRID OF 4 QUICK-ACCESS FEATURES) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Join Community (Red circular icon: users) */}
          <div
            onClick={() => onNavigate('community')}
            className="group p-5 rounded-2xl bg-[#0E121C]/85 hover:bg-[#121622] border border-white/[0.08] hover:border-[#FF1F29]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#FF1F29] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,31,41,0.4)] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#FF1F29] transition-colors">
                Join Community
              </h3>
              <p className="text-xs text-slate-400">Connect with gamers &amp; builders</p>
            </div>
          </div>

          {/* 2. Share Your Build (White circular icon: cube/box) */}
          <div
            onClick={() => onNavigate('builds')}
            className="group p-5 rounded-2xl bg-[#0E121C]/85 hover:bg-[#121622] border border-white/[0.08] hover:border-white/30 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
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

          {/* 3. Explore Gear (Blue circular icon: shopping-cart) */}
          <div
            onClick={() => onNavigate('marketplace')}
            className="group p-5 rounded-2xl bg-[#0E121C]/85 hover:bg-[#121622] border border-white/[0.08] hover:border-[#0284C7]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#0284C7] text-white flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(2,132,199,0.4)] group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#0284C7] transition-colors">
                Explore Gear
              </h3>
              <p className="text-xs text-slate-400">Find the best components</p>
            </div>
          </div>

          {/* 4. Learn & Grow (Yellow circular icon: book-open) */}
          <div
            onClick={() => onNavigate('guides')}
            className="group p-5 rounded-2xl bg-[#0E121C]/85 hover:bg-[#121622] border border-white/[0.08] hover:border-[#F59E0B]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#FACC15] transition-colors">
                Learn &amp; Grow
              </h3>
              <p className="text-xs text-slate-400">Guides, tips and support</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTTOM SHOWCASE CARDS (3 COLUMNS) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Featured Builds (Red Theme) */}
          <div
            onClick={() => onNavigate('builds')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a080c] via-[#0E121C] to-[#07090E] border border-[#FF1F29]/30 hover:border-[#FF1F29] p-6 sm:p-8 cursor-pointer shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[270px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF1F29]/15 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-mono tracking-widest font-bold text-[#FF1F29] uppercase">
                FEATURED BUILDS
              </span>
              <h3 className="font-teko text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                INSANE<br />SETUPS
              </h3>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-6 pt-4 border-t border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200">Apex Performance Rigs</div>
                <div className="text-[11px] text-slate-400 font-mono">Custom Loop Overclocks</div>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#FF1F29] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,31,41,0.5)] group-hover:translate-x-1 group-hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Community (Blue/Slate Theme) */}
          <div
            onClick={() => onNavigate('community')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#08152e] via-[#0E121C] to-[#07090E] border border-[#0284C7]/30 hover:border-[#0284C7] p-6 sm:p-8 cursor-pointer shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[270px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0284C7]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-mono tracking-widest font-bold text-[#38BDF8] uppercase">
                COMMUNITY
              </span>
              <h3 className="font-teko text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                REAL<br />PEOPLE
              </h3>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-6 pt-4 border-t border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200">Real Builds. Real Stories.</div>
                <div className="text-[11px] text-slate-400 font-mono">50K+ Active Indian Builders</div>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-[0_0_15px_rgba(2,132,199,0.5)] group-hover:translate-x-1 group-hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Guides (Gold/Yellow Theme) */}
          <div
            onClick={() => onNavigate('guides')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1806] via-[#0E121C] to-[#07090E] border border-[#F59E0B]/30 hover:border-[#FACC15] p-6 sm:p-8 cursor-pointer shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[270px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACC15]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="text-xs font-mono tracking-widest font-bold text-[#FACC15] uppercase">
                GUIDES
              </span>
              <h3 className="font-teko text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                LEVEL UP<br />YOUR KNOWLEDGE
              </h3>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-6 pt-4 border-t border-white/5">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-200">Build Smarter. Game Better.</div>
                <div className="text-[11px] text-slate-400 font-mono">Step-by-step assembly tips</div>
              </div>

              <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:translate-x-1 group-hover:scale-105 transition-all">
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
            <span className="text-xs font-mono font-bold text-[#FF1F29] uppercase tracking-wider">HOT DEALS</span>
            <h2 className="font-teko text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              FEATURED HARDWARE
            </h2>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FF1F29] hover:text-white transition-colors"
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
