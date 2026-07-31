import * as THREE from "three";

/**
 * One field, the whole page.
 *
 * Every particle on the studio page belongs to a single system. It arrives
 * as a tornado, settles into the silk ribbon, and — when the visitor
 * reaches the method section — the same points become the surveyed site,
 * the ordered analysis, and finally the signed page, before returning to
 * the ribbon and dispersing at the close.
 *
 * This replaces the previous arrangement of two independent scenes handing
 * over to each other. Nothing is created or destroyed between forms: point
 * i occupies position i in every one of them.
 *
 *   s = 0  tornado      the arrival
 *   s = 1  ribbon       the ambient state, for most of the page
 *   s = 2  site         parcel and massing
 *   s = 3  lattice      ordered readings
 *   s = 4  page         the signed report
 *
 * API — all pure functions of what the page tells it:
 *   setStory(s)      0..4, eased internally
 *   setDisperse(v)   0..1, the closing dissolution
 *   setPointer(x, y) normalised −1..1
 *   resume() / pause() / renderOnce() / dispose()
 */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (x) => x * x * (3 - 2 * x);

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Everything is authored in "stage units" — the ribbon's own scale. The
   survey geometry was designed around a 32-unit parcel, so it is divided
   down to sit in the same room as the cloth. */
const K = 1 / 6.5;
const RIB_R = 1.6;
const RIB_A = 1.05;
const RIB_B = 0.18;
const WRAPS = 1.5;

const PARCEL = { x0: -16, x1: 16, z0: -12, z1: 12 };
const BLOCK_A = { x0: -10, x1: 4, y0: 0, y1: 13.5, z0: -6, z1: 4 };
const BLOCK_B = { x0: 4, x1: 12, y0: 0, y1: 7, z0: 0, z1: 7 };
const SHEET = { hw: 11, hh: 15 };
const MARGIN = 8.6;
const SEAL = { x: 5.8, y: -12.2, r: 2.5 };

/* survey geometry sits on the ground plane; the ribbon is centred on the
   origin, so the structural forms are lifted to share its centre */
const LIFT = -5.5;
const put = (out, i, x, y, z) => {
  out[i * 3] = x * K;
  out[i * 3 + 1] = (y + LIFT) * K;
  out[i * 3 + 2] = z * K;
};

/* ---------------------------------------------------------------- forms */

/* The ribbon: threads, not scatter — a warp of continuous strands is what
   makes the eye read cloth rather than dust. */
function buildRibbon(n, pos, nrm, edge, rand, threads, per) {
  const r = rng(1201);
  let i = 0;
  for (let t = 0; t < threads && i < n; t++) {
    const vBase = (t / (threads - 1)) * 2 - 1;
    const lum = Math.pow(r(), 1.7);
    const wBase = (r() * 2 - 1) * 0.7;
    for (let k = 0; k < per && i < n; k++, i++) {
      const u = (k + r() * 0.4) / per;
      const th = u * Math.PI * 2 * WRAPS;
      const twist = th * 1.35;
      const ca = Math.cos(twist);
      const sa = Math.sin(twist);
      const v = vBase + (r() - 0.5) * 0.012;
      const across = v * RIB_A;
      const thru = (wBase + (r() - 0.5) * 0.5) * RIB_B;
      const inP = across * ca - thru * sa;
      const outP = across * sa + thru * ca;
      const ox = Math.cos(th);
      const oy = Math.sin(th);
      pos[i * 3] = ox * RIB_R + ox * inP;
      pos[i * 3 + 1] = oy * RIB_R + oy * inP;
      pos[i * 3 + 2] = outP;
      nrm[i * 3] = ox * -sa;
      nrm[i * 3 + 1] = oy * -sa;
      nrm[i * 3 + 2] = ca;
      rand[i] = lum;
      edge[i] = 1 - Math.pow(Math.abs(v), 2.6);
    }
  }
}

/* The arrival: the same threads wound up a widening funnel. */
function buildTornado(n, out, threads, per) {
  const r = rng(667);
  let i = 0;
  for (let t = 0; t < threads && i < n; t++) {
    for (let k = 0; k < per && i < n; k++, i++) {
      const h = k / per;
      const rad = 0.22 + Math.pow(h, 1.55) * 2.75;
      const a = t * 0.37 + h * 7.6;
      out[i * 3] = Math.cos(a) * rad + (r() - 0.5) * 0.07;
      out[i * 3 + 1] = -2.7 + h * 5.5 + (r() - 0.5) * 0.09;
      out[i * 3 + 2] = Math.sin(a) * rad + (r() - 0.5) * 0.07;
    }
  }
}

/* Weighted segment sampler — the site's edges and the page's text lines
   fall out of the same few lines of code. */
function fillSegments(n, out, segs) {
  const r = rng(7717);
  let total = 0;
  for (const s of segs) total += s.w;
  let i = 0;
  let acc = 0;
  for (let si = 0; si < segs.length; si++) {
    const s = segs[si];
    acc += s.w;
    const upTo = si === segs.length - 1 ? n : Math.round((acc / total) * n);
    for (; i < upTo; i++) {
      const t = r();
      const j = s.j || 0;
      put(
        out,
        i,
        lerp(s.x0, s.x1, t) + (r() - 0.5) * j,
        lerp(s.y0, s.y1, t) + (r() - 0.5) * (s.jy ?? j),
        lerp(s.z0, s.z1, t) + (r() - 0.5) * j
      );
    }
  }
}
const seg = (x0, y0, z0, x1, y1, z1, w = 1, j = 0, jy) => ({
  x0, y0, z0, x1, y1, z1, w, j, jy,
});

function boxEdges(b, w) {
  const { x0, x1, y0, y1, z0, z1 } = b;
  const out = [];
  for (const y of [y0, y1]) for (const z of [z0, z1]) out.push(seg(x0, y, z, x1, y, z, w, 0.1));
  for (const y of [y0, y1]) for (const x of [x0, x1]) out.push(seg(x, y, z0, x, y, z1, w, 0.1));
  for (const x of [x0, x1]) for (const z of [z0, z1]) out.push(seg(x, y0, z, x, y1, z, w, 0.1));
  return out;
}
function boxFaces(b, w, lines) {
  const { x0, x1, y0, y1, z0, z1 } = b;
  const out = [];
  for (let i = 1; i < lines; i++) {
    const y = lerp(y0, y1, i / lines);
    out.push(seg(x0, y, z0, x1, y, z0, w, 0.12));
    out.push(seg(x0, y, z1, x1, y, z1, w, 0.12));
    out.push(seg(x0, y, z0, x0, y, z1, w, 0.12));
    out.push(seg(x1, y, z0, x1, y, z1, w, 0.12));
  }
  return out;
}

function buildSite(n, out) {
  const { x0, x1, z0, z1 } = PARCEL;
  const segs = [
    seg(x0, 0, z0, x1, 0, z0, 3.4, 0.14),
    seg(x0, 0, z1, x1, 0, z1, 3.4, 0.14),
    seg(x0, 0, z0, x0, 0, z1, 2.8, 0.14),
    seg(x1, 0, z0, x1, 0, z1, 2.8, 0.14),
  ];
  for (let i = 0; i < 5; i++) {
    const z = lerp(z0 + 2, z1 - 2, i / 4);
    segs.push(seg(x0 + 2, 0, z, x1 - 2, 0, z, 0.7, 0.6, 0.1));
  }
  segs.push(...boxEdges(BLOCK_A, 11), ...boxFaces(BLOCK_A, 0.7, 5));
  segs.push(...boxEdges(BLOCK_B, 6), ...boxFaces(BLOCK_B, 0.5, 4));
  fillSegments(n, out, segs);
}

/* P-3.1 — the datum.
   Step 01 is "nothing is measured yet; the first reference line is drawn".
   So the field converges out of the right into a single thin horizontal
   line, left of centre, with brighter clusters at even intervals for the
   ticks. Its silhouette shares nothing with any other formation. */
function buildDatum(n, out) {
  const r = rng(3301);
  const TICKS = 11;
  const X0 = -13;
  const X1 = 9;
  for (let i = 0; i < n; i++) {
    const t = r();
    if (t < 0.24) {
      /* still drifting in from the right, not yet on the line */
      const d = r();
      put(
        out, i,
        X1 + d * d * 26,
        (r() - 0.5) * 7 * d,
        (r() - 0.5) * 5 * d
      );
      continue;
    }
    const u = r();
    /* the ticks: short verticals at even intervals, denser than the line */
    if (t > 0.72) {
      const k = Math.floor(u * TICKS);
      const x = X0 + ((X1 - X0) * k) / (TICKS - 1);
      put(
        out, i,
        x + (r() - 0.5) * 0.22,
        (r() - 0.5) * 1.5,
        (r() - 0.5) * 0.16
      );
      continue;
    }
    /* the line itself — tight, so it reads as ruled rather than sprayed */
    put(
      out, i,
      X0 + u * (X1 - X0),
      (r() - 0.5) * 0.16,
      (r() - 0.5) * 0.14
    );
  }
}

/* P-3.2 — the comparison.
   Step 03 read as smeared noise because five beats were spread over four
   keyframe gaps, so "Analysis" sat exactly halfway between two unrelated
   forms and rendered as a 50/50 blend of both. The spine now has a
   keyframe of its own here: an isometric field of dot-built columns at
   varied heights — a bar chart as terrain, legible as "things being
   compared" the moment it arrives. */
function buildColumns(n, out) {
  const r = rng(8123);
  const COLS = 5;
  const ROWS = 3;
  const heights = [];
  for (let k = 0; k < COLS * ROWS; k++) heights.push(4 + Math.pow(r(), 0.8) * 16);
  for (let i = 0; i < n; i++) {
    const k = i % (COLS * ROWS);
    const cx = k % COLS;
    const cz = Math.floor(k / COLS);
    const x = -13 + (26 * cx) / (COLS - 1);
    const z = -8 + (16 * cz) / (ROWS - 1);
    const h = heights[k];
    const up = r();
    /* tight jitter: the edges have to stay sharp or it reads as fog */
    const hw = 1.5;
    const face = r();
    let ox;
    let oz;
    if (face < 0.5) {
      ox = (r() - 0.5) * 2 * hw;
      oz = (r() < 0.5 ? -1 : 1) * hw;
    } else {
      ox = (r() < 0.5 ? -1 : 1) * hw;
      oz = (r() - 0.5) * 2 * hw;
    }
    put(out, i, x + ox, up * h, z + oz);
  }
}

/* The certificate.
 *
 * It used to be text rows only, and at this point count they packed into
 * an illegible block — the rows read as one mass rather than as lines on a
 * page. Three things fix that together: the rows are fewer and set further
 * apart, their jitter is tighter so points sit ON a line instead of in a
 * fuzzy band around it, and the frame and seal below take a real share of
 * the field. The count is fixed, so every point the border and seal claim
 * is a point no longer crowding the prose.
 *
 * The frame and the seal are the two things the homepage's certificate has
 * and this one did not. Built here as points, since this page has exactly
 * one particle system and nothing else is allowed to draw. */
function buildPage(n, out) {
  const r = rng(90210);
  const segs = [];
  const line = (y, x0, x1, w, jy = 0.05) =>
    segs.push(seg(x0, y, 0, x1, y, 0, w, 0.04, jy));
  const vline = (x, y0, y1, w) =>
    segs.push(seg(x, y0, 0, x, y1, 0, w, 0.04, 0.04));
  /* an inset rectangle, drawn as four ruled edges */
  const rect = (hw, hh, w) => {
    line(hh, -hw, hw, w, 0.03);
    line(-hh, -hw, hw, w, 0.03);
    vline(-hw, -hh, hh, w);
    vline(hw, -hh, hh, w);
  };
  /* a circle as chords — the field has no curves, only segments */
  const ring = (cx, cy, rad, w, steps = 72) => {
    for (let k = 0; k < steps; k++) {
      const a0 = (k / steps) * Math.PI * 2;
      const a1 = ((k + 1) / steps) * Math.PI * 2;
      segs.push(
        seg(
          cx + Math.cos(a0) * rad, cy + Math.sin(a0) * rad, 0,
          cx + Math.cos(a1) * rad, cy + Math.sin(a1) * rad, 0,
          w / steps, 0.03, 0.03
        )
      );
    }
  };

  /* ---- the page border: a double rule, inset from the sheet edge ---- */
  /* Light weights on purpose. The frame is a rule, not a wall — at 3.2 it
     took so large a share of the fixed count that the edges rendered as
     solid bands and outshone the prose they were framing. */
  rect(SHEET.hw - 0.5, SHEET.hh - 0.6, 1.15);
  rect(SHEET.hw - 1.05, SHEET.hh - 1.15, 0.42);

  /* ---- letterhead ---- */
  line(12.3, -MARGIN, 2.4, 2.6, 0.18);
  line(10.7, -MARGIN, -1.2, 2.2, 0.14);
  line(9.6, -MARGIN, MARGIN, 1.2, 0.03); // rule under the letterhead

  /* ---- body: fewer rows, set further apart, so they read as lines ---- */
  for (let k = 0; k < 10; k++) {
    const y = 7.4 - k * 1.24;
    line(y, -MARGIN, -MARGIN + 2 * MARGIN * (0.46 + r() * 0.54), 0.62);
  }

  /* ---- the schedule of values — three columns ---- */
  for (let k = 0; k < 3; k++) {
    const y = -7.8 - k * 1.05;
    line(y, -MARGIN, -3.4, 0.7);
    line(y, -2.6, 1.4, 0.7);
    line(y, 2.4, 6.2, 0.7);
  }

  /* ---- signature, left of the seal ---- */
  line(-13.2, -MARGIN, -2.6, 1.0, 0.08);

  /* ---- the seal: concentric rules with a guilloche of radial ticks ---- */
  ring(SEAL.x, SEAL.y, SEAL.r, 1.5);
  ring(SEAL.x, SEAL.y, SEAL.r * 0.9, 0.85);
  ring(SEAL.x, SEAL.y, SEAL.r * 0.6, 0.6);
  for (let k = 0; k < 44; k++) {
    const a = (k / 44) * Math.PI * 2;
    const c = Math.cos(a);
    const sn = Math.sin(a);
    segs.push(
      seg(
        SEAL.x + c * SEAL.r * 0.62, SEAL.y + sn * SEAL.r * 0.62, 0,
        SEAL.x + c * SEAL.r * 0.88, SEAL.y + sn * SEAL.r * 0.88, 0,
        0.035, 0.02, 0.02
      )
    );
  }

  fillSegments(n, out, segs);
}

/* --------------------------------------------------------- the band */
/* The trusted-by beat's form: one loose horizontal band running the length
   of the logo strip, with a denser knot behind each card. The same points
   as everything else — the ribbon condenses into this and re-forms after.

   `anchors` are the card centres in world x, measured from the DOM. They
   arrive on mount and on resize, never per frame; the strip's travel is a
   single offset applied at blend time, so a knot stays behind its own card
   for the whole traverse without rebuilding anything. */

const KNOT = 0.72; // share of the field pulled into the card knots

function buildBand(n, B, anchors, knotR, centreY) {
  const r = rng(5150);
  const a = anchors.length ? anchors : [0];
  /* The gauze spans the strip itself, not the viewport: the band has to be
     as long as the thing it sits behind, or it slides out from under the
     cards as soon as the strip starts travelling. */
  let lo = a[0];
  let hi = a[0];
  for (let i = 0; i < a.length; i++) {
    if (a[i] < lo) lo = a[i];
    if (a[i] > hi) hi = a[i];
  }
  const pad = Math.max(2, knotR * 3);
  const mid = (lo + hi) / 2;
  const span = hi - lo + pad * 2;
  const halfH = Math.max(0.55, knotR * 0.75);

  for (let i = 0; i < n; i++) {
    const k = i * 3;
    if (r() < KNOT) {
      /* a knot: elliptical, wider than tall, so it reads as a card-shaped
         glow rather than a ball floating behind a rectangle. Density falls
         off from the centre — sqrt() would give a flat disc with an edge —
         and it reaches past the plate on every side, because a knot that
         fits inside an opaque card is a knot nobody ever sees. */
      const c = a[i % a.length];
      const th = r() * Math.PI * 2;
      const rad = Math.pow(r(), 1.25);
      B[k] = c + Math.cos(th) * rad * knotR * 1.4;
      B[k + 1] = centreY + Math.sin(th) * rad * knotR * 1.15;
      B[k + 2] = (r() - 0.5) * knotR;
    } else {
      /* the gauze between them: even along the strip, because the cards
         are; thinning vertically, so the band has no hard top or bottom */
      B[k] = mid + (r() - 0.5) * span;
      B[k + 1] = centreY + (r() + r() - 1) * halfH;
      B[k + 2] = (r() - 0.5) * 0.7;
    }
  }
}

/* ------------------------------------------------------------- shaders */

const VERT = /* glsl */ `
uniform float uTime, uSize, uAmp, uDisperse, uDpr, uSilk;
uniform float uVel, uVelSlow, uScatter;
uniform float uCap;
uniform vec2 uMouse;
uniform float uMouseStrength, uRepelRadius;
uniform vec4 uPlate;            // xy centre, zw half-extent, in local space
uniform float uPlateFeather, uPlatePush;
/* WI-5: up to four text blocks the field must stay quiet behind. Same
   rectangle-SDF as the plate above, but these do not move a single point —
   they only dim and shrink the ones that land inside. Displacing points
   away from type would leave a hole shaped like the paragraph; dimming
   them keeps the field continuous and simply calms the air the type sits
   in. */
uniform vec4 uText[4];
uniform int uTextCount;
uniform float uTextFeather;
varying float vQuiet;
attribute float aRand, aEdge, aDrag, aStiff;
attribute vec3 aNormalDir, aDrift;
varying float vGlow, vTone;

vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 p = position;
  float n = snoise(p * 7.0 + vec3(0.0, 0.0, uTime * 0.03));
  /* only the cloth undulates — a surveyed building holds still */
  p += aNormalDir * n * uAmp * uSilk;
  p += aDrift * uDisperse * (0.6 + aRand * 1.6);

  /* Velocity coupling: each dot lags by its own aDrag, and settles at its
     own rate — aStiff mixes between the fast and slow smoothed velocity,
     so they neither smear nor return in unison. */
  float lag = mix(uVel, uVelSlow, aStiff) * aDrag * uScatter;
  p.x -= lag;
  p.y += sin(aRand * 97.0) * abs(uVel) * 0.06 * aDrag * uScatter;

  /* §3.5 cursor repulsion — a soft crater, not a hole. Quadratic falloff
     so the push is strong only near the pointer and feathers to nothing
     at the radius; aDrag is reused so heavy dots move less than light
     ones. Displacement is capped well under the radius: the cursor
     disturbs the structure, it must never destroy it. */
  vec2 d = p.xy - uMouse;
  float r = length(d);
  if (r < uRepelRadius && r > 0.0001) {
    float f = smoothstep(uRepelRadius, 0.0, r);
    /* Hard cap at half the radius. Unclamped this works out to 0.498x
       (strength 0.38 x aDrag's 1.6 ceiling against a 1.22 radius) — inside
       the limit, but only by arithmetic coincidence, and any future retune
       of either term would silently punch holes through the tornado and
       the certificate. Capping the displacement rather than the radius
       keeps the reach while making the invariant structural. */
    float push = min(f * f * uMouseStrength * aDrag, uRepelRadius * 0.5);
    p.xy += normalize(d) * push;
  }

  /* The sheet's exclusion mask. A signed distance to the rectangle, and a
     push along its gradient — points inside travel to the nearest edge,
     points within the feather ease outward, everything further away is
     untouched. Static: it is where the paper is, so the field parts around
     the document instead of shining through it. */
  if (uPlatePush > 0.0001) {
    vec2 pd = p.xy - uPlate.xy;
    vec2 sg = sign(pd);
    vec2 q = abs(pd) - uPlate.zw;
    vec2 w = max(q, 0.0);
    float outside = length(w);
    float sd = outside + min(max(q.x, q.y), 0.0);
    /* Each point keeps its own feather distance. A single shared one would
       stack every displaced dot at exactly the same offset and draw a hard
       wall around the sheet; spread across a range, the same push reads as
       the field thinning out toward the paper. */
    float fe = uPlateFeather * (0.35 + aRand * 1.5);
    if (sd < fe) {
      vec2 g = outside > 0.0001
        ? sg * (w / outside)
        : (q.x > q.y ? vec2(sg.x, 0.0) : vec2(0.0, sg.y));
      p.xy += g * (fe - sd) * uPlatePush;
    }
  }

  /* how far inside a text block this point is: 0 clear of them all, 1
     well within one. Feathered, so there is no visible boundary. */
  vQuiet = 0.0;
  for (int i = 0; i < 4; i++) {
    if (i >= uTextCount) break;
    vec2 q = abs(p.xy - uText[i].xy) - uText[i].zw;
    float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    vQuiet = max(vQuiet, 1.0 - smoothstep(0.0, uTextFeather, sd));
  }

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  /* the sprite stretches with speed — motion blur without a post pass */
  gl_PointSize = uSize * uDpr * (0.62 + 0.85 * aRand)
    * (1.0 + abs(uVel) * 1.5) * (6.0 / max(0.5, -mv.z))
    * mix(1.0, 0.6, vQuiet);

  float lum = 0.12 + 1.5 * aRand;
  float weave = 0.35 + 0.65 * smoothstep(-0.8, 0.85, n);
  vGlow = lum * mix(0.9, weave, uSilk) * mix(1.0, aEdge, uSilk) * (1.0 + abs(uVel) * 0.35);
  /* the per-section cap, then the text blocks on top of it */
  vGlow *= uCap * mix(1.0, 0.35, vQuiet);
  vTone = clamp(aRand * 1.5 + n * 0.25, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColorCore, uColorBase, uColorFaint;
uniform vec3 uHue;
uniform float uTint, uBright;
varying float vGlow, vTone, vQuiet;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float halo = smoothstep(0.5, 0.06, d);
  halo *= halo;
  float core = smoothstep(0.17, 0.0, d);

  /* Silver, three stops, keyed on vTone — which already tracks a dot's own
     luminance (it is built from aRand and the same noise that drives vGlow).
     So the gauze reads faint, the body reads mid, and only the brightest
     filaments reach the near-white core. Branchless: two clamped mixes. */
  vec3 tint = mix(uColorFaint, uColorBase, clamp(vTone * 2.0, 0.0, 1.0));
  tint = mix(tint, uColorCore, clamp(vTone * 2.0 - 1.0, 0.0, 1.0));

  /* The index section's hue.
     Luminance-preserving: the hue is rescaled to the grey it replaces, so
     tinting shifts chroma and never brightness — the silver ramp survives
     underneath. Weighted DOWN as vTone rises, so the gauze and body carry
     most of the colour and the brightest filaments stay near-white. The
     field has to read as grey dust catching coloured light, not as dyed
     confetti. uTint rests at 0 everywhere but that one section. */
  if (uTint > 0.001) {
    const vec3 W = vec3(0.299, 0.587, 0.114);
    float lum = dot(tint, W);
    vec3 hued = uHue * (lum / max(0.0001, dot(uHue, W)));
    tint = mix(tint, hued, uTint * (1.0 - 0.72 * clamp(vTone, 0.0, 1.0)));
  }

  gl_FragColor = vec4(tint, (halo + core * 0.55) * vGlow * uBright);
}
`;

/* ------------------------------------------------------------- the scene */

export function createStudioScene(container, opts = {}) {
  const count = opts.count || 40000;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    if (!renderer.getContext()) return null;
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  /* WI-6 — transparent, so the page's own background levels show through.
     The canvas is fixed across the whole viewport, so an opaque clear
     colour here WAS the site's background and no CSS level could ever be
     seen. Additive blending still composites correctly over it. */
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  container.appendChild(renderer.domElement);

  const threads = Math.max(48, Math.round(Math.sqrt(count) * 1.35));
  const per = Math.max(2, Math.floor(count / threads));

  const RIBBON = new Float32Array(count * 3);
  const TORNADO = new Float32Array(count * 3);
  const SITE = new Float32Array(count * 3);
  const DATUM = new Float32Array(count * 3);
  const COLUMNS = new Float32Array(count * 3);
  const PAGE = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const drift = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const edge = new Float32Array(count);
  const dragA = new Float32Array(count);
  const stiffA = new Float32Array(count);
  const BAND = new Float32Array(count * 3);

  buildRibbon(count, RIBBON, nrm, edge, rand, threads, per);
  buildTornado(count, TORNADO, threads, per);
  buildSite(count, SITE);
  buildDatum(count, DATUM);
  buildColumns(count, COLUMNS);
  buildPage(count, PAGE);
  buildBand(count, BAND, [], 0.9, 0); // placeholder until the cards are measured

  /* Every form is centred on its own mass. The survey geometry was
     authored on a ground plane and the report as a standing sheet, so a
     single shared offset put one of them right and the other low — the
     page ended up below the camera and read as sheared. Centring each
     form individually means the camera keyframes describe the view, not a
     correction for where the geometry happened to be built. */
  const recentre = (buf) => {
    let x = 0, y = 0, z = 0;
    for (let i = 0; i < count; i++) {
      x += buf[i * 3]; y += buf[i * 3 + 1]; z += buf[i * 3 + 2];
    }
    x /= count; y /= count; z /= count;
    for (let i = 0; i < count; i++) {
      buf[i * 3] -= x; buf[i * 3 + 1] -= y; buf[i * 3 + 2] -= z;
    }
  };
  [RIBBON, TORNADO, SITE, DATUM, COLUMNS, PAGE].forEach(recentre);

  const r = rng(31337);
  const wPhase = new Float32Array(count);
  const wRate = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const dl = r() * Math.PI * 2;
    const dz = r() * 2 - 1;
    const dr = Math.sqrt(Math.max(0, 1 - dz * dz));
    drift[i * 3] = Math.cos(dl) * dr;
    drift[i * 3 + 1] = Math.sin(dl) * dr * 0.7 + 0.25;
    drift[i * 3 + 2] = dz;
    wPhase[i] = r() * Math.PI * 2;
    wRate[i] = 0.075 + r() * 0.14;
    dragA[i] = 0.4 + r() * 1.2;   // how far this dot trails the motion
    stiffA[i] = r();              // how slowly it settles back
  }

  /* the ordered spine the whole page travels along */
  /* Six keyframes, so the journey's five beats each land ON one instead of
     between two — see StudioJourney. The old spine had five beats spread
     across four gaps, which is why "Analysis" rendered as a blend of the
     site and the lattice rather than as anything. */
  const KEY = [TORNADO, RIBBON, DATUM, SITE, COLUMNS, PAGE];
  const SILK = [0.55, 1, 0.12, 0, 0, 0]; // how cloth-like each form behaves

  const base = new Float32Array(count * 3);
  base.set(TORNADO);
  const positions = new Float32Array(count * 3);
  positions.set(TORNADO);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aNormalDir", new THREE.BufferAttribute(nrm, 3));
  geo.setAttribute("aDrift", new THREE.BufferAttribute(drift, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  geo.setAttribute("aEdge", new THREE.BufferAttribute(edge, 1));
  geo.setAttribute("aDrag", new THREE.BufferAttribute(dragA, 1));
  geo.setAttribute("aStiff", new THREE.BufferAttribute(stiffA, 1));

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: 2.2 },
    uAmp: { value: 0.16 * K * 6.5 * 0.16 },
    uDisperse: { value: 0 },
    uDpr: { value: Math.min(window.devicePixelRatio, 1.75) },
    uSilk: { value: 0.55 },
    uVel: { value: 0 },
    uVelSlow: { value: 0 },
    uScatter: { value: 0.55 },
    uMouse: { value: new THREE.Vector2(999, 999) },
    uMouseStrength: { value: 0 },
    /* ~180px at the ribbon's working distance. The first pass used 0.42
       (~60px), which the shader applied correctly and nobody could see —
       reported as "hover does nothing". It was doing something; it was
       doing it to sixty pixels. */
    uRepelRadius: { value: 1.22 },
    /* WI-6 — on graphite the field reads brighter than it did on black, so
       the ceiling comes down ~10% to hold the same perceived glow. */
    uCap: { value: 0.9 },
    uText: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 0, 0)) },
    uTextCount: { value: 0 },
    uTextFeather: { value: 0.4 },
    uPlate: { value: new THREE.Vector4(0, 0, 0, 0) },
    uPlateFeather: { value: 0.5 },
    uPlatePush: { value: 0 },
    uBright: { value: 1 },
    /* Monochrome silver. No warm stop anywhere in the field: gold is a
       typographic accent on this page, not a light source. */
    uColorCore: { value: new THREE.Color(opts.core ?? 0xe4e4e0) },
    uColorBase: { value: new THREE.Color(opts.base ?? 0xb9b9b4) },
    uColorFaint: { value: new THREE.Color(opts.faint ?? 0x6e6e68) },
    uHue: { value: new THREE.Color(0x6e6e68) },
    uTint: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const tilt = new THREE.Group();
  tilt.rotation.z = 0.15;
  const spin = new THREE.Group();
  spin.add(new THREE.Points(geo, material));
  tilt.add(spin);
  scene.add(tilt);

  /* camera per form, in the same order as KEY */
  const CAM = [
    { px: 0.0, py: 0.2, pz: 7.6, tx: 0, ty: 0.3, tz: 0, rx: 0.4 },
    { px: -0.18, py: 0.0, pz: 7.4, tx: 0, ty: 0.0, tz: 0, rx: 0.4 },
    /* datum: square on, pulled back so the whole ruled line is in frame */
    { px: -0.4, py: 0.0, pz: 7.2, tx: 0, ty: 0.0, tz: 0, rx: 0.08 },
    { px: 3.4, py: 2.1, pz: 5.6, tx: 0, ty: 0.1, tz: 0, rx: 0.0 },
    /* columns: a low three-quarter view, so height reads as height */
    { px: 2.6, py: 2.4, pz: 6.4, tx: 0, ty: 0.35, tz: 0, rx: 0.0 },
    { px: 0.0, py: 0.1, pz: 6.9, tx: 0, ty: 0.0, tz: 0, rx: 0.0 },
  ];

  let story = 0;
  let disperse = 0;
  let mode = 0;          // 0 = story spine, 1 = the trusted-by band
  let bandOffset = 0;    // the strip's travel, in world units
  let velTarget = 0;
  let dirty = true;
  let wander = 0.06;
  const ptr = { tx: 0, ty: 0, x: 0, y: 0 };
  const camTarget = new THREE.Vector3();

  const apply = (s) => {
    const i = Math.min(KEY.length - 2, Math.floor(s));
    const t = sstep(clamp01(s - i));
    const A = KEY[i];
    const B = KEY[i + 1];
    if (t <= 0) base.set(A);
    else if (t >= 1) base.set(B);
    else for (let k = 0; k < count * 3; k++) base[k] = A[k] + (B[k] - A[k]) * t;

    /* the trusted-by beat borrows the same points: blend the story form
       toward the band rather than mounting anything new. The strip's
       travel rides in as one offset on x, so the knots stay behind their
       own cards without the band ever being rebuilt. */
    if (mode > 0) {
      const m = sstep(clamp01(mode));
      for (let i = 0; i < count; i++) {
        const k = i * 3;
        base[k] += (BAND[k] + bandOffset - base[k]) * m;
        base[k + 1] += (BAND[k + 1] - base[k + 1]) * m;
        base[k + 2] += (BAND[k + 2] - base[k + 2]) * m;
      }
    }

    uniforms.uSilk.value = lerp(SILK[i], SILK[i + 1], t) * (1 - clamp01(mode));
    /* the document has to stay legible, so the wander dies as it forms */
    wander = lerp(0.06, 0.012, clamp01((s - 1.4) / 1.6));
  };

  const camAt = (s) => {
    const i = Math.min(CAM.length - 2, Math.floor(s));
    const t = sstep(clamp01(s - i));
    const a = CAM[i];
    const b = CAM[i + 1];
    return {
      px: lerp(a.px, b.px, t), py: lerp(a.py, b.py, t), pz: lerp(a.pz, b.pz, t),
      tx: lerp(a.tx, b.tx, t), ty: lerp(a.ty, b.ty, t), tz: lerp(a.tz, b.tz, t),
      rx: lerp(a.rx, b.rx, t),
    };
  };

  const setStory = (s) => {
    story = Math.max(0, Math.min(KEY.length - 1, s));
    dirty = true;
  };
  const setDisperse = (v) => {
    disperse = clamp01(v);
  };
  /* trusted-by beat: 0 = the page's own spine, 1 = the band */
  const setMode = (m) => {
    mode = clamp01(m);
    dirty = true;
  };
  const setBandOffset = (v) => {
    bandOffset = v;
    dirty = true;
  };
  /* Card centres, in world x, measured from the DOM. Rebuilding the band
     is O(count) and allocation-free, so this is cheap — but it is still
     only called on mount and on resize, never while scrolling. */
  const setBandAnchors = (anchors, knotR, centreY = 0) => {
    buildBand(count, BAND, anchors, knotR, centreY);
    dirty = true;
  };
  /* How much world space one CSS pixel covers on the field's mid-plane, so
     the caller can hand over DOM measurements without knowing the camera.
     Read off the keyframe rather than the live position: this is called on
     mount and resize, possibly before the first frame has placed anything. */
  const worldPerPx = () => {
    const k = camAt(story);
    const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * Math.abs(k.pz);
    return h / Math.max(1, container.clientHeight);
  };
  /* A distance from the viewport's horizontal centre, in CSS pixels, as a
     world x — the camera sits slightly off-axis, so this is not just a
     scale. Everything the band needs to line up with a card rect. */
  const mapX = (pxFromCentre) => camAt(story).tx + pxFromCentre * worldPerPx();
  /* screen y grows downward, world y upward — hence the sign */
  const mapY = (pxFromCentre) => camAt(story).ty - pxFromCentre * worldPerPx();
  /* Velocity is a reading, not a setting: whoever is driving the field
     re-states it every frame, and the moment nobody is, it falls to rest
     on its own.

     It used to be a plain assignment that only some other trigger set
     back to zero. Scroll up out of the trusted-by strip quickly and the
     last value written was a large negative one, with no further update
     coming — so uVel stayed pinned at -1 for the rest of the session. The
     shader scales point size by `1 + abs(uVel) * 1.5` and glow by
     `1 + abs(uVel) * 0.35`, so every dot rendered two and a half times
     its normal size, for ever. That is the "particles multiply until the
     hero is unreadable" report: the count never changed, the dots got
     fat. Decaying here fixes every scroll path at once, rather than
     adding another reset call at each call site for the next one to
     forget. */
  const VEL_HOLD = 0.14; // seconds a reading stays live before it lapses
  let velHold = 0;
  /* The index section's per-service hue.
     Same lapse discipline as velocity below: whoever is driving the tint
     restates it, and the moment nothing does it falls back to neutral. That
     is what guarantees the brief's "uTint MUST rest at 0 in every other
     section" — structurally, rather than by trusting every exit path to
     remember. The dev assertion catches a caller that stops restating it
     while still expecting colour. */
  const TINT_HOLD = 0.25;
  const hueTarget = new THREE.Color(0x6e6e68);
  let tintTarget = 0;
  let tintHold = 0;
  let tintWarned = false;
  const setTint = (hex, amount) => {
    if (hex != null) hueTarget.set(hex);
    tintTarget = clamp01(amount);
    tintHold = TINT_HOLD;
  };

  /* The index rows lean on the funnel while one of them is held: it turns
     harder and lifts in brightness. Eased in the loop, never set hard. */
  let focus = 0;
  let focusEased = 0;
  const setFocus = (v) => {
    focus = clamp01(v);
  };
  const setVelocity = (v) => {
    velTarget = Math.max(-1, Math.min(1, v));
    velHold = VEL_HOLD;
  };
  const setPointer = (x, y) => {
    ptr.tx = x;
    ptr.ty = y;
  };

  /* The pointer in normalised device coords, unprojected onto the field's
     mid-plane (z = 0) so repulsion happens in the same space the points
     live in. Eased, never teleported — the wake closing behind the cursor
     is half the effect. */
  const ndc = new THREE.Vector3();
  const scratch = new THREE.Vector3();
  /* A point on screen, in normalised device coords, as a point in the
     field's own space: unproject onto the mid-plane, then through the
     stage's transform. Both the cursor and the sheet's mask need this. */
  const toLocal = (nx, ny, out) => {
    ndc.set(nx, -ny, 0.5).unproject(camera);
    ndc.sub(camera.position).normalize();
    const dist = -camera.position.z / ndc.z;
    out.copy(ndc).multiplyScalar(dist).add(camera.position);
    tilt.updateMatrixWorld();
    return tilt.worldToLocal(out);
  };

  const mouseTarget = new THREE.Vector2(999, 999);
  let hovering = false;
  const setMouse = (nx, ny, inside) => {
    hovering = !!inside;
    if (!inside) return;
    const local = toLocal(nx, ny, scratch);
    mouseTarget.set(local.x, local.y);
  };

  /* WI-5 — the brightness cap. Where type sits over the field the whole
     section is held down; where it does not (certificate, funnel, the
     trusted band) the cores are free to burn. Eased, so crossing a section
     boundary is not a step. */
  const CAP_MAX = 0.9;
  let capTarget = CAP_MAX;
  const setCap = (v) => {
    capTarget = Math.max(0.05, Math.min(CAP_MAX, v * CAP_MAX));
  };

  /* The text blocks, as NDC rects. Recomputed on resize only — the caller
     owns that; here they are just converted into the field's own space. */
  const textScratch = new THREE.Vector3();
  const setTextRects = (rects) => {
    const n = Math.min(4, rects ? rects.length : 0);
    for (let i = 0; i < n; i++) {
      const r = rects[i];
      const a = toLocal(r.x0, r.y0, textScratch).clone();
      const b = toLocal(r.x1, r.y1, textScratch);
      uniforms.uText.value[i].set(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        Math.abs(b.x - a.x) / 2,
        Math.abs(b.y - a.y) / 2
      );
    }
    uniforms.uTextCount.value = n;
    if (rects && rects.length && rects[0].feather != null) {
      uniforms.uTextFeather.value = Math.max(0.05, rects[0].feather);
    }
  };

  /* The sheet's exclusion rect, given as its two opposite corners in
     normalised device coords. Passing null lifts the mask. */
  const plateA = new THREE.Vector3();
  const plateB = new THREE.Vector3();
  let plateStrength = 0;
  const setPlate = (rect) => {
    if (!rect) {
      uniforms.uPlate.value.set(0, 0, 0, 0);
      return;
    }
    const a = toLocal(rect.x0, rect.y0, plateA).clone();
    const b = toLocal(rect.x1, rect.y1, plateB);
    uniforms.uPlate.value.set(
      (a.x + b.x) / 2,
      (a.y + b.y) / 2,
      Math.abs(b.x - a.x) / 2,
      Math.abs(b.y - a.y) / 2
    );
    uniforms.uPlateFeather.value = Math.max(0.05, rect.feather ?? 0.5);
  };
  /* Eased in the frame loop, never set hard — the field has to open around
     the sheet as it arrives, not snap around it. */
  const setPlateStrength = (v) => {
    plateStrength = clamp01(v);
  };

  /* THREE.Clock is deprecated in this three.js version and is the source
     of the dev-mode issue badge. Plain timing needs no replacement API. */
  const t0 = performance.now();
  const elapsed = () => (performance.now() - t0) / 1000;
  const BASE_SPIN = (Math.PI * 2) / 82;
  /* The ribbon is a torus. Seen edge-on it is a narrow column that sits
     beside the headline; seen face-on it is a wide ring straight through
     it. The spin used to be a bare accumulator, so which of those you got
     depended only on how long you had been on the page — after a scroll
     to the foot and back it had advanced about a radian and the hero copy
     was unreadable behind it. (Reported as "particles multiply"; nothing
     multiplies — the count is fixed and every scroll-driven uniform comes
     back exactly. This was the one value that did not.)

     The funnel still whirls up as it forms. Once formed, the ribbon holds
     the angle it reads best at and stays there — the project's own rule
     that scroll-driven 3D is a pure function of scroll progress, applied
     to the one thing that was still a function of the clock. It does not
     need axial spin to feel alive: the cloth already undulates through
     the noise term and every point carries its own wander. */
  const SPIN_HOME = 2.2;
  let spinAngle = 0;
  let lastT = 0;
  let raf = 0;
  let running = false;

  const step = (animate) => {
    const t = elapsed();
    const dt = Math.min(0.05, t - lastT);
    lastT = t;
    if (dirty) {
      apply(story);
      dirty = false;
    }
    if (animate) uniforms.uTime.value = t;

    /* it turns hard as a funnel and settles as the cloth forms; the
       structural forms hold still, so the spin eases back to zero */
    const silk = uniforms.uSilk.value;
    /* 1 while it is still a funnel, 0 once the cloth has formed */
    const whirl = Math.pow(1 - Math.min(1, story), 2);
    /* ~600ms crossfades, per the brief. Hue lerps straight from one
       service to the next while the amount holds, so row-to-row never dips
       through neutral grey. */
    if (animate) {
      tintHold -= dt;
      if (tintHold <= 0) {
        if (process.env.NODE_ENV !== "production" && tintTarget > 0 && !tintWarned) {
          tintWarned = true;
          console.warn(
            "[studioScene] tint lapsed while still requested — a caller stopped restating setTint()"
          );
        }
        tintTarget = 0;
      }
    }
    uniforms.uTint.value = lerp(uniforms.uTint.value, tintTarget, 0.055);
    uniforms.uHue.value.lerp(hueTarget, 0.055);

    focusEased = lerp(focusEased, focus, 0.08);
    if (animate) {
      spinAngle += dt * BASE_SPIN * (1 + whirl * 22) * (1 + focusEased * 1.7);
      velHold -= dt;
      if (velHold <= 0) velTarget = 0;
    }
    uniforms.uBright.value = 1 + focusEased * 0.55 * whirl;
    spin.rotation.y =
      lerp(SPIN_HOME, spinAngle, whirl) * Math.min(1, silk * 1.6);

    const amp = animate ? wander : 0;
    for (let i = 0; i < count; i++) {
      const w = t * wRate[i] + wPhase[i];
      const i3 = i * 3;
      positions[i3] = base[i3] + Math.sin(w) * amp;
      positions[i3 + 1] = base[i3 + 1] + Math.cos(w * 0.83) * amp * 0.65;
      positions[i3 + 2] = base[i3 + 2] + Math.sin(w * 1.17 + wPhase[i]) * amp;
    }
    geo.attributes.position.needsUpdate = true;

    uniforms.uDisperse.value = disperse;
    /* two smoothing rates: the fast one is the smear, the slow one is the
       settle. Per-particle aStiff mixes between them. */
    uniforms.uVel.value = lerp(uniforms.uVel.value, velTarget, 0.1);
    uniforms.uVelSlow.value = lerp(uniforms.uVelSlow.value, velTarget, 0.035);
    uniforms.uScatter.value = lerp(uniforms.uScatter.value, mode > 0.5 ? 0.55 : 0.12, 0.05);

    /* repulsion easing: in over ~0.25s, out over ~0.6s */
    const mv = uniforms.uMouse.value;
    if (hovering) {
      mv.x = lerp(mv.x > 100 ? mouseTarget.x : mv.x, mouseTarget.x, 0.12);
      mv.y = lerp(mv.y > 100 ? mouseTarget.y : mv.y, mouseTarget.y, 0.12);
    }
    uniforms.uCap.value = lerp(uniforms.uCap.value, capTarget, 0.06);
    uniforms.uPlatePush.value = lerp(
      uniforms.uPlatePush.value,
      plateStrength,
      0.09
    );
    uniforms.uMouseStrength.value = lerp(
      uniforms.uMouseStrength.value,
      hovering ? 0.38 : 0,
      hovering ? 0.13 : 0.055
    );
    ptr.x = lerp(ptr.x, ptr.tx, 0.022);
    ptr.y = lerp(ptr.y, ptr.ty, 0.022);

    const k = camAt(story);
    tilt.rotation.x = k.rx + ptr.y * 0.06;
    tilt.rotation.z = 0.15 * Math.min(1, silk * 1.6) + ptr.x * 0.06;
    camera.position.set(
      k.px + ptr.x * 0.3 + Math.cos(t * 0.105) * 0.08,
      k.py - ptr.y * 0.2 + Math.sin(t * 0.14) * 0.06,
      k.pz
    );
    camTarget.set(k.tx, k.ty, k.tz);
    camera.lookAt(camTarget);
    renderer.render(scene, camera);
  };

  const frame = () => {
    raf = requestAnimationFrame(frame);
    step(true);
  };
  const resume = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const pause = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };

  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    /* The third argument must NOT be false. With updateStyle off, three.js
       leaves the canvas element unsized in CSS, so it displays at its
       drawing-buffer size — viewport x devicePixelRatio. At DPR 1.75 that
       is a 2240x1260 element in a 1280x720 window, anchored top-left and
       overflowing 960px right and 540px down, which puts the scene's
       centre at ~87%/87%: the bottom-right drift reported from a Mac and
       invisible in any DPR-1 test. */
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  return {
    setStory,
    setDisperse,
    setMode,
    setBandOffset,
    setBandAnchors,
    worldPerPx,
    mapX,
    mapY,
    setVelocity,
    setPointer,
    setMouse,
    setFocus,
    setTint,
    getTint: () => uniforms.uTint.value,
    setPlate,
    setPlateStrength,
    setCap,
    setTextRects,
    resume,
    pause,
    renderOnce: () => step(false),
    dispose() {
      pause();
      ro.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
