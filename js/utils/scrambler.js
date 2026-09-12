/* ==========================================================================
   CLEANCRED — KINETIC TYPOGRAPHY & TELEMETRY SCRAMBLER ENGINE
   High-framerate mechanical number scramble & alphanumeric lock
   ========================================================================== */

export const KineticScrambler = {
  chars: '0123456789ABCDEF0123456789',
  symbols: '!<>-_\\/[]{}—=+*^?#________',

  /**
   * Scramble an HTML element's text content to a target value.
   * @param {HTMLElement|string} target - DOM element or selector
   * @param {string|number} finalValue - Target text/number to reveal
   * @param {Object} options - Configuration options
   */
  scramble(target, finalValue, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    const strValue = String(finalValue);
    const duration = options.duration || 650;
    const fps = options.fps || 60;
    const interval = 1000 / fps;
    const totalFrames = Math.round(duration / interval);
    let frame = 0;

    const originalText = el.innerText || '';

    // Cancel existing animation on element if any
    if (el._scrambleTimer) {
      cancelAnimationFrame(el._scrambleTimer);
    }

    const startTime = performance.now();

    function update() {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);

      // Number of locked characters from left to right
      const lockedLength = Math.floor(progress * strValue.length);

      let output = '';
      for (let i = 0; i < strValue.length; i++) {
        const char = strValue[i];
        if (i < lockedLength || progress >= 1.0) {
          output += char;
        } else if (char === ' ' || char === ',' || char === '.' || char === ':' || char === '-' || char === '/' || char === '°') {
          output += char;
        } else {
          // Scramble characters
          const pool = (options.numbersOnly && /[0-9]/.test(char)) ? '0123456789' : KineticScrambler.chars;
          output += pool[Math.floor(Math.random() * pool.length)];
        }
      }

      el.innerText = output;

      if (progress < 1.0) {
        el._scrambleTimer = requestAnimationFrame(update);
      } else {
        el.innerText = strValue;
        el._scrambleTimer = null;
        if (options.onComplete) options.onComplete();
      }
    }

    el._scrambleTimer = requestAnimationFrame(update);
  },

  /**
   * Scramble all elements matching a selector with data-scramble attribute.
   */
  scrambleAll(root = document) {
    const elements = root.querySelectorAll('[data-scramble]');
    elements.forEach((el, idx) => {
      const targetVal = el.getAttribute('data-scramble') || el.innerText;
      setTimeout(() => {
        this.scramble(el, targetVal, {
          duration: 500 + Math.random() * 300,
          numbersOnly: el.hasAttribute('data-scramble-numeric')
        });
      }, idx * 40);
    });
  }
};

window.KineticScrambler = KineticScrambler;
