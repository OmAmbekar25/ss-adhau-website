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
