# Lebanon Drive — Theory Exam Prep

An interactive study app for the Lebanese driving theory exam: road signs, official-style
questions, an interactive car check, oral practice, mock exams, mistake tracking and progress.
Trilingual (English / العربية / Français) with proper right-to-left layout for Arabic.

It's a real app, not a static page: your progress, mistakes, favourites and exam history are
saved in your browser and survive reloads. You can also install it to your phone's home screen
and use it offline (it's a Progressive Web App).

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

To make a production build locally:

```bash
npm run build
npm run preview
```

## Host it on GitHub Pages (free, auto-deploys)

1. Create a new repository on GitHub (any name, e.g. `lebanon-drive`).
2. Put these files in it and push to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Lebanon Drive app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. That's it. Every push to `main` builds and publishes automatically. Your app appears at
   `https://YOUR_USERNAME.github.io/YOUR_REPO/` after the Actions run finishes (~1–2 min;
   watch it under the **Actions** tab).

The build uses relative asset paths (`base: "./"` in `vite.config.js`), so it works no matter
what you name the repository — no config to change.

## Install it as an app

Open the published URL on your phone, then use the browser menu → **Add to Home Screen**.
It launches full-screen like a native app and works without a connection.

## Reset your progress

Go to the **Progress** tab and use **Reset all progress** at the bottom.

## A note on the content

- **Road signs** and **theory questions** come from the official Lebanese PDFs.
- The theory bank is a **verified subset** — the source PDF's Arabic text was heavily garbled
  by OCR, so rather than ship guessed "official" answers, only cleanly-readable questions were
  included. The data structure in `src/App.jsx` (the `THEORY` array) is ready for more: paste
  clean question text and drop new objects in.
- The road-sign set covers the common signs across every category. To add any that are missing,
  edit the `SIGNS` array in `src/App.jsx`.
- **Car check, oral and emergency** content is labelled *Practical driving knowledge*, not law.
  For anything vehicle-specific, check the vehicle owner's manual.

## Project structure

```
index.html            app shell + fonts
vite.config.js        build + PWA config
src/
  main.jsx            mounts the app
  index.css           Tailwind + fonts
  App.jsx             the entire app (data + components)
public/               icons + favicon
.github/workflows/    auto-deploy to GitHub Pages
```
