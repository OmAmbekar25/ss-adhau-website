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
- Waiting on client copy, not code: the real review list
  (`src/data/reviews.js` — ≥5 and ≥9 change the layout by themselves), the
  founding year and lineage milestones on `/about`, and confirmation of the
  Google listing behind `MORE ON GOOGLE`.
