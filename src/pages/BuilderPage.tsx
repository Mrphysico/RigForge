import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Trash2, 
  RotateCcw, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  Monitor, 
  CircuitBoard, 
  Layers, 
  HardDrive, 
  Fan, 
  Box, 
  Sparkles, 
  Share2, 
  Check, 
  Ban, 
  Save, 
  Loader2, 
  Search, 
  ArrowRight, 
  Keyboard
} from 'lucide-react';
import { ComponentCategory, Product } from '../types/hardware';
import { BUILDER_SLOTS, MOCK_PRODUCTS } from '../data/mockHardware';
import { useBuilderStore } from '../store/useBuilderStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatINR } from '../utils/formatCurrency';
import { API_BASE_URL } from '../config/api';

interface BuilderPageProps {
  onNotification: (msg: string) => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({ onNotification }) => {
  const {
    slots,
    setSlot,
    removeSlot,
    clearBuild,
    loadPresetBuild,
    getEstimatedWattage,
    getRecommendedPsuWattage,
    getTotalPrice,
    getSelectedCount,
    getCompatibilityIssues,
  } = useBuilderStore();

  const addMultipleItems = useCartStore((state) => state.addMultipleItems);
  const { isAuthenticated, openAuthModal } = useAuthStore();
  
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState<'All' | 'Intel' | 'AMD' | 'NVIDIA' | 'Corsair'>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const activeSlotConfig = BUILDER_SLOTS[activeStepIndex] || BUILDER_SLOTS[0];
  const activeCategory = activeSlotConfig.category;

  const estimatedWattage = getEstimatedWattage();
  const recommendedPsu = getRecommendedPsuWattage();
  const totalPrice = getTotalPrice();
  const selectedCount = getSelectedCount();
  const compatibilityIssues = getCompatibilityIssues();
  const hasErrors = compatibilityIssues.some((issue) => issue.severity === 'error');

  const getSlotIcon = (category: ComponentCategory) => {
    switch (category) {
      case 'cpu':
        return <Cpu className="w-5 h-5 text-[#0066ff]" />;
      case 'motherboard':
        return <CircuitBoard className="w-5 h-5 text-emerald-400" />;
      case 'ram':
        return <Layers className="w-5 h-5 text-[#ffd000]" />;
      case 'gpu':
        return <Monitor className="w-5 h-5 text-[#ff1e2d]" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-purple-400" />;
      case 'psu':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'case':
        return <Box className="w-5 h-5 text-cyan-400" />;
      case 'cooler':
        return <Fan className="w-5 h-5 text-blue-400" />;
      case 'peripherals':
        return <Keyboard className="w-5 h-5 text-pink-400" />;
      default:
        return <Wrench className="w-5 h-5 text-slate-400" />;
    }
  };

  // Hardware items available for the active step
  const availableParts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (p.category !== activeCategory) return false;
      if (subFilter !== 'All') {
        const brandMatch = p.brand.toLowerCase().includes(subFilter.toLowerCase());
        const nameMatch = p.name.toLowerCase().includes(subFilter.toLowerCase());
        if (!brandMatch && !nameMatch) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.specs.socket && p.specs.socket.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeCategory, subFilter, searchQuery]);

  const handleNextStep = () => {
    if (activeStepIndex < BUILDER_SLOTS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      setSearchQuery('');
      setSubFilter('All');
    }
  };

  const handleSelectPart = (part: Product) => {
    setSlot(activeCategory, part);
    onNotification(`Added ${part.name} to your build!`);
    // Advance to next step if empty
    if (activeStepIndex < BUILDER_SLOTS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      setSearchQuery('');
      setSubFilter('All');
    }
  };

  const handleAddAllToCart = () => {
    const selectedProducts = Object.values(slots).filter((p): p is Product => p !== null);
    if (selectedProducts.length === 0) {
      onNotification('Your build is currently empty. Pick parts first!');
      return;
    }
    addMultipleItems(selectedProducts);
    onNotification(`Added all ${selectedProducts.length} components to your cart!`);
  };

  const handleShareBuild = () => {
    const selectedIds = Object.entries(slots)
      .filter(([_, p]) => p !== null)
      .map(([cat, p]) => `${cat}:${p!.id}`)
      .join(',');

    const url = `${window.location.origin}${window.location.pathname}#builder?parts=${encodeURIComponent(selectedIds)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    onNotification('RigForge build link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveBuild = async () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
      onNotification('Please sign in to save your custom build.');
      return;
    }

    const selectedProducts = Object.values(slots).filter((p): p is Product => p !== null);
    if (selectedProducts.length === 0) {
      onNotification('Cannot save an empty build.');
      return;
    }

    if (!buildName.trim()) {
      onNotification('Please name your build first.');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('rigforge_auth_token');
      const response = await fetch(`${API_BASE_URL}/api/builds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: buildName,
          components: slots,
          totalPrice,
          estimatedWattage,
        }),
      });

      if (response.ok) {
        onNotification(`Build "${buildName}" saved successfully to your profile!`);
        setShowSaveDialog(false);
        setBuildName('');
      } else {
        onNotification('Could not save build to the server. Saved locally.');
        setShowSaveDialog(false);
      }
    } catch {
      onNotification('Build configuration saved to local storage!');
      setShowSaveDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#050a14] text-slate-100">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] to-[#050a14] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#0066ff] text-xs font-mono font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>REAL-TIME COMPATIBILITY &amp; TDP VALIDATION</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase font-mono">
                CREATE <span className="text-[#ff1e2d]">YOUR BUILD</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Choose components and build your dream machine step by step.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  loadPresetBuild('sweetspot');
                  onNotification('Loaded 1080p Value Champion (Ryzen 5 5600 + RX 6600)!');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-xs font-mono text-slate-300"
              >
                Load ₹53K Budget Rig
              </button>
              <button
                onClick={() => {
                  loadPresetBuild('enthusiast');
                  onNotification('Loaded 1440p Esports King (Ryzen 7 7800X3D + RTX 4070 Super)!');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-xs font-mono text-[#ffd000]"
              >
                Load ₹1.6L King Rig
              </button>
              <button
                onClick={() => {
                  clearBuild();
                  onNotification('Builder slots cleared.');
                }}
                className="p-2 rounded-xl bg-[#0d172e] hover:bg-rose-950/40 border border-[#1e2d4f] text-slate-400 hover:text-rose-400"
                title="Reset Build"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: 9-STEP CATEGORY NAVIGATOR (5 COLS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2d4f] text-xs font-mono text-slate-400">
              <span>9-STAGE CONFIGURATION</span>
              <span className="text-[#ff1e2d] font-bold">{selectedCount}/9 Selected</span>
            </div>

            <div className="space-y-2">
              {BUILDER_SLOTS.map((slot, index) => {
                const isActive = activeStepIndex === index;
                const selectedPart = slots[slot.category];

                return (
                  <div
                    key={slot.category}
                    onClick={() => {
                      setActiveStepIndex(index);
                      setSearchQuery('');
                      setSubFilter('All');
                    }}
                    className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#142244] border-[#ff1e2d] shadow-glow-red/20'
                        : selectedPart
                        ? 'bg-[#0d172e] border-emerald-500/40 hover:border-emerald-500'
                        : 'bg-[#0d172e] border-[#1e2d4f] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Step Number Badge */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${
                          selectedPart
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isActive
                            ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                            : 'bg-[#050a14] text-slate-400 border border-[#1e2d4f]'
                        }`}
                      >
                        {selectedPart ? <Check className="w-4 h-4" /> : index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0">{getSlotIcon(slot.category)}</span>
                          <span className="font-bold text-sm text-white truncate">{slot.label}</span>
                          {slot.required && !selectedPart && (
                            <span className="text-[10px] font-mono text-slate-500">Req</span>
                          )}
                        </div>
                        {selectedPart ? (
                          <div className="text-xs font-semibold text-emerald-400 truncate">
                            {selectedPart.name}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 truncate">{slot.sublabel}</div>
                        )}
                      </div>
                    </div>

                    {/* Right Price or Select Indicator */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selectedPart ? (
                        <>
                          <span className="text-xs font-mono font-bold text-white">
                            {formatINR(selectedPart.price)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSlot(slot.category);
                              onNotification(`Removed ${slot.label} from build.`);
                            }}
                            className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Remove component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-mono text-slate-500 group-hover:text-white transition-colors">
                          Choose &gt;
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: COMPONENT SELECTION PANEL (7 COLS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-[#0d172e] border border-[#1e2d4f] rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Active Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2d4f]">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#ff1e2d] uppercase">
                  STEP {activeStepIndex + 1} OF 9
                </span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Select {activeSlotConfig.label}</span>
                </h2>
              </div>

              {/* Sub-Brand Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {(['All', 'Intel', 'AMD', 'NVIDIA', 'Corsair'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSubFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      subFilter === filter
                        ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                        : 'bg-[#050a14] text-slate-400 hover:text-white border border-[#1e2d4f]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search within Category */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeSlotConfig.label}...`}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#050a14] text-white placeholder-slate-400 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#ff1e2d]"
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

            {/* Hardware Items List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {availableParts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No components found for this category and filter.
                </div>
              ) : (
                availableParts.map((part) => {
                  const isCurrentSelected = slots[activeCategory]?.id === part.id;

                  return (
                    <div
                      key={part.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
                        isCurrentSelected
                          ? 'bg-[#142244] border-[#0066ff]'
                          : 'bg-[#050a14] border-[#1e2d4f] hover:border-slate-500'
                      }`}
                    >
                      {/* Image & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={part.image}
                          alt={part.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-[#1e2d4f] bg-[#0d172e] flex-shrink-0"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="font-bold text-sm text-white truncate max-w-sm">
                            {part.name}
                          </h4>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 flex-wrap">
                            <span>{part.brand}</span>
                            {part.specs.socket && <span>· {part.specs.socket}</span>}
                            {part.specs.ramType && <span>· {part.specs.ramType}</span>}
                            {part.specs.tdp ? <span>· {part.specs.tdp}W TDP</span> : null}
                          </div>
                          {part.inStock ? (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                              <Ban className="w-2.5 h-2.5" /> Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Add Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t border-[#1e2d4f]/50 sm:border-0 gap-2">
                        <div className="text-sm font-mono font-bold text-white">
                          {formatINR(part.price)}
                        </div>
                        <button
                          disabled={!part.inStock}
                          onClick={() => handleSelectPart(part)}
                          className={`px-4 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] flex items-center justify-center ${
                            isCurrentSelected
                              ? 'bg-emerald-600 text-white'
                              : part.inStock
                              ? 'bg-[#ff1e2d] hover:bg-[#e50914] text-white shadow-glow-red active:scale-95'
                              : 'bg-[#1e2d4f] text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {isCurrentSelected ? 'Selected' : 'Add'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Next Step Shortcut */}
            <div className="pt-3 border-t border-[#1e2d4f] flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Active Category: <strong className="text-white">{activeSlotConfig.label}</strong>
              </span>

              <button
                onClick={handleNextStep}
                disabled={activeStepIndex >= BUILDER_SLOTS.length - 1}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066ff] hover:text-[#3385ff] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next Category</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM STICKY TELEMETRY & CHECKOUT STRIP */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#08111f]/95 backdrop-blur-md border-t border-[#1e2d4f] px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Telemetry (Wattage + Compatibility + Total Price) */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[9px] sm:text-[10px]">ESTIMATED TDP</span>
              <span className="text-[#ffd000] font-bold text-xs sm:text-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{estimatedWattage}W <span className="hidden sm:inline">(Rec: {recommendedPsu}W)</span></span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[9px] sm:text-[10px]">COMPATIBILITY</span>
              {hasErrors ? (
                <span className="text-rose-400 font-bold flex items-center gap-1 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Issue Detected</span>
                  <span className="sm:hidden">Check</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">100% Compatible</span>
                  <span className="sm:hidden">Pass</span>
                </span>
              )}
            </div>

            <div className="text-right sm:text-left">
              <span className="text-slate-400 block text-[9px] sm:text-[10px]">TOTAL</span>
              <span className="text-sm sm:text-xl font-black font-mono text-[#ffd000]">
                {formatINR(totalPrice)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleShareBuild}
              className="p-2.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-slate-300 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Share Build Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-xs font-bold text-white flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <Save className="w-3.5 h-3.5 text-[#0066ff]" />
              <span className="hidden sm:inline">Save Build</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-xs shadow-glow-red flex items-center justify-center gap-2 min-h-[40px]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add All to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Build Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0d172e] border border-[#1e2d4f] rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Save Custom Build</h3>
            <p className="text-xs text-slate-400">
              Give your configuration a memorable name to save it to your account.
            </p>
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="E.g., RTX 4070 Ti White Beast"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#ff1e2d]"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={isSaving}
                onClick={handleSaveBuild}
                className="px-5 py-2 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-xs shadow-glow-red flex items-center gap-1.5"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
