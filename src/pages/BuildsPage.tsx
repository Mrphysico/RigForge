import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  MessageSquare, 
  Cpu, 
  Sparkles, 
  Wrench, 
  X,
  Layers
} from 'lucide-react';
import { MOCK_SHOWCASE_BUILDS } from '../data/mockBuilds';
import { ShowcaseBuild } from '../types/hardware';
import { formatINR } from '../utils/formatCurrency';
import { useBuilderStore } from '../store/useBuilderStore';

interface BuildsPageProps {
  onNavigate: (page: 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support', category?: string) => void;
  onNotification: (msg: string) => void;
}

const CATEGORIES = ['All', 'Popular', 'Latest', 'Budget', 'High-End', 'Gaming', 'Streaming', 'Workstation'] as const;

export const BuildsPage: React.FC<BuildsPageProps> = ({ onNavigate, onNotification }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuild, setSelectedBuild] = useState<ShowcaseBuild | null>(null);
  const [likedBuilds, setLikedBuilds] = useState<Record<string, boolean>>({});

  const { loadPresetBuild } = useBuilderStore();

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedBuilds((prev) => {
      const next = !prev[id];
      onNotification(next ? 'Build saved to your favorites!' : 'Removed from favorites.');
      return { ...prev, [id]: next };
    });
  };

  const handleOpenInBuilder = (build: ShowcaseBuild, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (build.category === 'Budget') {
      loadPresetBuild('sweetspot');
    } else {
      loadPresetBuild('enthusiast');
    }
    onNotification(`Loaded "${build.title}" into the PC Builder!`);
    onNavigate('builder');
  };

  const filteredBuilds = useMemo(() => {
    return MOCK_SHOWCASE_BUILDS.filter((build) => {
      if (selectedCategory !== 'All' && build.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          build.title.toLowerCase().includes(q) ||
          build.author.toLowerCase().includes(q) ||
          build.specsSummary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pb-20 bg-[#050a14] text-slate-100">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] to-[#050a14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#ff1e2d] text-xs font-mono font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMUNITY SHOWCASE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-mono">
                EXPLORE <span className="text-[#ff1e2d]">BUILDS</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
                Discover amazing PC builds from our community. Get inspired, inspect components, or clone configurations directly into your builder.
              </p>
            </div>

            <button
              onClick={() => onNavigate('builder')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-sm shadow-glow-red transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Wrench className="w-4 h-4" />
              <span>Create Your Build</span>
            </button>
          </div>

          {/* Filter pills & search */}
          <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1e2d4f]">
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                      : 'bg-[#0d172e] text-slate-300 hover:text-white hover:bg-[#142244] border border-[#1e2d4f]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search builds, parts, creators..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#0d172e] text-white placeholder-slate-400 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#ff1e2d] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Builds */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredBuilds.length === 0 ? (
          <div className="text-center py-20 bg-[#0d172e] rounded-3xl border border-[#1e2d4f]">
            <p className="text-slate-400 text-sm">No builds found matching your filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2 text-xs font-bold text-[#ff1e2d] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuilds.map((build) => {
              const isLiked = !!likedBuilds[build.id];
              return (
                <div
                  key={build.id}
                  onClick={() => setSelectedBuild(build)}
                  className="group bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#ff1e2d]/60 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Visual Image */}
                  <div className="relative aspect-video overflow-hidden bg-[#050a14]">
                    <img
                      src={build.image}
                      alt={build.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d172e] via-transparent to-transparent opacity-80" />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#050a14]/80 backdrop-blur-md border border-[#1e2d4f] text-[10px] font-mono font-bold text-[#ff1e2d] uppercase">
                      {build.category}
                    </div>

                    {/* Heart button */}
                    <button
                      onClick={(e) => toggleLike(build.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isLiked
                          ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                          : 'bg-[#050a14]/70 text-slate-300 hover:text-white hover:bg-[#ff1e2d]/30'
                      }`}
                      aria-label="Like build"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-base text-white group-hover:text-[#ff1e2d] transition-colors">
                          {build.title}
                        </h3>
                        <span className="text-xs font-mono font-bold text-[#ffd000]">
                          {formatINR(build.totalPrice)}
                        </span>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <img
                          src={build.authorAvatar}
                          alt={build.author}
                          className="w-5 h-5 rounded-full object-cover border border-[#1e2d4f]"
                        />
                        <span>@{build.author}</span>
                      </div>

                      {/* Specs */}
                      <div className="p-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-xs font-mono text-slate-300 space-y-1">
                        <div className="flex items-center gap-2 truncate text-slate-200">
                          <Cpu className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" />
                          <span className="truncate">{build.cpu}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate text-slate-200">
                          <Layers className="w-3.5 h-3.5 text-[#ff1e2d] flex-shrink-0" />
                          <span className="truncate">{build.gpu}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#1e2d4f] text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-[#ff1e2d]" />
                          <span>{build.likes + (isLiked ? 1 : 0)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{build.comments}</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleOpenInBuilder(build, e)}
                        className="px-3 py-1.5 rounded-lg bg-[#142244] hover:bg-[#ff1e2d] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#1e2d4f]"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Customize</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Build Details Modal */}
      {selectedBuild && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0d172e] border border-[#1e2d4f] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedBuild(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#142244]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedBuild.authorAvatar}
                alt={selectedBuild.author}
                className="w-10 h-10 rounded-full border border-[#ff1e2d]"
              />
              <div>
                <h2 className="text-xl font-black text-white">{selectedBuild.title}</h2>
                <p className="text-xs text-slate-400">Built by @{selectedBuild.author} · {selectedBuild.category}</p>
              </div>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#050a14]">
              <img src={selectedBuild.image} alt={selectedBuild.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedBuild.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#050a14] border border-[#1e2d4f] text-xs font-mono">
              <div>
                <span className="text-slate-500 block">PROCESSOR</span>
                <span className="text-white font-bold">{selectedBuild.cpu}</span>
              </div>
              <div>
                <span className="text-slate-500 block">GRAPHICS CARD</span>
                <span className="text-white font-bold">{selectedBuild.gpu}</span>
              </div>
              <div>
                <span className="text-slate-500 block">SYSTEM MEMORY</span>
                <span className="text-white font-bold">{selectedBuild.ram}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NVME STORAGE</span>
                <span className="text-white font-bold">{selectedBuild.storage}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1e2d4f]">
              <div>
                <span className="text-xs text-slate-400 block">Estimated Price</span>
                <span className="text-xl font-mono font-black text-[#ffd000]">
                  {formatINR(selectedBuild.totalPrice)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedBuild(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const b = selectedBuild;
                    setSelectedBuild(null);
                    handleOpenInBuilder(b);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white text-xs font-bold shadow-glow-red flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Open in Configurator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
