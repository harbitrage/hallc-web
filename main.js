/* ==========================================================================
   HARRISON ARBITRAGE LLC — GLOBAL THEME, MEDIA & MOBILE COLLAPSE ENGINE (main.js)
   Modeled directly on harrisonaiagents.com main.js architecture
   ========================================================================== */

/* 0. Immediate Theme & View Restoration (Prevents Flash on Page Load) */
(function restoreSavedPreferences() {
  const savedTheme = localStorage.getItem('harrison-theme') || 'dark';
  const savedView = localStorage.getItem('harrison-view-mode') || 'standard';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedView === 'mobile') {
    document.documentElement.setAttribute('data-view', 'mobile');
  }
})();

/**
 * 1. Global Dark/Light Media Asset Synchronizer
 *    Automatically swaps all 1:1 logos, 9:16 videos, and 9:16 brand graphics
 *    between *_Dark* and *_Light* variants whenever the theme toggles.
 */
function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const modeLabel = isLight ? 'Light' : 'Dark';

  /* A. Sync 1:1 Square Brand Logos (.theme-brand-logo) */
  const logoSrc = isLight ? 'Harrison_Arbitrage_Light.jpg' : 'Harrison_Arbitrage_Dark.jpg';
  document.querySelectorAll('.theme-brand-logo').forEach((img) => {
    if (img.getAttribute('src') !== logoSrc) {
      img.setAttribute('src', logoSrc);
    }
  });

  /* B. Sync 9:16 Animated Campaign Videos & Posters (.theme-brand-video) */
  const arbitrageVideoSrc = `Harrison_Arbitrage_${modeLabel}_9x16_Animated.mp4`;
  const arbitragePosterSrc = `Harrison_Arbitrage_${modeLabel}_9x16.jpg`;

  document.querySelectorAll('.theme-brand-video').forEach((video) => {
    video.setAttribute('poster', arbitragePosterSrc);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.getAttribute('src') !== arbitrageVideoSrc) {
      video.setAttribute('src', arbitrageVideoSrc);
      video.load();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  /* C. Sync 9:16 Static Brand & Campaign Graphics (.theme-brand-9x16)
        Supports data-brand="arbitrage" | "agents" | "collectibles" */
  const brandAssetMap = {
    arbitrage: `Harrison_Arbitrage_${modeLabel}_9x16.jpg`,
    agents: `Harrison_Agents_${modeLabel}_9x16.jpg`,
    collectibles: `Harrison_Collectibles_${modeLabel}_9x16.jpg`
  };

  document.querySelectorAll('.theme-brand-9x16').forEach((img) => {
    const brandKey = (img.dataset.brand || 'arbitrage').toLowerCase();
    const targetSrc = brandAssetMap[brandKey] || brandAssetMap.arbitrage;
    if (img.getAttribute('src') !== targetSrc) {
      img.setAttribute('src', targetSrc);
    }
  });

  /* D. Update Dynamic Theme Status Captions (.theme-status-caption) */
  document.querySelectorAll('[data-caption-dark][data-caption-light]').forEach((el) => {
    el.textContent = isLight
      ? el.getAttribute('data-caption-light')
      : el.getAttribute('data-caption-dark');
  });
}

/**
 * 2. Initialize Header Controls:
 *    - Dark/Light Theme Toggle (#theme-toggle)
 *    - Mobile Center-Scroll View Toggle (#view-mode-toggle)
 *    - Mobile Drawer Menu (#mobile-nav-toggle / .mobile-menu-btn)
 */
function initHeaderControls() {
  const rootEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const viewBtn = document.getElementById('view-mode-toggle');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  const syncControlLabels = () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    const isMobileView = rootEl.getAttribute('data-view') === 'mobile';

    if (themeBtn) {
      themeBtn.innerHTML = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
      themeBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    if (viewBtn) {
      viewBtn.innerHTML = isMobileView ? '🖥️ Full View' : '📱 Mobile View';
      viewBtn.classList.toggle('active', isMobileView);
      viewBtn.setAttribute('aria-pressed', isMobileView ? 'true' : 'false');
    }

    syncThemeMediaAssets();
  };

  syncControlLabels();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      rootEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('harrison-theme', nextTheme);
      syncControlLabels();
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      const isMobileView = rootEl.getAttribute('data-view') === 'mobile';
      if (isMobileView) {
        rootEl.removeAttribute('data-view');
        localStorage.setItem('harrison-view-mode', 'standard');
      } else {
        rootEl.setAttribute('data-view', 'mobile');
        localStorage.setItem('harrison-view-mode', 'mobile');
      }
      syncControlLabels();
    });
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.textContent = isOpen ? '✕ CLOSE' : '☰ MENU';
    });
  }
}

/**
 * 3. Highlight Current Active Page in Navigation
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath.startsWith('series-') && href === 'publishing.html')
    ) {
      link.classList.add('active');
    }
  });
}

/**
 * 4. Collapsible Details for Mobile Center-Scrolling View
 *    Allows long cards or volume descriptions to collapse/expand cleanly on mobile
 */
function initMobileCollapsibleCards() {
  document.querySelectorAll('[data-collapsible-card]').forEach((card) => {
    const content = card.querySelector('.collapsible-content');
    const toggleBtn = card.querySelector('.collapse-toggle-btn');
    if (!content || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isCollapsed = content.classList.toggle('is-collapsed');
      toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
      toggleBtn.innerHTML = isCollapsed
        ? '<span>Show Full Details</span> <span>[+]</span>'
        : '<span>Collapse Details</span> <span>[−]</span>';
    });
  });
}

/**
 * 5. Automatic Zero-Edit Fallback for Any Missing Future Book/Brand Image
 */
function initMissingAssetFallbacks() {
  document.querySelectorAll('img[data-fallback-title]').forEach((img) => {
    const handleFallback = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';

      const srcAttr = img.getAttribute('src') || 'Asset_File.jpg';
      const title = img.getAttribute('data-fallback-title') || 'Harrison Arbitrage Asset';
      const status = img.getAttribute('data-asset-status') || 'ASSET';

      if (img.classList.contains('theme-brand-logo')) {
        const parent = img.parentElement;
        img.style.display = 'none';
        if (parent && !parent.querySelector('.logo-monogram-fallback')) {
          const badge = document.createElement('span');
          badge.className = 'logo-monogram-fallback';
          badge.textContent = 'HA';
          parent.appendChild(badge);
        }
        return;
      }

      const wrapper = img.parentElement;
      img.style.display = 'none';

      if (wrapper && !wrapper.querySelector('.asset-fallback-box')) {
        const fallbackEl = document.createElement('div');
        fallbackEl.className = 'asset-fallback-box';
        fallbackEl.innerHTML = `
          <span class="fallback-monogram">HARRISON ARBITRAGE // ${status}</span>
          <div class="fallback-title">${title}</div>
          <span class="fallback-filename">${srcAttr}</span>
        `;
        wrapper.appendChild(fallbackEl);
      }
    };

    img.addEventListener('error', handleFallback);
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderControls();
  highlightActiveNav();
  initMobileCollapsibleCards();
  initMissingAssetFallbacks();
  syncThemeMediaAssets();
});
