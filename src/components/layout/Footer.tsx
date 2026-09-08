import React from 'react';
import { Cpu, ShieldCheck, Truck, RotateCcw, Wrench, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'catalog' | 'builder', category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 mt-20">
      {/* Guarantees bar */}
      <div className="border-b border-zinc-850 py-8 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Silicon</h4>
              <p className="text-xs text-zinc-500">Authorized direct brand distributor warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Compatibility Guarantee</h4>
              <p className="text-xs text-zinc-500">Zero socket or DDR mismatch policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Insured Freight</h4>
              <p className="text-xs text-zinc-500">Custom shock-absorbing protective crating</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-zinc-950 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                RIG<span className="text-cyan-400">FORGE</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              RigForge is the premier custom computer hardware configuration platform, engineered for gamers, creators, and AI researchers.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/90">
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
                <button onClick={() => onNavigate('catalog', 'cpu')} className="hover:text-cyan-400 transition-colors">
                  Processors (AMD / Intel)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'gpu')} className="hover:text-cyan-400 transition-colors">
                  Graphics Cards (RTX 40-Series)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'motherboard')} className="hover:text-cyan-400 transition-colors">
                  Motherboards (AM5 / LGA1700)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'ram')} className="hover:text-cyan-400 transition-colors">
                  Memory Kits (DDR5 &amp; DDR4)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog', 'storage')} className="hover:text-cyan-400 transition-colors">
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
                <button onClick={() => onNavigate('builder')} className="hover:text-cyan-400 transition-colors">
                  Interactive PC Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-cyan-400 transition-colors">
                  Live Wattage Calculator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-cyan-400 transition-colors">
                  Real-time Socket Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-cyan-400 transition-colors">
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
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              Need custom enterprise workstation advice? Our technical architects are available 24/7.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} RigForge Technologies Inc. All rights reserved.</p>
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
