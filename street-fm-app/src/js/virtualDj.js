/**
 * Virtual DJ — dual-deck mixer with crossfader, cue, and tempo.
 */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

class Deck {
  constructor(id) {
    this.id = id;
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.track = null;
    this.cuePoint = 0;
    this.rate = 1;
    this.gain = 1;
    this.listeners = new Set();
    this.audio.addEventListener('timeupdate', () => this.emit());
    this.audio.addEventListener('play', () => this.emit());
    this.audio.addEventListener('pause', () => this.emit());
    this.audio.addEventListener('ended', () => this.emit());
    this.audio.addEventListener('loadedmetadata', () => this.emit());
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    this.listeners.forEach((fn) => fn(this.snapshot()));
  }

  snapshot() {
    return {
      id: this.id,
      track: this.track,
      playing: !this.audio.paused,
      currentTime: this.audio.currentTime || 0,
      duration: this.audio.duration || 0,
      cuePoint: this.cuePoint,
      rate: this.rate,
      gain: this.gain,
    };
  }

  async load(track) {
    this.track = track;
    this.cuePoint = 0;
    this.audio.src = track.src;
    this.audio.load();
    this.audio.playbackRate = this.rate;
    this.emit();
  }

  async play() {
    if (!this.track) return;
    try {
      await this.audio.play();
    } catch (err) {
      console.warn('Deck play blocked', err);
    }
    this.emit();
  }

  pause() {
    this.audio.pause();
    this.emit();
  }

  toggle() {
    if (this.audio.paused) this.play();
    else this.pause();
  }

  setCue() {
    this.cuePoint = this.audio.currentTime || 0;
    this.emit();
  }

  jumpCue() {
    this.audio.currentTime = this.cuePoint || 0;
    this.emit();
  }

  seek(ratio) {
    if (!this.audio.duration) return;
    this.audio.currentTime = clamp(ratio, 0, 1) * this.audio.duration;
    this.emit();
  }

  nudge(seconds) {
    this.audio.currentTime = clamp((this.audio.currentTime || 0) + seconds, 0, this.audio.duration || 0);
    this.emit();
  }

  setRate(rate) {
    this.rate = clamp(Number(rate) || 1, 0.7, 1.3);
    this.audio.playbackRate = this.rate;
    this.emit();
  }

  setGain(gain) {
    this.gain = clamp(Number(gain) || 0, 0, 1);
    this.applyVolume(1);
    this.emit();
  }

  applyVolume(crossGain) {
    this.audio.volume = clamp(this.gain * crossGain, 0, 1);
  }
}

class VirtualDj {
  constructor() {
    this.deckA = new Deck('A');
    this.deckB = new Deck('B');
    this.crossfade = 0.5;
    this.master = 1;
    this.listeners = new Set();
    this.applyCrossfade();
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    const state = this.snapshot();
    this.listeners.forEach((fn) => fn(state));
  }

  snapshot() {
    return {
      crossfade: this.crossfade,
      master: this.master,
      a: this.deckA.snapshot(),
      b: this.deckB.snapshot(),
    };
  }

  deck(which) {
    return which === 'B' || which === 'b' ? this.deckB : this.deckA;
  }

  setCrossfade(value) {
    this.crossfade = clamp(Number(value), 0, 1);
    this.applyCrossfade();
    this.emit();
  }

  setMaster(value) {
    this.master = clamp(Number(value), 0, 1);
    this.applyCrossfade();
    this.emit();
  }

  applyCrossfade() {
    // Equal-power-ish crossfade curve
    const x = this.crossfade;
    const aGain = Math.cos(x * 0.5 * Math.PI) * this.master;
    const bGain = Math.sin(x * 0.5 * Math.PI) * this.master;
    this.deckA.applyVolume(aGain);
    this.deckB.applyVolume(bGain);
  }

  stopAll() {
    this.deckA.pause();
    this.deckB.pause();
  }
}

export const virtualDj = new VirtualDj();
