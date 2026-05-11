import React, { useState, useEffect } from 'react';

interface LandingNavProps {
  activeTab: 'eco' | 'user';
  onTabChange: (tab: 'eco' | 'user') => void;
  onEnter: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ activeTab, onTabChange, onEnter }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          background: rgba(6,6,8,0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .landing-nav.scrolled {
          background: rgba(6,6,8,0.96);
        }
        .nav-logo {
          font-family: 'Clash Display', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: -0.02em;
        }
        .nav-logo span { color: var(--green); }
        
        .nav-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.03);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .tab-btn {
          padding: 7px 16px;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          background: transparent;
          color: var(--muted);
        }
        .tab-btn.active {
          color: var(--green);
          background: rgba(255,255,255,0.06);
        }
        
        .nav-right {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-links {
          display: flex;
          gap: 24px;
        }
        .nav-link {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-link:hover { color: var(--white); }
        
        .nav-cta {
          padding: 9px 20px;
          background: var(--green);
          color: #000;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nav-cta:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .landing-nav { padding: 0 24px; }
          .nav-tabs, .nav-links { display: none; }
        }
      `}} />

      <div className="nav-logo">
        Solana<span>Warung</span>
      </div>

      <div className="nav-tabs">
        <button 
          className={`tab-btn ${activeTab === 'eco' ? 'active' : ''}`}
          onClick={() => onTabChange('eco')}
        >
          Ekosistem
        </button>
        <button 
          className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => onTabChange('user')}
        >
          Cara Pakai
        </button>
      </div>

      <div className="nav-right">
        <div className="nav-links">
          <a href="#pipeline" className="nav-link">Pipeline</a>
          <a href="#roadmap" className="nav-link">Roadmap</a>
          <a href="#multichain" className="nav-link">Multichain</a>
        </div>
        <button onClick={onEnter} className="nav-cta">
          Masuk Marketplace
        </button>
      </div>
    </nav>
  );
};