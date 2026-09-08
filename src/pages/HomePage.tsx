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
  Gauge, 
  Flame,
  CheckCircle,
  Award
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
    { id: 'cpu', name: 'Processors', icon: <Cpu className="w-6 h-6 text-cyan-400" />, count: '11 Models', desc: 'Intel 12th-14th Gen & AMD AM4/AM5' },
    { id: 'gpu', name: 'Graphics Cards', icon: <Monitor className="w-6 h-6 text-blue-400" />, count: '12 Models', desc: 'NVIDIA RTX 40/30 & AMD RX 6000/7000' },
    { id: 'motherboard', name: 'Motherboards', icon: <CircuitBoard className="w-6 h-6 text-emerald-400" />, count: '7 Models', desc: 'B650, B760, B550, Z790 DDR4/DDR5' },
    { id: 'ram', name: 'Memory (RAM)', icon: <Layers className="w-6 h-6 text-purple-400" />, count: '6 Kits', desc: 'Corsair, G.Skill DDR4 & DDR5 EXPO' },
    { id: 'storage', name: 'NVMe Storage', icon: <HardDrive className="w-6 h-6 text-rose-400" />, count: '8 Drives', desc: 'WD Black, Crucial P3, Samsung 990 Pro' },
    { id: 'cooler', name: 'Coolers & AIOs', icon: <Fan className="w-6 h-6 text-cyan-400" />, count: '5 Models', desc: 'DeepCool AG400, AK620 & 360mm Liquid' },
    { id: 'case', name: 'Cabinets / Cases', icon: <Box className="w-6 h-6 text-amber-400" />, count: '7 Models', desc: 'Ant Esports, Lian Li 216, 4000D Airflow' },
    { id: 'psu', name: 'Power Supplies', icon: <Zap className="w-6 h-6 text-yellow-400" />, count: '8 PSUs', desc: 'Cooler Master MWE & Corsair ATX 3.0' },
  ];

  const handleLaunchFlagshipPreset = () => {
    loadPresetBuild('enthusiast');
    onNotification('Loaded 1440p / 4K Esports King (Ryzen 7 7800X3D + RTX 4070 Super)!');
    onNavigate('builder');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-zinc-800/60 bg-radial-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>India’s Dedicated PC Parts &amp; Configurator Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                FORGE YOUR DREAM <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  BATTLESTATION IN INDIA
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Benchmark and build custom gaming desktops with real-time Indian retail stock verification. Socket-matching intelligence, live wattage calculators, and guaranteed genuine brand warranty.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('builder')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 flex items-center justify-center gap-2.5 shadow-glow-neon transition-all hover:scale-105 active:scale-95"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Launch Custom PC Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('catalog')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-750 hover:border-zinc-600 transition-all flex items-center justify-center gap-2"
                >
                  <span>Browse Indian Catalog</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-xl font-extrabold font-mono text-cyan-400">100%</div>
                  <div className="text-xs text-zinc-400">Genuine Indian Stock</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold font-mono text-cyan-400">GST</div>
                  <div className="text-xs text-zinc-400">Tax Invoice with ITC</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold font-mono text-cyan-400">BlueDart</div>
                  <div className="text-xs text-zinc-400">Transit Insured Air</div>
                </div>
              </div>
            </div>

            {/* Right Rig Teaser */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-6 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950 border border-zinc-800/90 shadow-2xl backdrop-blur-xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl -z-10" />

                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-semibold text-emerald-400">INDIAN RETAIL BENCHMARK</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">AM5 · DDR5</span>
                </div>

                {/* Hero Graphic Card preview */}
                <div className="relative my-4 aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80"
                    alt="Custom Gaming Rig India"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-bold">COMMUNITY SWEET-SPOT</div>
                      <div className="text-base font-extrabold text-white">1440p Esports King</div>
                    </div>
                    <span className="text-base font-mono font-bold text-white">
                      {formatINR(158492)}
                    </span>
                  </div>
                </div>

                {/* Quick Spec list */}
                <div className="space-y-2 mb-5 text-xs font-mono text-zinc-300">
                  <div className="flex justify-between p-2 rounded-lg bg-zinc-950/70 border border-zinc-850">
                    <span className="text-zinc-400">Processor</span>
                    <span className="text-cyan-300">AMD Ryzen 7 7800X3D (AM5)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-zinc-950/70 border border-zinc-850">
                    <span className="text-zinc-400">Graphics Card</span>
                    <span className="text-blue-300">GeForce RTX 4070 Super 12GB</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-zinc-950/70 border border-zinc-850">
                    <span className="text-zinc-400">Power Delivery</span>
                    <span className="text-amber-300">Corsair RM850e 80+ Gold (ATX 3.0)</span>
                  </div>
                </div>

                <button
                  onClick={handleLaunchFlagshipPreset}
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load This 1440p King Build in PC Configurator</span>
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
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
              Component Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Browse 50+ Indian Market Parts
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
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
              className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-cyan-500/50 hover:shadow-glow-cyan transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all">
                  {cat.icon}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-855 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>{cat.count}</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
              <Flame className="w-4 h-4" />
              <span>Highest Selling in India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Trending Hardware &amp; Value Picks
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>See All Hardware</span>
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

      {/* Why Choose RigForge Configurator Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 flex-shrink-0">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Indian Power Grid Protection</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Automatically budgets +35% headroom for modern GPU transient spikes and voltage fluctuations across Indian power outlets.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Zero Mismatch Guarantee</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Eliminates incorrect pin pairing between LGA1700/AM5 sockets, DDR4 vs DDR5 RAM, and cabinet radiator clearances.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Pan-India Freight Protection</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every order ships with BlueDart / Delhivery insured air transit, shock-tested packaging, and official brand distributor serials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
