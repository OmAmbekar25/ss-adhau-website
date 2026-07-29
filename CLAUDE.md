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
desktop-gated: the Locations map journey (`lib/map3d.js`) and the homepage
valuation journey (`lib/reportScene.js`). The hero stays CSS-only.

## Commands
- `npm run dev` — dev server (localhost:3000)
- `npx eslint src` — lint

## Ground rules learned in this project
- Verify visual changes with Playwright screenshots (chromium via
  `NODE_PATH=~/.npm/_npx/<hash>/node_modules`), including mobile (375px)
  and `prefers-reduced-motion`.
- Never fabricate business content: no invented case studies, credentials,
  addresses, or registration numbers. `src/data/caseStudies.js` stays empty
  until real data arrives.
- Delete orphaned files when replacing components.
- Scroll-driven 3D must be a pure function of scroll progress (no tweens, no
  one-shot state) so scrubbing backwards is exact — see `lib/reportScene.js`.
- Known unresolved: production domain placeholder (`NEXT_PUBLIC_SITE_URL`),
  Formspree endpoint marked `🔴 REPLACE` in `src/app/contact/page.js`.
