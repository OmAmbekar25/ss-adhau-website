"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/* The fluid cursor trail — hero through the manifesto, then it hands over.
 *
 * The two cursor effects on this page are the same gesture in two
 * materials: the particle field parts around the pointer, and the fluid
 * leaves a wake behind it. In the hero they coexist. From the process
 * section on, the repulsion carries it alone — a wake drawn over a section
 * that is trying to be read is decoration, and the field's repulsion is
 * already saying the thing the wake would say.
 *
 * Three cases mount nothing at all, rather than mounting something and
 * turning it off:
 *
 *   Touch. A touchmove binding here would fight the scroll it overlaps,
 *   and there is no hover on a phone for a trail to follow anyway.
 *   Reduced motion. The whole point of the effect is the motion.
 *   No WebGL2 (or no float render targets). The solver needs both; there
 *   is no version of this worth showing without them.
 *
 * In all three the canvas never enters the DOM and the page is unchanged.
 */

const RM = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(RM).matches;

/* Cheap enough to run before deciding to mount: it makes a context, asks
   the one question that matters, and throws it away. */
function canRun() {
  if (!window.matchMedia("(pointer: fine)").matches) return false;
  if (window.matchMedia("(hover: none)").matches) return false;
  if ("ontouchstart" in window && navigator.maxTouchPoints > 0) {
    /* a laptop with a touchscreen still has a fine pointer, so this only
       rules out the devices that have nothing else */
    if (!window.matchMedia("(pointer: fine)").matches) return false;
  }
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    const ok = !!gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

export default function StudioFluid() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  /* The canvas is server-rendered and then taken back out on the first
     client pass if this machine is not one it should run on. Deciding at
     render time instead would mean guessing the pointer type and the GL
     capabilities on the server, which cannot be done — and an inert canvas
     left in the tree is not what "not mounted" means. */
  const [supported, setSupported] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (reduced) return;
    if (!canRun()) {
      setSupported(false);
      return;
    }
    const host = ref.current;
    if (!host) return;

    let dead = false;
    let sim = null;
    let raf = 0;
    let idleId = 0;
    let running = false;

    /* The zone: the hero, and only the hero. It used to run to the end of
       the manifesto, from when that section was the next stretch of the
       same dark page. The manifesto is the opaque panel now — it is drawn
       OVER this canvas, so anything still being solved under it is work
       nobody can see. The wake belongs to the hero and ends with it, on
       the same reasoning as the particle field (§2.2).
       Measured off the DOM once and on resize — never in the loop. */
    let zoneEnd = 0;
    let fadeFrom = 0;
    const measure = () => {
      const man = document.querySelector(".er-hero");
      if (!man) {
        zoneEnd = 0;
        return;
      }
      const r = man.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const h = man.offsetHeight;
      zoneEnd = top + h;
      /* the last 30% of the manifesto's own scroll is the fade */
      fadeFrom = top + h * 0.7;
    };

    const ease = (x) => 1 - Math.pow(1 - x, 3);

    const zoneAlpha = () => {
      if (!zoneEnd) return 0;
      const y = window.scrollY + window.innerHeight * 0.5;
      if (y <= fadeFrom) return 1;
      if (y >= zoneEnd) return 0;
      return 1 - ease((y - fadeFrom) / Math.max(1, zoneEnd - fadeFrom));
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      sim.step();
    };
    const start = () => {
      if (running || !sim) return;
      running = true;
      sim.resize();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      /* nothing should be hanging there when the visitor scrolls back up */
      sim.reset();
    };

    /* Scroll only decides two things — the canvas opacity and whether the
       loop runs at all. Both come off cached measurements. */
    const onScroll = () => {
      if (!sim) return;
      const a = zoneAlpha();
      sim.setAlpha(a);
      host.style.opacity = a === 0 ? "0" : "1";
      if (a <= 0.001) stop();
      else start();
    };

    const onMove = (e) => {
      if (!sim || !running) return;
      sim.pointer(e.clientX, e.clientY);
    };
    const onLeave = () => sim && sim.leave();

    const mount = () => {
      if (dead) return;
      import("@/lib/fluidTrail")
        .then(({ createFluidTrail }) => {
          if (dead) return;
          /* Ink, not silver: the trail composites with `multiply` now
             that the hero is white — see the note on `.er-fluid`. Kept
             well off pure black so the wake reads as a breath on the
             paper rather than a smear of paint. */
          sim = createFluidTrail(host, { color: "#2A2A2E" });
          if (!sim) {
            /* the probe passed and the build still failed — take the
               canvas back out rather than leave a dead layer */
            setSupported(false);
            return;
          }
          host.dataset.ready = "true";
          measure();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("pointermove", onMove, { passive: true });
          document.addEventListener("pointerleave", onLeave);
          onScroll();
        })
        .catch(() => {});
    };

    /* Same idle strategy as the particle canvas. The hero's type is
       already on screen by the time either of these exists. */
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(mount, { timeout: 2400 });
    } else {
      idleId = window.setTimeout(mount, 600);
    }

    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("resize", onResize);

    return () => {
      dead = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (sim) sim.dispose();
    };
  }, [reduced]);

  if (reduced || !supported) return null;
  return <canvas ref={ref} className="er-fluid" aria-hidden="true" />;
}
