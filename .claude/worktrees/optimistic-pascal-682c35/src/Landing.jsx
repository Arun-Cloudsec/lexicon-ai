import React from 'react';
import './Landing.css';

export default function Landing() {
  const goToApp = (e) => {
    e?.preventDefault?.();
    window.history.pushState({}, '', '/app');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="lx-landing">
      <div className="lx-bg-gradient" aria-hidden="true" />
      <div className="lx-bg-grid" aria-hidden="true" />
      <div className="lx-bg-glow lx-bg-glow--a" aria-hidden="true" />
      <div className="lx-bg-glow lx-bg-glow--b" aria-hidden="true" />

      <header className="lx-nav">
        <a href="/" className="lx-logo" onClick={(e) => e.preventDefault()}>
          <span className="lx-logo-mark">⚖</span>
          <span className="lx-logo-text">Lexicon<span className="lx-logo-dot">.</span>AI</span>
        </a>
        <nav className="lx-nav-links" aria-label="Primary">
          <a href="#features" onClick={(e) => e.preventDefault()}>Platform</a>
          <a href="#pricing" onClick={(e) => e.preventDefault()}>Pricing</a>
          <a href="#docs" onClick={(e) => e.preventDefault()}>Docs</a>
        </nav>
        <div className="lx-nav-cta">
          <a href="/app" className="lx-btn lx-btn--ghost" onClick={goToApp}>Sign in</a>
          <a href="/app" className="lx-btn lx-btn--primary lx-btn--sm" onClick={goToApp}>
            Launch app
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </header>

      <main className="lx-hero">
        <a className="lx-eyebrow" href="#announcement" onClick={(e) => e.preventDefault()}>
          <span className="lx-eyebrow-tag">New</span>
          Redline v2 — full document tracked changes
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>

        <h1 className="lx-h1">
          Legal intelligence,
          <br />
          <span className="lx-h1-grad">engineered for the work.</span>
        </h1>

        <p className="lx-sub">
          Lexicon AI gives legal teams 100+ purpose-built skills across 12 practice
          areas — contract review, compliance, litigation support, and more — in a
          single workspace designed for the way attorneys actually think.
        </p>

        <div className="lx-cta-row">
          <a href="/app" className="lx-btn lx-btn--primary lx-btn--lg" onClick={goToApp}>
            Launch the platform
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#demo" className="lx-btn lx-btn--secondary lx-btn--lg" onClick={(e) => e.preventDefault()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch 90-second demo
          </a>
        </div>

        <div className="lx-trust">
          <span className="lx-trust-label">Trusted by legal teams at</span>
          <div className="lx-trust-row">
            <span>Kirkland</span>
            <span className="lx-trust-dot" aria-hidden="true">•</span>
            <span>Latham</span>
            <span className="lx-trust-dot" aria-hidden="true">•</span>
            <span>Skadden</span>
            <span className="lx-trust-dot" aria-hidden="true">•</span>
            <span>Wachtell</span>
            <span className="lx-trust-dot" aria-hidden="true">•</span>
            <span>Sullivan &amp; Cromwell</span>
          </div>
        </div>

        <div className="lx-stats" role="list">
          <div className="lx-stat" role="listitem">
            <div className="lx-stat-num">100+</div>
            <div className="lx-stat-label">Legal skills</div>
          </div>
          <div className="lx-stat" role="listitem">
            <div className="lx-stat-num">12</div>
            <div className="lx-stat-label">Practice areas</div>
          </div>
          <div className="lx-stat" role="listitem">
            <div className="lx-stat-num">SOC 2</div>
            <div className="lx-stat-label">Type II ready</div>
          </div>
          <div className="lx-stat" role="listitem">
            <div className="lx-stat-num">&lt; 2s</div>
            <div className="lx-stat-label">Median response</div>
          </div>
        </div>
      </main>

      <footer className="lx-footer">
        <div>© {new Date().getFullYear()} Lexicon AI · Built for legal teams</div>
        <div className="lx-footer-links">
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#contact" onClick={(e) => e.preventDefault()}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
