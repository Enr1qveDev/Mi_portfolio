/* ═══════════════════════════════════════════════
   animations.js — Scroll Reveal & Parallax
═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────────── */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If reduced motion, show everything immediately
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ─────────────────────────────────────────────
   SKILL BAR ANIMATION (IntersectionObserver)
───────────────────────────────────────────── */
(function initSkillBars() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill = entry.target.querySelector('.skill-bar-fill');
        const pct  = entry.target.dataset.fill || '80';
        if (fill) {
          fill.style.width = prefersReduced ? pct + '%' : '0';
          // Trigger reflow, then animate
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              fill.style.width = pct + '%';
            });
          });
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
})();

/* ─────────────────────────────────────────────
   NAVBAR — shrink on scroll
───────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const SCROLLED_BG    = 'rgba(10,10,15,0.96)';
  const TRANSPARENT_BG = 'rgba(10,10,15,0.75)';

  const handleScroll = debounce(() => {
    nav.style.background = window.scrollY > 40 ? SCROLLED_BG : TRANSPARENT_BG;
  }, 10);

  window.addEventListener('scroll', handleScroll, { passive: true });
})();

/* ─────────────────────────────────────────────
   ORB PARALLAX — follows mouse
───────────────────────────────────────────── */
(function initParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 30;
    targetY = (e.clientY / window.innerHeight - 0.5) * 30;
  }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    currentX = lerp(currentX, targetX, 0.06);
    currentY = lerp(currentY, targetY, 0.06);

    orbs.forEach((orb, i) => {
      const factor = i === 0 ? 1 : -1.4;
      orb.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  animate();
})();
