import * as THREE from "three";

/**
 * The valuation spine — one object, five beats.
 *
 * A single field of ~4,200 points is re-formed four times as the visitor
 * scrolls, so the same matter that is a dispersed enquiry becomes a
 * surveyed site, becomes an ordered analysis, becomes a signed report.
 * Nothing is created and nothing is thrown away: that is the argument the
 * firm makes about its own work, told in geometry.
 *
 *   00  Enquiry & Scope              dispersed field, nothing measured yet
 *   01  Site Inspection              the parcel and its massing, level line sweeping
 *   02  Market & Technical Analysis  the site lifts into an ordered data lattice
 *   03  Report & Certification       everything folds flat into a page; the seal lands
 *   04  Delivery & Support           the page turns to three-quarter; copies behind it
 *
 * EVERYTHING here is a pure function of scroll progress `p` — no tweens,
 * no one-shot state. Scrub backwards and the report un-signs itself
 * exactly. Only the camera's idle drift and the damped pointer parallax
 * are time-based, and both are sub-pixel-slow: the scene reads as frozen
 * time, per the hero acceptance criteria.
 *
 * Imperative API, driven from ValuationJourney's ScrollTrigger:
 *   setProgress(p)      — p in [0,1] across the whole pinned journey
 *   setPointer(nx, ny)  — normalised −1..1, moves the camera a few units
 *   resume() / pause()  — rAF gating from the IntersectionObserver
 *   dispose()
 */

const COUNT = 4200;

const LINEN = new THREE.Color(0xdcd9d1);
const BRASS = new THREE.Color(0xc9a063);

/* Deterministic noise — the same scene every load. A valuation is
   repeatable; so is its picture. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ramp = (p, a, b) => clamp01((p - a) / (b - a));
const sstep = (x) => x * x * (3 - 2 * x);
const ease = (p, a, b) => sstep(ramp(p, a, b));
const lerp = (a, b, t) => a + (b - a) * t;

/* ------------------------------------------------------------------ */
/* Target builders — each fills a COUNT*3 buffer                       */
/* ------------------------------------------------------------------ */

/* Weighted segment sampler: every target is described as a list of line
   segments with a density weight, then points are handed out along them
   in index order. Deterministic, and it makes the page's text lines fall
   out of the same code as the site's parcel edges. */
function fillSegments(out, segments) {
  const r = rng(7717);
  let total = 0;
  for (const s of segments) total += s.w;

  let i = 0;
  let acc = 0;
  for (let si = 0; si < segments.length; si++) {
    const s = segments[si];
    acc += s.w;
    const upTo =
      si === segments.length - 1 ? COUNT : Math.round((acc / total) * COUNT);
    for (; i < upTo; i++) {
      const t = r();
      const j = s.j || 0;
      out[i * 3] = lerp(s.x0, s.x1, t) + (r() - 0.5) * j;
      out[i * 3 + 1] = lerp(s.y0, s.y1, t) + (r() - 0.5) * (s.jy ?? j);
      out[i * 3 + 2] = lerp(s.z0, s.z1, t) + (r() - 0.5) * j;
    }
  }
}

const seg = (x0, y0, z0, x1, y1, z1, w = 1, j = 0, jy) => ({
  x0, y0, z0, x1, y1, z1, w, j, jy,
});

/* --- 00 Enquiry: the site, but dispersed. Every point already belongs
       where it will end up; nothing has been measured, so nothing is yet
       in place. Built by pushing the surveyed positions outward, which is
       why the first morph reads as the site resolving rather than as
       particles rearranging. -------------------------------------------- */
function buildCloud(out, site) {
  const r = rng(20260729);
  for (let i = 0; i < COUNT; i++) {
    const x = site[i * 3];
    const y = site[i * 3 + 1];
    const z = site[i * 3 + 2];
    const spread = 1.2 + r() * 0.85;
    out[i * 3] = x * spread + (r() - 0.5) * 8;
    out[i * 3 + 1] = y * 1.15 + 2.5 + Math.pow(r(), 1.6) * 16;
    out[i * 3 + 2] = z * spread + (r() - 0.5) * 8;
  }
}

/* --- 01 Site inspection: the parcel and what stands on it. ---------- */
const PARCEL = { x0: -16, x1: 16, z0: -12, z1: 12 };
const BLOCK_A = { x0: -10, x1: 4, y0: 0, y1: 13.5, z0: -6, z1: 4 };
const BLOCK_B = { x0: 4, x1: 12, y0: 0, y1: 7, z0: 0, z1: 7 };

function boxEdges(b, w) {
  const { x0, x1, y0, y1, z0, z1 } = b;
  const xs = [x0, x1];
  const zs = [z0, z1];
  const ys = [y0, y1];
  const out = [];
  for (const y of ys)
    for (const z of zs) out.push(seg(x0, y, z, x1, y, z, w, 0.1));
  for (const y of ys)
    for (const x of xs) out.push(seg(x, y, z0, x, y, z1, w, 0.1));
  for (const x of xs)
    for (const z of zs) out.push(seg(x, y0, z, x, y1, z, w, 0.1));
  return out;
}

/* Faces, sampled as a ladder of lines — cheaper than true area sampling
   and it keeps the CAD register: a surveyed building is drawn, not shaded. */
function boxFaces(b, w, lines = 7) {
  const { x0, x1, y0, y1, z0, z1 } = b;
  const out = [];
  for (let i = 1; i < lines; i++) {
    const t = i / lines;
    const y = lerp(y0, y1, t);
    out.push(seg(x0, y, z0, x1, y, z0, w, 0.12));
    out.push(seg(x0, y, z1, x1, y, z1, w, 0.12));
    out.push(seg(x0, y, z0, x0, y, z1, w, 0.12));
    out.push(seg(x1, y, z0, x1, y, z1, w, 0.12));
  }
  return out;
}

function buildSite(out) {
  const { x0, x1, z0, z1 } = PARCEL;
  const segments = [
    /* parcel boundary — the legal edge of the thing being valued */
    seg(x0, 0, z0, x1, 0, z0, 3.4, 0.14),
    seg(x0, 0, z1, x1, 0, z1, 3.4, 0.14),
    seg(x0, 0, z0, x0, 0, z1, 2.8, 0.14),
    seg(x1, 0, z0, x1, 0, z1, 2.8, 0.14),
  ];
  /* a little ground dust, kept quiet so the massing carries the frame */
  for (let i = 0; i < 5; i++) {
    const z = lerp(z0 + 2, z1 - 2, i / 4);
    segments.push(seg(x0 + 2, 0, z, x1 - 2, 0, z, 0.7, 0.6, 0.1));
  }
  /* the massing: edge-heavy, the way a surveyed building is drawn */
  segments.push(...boxEdges(BLOCK_A, 11), ...boxFaces(BLOCK_A, 0.7, 5));
  segments.push(...boxEdges(BLOCK_B, 6), ...boxFaces(BLOCK_B, 0.5, 4));
  fillSegments(out, segments);
}

/* --- 02 Analysis: the site lifts into ordered data. ----------------- */
function buildLattice(out) {
  const r = rng(4242);
  const columnPts = Math.round(COUNT * 0.34);
  const COLS = 13;
  const perCol = Math.floor(columnPts / COLS);

  let i = 0;
  /* comparables — one column per data point, ringing the parcel */
  for (let c = 0; c < COLS; c++) {
    const a = (c / COLS) * Math.PI * 2 + 0.22;
    const rad = 19 + r() * 2.2;
    const cx = Math.cos(a) * rad;
    const cz = Math.sin(a) * rad * 0.8;
    const h = 5 + r() * 13;
    for (let k = 0; k < perCol; k++, i++) {
      out[i * 3] = cx + (r() - 0.5) * 0.22;
      out[i * 3 + 1] = (k / perCol) * h;
      out[i * 3 + 2] = cz + (r() - 0.5) * 0.22;
    }
  }

  /* two stacked planes of ordered readings — the analysis itself */
  const layers = [
    { y: 13.5, n: Math.round((COUNT - i) * 0.55) },
    { y: 7.0, n: COUNT - i - Math.round((COUNT - i) * 0.55) },
  ];
  for (const L of layers) {
    const cols = Math.max(2, Math.round(Math.sqrt((L.n * 32) / 18)));
    const rows = Math.max(2, Math.ceil(L.n / cols));
    for (let k = 0; k < L.n; k++, i++) {
      const cx = k % cols;
      const cz = Math.floor(k / cols);
      out[i * 3] = lerp(-16, 16, cols === 1 ? 0.5 : cx / (cols - 1)) + (r() - 0.5) * 0.16;
      out[i * 3 + 1] = L.y + (r() - 0.5) * 0.35;
      out[i * 3 + 2] = lerp(-9, 9, rows === 1 ? 0.5 : cz / (rows - 1)) + (r() - 0.5) * 0.16;
    }
  }
  for (; i < COUNT; i++) {
    out[i * 3] = 0;
    out[i * 3 + 1] = 10;
    out[i * 3 + 2] = 0;
  }
}

/* --- 03/04 The report: an upright sheet of paper, drawn as type. ---- */
const SHEET = { hw: 11, hh: 15 };
const MARGIN = 8.6;
const SEAL = { x: 5.8, y: -12.2, r: 2.5 };

function buildPage(out) {
  const r = rng(90210);
  const segments = [];
  const line = (y, x0, x1, w, jy = 0.08) =>
    segments.push(seg(x0, y, 0, x1, y, 0, w, 0.06, jy));

  /* title block — heavier, set wide */
  line(12.3, -MARGIN, 2.4, 3.4, 0.24);
  line(10.7, -MARGIN, -1.2, 3.0, 0.2);

  /* body copy — a valuation report is mostly prose */
  for (let k = 0; k < 15; k++) {
    const y = 7.7 - k * 0.9;
    const len = 0.46 + r() * 0.54;
    line(y, -MARGIN, -MARGIN + 2 * MARGIN * len, 1);
  }

  /* the schedule of values — three columns */
  for (let k = 0; k < 3; k++) {
    const y = -7.6 - k * 0.9;
    line(y, -MARGIN, -3.4, 1.1);
    line(y, -2.6, 1.4, 1.1);
    line(y, 2.4, 6.2, 1.1);
  }

  /* signature line, left of the seal */
  line(-13.0, -MARGIN, -2.6, 1.6, 0.1);

  fillSegments(out, segments);
}

/* ------------------------------------------------------------------ */
/* Line work — the drawn elements that sit over the point field         */
/* ------------------------------------------------------------------ */

function lineMat(color, opacity) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
}

function rectLoop(x0, y0, x1, y1, z, axis = "xy") {
  const p =
    axis === "xy"
      ? [
          [x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z],
        ]
      : [
          [x0, z, y0], [x1, z, y0], [x1, z, y1], [x0, z, y1],
        ];
  return new THREE.BufferGeometry().setFromPoints(
    p.map(([a, b, c]) => new THREE.Vector3(a, b, c))
  );
}

/* ------------------------------------------------------------------ */

export function createReportScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 400);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch {
    return null;
  }
  renderer.setClearColor(0x070606, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  container.appendChild(renderer.domElement);

  const junk = [];
  const track = (o) => (junk.push(o), o);

  const stage = new THREE.Group();
  scene.add(stage);

  /* ---------------- the point field ---------------- */
  const T_CLOUD = new Float32Array(COUNT * 3);
  const T_SITE = new Float32Array(COUNT * 3);
  const T_LATTICE = new Float32Array(COUNT * 3);
  const T_PAGE = new Float32Array(COUNT * 3);
  buildSite(T_SITE);
  buildCloud(T_CLOUD, T_SITE);
  buildLattice(T_LATTICE);
  buildPage(T_PAGE);
  const FRAMES = [T_CLOUD, T_SITE, T_LATTICE, T_PAGE, T_PAGE, T_PAGE];

  const positions = new Float32Array(COUNT * 3);
  positions.set(T_CLOUD);
  const colors = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    /* brass is an accent caught in edges — roughly one point in seven */
    const c = i % 7 === 0 ? BRASS : LINEN;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const fieldGeo = track(new THREE.BufferGeometry());
  fieldGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  fieldGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const field = new THREE.Points(
    fieldGeo,
    track(
      new THREE.PointsMaterial({
        size: 0.3,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  stage.add(field);

  /* ---------------- site line work ---------------- */
  const parcelMat = track(lineMat(0xc9a063, 0));
  const parcel = new THREE.LineLoop(
    track(rectLoop(PARCEL.x0, PARCEL.z0, PARCEL.x1, PARCEL.z1, 0.02, "xz")),
    parcelMat
  );
  stage.add(parcel);

  /* the massing, drawn — the point field alone reads as dust; the firm
     surveys buildings, so the buildings are drawn */
  const massMat = track(lineMat(0xf2efe9, 0));
  const massPts = [];
  const boxWire = (b) => {
    const { x0, x1, y0, y1, z0, z1 } = b;
    const v = (x, y, z) => new THREE.Vector3(x, y, z);
    const c = [
      v(x0, y0, z0), v(x1, y0, z0), v(x1, y0, z1), v(x0, y0, z1),
      v(x0, y1, z0), v(x1, y1, z0), v(x1, y1, z1), v(x0, y1, z1),
    ];
    const E = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    E.forEach(([a, b2]) => massPts.push(c[a], c[b2]));
  };
  boxWire(BLOCK_A);
  boxWire(BLOCK_B);
  const massing = new THREE.LineSegments(
    track(new THREE.BufferGeometry().setFromPoints(massPts)),
    massMat
  );
  stage.add(massing);

  /* the level line — a laser plane travelling down the massing during
     the inspection beat */
  const levelMat = track(lineMat(0xffe6bb, 0));
  const level = new THREE.LineLoop(
    track(rectLoop(-10.6, -6.6, 12.6, 7.6, 0, "xz")),
    levelMat
  );
  stage.add(level);
  const levelFillMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xc9a063,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  );
  const levelGeo = track(new THREE.PlaneGeometry(23.2, 14.2));
  levelGeo.rotateX(-Math.PI / 2);
  const levelFill = new THREE.Mesh(levelGeo, levelFillMat);
  levelFill.position.set(1, 0, 0.5);
  stage.add(levelFill);

  /* dimension lines — the measurement, with tick ends */
  const dimMat = track(lineMat(0xc9a063, 0));
  const dimPts = [];
  const dim = (x0, z0, x1, z1) => {
    dimPts.push(
      new THREE.Vector3(x0, 0.05, z0),
      new THREE.Vector3(x1, 0.05, z1)
    );
  };
  dim(PARCEL.x0, PARCEL.z1 + 2.6, PARCEL.x1, PARCEL.z1 + 2.6);
  dim(PARCEL.x0, PARCEL.z1 + 1.6, PARCEL.x0, PARCEL.z1 + 3.6);
  dim(PARCEL.x1, PARCEL.z1 + 1.6, PARCEL.x1, PARCEL.z1 + 3.6);
  dim(PARCEL.x1 + 2.6, PARCEL.z0, PARCEL.x1 + 2.6, PARCEL.z1);
  dim(PARCEL.x1 + 1.6, PARCEL.z0, PARCEL.x1 + 3.6, PARCEL.z0);
  dim(PARCEL.x1 + 1.6, PARCEL.z1, PARCEL.x1 + 3.6, PARCEL.z1);
  /* height dimension on the main block */
  dimPts.push(
    new THREE.Vector3(BLOCK_A.x0 - 2.4, 0, BLOCK_A.z1),
    new THREE.Vector3(BLOCK_A.x0 - 2.4, BLOCK_A.y1, BLOCK_A.z1)
  );
  const dims = new THREE.LineSegments(
    track(new THREE.BufferGeometry().setFromPoints(dimPts)),
    dimMat
  );
  stage.add(dims);

  /* ---------------- the report ---------------- */
  const sheetMat = track(lineMat(0xf2efe9, 0));
  const sheet = new THREE.LineLoop(
    track(rectLoop(-SHEET.hw, -SHEET.hh, SHEET.hw, SHEET.hh, 0)),
    sheetMat
  );
  stage.add(sheet);

  const ruleMat = track(lineMat(0xc9a063, 0));
  const rule = new THREE.Line(
    track(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-MARGIN, 9.5, 0),
        new THREE.Vector3(MARGIN, 9.5, 0),
      ])
    ),
    ruleMat
  );
  stage.add(rule);

  /* delivered copies — three signed originals leave the office */
  const copyMat = track(lineMat(0xf2efe9, 0));
  const copies = [1, 2].map((k) => {
    const c = new THREE.LineLoop(
      track(rectLoop(-SHEET.hw, -SHEET.hh, SHEET.hw, SHEET.hh, 0)),
      copyMat
    );
    c.position.set(-1.6 * k, 0.55 * k, -1.5 * k);
    stage.add(c);
    return c;
  });

  /* the seal — the same mark as the hero's, turned into an object */
  const sealMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xc9a063,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const sealGroup = new THREE.Group();
  const ringSpecs = [
    [SEAL.r, 0.045],
    [SEAL.r * 0.93, 0.11],
    [SEAL.r * 0.67, 0.04],
  ];
  ringSpecs.forEach(([rad, tube]) => {
    const g = track(new THREE.TorusGeometry(rad, tube, 8, 64));
    sealGroup.add(new THREE.Mesh(g, sealMat));
  });
  sealGroup.position.set(SEAL.x, SEAL.y, 0.3);
  stage.add(sealGroup);

  /* the impression the seal makes when it lands */
  const stampMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xffe6bb,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  const stampGeo = track(new THREE.RingGeometry(SEAL.r, SEAL.r + 0.22, 64));
  const stamp = new THREE.Mesh(stampGeo, stampMat);
  stamp.position.set(SEAL.x, SEAL.y, 0.32);
  stage.add(stamp);

  /* ---------------- camera choreography ---------------- */
  /* one keyframe per beat, read at the beat's centre and smoothstepped
     between — cinematic movement, never object animation. */
  const CAM = [
    { px: 2, py: 28, pz: 84, tx: 0, ty: 6, tz: 0 },
    { px: 27, py: 15, pz: 41, tx: 0, ty: 6.5, tz: 0 },
    { px: -13, py: 44, pz: 58, tx: 0, ty: 9, tz: 0 },
    { px: 0, py: 1, pz: 53, tx: 0, ty: 0.5, tz: 0 },
    { px: 17, py: 4, pz: 44, tx: 1.5, ty: -1.5, tz: 0 },
  ];
  const camKey = (p) => {
    const x = clamp01((p - 0.1) / 0.8) * (CAM.length - 1);
    const i = Math.min(CAM.length - 2, Math.floor(x));
    const t = sstep(clamp01(x - i));
    const a = CAM[i];
    const b = CAM[i + 1];
    return {
      px: lerp(a.px, b.px, t),
      py: lerp(a.py, b.py, t),
      pz: lerp(a.pz, b.pz, t),
      tx: lerp(a.tx, b.tx, t),
      ty: lerp(a.ty, b.ty, t),
      tz: lerp(a.tz, b.tz, t),
    };
  };

  /* ---------------- state ---------------- */
  let progress = 0;
  let dirty = true;
  const ptr = { tx: 0, ty: 0, x: 0, y: 0 };
  const camTarget = new THREE.Vector3();

  const applyProgress = (p) => {
    /* morph: five beats, four distinct forms. Each beat holds, then
       re-forms into the next over the back half of its span. */
    const b = Math.min(4, Math.floor(p * 5));
    const u = p * 5 - b;
    const e = sstep(clamp01((u - 0.42) / 0.58));
    const A = FRAMES[b];
    const B = FRAMES[b + 1];
    if (A === B && e >= 1) {
      positions.set(A);
    } else {
      for (let i = 0; i < COUNT * 3; i++) {
        positions[i] = A[i] + (B[i] - A[i]) * e;
      }
    }
    fieldGeo.attributes.position.needsUpdate = true;

    /* the field tightens as the work resolves */
    field.material.size = lerp(0.36, 0.26, ease(p, 0.2, 0.75));

    /* site drawing: in with the parcel, out when the site lifts */
    const siteIn = ease(p, 0.14, 0.3) * (1 - ease(p, 0.46, 0.58));
    parcelMat.opacity = 0.5 * siteIn;
    massMat.opacity = 0.26 * siteIn;
    dimMat.opacity = 0.62 * ease(p, 0.24, 0.36) * (1 - ease(p, 0.44, 0.53));

    /* the level line sweeps the massing once, during the inspection */
    const scan = ramp(p, 0.2, 0.4);
    const scanVis = ease(p, 0.19, 0.24) * (1 - ease(p, 0.37, 0.42));
    const y = lerp(15, 0.1, sstep(scan));
    level.position.y = y;
    levelFill.position.y = y;
    levelMat.opacity = 0.85 * scanVis;
    levelFillMat.opacity = 0.05 * scanVis;

    /* the sheet — timed so that certification happens while the copy
       beside it says certification, and delivery while it says delivery */
    const paper = ease(p, 0.6, 0.68);
    sheetMat.opacity = 0.34 * paper;
    ruleMat.opacity = 0.55 * paper;

    /* the seal descends, lands at p≈0.84, and stays */
    const land = ease(p, 0.64, 0.75);
    sealMat.opacity = 0.95 * land;
    const punch = 1 + 1.4 * (1 - land) + 0.06 * Math.sin(Math.PI * ramp(p, 0.75, 0.83));
    sealGroup.scale.setScalar(punch);
    sealGroup.position.z = lerp(7, 0.3, land);
    sealGroup.rotation.z = lerp(-0.5, 0, land);

    /* the impression the seal leaves: one bell, no state to unwind. Kept
       tight — an impression in paper, never an expanding orbit ring. */
    const impress = ramp(p, 0.73, 0.82);
    stampMat.opacity = 0.55 * Math.sin(Math.PI * impress);
    stamp.scale.setScalar(1 + 0.26 * impress);

    /* copies fan out behind the original as it is delivered */
    const out = ease(p, 0.82, 0.98);
    copyMat.opacity = 0.16 * out;
    copies.forEach((c, k) => {
      const kk = k + 1;
      c.position.set(-1.9 * kk * out, 0.6 * kk * out, -1.6 * kk * out);
    });

    const k = camKey(p);
    camera.position.set(k.px, k.py, k.pz);
    camTarget.set(k.tx, k.ty, k.tz);
  };

  const setProgress = (p) => {
    progress = clamp01(p);
    dirty = true;
  };
  const setPointer = (nx, ny) => {
    ptr.tx = nx;
    ptr.ty = ny;
  };

  /* ---------------- render loop ---------------- */
  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;

  const render = () => {
    raf = requestAnimationFrame(render);
    const t = clock.getElapsedTime();

    if (dirty) {
      applyProgress(progress);
      dirty = false;
    } else {
      const k = camKey(progress);
      camera.position.set(k.px, k.py, k.pz);
      camTarget.set(k.tx, k.ty, k.tz);
    }

    /* the camera has weight, and never quite stops breathing */
    ptr.x += (ptr.tx - ptr.x) * 0.045;
    ptr.y += (ptr.ty - ptr.y) * 0.045;
    camera.position.x += ptr.x * 3.4 + Math.cos(t * 0.19) * 0.7;
    camera.position.y += -ptr.y * 2.2 + Math.sin(t * 0.25) * 0.55;
    camera.lookAt(camTarget);

    renderer.render(scene, camera);
  };

  const resume = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(render);
  };
  const pause = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  applyProgress(0);
  resume();

  return {
    setProgress,
    setPointer,
    resume,
    pause,
    dispose() {
      pause();
      ro.disconnect();
      junk.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
