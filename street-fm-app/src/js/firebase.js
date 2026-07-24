/**
 * Firebase layer with local fallback.
 * Paste your Firebase web config into FIREBASE_CONFIG to go live.
 * Firebase SDK loads from esm.sh only when configured (no npm firebase package).
 */
import { setUser, getState, mergeCloudState } from './store.js';

export const FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  // databaseURL optional for Realtime Database signaling
  databaseURL: '',
};

const FB = 'https://esm.sh/firebase@11.10.0';

let app = null;
let auth = null;
let db = null;
let storage = null;
let rtdb = null;
let mode = 'local';

export function firebaseConfigured() {
  return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
}

export function getFirebase() {
  return { app, auth, db, storage, rtdb, mode };
}

async function loadFirebase() {
  const [{ initializeApp }, authMod, { getFirestore }, { getStorage }] = await Promise.all([
    import(`${FB}/app`),
    import(`${FB}/auth`),
    import(`${FB}/firestore`),
    import(`${FB}/storage`),
  ]);
  return { initializeApp, ...authMod, getFirestore, getStorage };
}

export async function initFirebase() {
  if (!firebaseConfigured()) {
    console.info('Street FM: Firebase not configured — using local storage mode.');
    mode = 'local';
    return { mode: 'local' };
  }

  const {
    initializeApp,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    getFirestore,
    getStorage,
  } = await loadFirebase();

  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  mode = 'firebase';

  if (FIREBASE_CONFIG.databaseURL) {
    const { getDatabase } = await import(`${FB}/database`);
    rtdb = getDatabase(app);
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const isAdmin = (user.email || '').toLowerCase().includes('admin') || user.email === 'admin@streetfm.local';
      setUser({
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Listener',
        email: user.email,
        role: isAdmin ? 'admin' : 'listener',
      });
    }
  });

  await pullCloudState().catch((err) => console.warn('Cloud pull failed', err));

  return {
    mode: 'firebase',
    auth,
    db,
    storage,
    rtdb,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
  };
}

async function pullCloudState() {
  if (!db) return;
  const { doc, getDoc, collection, getDocs } = await import(`${FB}/firestore`);
  const userId = getState().user.id || 'guest';
  const socialRef = doc(db, 'users', userId);
  const snap = await getDoc(socialRef);
  const partial = {};
  if (snap.exists()) {
    const data = snap.data();
    if (data.likes) partial.likes = data.likes;
    if (data.playlists) partial.playlists = data.playlists;
  }

  const commentsSnap = await getDocs(collection(db, 'comments'));
  const comments = {};
  commentsSnap.forEach((d) => {
    comments[d.id] = d.data().list || [];
  });
  if (Object.keys(comments).length) partial.comments = comments;

  const videosSnap = await getDocs(collection(db, 'videos'));
  const videos = [];
  videosSnap.forEach((d) => videos.push({ id: d.id, ...d.data() }));
  if (videos.length) partial.videos = videos.sort((a, b) => (b.at || 0) - (a.at || 0));

  const tracksSnap = await getDocs(collection(db, 'tracks'));
  const uploaded = [];
  tracksSnap.forEach((d) => uploaded.push({ id: d.id, ...d.data() }));
  if (uploaded.length) partial.uploaded = uploaded;

  if (Object.keys(partial).length) mergeCloudState(partial);
}

export async function syncLikes(likes) {
  if (!db) return;
  const { doc, setDoc } = await import(`${FB}/firestore`);
  const userId = getState().user.id || 'guest';
  await setDoc(doc(db, 'users', userId), { likes, updatedAt: Date.now() }, { merge: true });
}

export async function syncComments(trackId, list) {
  if (!db) return;
  const { doc, setDoc } = await import(`${FB}/firestore`);
  await setDoc(doc(db, 'comments', trackId), { list, updatedAt: Date.now() }, { merge: true });
}

export async function syncPlaylists(playlists) {
  if (!db) return;
  const { doc, setDoc } = await import(`${FB}/firestore`);
  const userId = getState().user.id || 'guest';
  await setDoc(doc(db, 'users', userId), { playlists, updatedAt: Date.now() }, { merge: true });
}

export async function syncVideos(videos) {
  if (!db) return;
  const { doc, writeBatch } = await import(`${FB}/firestore`);
  const batch = writeBatch(db);
  videos.forEach((v) => {
    batch.set(doc(db, 'videos', v.id), { ...v, at: v.at || Date.now() }, { merge: true });
  });
  await batch.commit();
}

export async function syncUploadedTrackMeta(track) {
  if (!db) return;
  const { doc, setDoc } = await import(`${FB}/firestore`);
  const { local, ...meta } = track;
  await setDoc(doc(db, 'tracks', track.id), { ...meta, updatedAt: Date.now() }, { merge: true });
}

export async function loginLocalAdmin(password) {
  if (password === 'streetfm') {
    setUser({ id: 'admin-local', name: 'Street FM Admin', role: 'admin', email: 'admin@streetfm.local' });
    return true;
  }
  return false;
}

export async function loginAsGuest(name) {
  setUser({
    id: `guest-${Date.now()}`,
    name: name || 'Guest',
    role: 'listener',
  });
}

export async function uploadTrackFile(file, meta = {}) {
  const base = {
    id: `up-${Date.now()}`,
    title: meta.title || file.name.replace(/\.[^.]+$/, ''),
    artist: meta.artist || getState().user.name,
    genre: meta.genre || 'Upload',
    cover: './public/logo.jpeg',
  };

  if (!storage) {
    return { ...base, src: URL.createObjectURL(file), local: true };
  }

  const { ref, uploadBytes, getDownloadURL } = await import(`${FB}/storage`);
  const path = `tracks/${Date.now()}-${file.name}`;
  const r = ref(storage, path);
  await uploadBytes(r, file);
  const src = await getDownloadURL(r);
  return { ...base, src };
}
