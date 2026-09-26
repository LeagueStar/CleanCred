/* ==========================================================================
   CLEANCRED — QR CODE UTILITIES
   Thin wrapper around the "qrcode-generator" library (loaded via CDN in
   index.html, exposed as the global window.qrcode function). Encodes and
   decodes the payload printed on a citizen's pickup QR code.
   ========================================================================== */

// Every CleanCred pickup QR encodes this fixed prefix + the request ID.
// The prefix lets us recognize "this looks like one of our QR codes" before
// even checking whether the request ID exists in state.
const QR_PREFIX = 'GREENLEGACY:';

export const QRCode = {
  // The exact string encoded into a pickup's QR code (now the real one-time token).
  payloadFor(tokenOrId) {
    if (!tokenOrId) return '';
    return String(tokenOrId).trim();
  },

  // Extract a raw one-time token or pickup ID from scanned or manually-typed text.
  extractToken(rawText) {
    if (!rawText) return null;
    let text = String(rawText).trim();
    if (text.toUpperCase().startsWith(QR_PREFIX)) {
      text = text.slice(QR_PREFIX.length).trim();
    }
    return text || null;
  },

  // Extract a pickup ID or token from scanned or manually-typed text.
  extractPickupId(rawText) {
    return this.extractToken(rawText);
  },

  // Render an actual scannable QR code (SVG) into a container element.
  renderInto(containerId, tokenOrId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof window.qrcode !== 'function') {
      container.innerHTML = `
        <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); padding: 0.75rem; border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center;">
          QR library unavailable (possibly offline).<br>Token: <strong>${tokenOrId}</strong>
        </div>
      `;
      return;
    }

    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(this.payloadFor(tokenOrId));
      qr.make();
      container.innerHTML = qr.createSvgTag(4, 2);
    } catch (e) {
      console.warn('CleanCred: could not render QR code.', e);
      container.innerHTML = `
        <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); padding: 0.75rem; border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center;">
          QR could not be rendered.<br>Token: <strong>${tokenOrId}</strong>
        </div>
      `;
    }
  }
};

window.QRCode = QRCode;
