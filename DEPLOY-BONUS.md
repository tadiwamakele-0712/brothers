# Bonus Lesson 21 — Deploy API Online (MuShona)

Frontend (React/HTML) inogona kuenda pa **GitHub Pages**.  
Backend (Express + SQLite) inoda **server** — tinoshandisa **Render** (free tier).

---

## Chikamu 1: Push project ku GitHub

Ona `DEPLOY-GITHUB-PAGES.md` kana usati waisa kodhi pa GitHub.

---

## Chikamu 2: Deploy API pa Render

1. Login: https://render.com
2. **New +** → **Web Service**
3. Connect GitHub repo yako
4. Settings:
   - **Name:** `tadiwa-portfolio-api`
   - **Root Directory:** `backend-api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. **Environment Variables:**

| Key | Value |
|-----|--------|
| `ADMIN_KEY` | secret password yako (usaisa default!) |
| `CLIENT_ORIGIN` | `https://tadiwamakele-0712.github.io/brothers` (URL ye GitHub Pages) |

6. Click **Create Web Service**

Render inokupa URL, e.g. `https://tadiwa-portfolio-api.onrender.com`

---

## Chikamu 3: Test API online

```powershell
Invoke-RestMethod https://YOUR-APP.onrender.com/api/health
```

Unofanira kuona: `database: sqlite`

---

## Chikamu 4: Connect React ku live API

Mu `portfolio-react`, gadzira `.env`:

```
VITE_API_URL=https://YOUR-APP.onrender.com/api
```

Run:

```powershell
cd portfolio-react
npm run build
```

Kana `npm run dev`, React inoshandisa live API.

---

## Chikamu 5: GitHub Pages (frontend)

1. Push `portfolio-react` build kana deploy folder yako
2. GitHub repo → **Settings** → **Pages**
3. Source: branch `main`, folder `/` kana `/docs`

**Note:** GitHub Pages haigone run Node.js — API inofanira kunge iri pa Render.

---

## SQLite pa production

- Database file: `backend-api/data/portfolio.db`
- Pa Render free tier, disk inogona kuclear pa redeploy — messages dzinogona kurasika
- Pamberi: zvakanaka kudzidza; pabasa: shandisa PostgreSQL (Supabase, Neon)

---

## Lesson 21 page (local)

Vhura `backend-api/public/lesson21.html` — deploy checklist, live API URL setup, admin link.

---

## Admin panel online

1. Vhura `https://YOUR-APP.onrender.com/admin.html`
2. Login ne `ADMIN_KEY` yawaisa pa Render
3. Delete spam messages

---

## Quick checklist

- [ ] API health inoshanda pa Render URL
- [ ] `ADMIN_KEY` changed from default
- [ ] `CLIENT_ORIGIN` = GitHub Pages URL yako
- [ ] React `.env` has `VITE_API_URL`
- [ ] Contact form inotumira ku live API

Maita basa — full stack + deploy!
