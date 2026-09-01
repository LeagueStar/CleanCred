/* ==========================================================================
   GREEN LEGACY — QR CODE UTILITIES
   Thin wrapper around the "qrcode-generator" library (loaded via CDN in
   index.html, exposed as the global window.qrcode function). Encodes and
   decodes the payload printed on a citizen's pickup QR code.
   ========================================================================== */

// Every Green Legacy pickup QR encodes this fixed prefix + the request ID.
// The prefix lets us recognize "this looks like one of our QR codes" before
// even checking whether the request ID exists in state.
const QR_PREFIX = 'GREENLEGACY:';

export const QRCode = {
  // The exact string encoded into a pickup's QR code.
  payloadFor(pickupId) {
    return `${QR_PREFIX}${pickupId}`;
  },

  // Extract a pickup ID from scanned or manually-typed text. Accepts the
  // full prefixed payload ("GREENLEGACY:GK-2026-89421") from a real scan,
  // or a bare request ID ("GK-2026-89421") typed into the manual fallback.
  // Returns null if the text doesn't look like a Green Legacy pickup ID at all.
  extractPickupId(rawText) {
    if (!rawText) return null;
    const text = String(rawText).trim();

    if (text.toUpperCase().startsWith(QR_PREFIX)) {
      return text.slice(QR_PREFIX.length).trim().toUpperCase();
    }
    if (/^GK-\d{4}-\d+$/i.test(text)) {
      return text.toUpperCase();
    }
    return null;
  },

  // Render an actual scannable QR code (SVG) into a container element.
  // Honest about failure: if the vendored library didn't load (e.g. no
  // internet at demo time), shows the plain-text request ID instead of
  // pretending a QR code is there.
  renderInto(containerId, pickupId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof window.qrcode !== 'function') {
      container.innerHTML = `
        <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); padding: 0.75rem; border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center;">
          QR library unavailable (possibly offline).<br>Show Request ID <strong>${pickupId}</strong> to the collector instead.
        </div>
      `;
      return;
    }

    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(this.payloadFor(pickupId));
      qr.make();
      container.innerHTML = qr.createSvgTag(4, 2);
    } catch (e) {
      console.warn('Green Legacy: could not render QR code.', e);
      container.innerHTML = `
        <div style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); padding: 0.75rem; border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center;">
          QR could not be rendered.<br>Show Request ID <strong>${pickupId}</strong> to the collector instead.
        </div>
      `;
    }
  }
};

window.QRCode = QRCode;
