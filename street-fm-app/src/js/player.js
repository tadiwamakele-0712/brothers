import { TRACKS } from './catalog.js';

class RadioPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.queue = [...TRACKS];
    this.index = 0;
    this.autoplay = true;
    this.baseVolume = 1;
    this.listeners = new Set();
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('timeupdate', () => this.emit());
    this.audio.addEventListener('play', () => this.emit());
    this.audio.addEventListener('pause', () => this.emit());
  }

  on(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    const track = this.current();
    this.listeners.forEach((fn) =>
      fn({
        track,
        index: this.index,
        playing: !this.audio.paused,
        currentTime: this.audio.currentTime || 0,
        duration: this.audio.duration || 0,
        autoplay: this.autoplay,
      })
    );
  }

  current() {
    return this.queue[this.index] || null;
  }

  setQueue(tracks, startIndex = 0) {
    this.queue = tracks.length ? tracks : [...TRACKS];
    this.index = Math.max(0, Math.min(startIndex, this.queue.length - 1));
  }

  load(index = this.index) {
    this.index = index;
    const track = this.current();
    if (!track) return;
    this.audio.src = track.src;
    this.audio.load();
    this.emit();
  }

  async play(index) {
    if (typeof index === 'number') this.load(index);
    if (!this.audio.src) this.load(this.index);
    try {
      await this.audio.play();
    } catch (err) {
      console.warn('Playback blocked until user gesture', err);
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

  next() {
    if (!this.queue.length) return;
    this.index = (this.index + 1) % this.queue.length;
    if (this.autoplay) this.play(this.index);
    else this.load(this.index);
  }

  prev() {
    if (!this.queue.length) return;
    this.index = (this.index - 1 + this.queue.length) % this.queue.length;
    this.play(this.index);
  }

  seek(ratio) {
    if (!this.audio.duration) return;
    this.audio.currentTime = ratio * this.audio.duration;
  }

  setAutoplay(on) {
    this.autoplay = on;
    this.emit();
  }

  setVolume(level) {
    const v = Math.max(0, Math.min(1, Number(level)));
    this.baseVolume = v;
    this.audio.volume = v;
  }

  duck(level = 0.22) {
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  unduck() {
    this.audio.volume = this.baseVolume;
  }

  getMediaElement() {
    return this.audio;
  }
}

export const player = new RadioPlayer();
