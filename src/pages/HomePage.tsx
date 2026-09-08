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
  onNavigate: (page: 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support', category?: string) => void;
  onNotification: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNotification }) => {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#050a14] text-slate-100 pb-20 space-y-16">
      {/* ========================================================= */}
      {/* HERO SECTION - CINEMATIC TRI-COLOR BATTLESTATION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] via-[#050a14] to-[#050a14]">
        {/* Atmospheric Tri-Color Lighting Washes (Red / Blue / Yellow) */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          {/* Left Red Wash */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#ff1e2d]/18 via-[#ff1e2d]/5 to-transparent blur-3xl" />
          {/* Center Royal Blue Wash */}
          <div className="absolute top-0 left-1/4 right-1/4 h-full bg-gradient-to-b from-[#0066ff]/16 via-[#0066ff]/5 to-transparent blur-3xl" />
          {/* Right Gold Yellow Wash */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#ffd000]/16 via-[#ffd000]/5 to-transparent blur-3xl" />
        </div>

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
          {/* Top Gaming Atmospheric Tagline */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-xs font-mono font-bold tracking-[0.25em] text-slate-400">
              <span className="text-[#ff1e2d]">GEAR</span>
              <span className="text-slate-600">|</span>
              <span className="text-[#0066ff]">BUILD</span>
              <span className="text-slate-600">|</span>
              <span className="text-[#ffd000]">PLAY</span>
              <span className="text-slate-600">|</span>
              <span className="text-white">TOGETHER</span>
            </div>

            {/* Giant Cinematic Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase font-mono leading-[1.05]">
              RIG<span className="text-[#ff1e2d]">FORGE</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                POWER YOUR PASSION
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              A community-driven platform for gamers, creators, and PC builders. Share builds, get support, explore gear, and take your setup to the next level.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('builder')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-sm shadow-glow-red transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('builds')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0d172e]/90 hover:bg-[#142244] text-white font-semibold text-sm border border-[#1e2d4f] hover:border-slate-400 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Builds</span>
              </button>
            </div>
          </div>

          {/* Central Battlestation Visual Strip with Left Red Soldier, Center Curved Monitor/PC, Right Golden Chair & Parachute */}
          <div className="relative mt-12 rounded-3xl overflow-hidden border border-[#1e2d4f] shadow-2xl bg-[#050a14]">
            {/* Cinematic Battlestation Graphic */}
            <div className="relative aspect-[21/9] min-h-[300px] w-full overflow-hidden bg-[#050a14]">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=85"
                alt="RigForge Battlestation"
                className="w-full h-full object-cover object-center brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff1e2d]/25 via-transparent to-[#ffd000]/25 pointer-events-none" />

              {/* Slanted Atmospheric Tactical Markers */}
              <div className="absolute top-6 left-6 hidden sm:flex flex-col text-[11px] font-mono tracking-widest text-[#ff1e2d] space-y-1">
                <span>PLAY</span>
                <span>BUILD</span>
                <span>CONNECT ——</span>
              </div>

              <div className="absolute top-6 right-6 hidden sm:flex flex-col items-end text-[11px] font-mono tracking-widest text-[#ffd000] space-y-1">
                <span>MORE</span>
                <span>THAN</span>
                <span>GAMING ——</span>
              </div>

              {/* Center Screen Tag */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center px-4 py-1.5 rounded-full bg-[#050a14]/80 backdrop-blur-md border border-[#1e2d4f] text-xs font-mono text-slate-300">
                ⚡ VERIFIED 100% INDIAN RETAIL STOCK &amp; TRANSIT INSURANCE
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#1e2d4f] text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black font-mono text-white">10K+</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Custom Builds</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#0066ff]">50K+</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Community Members</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#ffd000]">1K+</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Verified Components</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#ff1e2d]">24/7</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Engineer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4-CARD FEATURE STRIP (Directly Underneath Hero) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Join Community */}
          <div
            onClick={() => onNavigate('community')}
            className="group p-5 rounded-2xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#ff1e2d]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#ff1e2d] text-white flex items-center justify-center flex-shrink-0 shadow-glow-red group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#ff1e2d] transition-colors">
                Join Community
              </h3>
              <p className="text-xs text-slate-400">Connect with gamers &amp; builders</p>
            </div>
          </div>

          {/* Card 2: Share Your Build */}
          <div
            onClick={() => onNavigate('builds')}
            className="group p-5 rounded-2xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-slate-300 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#1e2d4f] border border-[#3a4e7a] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-slate-200 transition-colors">
                Share Your Build
              </h3>
              <p className="text-xs text-slate-400">Showcase your battle rig</p>
            </div>
          </div>

          {/* Card 3: Explore Gear */}
          <div
            onClick={() => onNavigate('marketplace')}
            className="group p-5 rounded-2xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#0066ff]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#0066ff] text-white flex items-center justify-center flex-shrink-0 shadow-glow-blue group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#0066ff] transition-colors">
                Explore Gear
              </h3>
              <p className="text-xs text-slate-400">Find the best components</p>
            </div>
          </div>

          {/* Card 4: Learn & Grow */}
          <div
            onClick={() => onNavigate('guides')}
            className="group p-5 rounded-2xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#ffd000]/60 shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#ffd000] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-glow-yellow group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-[#ffd000] transition-colors">
                Learn &amp; Grow
              </h3>
              <p className="text-xs text-slate-400">Guides, tips and tutorials</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3 FEATURED CONTENT CARDS (INSANE SETUPS, REAL PEOPLE, LEVEL UP) */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: INSANE SETUPS (Red) */}
          <div
            onClick={() => onNavigate('builds')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a080c] via-[#0d172e] to-[#050a14] border border-[#ff1e2d]/40 p-6 sm:p-8 cursor-pointer shadow-xl hover:border-[#ff1e2d] transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff1e2d]/20 blur-3xl -z-0 pointer-events-none" />
            
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-mono tracking-wider font-bold text-[#ff1e2d] uppercase">
                FEATURED BUILDS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
                INSANE<br />SETUPS
              </h3>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#050a14] border border-[#ff1e2d]/30">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=300&q=80"
                  alt="Custom PC"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="w-10 h-10 rounded-full bg-[#ff1e2d] text-white flex items-center justify-center shadow-glow-red group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: REAL PEOPLE (Steel Blue) */}
          <div
            onClick={() => onNavigate('community')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#08152e] via-[#0d172e] to-[#050a14] border border-[#0066ff]/40 p-6 sm:p-8 cursor-pointer shadow-xl hover:border-[#0066ff] transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0066ff]/20 blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-mono tracking-wider font-bold text-[#0066ff] uppercase">
                COMMUNITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
                REAL<br />PEOPLE
              </h3>
              <p className="text-xs text-slate-400 font-mono">Real Builds. Real Stories.</p>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#050a14] border border-[#0066ff]/30">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80"
                  alt="Builder Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="w-10 h-10 rounded-full bg-[#0066ff] text-white flex items-center justify-center shadow-glow-blue group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: LEVEL UP YOUR KNOWLEDGE (Yellow / Gold) */}
          <div
            onClick={() => onNavigate('guides')}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1c1806] via-[#0d172e] to-[#050a14] border border-[#ffd000]/40 p-6 sm:p-8 cursor-pointer shadow-xl hover:border-[#ffd000] transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd000]/20 blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-mono tracking-wider font-bold text-[#ffd000] uppercase">
                GUIDES
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase tracking-tight">
                LEVEL UP<br />YOUR KNOWLEDGE
              </h3>
              <p className="text-xs text-slate-400 font-mono">Build Smarter. Game Better.</p>
            </div>

            <div className="relative z-10 flex items-end justify-between mt-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#050a14] border border-[#ffd000]/30">
                <img
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80"
                  alt="Knowledge base"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="w-10 h-10 rounded-full bg-[#ffd000] text-slate-950 flex items-center justify-center shadow-glow-yellow group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MARKETPLACE HARDWARE SHOWCASE */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1e2d4f]">
          <div>
            <span className="text-xs font-mono font-bold text-[#ff1e2d] uppercase">HOT DEALS</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">
              FEATURED HARDWARE
            </h2>
          </div>

          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#ff1e2d] hover:underline"
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
