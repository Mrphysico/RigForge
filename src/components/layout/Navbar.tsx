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
  ChevronDown,
  FolderGit2,
  RefreshCw
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

  const { user, isAuthenticated, openAuthModal, switchAccount, logout } = useAuthStore();

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
    <header className="sticky top-0 z-40 w-full border-b border-[#26365a] bg-[#0b1329]/95 backdrop-blur-md">
      {/* Top India Announcement Bar */}
      <div className="bg-[#131d38] px-4 py-1.5 text-center text-xs font-medium text-[#FCA311] border-b border-[#26365a] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#FCA311] animate-pulse" />
        <span className="text-[11px] sm:text-xs">
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
            <div className="w-10 h-10 rounded-xl bg-[#1e2d4f] border border-[#26365a] flex items-center justify-center shadow-glow-orange transition-transform group-hover:scale-105">
              <Cpu className="w-6 h-6 text-[#FCA311] stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#FCA311] transition-colors font-mono">
                  RIG<span className="text-[#FCA311]">FORGE</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30">
                  IN
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#A0A0A0] -mt-1 hidden sm:block">
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#131d38] text-white placeholder-zinc-400 rounded-xl border border-[#26365a] focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Real-time search dropdown suggestions */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#16223f] border border-[#26365a] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-2.5 border-b border-[#26365a] bg-[#131d38] flex items-center justify-between text-xs text-[#A0A0A0]">
                  <span>Live Inventory Results ({searchResults.length})</span>
                  <span className="font-mono text-[10px] text-[#FCA311]">Press enter to view all</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#26365a]">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#A0A0A0]">
                      No matching components found for "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectSearchResult(product)}
                        className="p-3 hover:bg-[#1e2d4f] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-[#26365a] bg-[#0b1329] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate max-w-xs">
                              {product.name}
                            </div>
                            <div className="text-[11px] font-mono text-[#A0A0A0] flex items-center gap-1.5">
                              <span>{product.brand}</span>
                              <span>·</span>
                              <span className="text-[#FCA311] uppercase">{product.category}</span>
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
                    className="w-full py-2.5 bg-[#131d38] hover:bg-[#1e2d4f] text-center text-xs font-semibold text-[#FCA311] border-t border-[#26365a] transition-colors"
                  >
                    View All Matching Components in Catalog →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === 'home'
                  ? 'text-[#FCA311] bg-[#FCA311]/10 border border-[#FCA311]/30 shadow-glow-orange'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1e2d4f]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('catalog')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'catalog'
                  ? 'text-[#FCA311] bg-[#FCA311]/10 border border-[#FCA311]/30 shadow-glow-orange'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1e2d4f]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Parts Catalog</span>
            </button>

            <button
              onClick={() => handleNavClick('builder')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'builder'
                  ? 'text-[#FCA311] bg-[#FCA311]/10 border border-[#FCA311]/30 shadow-glow-orange'
                  : 'text-zinc-300 hover:text-white hover:bg-[#1e2d4f]'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>PC Builder</span>
              {selectedPartsCount > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-[#FCA311] text-zinc-950 font-bold font-mono">
                  {selectedPartsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Icons: User Account & Cart */}
          <div className="flex items-center gap-2.5">
            {/* User Account / Sign In Trigger */}
            <div className="relative" ref={userDropdownRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-[#16223f] hover:bg-[#1e2d4f] border border-[#26365a] hover:border-[#FCA311]/40 text-xs text-white transition-all shadow-sm"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#26365a]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#FCA311] text-zinc-950 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline-block font-semibold truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#16223f] hover:bg-[#1e2d4f] border border-[#26365a] hover:border-[#FCA311]/50 text-xs font-bold text-[#FCA311] transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {showUserDropdown && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#16223f] border border-[#26365a] shadow-2xl p-2 z-50 animate-fadeIn text-xs">
                  {/* User Profile Header */}
                  <div className="p-3 border-b border-[#26365a] flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#26365a] flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#FCA311] text-zinc-950 font-bold flex items-center justify-center text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-[#A0A0A0] font-mono truncate">{user.email}</div>
                      <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 text-[10px] font-mono font-semibold">
                        Via {(user.provider || 'local').toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Options Menu */}
                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleNavClick('builder');
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[#1e2d4f] text-zinc-300 hover:text-white text-left transition-colors"
                    >
                      <FolderGit2 className="w-4 h-4 text-[#FCA311]" />
                      <span>My Builds</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        openCart();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[#1e2d4f] text-zinc-300 hover:text-white text-left transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 text-[#FCA311]" />
                      <span>My Cart ({totalCartItems})</span>
                    </button>

                    {/* Switch Account */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        switchAccount();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[#1e2d4f] text-zinc-300 hover:text-[#FCA311] text-left transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-[#FCA311]" />
                      <span>Switch Account</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 border-t border-[#26365a]">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-red-950/40 text-zinc-400 hover:text-red-400 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
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
              className="relative p-2.5 rounded-xl text-zinc-300 hover:text-white bg-[#16223f] hover:bg-[#1e2d4f] border border-[#26365a] hover:border-[#FCA311]/40 transition-colors"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FCA311] text-[10px] font-extrabold text-zinc-950 shadow-glow-orange animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-[#16223f] border border-[#26365a]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#131d38] text-white placeholder-zinc-400 rounded-xl border border-[#26365a] focus:outline-none focus:border-[#FCA311]"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#26365a] flex flex-col gap-1.5 animate-fadeIn">
            {/* Mobile Auth Button / User Card */}
            <div className="px-2 pb-2">
              {isAuthenticated && user ? (
                <div className="p-3 rounded-2xl bg-[#16223f] border border-[#26365a] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#26365a]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#FCA311] text-zinc-950 font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-[#A0A0A0] font-mono">{user.email}</div>
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

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      switchAccount();
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#1e2d4f] border border-[#26365a] text-[#FCA311] text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Switch Account</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('signin');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#FCA311] text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-orange"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                currentPage === 'home' ? 'bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30' : 'text-zinc-300 hover:bg-[#1e2d4f]'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                currentPage === 'catalog' ? 'bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30' : 'text-zinc-300 hover:bg-[#1e2d4f]'
              }`}
            >
              <span>Parts Catalog</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => handleNavClick('builder')}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                currentPage === 'builder' ? 'bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30' : 'text-zinc-300 hover:bg-[#1e2d4f]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>PC Builder</span>
                {selectedPartsCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#FCA311]/20 text-[#FCA311] font-mono">
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
