import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Sparkles, 
  SlidersHorizontal,
  Cpu, 
  CircuitBoard, 
  Layers, 
  HardDrive, 
  HardDriveDownload,
  Zap, 
  Box, 
  Wind, 
  Droplets, 
  Fan, 
  Thermometer, 
  Tv, 
  Keyboard, 
  Mouse,
  Layers3
} from 'lucide-react';
import { CATALOGUE_PRODUCTS, CatalogueRecord } from '../data/catalogue/catalogueData';
import { CATALOGUE_CATEGORIES_META } from '../types/catalogue';
import { ComponentCategory } from '../types/hardware';
import { MarketplaceProductCard } from '../components/marketplace/MarketplaceProductCard';
import { CatalogueFilters, FilterState } from '../components/marketplace/CatalogueFilters';
import { ProductDetailModal } from '../components/marketplace/ProductDetailModal';
import { useCartStore } from '../store/useCartStore';

interface CatalogPageProps {
  initialCategory?: ComponentCategory | 'all';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNotification: (msg: string) => void;
}

// Icon mapper for category pills
const getCategoryPillIcon = (catId: string) => {
  switch (catId) {
    case 'all': return <Sparkles className="w-3.5 h-3.5" />;
    case 'cpu': return <Cpu className="w-3.5 h-3.5" />;
    case 'gpu': return <Tv className="w-3.5 h-3.5" />;
    case 'motherboard': return <CircuitBoard className="w-3.5 h-3.5" />;
    case 'ram': return <Layers className="w-3.5 h-3.5" />;
    case 'nvme_ssd': return <HardDriveDownload className="w-3.5 h-3.5" />;
    case 'sata_ssd': return <Layers3 className="w-3.5 h-3.5" />;
    case 'hdd': return <HardDrive className="w-3.5 h-3.5" />;
    case 'psu': return <Zap className="w-3.5 h-3.5" />;
    case 'case': return <Box className="w-3.5 h-3.5" />;
    case 'air_cooler': return <Wind className="w-3.5 h-3.5" />;
    case 'aio_cooler': return <Droplets className="w-3.5 h-3.5" />;
    case 'case_fans': return <Fan className="w-3.5 h-3.5" />;
    case 'thermal_paste': return <Thermometer className="w-3.5 h-3.5" />;
    case 'monitor': return <Tv className="w-3.5 h-3.5" />;
    case 'keyboard': return <Keyboard className="w-3.5 h-3.5" />;
    case 'mouse': return <Mouse className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
};

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory = 'all',
  searchQuery,
  onSearchChange,
  onNotification,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>(initialCategory);
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest' | 'popular' | 'brand-asc' | 'in-stock'
  >('featured');
  const [selectedProductForModal, setSelectedProductForModal] = useState<CatalogueRecord | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync initialCategory prop if passed or updated from parent
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const openCart = useCartStore((state) => state.openCart);
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  // Calculate dynamic price boundaries from all catalogue products
  const priceBounds = useMemo(() => {
    const validPrices = CATALOGUE_PRODUCTS.map((p) => p.price).filter((p): p is number => p !== null && !isNaN(p));
    return {
      min: validPrices.length ? Math.min(...validPrices) : 500,
      max: validPrices.length ? Math.max(...validPrices) : 250000,
    };
  }, []);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
    inStockOnly: false,
    selectedBrands: [],
    attributes: {},
  });

  // Calculate item count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CATALOGUE_PRODUCTS.length };
    CATALOGUE_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Compute available brands for the currently active category
  const availableBrands = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    const relevantProducts = selectedCategory === 'all' 
      ? CATALOGUE_PRODUCTS 
      : CATALOGUE_PRODUCTS.filter((p) => p.category === selectedCategory);

    relevantProducts.forEach((p) => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });

    return Object.entries(brandCounts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [selectedCategory]);

  // Reset filters handler
  const handleResetFilters = () => {
    setFilterState({
      minPrice: priceBounds.min,
      maxPrice: priceBounds.max,
      inStockOnly: false,
      selectedBrands: [],
      attributes: {},
    });
  };

  // Switch category: reset category-specific attribute filters
  const handleSelectCategory = (catId: ComponentCategory | 'all') => {
    setSelectedCategory(catId);
    setFilterState((prev) => ({
      ...prev,
      selectedBrands: [],
      attributes: {},
    }));
  };

  // Main filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = CATALOGUE_PRODUCTS.filter((product) => {
      // 1. Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Search query filter across name, brand, model, series, category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const details = product.catalogueDetails as any;
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesModel = details?.model?.toLowerCase().includes(query);
        const matchesSeries = (details?.seriesGeneration || details?.series || details?.gpuFamily)?.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSpecs = product.keySpecsSummary?.some((s) => s.toLowerCase().includes(query));

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesModel && !matchesSeries && !matchesDesc && !matchesSpecs) {
          return false;
        }
      }

      // 3. In stock only
      if (filterState.inStockOnly) {
        const stockStatus = product.stockStatus || product.catalogueDetails?.stockStatus || (product.inStock ? 'In Stock' : 'Out of Stock');
        const isAvailable = stockStatus === 'In Stock' || stockStatus === 'Limited Stock' || product.inStock;
        if (!isAvailable) return false;
      }

      // 4. Price range
      if (product.price !== null && product.price > filterState.maxPrice) {
        return false;
      }

      // 5. Brand filter
      if (filterState.selectedBrands.length > 0) {
        if (!filterState.selectedBrands.includes(product.brand)) {
          return false;
        }
      }

      // 6. Dynamic category attribute filters
      const details = product.catalogueDetails as any;
      if (details) {
        for (const [attrKey, selectedValues] of Object.entries(filterState.attributes)) {
          if (selectedValues.length === 0) continue;

          // Check if attribute matches
          if (attrKey === 'socket') {
            const socketVal = details.socket || (Array.isArray(details.socketCompatibility) ? details.socketCompatibility.join(' ') : '');
            const matches = selectedValues.some((v) => socketVal.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'seriesGeneration') {
            const matches = selectedValues.some((v) => details.seriesGeneration?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'cores') {
            const coresVal = details.cores;
            const matches = selectedValues.some((v) => {
              if (v.includes('6')) return coresVal === 6;
              if (v.includes('8')) return coresVal === 8;
              if (v.includes('14+')) return coresVal >= 14;
              if (v.includes('24')) return coresVal === 24;
              return true;
            });
            if (!matches) return false;
          } else if (attrKey === 'integratedGraphics') {
            const hasGpu = details.integratedGraphics && !details.integratedGraphics.toLowerCase().includes('discrete') && !details.integratedGraphics.toLowerCase().includes('requires');
            const matches = selectedValues.some((v) => (v.includes('Included') ? hasGpu : !hasGpu));
            if (!matches) return false;
          } else if (attrKey === 'manufacturer') {
            const maker = details.manufacturer || product.brand;
            const matches = selectedValues.some((v) => maker.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'vramCapacity') {
            const matches = selectedValues.some((v) => details.vramCapacity?.includes(v));
            if (!matches) return false;
          } else if (attrKey === 'boardPartner') {
            const matches = selectedValues.some((v) => details.boardPartner?.toLowerCase().includes(v.toLowerCase()) || product.brand.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'generation') {
            const matches = selectedValues.some((v) => details.generation?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'chipset') {
            const matches = selectedValues.some((v) => details.chipset?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'formFactor') {
            const matches = selectedValues.some((v) => details.formFactor?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'ramGenerationSupported') {
            const matches = selectedValues.some((v) => details.ramGenerationSupported?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'wattage') {
            const psuWattage = details.wattage;
            const matches = selectedValues.some((v) => {
              if (v.includes('650W')) return psuWattage <= 650;
              if (v.includes('750W')) return psuWattage >= 750 && psuWattage <= 850;
              if (v.includes('1000W+')) return psuWattage >= 1000;
              return true;
            });
            if (!matches) return false;
          } else if (attrKey === 'efficiency') {
            const matches = selectedValues.some((v) => details.efficiencyRating?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'modularity') {
            const matches = selectedValues.some((v) => details.modularity?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'radiatorSize') {
            const matches = selectedValues.some((v) => details.radiatorSize?.includes(v));
            if (!matches) return false;
          } else if (attrKey === 'layout') {
            const matches = selectedValues.some((v) => details.layout?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'switchType') {
            const matches = selectedValues.some((v) => details.switchType?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'panelType') {
            const matches = selectedValues.some((v) => details.panelType?.toLowerCase().includes(v.toLowerCase()));
            if (!matches) return false;
          } else if (attrKey === 'refreshRate') {
            const matches = selectedValues.some((v) => details.refreshRateHz && v.includes(String(details.refreshRateHz)));
            if (!matches) return false;
          }
        }
      }

      return true;
    });

    // Sorting options: Low-High, High-Low, Newest, Popular, Brand A-Z, Discount, In Stock
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
      case 'newest':
        result.sort((a, b) => (((b.catalogueDetails as any)?.launchDate ? 1 : 0) - ((a.catalogueDetails as any)?.launchDate ? 1 : 0)));
        break;
      case 'brand-asc':
        result.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case 'popular':
      case 'rating':
        result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'discount':
        result.sort((a, b) => {
          const discountA = a.mrp && a.price && a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0;
          const discountB = b.mrp && b.price && b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0;
          return discountB - discountA;
        });
        break;
      case 'in-stock':
        result.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, filterState, sortBy]);

  // Current category metadata
  const currentCategoryMeta = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATALOGUE_CATEGORIES_META.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pb-24 bg-[#050a14] text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#081120] to-[#050a14] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#ff1e2d] text-xs font-mono font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>16-CATEGORY VERIFIED HARDWARE CATALOGUE</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase font-heading">
                RIGFORGE <span className="text-[#ff1e2d]">MARKETPLACE</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
                Explore real desktop hardware across all 16 component categories. Official Indian retail warranty, verified GST invoices, and live prices.
              </p>
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-white font-bold text-xs shadow-lg transition-all flex-shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-[#ff1e2d]" />
              <span>Cart ({totalCartItems})</span>
            </button>
          </div>

          {/* Top Quick Navigation Pills */}
          <div className="mt-8 border-t border-[#1e2d4f] pt-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
              {/* All Gear Pill */}
              <button
                onClick={() => handleSelectCategory('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'bg-[#0b1324] text-slate-300 hover:text-white hover:bg-[#142244] border border-[#1e2d4f]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Gear</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  selectedCategory === 'all' ? 'bg-black/30 text-white' : 'bg-[#142244] text-slate-400'
                }`}>
                  {categoryCounts['all']}
                </span>
              </button>

              {/* 16 Category Navigation Pills */}
              {CATALOGUE_CATEGORIES_META.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#ff1e2d] text-white shadow-glow-red font-bold'
                        : 'bg-[#0b1324] text-slate-300 hover:text-white hover:bg-[#142244] border border-[#1e2d4f]'
                    }`}
                  >
                    {getCategoryPillIcon(cat.id)}
                    <span>{cat.shortLabel}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-[#142244] text-slate-400'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Category Description Banner (when a specific category is active) */}
            {currentCategoryMeta && (
              <div className="mt-3 py-3 px-4 rounded-xl bg-[#091122]/90 border border-[#1e2d4f] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="font-bold text-white uppercase font-mono text-sm">{currentCategoryMeta.name}:</span>
                  <span className="text-slate-400">{currentCategoryMeta.description}</span>
                </div>
                <span className="text-[11px] font-mono text-[#ff1e2d] font-semibold flex-shrink-0">
                  {categoryCounts[currentCategoryMeta.id] || 0} Models Listed
                </span>
              </div>
            )}
          </div>

          {/* Search bar, Sort & Mobile Drawer Trigger */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
            {/* Search Input across Name, Brand, Model, Series, Category */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search RTX 5090, 7800X3D, B650, 6000MHz..."
                className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm bg-[#0b1324] text-white placeholder-slate-400 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#ff1e2d] min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Controls: Mobile Drawer Trigger & Sort Dropdown */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Drawer Trigger (Categories & Filters) */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b1324] hover:bg-[#142244] border border-[#1e2d4f] text-xs font-bold text-white min-h-[44px]"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#ff1e2d]" />
                <span>Categories & Filters</span>
              </button>

              {/* In-Stock Fast Toggle (Desktop) */}
              <label className="hidden sm:flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none min-h-[40px]">
                <input
                  type="checkbox"
                  checked={filterState.inStockOnly}
                  onChange={() => setFilterState((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
                  className="rounded border-[#1e2d4f] bg-[#0b1324] text-[#ff1e2d] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              {/* Comprehensive Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl bg-[#0b1324] border border-[#1e2d4f] text-xs font-semibold text-white focus:outline-none focus:border-[#ff1e2d] min-h-[44px] cursor-pointer"
                >
                  <option value="featured">Popular / Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="newest">Newest Releases</option>
                  <option value="brand-asc">Brand: A → Z</option>
                  <option value="discount">Biggest Discount (%)</option>
                  <option value="in-stock">In Stock First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Left Sidebar (Categories + Filters) + Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-start gap-8">
          {/* Left Sidebar Category Navigation & Dynamic Filters */}
          <CatalogueFilters
            category={selectedCategory}
            onSelectCategory={handleSelectCategory}
            categoryCounts={categoryCounts}
            filterState={filterState}
            onFilterChange={setFilterState}
            availableBrands={availableBrands}
            priceBounds={priceBounds}
            onReset={handleResetFilters}
          />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Status Line */}
            <div className="flex items-center justify-between mb-4 text-xs font-mono text-slate-400">
              <span>Showing {filteredProducts.length} verified hardware components</span>
              {searchQuery && <span>Search: "{searchQuery}"</span>}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 px-4 bg-[#081120] rounded-3xl border border-[#1e2d4f] space-y-4">
                <p className="text-slate-300 text-sm font-medium">
                  No components matched your current filters.
                </p>
                <button
                  onClick={() => {
                    handleResetFilters();
                    onSearchChange('');
                    setSelectedCategory('all');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#ff1e2d] hover:bg-[#e00d1b] text-white text-xs font-bold shadow-glow-red transition-all"
                >
                  Reset All Filters & Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <MarketplaceProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(p) => setSelectedProductForModal(p)}
                    onNotification={onNotification}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Modal (Categories & Dynamic Filters) */}
      {isMobileDrawerOpen && (
        <CatalogueFilters
          category={selectedCategory}
          onSelectCategory={handleSelectCategory}
          categoryCounts={categoryCounts}
          filterState={filterState}
          onFilterChange={setFilterState}
          availableBrands={availableBrands}
          priceBounds={priceBounds}
          onReset={handleResetFilters}
          isMobileDrawer={true}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Detailed Product Modal (Complete Schema Inspection) */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onNotification={onNotification}
      />
    </div>
  );
};
