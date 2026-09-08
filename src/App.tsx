import { useState, useEffect } from 'react';
import { Navbar, AppPage } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/layout/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';
import { EmailConfirmationBanner } from './components/auth/EmailConfirmationBanner';
import { HomePage } from './pages/HomePage';
import { BuildsPage } from './pages/BuildsPage';
import { BuilderPage } from './pages/BuilderPage';
import { CommunityPage } from './pages/CommunityPage';
import { CatalogPage } from './pages/CatalogPage';
import { GuidesPage } from './pages/GuidesPage';
import { SupportPage } from './pages/SupportPage';
import { ComponentCategory } from './types/hardware';
import { useAutoLogout } from './hooks/useAutoLogout';
import { useAuthStore } from './store/useAuthStore';
import { handleGoogleRedirectCallback } from './services/auth/googleOAuth';
import { Loader2 } from 'lucide-react';

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isCheckingAuth, checkAuth } = useAuthStore();

  // 30-Minute Inactivity Auto-Logout Tracker
  const { isTimedOut, handleSignInAgain, dismissTimeoutModal } = useAutoLogout();

  // Asynchronous Session Verification & Google Redirect Handler on App Startup
  useEffect(() => {
    // 1. Check for incoming Google OAuth redirect callback
    handleGoogleRedirectCallback().then((result) => {
      if (result?.success && result.user) {
        showNotification(`Signed in with Google as ${result.user.name}!`);
      } else if (result?.error) {
        showNotification(result.error);
      }
    });

    // 2. Verify server-side session credentials
    checkAuth();
  }, [checkAuth]);

  // Sync hash routing on mount and hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppPage | 'catalog';
      if (hash === 'catalog') {
        setCurrentPage('marketplace');
      } else if (
        hash === 'home' ||
        hash === 'builds' ||
        hash === 'builder' ||
        hash === 'community' ||
        hash === 'marketplace' ||
        hash === 'guides' ||
        hash === 'support'
      ) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: AppPage, category?: string) => {
    const targetPage = (page === ('catalog' as any) ? 'marketplace' : page) as AppPage;
    setCurrentPage(targetPage);
    window.location.hash = targetPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (category) {
      setSelectedCatalogCategory(category as ComponentCategory);
    } else if (targetPage === 'marketplace') {
      setSelectedCatalogCategory('all');
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // While verifying session with the server, display a sleek loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center text-slate-100 space-y-4 font-sans selection:bg-[#ff1e2d]/30">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff1e2d] to-[#b30012] flex items-center justify-center shadow-glow-red font-black text-2xl font-mono animate-pulse text-white">
          R
        </div>
        <div className="text-xl font-black font-mono tracking-wider">
          RIG<span className="text-[#ff1e2d]">FORGE</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-[#ff1e2d]" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050a14] text-slate-100 bg-grid-pattern selection:bg-[#ff1e2d]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onNotification={showNotification}
          />
        )}

        {currentPage === 'builds' && (
          <BuildsPage
            onNavigate={navigateTo}
            onNotification={showNotification}
          />
        )}

        {currentPage === 'builder' && (
          <BuilderPage
            onNotification={showNotification}
          />
        )}

        {currentPage === 'community' && (
          <CommunityPage
            onNotification={showNotification}
          />
        )}

        {currentPage === 'marketplace' && (
          <CatalogPage
            initialCategory={selectedCatalogCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNotification={showNotification}
          />
        )}

        {currentPage === 'guides' && (
          <GuidesPage
            onNotification={showNotification}
          />
        )}

        {currentPage === 'support' && (
          <SupportPage
            onNavigate={navigateTo}
            onNotification={showNotification}
          />
        )}
      </main>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Global Authentication Modal (Sign In / Sign Up) */}
      <AuthModal onNotification={showNotification} />

      {/* Automated Email Confirmation Banner & Preview */}
      <EmailConfirmationBanner />

      {/* 30-Minute Inactivity Session Timeout Dialog */}
      <SessionTimeoutModal
        isOpen={isTimedOut}
        onSignInAgain={handleSignInAgain}
        onDismiss={dismissTimeoutModal}
      />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Reactive Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
