/* ==========================================================================
   GREEN LEGACY — LIVE CAMERA QR SCANNER
   Thin wrapper around getUserMedia + the "jsQR" decoding library (loaded
   via CDN in index.html, exposed as the global window.jsQR function).

   This module is deliberately honest about camera availability: start()
   calls onError() (rather than silently doing nothing) whenever the camera
   can't actually be used, so the calling UI can fall back to manual entry
   instead of showing a scanner that will never find anything.
   ========================================================================== */

export const QRScanner = {
  stream: null,
  videoEl: null,
  canvasEl: null,
  rafId: null,
  running: false,

  // Returns true only if this browser/context could plausibly support a
  // live camera scan at all (secure context + getUserMedia + jsQR present).
  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof window.jsQR === 'function';
  },

  // Start scanning. onDecode(text) fires once with the raw decoded string
  // the first time a QR code is found (the loop stops itself after that —
  // call start() again to scan another code). onError(message) fires if the
  // camera can't be accessed for any reason.
  async start(videoElementId, canvasElementId, onDecode, onError) {
    this.stop();

    if (!this.isSupported()) {
      onError('Camera scanning isn\u2019t supported in this browser/context.');
      return;
    }

    this.videoEl = document.getElementById(videoElementId);
    this.canvasEl = document.getElementById(canvasElementId);
    if (!this.videoEl || !this.canvasEl) {
      onError('Scanner UI not ready.');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
    } catch (e) {
      onError('Camera access unavailable or denied.');
      return;
    }

    this.videoEl.srcObject = this.stream;
    this.videoEl.setAttribute('playsinline', 'true');
    await this.videoEl.play();

    this.running = true;
    const ctx = this.canvasEl.getContext('2d');

    const tick = () => {
      if (!this.running) return;

      if (this.videoEl.readyState === this.videoEl.HAVE_ENOUGH_DATA) {
        this.canvasEl.width = this.videoEl.videoWidth;
        this.canvasEl.height = this.videoEl.videoHeight;
        ctx.drawImage(this.videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);

        const imageData = ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height);
        const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          this.stop();
          onDecode(code.data);
          return;
        }
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  },

  // Stop the scan loop and release the camera. Safe to call even if not running.
  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }
  }
};

window.QRScanner = QRScanner;
