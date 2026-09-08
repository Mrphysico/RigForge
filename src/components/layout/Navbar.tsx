import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  ShoppingCart, 
  Wrench, 
  Layers, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles,
  Ban,
  Check,
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useBuilderStore } from '../../store/useBuilderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { MOCK_PRODUCTS } from '../../data/mockHardware';
import { formatINR } from '../../utils/formatCurrency';
import { Product } from '../../types/hardware';

interface NavbarProps {
  currentPage: 'home' | 'catalog' | 'builder';
  onNavigate: (page: 'home' | 'catalog' | 'builder', categoryFilter?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const openCart = useCartStore((state) => state.openCart);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const selectedPartsCount = useBuilderStore((state) => state.getSelectedCount());
  const builderWattage = useBuilderStore((state) => state.getEstimatedWattage());

  const { user, isAuthenticated, openAuthModal, logout } = useAuthStore();

  // Real-time live search matches
  const searchResults: Product[] = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.specs.socket && p.specs.socket.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: 'home' | 'catalog' | 'builder') => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setShowDropdown(false);
  };

  const handleSelectSearchResult = (product: Product) => {
    onSearchChange(product.name);
    setShowDropdown(false);
    onNavigate('catalog');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
      {/* Top India Announcement Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-zinc-900 to-blue-950 px-4 py-1.5 text-center text-xs font-medium text-cyan-300 border-b border-cyan-500/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>
          Pan-India Insured Courier via BlueDart &amp; Delhivery | Free Shipping on orders over ₹10,000 | GST Invoice included
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan transition-transform group-hover:scale-105">
              <Cpu className="w-6 h-6 text-zinc-950 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  RIG<span className="text-cyan-400">FORGE</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 -mt-1 hidden sm:block">
                CUSTOM PC CONFIGURATOR
              </span>
            </div>
          </div>

          {/* Desktop Search Bar with Real-Time Dropdown */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={dropdownRef}>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder="Search RTX 4070, Ryzen 7800X3D, B650, DDR5..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-900/90 text-zinc-200 placeholder-zinc-500 rounded-lg border border-zinc-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Real-time search dropdown suggestions */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-2 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
                  <span>Live Inventory Results ({searchResults.length})</span>
                  <span className="font-mono text-[10px] text-cyan-400">Press enter to view all</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-850">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-400">
                      No matching components found for "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectSearchResult(product)}
                        className="p-3 hover:bg-zinc-900/80 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md border border-zinc-800 bg-zinc-900 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate max-w-xs">
                              {product.name}
                            </div>
                            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                              <span>{product.brand}</span>
                              <span>·</span>
                              <span className="text-cyan-400 uppercase">{product.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-mono font-bold text-white">
                            {formatINR(product.price)}
                          </div>
                          {product.inStock ? (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 justify-end">
                              <Check className="w-2.5 h-2.5" /> In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-red-400 flex items-center gap-0.5 justify-end">
                              <Ban className="w-2.5 h-2.5" /> Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {searchResults.length > 0 && (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onNavigate('catalog');
                    }}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-center text-xs font-semibold text-cyan-400 border-t border-zinc-800 transition-colors"
                  >
                    View All Matching Components in Catalog →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('catalog')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentPage === 'catalog'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Parts Catalog</span>
            </button>

            <button
              onClick={() => handleNavClick('builder')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'builder'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>PC Builder</span>
              {selectedPartsCount > 0 && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {selectedPartsCount}/8
                  {builderWattage > 0 && <span className="text-[10px] text-zinc-400">· {builderWattage}W</span>}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-3">
            {/* User Account / Sign In Trigger */}
            <div className="relative" ref={userDropdownRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-zinc-950 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block font-medium truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {showUserDropdown && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                  <div className="p-2.5 border-b border-zinc-850">
                    <div className="font-bold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono truncate">{user.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
                      Via {(user.provider || 'local').toUpperCase()}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleNavClick('builder');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 hover:text-white text-left transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                      <span>My Configured Build</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openCart();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 hover:text-white text-left transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                      <span>My Cart ({totalCartItems})</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-zinc-850">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-red-950/40 text-zinc-400 hover:text-red-400 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Cart"
              className="relative p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-zinc-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[11px] font-bold text-zinc-950 ring-2 ring-[#09090b] animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentPage !== 'catalog' && e.target.value.trim().length > 0) {
                  onNavigate('catalog');
                }
              }}
              placeholder="Search Indian PC hardware..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-900 text-zinc-200 placeholder-zinc-500 rounded-lg border border-zinc-800 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-zinc-800 flex flex-col gap-1.5 animate-fadeIn">
            {/* Mobile Auth Button */}
            <div className="px-2 pb-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyan-500 text-zinc-950 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === 'home' ? 'bg-cyan-500/10 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === 'catalog' ? 'bg-cyan-500/10 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span>Parts Catalog</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => handleNavClick('builder')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === 'builder' ? 'bg-cyan-500/10 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>PC Builder</span>
                {selectedPartsCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    {selectedPartsCount}/8 slots
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
