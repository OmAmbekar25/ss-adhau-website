# Creative Direction

**Location:** `docs/creative-direction.md`
**Referenced from:** `CLAUDE.md` — *Read this file before building or restyling any UI. It is the source of truth for all visual decisions.*
**Status:** live — sections previously marked `TO DECIDE` have been filled with the decisions already made and approved during the v3 build. Remaining open items are marked.

---

## How to use this file

This is not a mood board. It is a constraint document. Every section is either:

- **LOCKED** — a decision has been made. Follow it exactly. Do not "improve" it.
- **TO DECIDE** — not yet decided. Do not invent a value here and proceed. Stop and ask.

If a request conflicts with a LOCKED item, say so rather than silently resolving it.

---

## 0. Subject — `LOCKED`

| Field | Value |
| --- | --- |
| Company / product name | S S Adhau Valuers & Engineers |
| What it actually does, in one plain sentence | Government-registered valuers and chartered engineers who produce valuation reports for property, plant & machinery, and businesses. |
| Who the page is for (specific) | Bank branch/credit managers, chartered accountants, insolvency professionals (CIRP/liquidation), advocates needing court-admissible reports, property owners with tax valuations. |
| The single job this page has to do | Make the visitor believe a report signed by this firm will be accepted by a bank, court, or regulator without question. |
| What the visitor should be able to do 5 seconds after landing | Request a valuation (one obvious CTA). |
| Nearest competitor whose site we must not resemble | Any template-grade local valuer/CA site — and equally, any generic AI-startup dark-gradient site. |
| One true, specific, non-obvious thing about how the firm works | Every valuation starts with a physical site inspection by a registered valuer; every report is physically stamped and signed. |
| Proof we can show | IBBI Category I registration, Income Tax Dept. approval, 15 named public-sector banks/institutions that accept the firm's reports, two real offices, nine served cities. |

**The buyer is buying credibility and compliance, not creativity.** Target feel: a serious professional firm that happens to have a beautifully built site — audit firm / barristers' chambers, not agency.

---

## 1. The bar

**LOCKED — product-truth premium, with exactly one spectacle moment per page.**

- Homepage spectacle: the hero — the photographic shattered-glass plate with cursor-driven light (user-supplied v3 design, ported to React, no WebGL).
- Locations page spectacle: the 3D map journey (survey beacon travelling the real MP/MH geography).
- Everything else is quiet, disciplined, near-invisible.

---

## 2. Locked constraints

### 2.1 Spend boldness in one place
**LOCKED.** One signature element per page (see §1). Nothing else competes with it.

### 2.2 Animation library — one system, not four
**LOCKED (and matches the current build):**
- **Lenis** — smooth scroll, site-wide (`SmoothScroll.jsx`).
- **GSAP + ScrollTrigger** — all scroll choreography (map journey pins, scrubs).
- **Motion** (`motion/react`) — component-level entrances and hover only.
- **Three.js** — only inside the Locations map journey, desktop only, never on first paint. The homepage hero is deliberately CSS-only.

### 2.3 Performance budget
**LOCKED.** As specified: LCP < 2.0s (4G, mid-tier Android), CLS < 0.05, INP < 200ms, first-load JS ≤ 250KB gz (excl. 3D chunk), 3D lazy + capability-gated, animate `transform`/`opacity` only, fonts self-hosted via `next/font` (max 3 weights per family), `next/image` everywhere.
Known debt against this budget: the hero's flare/bloom layers use `mask-position`/`filter` compositing (accepted — static textures, GPU-composited, measured smooth); mobile map journey serves a static SVG instead of WebGL ✓.

### 2.4 Quality floor
**LOCKED.** `prefers-reduced-motion` = complete static site, not degraded (already implemented per component). Keyboard focus everywhere. Semantic HTML, one H1 per page. Contrast 4.5:1 body / 3:1 display — including over the glass photograph (the veil layer exists for this; check it whenever hero copy changes). No scroll hijacking. Touch targets ≥ 44px.

### 2.5 Copy is a design deliverable
**LOCKED.** Current approved copy set: hero H1 "Every Decision Begins With The Right Value."; supporting Central-India paragraph; CTAs "Request a Valuation" / "Explore Our Services". Claims carry credentials (IBBI · Category I, Income Tax Dept.) or names (the 15 institutions). No "X, redefined" constructions.

---

## 3. Brand personality — `LOCKED`

| Adjective | Therefore we never... |
| --- | --- |
| Authoritative | use playful motion, bouncy easing, cartoon iconography, or emoji |
| Precise | ship placeholder data (Est. XXXX), invent case studies, or use approximate credentials |
| Understated-luxurious | let gold cover large surfaces — brass is an accent caught in edges, hairlines, and type, never a fill for panels |

Voice as a person: a senior chartered engineer who has signed thirty years of reports — calm, exact, unhurried.
Adjacent brand in an unrelated category: a luxury watchmaker's product catalogue (Omega reference in `hero-reference/10`).

---

## 4. Typography system — `LOCKED`

```
Display:  Cormorant Garamond — weights 300/400/500 + italic — all h1/h2/h3
          site-wide (set in globals.css). Justification: calligraphic serif
          reads as engraved/certificate — the firm's product is a signed,
          sealed document. Not on the AI-default list.
Body:     Archivo (hero) / IBM Plex Sans (site body) — 400/500(/600 Plex).
Utility:  IBM Plex Mono — eyebrows, buttons, credential rows, nav-adjacent
          labels. Carries the "technical document" register.

Hero H1: clamp(60px, 11vw, 168px) equivalent (see Hero.jsx), lh 0.94–0.98.
The metallic headline gradient (#EED7A1→#C79A43→#A87325 family) is applied
to the focal line only.
```

Self-hosted via `next/font` (Google + local). No Inter, no Satoshi (removed).

---

## 5. Color system — `LOCKED`

```
--noir      #070606   the stage. True near-black, from the v3 hero plate.
--noir-2    #100E0C   raised surfaces (rarely needed; prefer white/[0.04]).
--linen     #F2EFE9   headings + primary text. Warm white from the plate's
                      highlights.
--fog       #9C9A93   body/muted text.
--brass     #C9A063   THE accent. Used ONLY for: eyebrows, hairline rules,
                      edge accents, CTA borders/fills, credential markers.
--hairline  rgba(242,239,233,0.12)  borders and dividers.
```

Every value derives from the hero photograph — the site is lit by the same
light as its signature image. Panels are `bg-white/[0.04]` + hairline
border, never solid gray. **No blue anywhere** (the old navy identity was
retired deliberately; do not reintroduce it in UI — it survives only inside
untouchable assets like bank logos and the light paper map).

---

## 6. Spacing & grid — `LOCKED`
As specified in the scaffold (8px base, 12/6/4 grid, 1440px max, 60–75ch reading column, section rhythm 2–3× internal spacing).

## 7. Motion principles — `LOCKED`
As specified in the scaffold. Two easings only: `cubic-bezier(0.16,1,0.3,1)` entrances, `cubic-bezier(0.2,0.8,0.2,1)` hovers (the v3 button curve). Reveals fire once. Max two pinned sections per page (currently: one — the map journey).

**Known conflicts with the current build (flagged, not silently resolved — see §15):**
- The "Trusted by" section is an infinite logo lane (rejection list §14) — kept deliberately: user-directed, modelled on the AEOS reference, with center-spotlight behavior that goes beyond a plain marquee. Revisit if conversion suffers.
- The map journey finale counts 0→9 on arrival (motion §7 rejects scroll counters) — kept: it fires once at a narrative destination, not ambiently on scroll.

## 8. Scroll journey — `LOCKED` (homepage)
The argument: (1) hero — a report that holds up = the right value; (2) trusted-by — institutions already rely on it; (3) services — what we can value; (4) spotlight — how we actually work (site inspection); (5) about/process/presence — depth for the diligent reader; (6) contact — the step. Candidates for the cut test: MarqueeCards testimonials and HomeContact overlap with Footer — review before launch.

## 9. Hero — `LOCKED`
The v3 shattered-glass plate with cursor-driven light. H1 in DOM before JS. One primary CTA. See `hero-reference/README.md` for the full art-direction bible and acceptance criteria.

## 10. Imagery & assets — partially `TO DECIDE`
Have: hero glass plate (user-supplied), valuelady.jpg (genuine editorial-grade), institution logos, real map data. **Rejected as cliché and pending replacement: consulting.jpg and law.jpg (scrabble-tile stock).** Needed from the firm: real office/team/site-inspection photography, real case-study data (`src/data/caseStudies.js` is intentionally empty), real Formspree endpoint confirmation, real production domain (.co.in vs placeholder).

## 11. Navigation, loading, footer, CTA — `LOCKED`
As specified. Current nav: 5 items + CTA ✓. No preloader ✓. CTA wording: "Request a Valuation" — use identically everywhere it appears.

## 12. Mobile — `LOCKED`
As specified. Map journey and hero already ship distinct mobile compositions.

## 13. Review rubric — `LOCKED`
Apply before showing any new section. The substitution test is the big one: navy-corporate templates fail it; the current noir/brass/serif language passes only as long as content stays specific to this firm.

## 14. Rejection list — `LOCKED`
As specified in the scaffold, plus (project-specific): no blue accents, no crystal/orbit-ring 3D objects (rejected in hero v2), no fabricated client work or placeholder credentials, no Satoshi/Inter.

---

## 15. Decisions log

| Date | Decision | Reason | Alternative rejected |
| --- | --- | --- | --- |
| 2026-07-26 | Brand register: dark luxury ("audit firm with a beautiful site") | User brief: buyers purchase credibility; AEOS-style creative-studio register rejected | Light paper + navy/gold institutional palette (v1) |
| 2026-07-27 | Hero = user-supplied v3 glass plate, CSS-only; three.js hero deleted | Photographic plate outperformed all three generative attempts; also fixed scroll jank | Crystal+rings (v1), glass monolith (v2), procedural shatter (v2.5) |
| 2026-07-27 | Typography: Cormorant Garamond display / Archivo+Plex Sans body / Plex Mono utility | v3 design language; certificate/engraved register fits a signing firm | Satoshi (removed), Wix Madefor as display |
| 2026-07-28 | Site-wide palette: noir/linen/fog/brass tokens; navy retired from UI | User: "match the hero to all the others"; seams between navy chrome and noir hero read as glitch | Keeping navy navbar/footer |
| 2026-07-28 | Trusted-by logo lane kept despite §14 marquee rejection | User-directed feature with spotlight interaction; flagged for post-launch review | Static logo grid |
| open | consulting.jpg / law.jpg replacement | Awaiting real photography from the firm | — |
| open | Case studies content | No real assignment data provided yet — section renders nothing | Fabricated examples (refused) |
| open | Production domain + Formspree endpoint | Placeholders still in metadata/contact form | — |
