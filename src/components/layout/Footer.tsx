import React from 'react';
import { Cpu, ShieldCheck, Truck, RotateCcw, Wrench, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'catalog' | 'builder', category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#262626] bg-[#050505] text-zinc-400 mt-20">
      {/* Guarantees bar */}
      <div className="border-b border-[#262626] py-8 bg-[#0D0D0D]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FCA311]/10 text-[#FCA311] flex items-center justify-center border border-[#FCA311]/25 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Silicon</h4>
              <p className="text-xs text-zinc-500">Authorized direct Indian distributor warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FCA311]/10 text-[#FCA311] flex items-center justify-center border border-[#FCA311]/25 flex-shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Compatibility Guarantee</h4>
              <p className="text-xs text-zinc-500">Zero socket or DDR mismatch policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FCA311]/10 text-[#FCA311] flex items-center justify-center border border-[#FCA311]/25 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Insured Freight</h4>
              <p className="text-xs text-zinc-500">BlueDart shock-absorbing crating</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FCA311]/10 text-[#FCA311] flex items-center justify-center border border-[#FCA311]/25 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-zinc-500">Fast RMA support with zero restock fee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FCA311] flex items-center justify-center text-black font-bold shadow-glow-orange">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                RIG<span className="text-[#FCA311]">FORGE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              RigForge is India's premier custom computer hardware configuration platform, engineered for gamers, creators, and AI researchers.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FCA311]">
              <Terminal className="w-3.5 h-3.5" />
              <span>v1.0.0-PROD · Latency: 12ms</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-3">
              Hardware Components
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('catalog', 'cpu')} className="hover:text-[#FCA311] transition-colors">
                  Processors (AMD / Intel)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'gpu')} className="hover:text-[#FCA311] transition-colors">
                  Graphics Cards (RTX 40-Series)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'motherboard')} className="hover:text-[#FCA311] transition-colors">
                  Motherboards (AM5 / LGA1700)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'ram')} className="hover:text-[#FCA311] transition-colors">
                  Memory Kits (DDR5 &amp; DDR4)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'storage')} className="hover:text-[#FCA311] transition-colors">
                  Fast PCIe Gen4 / Gen5 NVMe
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-3">
              Configurator Tools
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-[#FCA311] transition-colors">
                  Interactive PC Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-[#FCA311] transition-colors">
                  Live Wattage Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-[#FCA311] transition-colors">
                  Real-time Socket Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#FCA311] transition-colors">
                  Complete Parts Catalog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-3">
              RigForge Guarantee
            </h5>
            <p className="text-xs leading-relaxed text-zinc-400 mb-3">
              All configured systems undergo stringent automated power budget verification and physical pin-compatibility checks before checkout.
            </p>
            <div className="p-3.5 rounded-2xl bg-[#111111] border border-[#262626] text-[11px] text-zinc-400">
              Need custom enterprise workstation advice? Our technical architects are available 24/7.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} RigForge Technologies India. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-300 cursor-pointer">Warranty Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
