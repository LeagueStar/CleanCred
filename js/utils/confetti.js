/* ==========================================================================
   GREEN LEGACY — CANVAS CONFETTI PARTICLE ENGINE
   ========================================================================== */

export class ConfettiManager {
  constructor() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confetti-canvas';
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  trigger(count = 70, duration = 3000) {
    const colors = ['#16A34A', '#84CC16', '#0B5D3B', '#F59E0B', '#3B82F6', '#10B981', '#FBBF24'];
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 300,
        y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 12 - 4,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    if (!this.animationId) {
      const startTime = Date.now();
      const loop = () => {
        const elapsed = Date.now() - startTime;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let activeCount = 0;
        this.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.rotation += p.vRot;

          if (elapsed > duration - 1000) {
            p.alpha -= 0.02;
          }

          if (p.alpha > 0 && p.y < this.canvas.height) {
            activeCount++;
            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            this.ctx.restore();
          }
        });

        if (activeCount > 0 && elapsed < duration) {
          this.animationId = requestAnimationFrame(loop);
        } else {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.animationId = null;
        }
      };
      this.animationId = requestAnimationFrame(loop);
    }
  }
}

export const Confetti = new ConfettiManager();
