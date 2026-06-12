/* ═══════════════════════════════════════════════
   form.js — Contact Form Validation & Submit
═══════════════════════════════════════════════ */

'use strict';

(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  /* ── Field rules ── */
  const rules = {
    name:    { required: true, minLength: 2, label: 'Nombre' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email' },
    subject: { required: true, minLength: 3, label: 'Asunto' },
    message: { required: true, minLength: 10, label: 'Mensaje' },
  };

  /* ── Validate a single field ── */
  function validateField(name, value) {
    const rule = rules[name];
    if (!rule) return '';

    const v = value.trim();

    if (rule.required && !v) {
      return `${rule.label} es obligatorio.`;
    }
    if (rule.minLength && v.length < rule.minLength) {
      return `${rule.label} debe tener al menos ${rule.minLength} caracteres.`;
    }
    if (rule.pattern && !rule.pattern.test(v)) {
      return 'Introduce un email válido.';
    }
    return '';
  }

  /* ── Show / clear error for a field ── */
  function showError(name, msg) {
    const input = form.elements[name];
    const errEl = document.getElementById(`${name}-error`);
    if (input)  input.classList.toggle('invalid', !!msg);
    if (errEl) errEl.textContent = msg;
  }

  /* ── Validate all fields; returns true if valid ── */
  function validateAll() {
    let valid = true;
    Object.keys(rules).forEach(name => {
      const input = form.elements[name];
      const msg   = validateField(name, input ? input.value : '');
      showError(name, msg);
      if (msg) valid = false;
    });
    return valid;
  }

  /* ── Real-time validation on blur ── */
  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    if (!input) return;

    input.addEventListener('blur', () => {
      const msg = validateField(name, input.value);
      showError(name, msg);
    });

    input.addEventListener('input', () => {
      // Clear error as soon as user starts fixing
      const errEl = document.getElementById(`${name}-error`);
      if (errEl && errEl.textContent) {
        const msg = validateField(name, input.value);
        showError(name, msg);
      }
    });
  });

  /* ── Submit handler ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    const submitBtn  = form.querySelector('.form-submit');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Loading state
    submitBtn.disabled = true;
    btnText.hidden     = true;
    btnLoading.hidden  = false;

    try {
      // Simulate network request (replace with real fetch in production)
      await new Promise(resolve => setTimeout(resolve, 1400));

      // Success
      showToast('✅  Mensaje enviado. ¡Te respondo pronto!');
      form.reset();
      Object.keys(rules).forEach(name => showError(name, ''));

    } catch (err) {
      showToast('❌  Algo salió mal. Inténtalo de nuevo.');
      console.error('Form submission error:', err);

    } finally {
      submitBtn.disabled = false;
      btnText.hidden     = false;
      btnLoading.hidden  = true;
    }
  });
})();
