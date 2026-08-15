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

**The home hero is WHITE and the particle field is BLACK, and the field
belongs to the hero alone** (2026-08-15). It fades out as the next section
slides up over the hero, its loop stops at full coverage, and the renderer
is disposed 500ms later; coming back up re-creates it from cached formation
buffers. Consequences worth knowing before touching that page:
- The hero is `position: sticky`, NOT pinned. The pin budget is still two
  (§7) and both are spent on the method journey and the service showcase.
- **Nothing under `.er` may use a negative z-index** — it does not paint,
  fixed or absolute. Layer with z-index 0 and DOM order instead: the white
  ground, then the field, then the fluid wake, then content.
- Four sections below the hero lost their field couplings in that change
  and are currently inert: the method journey's formations, the showcase's
  colour worlds, the trusted band, and the closing disperse. Accepted
  deliberately — they are to be rebuilt with the colour-rhythm brief.

The firm's brand colours are back and live in `--brand-*` tokens, measured
from the real logo (`public/images/SSAdhauBG.png`), not approximated.
Orange is the accent; navy/blue are declared for the mark only, because §5
and §14 still LOCK "no blue anywhere" in UI. **The mark is always full
colour** — never recoloured, inverted, tinted or masked — and one file
(`public/brand/logo-mark.png`) serves the nav, the footer and the loader.

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
