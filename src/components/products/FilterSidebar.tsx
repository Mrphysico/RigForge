import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Cpu, 
  Fan, 
  Layers, 
  HardDrive, 
  Monitor, 
  Box, 
  Zap, 
  CircuitBoard
} from 'lucide-react';
import { ComponentCategory } from '../../types/hardware';
import { formatINR } from '../../utils/formatCurrency';

export interface FilterState {
  category: ComponentCategory | 'all';
  search: string;
  maxPrice: number;
  socket: string;
  ramType: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const categories: { id: ComponentCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Components', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'cpu', label: 'Processors (CPU)', icon: <Cpu className="w-4 h-4" /> },
    { id: 'gpu', label: 'Graphics Cards', icon: <Monitor className="w-4 h-4" /> },
    { id: 'motherboard', label: 'Motherboards', icon: <CircuitBoard className="w-4 h-4" /> },
    { id: 'ram', label: 'Memory (RAM)', icon: <Layers className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage (SSD)', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'cooler', label: 'Coolers & AIOs', icon: <Fan className="w-4 h-4" /> },
    { id: 'case', label: 'Cabinets / Cases', icon: <Box className="w-4 h-4" /> },
    { id: 'psu', label: 'Power Supplies', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#26365a]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#FCA311]" />
          <h3 className="font-bold text-sm text-white">Hardware Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#A0A0A0] hover:text-[#FCA311] flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="text-xs text-[#A0A0A0] font-mono">
        Showing <span className="text-[#FCA311] font-bold">{totalResults}</span> matched items
      </div>

      {/* In-Stock Only Toggle Switch */}
      <div className="p-3 rounded-2xl bg-[#16223f] border border-[#26365a]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-semibold text-zinc-200">Show In-Stock Only</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#1e2d4f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FCA311]"></div>
          </div>
        </label>
      </div>

      {/* Category selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0] font-semibold block">
          Component Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                filters.category === cat.id
                  ? 'bg-[#FCA311]/15 text-[#FCA311] border border-[#FCA311]/30 font-bold shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1e2d4f] border border-transparent'
              }`}
            >
              <span className={filters.category === cat.id ? 'text-[#FCA311]' : 'text-zinc-400'}>
                {cat.icon}
              </span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Range Slider (INR) */}
      <div className="space-y-3 pt-4 border-t border-[#26365a]">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono uppercase tracking-wider text-[#A0A0A0] font-semibold">
            Max Budget
          </span>
          <span className="font-mono text-[#FCA311] font-bold text-sm">
            {formatINR(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="2000"
          max="200000"
          step="2000"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#FCA311] cursor-pointer bg-[#1e2d4f] h-1.5 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-[#A0A0A0] font-mono">
          <span>₹2K</span>
          <span>₹1 Lakh</span>
          <span>₹2 Lakh</span>
        </div>
      </div>

      {/* Socket Filter (AM5, LGA1700, AM4) */}
      <div className="space-y-2 pt-4 border-t border-[#26365a]">
        <label className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0] font-semibold block">
          Processor Socket
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {['all', 'AM5', 'LGA1700', 'AM4'].map((sock) => (
            <button
              key={sock}
              onClick={() => onFilterChange({ socket: sock })}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center ${
                filters.socket === sock
                  ? 'bg-[#FCA311]/20 text-[#FCA311] border border-[#FCA311]/40 font-bold'
                  : 'bg-[#131d38] text-[#A0A0A0] hover:text-white border border-[#26365a]'
              }`}
            >
              {sock === 'all' ? 'All Sockets' : sock}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Generation Filter */}
      <div className="space-y-2 pt-4 border-t border-[#26365a]">
        <label className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0] font-semibold block">
          Memory Standard (DDR)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {['all', 'DDR5', 'DDR4'].map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange({ ramType: type })}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all text-center ${
                filters.ramType === type
                  ? 'bg-[#FCA311]/20 text-[#FCA311] border border-[#FCA311]/40 font-bold'
                  : 'bg-[#131d38] text-[#A0A0A0] hover:text-white border border-[#26365a]'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2 pt-4 border-t border-[#26365a]">
        <label className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0] font-semibold block">
          Sort Catalog
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          className="w-full py-2.5 px-3 bg-[#131d38] text-white text-xs rounded-xl border border-[#26365a] focus:outline-none focus:border-[#FCA311]"
        >
          <option value="featured">Featured / Best Value</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
        </select>
      </div>
    </aside>
  );
};
