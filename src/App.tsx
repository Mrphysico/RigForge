import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/layout/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';
import { EmailConfirmationBanner } from './components/auth/EmailConfirmationBanner';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { BuilderPage } from './pages/BuilderPage';
import { ComponentCategory } from './types/hardware';
import { useAutoLogout } from './hooks/useAutoLogout';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'builder'>('home');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 30-Minute Inactivity Auto-Logout Tracker
  const { isTimedOut, handleSignInAgain, dismissTimeoutModal } = useAutoLogout();

  // Sync hash routing on mount and hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'catalog' || hash === 'builder' || hash === 'home') {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: 'home' | 'catalog' | 'builder', category?: string) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (category) {
      setSelectedCatalogCategory(category as ComponentCategory);
    } else if (page === 'catalog') {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-300">
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

        {currentPage === 'catalog' && (
          <CatalogPage
            initialCategory={selectedCatalogCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNotification={showNotification}
          />
        )}

        {currentPage === 'builder' && (
          <BuilderPage
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
