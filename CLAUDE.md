# CLAUDE.md — SS Adhau Valuers & Engineers website

Read `docs/creative-direction.md` before building or restyling any UI. It is
the source of truth for all visual decisions. If a request conflicts with a
LOCKED item there, say so rather than silently resolving it.

Also read `hero-reference/README.md` before touching the hero — it encodes
the art-direction references and acceptance criteria.

## Stack
Next.js 16 (App Router, JS not TS) · Tailwind v4 · Lenis (smooth scroll) ·
GSAP + ScrollTrigger (scroll choreography) · Motion/`motion/react`
(component entrances/hover) · three.js (Locations map only, lazy).

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
- Known unresolved: production domain placeholder (`NEXT_PUBLIC_SITE_URL`),
  Formspree endpoint marked `🔴 REPLACE` in `src/app/contact/page.js`.
