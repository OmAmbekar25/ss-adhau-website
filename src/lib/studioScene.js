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

function buildLattice(n, out) {
  const r = rng(4242);
  const COLS = 13;
  const colPts = Math.round(n * 0.34);
  const per = Math.floor(colPts / COLS);
  let i = 0;
  for (let c = 0; c < COLS; c++) {
    const a = (c / COLS) * Math.PI * 2 + 0.22;
    const rad = 19 + r() * 2.2;
    const cx = Math.cos(a) * rad;
    const cz = Math.sin(a) * rad * 0.8;
    const h = 5 + r() * 13;
    for (let k = 0; k < per && i < n; k++, i++) {
      put(out, i, cx + (r() - 0.5) * 0.22, (k / per) * h, cz + (r() - 0.5) * 0.22);
    }
  }
  const layers = [
    { y: 13.5, n: Math.round((n - i) * 0.55) },
    { y: 7.0, n: n - i - Math.round((n - i) * 0.55) },
  ];
  for (const L of layers) {
    const cols = Math.max(2, Math.round(Math.sqrt((L.n * 32) / 18)));
    const rows = Math.max(2, Math.ceil(L.n / cols));
    for (let k = 0; k < L.n && i < n; k++, i++) {
      const cx = k % cols;
      const cz = Math.floor(k / cols);
      put(
        out, i,
        lerp(-16, 16, cols === 1 ? 0.5 : cx / (cols - 1)) + (r() - 0.5) * 0.16,
        L.y + (r() - 0.5) * 0.35,
        lerp(-9, 9, rows === 1 ? 0.5 : cz / (rows - 1)) + (r() - 0.5) * 0.16
      );
    }
  }
  for (; i < n; i++) put(out, i, 0, 10, 0);
}

function buildPage(n, out) {
  const r = rng(90210);
  const segs = [];
  const line = (y, x0, x1, w, jy = 0.08) =>
    segs.push(seg(x0, y, 0, x1, y, 0, w, 0.06, jy));
  line(12.3, -MARGIN, 2.4, 3.4, 0.24);
  line(10.7, -MARGIN, -1.2, 3.0, 0.2);
  for (let k = 0; k < 15; k++) {
    const y = 7.7 - k * 0.9;
    line(y, -MARGIN, -MARGIN + 2 * MARGIN * (0.46 + r() * 0.54), 1);
  }
  for (let k = 0; k < 3; k++) {
    const y = -7.6 - k * 0.9;
    line(y, -MARGIN, -3.4, 1.1);
    line(y, -2.6, 1.4, 1.1);
    line(y, 2.4, 6.2, 1.1);
  }
  line(-13.0, -MARGIN, -2.6, 1.6, 0.1);
  fillSegments(n, out, segs);
}

/* --------------------------------------------------------- formations */
/* The identity beat's four slides. Same points as everything else — the
   ribbon condenses into these and re-forms afterwards. */

function buildFormations(n, F) {
  const r = rng(5150);
  // 1 — tight luminous disc, left of centre
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * 1.15;
    F[0][i * 3] = -1.0 + Math.cos(a) * rad;
    F[0][i * 3 + 1] = Math.sin(a) * rad;
    F[0][i * 3 + 2] = (r() - 0.5) * 0.22;
  }
  // 2 — dense core with a thin orbiting halo, right of centre
  for (let i = 0; i < n; i++) {
    const core = r() < 0.62;
    const a = r() * Math.PI * 2;
    const rad = core ? Math.sqrt(r()) * 0.52 : 1.72 + r() * 0.16;
    F[1][i * 3] = 1.0 + Math.cos(a) * rad;
    F[1][i * 3 + 1] = Math.sin(a) * rad * (core ? 1 : 0.86);
    F[1][i * 3 + 2] = (r() - 0.5) * (core ? 0.4 : 0.12);
  }
  // 3 — a constellation clustered around five label positions
  const anchors = [
    [-2.25, 0.55], [-1.05, -0.45], [0.15, 0.6], [1.35, -0.35], [2.35, 0.4],
  ];
  for (let i = 0; i < n; i++) {
    const a = anchors[i % anchors.length];
    F[2][i * 3] = a[0] + (r() - 0.5) * 0.9;
    F[2][i * 3 + 1] = a[1] + (r() - 0.5) * 0.62;
    F[2][i * 3 + 2] = (r() - 0.5) * 0.7;
  }
  // 4 — a stream pouring rightward and down, the exit ramp
  for (let i = 0; i < n; i++) {
    const t = r();
    const x = -2.4 + t * 5.0;
    const y = 1.15 - t * t * 2.6;
    const spread = 0.12 + t * 0.55;
    F[3][i * 3] = x + (r() - 0.5) * spread;
    F[3][i * 3 + 1] = y + (r() - 0.5) * spread * 0.8;
    F[3][i * 3 + 2] = (r() - 0.5) * spread;
  }
}

/* ------------------------------------------------------------- shaders */

const VERT = /* glsl */ `
uniform float uTime, uSize, uAmp, uDisperse, uDpr, uSilk;
uniform float uVel, uVelSlow, uScatter;
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

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  /* the sprite stretches with speed — motion blur without a post pass */
  gl_PointSize = uSize * uDpr * (0.62 + 0.85 * aRand)
    * (1.0 + abs(uVel) * 1.5) * (6.0 / max(0.5, -mv.z));

  float lum = 0.12 + 1.5 * aRand;
  float weave = 0.35 + 0.65 * smoothstep(-0.8, 0.85, n);
  vGlow = lum * mix(0.9, weave, uSilk) * mix(1.0, aEdge, uSilk) * (1.0 + abs(uVel) * 0.35);
  vTone = clamp(aRand * 1.5 + n * 0.25, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColor, uColor2;
uniform float uBright;
varying float vGlow, vTone;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float halo = smoothstep(0.5, 0.06, d);
  halo *= halo;
  float core = smoothstep(0.17, 0.0, d);
  gl_FragColor = vec4(mix(uColor, uColor2, vTone), (halo + core * 0.55) * vGlow * uBright);
}
`;

/* ------------------------------------------------------------- the scene */

export function createStudioScene(container, opts = {}) {
  const count = opts.count || 40000;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    if (!renderer.getContext()) return null;
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  renderer.setClearColor(opts.bg ?? 0x06080b, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  container.appendChild(renderer.domElement);

  const threads = Math.max(48, Math.round(Math.sqrt(count) * 1.35));
  const per = Math.max(2, Math.floor(count / threads));

  const RIBBON = new Float32Array(count * 3);
  const TORNADO = new Float32Array(count * 3);
  const SITE = new Float32Array(count * 3);
  const LATTICE = new Float32Array(count * 3);
  const PAGE = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const drift = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const edge = new Float32Array(count);
  const dragA = new Float32Array(count);
  const stiffA = new Float32Array(count);
  const FORM = [0, 1, 2, 3].map(() => new Float32Array(count * 3));

  buildRibbon(count, RIBBON, nrm, edge, rand, threads, per);
  buildTornado(count, TORNADO, threads, per);
  buildSite(count, SITE);
  buildLattice(count, LATTICE);
  buildPage(count, PAGE);
  buildFormations(count, FORM);

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
  [RIBBON, TORNADO, SITE, LATTICE, PAGE].forEach(recentre);

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
  const KEY = [TORNADO, RIBBON, SITE, LATTICE, PAGE];
  const SILK = [0.55, 1, 0, 0, 0]; // how cloth-like each form behaves

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
    uBright: { value: 1 },
    uColor: { value: new THREE.Color(opts.accent ?? 0x9db6cc) },
    uColor2: { value: new THREE.Color(opts.accent2 ?? 0xffd7a0) },
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
    { px: 3.4, py: 2.1, pz: 5.6, tx: 0, ty: 0.1, tz: 0, rx: 0.0 },
    { px: -1.7, py: 4.9, pz: 6.6, tx: 0, ty: 0.6, tz: 0, rx: 0.0 },
    { px: 0.0, py: 0.1, pz: 6.0, tx: 0, ty: 0.0, tz: 0, rx: 0.0 },
  ];

  let story = 0;
  let disperse = 0;
  let mode = 0;          // 0 = story spine, 1 = identity formations
  let slide = 0;         // position along the four formations
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

    /* the identity beat borrows the same points: blend the story form
       toward the current formation pair rather than mounting anything new */
    if (mode > 0) {
      const fi = Math.min(FORM.length - 2, Math.floor(slide));
      const ft = clamp01(slide - fi);
      const Fa = FORM[fi];
      const Fb = FORM[fi + 1];
      const m = sstep(clamp01(mode));
      for (let k = 0; k < count * 3; k++) {
        const f = Fa[k] + (Fb[k] - Fa[k]) * ft;
        base[k] += (f - base[k]) * m;
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
  /* identity beat: 0 = the page's own spine, 1 = the slide formations */
  const setMode = (m) => {
    mode = clamp01(m);
    dirty = true;
  };
  const setSlide = (v) => {
    slide = Math.max(0, Math.min(FORM.length - 1, v));
    dirty = true;
  };
  const setVelocity = (v) => {
    velTarget = Math.max(-1, Math.min(1, v));
  };
  const setPointer = (x, y) => {
    ptr.tx = x;
    ptr.ty = y;
  };

  const clock = new THREE.Clock();
  const BASE_SPIN = (Math.PI * 2) / 82;
  let spinAngle = 0;
  let lastT = 0;
  let raf = 0;
  let running = false;

  const step = (animate) => {
    const t = clock.getElapsedTime();
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
    if (animate) spinAngle += dt * BASE_SPIN * (1 + Math.pow(1 - Math.min(1, story), 2) * 22);
    spin.rotation.y = spinAngle * Math.min(1, silk * 1.6);

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
    renderer.setSize(w, h, false);
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
    setSlide,
    setVelocity,
    setPointer,
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
