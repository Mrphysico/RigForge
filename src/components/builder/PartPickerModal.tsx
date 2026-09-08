import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Check, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  Layers, 
  Star,
  Ban
} from 'lucide-react';
import { ComponentCategory, Product } from '../../types/hardware';
import { MOCK_PRODUCTS, CATEGORY_LABELS } from '../../data/mockHardware';
import { useBuilderStore } from '../../store/useBuilderStore';
import { formatINR } from '../../utils/formatCurrency';

interface PartPickerModalProps {
  category: ComponentCategory | null;
  onClose: () => void;
  onSelect: (category: ComponentCategory, product: Product) => void;
}

export const PartPickerModal: React.FC<PartPickerModalProps> = ({
  category,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const slots = useBuilderStore((state) => state.slots);

  if (!category) return null;

  // Filter products matching current category
  const categoryProducts = MOCK_PRODUCTS.filter((p) => p.category === category);

  const filteredProducts = categoryProducts.filter((product) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      (product.specs.socket && product.specs.socket.toLowerCase().includes(term))
    );
  });

  // Calculate compatibility preview for a specific candidate product
  const getCandidateCompatibility = (candidate: Product) => {
    // 1. If choosing CPU, check existing Motherboard socket
    if (category === 'cpu' && slots.motherboard?.specs.socket) {
      if (candidate.specs.socket !== slots.motherboard.specs.socket) {
        return {
          compatible: false,
          note: `Incompatible with selected ${slots.motherboard.name} (${slots.motherboard.specs.socket})`,
        };
      }
      return {
        compatible: true,
        note: `Compatible with your ${slots.motherboard.specs.socket} motherboard`,
      };
    }

    // 2. If choosing Motherboard, check existing CPU socket
    if (category === 'motherboard' && slots.cpu?.specs.socket) {
      if (candidate.specs.socket !== slots.cpu.specs.socket) {
        return {
          compatible: false,
          note: `Incompatible socket with ${slots.cpu.name} (${slots.cpu.specs.socket})`,
        };
      }
      return {
        compatible: true,
        note: `Matches your ${slots.cpu.specs.socket} CPU socket`,
      };
    }

    // 3. If choosing RAM, check existing Motherboard supported RAM standard
    if (category === 'ram' && slots.motherboard?.specs.supportedRamType) {
      if (candidate.specs.ramType !== slots.motherboard.specs.supportedRamType) {
        return {
          compatible: false,
          note: `Mismatch: Mobo requires ${slots.motherboard.specs.supportedRamType}`,
        };
      }
      return {
        compatible: true,
        note: `Compatible ${slots.motherboard.specs.supportedRamType} RAM`,
      };
    }

    return { compatible: true, note: null };
  };

  const currentSelectedId = slots[category]?.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              PC Configurator Indian Inventory
            </div>
            <h3 className="text-lg font-bold text-white">
              Choose {CATEGORY_LABELS[category] || category.toUpperCase()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input inside modal */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${CATEGORY_LABELS[category]} by model, brand, or spec...`}
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-900 text-zinc-200 placeholder-zinc-500 rounded-lg border border-zinc-800 focus:outline-none focus:border-cyan-500"
              autoFocus
            />
          </div>
        </div>

        {/* Component list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No matching components found for "{searchTerm}".
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isSelected = product.id === currentSelectedId;
              const isOutOfStock = !product.inStock;
              const compat = getCandidateCompatibility(product);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (!isOutOfStock) {
                      onSelect(category, product);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isOutOfStock
                      ? 'opacity-60 bg-zinc-950/60 border-zinc-850 cursor-not-allowed'
                      : isSelected
                      ? 'bg-cyan-950/20 border-cyan-500 shadow-glow-cyan cursor-pointer'
                      : compat.compatible
                      ? 'bg-zinc-900/50 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer'
                      : 'bg-red-950/10 border-red-900/40 hover:border-red-700/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-16 h-16 rounded-lg object-cover border border-zinc-800 bg-zinc-950 flex-shrink-0 ${
                        isOutOfStock ? 'grayscale' : ''
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-zinc-400">{product.brand}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-zinc-300 font-medium">{product.rating}</span>
                        </div>

                        {/* Out of stock label badge */}
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-mono bg-red-950/90 text-red-400 border border-red-500/40 font-bold">
                            <Ban className="w-3 h-3" />
                            [Out of Stock]
                          </span>
                        ) : (
                          compat.note && (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-mono ${
                                compat.compatible
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {compat.compatible ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {compat.note}
                            </span>
                          )
                        )}
                      </div>

                      <h4 className={`text-sm font-bold truncate max-w-md ${isOutOfStock ? 'text-zinc-400' : 'text-white'}`}>
                        {product.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {product.specs.socket && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            {product.specs.socket}
                          </span>
                        )}
                        {product.specs.tdp && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {product.specs.tdp}W TDP
                          </span>
                        )}
                        {product.specs.wattage && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {product.specs.wattage}W
                          </span>
                        )}
                        {product.specs.ramType && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-300 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {product.specs.ramType}
                          </span>
                        )}
                        {product.specs.vram && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-purple-300">
                            {product.specs.vram}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price & Selection button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <span className={`text-base font-mono font-bold ${isOutOfStock ? 'text-zinc-500' : 'text-white'}`}>
                      {formatINR(product.price)}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isOutOfStock
                          ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                          : isSelected
                          ? 'bg-cyan-500 text-zinc-950 font-bold'
                          : 'bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 text-white'
                      }`}
                    >
                      {isOutOfStock ? (
                        <>
                          <Ban className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </>
                      ) : isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Installed</span>
                        </>
                      ) : (
                        <span>Select Part</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
