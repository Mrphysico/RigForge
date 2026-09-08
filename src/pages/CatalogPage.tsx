import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Layers,
  MessageSquare
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORY_LABELS } from '../data/mockHardware';
import { ProductCard } from '../components/products/ProductCard';
import { FilterSidebar, FilterState } from '../components/products/FilterSidebar';
import { ComponentCategory } from '../types/hardware';
import { formatINR } from '../utils/formatCurrency';

interface CatalogPageProps {
  initialCategory?: ComponentCategory | 'all';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNotification: (msg: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory = 'all',
  searchQuery,
  onSearchChange,
  onNotification,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    search: searchQuery,
    maxPrice: 200000,
    socket: 'all',
    ramType: 'all',
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Keep internal search synced with prop
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  // Keep initial category synced if passed externally
  React.useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      maxPrice: 200000,
      socket: 'all',
      ramType: 'all',
      inStockOnly: false,
      sortBy: 'featured',
    });
    onSearchChange('');
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Search Query filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSocket = product.specs.socket?.toLowerCase().includes(query);
        const matchesChipset = product.specs.chipset?.toLowerCase().includes(query);
        const matchesDescription = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSocket && !matchesChipset && !matchesDescription) {
          return false;
        }
      }

      // Max Price filter
      if (product.price > filters.maxPrice) {
        return false;
      }

      // Socket filter
      if (filters.socket !== 'all') {
        if (product.specs.socket && product.specs.socket !== filters.socket) {
          return false;
        }
      }

      // RAM Type filter
      if (filters.ramType !== 'all') {
        if (product.specs.ramType && product.specs.ramType !== filters.ramType) {
          return false;
        }
        if (product.specs.supportedRamType && product.specs.supportedRamType !== filters.ramType) {
          return false;
        }
      }

      // In-stock only filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      // Default: in-stock first, then featured, then rating
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Indian Retail Hardware Database</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            PC Parts &amp; Hardware Catalog
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse verified components benchmarked against Indian retailers (MDComputers, Vedant, PrimeABGB, EliteHubs).
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 text-sm font-semibold text-white border border-zinc-700 self-start"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span>Filters ({filteredProducts.length})</span>
        </button>
      </div>

      {/* Real-time Search Input & In-Stock Quick Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => {
              handleFilterChange({ search: e.target.value });
              onSearchChange(e.target.value);
            }}
            placeholder="Search by model name, brand, or chipset..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-900 text-zinc-200 placeholder-zinc-500 rounded-xl border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => {
                handleFilterChange({ search: '' });
                onSearchChange('');
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4 px-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-zinc-200 select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => handleFilterChange({ inStockOnly: e.target.checked })}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-zinc-950"
            />
            <span>Show In-Stock Only</span>
          </label>
        </div>
      </div>

      {/* Active Filter Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.category !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Category: {CATEGORY_LABELS[filters.category] || filters.category}
            <button
              onClick={() => handleFilterChange({ category: 'all' })}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.search && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Query: "{filters.search}"
            <button
              onClick={() => {
                handleFilterChange({ search: '' });
                onSearchChange('');
              }}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.inStockOnly && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            In-Stock Only
            <button
              onClick={() => handleFilterChange({ inStockOnly: false })}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.socket !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Socket: {filters.socket}
            <button
              onClick={() => handleFilterChange({ socket: 'all' })}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.ramType !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Memory: {filters.ramType}
            <button
              onClick={() => handleFilterChange({ ramType: 'all' })}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.maxPrice < 200000 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Under {formatINR(filters.maxPrice)}
            <button
              onClick={() => handleFilterChange({ maxPrice: 200000 })}
              className="hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {(filters.category !== 'all' || filters.search || filters.socket !== 'all' || filters.ramType !== 'all' || filters.maxPrice < 200000 || filters.inStockOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-zinc-400 hover:text-white underline underline-offset-4 ml-2"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 lg:hidden">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                <h3 className="font-bold text-base text-white">Catalog Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                totalResults={filteredProducts.length}
              />

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-sm"
              >
                Apply Filters &amp; View Results
              </button>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            /* Explicit Indian Inventory Not Found State */
            <div className="py-16 text-center rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                <Search className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-white">
                  No Matching Silicon Found
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  Item not found in our Indian inventory. You can request stock via our contact channel.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                >
                  Reset Filters &amp; Show All
                </button>

                <button
                  onClick={() => onNotification('Stock request registered! Our Indian procurement team has been notified.')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 flex items-center gap-2 shadow-glow-cyan"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request Part Procurement</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNotification={onNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
