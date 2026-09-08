import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  X, 
  Bookmark, 
  Search, 
  Share2
} from 'lucide-react';
import { MOCK_GUIDES } from '../data/mockGuides';
import { GuideArticle } from '../types/hardware';

interface GuidesPageProps {
  onNotification: (msg: string) => void;
}

const CATEGORIES = ['All', 'PC Building', 'Components', 'Gaming', 'Software', 'Troubleshooting'] as const;

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNotification }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState<GuideArticle | null>(null);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = !prev[id];
      onNotification(next ? 'Guide saved to reading list!' : 'Removed from reading list.');
      return { ...prev, [id]: next };
    });
  };

  const filteredGuides = MOCK_GUIDES.filter((guide) => {
    if (selectedCategory !== 'All' && guide.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        guide.title.toLowerCase().includes(q) ||
        guide.subtitle.toLowerCase().includes(q) ||
        guide.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen pb-20 bg-[#050a14] text-slate-100">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] to-[#050a14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#ffd000] text-xs font-mono font-semibold mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>BUILDER KNOWLEDGE BASE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-mono">
                GUIDES &amp; <span className="text-[#ffd000]">TUTORIALS</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
                Learn. Build. Upgrade. Get Better. Curated guides, hardware tuning tutorials, and troubleshooting walkthroughs.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials, GPU tuning, BIOS..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0d172e] text-white placeholder-slate-400 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#ffd000] transition-all"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 border-t border-[#1e2d4f] pt-6 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#ffd000] text-slate-950 font-bold shadow-glow-yellow'
                    : 'bg-[#0d172e] text-slate-300 hover:text-white hover:bg-[#142244] border border-[#1e2d4f]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredGuides.length === 0 ? (
          <div className="text-center py-20 bg-[#0d172e] rounded-3xl border border-[#1e2d4f]">
            <p className="text-slate-400 text-sm">No tutorials found matching your search.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2 text-xs font-bold text-[#ffd000] hover:underline"
            >
              Show All Guides
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => {
              const isSaved = !!bookmarked[guide.id];
              return (
                <article
                  key={guide.id}
                  onClick={() => setActiveGuide(guide)}
                  className="group bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] hover:border-[#ffd000]/60 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#050a14]">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d172e] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#050a14]/80 backdrop-blur-md border border-[#1e2d4f] text-[10px] font-mono font-bold text-[#ffd000] uppercase">
                      {guide.category}
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(guide.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                        isSaved
                          ? 'bg-[#ffd000] text-slate-950 shadow-glow-yellow'
                          : 'bg-[#050a14]/70 text-slate-300 hover:text-white hover:bg-[#ffd000]/30'
                      }`}
                      aria-label="Bookmark guide"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-[#ffd000] transition-colors leading-snug">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {guide.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1e2d4f] text-xs text-slate-400">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#ffd000]" />
                        <span>{guide.readTime}</span>
                        <span>·</span>
                        <span className="text-slate-300">{guide.difficulty}</span>
                      </div>

                      <span className="flex items-center gap-1 text-xs font-semibold text-[#ffd000] group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide Reader Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#0d172e] border border-[#1e2d4f] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveGuide(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#142244]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ffd000]">
                <span className="uppercase">{activeGuide.category}</span>
                <span>·</span>
                <span>{activeGuide.readTime}</span>
                <span>·</span>
                <span>{activeGuide.difficulty}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeGuide.title}</h2>
              <p className="text-sm text-slate-400">{activeGuide.subtitle}</p>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#050a14]">
              <img src={activeGuide.image} alt={activeGuide.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              {activeGuide.content.map((paragraph, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#ffd000] text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="flex-1">{paragraph}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#1e2d4f]">
              <button
                onClick={() => onNotification('Guide shared successfully!')}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Guide</span>
              </button>

              <button
                onClick={() => setActiveGuide(null)}
                className="px-6 py-2.5 rounded-xl bg-[#ffd000] hover:bg-[#e6b800] text-slate-950 text-xs font-bold shadow-glow-yellow"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
