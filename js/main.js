/* ═══════════════════════════════════════════════
   main.js — App Entry Point & Global UI
   Runs after all other scripts are loaded.
═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */
function toggleMenu() {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (!menu) return;

  const isOpen = menu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);

  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobileMenu');
    if (menu && menu.classList.contains('open')) toggleMenu();
  }
});

/* ─────────────────────────────────────────────
   ACTIVE NAV LINK (highlight on scroll)
───────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.style.color = active
            ? 'var(--color-white)'
            : '';
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ─────────────────────────────────────────────
   PREVENT FLASH OF UNSTYLED CONTENT
───────────────────────────────────────────── */
document.documentElement.classList.add('js-ready');
