/* ==========================================================================
   HARRISON ARBITRAGE LLC — CORE INTERACTION ENGINE (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightActiveNav();
  initMissingAssetFallbacks();
  initMediaSwitchers();
});

/**
 * 1. Mobile Navigation Toggle
 */
function initMobileNav() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuBtn.textContent = isOpen ? 'CLOSE [X]' : 'MENU [≡]';
  });
}

/**
 * 2. Highlight Current Page in Navbar
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');

  links.forEach((link) => {
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
 * 3. Automatic Zero-Edit Fallback for Images Marked [NEED TO CREATE]
 *    When an image file isn't in the repo yet, replaces the broken image
 *    with an executive Black/Gold/Silver placeholder card. Once the image
 *    file is uploaded with that exact filename, it displays automatically.
 */
function initMissingAssetFallbacks() {
  const images = document.querySelectorAll('img[data-fallback-title]');

  images.forEach((img) => {
    const handleFallback = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';

      const srcAttr = img.getAttribute('src') || 'Asset_File.jpg';
      const title = img.getAttribute('data-fallback-title') || 'Harrison Arbitrage Asset';
      const status = img.getAttribute('data-asset-status') || 'NEED TO CREATE';

      // Special case for compact header/footer logo mark
      if (img.classList.contains('logo-img-asset')) {
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

      if (wrapper) {
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

    // If the browser already tried and failed before DOMContentLoaded finished
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    }
  });
}

/**
 * 4. Interactive Campaign Asset Switcher (Dark / Light / 9x16 / Animated MP4)
 */
function initMediaSwitchers() {
  const switcherGroups = document.querySelectorAll('[data-media-switcher]');

  switcherGroups.forEach((group) => {
    const buttons = group.querySelectorAll('.media-tab-btn');
    const stageImage = group.querySelector('.switcher-stage-img');
    const stageVideo = group.querySelector('.switcher-stage-video');
    const stageFrame = group.querySelector('.switcher-stage-frame');
    const captionEl = group.querySelector('.switcher-caption');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const type = btn.getAttribute('data-media-type'); // 'image' or 'video'
        const src = btn.getAttribute('data-media-src');
        const ratio = btn.getAttribute('data-media-ratio'); // '16x9' or '9x16'
        const caption = btn.getAttribute('data-media-caption');

        if (stageFrame) {
          stageFrame.classList.remove('asset-frame-16x9', 'asset-frame-9x16');
          stageFrame.classList.add(ratio === '9x16' ? 'asset-frame-9x16' : 'asset-frame-16x9');
        }

        if (type === 'video' && stageVideo && stageImage) {
          stageImage.style.display = 'none';
          stageVideo.style.display = 'block';
          if (stageVideo.getAttribute('src') !== src) {
            stageVideo.setAttribute('src', src);
            stageVideo.load();
          }
          stageVideo.play().catch(() => {});
        } else if (stageImage && stageVideo) {
          stageVideo.pause();
          stageVideo.style.display = 'none';
          stageImage.style.display = 'block';
          stageImage.setAttribute('src', src);
        }

        if (captionEl && caption) {
          captionEl.textContent = caption;
        }
      });
    });
  });
}
