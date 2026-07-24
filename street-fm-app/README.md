# Street FM

Mobile-friendly radio PWA branded with your Street FM logo and seeded with the `joker-music` library.

Works as a **static ES-module app** (no build required). Optional Vite tooling is included if you want a local bundler later.

## Run locally

```bash
cd street-fm-app
npm start
```

Open `http://localhost:5173` (uses the built-in Node static server — no `npm install` required).

Optional Vite (when the npm registry is reachable):

```bash
npm install
npx vite
```

## Live URL

After deploy from `main`, open:

`https://<your-github-user>.github.io/<repo>/street-fm-app/`

## Sections

| Tab | What you get |
|-----|----------------|
| **Radio** | Hero, non-stop autoplay, DJ FX + voice-over (music ducks during VO) |
| **Music** | Live search, playlists, likes, comments + emojis, downloads, upload |
| **DJ** | Virtual DJ — dual decks, crossfader, cue points, tempo, platter scrub |
| **Video** | Embedded sessions (from Music → Videos; admin can add more) |
| **Shop** | Digital music + merch cart (demo checkout) |
| **Live** | Admin broadcast studio + guest join via invite code |

## Admin

1. Open the **Live** tab  
2. Password: `streetfm`  
3. Start **Live A/V** or **Audio only**, then copy the invite link for guests  

Live signaling works across tabs on the same device via `BroadcastChannel`. For multi-device live, add Firebase Realtime Database (see below).

Demo admin auth is client-side until you wire Firebase Auth emails.

## PWA

`manifest.webmanifest` + `sw.js` register on load. After deploy (HTTPS), browsers can show **Install app** when `beforeinstallprompt` fires. Music uses network-first caching.

## Firebase (optional)

Edit [`src/js/firebase.js`](src/js/firebase.js) and fill `FIREBASE_CONFIG`:

```js
export const FIREBASE_CONFIG = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
  databaseURL: '...', // needed for multi-device live signaling
};
```

Firebase SDK loads from the CDN only when keys are present.

### Console setup

1. Create a Firebase web app and paste the config above.
2. **Firestore** — collections: `users`, `comments`, `videos`, `tracks`.
3. **Storage** — enable for admin music uploads.
4. **Realtime Database** — enable and set `databaseURL` for phone-to-phone WebRTC under `live/{code}/signals`.
5. **Auth** (optional) — emails containing `admin` are treated as admin.

Starter rules (tighten for production):

```
// Firestore (dev)
allow read, write: if true;

// RTDB (dev)
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Without keys, likes/comments/playlists/uploads/videos stay in **localStorage**.
