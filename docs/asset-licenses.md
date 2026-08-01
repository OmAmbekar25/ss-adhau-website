# Asset licences

Every third-party image on this site is recorded here with its licence.
Nothing ships without an entry.

## Service showcase (WI-1 / WI-2)

Supplied by the client, already graded to the art direction: desaturated,
graphite-and-silver duotone on the site tokens, grain, blacks crushed to
`--bg-deep`, and the slide's own hue in the shadows at 8%. Because the
grade is baked into the exports, the build applies none of its own — a
second pass in CSS would stack on the first.

Served as 1600x2000 WebP from `public/images/slides/`, resized per
breakpoint by `next/image` (which also emits AVIF where the browser takes
it), and loaded eagerly so no card is still decoding when the section
pins.

| Slide | File | Source | Photographer | License | Treatment |
|---|---|---|---|---|---|
| 01 Real estate | slide-01-real-estate.webp | Unsplash RYo6-kVV14Q | Kenejd Spahiu | Unsplash License | Top-58% crop to 4:5; graphite/silver duotone; amber #8A6D3F shadow tint 8%; grain; 800x1000 |
| 02 Plant & machinery | slide-02-machinery.webp | Unsplash pc9xVJvFlfc | Tusik Only | Unsplash License | PLACEHOLDER (vintage aircraft engine; replace with modern industrial subject or client plant photo). Tight engine crop; steel #3F5C7A tint 8% |
| 03 Valuation under IBC | slide-03-ibc.webp | Unsplash HwHQCOAIW1k | Apho | Unsplash License | Colonnade 4:5 crop; oxblood #7A3F46 tint 8%; grain |
| 04 Business valuation | slide-04-business.webp | Unsplash 1tZQJqFeLBY | Harsadh Vikhaas Rajesh Kumar | Unsplash License | Mumbai skyline dusk, tower-cluster 4:5 crop; violet #5C4A7A tint 8%; tonal stretch |
| 05 Financial reporting | slide-05-financial.webp | Unsplash MiNq1Mjikfw | Alessio Fiorentino | Unsplash License | Manuscript center 4:5 crop; teal #3F6E66 tint 8%; lifted floor (paper object, sits on hairline card) |
| 06 M&A support | slide-06-ma.webp | Unsplash qLzhsjaR7nM | Nicholas Chew | Unsplash License | Twin towers + skybridge 4:5 crop; copper #7A5A3F tint 8%; p97 highlight clip |

**Slide 02 is a candidate, not a final.** The supplied file is a vintage
radial aircraft engine — texture-forward and correct to the grade, but an
aeroplane engine is not the industrial plant this firm actually values.
It ships because it is materially better than an empty slot; replace it
with a modern industrial subject, or with the client's own plant
photography, when one is available. TODO(asset).

**Target state, unchanged:** real photography of assets S S Adhau has
valued, with permission. These six are the interim set. Swapping any of
them is a data change — drop a graded 1600x2000 export in and update the
row above.

**Art direction, for whoever sources replacements:** architectural and
material subjects only. No faces, no handshakes, no clip-art metaphors, no
AI-generated imagery, no landmark cliches.

## Existing site imagery

| File | Use | Status |
| --- | --- | --- |
| `SSAdhauBG.png` | Logo / loader mask | Client-owned |
| `hero-glass.jpg` | Homepage hero plate | Client-supplied |
| `consulting.jpg`, `law.jpg` | Homepage sections | Placeholder stock - replace (S15, 2026-07-29) |
| `user.jpg`, `dummyuser.jpg`, `valuelady.jpg` | Unused / template leftovers | Not used on `/studio` |
| `public/logos/*` | Institution marks | Third-party marks reproduced as issued |

## Service page images (/services/[slug])

Client-supplied and already graded to each service's colour world, exactly
as the slide set was. The build re-crops and re-grades nothing.

Served from `public/images/pages/` as WebP at 800 and 1600 wide, with AVIF
offered alongside — but only where AVIF is actually smaller. Grain is
noise, and AVIF spends bits preserving noise that WebP discards: six of the
twenty variants encoded LARGER than the supplied WebP, by up to 22%. Those
were deleted rather than shipped, and `src/data/avifVariants.json` records
which files have an AVIF worth offering. Every page image is lazy-loaded;
only the hero is eager and preloaded.

| Page | File | Source | Photographer | License | Treatment |
|---|---|---|---|---|---|
| 01 Real estate | page-01-interior.webp | Unsplash kqFy3wlm7cU | Bibhash (Polygon Cafe) Banerjee | Unsplash License | Interior with city view; amber tint |
| 01 Real estate | page-01-pattern.webp | Unsplash 7VK3dHI5dUU | Yaroslav Zotov | Unsplash License | Balcony zigzag pattern; amber tint |
| 02 Plant & machinery | page-02-workshop.webp | Unsplash utNqAnoLEaQ | Zoshua Colah | Unsplash License | Lathe workshop tight crop; steel tint. **Interim** — replace with a client plant photograph |
| 03 Valuation under IBC | page-03-files.webp | Unsplash AxA3YVYdv80 | Leiada Krozjhen | Unsplash License | Case files on a shelf; oxblood tint |
| 04 Business valuation | page-04-interior.webp | Unsplash sEdGIL-MpqU | Yaman Zaareer | Unsplash License | Concrete office interior; violet tint |
| 05 Financial reporting | page-05-tables.webp | Unsplash BnL9ntjCVWM | Y M | Unsplash License | Calculator and figure tables crop; teal tint |
| 06 M&A support | page-06-bridge.webp | Unsplash e9DM5Z1DdXs | Shivam Singh | Unsplash License | Vidyasagar Setu from below; copper tint |

Two carry supplier notes that travel with them rather than being quietly
dropped: `page-02-workshop` is marked interim pending a client plant
photograph, and the slide it sits under (`slide-02-machinery`, a vintage
aircraft engine) is already logged above as a flagged candidate.

## Code: the fluid cursor trail

Not an image, but third-party work all the same and recorded on the same
terms.

| Component | Source | Licence | Use |
| --- | --- | --- | --- |
| `src/lib/fluidTrail.js` | [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation), © 2017 Pavel Dobryakov | MIT | Solver only — advection, curl, vorticity confinement, Jacobi pressure, gradient subtract |

The MIT notice is reproduced in full at the head of the file, as the
licence requires.

What was taken is the solver. Everything the original wraps around it is
gone: the rainbow dye and its colour cycling, bloom, sunrays, the shading
toggle, the idle auto-splats, the click burst, and dat.gui with every
config surface it exposed. This page has one dye colour (`#E4E4E0`) and no
controls.

Two things depart from the original rather than merely subtract from it.
The dye is a single channel (`R16F`) instead of RGBA, because with one
fixed colour the other three channels carry nothing and the dye buffer is
the largest surface in the sim. And the decay is `exp(-d * dt)` rather
than the original's `1 / (1 + d * dt)`, so the fade takes the same number
of seconds at 30Hz, 144Hz and on a machine dropping frames — the
reciprocal form only matches the intended rate as the timestep goes to
zero.

## Map geometry — /locations (the territory)

The two state outlines and the projected city coordinates in
`src/data/territory.js`.

| Item | Source | License | Notes |
|---|---|---|---|
| Madhya Pradesh + Maharashtra admin-1 boundaries | [`datamaps`](https://github.com/markmarkoh/datamaps) v0.5.10, `dist/datamaps.ind.js` | **MIT** | The package's boundary data derives from [Natural Earth](https://www.naturalearthdata.com/), which is **public domain** — no attribution required, and none is owed in the page. |
| City coordinates (9) | Well-known settlement latitudes/longitudes | — | Facts, not a dataset. Each one is verified below rather than trusted. |

> **Status: retained, not in use.** The territory build this was extracted
> for was reverted at client direction on 2026-08-01 — see §15 of
> `docs/creative-direction.md`. `src/data/territory.js` is kept in the repo
> deliberately and is imported by nothing: the extraction, the projection
> and the nine verified city positions are work that survives the design
> that commissioned them, and the next map on this site should start from
> them rather than repeat them.

**The brief asked for the Simplemaps India SVG (MIT) and this is not it.**
`simplemaps.com` is refused by this environment's network policy — the
proxy answers 403 to CONNECT — so the geometry could not be fetched from
the named source. `datamaps` was chosen from what the npm registry (which
the policy does allow) had: MIT, Natural-Earth-derived, and therefore the
same licence class the brief specified.

`@svg-maps/india` was available and was **passed over deliberately**: it is
CC-BY-4.0, and attribution-required geometry on a commercial site is a
licence to honour visibly in the page, not quietly in a repository file.
Choosing the public-domain source avoids putting a credit line into an art
direction that has no place for one.

### How it was processed

Not lifted as finished SVG paths. The two states were taken from the
TopoJSON and projected here, which is what makes the city dots exact: the
outlines and the coordinates go through one `geoMercator`, so there is no
foreign projection to reverse-engineer and no calibration to eyeball.

1. `IN.MP` and `IN.MH` filtered out of `topo.objects.ind.geometries`.
2. `topojson-simplify` presimplify → simplify at quantile 0.2, applied to
   the **topology** so the arcs the two states share stay shared and the
   common border cannot open a seam. 61KB of path data → 12KB.
3. `geoMercator().fitExtent()` into a 1000-wide box with 6% padding;
   height falls out of the data at 1189.
4. Coordinates rounded to 0.1 user units (0.07px at the rendered size).

### Verification

Every city was checked with `d3.geoContains` against the polygon it should
fall in: **Nagpur in Maharashtra, the other eight in Madhya Pradesh, nine
of nine correct.** Point-in-polygon against the real geometry rather than
a visual comparison against a reference map — the source of truth is the
shape being drawn, so that is what the dots were tested against.

The extraction script is not kept in the repo: it is a one-off with two
dev-only dependencies (`topojson-client`, `topojson-simplify`, `d3-geo`),
and the steps above are enough to reproduce it. `src/data/territory.js`
carries the same note at the top.
