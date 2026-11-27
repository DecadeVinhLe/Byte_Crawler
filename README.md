# ByteCrawler
</break>
<p align="center">
  <img src="assets/images/images.jpg" alt="Alt Text" width="600" />
</p>
Image from: Adobe Stock
</break>
Learn Python like you learn a language: a pixel-dungeon learning path with a Python snake guide, a boss fight, a community tab and a sandbox. It is a static site (plain HTML, CSS and JavaScript), so there is nothing to build or install.

## Folder structure

```
index.html            all pages (Home, About, Learning path, Boss, Contact, Community, Dashboard, Login)
css/                  one file per page or area: tokens, base, header, home, about*, course, boss, contact, community, dashboard, result ...
js/
  core.js, python.js  shared helpers, tiny Python interpreter
  lessons-data.js     lesson text and quizzes
  map.js, course.js   learning path map and lesson page
  boss.js             boss quest: PHASES (tests, starter code, hints), attack button, result hooks
  arena.js            3D boss arena: heroes, dragons, attack animations and effects
  images.js           list of image paths used by the scripts
  result.js           win / lose screens and the cutscene
  account.js, config.js   login and saved progress (see "Accounts and database")
  ...                 ui, router, dock, loader, snow, about, community, dashboard
assets/images/        pictures, sprite sheets, team strips
assets/video/         boss cutscene
supabase/             database setup
```

`js/app.js` and `css/style.css` are old all-in-one copies that `index.html` no longer loads. Edit the files above instead.

## Characters

**Boss-room heroes** (Knight, Wizard, Archer, Assassin). Each hero is a sprite sheet: `assets/images/sheet-knight.png`, `sheet-mage.png`, `sheet-ranger.png`, `sheet-rogue.png`. A sheet is 3 x 3 frames of 256 px that tell one attack, with the effect drawn into the frames. `knight.png`, `mage.png`, `ranger.png` and `rogue.png` are the small portraits in the hero picker.

Their attacks live in `js/arena.js`:

- `HERO` says where the character stands in a frame (`feet`, `top`, `cx`) so every hero is drawn at the same size. A sheet that faces left gets `flip:1`.
- `ATK` is the timing of each attack: how long each of the 9 frames is shown (`d`), when a hit lands (`ti`), where a miss gives up (`tm`, `mf`), plus screen shake, flash and spark colours.
- `EXT` lists the extra projectiles that carry the baked-in effect on to the dragon (wizard beam, two assassin blade waves, two extra archer arrows). They are crops of the same sheet.
- To change a hero, replace its `sheet-*.png` with a new 3 x 3 sheet and adjust its `HERO` and `ATK` rows. The hero ids (`knight`, `mage`, `ranger`, `rogue`) are saved in progress, so keep them.

**Team** (About and Contact pages): `assets/images/team-nhi.png`, `team-hung.png`, `team-vinh.png`, `team-quy.png` are 9-frame idle strips. The animation and the on-screen size of each frame are in `css/contact.css` (`.sprite`, `.sp-nhi` and so on). Reduced-motion users see the first frame.

## Run it locally

Serve the folder (recommended, so the 3D boss arena can load its textures):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Accounts and database

Login, sign-up and saved progress (XP, checkpoints, boss record) use a hosted Supabase database.
It is off until you paste two keys into `js/config.js`; until then the site keeps its browser-only
demo login. Setup takes about 10 minutes: see [`supabase/SETUP.md`](supabase/SETUP.md).

```
supabase/schema.sql   # tables, sign-up trigger, security rules (run once in the SQL editor)
supabase/SETUP.md     # step-by-step setup
js/config.js          # your project URL + public key
js/account.js         # sign up, log in, load and save progress
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

## Members


| Member | Role | University | Year | Contact |
| --- | --- | --- | --- | --- |
| **** | Design Leader | Asia University | 1st year | [](mailto:) |
| **Lê Trần Lâm Vinh** | Member | Asia University | 1st year | [vinhlamle2003@gmail.com](mailto:vinhlamle2003@gmail.com) |
| **Hoàng Xuân Nhi** | Member | Asia University | 1st year | [hnhi20307@gmail.com](hnhi20307@gmail.com) |
| **** | Member | Asia University | 1st year | []() |
| **** | Member | Asia University | 1st year | []() |


## Notes

- Boss fight: Phase 1 is the Wyrm; beat it and the Storm Wyrm (Phase 2) rises and hurls lightning whenever you miss a round. Edit `PHASES` in `js/boss.js` to change the rounds.
- If you open `index.html` by double-clicking it, some browsers block the 3D arena textures. The page shows a message and the fight still works; use the local server above to see the arena.
- Fonts (Google Fonts) and the 3D boss arena (three.js from cdnjs) load from CDNs, so visitors need an internet connection. The boss fight still works without the 3D arena.
- Progress and community posts live in the browser tab only and reset on reload.
- Pages use `#hash` links (for example `#course`), so no server-side routing is needed.

## End-of-boss flow (result screen, cutscene, login, records)

Files: `js/result.js`, `css/result.css`, overlay markup at the end of `index.html`, `assets/video/*`.

- **Mission Complete** (win): papyrus treasure map, clear time, best time, XP, rank. Click anywhere (or Enter / Space) to play the cutscene.
- **Cutscene**: `assets/video/cutscene.mp4` (volume starts at 50%, slider + mute in the corner). The **Hold to skip** button must be held about 1.1 s (mouse, touch, or hold Space / Enter). When it ends or is skipped, **Continue a journey** opens the Dashboard.
- **Game Over** (lose): papyrus map with a pixel menu. **Continue** opens the Learning path, **Quit** opens the Dashboard.
- **Dashboard** has a *Boss record* card (best time, last clear, victories, defeats, last runs).
- **Login** page (`#login`) and a Log in button in the header. It is a demo: name and email are kept in this browser's localStorage, passwords are never stored.
- Boss timer starts at the first Attack and stops on the win or the fall (`BCEnd.start / win / lose` in `js/boss.js`).
- Design review without fighting the boss: open `index.html?preview=win` or `?preview=lose` (or run `BCEnd.preview("win")` in the console).
- Esc closes the result screen and returns to the boss room.
