import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AppPage } from '../components/layout/Navbar';
import '../styles/landing.css';

interface HomePageProps {
  onNavigate: (page: AppPage, category?: string) => void;
  onNotification?: (msg: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onNotification: _onNotification,
  searchQuery = '',
  onSearchChange,
}) => {
  const { user, isAuthenticated, isCheckingAuth, openAuthModal } = useAuthStore();

  const handleGetStarted = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isCheckingAuth) return;
    if (isAuthenticated && user) {
      onNavigate('builds');
    } else {
      openAuthModal('signin');
      onNavigate('signin');
    }
  };

  const handleSignIn = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isAuthenticated && user) {
      onNavigate('builds');
    } else {
      openAuthModal('signin');
      onNavigate('signin');
    }
  };

  const handleCreateAccount = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isAuthenticated && user) {
      onNavigate('builds');
    } else {
      openAuthModal('signup');
      onNavigate('signin');
    }
  };

  return (
    <div className="landing-page-root">
      {/* BACKGROUND COMPOSITION */}
      <div className="viewport-bg">
        <div className="bg-slice-left"></div>
        <div className="mid-gothic-backdrop"></div>
        <div className="bg-slice-right"></div>

        {/* Parachute Airdrop SVG overlay in gold slice */}
        <svg className="airdrop-crate" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 70 C10 10, 130 10, 130 70 C110 65, 95 65, 70 68 C45 65, 30 65, 10 70 Z" fill="#1e2229" stroke="#12161f" strokeWidth={2} />
          <path d="M35 67 C48 40, 92 40, 105 67" stroke="#12161f" strokeWidth={2} fill="none" />
          <line x1="12" y1="70" x2="62" y2="120" stroke="#1b2029" strokeWidth={1.5} />
          <line x1="45" y1="68" x2="65" y2="120" stroke="#1b2029" strokeWidth={1.5} />
          <line x1="95" y1="68" x2="75" y2="120" stroke="#1b2029" strokeWidth={1.5} />
          <line x1="128" y1="70" x2="78" y2="120" stroke="#1b2029" strokeWidth={1.5} />
          <rect x="58" y="120" width="24" height="24" rx="2" fill="#8c1d1d" stroke="#12161f" strokeWidth={1.5} />
          <rect x="56" y="118" width="28" height="8" rx="1" fill="#1b4d8c" />
        </svg>

        <div className="bg-slice-far-right"></div>
      </div>

      {/* NAVIGATION */}
      <header className="navbar">
        <a href="#home" className="brand" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          <svg className="brand-logo-svg" viewBox="0 0 40 40">
            <path d="M6 6 H22 C28 6 32 10 32 16 C32 21 28 25 22 25 H14 V34 H6 V6 Z M14 13 V18 H21 C23 18 24 17 24 15.5 C24 14 23 13 21 13 H14 Z" fill="#ffffff" />
            <path d="M22 23 L32 34 H23 L15 25 Z" fill="#ff1e27" />
          </svg>
          <span className="brand-text">RIG<span>FORGE</span></span>
        </a>

        <ul className="nav-links">
          <li><a href="#home" className="active" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Home</a></li>
          <li><a href="#builds" onClick={(e) => { e.preventDefault(); onNavigate('builds'); }}>Builds</a></li>
          <li><a href="#community" onClick={(e) => { e.preventDefault(); onNavigate('community'); }}>Community</a></li>
          <li><a href="#marketplace" onClick={(e) => { e.preventDefault(); onNavigate('marketplace'); }}>Marketplace</a></li>
          <li><a href="#guides" onClick={(e) => { e.preventDefault(); onNavigate('guides'); }}>Guides</a></li>
          <li><a href="#support" onClick={(e) => { e.preventDefault(); onNavigate('support'); }}>Support</a></li>
        </ul>

        <div className="nav-actions">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search builds, users, guides..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigate('marketplace');
                }
              }}
            />
          </div>
          <button className="btn-signin" onClick={handleSignIn}>
            {isAuthenticated && user ? user.name.split(' ')[0] : 'Sign In'}
          </button>
          <button className="btn-create" onClick={handleCreateAccount}>
            {isAuthenticated && user ? 'My Account' : 'Create Account'}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="hero-container">

        {/* Flanking Edge Words */}
        <div className="side-pill-text left">
          <span>PLAY</span>
          <span>BUILD</span>
          <span>CONNECT</span>
        </div>

        <div className="side-pill-text right">
          <span>BUILD</span>
          <span>STREAM</span>
          <span>GAME</span>
          <span>REPEAT</span>
        </div>

        <div className="side-yellow-text">
          MORE<br />THAN<br />GAMING
        </div>

        {/* Center Headers */}
        <div className="tagline-sub">GEAR &nbsp;|&nbsp; BUILD &nbsp;|&nbsp; PLAY &nbsp;|&nbsp; TOGETHER</div>

        <div className="hero-title-group">
          <span className="logo-bracket">[</span>
          <h1>RIGFORGE</h1>
          <span className="logo-bracket">]</span>
        </div>

        <div className="hero-subtitle">POWER YOUR PASSION</div>

        <p className="hero-desc">
          A community-driven platform for gamers, creators, and PC builders.<br />
          Share builds, get support, explore gear, and take your setup to the next level.
        </p>

        <div className="hero-buttons">
          <button className="hero-btn-red" onClick={handleGetStarted}>
            Get Started <i className="fa-solid fa-arrow-right"></i>
          </button>
          <button className="hero-btn-dark" onClick={() => onNavigate('builds')}>
            Explore Builds
          </button>
        </div>

        {/* Battlestation Display Graphic */}
        <div className="battlestation-stage">
          {/* Left props: Stacked Books & Headset */}
          <div className="left-desk-prop">
            <div className="stacked-books">
              <div className="book-spine">BETTER GEAR</div>
              <div className="book-spine">BETTER GAMES</div>
              <div className="book-spine">A BRIGHTER YOU</div>
            </div>
            <div className="headset-prop"></div>
          </div>

          {/* Center Curved Ultrawide Display */}
          <div className="monitor-unit">
            <div className="monitor-bezel">
              <div className="monitor-screen">
                <div className="screen-quote">
                  GOOD<br />GAMES<br />BETTER<br />PEOPLE
                </div>
              </div>
            </div>
            <div className="monitor-stand"></div>
            <div className="monitor-base"></div>
          </div>

          {/* Mat & Peripherals */}
          <div className="desk-keyboard"></div>
          <div className="desk-mouse"></div>

          {/* Gaming PC Tower with Neon Dual Rings */}
          <div className="pc-tower">
            <div className="rgb-fan"></div>
            <div className="rgb-fan"></div>
            <div className="pc-brand-logo">RIGFORGE</div>
          </div>

          {/* Red Accent Gaming Chair */}
          <div className="chair-silhouette"></div>

          {/* Desk Mat Shadow Base */}
          <div className="desk-mat-base"></div>
        </div>
      </div>

      {/* QUICK ACTION PILLS (4 ICONS) */}
      <div className="action-pill-bar">
        <div className="pill-card" onClick={() => onNavigate('community')}>
          <div className="pill-icon red">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="pill-details">
            <h4>Join Community</h4>
            <p>Connect with gamers &amp; builders</p>
          </div>
        </div>

        <div className="pill-card" onClick={() => onNavigate('builds')}>
          <div className="pill-icon dark">
            <i className="fa-solid fa-cube"></i>
          </div>
          <div className="pill-details">
            <h4>Share Your Build</h4>
            <p>Showcase your setup</p>
          </div>
        </div>

        <div className="pill-card" onClick={() => onNavigate('marketplace')}>
          <div className="pill-icon blue">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <div className="pill-details">
            <h4>Explore Gear</h4>
            <p>Find the best components</p>
          </div>
        </div>

        <div className="pill-card" onClick={() => onNavigate('guides')}>
          <div className="pill-icon yellow">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <div className="pill-details">
            <h4>Learn &amp; Grow</h4>
            <p>Guides, tips and support</p>
          </div>
        </div>
      </div>

      {/* BOTTOM 3 CARDS */}
      <div className="bottom-cards-row">

        {/* 1. EXACT "FEATURED BUILDS - INSANE SETUPS" CARD */}
        <a
          href="#builds"
          className="card-insane-setups"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('builds');
          }}
        >
          <div className="card-bg-layer">
            <img
              className="pc-rig-photo"
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop"
              alt="Custom Red RGB Liquid Cooled PC Setup"
            />
            <div className="red-gradient-fade"></div>
          </div>

          <div className="inner-text">
            <div className="kicker-red">FEATURED BUILDS</div>
            <h2 className="bold-title-italic">INSANE<br />SETUPS</h2>
          </div>

          <div className="red-circle-btn">
            <svg viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </a>

        {/* 2. COMMUNITY - REAL PEOPLE CARD */}
        <a
          href="#community"
          className="card-real-people"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('community');
          }}
        >
          <div>
            <div className="card-kicker">COMMUNITY</div>
            <div className="card-title-heavy">REAL<br />PEOPLE</div>
          </div>
          <div className="card-foot-meta">
            <span>Real Builds. Real Stories.</span>
            <div className="btn-arrow-subtle"><i className="fa-solid fa-arrow-right"></i></div>
          </div>
        </a>

        {/* 3. GUIDES - LEVEL UP YOUR KNOWLEDGE CARD */}
        <a
          href="#guides"
          className="card-level-up"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('guides');
          }}
        >
          <div>
            <div className="card-kicker">GUIDES</div>
            <div className="card-title-heavy">LEVEL UP<br />YOUR KNOWLEDGE</div>
          </div>
          <div className="card-foot-meta">
            <span>Build Smarter. Game Better.</span>
            <div className="btn-arrow-gold"><i className="fa-solid fa-arrow-right"></i></div>
          </div>
        </a>

      </div>
    </div>
  );
};

export default HomePage;
