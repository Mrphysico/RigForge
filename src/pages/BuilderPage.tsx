import React, { useState } from 'react';
import { 
  Wrench, 
  Trash2, 
  Plus, 
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
  Loader2
} from 'lucide-react';
import { ComponentCategory, Product } from '../types/hardware';
import { BUILDER_SLOTS } from '../data/mockHardware';
import { useBuilderStore } from '../store/useBuilderStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { PartPickerModal } from '../components/builder/PartPickerModal';
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
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  
  const [activePickerSlot, setActivePickerSlot] = useState<ComponentCategory | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [buildName, setBuildName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const estimatedWattage = getEstimatedWattage();
  const recommendedPsu = getRecommendedPsuWattage();
  const totalPrice = getTotalPrice();
  const selectedCount = getSelectedCount();
  const compatibilityIssues = getCompatibilityIssues();
  const hasErrors = compatibilityIssues.some((issue) => issue.severity === 'error');

  const getSlotIcon = (category: ComponentCategory) => {
    switch (category) {
      case 'cpu':
        return <Cpu className="w-5 h-5 text-[#FCA311]" />;
      case 'cooler':
        return <Fan className="w-5 h-5 text-[#FCA311]" />;
      case 'motherboard':
        return <CircuitBoard className="w-5 h-5 text-emerald-400" />;
      case 'ram':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-rose-400" />;
      case 'gpu':
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 'case':
        return <Box className="w-5 h-5 text-zinc-300" />;
      case 'psu':
        return <Zap className="w-5 h-5 text-[#FCA311]" />;
      default:
        return <Wrench className="w-5 h-5 text-zinc-400" />;
    }
  };

  const handleAddEntireBuildToCart = () => {
    const selectedProducts = Object.values(slots).filter((p): p is Product => p !== null);
    if (selectedProducts.length === 0) {
      onNotification('Your build is empty. Select components first.');
      return;
    }

    // Double-check no out-of-stock items slipped in
    const outOfStockItems = selectedProducts.filter((p) => !p.inStock);
    if (outOfStockItems.length > 0) {
      onNotification(`Cannot checkout: ${outOfStockItems[0].name} is currently out of stock.`);
      return;
    }

    addMultipleItems(selectedProducts);
    onNotification(`Added all ${selectedProducts.length} build components to your cart!`);
  };

  const handleShareBuild = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    onNotification('System configuration link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveBuildToCloud = async () => {
    if (!isAuthenticated || !user) {
      onNotification('Please sign in to save your custom rig to your profile.');
      openAuthModal('signin');
      return;
    }

    if (selectedCount === 0) {
      onNotification('Add components to your build before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/builds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: buildName.trim() || `${user.name}'s Custom Battlestation`,
          slots,
          totalPrice,
          estimatedWattage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onNotification(`Build saved successfully to ${user.name}'s account!`);
        setShowSaveDialog(false);
        setBuildName('');
      } else {
        onNotification(data.message || 'Failed to save build.');
      }
    } catch {
      onNotification('Network error saving build. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Max wattage scale for gauge meter (1200W)
  const wattagePercentage = Math.min(100, Math.max(10, (estimatedWattage / 1200) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32 md:pb-20">
      {/* Top Header & Preset Quick Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FCA311] font-bold mb-1">
            <Wrench className="w-3.5 h-3.5" />
            <span>RigForge Indian Hardware Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Custom PC Hardware Builder
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Configure custom gaming rigs with genuine components in stock across Indian retail nodes. Real-time pin compatibility, socket validation, and wattage calculations.
          </p>
        </div>

        {/* Quick presets & reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              loadPresetBuild('enthusiast');
              onNotification('Loaded 1440p / 4K Esports King (Ryzen 7 7800X3D + RTX 4070 Super)');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#151515] text-[#FCA311] border border-[#FCA311]/40 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FCA311]" />
            <span>1440p Esports King</span>
          </button>

          <button
            onClick={() => {
              loadPresetBuild('sweetspot');
              onNotification('Loaded 1080p Value Champion (Ryzen 5 5600 + RX 6600)');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#151515] text-zinc-200 border border-[#262626] hover:border-zinc-500 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>1080p Value Champion</span>
          </button>

          {selectedCount > 0 && (
            <button
              onClick={() => {
                clearBuild();
                onNotification('Cleared current build configuration.');
              }}
              className="p-2.5 rounded-xl text-xs text-zinc-400 hover:text-red-400 hover:bg-[#151515] transition-colors border border-transparent hover:border-[#262626]"
              title="Reset all builder slots"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time System Telemetry, Wattage & Compatibility Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Estimated Wattage & Power Meter */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#0D0D0D] border border-[#262626] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FCA311]" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                  Estimated System Wattage
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#151515] text-zinc-400 border border-[#262626]">
                Peak Load
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {estimatedWattage}
              </span>
              <span className="text-sm font-mono text-[#FCA311] font-bold">WATTS</span>
            </div>

            {/* Wattage bar */}
            <div className="w-full h-2.5 bg-[#151515] rounded-full overflow-hidden mb-3 border border-[#262626]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  estimatedWattage > 700
                    ? 'bg-gradient-to-r from-[#FCA311] via-amber-400 to-red-500'
                    : 'bg-gradient-to-r from-amber-500 to-[#FCA311]'
                }`}
                style={{ width: `${wattagePercentage}%` }}
              />
            </div>

            <div className="text-xs text-zinc-400 space-y-1 bg-[#111111] p-3 rounded-2xl border border-[#262626]">
              <div className="flex justify-between">
                <span>Recommended PSU Rating:</span>
                <span className="font-mono font-bold text-[#FCA311]">
                  {recommendedPsu > 0 ? `${recommendedPsu}W or higher` : 'Select components'}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>Indian Mains Headroom:</span>
                <span className="font-mono text-zinc-400">+35% Transient Spike Buffer</span>
              </div>
            </div>
          </div>

          {slots.psu && (
            <div className="mt-3 text-xs pt-3 border-t border-[#262626] flex items-center justify-between text-zinc-300">
              <span>Selected PSU:</span>
              <span className="font-mono font-bold text-white">
                {slots.psu.specs.wattage}W ({slots.psu.specs.efficiency})
              </span>
            </div>
          )}
        </div>

        {/* Compatibility Matrix Panel */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#0D0D0D] border border-[#262626] flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {hasErrors ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                  Compatibility Matrix
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  hasErrors
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {hasErrors ? 'ACTION REQUIRED' : '100% COMPATIBLE'}
              </span>
            </div>

            {/* Compatibility notes list */}
            {compatibilityIssues.length === 0 ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  No Compatibility Conflicts Detected
                </div>
                <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                  {selectedCount === 0
                    ? 'Begin adding parts to your slots. Sockets (AM5/LGA1700/AM4), TDP, and DDR standards will be validated automatically.'
                    : 'All selected hardware parts have matching physical sockets, RAM standard, and adequate PSU headroom.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {compatibilityIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-xs border ${
                      issue.severity === 'error'
                        ? 'bg-red-950/30 border-red-500/40 text-red-300'
                        : 'bg-[#FCA311]/10 border-[#FCA311]/40 text-[#FCA311]'
                    }`}
                  >
                    <div className="font-bold mb-0.5">{issue.title}</div>
                    <div className="text-[11px] leading-relaxed opacity-90">{issue.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-zinc-400">
            <span>Configured Slots:</span>
            <span className="font-mono font-bold text-white">{selectedCount} / 8 slots filled</span>
          </div>
        </div>

        {/* Pricing Summary & Action CTAs */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#0D0D0D] border border-[#262626] flex flex-col justify-between shadow-xl">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-1">
              Estimated Build Total (INR)
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-mono text-[#FCA311]">
                {formatINR(totalPrice)}
              </span>
              <span className="text-xs text-zinc-400 font-mono">INC. 18% GST</span>
            </div>

            <div className="text-xs text-zinc-400 space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Components Selected:</span>
                <span className="font-mono text-zinc-200">{selectedCount} items</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Courier Delivery:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {totalPrice >= 10000 ? 'FREE (BlueDart Express)' : '₹499'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAddEntireBuildToCart}
              disabled={selectedCount === 0 || hasErrors}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                selectedCount > 0 && !hasErrors
                  ? 'bg-[#FCA311] hover:bg-[#e5920a] text-black shadow-glow-orange cursor-pointer'
                  : 'bg-[#151515] text-zinc-500 cursor-not-allowed border border-[#262626]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Entire Build to Cart ({selectedCount})</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                disabled={selectedCount === 0}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#151515] text-zinc-300 hover:text-[#FCA311] border border-[#262626] hover:border-[#FCA311]/40 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3.5 h-3.5 text-[#FCA311]" />
                <span>Save Build</span>
              </button>

              <button
                onClick={handleShareBuild}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#151515] text-zinc-300 hover:text-white border border-[#262626] flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Share Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Build Modal Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Save className="w-5 h-5 text-[#FCA311]" />
              <h3 className="text-lg font-bold text-white">Save Custom Rig to Account</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Save your rig configuration to your private account for fast loading, sharing, and future upgrades.
            </p>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">
                Build Name
              </label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder={user ? `${user.name}'s Custom Rig` : 'e.g., Ultra 4K Battlestation'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#151515] border border-[#262626] text-white text-sm focus:outline-none focus:border-[#FCA311]"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#151515] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBuildToCloud}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FCA311] hover:bg-[#e5920a] text-black shadow-glow-orange flex items-center gap-1.5 transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Confirm & Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Component Checklist Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Component Architecture Checklist</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Click any slot to select, swap, or configure hardware</p>
          </div>
          <span className="text-xs font-mono text-[#FCA311] font-semibold hidden sm:inline-block">
            {selectedCount} / 8 Slots Configured
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {BUILDER_SLOTS.map((slot) => {
            const product = slots[slot.category];
            const isOutOfStock = product && !product.inStock;

            return (
              <div
                key={slot.category}
                className={`p-4 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isOutOfStock
                    ? 'bg-red-950/20 border-red-900/40'
                    : product
                    ? 'bg-[#0D0D0D] border-[#262626] hover:border-[#FCA311]/50'
                    : 'bg-[#0D0D0D]/40 border-dashed border-[#262626] hover:border-zinc-600'
                }`}
              >
                {/* Left slot info and product preview */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#262626] flex items-center justify-center flex-shrink-0">
                    {getSlotIcon(slot.category)}
                  </div>

                  {product ? (
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-12 h-12 rounded-xl object-cover border border-[#262626] bg-black hidden sm:block flex-shrink-0 ${
                          isOutOfStock ? 'grayscale' : ''
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FCA311] font-bold">
                            {slot.label}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">· {product.brand}</span>
                          {isOutOfStock && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-red-950 text-red-400 border border-red-500/40">
                              <Ban className="w-2.5 h-2.5" /> Out of Stock
                            </span>
                          )}
                        </div>
                        <h3 className={`text-sm font-bold truncate max-w-md ${isOutOfStock ? 'text-zinc-400' : 'text-white'}`} title={product.name}>
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {product.specs.socket && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151515] text-[#FCA311] border border-[#262626]">
                              {product.specs.socket}
                            </span>
                          )}
                          {product.specs.tdp && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151515] text-amber-300 border border-[#262626]">
                              {product.specs.tdp}W TDP
                            </span>
                          )}
                          {product.specs.wattage && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151515] text-amber-300 border border-[#262626]">
                              {product.specs.wattage}W
                            </span>
                          )}
                          {product.specs.ramType && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151515] text-emerald-300 border border-[#262626]">
                              {product.specs.ramType}
                            </span>
                          )}
                          {product.specs.vram && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151515] text-purple-300 border border-[#262626]">
                              {product.specs.vram}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                          {slot.label}
                        </span>
                        {slot.required && (
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Required</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{slot.sublabel}</p>
                    </div>
                  )}
                </div>

                {/* Right controls: Price, Choose/Change, Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                  {product ? (
                    <div className="text-right">
                      <span className={`text-base font-mono font-bold block ${isOutOfStock ? 'text-zinc-500' : 'text-white'}`}>
                        {formatINR(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-mono text-zinc-500">Unselected</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePickerSlot(slot.category)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                        product
                          ? 'bg-[#151515] hover:bg-[#202020] text-zinc-200 border border-[#262626] hover:border-zinc-500'
                          : 'bg-[#FCA311]/10 hover:bg-[#FCA311] hover:text-black text-[#FCA311] border border-[#FCA311]/40'
                      }`}
                    >
                      {product ? (
                        <span>Change</span>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Choose Part</span>
                        </>
                      )}
                    </button>

                    {product && (
                      <button
                        onClick={() => removeSlot(slot.category)}
                        className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-[#151515] transition-colors"
                        title="Remove component from slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#262626] p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {selectedCount} / 8 Parts
          </div>
          <div className="text-lg font-extrabold font-mono text-[#FCA311]">
            {formatINR(totalPrice)}
          </div>
        </div>

        <button
          onClick={handleAddEntireBuildToCart}
          disabled={selectedCount === 0 || hasErrors}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 min-h-[44px] ${
            selectedCount > 0 && !hasErrors
              ? 'bg-[#FCA311] hover:bg-[#e5920a] text-black shadow-glow-orange cursor-pointer'
              : 'bg-[#151515] text-zinc-500 cursor-not-allowed border border-[#262626]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Checkout Rig</span>
        </button>
      </div>

      {/* Component Picker Modal */}
      {activePickerSlot && (
        <PartPickerModal
          category={activePickerSlot}
          onClose={() => setActivePickerSlot(null)}
          onSelect={(category, product) => {
            setSlot(category, product);
            setActivePickerSlot(null);
            onNotification(`Installed ${product.name} in [${category.toUpperCase()}] slot.`);
          }}
        />
      )}
    </div>
  );
};
