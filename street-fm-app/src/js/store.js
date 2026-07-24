const KEY = 'street-fm-v1';

const defaultState = () => ({
  likes: {},
  comments: {},
  playlists: [{ id: 'favorites', name: 'Favorites', trackIds: [] }],
  downloads: [],
  cart: [],
  user: { id: 'guest', name: 'Guest', role: 'listener' },
  uploaded: [],
  videos: [],
  products: null,
  radioOnAir: false,
  liveRoom: null,
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, videos: Array.isArray(parsed.videos) ? parsed.videos : [] };
  } catch {
    return defaultState();
  }
}

let state = load();
const listeners = new Set();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
}

function cloud(fnName, ...args) {
  import('./firebase.js')
    .then((mod) => {
      const fn = mod[fnName];
      if (typeof fn === 'function') return fn(...args);
    })
    .catch(() => {});
}

export function getState() {
  return state;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setUser(user) {
  state = { ...state, user: { ...state.user, ...user } };
  persist();
}

export function mergeCloudState(partial = {}) {
  state = {
    ...state,
    ...partial,
    likes: partial.likes ? { ...state.likes, ...partial.likes } : state.likes,
    comments: partial.comments ? { ...state.comments, ...partial.comments } : state.comments,
    playlists: partial.playlists?.length ? partial.playlists : state.playlists,
    videos: partial.videos?.length ? partial.videos : state.videos,
    uploaded: partial.uploaded?.length
      ? [
          ...state.uploaded,
          ...partial.uploaded.filter((t) => !state.uploaded.some((u) => u.id === t.id)),
        ]
      : state.uploaded,
  };
  persist();
}

export function toggleLike(trackId) {
  const likes = { ...state.likes };
  likes[trackId] = !likes[trackId];
  if (!likes[trackId]) delete likes[trackId];
  state = { ...state, likes };
  persist();
  cloud('syncLikes', likes);
  return !!likes[trackId];
}

export function addComment(trackId, text, emoji = '') {
  const comments = { ...state.comments };
  const list = [...(comments[trackId] || [])];
  list.push({
    id: `c-${Date.now()}`,
    text,
    emoji,
    user: state.user.name,
    at: new Date().toISOString(),
  });
  comments[trackId] = list;
  state = { ...state, comments };
  persist();
  cloud('syncComments', trackId, list);
}

export function createPlaylist(name) {
  const playlists = [...state.playlists, { id: `pl-${Date.now()}`, name, trackIds: [] }];
  state = { ...state, playlists };
  persist();
  cloud('syncPlaylists', playlists);
}

export function addToPlaylist(playlistId, trackId) {
  const playlists = state.playlists.map((p) => {
    if (p.id !== playlistId) return p;
    if (p.trackIds.includes(trackId)) return p;
    return { ...p, trackIds: [...p.trackIds, trackId] };
  });
  state = { ...state, playlists };
  persist();
  cloud('syncPlaylists', playlists);
}

export function removeFromPlaylist(playlistId, trackId) {
  const playlists = state.playlists.map((p) =>
    p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
  );
  state = { ...state, playlists };
  persist();
  cloud('syncPlaylists', playlists);
}

export function markDownloaded(trackId) {
  if (state.downloads.includes(trackId)) return;
  state = { ...state, downloads: [...state.downloads, trackId] };
  persist();
}

export function addToCart(productId) {
  state = { ...state, cart: [...state.cart, productId] };
  persist();
}

export function clearCart() {
  state = { ...state, cart: [] };
  persist();
}

export function addUploadedTrack(track) {
  state = { ...state, uploaded: [...state.uploaded, track] };
  persist();
  cloud('syncUploadedTrackMeta', track);
}

export function setVideos(videos) {
  state = { ...state, videos: [...videos] };
  persist();
  cloud('syncVideos', videos);
}

export function addVideo(video) {
  const videos = [video, ...state.videos];
  state = { ...state, videos };
  persist();
  cloud('syncVideos', videos);
  return videos;
}

export function setLiveRoom(room) {
  state = { ...state, liveRoom: room, radioOnAir: !!room };
  persist();
}

export function isAdmin() {
  return state.user.role === 'admin';
}
