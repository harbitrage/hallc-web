/* ==========================================================================
   HARRISON ARBITRAGE LLC — GLOBAL WEB COMPONENTS & THEME MEDIA ENGINE (/main.js)
   Sidebar Architecture: Approach C (Compact Executive Sidebar)
   Supports: All 9 Root HTML Pages + Multi-Brand 9:16 & 1:1 Theme Asset Sync
   ========================================================================== */

/* Immediate Theme Restoration (Prevents Flash on Page Load) */
(function restoreSavedTheme() {
  const savedTheme = localStorage.getItem('harrison-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  /* 1. Sync 1:1 Sidebar & Mobile Brand Logos */
  const logoSrc = isLight ? 'Harrison_Arbitrage_Light.jpg' : 'Harrison_Arbitrage_Dark.jpg';
  document.querySelectorAll('.theme-brand-logo').forEach(img => {
    if (img.getAttribute('src') !== logoSrc) {
      img.setAttribute('src', logoSrc);
    }
  });

  /* 2. Sync 9:16 Animated Crest Videos & Posters (.theme-brand-video) */
  const videoSrc = isLight
    ? 'Harrison_Arbitrage_Light_9x16_Animated.mp4'
    : 'Harrison_Arbitrage_Dark_9x16_Animated.mp4';
  const posterSrc = isLight
    ? 'Harrison_Arbitrage_Light_9x16.jpg'
    : 'Harrison_Arbitrage_Dark_9x16.jpg';

  document.querySelectorAll('.theme-brand-video').forEach(video => {
    video.setAttribute('poster', posterSrc);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.getAttribute('src') !== videoSrc) {
      video.setAttribute('src', videoSrc);
      video.load();
    }
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  /* 3. Sync 9:16 Static Brand Cards (.theme-brand-9x16) across Arbitrage, Agents & Collectibles */
  const brandMap = {
    arbitrage: isLight ? 'Harrison_Arbitrage_Light_9x16.jpg' : 'Harrison_Arbitrage_Dark_9x16.jpg',
    agents: isLight ? 'Harrison_Agents_Light_9x16.jpg' : 'Harrison_Agents_Dark_9x16.jpg',
    collectibles: isLight ? 'Harrison_Collectibles_Light_9x16.jpg' : 'Harrison_Collectibles_Dark_9x16.jpg'
  };

  document.querySelectorAll('.theme-brand-9x16').forEach(img => {
    const brandKey = (img.dataset.brand || 'arbitrage').toLowerCase();
    const targetSrc = brandMap[brandKey] || brandMap.arbitrage;
    if (img.getAttribute('src') !== targetSrc) {
      img.setAttribute('src', targetSrc);
    }
  });

  /* 4. Sync Optional Status Captions */
  document.querySelectorAll('.theme-status-caption').forEach(cap => {
    const nextText = isLight ? cap.dataset.captionLight : cap.dataset.captionDark;
    if (nextText) cap.textContent = nextText;
  });
}

class HarrisonSidebar extends HTMLElement {
  connectedCallback() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    /* 1. Three Primary Prominent Links (Home is linked via the top .brand-header crest) */
    const primaryItems = [
      {
        href: 'publishing.html',
        id: 'publishing.html',
        label: 'Publishing Hub',
        badge: '7 Books',
        badgeClass: 'gold',
        active: currentFile === 'publishing.html'
      },
      {
        href: 'spotlight.html',
        id: 'spotlight.html',
        label: 'Current Spotlight',
        badge: 'Book',
        badgeClass: 'gold',
        active: currentFile === 'spotlight.html'
      },
      {
        href: 'brands.html',
        id: 'brands.html',
        label: 'Family of Brands',
        badge: '3 Divs',
        badgeClass: '',
        active: currentFile === 'brands.html'
      }
    ];

    /* 2. Expandable Series & Ecosystem Accordion Drawer */
    const seriesItems = [
      { href: 'series-ai-cybersecurity.html', id: 'series-ai-cybersecurity.html', label: 'AI, Cyber & Resilience' },
      { href: 'series-substrate-simulation.html', id: 'series-substrate-simulation.html', label: 'Substrate Simulation' },
      { href: 'https://harrisonaiagents.com/', id: 'ext-agents', label: 'Harrison AI Agents ↗', external: true },
      { href: 'https://harrisonaiagents.com/academy/', id: 'ext-academy', label: 'AI Agents Academy ↗', external: true }
    ];

    const hasActiveSeries = seriesItems.some(item => !item.external && item.id === currentFile);

    /* 3. Single-Line Horizontal Governance Footer Links */
    const govItems = [
      { href: 'about.html', id: 'about.html', label: 'About Us' },
      { href: 'contact.html', id: 'contact.html', label: 'Contact' },
      { href: 'privacy.html', id: 'privacy.html', label: 'Privacy' }
    ];

    let primaryListHTML = `<div class="nav-section-label">Sovereign Divisions</div><ul class="nav-list">`;
    primaryItems.forEach(item => {
      const badgeHTML = item.badge
        ? `<span class="nav-badge ${item.badgeClass || ''}">${item.badge}</span>`
        : '';
      primaryListHTML += `
        <li>
          <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">
            <span>${item.label}</span>
            ${badgeHTML}
          </a>
        </li>
      `;
    });
    primaryListHTML += `</ul>`;

    let seriesListHTML = `<ul class="nav-list" style="margin-bottom:0;">`;
    seriesItems.forEach(item => {
      const isActive = !item.external && currentFile === item.id;
      const extAttrs = item.external ? 'target="_blank" rel="noopener noreferrer"' : '';
      seriesListHTML += `
        <li>
          <a href="${item.href}" ${extAttrs} class="nav-link ${isActive ? 'active' : ''}" style="font-size:0.82rem; padding:0.45rem 0.65rem;">
            <span>${item.label}</span>
          </a>
        </li>
      `;
    });
    seriesListHTML += `</ul>`;

    const govInlineHTML = govItems
      .map((item, idx) => {
        const isActive = currentFile === item.id;
        const sep = idx < govItems.length - 1 ? '<span class="sidebar-gov-sep">•</span>' : '';
        return `<a href="${item.href}" class="${isActive ? 'active' : ''}">${item.label}</a>${sep}`;
      })
      .join('');

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const initialLogo = isLight ? 'Harrison_Arbitrage_Light.jpg' : 'Harrison_Arbitrage_Dark.jpg';

    this.innerHTML = `
      <div class="mobile-topbar">
        <a href="index.html" style="display:flex; align-items:center; gap:0.6rem; text-decoration:none;">
          <img src="${initialLogo}" alt="Harrison Arbitrage Crest" class="theme-brand-logo" style="width:36px; height:36px; border-radius:8px; border:1px solid var(--accent-gold); object-fit:cover;" />
          <span class="brand-name">Harrison <span class="gold-accent">Arbitrage</span></span>
        </a>
        <button class="mobile-menu-btn" id="mobile-nav-toggle" aria-label="Toggle Menu">☰ MENU</button>
      </div>
      <aside class="sidebar" id="app-sidebar">
        <a href="index.html" class="brand-header" title="Return to Harrison Arbitrage Home">
          <img src="${initialLogo}" alt="Harrison Arbitrage Logo" class="brand-logo-img theme-brand-logo" />
          <div class="brand-title-group">
            <span class="brand-name">Harrison <span class="gold-accent">Arbitrage</span></span>
            <span class="brand-sub">Sovereignty • Home</span>
          </div>
        </a>
        <nav aria-label="Primary Sidebar Navigation" style="display:flex; flex-direction:column; flex:1;">
          ${primaryListHTML}
          <div class="nav-accordion-group ${hasActiveSeries ? 'is-open has-active-child' : ''}" id="arch-accordion-group">
            <button
              type="button"
              class="nav-accordion-trigger"
              id="arch-accordion-btn"
              aria-expanded="${hasActiveSeries ? 'true' : 'false'}">
              <span>Series &amp; Ecosystem</span>
              <span class="nav-accordion-chevron">▾</span>
            </button>
            <div class="nav-accordion-drawer" id="arch-accordion-drawer">
              ${seriesListHTML}
            </div>
          </div>
        </nav>
        <div class="sidebar-footer">
          <button id="theme-toggle" class="theme-toggle-btn" type="button" aria-label="Toggle Light/Dark Theme">
            ☀️ Switch to Light Mode
          </button>
          <div class="sidebar-gov-inline" aria-label="Company and Governance">
            ${govInlineHTML}
          </div>
          <div class="sidebar-legal">© ${new Date().getFullYear()} Harrison Arbitrage LLC</div>
        </div>
      </aside>
    `;

    this.initThemeToggle();
    this.initMobileMenu();
    this.initArchAccordion();
    syncThemeMediaAssets();
  }

  initArchAccordion() {
    const group = this.querySelector('#arch-accordion-group');
    const btn = this.querySelector('#arch-accordion-btn');
    if (group && btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = group.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  }

  initThemeToggle() {
    const toggleBtn = this.querySelector('#theme-toggle');
    const rootEl = document.documentElement;

    const syncLabel = () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      toggleBtn.innerHTML = isLight ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode';
      syncThemeMediaAssets();
    };

    syncLabel();

    toggleBtn.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      rootEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('harrison-theme', nextTheme);
      syncLabel();
    });
  }

  initMobileMenu() {
    const menuBtn = this.querySelector('#mobile-nav-toggle');
    const sidebar = this.querySelector('#app-sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }
}

class HarrisonFooterCTA extends HTMLElement {
  connectedCallback() {
    const heading = this.getAttribute('heading') || 'Advance Information Sovereignty & Strategic Arbitrage';
    const subtext = this.getAttribute('subtext') || 'Explore our 7-volume strategic publishing catalog, deploy autonomous enterprise AI via Harrison AI Agents, or inquire about curated physical collectibles.';
    this.innerHTML = `
      <section class="cta-banner">
        <span class="eyebrow">Harrison Arbitrage LLC • Maryland, USA</span>
        <h2>${heading}</h2>
        <p>${subtext}</p>
        <div class="btn-group" style="justify-content: center;">
          <a href="publishing.html" class="btn btn-primary">Explore Publishing Hub →</a>
          <a href="brands.html" class="btn btn-secondary">Family of Brands</a>
          <a href="contact.html" class="btn btn-secondary">Enterprise Inquiries</a>
        </div>
      </section>
    `;
  }
}

customElements.define('harrison-sidebar', HarrisonSidebar);
customElements.define('harrison-footer-cta', HarrisonFooterCTA);

document.addEventListener('DOMContentLoaded', () => {
  syncThemeMediaAssets();
});
