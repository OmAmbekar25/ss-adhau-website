# CLAUDE.md — SS Adhau Valuers & Engineers website

Read `docs/creative-direction.md` before building or restyling any UI. It is
the source of truth for all visual decisions. If a request conflicts with a
LOCKED item there, say so rather than silently resolving it.

Also read `hero-reference/README.md` before touching the hero — it encodes
the art-direction references and acceptance criteria.

## Stack
Next.js 16 (App Router, JS not TS) · Tailwind v4 · Lenis (smooth scroll) ·
GSAP + ScrollTrigger (scroll choreography) · Motion/`motion/react`
(component entrances/hover) · three.js — two scenes only, both lazy and
desktop-gated: the Locations map journey (`lib/map3d.js`) and the home
page's particle field (`lib/studioScene.js`), plus the WebGL2 fluid trail
(`lib/fluidTrail.js`) over the same page's hero. The hero's TYPE stays
CSS-only — the field sits behind it, not in it.

**THE SITE IS A LIGHT WORLD** (2026-08-15). Every page, every section:
`--bg` is `#FFFFFF`, `--ink` is `#0B0B0C`, and the particle field is black
on white with `NormalBlending`. §5's noir/linen palette is history — the
legacy `--noir` / `--linen` tokens survive by NAME only (`/career`, the
legacy Navbar/Footer and the locations map still wear `bg-noir`) and their
values are inverted, so the names lie and the roles do not.

Things that will bite you on this page:
- **Ink follows the surface a string actually sits on, not the site
  default.** The only strings on any route that sit on a dark surface are
  `/services/[slug]`'s hero band and the nav above it, because the
  photographs are not regraded. They keep light ink on purpose.
- The hero is `position: sticky` inside `.er-herostage`, NOT pinned. The
  stage wrapper is load-bearing: sticky is contained by its containing
  block, and without it the hero's was `<main>` and it stayed stuck at the
  top for the whole document, reading through every section below. The pin
  budget is still two (§7), both spent on the method journey and showcase.
- **Nothing under `.er` may use a negative z-index** — it does not paint,
  fixed or absolute. Layer with z-index 0 and DOM order instead.
- The particle field is scoped to the HERO and the METHOD JOURNEY only
  (2026-08-16). It dips to nothing while the panel covers the hero,
  returns for the journey's five formations, and is gone before any part
  of the services section is on screen. Two zone factors are multiplied
  and read off `.progress` on every scroll — NOT written from the
  triggers' own `onUpdate`, which fires only inside a trigger's range and
  is skipped by any jump that clears it in one frame.
- **Pausing the loop does not clear the canvas.** Setting the fade to zero
  and pausing in the same tick leaves the last drawn frame painted there
  for good. `renderOnce()` before `pause()`. This cost three attempts,
  two of them aimed at the wrong thing entirely.
- The services section is six tinted cards (`--card-01..06`), keyed by
  `[data-card]` so no colour literal lives in the component. The fill is
  the elevation — no shadow on a tinted card.
- Colour-world hue text is `--hue-NN-text`, a 45/55 mix of the hue into
  `--ink`. The literals are mirrored in THREE places — `studio.css`,
  `StudioShowcase.jsx` and `src/data/services.js`. Change one, change all
  three; the third is the one that gets missed.

The firm's brand colours live in `--brand-*` tokens, measured from the real
logo (`public/images/SSAdhauBG.png`), not approximated. `--accent` is the
orange (`--brand-orange`); navy/blue are declared for the mark only,
because §5 and §14 still LOCK "no blue anywhere" in UI. **The mark is
always full colour** — never recoloured, inverted, tinted or masked — and
one file (`public/brand/logo-mark.png`) serves the nav, footer, loader and
favicon.

`/` is the page formerly at `/studio`. The legacy home page and its
`ValuationJourney` / `lib/reportScene.js` were deleted in that move, and
`/studio` is a permanent redirect to `/` in `next.config.mjs`.

## Commands
- `npm run dev` — dev server (localhost:3000)
- `npx eslint src` — lint

## Ground rules learned in this project
- Verify visual changes with Playwright screenshots (chromium via
  `NODE_PATH=~/.npm/_npx/<hash>/node_modules`), including mobile (375px)
  and `prefers-reduced-motion`.
- Never fabricate business content: no invented case studies, credentials,
  addresses, or registration numbers. The case-studies surface and its empty
  `src/data/caseStudies.js` placeholder went with the legacy home page —
  the rule outlives them: if real assignments arrive, they get a section;
  nothing is invented to fill one.
- Delete orphaned files when replacing components.
- Scroll-driven 3D must be a pure function of scroll progress (no tweens, no
  one-shot state) so scrubbing backwards is exact — see `lib/reportScene.js`.
- Known unresolved: production domain placeholder (`NEXT_PUBLIC_SITE_URL`);
  🔴 **contact delivery is a stub** — `/api/contact` validates, logs and
  returns success but sends nothing. It replaced a live Formspree endpoint
  marked `🔴 REPLACE` (someone else's demo form). Pick a mail service and
  replace the marked block before launch; the phone number under the form
  is the only working path until then.
- **Verify the whole page, not the part you changed.** The hero-inversion
  pass was checked by scrolling one viewport and back, and reported as
  sound; every one of its three defects lived below that. Walk the full
  scroll height and every route before calling a visual change done.
- An assertion has to be able to fail for the reason you are actually
  worried about. A page-wide `requestAnimationFrame` counter cannot tell
  you whether one scene's loop stopped (Lenis and GSAP tick regardless);
  prove it structurally instead — canvas removed, context force-lost.
- Waiting on client copy, not code: the real review list
  (`src/data/reviews.js` — ≥5 and ≥9 change the layout by themselves), the
  founding year and lineage milestones on `/about`, confirmation of the
  Google listing behind `MORE ON GOOGLE`, the logo as a vector (the PNG is
  exact and in use; only the SVG is outstanding), and confirmation that
  the navbar's two cycling lines are the two the firm wants.
