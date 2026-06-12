/* ═══════════════════════════════════════════════
   utils.js — Shared Utility Functions
═══════════════════════════════════════════════ */

'use strict';

/**
 * Smooth-scroll to a section by id.
 * @param {string} id - The section id (without #)
 */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show the toast notification with a given message.
 * @param {string} message
 * @param {number} [duration=4000] - ms before auto-hide
 */
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} wait - ms
 * @returns {Function}
 */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
