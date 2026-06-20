# Deploy React Portfolio pa GitHub Pages

## Build project

```powershell
cd "C:\Users\Tadiwa Makele\Desktop\PROJECT 0712\portfolio-react"
npm install
npm run build
```

Folder `dist/` inobva — iyi ndiyo React app yakagadzirwa.

---

## Option A: React mu subfolder (recommended)

1. Copy zvese mu `dist/` → `PROJECT 0712/react/` (gadzira folda `react`)
2. Push ku GitHub (se mu `DEPLOY-GITHUB-PAGES.md`)
3. Site: `https://tadiwamakele-0712.github.io/brothers/portfolio-react/`

**Link kubva pa home page:** `react/index.html`

---

## Option B: React ndiyo main site

1. Copy zvese mu `dist/` → root ye repo
2. GitHub Pages inoratidza `index.html` ye React

---

## Rebuild pashure pekuchinja kodhi

```powershell
cd portfolio-react
npm run build
```

Copy `dist/` zvakare ku folder yaunodeploy.

---

## Kumbira

- `vite.config.js` ine `base: "./"` — inobatsira pa subfolder deploy
- Usa push `node_modules/` — iri mu `.gitignore`
