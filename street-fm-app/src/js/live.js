/**
 * Lightweight WebRTC live room with invite codes.
 * Signaling uses BroadcastChannel locally; swaps to Firebase RTDB when configured.
 */
import { getFirebase, firebaseConfigured } from './firebase.js';
import { setLiveRoom, getState } from './store.js';

const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

function roomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export class LiveStudio {
  constructor() {
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.code = null;
    this.role = null; // host | guest
    this.channel = null;
    this.unsubRtdb = null;
    this.onRemote = null;
    this.onStatus = null;
  }

  status(msg) {
    if (this.onStatus) this.onStatus(msg);
  }

  async startHost({ video = true } = {}) {
    this.role = 'host';
    this.code = roomCode();
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: video ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
    });

    this.pc = new RTCPeerConnection(ICE);
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream));

    this.remoteStream = new MediaStream();
    this.pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => this.remoteStream.addTrack(t));
      if (this.onRemote) this.onRemote(this.remoteStream);
    };

    this.pc.onicecandidate = (e) => {
      if (e.candidate) this.signal({ type: 'ice', candidate: e.candidate.toJSON(), from: 'host' });
    };

    await this.bindSignaling(this.code);

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    this.signal({ type: 'offer', sdp: { type: offer.type, sdp: offer.sdp }, from: 'host' });

    setLiveRoom({ code: this.code, video, startedAt: Date.now(), host: getState().user.name });
    this.status(`On air — invite code ${this.code}`);
    return { code: this.code, stream: this.localStream };
  }

  async joinGuest(code, { video = true } = {}) {
    this.role = 'guest';
    this.code = code.toUpperCase().trim();
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: video ? { facingMode: 'user' } : false,
    });

    this.pc = new RTCPeerConnection(ICE);
    this.localStream.getTracks().forEach((t) => this.pc.addTrack(t, this.localStream));
    this.remoteStream = new MediaStream();
    this.pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => this.remoteStream.addTrack(t));
      if (this.onRemote) this.onRemote(this.remoteStream);
    };
    this.pc.onicecandidate = (e) => {
      if (e.candidate) this.signal({ type: 'ice', candidate: e.candidate.toJSON(), from: 'guest' });
    };

    await this.bindSignaling(this.code);
    this.status(`Joined room ${this.code} — waiting for host…`);
    return { stream: this.localStream };
  }

  async bindSignaling(code) {
    const { rtdb } = getFirebase();
    if (firebaseConfigured() && rtdb) {
      const { ref, push, onChildAdded, off } = await import('https://esm.sh/firebase@11.10.0/database');
      const signalsRef = ref(rtdb, `live/${code}/signals`);
      this._rtdb = { push, signalsRef };
      const handler = async (snap) => {
        await this.handleSignal(snap.val());
      };
      onChildAdded(signalsRef, handler);
      this.unsubRtdb = () => off(signalsRef, 'child_added', handler);
      return;
    }

    this.channel = new BroadcastChannel(`street-fm-live-${code}`);
    this.channel.onmessage = async (ev) => {
      await this.handleSignal(ev.data);
    };
  }

  signal(payload) {
    if (this._rtdb) {
      const { push, signalsRef } = this._rtdb;
      push(signalsRef, { ...payload, at: Date.now() }).catch((err) => {
        console.warn('Live signal failed', err);
      });
      return;
    }
    this.channel?.postMessage(payload);
  }

  async handleSignal(msg) {
    if (!msg || !this.pc) return;
    if (msg.from === this.role) return;

    if (msg.type === 'offer' && this.role === 'guest') {
      await this.pc.setRemoteDescription(msg.sdp);
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      this.signal({ type: 'answer', sdp: { type: answer.type, sdp: answer.sdp }, from: 'guest' });
      this.status('Connected to host');
    }

    if (msg.type === 'answer' && this.role === 'host') {
      await this.pc.setRemoteDescription(msg.sdp);
      this.status('Guest connected');
    }

    if (msg.type === 'ice' && msg.candidate) {
      try {
        await this.pc.addIceCandidate(msg.candidate);
      } catch {
        /* ignore */
      }
    }
  }

  stop() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc?.close();
    this.channel?.close();
    this.unsubRtdb?.();
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.channel = null;
    this._rtdb = null;
    this.unsubRtdb = null;
    setLiveRoom(null);
    this.status('Broadcast ended');
  }

  inviteLink() {
    if (!this.code) return '';
    const url = new URL(window.location.href);
    url.searchParams.set('join', this.code);
    return url.toString();
  }
}

export const liveStudio = new LiveStudio();
