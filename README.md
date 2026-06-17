<p align="center">
	<img src="images/brand/tiana-luck-logo-dark.png" alt="Tiana Luck" width="280" />
</p>

<h1 align="center">Tiana Luck — Author Website</h1>

<p align="center">
	<strong>Personal author platform for a young South African writer publishing her debut supernatural mystery novel.</strong>
</p>

<p align="center">
	<a href="https://tianaluck.co.za">Live Site</a>
	·
	<a href="https://mrhdigital.co.za">Mr H Digital</a>
</p>

<p align="center">
	<img src="https://img.shields.io/badge/status-live-brightgreen" alt="Status" />
	<img src="https://img.shields.io/badge/type-static%20site-blue" alt="Type" />
	<img src="https://img.shields.io/badge/license-proprietary-orange" alt="License" />
	<img src="https://img.shields.io/badge/built%20by-Mr%20H%20Digital-purple" alt="Built by Mr H Digital" />
</p>

---

## Overview

This repository contains the official author website for **Tiana Luck** — a 14-year-old South African writer currently publishing *Before Dawn*, a supernatural mystery novel, chapter by chapter online.

The site is built as a lightweight, zero-dependency static website with:

- A full brand identity system (logo, favicon pack, social icon)
- Cinematic dual-video hero with dark/light mode crossfade
- Scrapbook / journal aesthetic on a moody dark palette
- Full dark and light mode with smooth transitions
- Fully responsive across desktop, tablet, and mobile

## Highlights

- Cinematic hero with dual looping background videos that crossfade on theme switch
- Dark / light mode toggle with `localStorage` persistence and zero flash on load
- Full-screen animated mobile navigation with burger-to-X icon morph
- Dual brand logo system — dark and light variants crossfade via CSS opacity
- Favicon pack wired across all pages including Apple touch icon
- Open Graph and Twitter Card meta on every page for rich social share previews
- "Currently Writing" badge showing live chapter progress
- Chapter accordion on the Books page with inline excerpt previews
- Spotify playlist embed for the *Before Dawn* soundtrack
- Reader review system with star rating UI
- Fog particle background animation with `prefers-reduced-motion` support
- Sticky frosted-glass navbar with scroll-triggered background
- SEO-ready: meta descriptions, Open Graph, sitemap.xml, robots.txt
- Performance: lazy-loaded images, tab-visibility video pause, no frameworks

## Technology

- HTML5
- CSS3 (custom properties, grid, animations, backdrop-filter)
- Vanilla JavaScript (MutationObserver, IntersectionObserver, localStorage)

## Project Structure

```text
tiana-luck-website/
|- index.html
|- about.html
|- books.html
|- blog.html
|- vlog.html
|- reads.html
|- contact.html
|- robots.txt
|- sitemap.xml
|- css/
|  |- style.css
|- js/
|  |- main.js
|- images/
|  |- before_dawn_cover.png
|  |- tiana-luck-photo.png
|  |- brand/
|     |- tiana-luck-logo-dark.png
|     |- tiana-luck-logo-light.png
|     |- social-icon.png
|     |- favicon-32x32.png
|     |- favicon-16x16.png
|     |- apple-touch-icon.png
|- videos/
|  |- forest-dark.mp4
|  |- forest-light.mp4
|- README.md
```

## Local Setup

No dependencies or build tools required. Open directly in a browser:

```bash
open index.html
```

Or serve locally with any static file server:

```bash
npx serve .
```

## Updating Content

**Currently Writing badge** — edit the `CURRENT` object in `js/main.js`:

```js
const CURRENT = { title: 'Before Dawn', chapter: 4, progress: 65 };
```

**Chapter progress bar** — update the inline CSS variable in `index.html`:

```html
<div class="hype-fill" style="--progress: 65%"></div>
```

**Spotify playlist** — replace the playlist ID in the embed `src` in `books.html`:

```
https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID?utm_source=generator&theme=0
```

**Hero videos** — drop replacements into `videos/`. Dark mode uses `forest-dark.mp4`, light mode uses `forest-light.mp4`. Recommended: H.264, 1920×1080, under 15MB, loop-friendly.

## Deployment

No server runtime required. Deploy to any static host:

- **Netlify** — drag the project folder into the Netlify dashboard
- **Vercel** — connect repo, framework preset: Other
- **GitHub Pages** — push to `main`, serve from root
- **cPanel** — upload all files via FTP to `public_html/`

After deploying, confirm the following match the live domain:

- `robots.txt` — `Sitemap` URL
- `sitemap.xml` — all `<loc>` values
- All HTML files — `og:url` meta tag

Then submit `https://tianaluck.co.za/sitemap.xml` to [Google Search Console](https://search.google.com/search-console).

## Notes

- Social links (`href="#"`) throughout the HTML are placeholders — replace with real profile URLs before launch.
- Contact email `hello@tianaluck.co.za` in `contact.html` is a placeholder — replace with the real address.
- All contact through the site is managed by Tiana's family.

## Credits

- Author and content: Tiana Luck
- Development and branding: Mr H Digital

---

<p align="center">
	<strong>Development Signature</strong>
</p>

<p align="center">
	<img src="images/mrh-digital-logo-transparent.png" alt="Mr H Digital" width="220" />
</p>

<p align="center">
	Designed and developed by <a href="https://mrhdigital.co.za" target="_blank" rel="noopener noreferrer"><strong>Mr H Digital</strong></a>
</p>
