import React from 'react';
import { 
  Wrench, 
  ArrowRight, 
  Cpu, 
  Monitor, 
  CircuitBoard, 
  Layers, 
  HardDrive, 
  Fan, 
  Box, 
  Zap, 
  Sparkles, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockHardware';
import { ProductCard } from '../components/products/ProductCard';
import { useBuilderStore } from '../store/useBuilderStore';
import { formatINR } from '../utils/formatCurrency';

interface HomePageProps {
  onNavigate: (page: 'home' | 'catalog' | 'builder', category?: string) => void;
  onNotification: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNotification }) => {
  const loadPresetBuild = useBuilderStore((state) => state.loadPresetBuild);
  const trendingProducts = MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 6);

  const categories = [
    { id: 'cpu', name: 'Processors', icon: <Cpu className="w-6 h-6 text-[#FCA311]" />, count: '11 Models', desc: 'Intel 12th-14th Gen & AMD AM4/AM5' },
    { id: 'gpu', name: 'Graphics Cards', icon: <Monitor className="w-6 h-6 text-[#FCA311]" />, count: '12 Models', desc: 'NVIDIA RTX 40/30 & AMD RX 6000/7000' },
    { id: 'motherboard', name: 'Motherboards', icon: <CircuitBoard className="w-6 h-6 text-[#FCA311]" />, count: '7 Models', desc: 'B650, B760, B550, Z790 DDR4/DDR5' },
    { id: 'ram', name: 'Memory (RAM)', icon: <Layers className="w-6 h-6 text-[#FCA311]" />, count: '6 Kits', desc: 'Corsair, G.Skill DDR4 & DDR5 EXPO' },
    { id: 'storage', name: 'NVMe Storage', icon: <HardDrive className="w-6 h-6 text-[#FCA311]" />, count: '8 Drives', desc: 'WD Black, Crucial P3, Samsung 990 Pro' },
    { id: 'cooler', name: 'Coolers & AIOs', icon: <Fan className="w-6 h-6 text-[#FCA311]" />, count: '5 Models', desc: 'DeepCool AG400, AK620 & 360mm Liquid' },
    { id: 'case', name: 'Cabinets / Cases', icon: <Box className="w-6 h-6 text-[#FCA311]" />, count: '7 Models', desc: 'Ant Esports, Lian Li 216, 4000D Airflow' },
    { id: 'psu', name: 'Power Supplies', icon: <Zap className="w-6 h-6 text-[#FCA311]" />, count: '8 PSUs', desc: 'Cooler Master MWE & Corsair ATX 3.0' },
  ];

  const handleLaunchFlagshipPreset = () => {
    loadPresetBuild('enthusiast');
    onNotification('Loaded 1440p / 4K Esports King (Ryzen 7 7800X3D + RTX 4070 Super)!');
    onNavigate('builder');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#262626] bg-radial-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#262626] text-[#FCA311] text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#FCA311]" />
                <span>India’s Premier Custom PC Architecture Platform</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                FORGE YOUR DREAM <br />
                <span className="text-[#FCA311]">
                  BATTLESTATION
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#A0A0A0] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Benchmark, configure, and price custom gaming desktops with verified Indian retail stock. Real-time socket validation, TDP calculations, and pan-India insured shipping.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('builder')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 flex items-center justify-center gap-2.5 shadow-glow-orange transition-all hover:scale-105 active:scale-95"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Launch Custom PC Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('catalog')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#111111] hover:bg-[#151515] text-zinc-200 hover:text-white border border-[#262626] hover:border-[#FCA311]/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>Browse Indian Catalog</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#262626] max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl font-extrabold font-mono text-[#FCA311]">100%</div>
                  <div className="text-xs text-[#A0A0A0]">Genuine Indian Stock</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold font-mono text-[#FCA311]">GST</div>
                  <div className="text-xs text-[#A0A0A0]">Tax Invoice with ITC</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold font-mono text-[#FCA311]">BlueDart</div>
                  <div className="text-xs text-[#A0A0A0]">Transit Insured Air</div>
                </div>
              </div>
            </div>

            {/* Right Rig Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-6 bg-[#111111] border border-[#262626] shadow-2xl backdrop-blur-xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FCA311]/15 to-transparent rounded-3xl blur-xl -z-10" />

                <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-semibold text-emerald-400">INDIAN RETAIL BENCHMARK</span>
                  </div>
                  <span className="text-xs font-mono text-[#A0A0A0]">AM5 · DDR5</span>
                </div>

                {/* Hero Graphic Card preview */}
                <div className="relative my-4 aspect-[16/10] rounded-2xl overflow-hidden border border-[#262626]">
                  <img
                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80"
                    alt="Custom Gaming Rig India"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#FCA311] font-bold">COMMUNITY SWEET-SPOT</div>
                      <div className="text-base font-extrabold text-white">1440p Esports King</div>
                    </div>
                    <span className="text-base font-mono font-bold text-white">
                      {formatINR(158492)}
                    </span>
                  </div>
                </div>

                {/* Quick Spec list */}
                <div className="space-y-2 mb-5 text-xs font-mono text-zinc-300">
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                    <span className="text-[#A0A0A0]">Processor</span>
                    <span className="text-white font-semibold">AMD Ryzen 7 7800X3D (AM5)</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                    <span className="text-[#A0A0A0]">Graphics Card</span>
                    <span className="text-[#FCA311] font-semibold">GeForce RTX 4070 Super 12GB</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#0D0D0D] border border-[#262626]">
                    <span className="text-[#A0A0A0]">Power Delivery</span>
                    <span className="text-zinc-300">Corsair RM850e 80+ Gold (ATX 3.0)</span>
                  </div>
                </div>

                <button
                  onClick={handleLaunchFlagshipPreset}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#151515] hover:bg-[#FCA311] hover:text-zinc-950 text-[#FCA311] border border-[#FCA311]/40 hover:border-[#FCA311] transition-all flex items-center justify-center gap-2 group shadow-glow-orange"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load 1440p King Build in PC Configurator</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#FCA311] font-bold mb-1">
              Component Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Browse 50+ Indian Market Parts
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#FCA311] hover:underline flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>View Full Parts Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('catalog', cat.id)}
              className="p-5 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#FCA311]/50 hover:shadow-glow-orange transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] border border-[#262626] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#FCA311]/50 transition-all">
                  {cat.icon}
                </div>
                <div className="font-bold text-white text-base mb-1 group-hover:text-[#FCA311] transition-colors">
                  {cat.name}
                </div>
                <div className="text-xs text-[#A0A0A0] leading-relaxed mb-3">
                  {cat.desc}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#262626] text-xs font-mono">
                <span className="text-[#A0A0A0]">{cat.count}</span>
                <span className="text-[#FCA311] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Indian Components */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#FCA311] font-bold mb-1">
              Popular Picks in India
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trending Gaming Hardware
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#FCA311] hover:underline flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Browse All {MOCK_PRODUCTS.length} Components</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNotification={onNotification}
            />
          ))}
        </div>
      </section>

      {/* Value Proposition Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#262626] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#151515] border border-[#262626] flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Official Brand Warranty</div>
              <div className="text-xs text-[#A0A0A0] leading-relaxed">
                Every component is sourced from authorized Indian national distributors with 1 to 5 years manufacturer warranty.
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#262626] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#151515] border border-[#262626] flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Live Wattage &amp; Socket Check</div>
              <div className="text-xs text-[#A0A0A0] leading-relaxed">
                Automated pin socket verification (LGA1700 / AM5) and transient spike power headroom calculation for Indian mains.
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#262626] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#151515] border border-[#262626] flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Pre-Tested 1-Click Rigs</div>
              <div className="text-xs text-[#A0A0A0] leading-relaxed">
                Load curated budget, 1440p esports, and 4K workstation presets directly into the builder with single click.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
