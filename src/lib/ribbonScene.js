import * as THREE from "three";

/**
 * The silk ribbon — one persistent particle structure, alive for the whole
 * page, drifting behind everything.
 *
 * A wide flat band is wound one and a half times around an invisible torus
 * and twisted as it goes, then sampled as points. Curl-ish simplex noise
 * displaces each point along the band's own normal and scrolls slowly
 * through time, so the silk never stops undulating. One draw call.
 *
 * The scene is told where it is by the page, not by scroll directly:
 *   setState({camX, camZ, rotX, bright, disperse})  — targets, eased in rAF
 *   setPointer(nx, ny)                              — normalised −1..1
 *   renderOnce()                                    — reduced motion: one frame
 *   resume() / pause() / dispose()
 *
 * Returns null when WebGL is unavailable — the page is then pure
 * typography on black, which the brief requires to stand on its own.
 */

const VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uAmp;
uniform float uDisperse;
uniform float uDpr;
uniform float uForm;

attribute float aRand;
attribute float aEdge;
attribute vec3 aNormalDir;
attribute vec3 aDrift;
attribute vec3 aTornado;

varying float vGlow;
varying float vTone;

/* Simplex 3D noise — Ashima Arts / Stefan Gustavson, MIT. */
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
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
  /* uForm 0 = the tornado it arrives as, 1 = the woven ribbon it settles
     into. Every point travels between its own two positions, so the funnel
     resolves into cloth rather than being swapped for it. */
  vec3 p = mix(aTornado, position, uForm);

  /* the silk undulates: noise along the band normal, scrolling in time.
     Scaled by uForm so the funnel stays crisp while it is still spinning. */
  float n = snoise(p * 1.15 + vec3(0.0, 0.0, uTime * 0.03));
  p += aNormalDir * n * uAmp * uForm;

  /* dissolution: the structure loosens into drifting motes */
  p += aDrift * uDisperse * (0.6 + aRand * 1.6);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  /* uSize is the sprite's size in px at the reference distance, so pulling
     the camera back thins the silk instead of erasing it */
  gl_PointSize = uSize * uDpr * (0.62 + 0.85 * aRand) * (6.0 / max(0.5, -mv.z));

  /* bright filaments and dim gauze in the same cloth, and a selvedge that
     goes to nothing rather than to noise */
  float lum = 0.12 + 1.5 * aRand;
  float weave = 0.35 + 0.65 * smoothstep(-0.8, 0.85, n);
  /* while it is still a funnel the selvedge fade does not apply — that
     belongs to cloth — so blend it in as the ribbon forms */
  vGlow = lum * mix(0.85, weave, uForm) * mix(1.0, aEdge, uForm);
  vTone = clamp(aRand * 1.5 + n * 0.25, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uColor2;
uniform float uBright;
varying float vGlow;
varying float vTone;

void main() {
  float d = length(gl_PointCoord - 0.5);
  /* soft halo, plus a small hot core so bright threads glint rather than
     glowing evenly — this is what separates silk from fog */
  float halo = smoothstep(0.5, 0.06, d);
  halo *= halo;
  float core = smoothstep(0.17, 0.0, d);
  float a = halo + core * 0.55;
  /* the bright filaments run warm, the gauze runs cool — colour arrives
     through the weave rather than being painted over it */
  vec3 tint = mix(uColor, uColor2, vTone);
  gl_FragColor = vec4(tint, a * vGlow * uBright);
}
`;

const lerp = (a, b, t) => a + (b - a) * t;

export function createRibbon(container, { count, accent, accent2 }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    if (!renderer.getContext()) return null;
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7.6);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  container.appendChild(renderer.domElement);

  /* ---------------- the band ---------------- */
  const R = 1.6; // torus radius
  const A = 1.05; // ribbon half-width — wide, so it reads as silk
  const B = 0.18; // ribbon half-thickness — flat
  const WRAPS = 1.5;

  const pos = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const drift = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const edge = new Float32Array(count);
  const tor = new Float32Array(count * 3);

  /* Points are laid along threads rather than scattered. Random sampling
     over the band gives a dust cloud; a warp of continuous strands running
     the length of it is what makes the eye read cloth. Each thread also
     carries its own brightness, so the ribbon has bright filaments and dim
     gauze in the same weave. */
  const THREADS = Math.max(48, Math.round(Math.sqrt(count) * 1.35));
  const PER = Math.max(2, Math.floor(count / THREADS));

  let i = 0;
  for (let t = 0; t < THREADS && i < count; t++) {
    const vBase = (t / (THREADS - 1)) * 2 - 1; // across the ribbon
    const threadLum = Math.pow(Math.random(), 1.7); // few bright, many dim
    const wBase = (Math.random() * 2 - 1) * 0.7;

    for (let k = 0; k < PER && i < count; k++, i++) {
      const u = (k + Math.random() * 0.4) / PER;
      const th = u * Math.PI * 2 * WRAPS;
      const twist = th * 1.35;

      // frame on the torus centreline
      const cx = Math.cos(th) * R;
      const cy = Math.sin(th) * R;
      const outX = Math.cos(th);
      const outY = Math.sin(th);

      // the ribbon's own axes, rotated by the twist
      const ca = Math.cos(twist);
      const sa = Math.sin(twist);

      const v = vBase + (Math.random() - 0.5) * 0.012;
      const across = v * A;
      const thru = (wBase + (Math.random() - 0.5) * 0.5) * B;

      const inPlane = across * ca - thru * sa;
      const outPlane = across * sa + thru * ca;

      pos[i * 3] = cx + outX * inPlane;
      pos[i * 3 + 1] = cy + outY * inPlane;
      pos[i * 3 + 2] = outPlane;

      // band normal: the direction the noise pushes each point
      nrm[i * 3] = outX * -sa;
      nrm[i * 3 + 1] = outY * -sa;
      nrm[i * 3 + 2] = ca;

      // where this mote goes when the structure dissolves
      const dl = Math.random() * Math.PI * 2;
      const dz = Math.random() * 2 - 1;
      const dr = Math.sqrt(Math.max(0, 1 - dz * dz));
      drift[i * 3] = Math.cos(dl) * dr;
      drift[i * 3 + 1] = Math.sin(dl) * dr * 0.7 + 0.25;
      drift[i * 3 + 2] = dz;

      /* the tornado: each thread spirals up a widening funnel, so the
         intro reads as one structure turning, not particles milling */
      const hh = k / PER;
      const rad = 0.22 + Math.pow(hh, 1.55) * 2.75;
      const ang = t * 0.37 + hh * 7.6;
      tor[i * 3] = Math.cos(ang) * rad + (Math.random() - 0.5) * 0.07;
      tor[i * 3 + 1] = -2.7 + hh * 5.5 + (Math.random() - 0.5) * 0.09;
      tor[i * 3 + 2] = Math.sin(ang) * rad + (Math.random() - 0.5) * 0.07;

      rand[i] = threadLum;
      /* the selvedge dissolves by going transparent, not by scattering —
         wisps, not noise */
      edge[i] = 1 - Math.pow(Math.abs(v), 2.6);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aNormalDir", new THREE.BufferAttribute(nrm, 3));
  geo.setAttribute("aDrift", new THREE.BufferAttribute(drift, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
  geo.setAttribute("aEdge", new THREE.BufferAttribute(edge, 1));
  geo.setAttribute("aTornado", new THREE.BufferAttribute(tor, 3));

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: 2.2 },
    uAmp: { value: 0.16 },
    uDisperse: { value: 0 },
    uDpr: { value: Math.min(window.devicePixelRatio, 1.75) },
    uForm: { value: 0 },
    uColor: { value: new THREE.Color(accent || 0x9fb4c8) },
    uColor2: { value: new THREE.Color(accent2 || 0xffd9a3) },
    uBright: { value: 1.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, material);

  /* tilted axis — the revolution is never square to the viewer */
  const tilt = new THREE.Group();
  tilt.rotation.x = 0.4;
  tilt.rotation.z = 0.15;
  const spin = new THREE.Group();
  spin.add(points);
  tilt.add(spin);
  scene.add(tilt);

  /* ---------------- state: targets, eased ---------------- */
  const target = { camX: 0, camZ: 7.6, rotX: 0.4, bright: 0.6, disperse: 0 };
  const actual = { ...target };
  const ptr = { tx: 0, ty: 0, x: 0, y: 0 };

  const setState = (next) => Object.assign(target, next);
  /* 0 = tornado, 1 = ribbon. Driven from the page's intro timeline. */
  const setForm = (v) => {
    uniforms.uForm.value = v < 0 ? 0 : v > 1 ? 1 : v;
  };
  const setPointer = (nx, ny) => {
    ptr.tx = nx;
    ptr.ty = ny;
  };

  const clock = new THREE.Clock();
  const BASE_SPIN = (Math.PI * 2) / 82; // one revolution ≈ 82s
  let spinAngle = 0;
  let lastT = 0;
  let raf = 0;
  let running = false;

  const step = (animate) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(0.05, t - lastT);
    lastT = t;

    if (animate) {
      /* The funnel turns hard and slows into the ribbon's ambient
         revolution as it forms — the deceleration is the whole trick. */
      const form = uniforms.uForm.value;
      spinAngle += dt * BASE_SPIN * (1 + (1 - form) * (1 - form) * 22);
      spin.rotation.y = spinAngle;
      uniforms.uTime.value = t;
    }

    for (const k of ["camX", "camZ", "rotX", "bright", "disperse"]) {
      actual[k] = animate ? lerp(actual[k], target[k], 0.06) : target[k];
    }
    ptr.x = lerp(ptr.x, ptr.tx, 0.022);
    ptr.y = lerp(ptr.y, ptr.ty, 0.022);

    tilt.rotation.x = actual.rotX + ptr.y * 0.06;
    tilt.rotation.z = 0.15 + ptr.x * 0.06;
    camera.position.x = actual.camX;
    camera.position.z = actual.camZ;
    camera.lookAt(0, 0, 0);
    uniforms.uBright.value = actual.bright;
    uniforms.uDisperse.value = actual.disperse;

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
    setState,
    setForm,
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
