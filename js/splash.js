/**
 * Water Splash Intro Animation Engine
 * Creates realistic liquid droplet physics, ripples, and water particle effects on Canvas.
 */

class WaterSplash {
  constructor() {
    this.canvas = document.getElementById('water-canvas');
    this.screen = document.getElementById('splash-screen');
    this.enterBtn = document.getElementById('splash-enter-btn');
    if (!this.canvas || !this.screen) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.ripples = [];
    this.droplets = [];
    this.ambientParticles = [];
    this.isActive = true;
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate ambient glistening water floating particles
    for (let i = 0; i < 40; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Trigger initial impact splash in the center
    setTimeout(() => {
      this.triggerImpactSplash(this.width / 2, this.height * 0.45);
      if (window.soundEngine) {
        window.soundEngine.playWaterSplash();
      }
    }, 300);

    // Mouse movement creates gentle ripples
    let lastMove = 0;
    this.screen.addEventListener('mousemove', (e) => {
      if (!this.isActive) return;
      const now = performance.now();
      if (now - lastMove > 90) {
        lastMove = now;
        this.addRipple(e.clientX, e.clientY, 0.4, 30);
        if (window.soundEngine && Math.random() > 0.6) {
          window.soundEngine.playWaterRipple();
        }
      }
    });

    // Click on canvas or enter button dismisses splash and enters portfolio
    if (this.enterBtn) {
      this.enterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismiss();
      });
    }

    this.screen.addEventListener('click', () => {
      if (this.isActive) {
        this.dismiss();
      }
    });

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  triggerImpactSplash(cx, cy) {
    // 1. Expanding ripples
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.addRipple(cx, cy, 1.2 - i * 0.2, 180 + i * 40);
      }, i * 140);
    }

    // 2. Flying water droplets explosion
    const dropletCount = 65;
    for (let i = 0; i < dropletCount; i++) {
      const angle = (Math.PI * 2 * i) / dropletCount + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 11 + 4;
      this.droplets.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        radius: Math.random() * 4 + 2,
        gravity: 0.38,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.015 + 0.012,
        color: Math.random() > 0.3 ? '#7dd3fc' : '#ffffff'
      });
    }
  }

  addRipple(x, y, maxStrength = 1, maxRadius = 150) {
    this.ripples.push({
      x,
      y,
      radius: 5,
      maxRadius,
      strength: maxStrength,
      alpha: 0.8 * maxStrength,
      speed: 3.2
    });
  }

  dismiss() {
    if (!this.isActive) return;
    this.isActive = false;

    // Splash sound & final bursting ripples
    if (window.soundEngine) {
      window.soundEngine.playWaterSplash();
      window.soundEngine.playPaperUnfold();
    }

    this.triggerImpactSplash(this.width / 2, this.height / 2);

    // Fade out splash screen
    setTimeout(() => {
      this.screen.classList.add('fade-out');
      setTimeout(() => {
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
        }
      }, 900);
    }, 350);
  }

  replay() {
    this.screen.classList.remove('fade-out');
    this.isActive = true;
    this.ripples = [];
    this.droplets = [];
    if (window.soundEngine) {
      window.soundEngine.playWaterSplash();
    }
    setTimeout(() => {
      this.triggerImpactSplash(this.width / 2, this.height * 0.45);
    }, 200);
    this.animate();
  }

  animate() {
    if (!this.isActive && this.ripples.length === 0 && this.droplets.length === 0) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Ambient floating shimmering particles
    for (const p of this.ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.03;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const currentAlpha = p.alpha + Math.sin(p.phase) * 0.15;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0, currentAlpha)})`;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.alpha = Math.max(0, (1 - r.radius / r.maxRadius) * r.strength);

      if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.lineWidth = 2.2;
      this.ctx.strokeStyle = `rgba(125, 211, 252, ${r.alpha})`;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();

      // Inner faint secondary ring
      if (r.radius > 15) {
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, r.radius * 0.75, 0, Math.PI * 2);
        this.ctx.lineWidth = 1.2;
        this.ctx.strokeStyle = `rgba(224, 242, 254, ${r.alpha * 0.5})`;
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    // Droplets
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const d = this.droplets[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += d.gravity;
      d.vx *= 0.985;
      d.life -= d.decay;
      d.alpha = Math.max(0, d.life);

      if (d.life <= 0 || d.y > this.height + 20) {
        this.droplets.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.radius * (0.6 + d.life * 0.4), 0, Math.PI * 2);
      this.ctx.fillStyle = d.color === '#ffffff'
        ? `rgba(255, 255, 255, ${d.alpha * 0.9})`
        : `rgba(125, 211, 252, ${d.alpha * 0.8})`;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.waterSplashInstance = new WaterSplash();
});

