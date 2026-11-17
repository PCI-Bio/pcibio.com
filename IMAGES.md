# Images (public/img)

PCI's own renders, slide fields and report images, copied unchanged from the
AI platform site's source: `pci-platform/docs/site/img` (live at
https://pcibio.ai/img/...). File names are kept so a file here is the same
file there. Replace an image at the source and copy it again; do not edit here.

- `ai/` — used by ai.html and the home hero: the TriControl slide renders,
  the three control lines (`disc-*`, `zoom-*`), the sample report and its
  tumor fields, the whole-slide thumbnails, and the PCI - AI mark.
- `cases/` — de-identified p53 case fields from pcibio.ai/learn-cases, on
  the education cards.
- `tricontrol-block-3d.webp` — this site's own: a model of the p53 TriControl
  FFPE block (mint cassette, paraffin block, three control plugs), placed
  beneath and beside the slide in the home hero (John, 17 Nov 2026). Source:
  `render/tricontrol-block-3d.html`. To re-make it, screenshot that page with
  headless Chrome at 1100 x 1000 on a transparent background
  (`--default-background-color=00000000`), trim to the visible pixels, resize
  to 760 px wide and save as WebP. `render/` is not part of the build.

Team photos stay in `/team`, product photos in `/products`, partner logos in
`/logos`. The 20-second teaser and its poster are in `/video`.
