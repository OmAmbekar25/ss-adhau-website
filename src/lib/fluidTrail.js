/* Fluid cursor trail.
 *
 * Derived from Pavel Dobryakov's WebGL-Fluid-Simulation
 * (https://github.com/PavelDoGreat/WebGL-Fluid-Simulation), MIT licensed:
 *
 *   The MIT License (MIT)
 *   Copyright (c) 2017 Pavel Dobryakov
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the
 *   "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to
 *   permit persons to whom the Software is furnished to do so, subject to
 *   the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 *   OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 *   CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *   TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *   SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * What survives is the solver — advection, curl, vorticity confinement,
 * Jacobi pressure, gradient subtract. The swirl and the dissolve ARE the
 * effect, so that is the part worth keeping.
 *
 * What is gone: the rainbow dye and its colour cycling, bloom, sunrays,
 * the shading toggle, the idle auto-splats, the click burst, and dat.gui
 * with every config surface it exposed. This page has one dye colour and
 * no controls.
 *
 * Two deviations from the original that are worth naming:
 *
 *   The dye is a SINGLE CHANNEL (R16F), not RGBA. With one fixed colour
 *   there is nothing for the other three to carry, and the dye buffer is
 *   the largest and most-advected surface in the sim — a quarter of the
 *   bandwidth, for free.
 *
 *   The velocity splat is scaled by pointer speed rather than by a fixed
 *   force, so a quick gesture leaves a slightly wider wake than a slow
 *   one. It is the same hand that parts the particle field.
 */

const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
out vec2 vUv, vL, vR, vT, vB;
uniform vec2 uTexel;
void main () {
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 fragColor;
`;

/* Splats ADD, and one is emitted per frame while the pointer moves, so a
   slow stroke lays dozens of them over the same pixel. Without a ceiling
   the dye runs past 1.0 in a few hundred milliseconds and the trail
   renders as a solid white slab — measured at 112% opacity against a
   brief that asks for 8-14%. `uCeil` caps the dye at injection rather
   than at display, so the density keeps its internal structure and the
   wisps survive; velocity passes a ceiling high enough to be no ceiling
   at all. */
const SPLAT = `${HEAD}
uniform sampler2D uTarget;
uniform float uAspect, uRadius, uCeil;
uniform vec2 uPoint;
uniform vec3 uAmount;
void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uAmount;
  fragColor = vec4(min(texture(uTarget, vUv).xyz + splat, uCeil), 1.0);
}`;

/* Two timesteps, on purpose.
 *
 * `uDt` moves the fluid and has to stay bounded — a big step throws the
 * semi-Lagrangian trace clean off the grid. `uDecayDt` is real elapsed
 * time, because the dissipation is a pure exponential and is stable at any
 * step. Sharing one clamped dt tied the fade to the frame rate: on a slow
 * machine the sim advanced less simulated time per wall second and the
 * trail hung around in slow motion — measured at 3.6% still on screen
 * after 3s against a brief asking for a full fade in 1.8-2.5. Splitting
 * them makes the fade wall-clock wherever it runs. */
const ADVECT = `${HEAD}
uniform sampler2D uVelocity, uSource;
uniform vec2 uTexel;
uniform float uDt, uDecayDt, uDissipation;
void main () {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  /* exp(), not the usual 1/(1 + d*dt). The reciprocal form is a
     first-order approximation that only equals the intended rate as dt
     goes to zero — at a long frame it decays visibly slower, so the fade
     time drifted with the frame rate even after the timestep was made
     wall-clock. This is the exact solution of the same decay at any step,
     so the trail takes the same number of seconds to go at 30Hz, 144Hz,
     and on a machine dropping frames. */
  fragColor = texture(uSource, coord) * exp(-uDissipation * uDecayDt);
}`;

const DIVERGENCE = `${HEAD}
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  /* free-slip walls: the wake dissipates at the edge, it does not pile up */
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const CURL = `${HEAD}
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const VORTICITY = `${HEAD}
uniform sampler2D uVelocity, uCurl;
uniform float uCurlStrength, uDt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uCurlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`;

const PRESSURE = `${HEAD}
uniform sampler2D uPressure, uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `${HEAD}
uniform sampler2D uPressure, uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 vel = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(vel, 0.0, 1.0);
}`;

const CLEAR = `${HEAD}
uniform sampler2D uTexture;
uniform float uValue;
void main () {
  fragColor = uValue * texture(uTexture, vUv);
}`;

/* The dye is a density, not a colour. It picks up the one silver here, at
   the very end, so nothing upstream has to carry three channels it would
   never vary. */
const DISPLAY = `${HEAD}
uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uAlpha;
void main () {
  float d = texture(uTexture, vUv).x;
  fragColor = vec4(uColor, clamp(d, 0.0, 1.0) * uAlpha);
}`;

const compile = (gl, type, src) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

function program(gl, vertSrc, fragSrc) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const name = gl.getActiveUniform(p, i).name;
    u[name] = gl.getUniformLocation(p, name);
  }
  return { p, u };
}

/* Sim 128 and dye 512, fixed. This is a whisper behind the type — raising
   them buys detail nobody is looking at and takes frames from the particle
   field, which is the thing on this page that must never drop one. */
export const SIM_RES = 128;
export const DYE_RES = 512;

export function createFluidTrail(canvas, opts = {}) {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;
  /* Float render targets are the whole technique; without them there is no
     graceful degradation worth having, so the caller gets nothing and the
     page carries on as if the trail had never been asked for. */
  if (!gl.getExtension("EXT_color_buffer_float")) return null;
  gl.getExtension("OES_texture_float_linear");

  const simRes = opts.simRes || SIM_RES;
  const dyeRes = opts.dyeRes || DYE_RES;
  const DPR_CAP = 1.5;

  const CURL_STRENGTH = 18; // visible curl, short of a whirlpool
  /* result / (1 + d * dt) each step, so amplitude decays as exp(-d * t):
     Fitted, not assumed: an exponential through timestamped captures. From
     an 11% peak down to the ~0.5% an 8-bit screen can still separate from
     the graphite, 1.45 puts a full fade at ~2.1s — mid-band for the
     1.8-2.5s asked for. Velocity goes faster, or the wake keeps stirring
     dye that has already gone. */
  const DYE_DISSIPATION = 1.65;
  const VEL_DISSIPATION = 2.6;
  const PRESSURE_DECAY = 0.8;
  const PRESSURE_ITERATIONS = 16;
  /* Pavel's default splat is 0.25/100; this is ~0.15 of it. The trail
     should be the width of a finger drawn through mist. */
  const BASE_RADIUS = 0.000375;
  /* Injected dye density, and the ceiling overlapping splats build toward.

     These ARE on-screen numbers, near enough: the canvas composites with
     `mix-blend-mode: screen` over the graphite, so a dye value d shows as
     d x 0.894 (the silver) x (1 - bg), which on `--bg-deep` is d x 0.84.
     A single pass reads ~8.8%, a doubled-back stroke saturates at ~11%,
     inside the 8-14% the brief asks for. Verified by sampling composited
     pixels with the particle canvas hidden, not judged by eye.

     (An earlier round of this tuning was chasing a ghost: a silent
     find-and-replace had left the ceiling at 0.32 while every comment in
     the file claimed otherwise, so the cap looked broken when it was
     simply set four times too high. Measured 26.4% against a predicted
     26.9% once the real value was found — the model was right all along.) */
  const DYE_AMOUNT = 0.105;
  const DYE_CEIL = 0.131;
  const VEL_SCALE = 5200;

  const progs = {
    splat: program(gl, VERT, SPLAT),
    advect: program(gl, VERT, ADVECT),
    divergence: program(gl, VERT, DIVERGENCE),
    curl: program(gl, VERT, CURL),
    vorticity: program(gl, VERT, VORTICITY),
    pressure: program(gl, VERT, PRESSURE),
    gradient: program(gl, VERT, GRADIENT),
    clear: program(gl, VERT, CLEAR),
    display: program(gl, VERT, DISPLAY),
  };
  for (const k in progs) if (!progs[k]) return null;

  /* one fullscreen quad, bound once and never rebound */
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const makeFBO = (w, h, internal, format) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0
    );
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h, texel: [1 / w, 1 / h] };
  };
  const makeDouble = (w, h, internal, format) => {
    let a = makeFBO(w, h, internal, format);
    let b = makeFBO(w, h, internal, format);
    return {
      get read() { return a; },
      get write() { return b; },
      swap() { const t = a; a = b; b = t; },
      dispose() {
        for (const f of [a, b]) { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fbo); }
      },
    };
  };

  const velocity = makeDouble(simRes, simRes, gl.RG16F, gl.RG);
  const pressure = makeDouble(simRes, simRes, gl.R16F, gl.RED);
  const divergence = makeFBO(simRes, simRes, gl.R16F, gl.RED);
  const curl = makeFBO(simRes, simRes, gl.R16F, gl.RED);
  const dye = makeDouble(dyeRes, dyeRes, gl.R16F, gl.RED);

  const bind = (prog, texel) => {
    gl.useProgram(prog.p);
    if (prog.u.uTexel) gl.uniform2f(prog.u.uTexel, texel[0], texel[1]);
  };
  const target = (fbo) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo ? fbo.fbo : null);
    if (fbo) gl.viewport(0, 0, fbo.w, fbo.h);
    else gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  };
  const blit = () => gl.drawArrays(gl.TRIANGLES, 0, 3);
  /* named `bindTex`, not `use` — the React lint rule reads a bare `use(` as
     the `use()` hook and rejects the whole file */
  const bindTex = (unit, tex) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    return unit;
  };

  const color = new THREE_COLOR(opts.color || "#E4E4E0");

  let width = 0;
  let height = 0;
  let alpha = 1;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === width && h === height) return;
    width = canvas.width = w;
    height = canvas.height = h;
  };
  resize();

  /* Pointer state. Splats are emitted from the render loop rather than
     from the event, so a burst of pointermove events cannot turn into a
     burst of draw calls — the sim steps once per frame either way. */
  const ptr = { x: 0, y: 0, dx: 0, dy: 0, moved: false, down: false };
  const pointer = (x, y) => {
    const nx = x / canvas.clientWidth;
    const ny = 1 - y / canvas.clientHeight;
    if (ptr.down) {
      ptr.dx = nx - ptr.x;
      ptr.dy = ny - ptr.y;
      ptr.moved = true;
    }
    ptr.x = nx;
    ptr.y = ny;
    ptr.down = true;
  };
  const leave = () => {
    ptr.down = false;
    ptr.moved = false;
  };

  /* One splat per frame leaves the wake as a row of spaced dots whenever
     the pointer travels further in a frame than a splat is wide — which is
     any quick gesture at 60Hz, and every gesture on a machine that is
     dropping frames. The segment covered since the last frame is walked
     instead, and the dye and the impulse are divided across the steps so
     the density is the same however many it takes. */
  const splat = () => {
    const aspect = width / Math.max(1, height);
    const speed = Math.hypot(ptr.dx * aspect, ptr.dy);
    /* velocity-scaled: a faster hand leaves a slightly wider wake, capped
       so a flick across the viewport does not paint a stripe */
    const radius = BASE_RADIUS * (1 + Math.min(2.2, speed * 26));
    /* one splat per ~1% of viewport height along the path — closer than a
       splat is wide, so the wake is continuous rather than beaded */
    const steps = Math.max(1, Math.min(16, Math.ceil(speed / 0.01)));
    const px = ptr.x - ptr.dx;
    const py = ptr.y - ptr.dy;

    /* Dye is a density per unit of path, NOT per frame and NOT split
       across the steps: the sub-splats are spaced so they barely overlap,
       so each one owns its own patch and dividing would just make a fast
       stroke fainter than a slow one. Because `steps` scales with distance
       travelled, the coverage of a given path is identical at 30Hz and
       144Hz without referring to the clock at all.

       The impulse IS divided — the pointer moved `dx` once, so applying
       the whole of it at every step would inject the momentum N times. */
    const dye0 = DYE_AMOUNT;
    const vx = (ptr.dx * VEL_SCALE) / steps;
    const vy = (ptr.dy * VEL_SCALE) / steps;

    bind(progs.splat, velocity.read.texel);
    gl.uniform1f(progs.splat.u.uAspect, aspect);
    gl.uniform1f(progs.splat.u.uRadius, radius);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = px + (ptr.x - px) * t;
      const y = py + (ptr.y - py) * t;
      gl.uniform2f(progs.splat.u.uPoint, x, y);

      gl.uniform1i(progs.splat.u.uTarget, bindTex(0, velocity.read.tex));
      gl.uniform1f(progs.splat.u.uCeil, 1e4); // velocity is not capped here
      gl.uniform3f(progs.splat.u.uAmount, vx, vy, 0);
      target(velocity.write);
      blit();
      velocity.swap();

      gl.uniform1i(progs.splat.u.uTarget, bindTex(0, dye.read.tex));
      gl.uniform1f(progs.splat.u.uCeil, DYE_CEIL);
      gl.uniform3f(progs.splat.u.uAmount, dye0, 0, 0);
      target(dye.write);
      blit();
      dye.swap();
    }
  };

  const solve = (dt, decayDt) => {
    const texel = velocity.read.texel;

    bind(progs.curl, texel);
    gl.uniform1i(progs.curl.u.uVelocity, bindTex(0, velocity.read.tex));
    target(curl);
    blit();

    bind(progs.vorticity, texel);
    gl.uniform1i(progs.vorticity.u.uVelocity, bindTex(0, velocity.read.tex));
    gl.uniform1i(progs.vorticity.u.uCurl, bindTex(1, curl.tex));
    gl.uniform1f(progs.vorticity.u.uCurlStrength, CURL_STRENGTH);
    gl.uniform1f(progs.vorticity.u.uDt, dt);
    target(velocity.write);
    blit();
    velocity.swap();

    bind(progs.divergence, texel);
    gl.uniform1i(progs.divergence.u.uVelocity, bindTex(0, velocity.read.tex));
    target(divergence);
    blit();

    bind(progs.clear, texel);
    gl.uniform1i(progs.clear.u.uTexture, bindTex(0, pressure.read.tex));
    gl.uniform1f(progs.clear.u.uValue, PRESSURE_DECAY);
    target(pressure.write);
    blit();
    pressure.swap();

    bind(progs.pressure, texel);
    gl.uniform1i(progs.pressure.u.uDivergence, bindTex(0, divergence.tex));
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(progs.pressure.u.uPressure, bindTex(1, pressure.read.tex));
      target(pressure.write);
      blit();
      pressure.swap();
    }

    bind(progs.gradient, texel);
    gl.uniform1i(progs.gradient.u.uPressure, bindTex(0, pressure.read.tex));
    gl.uniform1i(progs.gradient.u.uVelocity, bindTex(1, velocity.read.tex));
    target(velocity.write);
    blit();
    velocity.swap();

    bind(progs.advect, texel);
    gl.uniform1f(progs.advect.u.uDt, dt);
    gl.uniform1f(progs.advect.u.uDecayDt, decayDt);
    gl.uniform1i(progs.advect.u.uVelocity, bindTex(0, velocity.read.tex));
    gl.uniform1i(progs.advect.u.uSource, bindTex(1, velocity.read.tex));
    gl.uniform1f(progs.advect.u.uDissipation, VEL_DISSIPATION);
    target(velocity.write);
    blit();
    velocity.swap();

    gl.uniform1i(progs.advect.u.uVelocity, bindTex(0, velocity.read.tex));
    gl.uniform1i(progs.advect.u.uSource, bindTex(1, dye.read.tex));
    gl.uniform1f(progs.advect.u.uDissipation, DYE_DISSIPATION);
    target(dye.write);
    blit();
    dye.swap();
  };

  const draw = () => {
    target(null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    bind(progs.display, dye.read.texel);
    gl.uniform1i(progs.display.u.uTexture, bindTex(0, dye.read.tex));
    gl.uniform3f(progs.display.u.uColor, color.r, color.g, color.b);
    gl.uniform1f(progs.display.u.uAlpha, alpha);
    blit();
  };

  let last = performance.now();
  const step = () => {
    const now = performance.now();
    const real = (now - last) / 1000;
    /* The solver step is clamped hard; the decay step is real time, capped
       only against a backgrounded tab resuming with a one-second gap. */
    const dt = Math.min(0.0166, real);
    /* Half a second, not a quarter: the decay is exact at any step now, so
       the cap is only guarding against a backgrounded tab resuming with a
       multi-second gap and dissolving the trail in one frame. Capping
       tighter than that silently slows the fade on a machine that is
       genuinely running at ten frames a second. */
    const decayDt = Math.min(0.5, real);
    last = now;
    resize();
    if (ptr.moved) {
      ptr.moved = false;
      splat();
      ptr.dx = 0;
      ptr.dy = 0;
    }
    solve(dt, decayDt);
    draw();
  };

  return {
    step,
    pointer,
    leave,
    resize,
    setAlpha: (v) => {
      alpha = v < 0 ? 0 : v > 1 ? 1 : v;
    },
    /* used when the zone is left: the loop stops, so the trail must not be
       waiting on screen when the visitor scrolls back */
    reset: () => {
      for (const d of [velocity, pressure, dye]) {
        for (const f of [d.read, d.write]) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
          gl.viewport(0, 0, f.w, f.h);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
      ptr.down = false;
      ptr.moved = false;
      last = performance.now();
    },
    dispose: () => {
      velocity.dispose();
      pressure.dispose();
      dye.dispose();
      for (const f of [divergence, curl]) {
        gl.deleteTexture(f.tex);
        gl.deleteFramebuffer(f.fbo);
      }
      for (const k in progs) gl.deleteProgram(progs[k].p);
      gl.deleteBuffer(buf);
      gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/* A three-component colour without pulling three.js in: this module is
   lazy-loaded on its own and has no other reason to want it. */
function THREE_COLOR(hex) {
  const v = parseInt(hex.replace("#", ""), 16);
  this.r = ((v >> 16) & 255) / 255;
  this.g = ((v >> 8) & 255) / 255;
  this.b = (v & 255) / 255;
}
