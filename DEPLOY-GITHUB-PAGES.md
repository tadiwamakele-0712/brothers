# Deploy pa GitHub Pages (MuShona)

## Zvinodiwa
- Git yakainstall: https://git-scm.com/download/win
- Account pa GitHub: https://github.com

---

## Nhanho 1: Vhura Terminal mu project folder

1. Vhura folder `PROJECT 0712`
2. Mu address bar, nyora `powershell` wobva wa Enter
   **Kana** right-click → "Open in Terminal"

---

## Nhanho 2: Git init (rimwe gore chete)

```powershell
cd "C:\Users\Tadiwa Makele\Desktop\PROJECT 0712"
git init
git add .
git commit -m "First commit: web projects and portfolio"
```

Kana Git ikumbira zita ne email:

```powershell
git config --global user.name "Tadiwa Makele"
git config --global user.email "tadiwamakele@gmail.com"
```

---

## Nhanho 3: Gadzira repo pa GitHub

1. Login pa https://github.com
2. Click **+** → **New repository**
3. Zita: `brothers`
4. **Usa** tick pa "Add README"
5. Click **Create repository**

---

## Nhanho 4: Push kodhi yako

```powershell
git branch -M main
git remote add origin https://github.com/tadiwamakele-0712/brothers.git
git push -u origin main
```

Browser rinogona kukumbira login ye GitHub.

---

## Nhanho 5: Turn on GitHub Pages

1. Pa repo yako pa GitHub, click **Settings**
2. Kuruboshwe: **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: `main`
5. **Folder**: `/ (root)`
6. Click **Save**

Mirira 1–3 minutes.

---

## Nhanho 6: Tora link yako

URL yakafanana ne:

```
https://tadiwamakele-0712.github.io/brothers/
```

**Mapeji:**
- Home: `.../index.html` (Brothers of Africa)
- React Portfolio (WhatsApp link): `.../portfolio.html` kana `.../portfolio-react/standalone.html`
- Portfolio: `.../portfolio/index.html`
- Todo: `.../portfolio/todo-tadie/todo.html`
- Calculator: `.../portfolio/calculator/index.html`
- Weather: `.../portfolio/weather-app/index.html`
- Notes: `.../portfolio/tadie-app/index.html`

---

## Kana uchichinja kodhi

```powershell
git add .
git commit -m "Describe your change"
git push
```

Site inozoupdater zvakare mu 1–3 mins.

---

## Makanganiso

| Problem | Solution |
|---------|----------|
| `git not recognized` | Install Git uye vhura terminal zvakare |
| Push failed | Tarisa username/password kana Personal Access Token |
| 404 page | Mirira 5 mins; tarisa kuti branch = main |
| CSS haishande | Paths dzefaira ngadziite relative (`style.css`) |
