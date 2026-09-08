import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Wrench, Sparkles } from 'lucide-react';
import { AppPage } from './Navbar';

interface FooterProps {
  onNavigate: (page: AppPage, category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#1e2d4f] bg-[#050a14] text-slate-400 mt-20">
      {/* Guarantees bar */}
      <div className="border-b border-[#1e2d4f] py-8 bg-[#08111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ff1e2d]/10 text-[#ff1e2d] flex items-center justify-center border border-[#ff1e2d]/25 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Silicon</h4>
              <p className="text-xs text-slate-400">Direct authorized Indian brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0066ff]/10 text-[#0066ff] flex items-center justify-center border border-[#0066ff]/25 flex-shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Compatibility Engine</h4>
              <p className="text-xs text-slate-400">Zero socket or DDR mismatch policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffd000]/10 text-[#ffd000] flex items-center justify-center border border-[#ffd000]/25 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Insured Transit</h4>
              <p className="text-xs text-slate-400">BlueDart air crating with tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day RMA Support</h4>
              <p className="text-xs text-slate-400">Hassle-free replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff1e2d] to-[#b30012] flex items-center justify-center text-white font-black font-mono text-base shadow-glow-red">
                R
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white font-mono">
                RIG<span className="text-[#ff1e2d]">FORGE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              India's premier custom battle rig platform. Built for gamers, streamers, creators, and hardware overclockers.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              GSTIN: 27AABCR1234F1Z5 · Mumbai, India
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builds')} className="hover:text-white transition-colors">
                  Explore Builds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-white transition-colors">
                  9-Step PC Configurator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors">
                  Marketplace Catalog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Community &amp; Learn
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors">
                  Community Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guides')} className="hover:text-white transition-colors">
                  Guides &amp; Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  Support Center &amp; FAQs
                </button>
              </li>
              <li>
                <span className="text-slate-500">Discord Community (50K+)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Verified India Retail
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              Direct pan-India delivery to Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and 19,000+ pin codes.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d172e] border border-[#1e2d4f] text-[11px] font-mono text-[#ffd000]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>UPI / NetBanking / Cards</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1e2d4f] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} RigForge Technologies India Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered with passion for gamers across India.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
