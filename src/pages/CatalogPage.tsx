import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Sparkles
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockHardware';
import { ProductCard } from '../components/products/ProductCard';
import { ComponentCategory } from '../types/hardware';
import { useCartStore } from '../store/useCartStore';

interface CatalogPageProps {
  initialCategory?: ComponentCategory | 'all';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNotification: (msg: string) => void;
}

const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cpu', label: 'CPUs' },
  { id: 'gpu', label: 'GPUs' },
  { id: 'motherboard', label: 'Motherboards' },
  { id: 'ram', label: 'RAM' },
  { id: 'storage', label: 'Storage' },
  { id: 'psu', label: 'PSUs' },
  { id: 'case', label: 'Cases' },
  { id: 'cooler', label: 'Cooling' },
  { id: 'peripherals', label: 'Peripherals' },
] as const;

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialCategory = 'all',
  searchQuery,
  onSearchChange,
  onNotification,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSocket = product.specs.socket?.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSocket && !matchesDesc) {
          return false;
        }
      }

      // In Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen pb-20 bg-[#050a14] text-slate-100">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] to-[#050a14] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#ff1e2d] text-xs font-mono font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GENUINE INDIAN HARDWARE STORE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-mono">
                MARKET<span className="text-[#ff1e2d]">PLACE</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Buy, sell or discover the best PC components. Real-time Indian retail stock with verified GST invoices.
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

          {/* Category Filter Pills (Panel 5 layout) */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 border-t border-[#1e2d4f] pt-6 scrollbar-none">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[40px] flex items-center justify-center ${
                  selectedCategory === cat.id
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red font-bold'
                    : 'bg-[#0d172e] text-slate-300 hover:text-white hover:bg-[#142244] border border-[#1e2d4f]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar & Sort Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search RTX 4080, Ryzen 7800X3D, B650, DDR5..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0d172e] text-white placeholder-slate-400 rounded-xl border border-[#1e2d4f] focus:outline-none focus:border-[#ff1e2d] min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none min-h-[40px]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#1e2d4f] bg-[#0d172e] text-[#ff1e2d] focus:ring-0 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl bg-[#0d172e] border border-[#1e2d4f] text-xs font-semibold text-white focus:outline-none focus:border-[#ff1e2d] min-h-[44px]"
                >
                  <option value="featured">Popular / Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-4 text-xs font-mono text-slate-400">
          <span>Showing {filteredProducts.length} verified hardware components</span>
          {searchQuery && <span>Filter: "{searchQuery}"</span>}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#0d172e] rounded-3xl border border-[#1e2d4f] space-y-3">
            <p className="text-slate-400 text-sm">No hardware found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                onSearchChange('');
                setInStockOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white text-xs font-bold shadow-glow-red"
            >
              Reset Marketplace Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
  );
};
