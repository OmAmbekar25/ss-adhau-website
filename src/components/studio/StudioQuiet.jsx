"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field, onField } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* WI-5 — type has to win over the field.
 *
 * Measured before this existed: glyph-against-particle contrast in the hero
 * was 1.5:1 against a 4.5:1 floor, while the particles themselves ran at
 * 13.5:1 against the background — foreground brightness for a background
 * element. Two mechanisms, both in the scene, neither of them a scrim:
 *
 *   a per-section brightness cap, so the field is held down wherever type
 *   sits over it and left free where nothing does (the certificate, the
 *   funnel, the trusted band, which carry no copy across them);
 *
 *   text-block masks, which dim and shrink the points that land inside a
 *   heading or paragraph's box. They do not displace anything — moving
 *   points away from type would leave a hole shaped like the paragraph.
 *   The field stays continuous; the air the type sits in just goes quiet.
 *
 * Rects are measured on mount and on resize only, never per frame.
 */

const QUIET = "[data-quiet]";
/* how far the field is held down in a section that carries copy over it */
const CAP_TEXT = 0.42;
const CAP_FREE = 1;

export default function StudioQuiet() {
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll(QUIET));
    if (!blocks.length) return;

    let rects = [];

    /* NDC, because that is what the scene converts from — and it is
       resolution-independent, so a resize is the only thing that can
       invalidate it. */
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = field();
      if (!s) return;
      const feather = 60 * s.worldPerPx();

      rects = blocks.slice(0, 4).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          top: r.top + window.scrollY,
          height: r.height,
          left: r.left,
          width: r.width,
          vw,
          vh,
          feather,
        };
      });
      push();
    };

    /* The rect the scene needs is where the block sits ON SCREEN, and that
       changes with scroll — but only by translation, so it is recomputed
       from the stored page-space box rather than by touching the DOM. */
    const push = () => {
      const s = field();
      if (!s || !rects.length) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const out = [];
      for (const r of rects) {
        const top = r.top - window.scrollY;
        if (top + r.height < -80 || top > vh + 80) continue;
        out.push({
          x0: (r.left / vw) * 2 - 1,
          y0: (top / vh) * 2 - 1,
          x1: ((r.left + r.width) / vw) * 2 - 1,
          y1: ((top + r.height) / vh) * 2 - 1,
          feather: r.feather,
        });
        if (out.length === 4) break;
      }
      s.setTextRects(out);
      s.setCap(out.length ? CAP_TEXT : CAP_FREE);
    };

    measure();
    const unwait = onField(() => measure());
    window.addEventListener("resize", measure);

    /* one ScrollTrigger, no scrub maths — it just re-pushes the on-screen
       boxes as the page moves under them */
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.body.scrollHeight,
      onUpdate: push,
      onRefresh: measure,
    });

    return () => {
      unwait();
      window.removeEventListener("resize", measure);
      st.kill();
      const s = field();
      if (s) {
        s.setTextRects([]);
        s.setCap(CAP_FREE);
      }
    };
  }, []);

  return null;
}
