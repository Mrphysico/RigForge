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

      // Memory Type filter
      if (filters.ramType !== 'all') {
        if (product.specs.ramType && product.specs.ramType !== filters.ramType) {
          return false;
        }
        if (product.specs.supportedRamType && product.specs.supportedRamType !== filters.ramType) {
          return false;
        }
      }

      // In stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FCA311] font-bold mb-1">
            <Layers className="w-4 h-4" />
            <span>Verified Indian Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            PC Component Catalog
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 max-w-xl leading-relaxed">
            All prices in INR including 18% GST. Backed by authorized national distributor warranty across India.
          </p>
        </div>

        {/* Mobile Filter Drawer Trigger */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#111111] border border-[#262626] text-xs font-bold text-[#FCA311] self-start sm:self-auto shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters ({filteredProducts.length})</span>
        </button>
      </div>

      {/* Active Filter Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.category !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 font-semibold">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 font-semibold">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 font-semibold">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 font-semibold">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 font-semibold">
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
            className="text-xs text-[#A0A0A0] hover:text-white underline underline-offset-4 ml-2"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 p-5 rounded-2xl bg-[#111111] border border-[#262626] backdrop-blur-md">
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
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 lg:hidden animate-fadeIn">
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#262626] space-y-4 max-w-lg mx-auto max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-[#262626]">
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
                className="w-full py-3 rounded-xl bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 font-bold text-sm shadow-glow-orange"
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
            <div className="py-16 text-center rounded-2xl bg-[#111111]/40 border border-dashed border-[#262626] p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#262626] flex items-center justify-center text-zinc-500 mx-auto">
                <Search className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-white">
                  No Matching Silicon Found
                </h3>
                <p className="text-sm text-[#A0A0A0] leading-relaxed font-sans">
                  Item not found in our Indian inventory. You can request stock via our contact channel.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151515] hover:bg-[#1F1F1F] text-white border border-[#262626] transition-colors"
                >
                  Reset Filters &amp; Show All
                </button>

                <button
                  onClick={() => onNotification('Stock request registered! Our Indian procurement team has been notified.')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FCA311] hover:bg-[#E59200] text-zinc-950 flex items-center gap-2 shadow-glow-orange"
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
