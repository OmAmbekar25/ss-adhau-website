# "Entropy Resolved" — Negantropy-class cinematic page

**Status: BUILT AS A CANDIDATE at `/studio`** (2026-07-29), on the user's
go-ahead. It does not replace `/` — the two directions are meant to be compared
first. Implementation: `src/app/studio/` (page + page-scoped CSS),
`src/components/studio/StudioClient.jsx` (loader, reveals, pin, ribbon states),
`src/lib/ribbonScene.js` (the silk ribbon).

Deviations from this brief, and why, are in `docs/creative-direction.md` §15 —
monochrome glow instead of a champagne tint, existing font stack instead of
Fraunces/Instrument Sans, a 46px headline floor instead of 72px, and the shared
Lenis instance. The 60fps floor is **unverified**: this container has no GPU.

**Precedence:** the user's own framing — where this brief and
`docs/creative-direction.md` conflict on hard constraints (performance budget
§2.3, accessibility floor §2.4, rejection list §14), **creative-direction.md
wins.**

## Open conflicts to resolve before any build

Flagged now so the decision is deliberate rather than discovered mid-build:

| This brief | Conflicts with | Note |
| --- | --- | --- |
| Monochrome palette `--bg #050505` / `--ink #E8E8E6`, no hue | §5 LOCKED palette (noir/linen/fog/**brass**, every value derived from the hero photograph) | The brief's own accent option (champagne `#C9A25E`) is within ~2% of the existing `--brass #C9A063`. Closer than it looks. |
| "No Tailwind for this page" | Whole site is Tailwind v4 | Scoped to one page, so survivable; it does mean two styling systems in one repo. |
| Persistent full-viewport WebGL for the entire scroll | §1 spectacle budget, §2.3 perf budget (already ~38KB gz over on the homepage) | Biggest one. A canvas alive for the whole page is a different bar from two lazy, section-scoped scenes. |
| "This page has NO photography" | The hero glass plate and `valuelady.jpg` are the two strongest real assets | Would retire the v3 hero, reversing the 2026-07-27 decision. |
| Numbered index rows, giant footer wordmark | §14 rejection list is narrower than this — worth re-reading before assuming a conflict | The brief pre-justifies the numbering ("the index IS a numbered catalogue"). |
| `[XX] years / [X,XXX]+ reports` | CLAUDE.md: never fabricate business content | Brief already says "real numbers only; cut any column that can't be filled truthfully" ✓ consistent. |

---

## 0. Brief

Single-page cinematic site: near-black monochrome canvas, one persistent
full-viewport WebGL particle structure (a slowly-revolving silk ribbon / vortex
of tens of thousands of fine luminous points) that lives BEHIND all content for
the entire scroll and changes state per section, driven by scroll. Typography is
the second protagonist: an ultra-elegant high-contrast serif (didone feel) at
enormous sizes, mixing roman and italic words inside the same headline, paired
with tiny letterspaced uppercase mono labels. Everything moves on a weighted
smooth scroll; text enters through line masks; hairline rules draw themselves;
the page reads as one continuous descent, not stacked sections.

Stack: Next.js (App Router) + Lenis + GSAP ScrollTrigger + Three.js
(points/shader) + self-hosted fonts via next/font. No Tailwind for this page —
hand-written CSS modules or a single global stylesheet with custom properties,
because the type tuning is too specific for utility classes.

## 1. Palette (exact tokens)

Monochrome. There is NO hue in the reference except what the particle glow
produces. One optional brand accent is permitted.

```css
--bg:          #050505;   /* page base — true near-black, no blue cast */
--bg-raise:    #0B0B0B;   /* cards / rows on hover */
--ink:         #E8E8E6;   /* primary text — warm silver, NOT pure white */
--ink-dim:     #8F8F8C;   /* secondary text */
--ink-faint:   #55554F;   /* metadata, footnotes */
--hairline:    rgba(255,255,255,0.10);  /* all rules and borders */
--hairline-hi: rgba(255,255,255,0.22);  /* rules on hover / active */
--glow:        #FFFFFF;   /* particle core color, used at low alpha */
```

- Brand-accent option: replace `--glow` highlights and the active-state hairline
  with champagne gold `#C9A25E`, used ONLY in the particle glow tint and the
  scroll-progress hairline. Nothing else gets color. If in doubt, ship pure
  monochrome — the reference is pure monochrome.
- Background must be FLAT `#050505`. No gradient orbs, no vignettes baked into
  CSS. All luminosity on screen comes from the WebGL canvas and text.

## 2. Typography (the page IS the type)

Two families + one utility. Self-host, subset, `display: swap`.

```
DISPLAY  — high-contrast serif with true italics. Use "Cormorant" (weights
           300 + 300 italic) or "Fraunces" (softness 0, opsz 144, wght 300
           + italic). The italic must be a true cursive italic with visible
           personality — the roman/italic mix inside one headline is the
           signature of this design.
BODY     — quiet grotesk, e.g. "Instrument Sans" or "Inter Tight" 400/500,
           used SMALL (15–17px) and sparingly. Body copy is rare on this page.
UTILITY  — monospace, e.g. "Space Mono" or "IBM Plex Mono" 400, ONLY
           uppercase, 10–12px, letter-spacing 0.18em–0.25em.
```

Scale (desktop, fluid via clamp):

```
display-hero   clamp(72px, 10.5vw, 176px)  lh 0.96  tracking -0.015em
display-xl     clamp(48px, 6.5vw, 104px)   lh 1.02
display-l      clamp(34px, 4vw, 60px)      lh 1.08
body           16px / 1.7
label (mono)   11px / 1  ls 0.22em  uppercase
```

Rules observed in the reference, to be reproduced:

1. Every major headline mixes roman and italic: 1–2 emphasized words per
   headline wrapped in `<em>` and set in the italic cut, same size. Example
   shape: `Order from <em>entropy</em>.`
2. Headlines are frequently CENTERED and span 70–90% of viewport width.
3. Mono labels appear as "eyebrows" ABOVE headlines and as scattered metadata at
   screen edges — coordinates-style fragments like `SEC. 01 — [SLOT]`,
   `EST. [YEAR]`, `SCROLL TO DESCEND`. These tiny satellites around huge type
   are a core part of the look.
4. Wordmark in nav and giant footer wordmark use the DISPLAY serif with a
   `®`-style superscript detail.

## 3. The WebGL scene (the protagonist)

A single `<canvas>` — `position: fixed; inset: 0; z-index: 0` — mounted once,
alive for the entire page. All DOM content sits above it (`z-index: 1`) with
`pointer-events` passing through the canvas.

### 3.1 The object

A "silk ribbon vortex": 25,000–45,000 points (desktop) arranged along a twisted
torus / spiral band — a wide ribbon wound 1.5 times around an invisible torus,
made entirely of particles.

- **Geometry:** sample points on a parametric band: torus radius R≈1.6, tube
  ellipse (wide/flat: a≈0.9, b≈0.18) so it reads as flowing SILK, not a donut.
  Add per-point jitter so edges feather into wisps.
- **Displacement:** 3D curl/simplex noise displaces each point along the band
  normal; noise scrolls slowly through time (`uTime * 0.05`) so the silk
  perpetually undulates. Amplitude ≈ 0.12–0.2 of tube size.
- **Rotation:** whole object revolves slowly and continuously — one full
  revolution ≈ 45–70 seconds, around a tilted axis (x ~ 0.4 rad, z ~ 0.15 rad).
  It NEVER stops, even when the user is idle. This ambient life is what makes
  the page feel alive.
- **Material:** custom ShaderMaterial. Round soft sprites (radial falloff in the
  fragment shader), size 1–2.5px (attenuated by depth), additive blending,
  depthWrite off. Color `--glow` at alpha 0.25–0.6 with brightness varying by
  noise value → the ribbon has bright filaments and dim gauze.
- **Mouse:** camera (or object) eases toward mouse offset — max ±0.06 rad —
  lerped at 0.03 per frame. Subtle. On touch devices, disable.

### 3.2 Scroll states (scrubbed, not stepped)

Drive uniforms + camera with one ScrollTrigger per section (`scrub: true`).
Between sections the object smoothly travels/morphs — the user should feel they
are descending PAST and THROUGH the structure:

```
HERO        centered slightly right of headline, scale 1.0, full brightness
MANIFESTO   drifts left & back (z −1.5), brightness 0.35, slower undulation
SPLIT/PROC  parks on the empty half of the split layout, scale 0.8
INDEX ROWS  drops low behind rows, brightness 0.25, near-horizontal tilt
CTA/FOOTER  rises again center, dispersion uniform ramps 0 → 1 so the ribbon
            loosens into a cloud of drifting motes behind the giant wordmark
```

Implement as target-state objects `{camX, camZ, rotX, bright, disperse}` per
section; a ScrollTrigger for each lerps global targets; a single rAF loop eases
actuals toward targets (lerp 0.06). Never snap.

### 3.3 Performance / fallback (non-negotiable)

- Cap DPR at 1.75. Particle count: desktop ≥1280px → 35k; tablet → 18k;
  mobile → 8k. One draw call.
- Lazy-mount the canvas after first paint (`requestIdleCallback` / dynamic
  import) — hero headline must be readable BEFORE the scene exists; the ribbon
  fades in over 1.2s once ready.
- `prefers-reduced-motion`: render ONE static frame of the ribbon (no rAF loop),
  all scroll states collapse to the hero state.
- If WebGL unavailable: skip canvas entirely; page must remain complete and
  beautiful as pure typography on black.
- Pause rAF when tab hidden (`visibilitychange`).

## 4. Global motion grammar

- **Smooth scroll:** Lenis, `lerp: 0.09`. Sync with ScrollTrigger via
  `gsap.ticker`. Native scroll position, back button, and Cmd+F must work.
- **Easing voice:** exactly two curves — entrances
  `cubic-bezier(0.16, 1, 0.3, 1)` (expo-like), micro/hover
  `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Text reveals:** every headline enters as line-masked spans
  (`overflow:hidden` per line, inner span from `yPercent:115` to 0), duration
  0.9s, stagger 80ms, triggered at 78% viewport, fires once. Mono labels
  fade+track-in (letter-spacing from 0.35em → 0.22em, opacity 0→1, 0.7s) — this
  tracking-tighten on labels is a distinctive micro-move; reproduce it.
- **Hairlines:** every rule animates `scaleX` 0→1 (transform-origin left), 1.1s,
  as it enters viewport.
- **Paragraph/body:** simple fade + 24px rise, 0.7s.
- **Nav:** fades in last during hero load. On scroll down it slides away
  (−100%); on any scroll up it returns. Background stays transparent — a 1px
  bottom hairline appears once scrolled.
- **Link hover:** roman → italic swap of the same word (the serif's italic cut),
  OR underline draw left→right, 0.35s. Italic swap for display-serif links (nav,
  index rows), underline for mono links.
- **NO:** typewriter effects, counters ticking up, parallax on decorative
  shapes, letter-by-letter body reveals, cursor trails, auto-playing marquees.
  (Rejection list in creative-direction.md §14 applies.)

## 5. Page structure & per-section spec

One page, ~7 beats. `main { position: relative; z-index: 1 }` above the fixed
canvas. All containers max-width 1440px, 12-col grid, 24px gutters, 8px spacing
scale. Generous vertical rhythm: 160–256px between sections.

### 5.1 LOADER (0 → ~1.2s, once per session)

Minimal: black screen, centered mono label counting `00 — 100` (small, NOT a
giant number), a 1px hairline growing beneath it. On complete, the loader wipes
upward (`clip-path` inset animation, 0.8s expo) revealing the hero. Skip
entirely on repeat visits (sessionStorage) and under reduced-motion. Do not fake
extra wait time — cap at real asset readiness, max 1.5s.

### 5.2 HERO (100svh)

All centered column:

- Top nav row: left — wordmark `[S S ADHAU]®` in display serif ~20px; right — 4
  mono links: `[SERVICES] [LOCATIONS] [ABOUT] [CONTACT]`.
- Eyebrow mono label: `[REGISTERED VALUERS — CHARTERED ENGINEERS]`.
- Display-hero headline, 2 lines, mixed italic: `Every decision begins` /
  `with <em>the right value</em>.`
- Under it: one short body line, `--ink-dim`, max 52ch: `[Government-approved
  valuation reports that survive banks, courts and regulators — across Central
  India.]`
- Bottom edge, three satellites in mono `--ink-faint`: left
  `[EST. YYYY — NAGPUR]`, center `SCROLL TO DESCEND` with a 24px vertical
  hairline that pulses (opacity 0.3→1 loop, 2.4s), right
  `[IBBI · IT DEPT. REGISTERED]`.
- Ribbon: hero state — big, centered slightly right-of-center, its wisps passing
  visually BEHIND the headline.

Load timeline (after loader wipe):

```
0.00s  ribbon fades in (1.2s)
0.15s  eyebrow tracks in
0.30s  headline line 1 mask-reveals (0.9s)
0.38s  headline line 2
0.55s  body line fades up
0.70s  satellites + nav fade in (stagger 90ms)
```

### 5.3 MANIFESTO (the "voice" beat)

Full-viewport, single enormous italic-heavy statement, centered, display-xl,
`--ink` with 2–3 words in `--ink-dim` for cadence: `["A valuation is not an
opinion. It is a <em>defensible position</em> — measured on site, argued in
numbers, signed with a name."]` Lines mask-reveal sequentially as the section
scrubs (each line tied to scroll progress, not time — the user "reads by
scrolling"). Ribbon: dim left-drift state. Mono label floats top-left:
`SEC. 01 — [PRINCIPLE]`.

### 5.4 SPLIT / PROCESS (the ONE pinned beat)

Two-column: left column pins (desktop only) with `SEC. 02 — [METHOD]` label +
display-l headline `The method behind <em>the number</em>.`; right column: 3
steps that scrub past — each step = mono index (`01`), serif title, short body.
As each step becomes active: its index brightens to `--ink`, previous dims to
`--ink-faint`, a hairline progress bar fills. Mobile: unpinned, stacked, no
progress bar. Content slots: `[01 Purpose & documents / 02 Site inspection /
03 Report & defence]` — reuse copy from the earlier build.

### 5.5 INDEX ROWS (services as an editorial index)

Full-width stacked rows, hairline-separated. Each row: `01` mono index — serif
title (display-l, roman) — right-aligned mono tag. Hover: row background
`--bg-raise`, title swaps to italic cut, hairlines above/below go
`--hairline-hi`, 0.35s. Rows reveal with 70ms stagger. Slots: `[Bank & mortgage
valuations / Court & litigation / Income tax & capital gains / IBBI & insolvency
/ Structural consulting]`. Numbered markers are justified here: the index IS a
numbered catalogue.

### 5.6 PROOF (quiet, factual)

Three columns, mono labels over display-l figures: `[XX] years` /
`[X,XXX]+ reports` / `[N] institutions` — TODO(copy): real numbers only; cut any
column that can't be filled truthfully. No count-up animation — figures
mask-reveal like headlines. Under them one body line naming names: `[Empanelled
with Union Bank of India, Central Bank of India, Bank of India, Indian Bank,
PNB, Canara Bank, UCO Bank.]`

### 5.7 CTA + FOOTER (the dissolution)

- CTA: centered display-xl `Get a number that <em>survives scrutiny</em>.`
  - one button: mono uppercase `REQUEST A VALUATION →`, 1px hairline border,
    hover: border brightens + arrow translates 6px.
- As the footer enters, the ribbon runs its dispersion state — the silk loosens
  into drifting motes behind the giant wordmark. This is the page's closing
  image: structure dissolving back into particles.
- Footer: a GIANT wordmark `[S S ADHAU]` in display serif sized to ~96% of
  viewport width, baseline near the bottom edge, `--ink` at 0.92 opacity, rising
  60px into place on entry. Above it: three mono columns (nav / contact /
  legal). Below: single mono line
  `© [YEAR] [NAME] — [REGISTRATIONS]`.

## 6. Quality floor (ship silently, verify before done)

- Keyboard: visible focus (1px `--hairline-hi` outline, 3px offset) on every
  interactive element; nav reachable; no focus traps from the loader.
- Reduced motion: no Lenis, no pin, no scrubbing, static ribbon frame, all
  content present — the page must still look FINISHED, not disabled.
- Contrast: `--ink` on `--bg` ≈ 15:1 ✓; `--ink-dim` ≈ 6.4:1 ✓; never set text
  below `--ink-faint`, and `--ink-faint` only at mono-label sizes for decorative
  metadata.
- Headline text in DOM & indexable pre-JS. Semantic landmarks + h1→h2 order.
- Budgets (from creative-direction.md §2.3): LCP < 2.0s mid-tier Android,
  CLS < 0.05, first-load JS ≤ 250KB gz excluding the lazily-loaded 3D chunk;
  animate only transform/opacity in DOM-land; 60fps or the effect is cut, not
  "optimised later".
- Touch targets ≥ 44px; no hover-only information (row tags visible always).

## 7. Build order (in this sequence)

1. Static page, all seven beats, final copy slots, zero JS — must already look
   strong as pure typography on black.
2. Fonts + spacing pass; screenshot review at 390px / 768px / 1440px.
3. Lenis + text reveal system + hairline draws.
4. The pinned process beat, with mobile fallback.
5. WebGL ribbon: ambient state only (hero). Verify 60fps + DPR cap + lazy-mount
   + reduced-motion frame.
6. Scroll-state choreography for the ribbon across all beats.
7. Loader, nav hide/show, hover micro-interactions.
8. Floor audit (§6) + Lighthouse on throttled mobile; fix before polish.
9. Append to `docs/creative-direction.md` §15 Decisions Log: "Signature element
   = persistent particle-silk ribbon with scroll-driven states; monochrome
   palette; roman/italic display mixing" + date + reason.

## 8. What NOT to do (drift guards)

- Do not add color beyond the single optional accent rule in §1.
- Do not add more sections; do not add cards, bento grids, or testimonial
  triplets.
- Do not let the ribbon become a foreground toy (no click interactions on it, no
  cursor-attached particles).
- Do not animate the hero headline after its first reveal.
- Do not use stock photography anywhere; this page has NO photography.
- Do not ship a fake loader delay.
- If any instruction here conflicts with performance or accessibility floors,
  the floor wins and the effect is simplified — note it in the decisions log
  instead of silently keeping it.

## Appendix — what was observed in the reference recording

Frame-by-frame review of a ~38s capture: library card expands full-screen into
the template; brief minimal loader; hero = huge centered high-contrast serif
with italic-mixed words over a slowly revolving monochrome particle ribbon on
true black; tiny letterspaced mono satellites at screen corners; weighted smooth
scroll; manifesto-style giant italic statement; split section with pinned label
column; hairline-separated numbered index rows with italic-swap hovers; quiet
stat row; closing CTA; footer with giant serif wordmark while the particle
structure loosens/disperses. Ambient ribbon motion never stops; scroll scrubs
its position/brightness between beats. This is a from-observation recreation
with original code and the client's own content — not the vendor's source.
