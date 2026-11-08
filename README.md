# ByteCrawler
</break>
<p align="center">
  <img src="../assets/images/images.jpg" alt="Alt Text" width="600" />
</p>
Image from: Adobe Stock
</break>
Learn Python like you learn a language: a pixel-dungeon learning path with a Python snake guide, a boss fight, a community tab and a sandbox. It is a static site (plain HTML, CSS, and JavaScript), so there is nothing to build or install.

## Folder structure

```
bytecrawler/
├── index.html            # all pages (Home, About, Learning path, Boss, Contact, Community, Dashboard)
├── css/
│   └── style.css         # all styles
├── js/
│   ├── ui.js             # theme toggle, menus, contact form
│   ├── app.js            # lessons, map, Python guide snake, boss fight, dashboard, tiny Python interpreter
│   └── community.js      # Reddit-style community tab
├── assets/
│   ├── favicon.svg
│   └── images/           # map, heroes, boss, backgrounds
├── .nojekyll             # tells GitHub Pages to serve files as-is
├── .gitignore
└── README.md
```

## Run it locally

Serve the folder (recommended, so the 3D boss arena can load its textures):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `bytecrawler`).
2. Push this folder:
   ```bash
   cd bytecrawler
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/bytecrawler.git
   git push -u origin main
   ```
3. On GitHub open **Settings → Pages**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/bytecrawler/`.

All file paths are relative, so the site works from a sub-path like this, from a custom domain, or from any other static host (Netlify, Cloudflare Pages, Vercel).

## Notes

- Boss fight: Phase 1 is the Wyrm; beat it and the Storm Wyrm (Phase 2) rises and hurls lightning whenever you miss a round. Edit `TESTS1` / `TESTS2` in `js/app.js` to change the rounds.
- If you open `index.html` by double-clicking it, some browsers block the 3D arena textures. The page shows a message and the fight still works; use the local server above to see the arena.
- Fonts (Google Fonts) and the 3D boss arena (three.js from cdnjs) load from CDNs, so visitors need an internet connection. The boss fight still works without the 3D arena.
- Progress and community posts live in the browser tab only and reset on reload.
- Pages use `#hash` links (for example `#course`), so no server-side routing is needed.
