/* ═══════════════════════════════════════════════
   typewriter.js — Animated Typewriter Effect
═══════════════════════════════════════════════ */

'use strict';

(function initTypewriter() {
  const el = document.getElementById('typed');
  if (!el) return;

  const phrases = [
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'Next.js Advocate',
    'Open Source Contributor',
    'Problem Solver',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let timeoutId    = null;

  const SPEED_TYPE   = 100;  // ms per char when typing
  const SPEED_DELETE = 55;   // ms per char when deleting
  const PAUSE_END    = 1800; // ms pause at end of word
  const PAUSE_START  = 300;  // ms pause before next word

  function tick() {
    const word = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      el.textContent = word.slice(0, charIndex);

      if (charIndex === word.length) {
        // Reached end — pause then start deleting
        isDeleting = true;
        timeoutId = setTimeout(tick, PAUSE_END);
        return;
      }
    } else {
      // Deleting
      charIndex--;
      el.textContent = word.slice(0, charIndex);

      if (charIndex === 0) {
        // Fully deleted — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timeoutId = setTimeout(tick, PAUSE_START);
        return;
      }
    }

    timeoutId = setTimeout(tick, isDeleting ? SPEED_DELETE : SPEED_TYPE);
  }

  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    el.textContent = phrases[0];
    return;
  }

  // Small initial delay so the page renders first
  timeoutId = setTimeout(tick, 600);
})();
