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

**LOCKED — product-truth premium, with at most two spectacle moments per page,
and never two competing for the same screen.** *(Amended 2026-07-29 — was
"exactly one per page"; see §15.)*

- Homepage spectacle 1: the hero — the photographic shattered-glass plate with cursor-driven light (user-supplied v3 design, ported to React, no WebGL).
- Homepage spectacle 2: the valuation journey — the 3D narrative spine (`ValuationJourney` + `lib/reportScene.js`). It sits five screens below the hero, so the two never share a viewport.
- Locations page spectacle: the 3D map journey (survey beacon travelling the real MP/MH geography).
- Everything else is quiet, disciplined, near-invisible.

**The second spectacle has to earn it by being product-truth.** The spine is
not decoration: it is the firm's own five-step process, told as one field of
points that is re-formed — enquiry → surveyed site → ordered analysis →
stamped page → delivered originals. If a future addition cannot make that
claim, it does not get to be spectacle number two.

---

## 2. Locked constraints

### 2.1 Spend boldness in one place
**LOCKED.** One signature element per page (see §1). Nothing else competes with it.

### 2.2 Animation library — one system, not four
**LOCKED (and matches the current build):**
- **Lenis** — smooth scroll, site-wide (`SmoothScroll.jsx`).
- **GSAP + ScrollTrigger** — all scroll choreography (map journey pins, scrubs).
- **Motion** (`motion/react`) — component-level entrances and hover only.
- **Three.js** — two places only: the Locations map journey, and the homepage
  valuation journey (`lib/reportScene.js`). Desktop only (≥768px), lazy, never
  on first paint, capability-gated (a failed WebGL context falls back to the
  static step list). **The homepage hero stays deliberately CSS-only** — the
  2026-07-27 decision against a WebGL hero is untouched and still LOCKED.
  *(Amended 2026-07-29 — was "only inside the Locations map journey"; see §15.)*

### 2.3 Performance budget
**LOCKED.** As specified: LCP < 2.0s (4G, mid-tier Android), CLS < 0.05, INP < 200ms, first-load JS ≤ 250KB gz (excl. 3D chunk), 3D lazy + capability-gated, animate `transform`/`opacity` only, fonts self-hosted via `next/font` (max 3 weights per family), `next/image` everywhere.
Known debt against this budget (measured 2026-07-29, `next build`, gzipped
first-load chunk set per prerendered document):

| Page | First-load JS (gz) | Contains three.js? |
| --- | --- | --- |
| `/` | **288KB** (was 285KB before the valuation journey) | no — deferred |
| `/studio` | **225KB** ✓ under budget | no — deferred |
| `/about` | 224KB | no |
| `/locations` | 401KB | **yes — pre-existing** |

- The homepage was already over the 250KB budget before the valuation journey;
  the journey adds ~3KB because `reportScene.js` is a dynamic `import()` fired
  from inside the section's effect, so all ~139KB gz of three.js loads only
  when a desktop visitor reaches that section. **Open:** the ~38KB overage is
  inherited, not introduced — chase it in `motion` / `lucide-react` /
  `gsap` import surface, not in the 3D.
- `/locations` ships three.js in first-load JS because `MapJourney` imports
  `lib/map3d` statically. **Open** — should use the same dynamic-import
  pattern as `ValuationJourney`.
- `/studio` is the first page in the project to meet this budget, despite
  being the most visually ambitious: its three.js chunk is behind a dynamic
  `import()` fired from `requestIdleCallback`, and it carries no photography.
- The hero's flare/bloom layers use `mask-position`/`filter` compositing
  (accepted — static textures, GPU-composited, measured smooth); mobile map
  journey serves a static SVG instead of WebGL ✓.

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
As specified in the scaffold. Two easings only: `cubic-bezier(0.16,1,0.3,1)` entrances, `cubic-bezier(0.2,0.8,0.2,1)` hovers (the v3 button curve). Reveals fire once. Max two pinned sections per page — the homepage is now **at that ceiling** (Spotlight's `Sticky`, and the valuation journey). Nothing else on the homepage may pin.

**Scroll-driven 3D is a pure function of progress.** `reportScene.js` derives
every value — morph, opacity, camera, the seal landing — from `p` alone. No
tweens, no one-shot state, so scrubbing backwards un-signs the report exactly.
Any future scroll scene follows this rule: if a moment can't be expressed as
`f(p)`, it doesn't belong in a scrubbed section.

**Interaction moves the light, never the object.** The hero established it; the
valuation journey (pointer nudges the camera, not the geometry) and
`LightCard` (pointer moves a brass edge-glow, not the panel) inherit it.

**Known conflicts with the current build (flagged, not silently resolved — see §15):**
- The "Trusted by" section is an infinite logo lane (rejection list §14) — kept deliberately: user-directed, modelled on the AEOS reference, with center-spotlight behavior that goes beyond a plain marquee. Revisit if conversion suffers.
- The map journey finale counts 0→9 on arrival (motion §7 rejects scroll counters) — kept: it fires once at a narrative destination, not ambiently on scroll.

## 8. Scroll journey — `LOCKED` (homepage)
The argument: (1) hero — a report that holds up = the right value; (2) trusted-by — institutions already rely on it; (3) services — what we can value; (4) spotlight — how we actually work (site inspection, photographed); (5) **the valuation journey — the same process, in 3D, end to end**; (6) about/presence — depth for the diligent reader; (7) contact — the step. Candidates for the cut test: MarqueeCards testimonials and HomeContact overlap with Footer — review before launch.

Spotlight is deliberately placed immediately before the journey and labelled
"Step 02", which is the journey's second beat: the photograph and the 3D beat
are the same claim, told twice, in the order a reader meets them.

**The survey thread** (`SurveyThread.jsx`) is the connective tissue: one brass
hairline down the left gutter with a diamond beacon travelling it and a station
tick per chapter — the same beacon-on-a-route language as the Locations map
journey, met on the homepage first. Chapters come from `[data-chapter]`
attributes in `app/page.js`, so the rail cannot drift out of sync with the
sections. Desktop ≥1024px, fades in only after the hero, absent under reduced
motion.

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
| 2026-07-29 | §1 amended: two spectacle moments per page allowed, never sharing a viewport | User asked for a "motion-full, highly interactive, connective 3D storytelling" site. Flagged the conflict with the one-spectacle rule before building; user chose to add one 3D narrative spine rather than a full 3D rebuild | Full 3D across all pages (rejected — fails the §13 substitution test and the credibility register); motion-only with no new 3D |
| 2026-07-29 | §2.2 amended: three.js permitted in a second place — the homepage valuation journey | It is product-truth, not decoration: the firm's own five process steps, one point field re-formed. Lazy + desktop-gated, so the homepage's first-load JS moves 285→288KB gz | A WebGL hero (still rejected — the 2026-07-27 decision stands) |
| 2026-07-29 | `OurProcess.jsx` deleted, replaced by `ValuationJourney.jsx` | The 3D spine narrates the same five steps with the same copy; keeping both would have shipped the process twice | Adding the journey alongside OurProcess |
| 2026-07-29 | Survey thread added as the homepage's connective element | Gives the page one continuous spine and plants the beacon metaphor the Locations map journey pays off | Per-section progress indicators |
| 2026-07-29 | "Entropy Resolved" built as a **candidate at `/studio`**, not as a replacement for `/` | Signature element = a persistent particle-silk ribbon with scroll-driven states; monochrome palette; roman/italic display mixing. Built to `docs/entropy-resolved-brief.md`. Kept on its own route so the two directions can be judged side by side before anything is retired, and because `/` is not yet pushed anywhere | Replacing `/` outright (deferred until compared) |
| 2026-07-29 | Studio page ships **monochrome**; the champagne accent is used only on the process progress hairline, not in the ribbon | The brief's own tiebreak ("if in doubt, ship pure monochrome"). Gold at the low alphas additive blending needs read as brown dust on black, not silk | Tinting the glow with `--brass`/champagne (tried, rejected on sight) |
| 2026-07-29 | Studio keeps the site's existing Cormorant / IBM Plex Sans / IBM Plex Mono rather than adding Fraunces + Instrument Sans | The brief lists Cormorant as an accepted display face, and body copy is rare on the page. A fourth and fifth family would cost first-load weight for two paragraphs — §2.3 floor wins over the font suggestion | Loading Instrument Sans for body |
| 2026-07-29 | Studio hero headline floor lowered to 46px (brief said 72px min) | At 390px, 72px wraps the headline to six lines and pushes the body copy off-screen. Readability floor wins; the clamp still reaches the brief's 176px ceiling on desktop | Keeping the 72px floor |
| 2026-07-29 | Studio reuses the global Lenis instance (lerp 0.1) instead of its own at 0.09 | Two Lenis instances on one document fight each other. The 0.01 difference is not perceptible | A page-local Lenis |
| open | **60fps floor on the studio page is UNVERIFIED** | This container renders WebGL through SwiftShader (software). Measured 28fps on `/studio` against 14fps on `/` with no WebGL on screen — i.e. the environment is the bottleneck and the numbers say nothing about real hardware. Must be re-measured on a real GPU and a mid-tier Android before this page ships. DPR cap, per-breakpoint counts, single draw call, idle-mount and hidden-tab pause are all in place | — |
| 2026-07-29 | §5.6 IDENTITY beat added to `/studio`: a pinned horizontal track whose four slides the particle field condenses into, smearing with track velocity and springing back at rest | Signature element = persistent particle-silk ribbon with scroll-driven states; monochrome palette; roman/italic display mixing. The beat performs the brand argument — scatter in motion, a defensible position at rest. Same Points object as the ribbon, blended by a mode uniform; never a second particle system | Mounting a second system for the slides (rejected — §2.3 and the whole point of one field) |
| 2026-07-29 | Studio pin budget is now exactly two: the method beat and the identity beat | Matches the brief's own ceiling. Nothing else on that page may pin | — |
| 2026-07-29 | §3.5 cursor repulsion added — particles spread from the pointer and flow back | The one permitted cursor interaction per the brief's drift guards. Two uniforms and ~6 shader ops, quadratic falloff, displacement capped well under the repel radius so the silhouette always stays readable. Disabled on touch and under reduced motion | Cursor trails or pointer-attached particles (both on the rejection list) |
| 2026-07-29 | **Canvas sizing bug fixed** — `renderer.setSize(w, h, false)` in `studioScene.js` | With `updateStyle` off, three.js leaves the canvas unsized in CSS so it displays at its drawing-buffer size. At DPR 1.75 that is a 2240×1260 element in a 1280×720 window, overflowing 960px right and 540px down and putting the scene's centre near 87%/87%. **Invisible at DPR 1**, which is what this container renders at — so repeated "the particles are on the right" reports measured as centred here and no camera change could ever have fixed it. Verification must set `deviceScaleFactor` to match the reporter's device | — |
| open | consulting.jpg / law.jpg replacement | Awaiting real photography from the firm | — |
| open | `/locations` ships three.js in first-load JS (399KB gz, pre-existing) | `MapJourney` imports `lib/map3d` statically — should adopt `ValuationJourney`'s dynamic-import pattern | — |
| open | Homepage first-load JS is ~38KB gz over the §2.3 budget, inherited from before this work | Chase `motion` / `lucide-react` / `gsap` import surface | — |
| open | Case studies content | No real assignment data provided yet — section renders nothing | Fabricated examples (refused) |
| open | Production domain + Formspree endpoint | Placeholders still in metadata/contact form | — |
| 2026-07-29 | Studio particle field re-tinted to a three-stop silver: `#E4E4E0` core / `#B9B9B4` body / `#6E6E68` gauze. Zero warm bias anywhere in the shader | The warm stop (`#FFD7A0`) read as yellow dust under additive blending rather than as gold, and it competed with the gold typographic rule for the same accent job. Gold now survives only outside the canvas — section-headline rules and hairline hover states. Colour-only: count, motion, undulation, scroll states, cursor repulsion and the reduced-motion frame are untouched. Verified by sampling every lit pixel (V > 0.10) at 1440px, 390px and under reduced motion: **0 pixels** with hue 30°–60° at S > 20% | Keeping the steel/gold two-tone; desaturating the warm stop in place (still left a hue at low S) |
| 2026-07-29 | §5.6 IDENTITY's four abstract slides **cut**; the horizontal beat now carries the trusted-by strip. `StudioIdentity.jsx` deleted, `StudioTrusted.jsx` in its place | The mechanic was doing real work but arguing with copy ("We don't estimate value.") that the page already makes better elsewhere. Pointed at the fifteen real institutions, the same travel carries evidence instead of assertion. Still one pass driven purely by scroll position — no autoplay, no loop, no duplicated set, so §14's marquee rejection is not reopened (verified: 15 cards, 0.0px drift when idle). Pin budget unchanged at two | Keeping the slides and adding a separate logo section (a third pin, over budget) |
| 2026-07-29 | Studio reverses its "names only, no logos" decision of earlier today | That decision reasoned the marks are colour artwork on a monochrome page. With the field now silver (above), the plates are the only colour on the page — which is the argument, not a violation of it: these are other people's marks, reproduced as issued. Cards are opaque white and full colour inside the central 60%, easing to 55% opacity / 96% scale at the edges. Opacity and transform only — no grayscale filter animation | A monochrome or duotone treatment of the logos (misrepresents other organisations' marks) |
| 2026-07-29 | The band is measured against the **pin**, not the viewport | Anchors are taken on mount, when the section is ~7,400px below the fold, so a viewport-relative rect put the band that far off the bottom of frame. The pin is exactly one viewport tall and full width, so its box is the frame the cards will actually be seen in. Same class of bug as the DPR one above: a measurement that is correct in the moment it is taken and wrong for the moment it describes | — |
| 2026-07-29 | `fieldBus` gains `onField(cb)` | The scene mounts on `requestIdleCallback`, so a section that needs to hand it DOM measurements is routinely ready first — the band's anchors were being computed against a field that did not exist yet and silently discarded. One callback, fired once on attach | Polling for the field; measuring on a timeout |
| open | The trusted-by progress counter reads `07 Institutions`, per the change request, while the page's own eyebrows number this section 03 | Flagged rather than silently renumbered — the counter is verbatim from the brief and the section eyebrows are the page's existing scheme. One of the two should move before launch | — |
| 2026-07-29 | §5.7 THE DELIVERABLE added to `/studio`: a physical A4 sheet, section-scoped light palette (`--paper #EFEEEA` / `--paper-edge #D8D6CF` / `--paper-ink #1A1A18`) against the page's near-black | The page argues that the firm's product is a defensible document, and until now never showed one. The sheet is the only opaque, light, shadowed object on the page — deliberately outside the page's own visual language, because it is the thing that leaves the building. Two-layer shadow (cast + contact), entry rises 48px over 0.9s with the shadow lengthening in sync, rotateX 4°→0° across the section's scroll. No pin — the budget stays at two. Nothing glassy, glowing or gold | A rendered 3D page in the particle field (the method beat already does that); a photograph (none exists yet) |
| 2026-07-29 | Field gains a static rectangular exclusion mask (`uPlate`) so points part around the sheet | A sheet the particles shine through is a texture, not an object. Signed distance to the rect, push along its gradient, ~80px feather — and each point carries its own feather multiplier, because one shared distance stacks every displaced dot at the same offset and draws a hard wall around the paper. Cursor repulsion (§3.5) stays live outside the mask | Rendering the sheet into the WebGL scene; a CSS backdrop that hides the field wholesale |
| open | **`TODO(asset): real report sample`** — the sheet carries structure only | Letterhead, redaction bars, an empty schedule of figures, an ink stroke that is not anyone's signature, and `Ref. SSA/—/——`. No figure, name, or reference on it states anything about a real valuation. Replace with a redacted page from an actual engagement when the firm supplies one | Inventing plausible report contents (refused — §2 ground rule) |
| 2026-07-29 | **Final pass on the three changes, measured** | 390px / 768px / 1440px and `prefers-reduced-motion` at 1440px and 390px, five sections each. No horizontal page overflow at any width. Pin spacers: 2 at 1440 (method + trusted), 1 at 768, 0 at 390 and under reduced motion — the pin budget holds. Zero page or console errors in any run. Yellow audit (hue 30°–60°, S > 20%, V ≥ 0.10) over hero, method and CTA: **0 pixels** at every width; the trusted and paper sections are excluded from that audit because the logo plates and the sheet are legitimately coloured DOM, not field. First-load JS at the `load` event, production build, measured against `40550ed`: `/studio` **188 → 190KB** on the wire, `/` unchanged at 249–250KB | — |
| open | **Lighthouse throttled-mobile was not run** | Not installed, and adding it would breach the change request's no-new-dependencies rule. More to the point it would not mean anything here: this container renders WebGL through SwiftShader, which is already logged above as the reason the 60fps floor is unverified. A Lighthouse score from this environment would read as evidence and be worth nothing. Must be run on real hardware alongside the fps measurement | Installing Lighthouse and reporting the number anyway |
| 2026-07-30 | **"Particles multiply on reverse scroll" — real bug, wrong diagnosis.** Cause: `velTarget` stuck at −1 | Reported as the particle count growing until the hero was unreadable. Measured: the count never changes and every scroll-driven uniform returns exactly. What did not return was the velocity reading. `StudioTrusted` writes `setVelocity(scrollVelocity)` each frame while pinned; scroll up out of it quickly and the last value written is a large negative one with no further update coming. The shader scales point size by `1 + abs(uVel) * 1.5` and glow by `1 + abs(uVel) * 0.35`, so every dot rendered **2.5× its size, permanently** — 2.23× the lit pixels over the hero copy. Fixed at the source: velocity now lapses after 140ms unless something restates it, so it comes to rest on every scroll path rather than relying on each call site to remember a reset. Measured 2.23× → **0.97×** | Adding `setVelocity(0)` to each trigger's exit (fixes today's path, not tomorrow's) |
| 2026-07-30 | The prescribed fix for that bug did not apply | The brief asked for a fixed `PARTICLE_COUNT`, no re-instantiation, symmetric interpolation and proper disposal. The field already had all four — one `Points` object, one canvas, positions lerped from a single scroll value. Rebuilding to that spec would have changed nothing. Recorded because the symptom genuinely looked like accumulation | — |
| 2026-07-30 | Ribbon spin pinned to a fixed angle once the cloth has formed | Secondary hardening found while chasing the above, **not** the reported bug. `spin.rotation.y` was a bare time accumulator, so the torus's presentation at the hero — edge-on and narrow, or open and wide — depended only on how long you had been on the page. The funnel still whirls as it forms; after that the angle is fixed, which makes "returning to the hero reproduces the original formation" literally true. The cloth's life comes from the noise term and per-point wander, not from axial spin | Bounding the spin to a slow arc (tried at ±0.3rad — wide enough to swing the torus open by itself) |
| 2026-07-30 | Cursor repulsion radius 0.42 → 1.22 (~60px → ~180px), strength 0.19 → 0.38 | Reported as "hover does nothing". It was working — `uMouse` tracked and the strength ramped — but it was displacing a 60px disc, which is invisible on a 1440px field. Now measured at the cursor rather than across the frame: density in the inner 60px drops **7.6%**, tapering to 0 by 180px. Max displacement stays at half the radius, so the silhouette still reads. On `/` there is genuinely no repulsion — `reportScene.js` never had it | Raising strength further (0.55 punches a hole rather than opening a crater) |
| 2026-07-30 | §5.7 THE DELIVERABLE removed; its CTA moved into the hero | User request, one day after it was built. The primary CTA now appears above the fold and in the closing block, so it is not lost with the section. `StudioPaper.jsx` and its CSS deleted; the field's `uPlate` exclusion mask stays in the scene, unused but harmless, for whatever next wants to part the field around a solid object | Leaving the CTA only in the closing block |
| 2026-07-30 | Studio certificate gains the **page border and the seal** it was missing | The homepage's certificate (`reportScene.js`) draws both as line and mesh objects; the studio's `buildPage` was text rows only. Rebuilt as points, since the studio page has exactly one particle system and nothing else may draw: a double inset rule around the sheet, and a seal of three concentric rules with a guilloche of 44 radial ticks. Weights are deliberately light — at 3.2 the frame took so large a share of the fixed count that its edges rendered as solid bands and outshone the prose they framed | Adding a second scene or a DOM overlay for the frame |
| 2026-07-30 | Certificate text thinned: 15 rows at 0.9 spacing → 10 at 1.24, jitter 0.06/0.08 → 0.04/0.05 | It read as one illegible mass rather than lines on a page. The count is fixed, so the fix is threefold: fewer rows, tighter jitter so points sit **on** a line instead of in a fuzzy band around it, and the new frame and seal absorbing points that were crowding the prose. Page-beat camera pulled back 6.0 → 6.9 so the sheet no longer clips at the top of the frame | — |
| 2026-07-30 | The funnel is now the index section's beat — "What we are asked to value." | The tornado's job is to make that section arrive: it is the page's list of what the firm actually does and it was the one substantial section the field ignored. As the section crosses the viewport the cloth unwinds into the funnel and settles again on the way out, and holding any row — pointer or keyboard — makes the funnel turn harder and lift in brightness. **No pin**: the whole beat is a function of how far the section has crossed the frame, so it scrubs backwards exactly and the budget stays at two. Behaviour attaches to markup the server already rendered, so the rows keep working without JS | A third pinned section (over the §1 budget); a separate tornado section (the rows are the content the funnel is about) |
| 2026-07-30 | `.er-indexscrim` added — a left-weighted wash under the index rows | A point field over serif titles fails the §2.4 contrast floor. The wash is heaviest under the type column and clears by 78% of the width, so the copy is readable and the right of the frame stays open for the funnel | Dimming the field globally during the beat (costs the effect everywhere) |
