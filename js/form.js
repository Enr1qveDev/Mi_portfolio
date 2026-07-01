/* ═══════════════════════════════════════════════
   form.js — Contact Form Validation & Submit
═══════════════════════════════════════════════ */

'use strict';

(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // TODO: sustituye por tu email real (debe coincidir con el del footer/redes)
  const CONTACT_EMAIL = 'tu-email-real@ejemplo.com';

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
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    const submitBtn  = form.querySelector('.form-submit');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    const data = {
      name:    form.elements.name.value.trim(),
      email:   form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim(),
    };

    // Loading state (breve, para feedback visual antes de abrir el cliente de correo)
    submitBtn.disabled = true;
    btnText.hidden     = true;
    btnLoading.hidden  = false;

    try {
      const mailSubject = encodeURIComponent(`[Portfolio] ${data.subject}`);
      const mailBody    = encodeURIComponent(
        `Nombre: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      );
      const mailtoLink  = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

      window.location.href = mailtoLink;

      showToast('Abriendo tu cliente de correo…');
      form.reset();
      Object.keys(rules).forEach(name => showError(name, ''));

    } catch (err) {
      showToast('Algo salió mal. Inténtalo de nuevo.');
      console.error('Form submission error:', err);

    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.hidden     = false;
        btnLoading.hidden  = true;
      }, 600);
    }
  });
})();
