import { TRACKS, VIDEOS, PRODUCTS, EMOJIS, SFX } from './js/catalog.js';
import { player } from './js/player.js';
import { playSfx, playVoiceOver, stopVoiceOver } from './js/sfx.js';
import {
  getState,
  subscribe,
  toggleLike,
  addComment,
  createPlaylist,
  addToPlaylist,
  markDownloaded,
  addToCart,
  clearCart,
  addUploadedTrack,
  addVideo,
  isAdmin,
} from './js/store.js';
import { initFirebase, loginLocalAdmin, loginAsGuest, uploadTrackFile, firebaseConfigured } from './js/firebase.js';
import { liveStudio } from './js/live.js';
import { virtualDj } from './js/virtualDj.js';

const app = document.querySelector('#app');
let section = 'radio';
let musicQuery = '';
let commentTrackId = null;
let selectedEmoji = '';
let extraTracks = [];
let deferredInstall = null;
let searchTimer = null;
let djUiTimer = null;

function videoList() {
  const saved = getState().videos || [];
  const byId = new Map(VIDEOS.map((v) => [v.id, v]));
  saved.forEach((v) => byId.set(v.id, v));
  return [...byId.values()];
}

function allTracks() {
  return [...TRACKS, ...extraTracks, ...getState().uploaded];
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function fmt(t) {
  if (!t || !Number.isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function eqBars() {
  return '<div class="eq" aria-hidden="true"><span></span><span></span><span></span></div>';
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const st = getState();
  const track = player.current() || allTracks()[0];

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <img src="./public/logo.jpeg" alt="Street FM logo" />
        <div class="brand-text">
          <h1>STREET FM</h1>
          <p>On the riddim · Non-stop</p>
        </div>
      </div>
      <div class="topbar-actions">
        ${deferredInstall ? '<button class="btn btn-sm btn-ghost" id="btn-install" type="button">Install app</button>' : ''}
        <button class="user-chip" id="btn-account" type="button" title="Account">
          <strong>${st.user.role === 'admin' ? 'ADMIN' : 'YOU'}</strong>
          <span>${escapeHtml(st.user.name)}</span>
        </button>
      </div>
    </header>
    <main>
      <section class="section ${section === 'radio' ? 'active' : ''}">${renderRadio(track, st)}</section>
      <section class="section ${section === 'music' ? 'active' : ''}">${renderMusic(st)}</section>
      <section class="section ${section === 'dj' ? 'active' : ''}">${renderVirtualDj()}</section>
      <section class="section ${section === 'video' ? 'active' : ''}">${renderVideo()}</section>
      <section class="section ${section === 'shop' ? 'active' : ''}">${renderShop(st)}</section>
      <section class="section ${section === 'admin' ? 'active' : ''}">${renderAdmin(st)}</section>
    </main>
    <div class="dock">
      <div class="mini-player">
        <img src="${track?.cover || './public/logo.jpeg'}" alt="" />
        <div class="mini-meta">
          <strong>${escapeHtml(track?.title || 'Street FM')}</strong>
          <span>${escapeHtml(track?.artist || 'Select a track')}</span>
        </div>
        <div class="mini-controls">
          <button class="icon-btn" data-act="prev" type="button" aria-label="Previous">⏮</button>
          <button class="icon-btn" data-act="toggle" type="button" aria-label="Play/Pause" id="btn-play">▶</button>
          <button class="icon-btn" data-act="next" type="button" aria-label="Next">⏭</button>
        </div>
        <div class="progress" id="progress" role="slider" aria-label="Seek"><i id="progress-fill"></i></div>
      </div>
      <nav class="bottom-nav" aria-label="Main">
        <button type="button" data-nav="radio" class="${section === 'radio' ? 'active' : ''}"><span class="ic">📻</span>Radio</button>
        <button type="button" data-nav="music" class="${section === 'music' ? 'active' : ''}"><span class="ic">🎵</span>Music</button>
        <button type="button" data-nav="dj" class="${section === 'dj' ? 'active' : ''}"><span class="ic">🎧</span>DJ</button>
        <button type="button" data-nav="shop" class="${section === 'shop' ? 'active' : ''}"><span class="ic">🛒</span>Shop</button>
        <button type="button" data-nav="admin" class="${section === 'admin' ? 'active' : ''}"><span class="ic">🎙️</span>Live</button>
      </nav>
    </div>
    <div id="modal-root"></div>
  `;
  bindUI();
  syncPlayerUI();
}

function renderRadio(track, st) {
  const onAir = !!st.liveRoom;
  return `
    <div class="hero">
      <div class="hero-content">
        <div class="live-pill"><i></i> ${onAir ? `Live · ${escapeHtml(st.liveRoom.code)}` : 'Radio · Autoplay'}</div>
        <h2>STREET FM</h2>
        <p class="now">Now playing: <strong>${escapeHtml(track?.title || '—')}</strong> — ${escapeHtml(track?.artist || '')}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-act="toggle" type="button">Play non-stop</button>
          <button class="btn btn-ghost" data-act="shuffle-radio" type="button">Shuffle queue</button>
          <button class="btn btn-ghost" data-nav="dj" type="button">Virtual DJ</button>
        </div>
      </div>
    </div>
    <div class="dj-desk">
      <h3>DJ Desk — FX & Voice-over</h3>
      <div class="sfx-row">
        ${SFX.map((s) => `<button class="btn btn-sm" type="button" data-sfx="${s.kind}">${s.label}</button>`).join('')}
      </div>
      <div class="vo-row">
        <input id="vo-text" type="text" placeholder="Voice-over line… e.g. Big up Street FM!" maxlength="140" />
        <button class="btn btn-primary btn-sm" type="button" id="vo-play">Speak</button>
        <button class="btn btn-ghost btn-sm" type="button" id="vo-stop">Stop</button>
      </div>
      <p style="margin:10px 0 0;color:var(--muted);font-size:0.8rem">Autoplay: <button class="btn btn-sm btn-ghost" id="autoplay-toggle" type="button">${player.autoplay ? 'ON' : 'OFF'}</button></p>
    </div>
    <div class="section-head" style="margin-top:18px"><div><h2>Up next</h2><p>Non-stop queue from the Street FM vault</p></div></div>
    <div class="track-list">${allTracks().slice(0, 8).map((t, i) => trackRow(t, i, st)).join('')}</div>
  `;
}

function renderMusic(st) {
  const q = musicQuery.trim().toLowerCase();
  const list = allTracks().filter((t) => !q || `${t.title} ${t.artist} ${t.genre}`.toLowerCase().includes(q));
  return `
    <div class="section-head"><div><h2>Music</h2><p>Upload, playlist, like, comment, download</p></div>
      <button class="btn btn-ghost btn-sm" type="button" data-nav="video">Videos</button>
    </div>
    <div class="tools">
      <input class="search" id="music-search" type="search" placeholder="Search tracks…" value="${escapeHtml(musicQuery)}" />
      <button class="btn btn-primary btn-sm" type="button" id="btn-upload">Upload</button>
      <button class="btn btn-ghost btn-sm" type="button" id="btn-new-playlist">New playlist</button>
    </div>
    <div class="playlist-grid" style="margin-bottom:14px">
      ${st.playlists.map((p) => `<div class="card"><div class="body"><h3>${escapeHtml(p.name)}</h3><p>${p.trackIds.length} tracks</p><button class="btn btn-sm btn-primary" type="button" data-play-playlist="${p.id}">Play</button></div></div>`).join('')}
    </div>
    <div class="track-list">${list.map((t) => trackRow(t, allTracks().findIndex((x) => x.id === t.id), st)).join('') || '<p style="color:var(--muted)">No tracks match.</p>'}</div>
  `;
}

function trackRow(t, index, st) {
  const liked = !!st.likes[t.id];
  const playing = player.current()?.id === t.id && !player.getMediaElement().paused;
  return `
    <article class="track-row ${playing ? 'playing' : ''}">
      <img src="${t.cover || './public/logo.jpeg'}" alt="" />
      <button type="button" class="track-meta" data-play-index="${index}" style="text-align:left;background:none;border:0;padding:0;color:inherit">
        <strong>${escapeHtml(t.title)} ${playing ? eqBars() : ''}</strong>
        <span>${escapeHtml(t.artist)} · ${escapeHtml(t.genre || '')}</span>
      </button>
      <div class="track-actions">
        <button class="icon-btn ${liked ? 'liked' : ''}" type="button" data-like="${t.id}" title="Like">♥</button>
        <button class="icon-btn" type="button" data-comment="${t.id}" title="Comment">💬</button>
        <button class="icon-btn" type="button" data-download="${t.id}" title="Download">⬇</button>
        <button class="icon-btn" type="button" data-add-pl="${t.id}" title="Add to playlist">＋</button>
      </div>
    </article>
  `;
}

function renderVirtualDj() {
  const snap = virtualDj.snapshot();
  const tracks = allTracks();
  const options = tracks
    .map((t) => `<option value="${t.id}">${escapeHtml(t.title)} — ${escapeHtml(t.artist)}</option>`)
    .join('');

  const deckHtml = (which, deck) => {
    const t = deck.track;
    const pct = deck.duration ? (deck.currentTime / deck.duration) * 100 : 0;
    return `
      <article class="vdj-deck" data-deck="${which}">
        <header class="vdj-deck-head">
          <span class="vdj-badge">DECK ${which}</span>
          <strong>${escapeHtml(t?.title || 'No track')}</strong>
          <span>${escapeHtml(t?.artist || 'Load a riddim')}</span>
        </header>
        <div class="vdj-platter ${deck.playing ? 'spinning' : ''}" data-jog="${which}" title="Drag to scrub">
          <img src="${t?.cover || './public/logo.jpeg'}" alt="" />
          <i></i>
        </div>
        <div class="vdj-progress" data-deck-seek="${which}" role="slider" aria-label="Deck ${which} seek">
          <i style="width:${pct}%"></i>
        </div>
        <p class="vdj-time">${fmt(deck.currentTime)} / ${fmt(deck.duration)} · cue ${fmt(deck.cuePoint)}</p>
        <label class="vdj-load">Load
          <select data-deck-load="${which}">
            <option value="">Choose track…</option>
            ${options}
          </select>
        </label>
        <div class="vdj-controls">
          <button class="btn btn-sm btn-ghost" type="button" data-deck-nudge="${which}" data-dir="-1">−1s</button>
          <button class="btn btn-sm btn-primary" type="button" data-deck-play="${which}">${deck.playing ? 'Pause' : 'Play'}</button>
          <button class="btn btn-sm btn-ghost" type="button" data-deck-nudge="${which}" data-dir="1">+1s</button>
        </div>
        <div class="vdj-controls">
          <button class="btn btn-sm btn-ghost" type="button" data-deck-cue-set="${which}">Set cue</button>
          <button class="btn btn-sm btn-green" type="button" data-deck-cue-jump="${which}">Cue</button>
        </div>
        <label class="vdj-slider">Tempo ${(deck.rate * 100).toFixed(0)}%
          <input type="range" min="70" max="130" step="1" value="${Math.round(deck.rate * 100)}" data-deck-rate="${which}" />
        </label>
        <label class="vdj-slider">Gain
          <input type="range" min="0" max="100" step="1" value="${Math.round(deck.gain * 100)}" data-deck-gain="${which}" />
        </label>
      </article>`;
  };

  return `
    <div class="section-head"><div><h2>Virtual DJ</h2><p>Dual decks · crossfade · cue · tempo</p></div></div>
    <div class="vdj">
      <div class="vdj-decks">
        ${deckHtml('A', snap.a)}
        ${deckHtml('B', snap.b)}
      </div>
      <div class="vdj-mixer">
        <label class="vdj-slider">Crossfader
          <input id="vdj-cross" type="range" min="0" max="100" step="1" value="${Math.round(snap.crossfade * 100)}" />
          <span class="vdj-xfade-labels"><em>A</em><em>B</em></span>
        </label>
        <label class="vdj-slider">Master
          <input id="vdj-master" type="range" min="0" max="100" step="1" value="${Math.round(snap.master * 100)}" />
        </label>
        <div class="vdj-fx">
          ${SFX.map((s) => `<button class="btn btn-sm" type="button" data-sfx="${s.kind}">${s.label}</button>`).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" type="button" id="vdj-stop">Stop both decks</button>
      </div>
    </div>
  `;
}

function renderVideo() {
  const list = videoList();
  return `
    <div class="section-head"><div><h2>Video</h2><p>Sessions, visuals, and clips</p></div></div>
    <div class="video-grid">
      ${list.map((v) => `<article class="card"><div class="video-frame"><iframe src="${v.src}" title="${escapeHtml(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div><div class="body"><h3>${escapeHtml(v.title)}</h3><p>${escapeHtml(v.blurb || v.artist)}</p></div></article>`).join('')}
    </div>
  `;
}

function renderShop(st) {
  return `
    <div class="section-head"><div><h2>Shop</h2><p>Music downloads & Street FM products</p></div>
      <button class="btn btn-ghost btn-sm" type="button" id="btn-cart">Cart (${st.cart.length})</button>
    </div>
    <div class="tools">
      <button class="btn btn-sm btn-ghost" type="button" data-shop-filter="all">All</button>
      <button class="btn btn-sm btn-ghost" type="button" data-shop-filter="music">Music</button>
      <button class="btn btn-sm btn-ghost" type="button" data-shop-filter="merch">Products</button>
    </div>
    <div class="product-grid" id="product-grid">${PRODUCTS.map(productCard).join('')}</div>
  `;
}

function productCard(p) {
  return `<article class="card" data-category="${p.category}"><img class="thumb" src="${p.image}" alt="" /><div class="body"><h3>${escapeHtml(p.name)}</h3><div class="price">$${p.price.toFixed(2)}</div><p>${escapeHtml(p.blurb)}</p><button class="btn btn-primary btn-sm" type="button" data-add-cart="${p.id}">Add</button>${p.trackId ? `<button class="btn btn-ghost btn-sm" type="button" data-download="${p.trackId}" style="margin-top:6px">Download</button>` : ''}</div></article>`;
}

function renderAdmin(st) {
  const admin = isAdmin();
  if (!admin) {
    return `
      <div class="section-head"><div><h2>Live Studio</h2><p>Join a live room or sign in as admin</p></div></div>
      <div class="admin-panel">
        <div class="panel">
          <h3>Access</h3>
          <label>Display name</label><input id="guest-name" value="${escapeHtml(st.user.name)}" />
          <label>Admin password</label><input id="admin-pass" type="password" placeholder="streetfm" />
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="btn btn-primary" type="button" id="login-admin">Enter as Admin</button>
            <button class="btn btn-ghost" type="button" id="login-guest">Continue as Guest</button>
          </div>
          <p style="color:var(--muted);font-size:0.8rem;margin-top:10px">Default password: <code>streetfm</code>. ${firebaseConfigured() ? 'Firebase configured.' : 'Add Firebase keys in src/js/firebase.js for cloud sync.'}</p>
        </div>
        <div class="panel">
          <h3>Join live invite</h3>
          <label>Invite code</label><input id="join-code" placeholder="ABC123" />
          <button class="btn btn-green" type="button" id="join-live" style="margin-top:10px">Join broadcast</button>
          <div class="live-videos"><video id="local-preview" playsinline muted autoplay></video><video id="remote-preview" playsinline autoplay></video></div>
          <p id="live-status" style="color:var(--muted);font-size:0.85rem;margin-top:8px"></p>
        </div>
      </div>`;
  }
  return `
    <div class="section-head"><div><h2>Live Studio</h2><p>Broadcast, invite guests, manage uploads</p></div></div>
    <div class="admin-panel">
      <div class="panel">
        <h3>Go live</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary" type="button" id="start-av">Live A/V</button>
          <button class="btn btn-green" type="button" id="start-audio">Audio only</button>
          <button class="btn btn-ghost" type="button" id="stop-live">End</button>
          <button class="btn btn-ghost" type="button" id="copy-invite">Copy invite</button>
        </div>
        <div class="invite-box hidden" id="invite-box"></div>
        <div class="live-videos"><video id="local-preview" playsinline muted autoplay></video><video id="remote-preview" playsinline autoplay></video></div>
        <p id="live-status" style="color:var(--muted);font-size:0.85rem;margin-top:8px"></p>
      </div>
      <div class="panel">
        <h3>Upload music</h3>
        <label>Title</label><input id="up-title" />
        <label>Artist</label><input id="up-artist" value="Joker Di Genius" />
        <label>Audio file</label><input id="up-file" type="file" accept="audio/*" />
        <button class="btn btn-primary" type="button" id="up-submit" style="margin-top:10px">Upload to library</button>
      </div>
      <div class="panel">
        <h3>Add video embed</h3>
        <label>Title</label><input id="vid-title" />
        <label>YouTube embed URL</label><input id="vid-url" placeholder="https://www.youtube.com/embed/..." />
        <button class="btn btn-primary" type="button" id="vid-add" style="margin-top:10px">Add to Video</button>
      </div>
    </div>`;
}

function bindUI() {
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.nav;
      if (next === 'dj') {
        player.pause();
      } else if (section === 'dj' && next !== 'dj') {
        virtualDj.stopAll();
      }
      section = next;
      render();
    });
  });
  document.querySelectorAll('[data-act="toggle"]').forEach((b) => b.addEventListener('click', () => player.toggle()));
  document.querySelectorAll('[data-act="prev"]').forEach((b) => b.addEventListener('click', () => player.prev()));
  document.querySelectorAll('[data-act="next"]').forEach((b) => b.addEventListener('click', () => player.next()));
  document.querySelector('[data-act="shuffle-radio"]')?.addEventListener('click', () => {
    player.setQueue([...allTracks()].sort(() => Math.random() - 0.5), 0);
    player.play(0);
    toast('Shuffled — non-stop on');
    render();
  });
  document.querySelectorAll('[data-sfx]').forEach((b) =>
    b.addEventListener('click', () => {
      playSfx(b.dataset.sfx);
      toast(`FX: ${b.textContent}`);
    })
  );
  document.getElementById('vo-play')?.addEventListener('click', () => {
    const text = document.getElementById('vo-text')?.value?.trim();
    if (!text) return toast('Type a voice-over line');
    playVoiceOver(text);
  });
  document.getElementById('vo-stop')?.addEventListener('click', () => stopVoiceOver());
  document.getElementById('autoplay-toggle')?.addEventListener('click', () => {
    player.setAutoplay(!player.autoplay);
    render();
  });
  wireVirtualDj();
  document.querySelectorAll('[data-play-index]').forEach((b) => {
    b.addEventListener('click', () => {
      const idx = Number(b.dataset.playIndex);
      player.setQueue(allTracks(), idx);
      player.play(idx);
      render();
    });
  });
  document.querySelectorAll('[data-like]').forEach((b) => {
    b.addEventListener('click', () => {
      toast(toggleLike(b.dataset.like) ? 'Liked' : 'Like removed');
      render();
    });
  });
  document.querySelectorAll('[data-comment]').forEach((b) => b.addEventListener('click', () => openCommentModal(b.dataset.comment)));
  document.querySelectorAll('[data-download]').forEach((b) => b.addEventListener('click', () => downloadTrack(b.dataset.download)));
  document.querySelectorAll('[data-add-pl]').forEach((b) => b.addEventListener('click', () => openPlaylistPicker(b.dataset.addPl)));
  document.querySelectorAll('[data-play-playlist]').forEach((b) => {
    b.addEventListener('click', () => {
      const pl = getState().playlists.find((p) => p.id === b.dataset.playPlaylist);
      if (!pl?.trackIds.length) return toast('Playlist empty');
      const q = pl.trackIds.map((id) => allTracks().find((t) => t.id === id)).filter(Boolean);
      player.setQueue(q, 0);
      player.play(0);
      section = 'radio';
      render();
    });
  });
  const search = document.getElementById('music-search');
  search?.addEventListener('input', () => {
    musicQuery = search.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (section !== 'music') return;
      const q = musicQuery;
      const pos = search.selectionStart;
      render();
      const next = document.getElementById('music-search');
      if (next) {
        next.focus();
        next.setSelectionRange(pos, pos);
        if (next.value !== q) next.value = q;
      }
    }, 180);
  });
  document.getElementById('btn-install')?.addEventListener('click', async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
    render();
  });
  document.getElementById('btn-new-playlist')?.addEventListener('click', () => {
    const name = prompt('Playlist name');
    if (!name) return;
    createPlaylist(name);
    toast('Playlist created');
    render();
  });
  document.getElementById('btn-upload')?.addEventListener('click', () => {
    section = 'admin';
    render();
    toast(isAdmin() ? 'Use Upload music panel' : 'Sign in as admin to upload');
  });
  document.querySelectorAll('[data-add-cart]').forEach((b) => {
    b.addEventListener('click', () => {
      addToCart(b.dataset.addCart);
      toast('Added to cart');
      render();
    });
  });
  document.querySelectorAll('[data-shop-filter]').forEach((b) => {
    b.addEventListener('click', () => {
      const f = b.dataset.shopFilter;
      document.querySelectorAll('#product-grid .card').forEach((card) => {
        card.style.display = f === 'all' || card.dataset.category === f ? '' : 'none';
      });
    });
  });
  document.getElementById('btn-cart')?.addEventListener('click', () => {
    const st = getState();
    if (!st.cart.length) return toast('Cart empty');
    const total = st.cart.reduce((sum, id) => sum + (PRODUCTS.find((p) => p.id === id)?.price || 0), 0);
    if (confirm(`Checkout ${st.cart.length} items · $${total.toFixed(2)}? (demo)`)) {
      clearCart();
      toast('Order placed — thank you!');
      render();
    }
  });
  document.getElementById('btn-account')?.addEventListener('click', () => {
    section = 'admin';
    render();
  });
  document.getElementById('login-admin')?.addEventListener('click', async () => {
    const ok = await loginLocalAdmin(document.getElementById('admin-pass')?.value || '');
    toast(ok ? 'Welcome, Admin' : 'Wrong password');
    render();
  });
  document.getElementById('login-guest')?.addEventListener('click', async () => {
    await loginAsGuest(document.getElementById('guest-name')?.value || 'Guest');
    toast('Listening as guest');
    render();
  });
  wireLiveControls();
  wireAdminUploads();
  document.getElementById('progress')?.addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    player.seek((e.clientX - rect.left) / rect.width);
  });
}

function wireVirtualDj() {
  if (section !== 'dj') return;

  document.querySelectorAll('[data-deck-load]').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const track = allTracks().find((t) => t.id === sel.value);
      if (!track) return;
      await virtualDj.deck(sel.dataset.deckLoad).load(track);
      toast(`Deck ${sel.dataset.deckLoad}: ${track.title}`);
      render();
    });
  });

  document.querySelectorAll('[data-deck-play]').forEach((btn) => {
    btn.addEventListener('click', () => {
      player.pause();
      virtualDj.deck(btn.dataset.deckPlay).toggle();
      patchVirtualDjUi();
    });
  });

  document.querySelectorAll('[data-deck-cue-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      virtualDj.deck(btn.dataset.deckCueSet).setCue();
      toast(`Cue set on deck ${btn.dataset.deckCueSet}`);
      patchVirtualDjUi();
    });
  });

  document.querySelectorAll('[data-deck-cue-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const deck = virtualDj.deck(btn.dataset.deckCueJump);
      deck.jumpCue();
      deck.play();
      patchVirtualDjUi();
    });
  });

  document.querySelectorAll('[data-deck-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = Number(btn.dataset.dir) || 0;
      virtualDj.deck(btn.dataset.deckNudge).nudge(dir);
      patchVirtualDjUi();
    });
  });

  document.querySelectorAll('[data-deck-rate]').forEach((input) => {
    input.addEventListener('input', () => {
      virtualDj.deck(input.dataset.deckRate).setRate(Number(input.value) / 100);
      const label = input.closest('label');
      if (label) label.childNodes[0].textContent = `Tempo ${input.value}% `;
    });
  });

  document.querySelectorAll('[data-deck-gain]').forEach((input) => {
    input.addEventListener('input', () => {
      virtualDj.deck(input.dataset.deckGain).setGain(Number(input.value) / 100);
      virtualDj.applyCrossfade();
    });
  });

  document.querySelectorAll('[data-deck-seek]').forEach((bar) => {
    bar.addEventListener('click', (e) => {
      const rect = bar.getBoundingClientRect();
      virtualDj.deck(bar.dataset.deckSeek).seek((e.clientX - rect.left) / rect.width);
      patchVirtualDjUi();
    });
  });

  document.querySelectorAll('[data-jog]').forEach((platter) => {
    let dragging = false;
    let lastX = 0;
    const onMove = (clientX) => {
      if (!dragging) return;
      const delta = (clientX - lastX) / 80;
      lastX = clientX;
      virtualDj.deck(platter.dataset.jog).nudge(delta);
      patchVirtualDjUi();
    };
    platter.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      platter.setPointerCapture(e.pointerId);
    });
    platter.addEventListener('pointermove', (e) => onMove(e.clientX));
    platter.addEventListener('pointerup', () => {
      dragging = false;
    });
  });

  document.getElementById('vdj-cross')?.addEventListener('input', (e) => {
    virtualDj.setCrossfade(Number(e.target.value) / 100);
  });
  document.getElementById('vdj-master')?.addEventListener('input', (e) => {
    virtualDj.setMaster(Number(e.target.value) / 100);
  });
  document.getElementById('vdj-stop')?.addEventListener('click', () => {
    virtualDj.stopAll();
    patchVirtualDjUi();
    toast('Decks stopped');
  });

  clearInterval(djUiTimer);
  djUiTimer = setInterval(() => {
    if (section === 'dj') patchVirtualDjUi();
  }, 250);
}

function patchVirtualDjUi() {
  const snap = virtualDj.snapshot();
  ['A', 'B'].forEach((which) => {
    const deck = which === 'A' ? snap.a : snap.b;
    const root = document.querySelector(`.vdj-deck[data-deck="${which}"]`);
    if (!root) return;
    const fill = root.querySelector('.vdj-progress i');
    if (fill && deck.duration) fill.style.width = `${(deck.currentTime / deck.duration) * 100}%`;
    const time = root.querySelector('.vdj-time');
    if (time) time.textContent = `${fmt(deck.currentTime)} / ${fmt(deck.duration)} · cue ${fmt(deck.cuePoint)}`;
    const playBtn = root.querySelector(`[data-deck-play="${which}"]`);
    if (playBtn) playBtn.textContent = deck.playing ? 'Pause' : 'Play';
    const platter = root.querySelector('.vdj-platter');
    if (platter) platter.classList.toggle('spinning', deck.playing);
  });
}

function wireLiveControls() {
  liveStudio.onStatus = (msg) => {
    const el = document.getElementById('live-status');
    if (el) el.textContent = msg;
  };
  liveStudio.onRemote = (stream) => {
    const v = document.getElementById('remote-preview');
    if (v) {
      v.srcObject = stream;
      v.play().catch(() => {});
    }
  };
  const attachLocal = (stream) => {
    const v = document.getElementById('local-preview');
    if (v) {
      v.srcObject = stream;
      v.play().catch(() => {});
    }
  };
  const showInvite = (code) => {
    const box = document.getElementById('invite-box');
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = `<strong>Invite code:</strong> ${code}<br/><strong>Link:</strong> ${liveStudio.inviteLink()}`;
    }
  };
  document.getElementById('start-av')?.addEventListener('click', async () => {
    try {
      const { code, stream } = await liveStudio.startHost({ video: true });
      attachLocal(stream);
      showInvite(code);
      toast(`On air · ${code}`);
    } catch (err) {
      toast(err.message || 'Could not start live');
    }
  });
  document.getElementById('start-audio')?.addEventListener('click', async () => {
    try {
      const { code, stream } = await liveStudio.startHost({ video: false });
      attachLocal(stream);
      showInvite(code);
      toast(`Audio live · ${code}`);
    } catch (err) {
      toast(err.message || 'Could not start live');
    }
  });
  document.getElementById('stop-live')?.addEventListener('click', () => {
    liveStudio.stop();
    ['local-preview', 'remote-preview'].forEach((id) => {
      const v = document.getElementById(id);
      if (v) v.srcObject = null;
    });
    document.getElementById('invite-box')?.classList.add('hidden');
    toast('Broadcast ended');
  });
  document.getElementById('copy-invite')?.addEventListener('click', async () => {
    const link = liveStudio.inviteLink();
    if (!link) return toast('Start a live session first');
    await navigator.clipboard.writeText(link);
    toast('Invite copied');
  });
  document.getElementById('join-live')?.addEventListener('click', async () => {
    const code = document.getElementById('join-code')?.value || '';
    if (!code) return toast('Enter invite code');
    try {
      const { stream } = await liveStudio.joinGuest(code, { video: true });
      const v = document.getElementById('local-preview');
      if (v) {
        v.srcObject = stream;
        v.play().catch(() => {});
      }
      toast(`Joining ${code}`);
    } catch (err) {
      toast(err.message || 'Join failed');
    }
  });
}

function wireAdminUploads() {
  document.getElementById('up-submit')?.addEventListener('click', async () => {
    const file = document.getElementById('up-file')?.files?.[0];
    if (!file) return toast('Choose an audio file');
    const track = await uploadTrackFile(file, {
      title: document.getElementById('up-title')?.value,
      artist: document.getElementById('up-artist')?.value,
    });
    addUploadedTrack(track);
    extraTracks = [...extraTracks, track];
    player.setQueue(allTracks(), player.index);
    toast(`Uploaded: ${track.title}`);
    render();
  });
  document.getElementById('vid-add')?.addEventListener('click', () => {
    const title = document.getElementById('vid-title')?.value?.trim();
    const src = document.getElementById('vid-url')?.value?.trim();
    if (!title || !src) return toast('Title and URL required');
    addVideo({
      id: `v-${Date.now()}`,
      title,
      artist: 'Street FM',
      thumb: './public/logo.jpeg',
      src,
      kind: 'embed',
      blurb: 'Added by admin',
      at: Date.now(),
    });
    toast('Video added');
    section = 'video';
    render();
  });
}

function openCommentModal(trackId) {
  commentTrackId = trackId;
  selectedEmoji = '';
  const st = getState();
  const comments = st.comments[trackId] || [];
  const track = allTracks().find((t) => t.id === trackId);
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" id="modal-bg">
      <div class="modal">
        <h3 style="margin:0 0 8px;font-family:var(--font-display);letter-spacing:0.05em;font-size:1.5rem">Comments · ${escapeHtml(track?.title || '')}</h3>
        <div class="drawer">
          ${comments.length ? comments.map((c) => `<div class="comment"><strong>${escapeHtml(c.user)}</strong> ${c.emoji || ''} — ${escapeHtml(c.text)}<div style="color:var(--muted);font-size:0.75rem">${new Date(c.at).toLocaleString()}</div></div>`).join('') : '<p style="color:var(--muted);margin:0">No comments yet. Be first.</p>'}
        </div>
        <div class="emoji-bar" id="emoji-bar">${EMOJIS.map((e) => `<button type="button" data-emoji="${e}">${e}</button>`).join('')}</div>
        <input id="comment-text" class="search" style="width:100%;margin-bottom:10px" placeholder="Say something…" />
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" type="button" id="comment-send">Post</button>
          <button class="btn btn-ghost" type="button" id="comment-close">Close</button>
        </div>
      </div>
    </div>`;
  document.getElementById('modal-bg')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-bg') root.innerHTML = '';
  });
  document.getElementById('comment-close')?.addEventListener('click', () => {
    root.innerHTML = '';
  });
  document.querySelectorAll('#emoji-bar [data-emoji]').forEach((b) => {
    b.addEventListener('click', () => {
      selectedEmoji = b.dataset.emoji;
      document.querySelectorAll('#emoji-bar button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    });
  });
  document.getElementById('comment-send')?.addEventListener('click', () => {
    const text = document.getElementById('comment-text')?.value?.trim();
    if (!text && !selectedEmoji) return toast('Write a comment or pick an emoji');
    addComment(commentTrackId, text || selectedEmoji, selectedEmoji);
    toast('Comment posted');
    openCommentModal(commentTrackId);
  });
}

function openPlaylistPicker(trackId) {
  const st = getState();
  const nameList = st.playlists.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
  const choice = prompt(`Add to playlist:\n${nameList}\n\nEnter number:`);
  const idx = Number(choice) - 1;
  if (!st.playlists[idx]) return;
  addToPlaylist(st.playlists[idx].id, trackId);
  toast(`Added to ${st.playlists[idx].name}`);
}

async function downloadTrack(trackId) {
  const track = allTracks().find((t) => t.id === trackId);
  if (!track) return toast('Track not found');
  try {
    const res = await fetch(track.src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.artist} - ${track.title}${track.file?.match(/\.\w+$/)?.[0] || '.mp3'}`;
    a.click();
    URL.revokeObjectURL(url);
    markDownloaded(trackId);
    toast('Download started');
  } catch {
    const a = document.createElement('a');
    a.href = track.src;
    a.download = track.title;
    a.target = '_blank';
    a.click();
    markDownloaded(trackId);
    toast('Download link opened');
  }
}

function syncPlayerUI() {
  const btn = document.getElementById('btn-play');
  if (btn) btn.textContent = player.getMediaElement().paused ? '▶' : '⏸';
}

player.on((state) => {
  const fill = document.getElementById('progress-fill');
  if (fill && state.duration) fill.style.width = `${(state.currentTime / state.duration) * 100}%`;
  const btn = document.getElementById('btn-play');
  if (btn) btn.textContent = state.playing ? '⏸' : '▶';
  const meta = document.querySelector('.mini-meta');
  if (meta && state.track) {
    meta.innerHTML = `<strong>${escapeHtml(state.track.title)}</strong><span>${escapeHtml(state.track.artist)} · ${fmt(state.currentTime)}</span>`;
  }
});

subscribe(() => {});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  render();
});

window.addEventListener('appinstalled', () => {
  deferredInstall = null;
  toast('Street FM installed');
});

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('SW registration failed', err);
    });
  });
}

async function boot() {
  registerServiceWorker();
  await initFirebase();
  player.setQueue(allTracks(), 0);
  player.load(0);
  const join = new URLSearchParams(location.search).get('join');
  if (join) section = 'admin';
  render();
  if (join) {
    const input = document.getElementById('join-code');
    if (input) input.value = join;
    toast(`Invite code ready: ${join}`);
  }
}

boot();
