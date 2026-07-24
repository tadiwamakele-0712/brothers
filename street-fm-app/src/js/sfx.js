/** Synthesized DJ sound effects via Web Audio API */
import { player } from './player.js';

let ctx;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, duration, type = 'sawtooth', gain = 0.2, slideTo) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + duration);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playSfx(kind) {
  getCtx();
  switch (kind) {
    case 'airhorn':
      tone(220, 0.9, 'sawtooth', 0.25, 180);
      setTimeout(() => tone(180, 0.6, 'sawtooth', 0.2, 140), 200);
      break;
    case 'drop':
      tone(120, 0.5, 'square', 0.3, 40);
      break;
    case 'siren': {
      const c = getCtx();
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, c.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, c.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(600, c.currentTime + 0.8);
      g.gain.setValueAtTime(0.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1);
      osc.connect(g);
      g.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 1);
      break;
    }
    case 'clap':
      noiseBurst(0.08, 0.35);
      break;
    case 'whoosh':
      noiseBurst(0.45, 0.2, true);
      break;
    case 'riser':
      tone(200, 1.2, 'sawtooth', 0.12, 900);
      break;
    default:
      tone(440, 0.2, 'triangle', 0.15);
  }
}

function noiseBurst(duration, gainVal, sweep = false) {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const g = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(sweep ? 400 : 2000, c.currentTime);
  if (sweep) filter.frequency.exponentialRampToValueAtTime(4000, c.currentTime + duration);
  g.gain.setValueAtTime(gainVal, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  src.connect(filter);
  filter.connect(g);
  g.connect(c.destination);
  src.start();
}

/** Voice-over with music ducking (Web Speech API) */
export function playVoiceOver(text, { rate = 1, pitch = 1 } = {}) {
  if (!('speechSynthesis' in window)) {
    alert('Voice-over not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  player.duck(0.18);
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = pitch;
  const restore = () => player.unduck();
  u.onend = restore;
  u.onerror = restore;
  window.speechSynthesis.speak(u);
}

export function stopVoiceOver() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  player.unduck();
}
