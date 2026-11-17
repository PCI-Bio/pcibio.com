# pcibio.com

The company website of **PCI** (Precision Cellular Immunology, LLC), Houston, TX: the product
catalog and shop (cell-line IHC controls: TriControl, DualControl, QuadControl FFPE blocks and
slides), the IHC Controls explainer, the entry point to the education modules, the company and
contact pages, and a short pointer to the AI platform.

## Two sites, one company

- **pcibio.com** (this repository) is the company site: products, controls, education entry
  point, about, contact.
- **pcibio.ai** is the AI platform site: PCI - AI, the demo, the reading room, the education
  modules themselves, safety and data, the pilot. Its source lives in the `pci-platform`
  repository under `docs/site/`.

Rule: pcibio.com says about the AI only what pcibio.ai says, in the same words. `ai.html` is
written from pcibio.ai's overview and platform pages and links there for everything else
(Explore the platform, Watch the demo, Start a pilot). The education cards link to the pcibio.ai
modules. Research use only, never diagnostic claims, never cell-line names, no thresholds behind
the AI call. The physical products keep "cell line plugs" and "cores".

The look follows pcibio.ai's tokens (navy, action blue, teal, IBM Plex Sans and Mono, 10 px
radius) while keeping this site's own layout, dark bands, hexagon pattern and animations; see
`@theme` in `css/style.css`.

## Stack

- Plain multi-page HTML, one file per page; the header and footer are pasted into each page
  (change them identically everywhere).
- [Vite 6](https://vite.dev/) with `@tailwindcss/vite` (Tailwind CSS v4; the theme is the
  `@theme` block in `css/style.css`, there is no tailwind.config). Page entries are listed in
  `vite.config.ts`.
- Vanilla JavaScript modules in `js/`: `main.js` (nav, reveal animation, counters, contact
  form), `products-list.js` / `product.js` / `products.js` (catalog), `auth.js`, `cart-sync.js`,
  `checkout.js`, `account.js` (Supabase accounts and Stripe checkout).
- Backend: Supabase (accounts, carts, orders, inquiries; schema in `supabase-schema.sql`) and
  Vercel serverless functions in `api/` for Stripe Checkout and the webhook. Keys in `.env`
  (see `.env.example`).

## Run and build

```bash
npm install
npm run dev      # Vite dev server with HMR, http://localhost:3000
npm run build    # production bundle in ./dist
npm run preview  # serve ./dist
```

## Images and video

- `public/img/` holds PCI's own renders, slide fields and report images, copied unchanged from
  `pci-platform/docs/site/img` (the pcibio.ai source); see `public/img/README.md`. No stock
  photos anywhere on the site.
- `public/video/` holds the 20-second teaser cut from the pcibio.ai demo and its poster.
- `public/team/`, `public/products/`, `public/logos/`: team photos, product photos, partner logos.
- Fonts are self-hosted in `public/fonts/` (IBM Plex Sans and Mono, SIL OFL); the CSP allows
  `font-src 'self'` only.

## Deploy

Vercel. `vercel.json` sets the security headers (CSP, HSTS, frame and referrer policies),
cache headers for static assets, and the redirects: the retired `/viewer.html` and `/viewer`
redirect permanently to https://pcibio.ai/platform. `public/robots.txt` and `public/sitemap.xml`
are served as-is; update the sitemap's `lastmod` when a page changes.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: hero on the TriControl slide with the block beside it, offerings, featured controls (p53 TriControl, PD-L1 DualControl, PD-L1 Single Control, MMR QuadControl), workflow, CTA |
| `products.html`, `product.html` | Catalog and product detail (cart, Stripe checkout) |
| `controls.html` | IHC Controls explainer and biomarker table |
| `ai.html` | The AI platform, in pcibio.ai's words, with the teaser; links to pcibio.ai |
| `education.html` | Entry point to the pcibio.ai education modules, demo, cases, published science |
| `about.html`, `contact.html` | Team, location, partners; contact form (Supabase `inquiries`) |
| `account.html`, `checkout-*.html` | Shop account and checkout result pages |
| `privacy.html`, `terms.html` | Legal pages (text under review with counsel) |
| `404.html` | Not found |

Research use only — not for use in diagnostic procedures.
