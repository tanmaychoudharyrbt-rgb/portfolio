/**
 * Audio Synthesis Engine for Paper Portfolio
 * Uses Web Audio API to procedurally generate sound effects:
 * - Water splash and droplets
 * - Paper crumple and crunch
 * - Cute anime chibi nom / chew / swallow / pop
 * - Paper throw whoosh and unfold rustle
 * 100% self-contained, no external audio files required.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported:", e);
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Water Splash Sounds ---
  playWaterSplash() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Splash noise burst
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.5);
    filter.Q.setValueAtTime(2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // High droplet bloops
    [0.05, 0.12, 0.22, 0.35].forEach((delay, idx) => {
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const baseFreq = 900 + idx * 300 + Math.random() * 200;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t + delay);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, t + delay + 0.08);

      dropGain.gain.setValueAtTime(0.15, t + delay);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.1);

      osc.connect(dropGain);
      dropGain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.11);
    });
  }

  playWaterRipple() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 1200 + Math.random() * 400;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.4, t + 0.07);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // --- Paper Crumple Sound ---
  playPaperCrumple() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.7;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Procedural crackling paper texture
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI);
      const crackle = Math.random() > 0.85 ? (Math.random() * 2 - 1) * 1.8 : (Math.random() * 0.4 - 0.2);
      data[i] = crackle * envelope;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.linearRampToValueAtTime(2800, t + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(900, t + duration);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.linearRampToValueAtTime(0.5, t + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // --- Cute Anime Chibi Nom / Chew Sound ---
  playAnimeNom() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Cute high-pitch "cronch / nom"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(850, t + 0.05);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);

    // Little paper crunch bite
    const biteSize = Math.floor(this.ctx.sampleRate * 0.08);
    const biteBuf = this.ctx.createBuffer(1, biteSize, this.ctx.sampleRate);
    const d = biteBuf.getChannelData(0);
    for (let i = 0; i < biteSize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.6;
    }
    const biteNoise = this.ctx.createBufferSource();
    biteNoise.buffer = biteBuf;

    const bFilter = this.ctx.createBiquadFilter();
    bFilter.type = 'highpass';
    bFilter.frequency.setValueAtTime(1200, t);

    const bGain = this.ctx.createGain();
    bGain.gain.setValueAtTime(0.18, t);
    bGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    biteNoise.connect(bFilter);
    bFilter.connect(bGain);
    bGain.connect(this.ctx.destination);

    biteNoise.start(t);
  }

  // --- Anime Gulp / Swallow Sound ---
  playAnimeGulp() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.16);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // --- Anime Regurgitate / Pop Sound ---
  playAnimePop() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.08);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  // --- Paper Throw Whoosh ---
  playThrowWhoosh() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.35;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, t + duration);
    filter.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // --- Paper Unfold / Crisp Spread Sound ---
  playPaperUnfold() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const duration = 0.55;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const p = i / bufferSize;
      const env = Math.sin(p * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * (Math.random() > 0.8 ? 1.5 : 0.6);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.frequency.linearRampToValueAtTime(800, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // --- Happy Chime ---
  playSuccessChime() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);

      gain.gain.setValueAtTime(0.12, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.26);
    });
  }
}

// Global singleton instance
window.soundEngine = new SoundEngine();

