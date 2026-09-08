import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Search, 
  Menu, 
  X, 
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

export type AppPage = 'home' | 'builds' | 'builder' | 'community' | 'marketplace' | 'guides' | 'support' | 'signin';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage, categoryFilter?: string) => void;
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

  const handleNavClick = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setShowDropdown(false);
  };

  const handleSelectSearchResult = (product: Product) => {
    onSearchChange(product.name);
    setShowDropdown(false);
    onNavigate('marketplace');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo with Red 'R' Icon and RIGFORGE wordmark */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#e2231a] flex items-center justify-center font-barlow font-black text-white text-2xl shadow-[0_0_15px_rgba(226,35,26,0.5)] transition-transform group-hover:scale-105">
              R
            </div>
            <span className="font-barlow font-black text-2xl tracking-wider uppercase italic text-white group-hover:text-[#e2231a] transition-colors">
              RIG<span className="text-[#e2231a]">FORGE</span>
            </span>
          </div>

          {/* Desktop Center Nav Links with active red indicator pill */}
          <nav className="hidden xl:flex items-center gap-6">
            {(['home', 'builds', 'community', 'marketplace', 'guides', 'support'] as AppPage[]).map((page) => {
              const label = page.charAt(0).toUpperCase() + page.slice(1);
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={`relative py-1 text-sm font-medium tracking-wide transition-colors ${
                    isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-[#e2231a] rounded-full shadow-[0_0_8px_#e2231a]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Search Bar with Real-Time Dropdown */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-2 relative" ref={dropdownRef}>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder="Search builds, users, guides..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#0E121C]/90 text-white placeholder-slate-400 rounded-full border border-white/10 focus:outline-none focus:border-[#FF1F29] focus:ring-1 focus:ring-[#FF1F29]/40 transition-all"
              />
            </div>

            {/* Real-time search dropdown suggestions */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d172e] border border-[#1e2d4f] rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-[#1e2d4f] bg-[#08111f] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Results ({searchResults.length})</span>
                  <span className="text-[#ff1e2d]">Press enter</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#1e2d4f]">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No components found.
                    </div>
                  ) : (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectSearchResult(product)}
                        className="p-2.5 hover:bg-[#142244] cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded-lg border border-[#1e2d4f] bg-[#050a14] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate max-w-[140px]">
                              {product.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {formatINR(product.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-slate-300 hover:text-white transition-colors"
              title="Cart Drawer"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff1e2d] text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-glow-red">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Builder Trigger Button */}
            <button
              onClick={() => handleNavClick('builder')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-xs font-bold text-slate-200 hover:text-white transition-colors"
            >
              <Wrench className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>Builder</span>
              {selectedPartsCount > 0 && (
                <span className="text-[10px] font-mono px-1 rounded bg-[#ff1e2d] text-white">
                  {selectedPartsCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Actions */}
            <div className="relative" ref={userDropdownRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-[#0d172e] hover:bg-[#142244] border border-[#1e2d4f] text-xs text-white transition-all shadow-sm"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#1e2d4f]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#ff1e2d] text-white font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline-block font-semibold truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => {
                      openAuthModal('signin');
                      handleNavClick('signin');
                    }}
                    className="rounded-full px-5 py-1.5 text-xs font-semibold text-white border border-white/30 hover:border-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('signup');
                      handleNavClick('signin');
                    }}
                    className="rounded-full px-5 py-1.5 text-xs font-bold text-white bg-[#e2231a] hover:bg-[#b71c17] shadow-[0_0_18px_rgba(226,35,26,0.5)] transition-all transform hover:scale-105 cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* User Dropdown Menu */}
              {showUserDropdown && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0d172e] border border-[#1e2d4f] shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="p-3 border-b border-[#1e2d4f] flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#1e2d4f]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#ff1e2d] text-white font-bold flex items-center justify-center text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleNavClick('builder');
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[#142244] text-slate-300 hover:text-white text-left transition-colors"
                    >
                      <FolderGit2 className="w-4 h-4 text-[#ff1e2d]" />
                      <span>Configurator</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        switchAccount();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[#142244] text-slate-300 hover:text-[#ff1e2d] text-left transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-[#0066ff]" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-rose-950/30 text-rose-400 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#0d172e] border border-[#1e2d4f] text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#08111f] border-b border-[#1e2d4f] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'builds', label: 'Builds' },
              { id: 'builder', label: 'PC Builder' },
              { id: 'community', label: 'Community' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'guides', label: 'Guides & Tutorials' },
              { id: 'support', label: 'Support Center' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id as AppPage)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentPage === link.id
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'text-slate-300 hover:bg-[#142244] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
