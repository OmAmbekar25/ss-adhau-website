"use client";

import { useEffect } from "react";

/* The row colour worlds.
 *
 * Two activation paths, and the original reason for both still holds: a
 * pointer says exactly which row you mean, and a scroll says only roughly.
 * So a pointer gets the full treatment — panel, hairline, tinted numeral,
 * and the tag giving way to the description — and a scroll gets colour
 * only, at half strength, with the description left alone. A description
 * sliding in under a finger that is only passing through would be noise.
 *
 * Keyboard focus counts as a pointer: a row you have tabbed to is a row
 * you have chosen, so it gets the description too. That is also what makes
 * the swap operable without a mouse.
 *
 * Everything is CSS state; this only decides which row is `data-active`
 * and whether it is "true" or "soft". No styles are written from here.
 */

const SOFT_BAND = 0.42; // the row nearest this fraction of the viewport

export default function RegisterRows() {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll("[data-row]"));
    if (!rows.length) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    let pointed = null;
    let focused = null;

    const paint = (soft) => {
      const hard = pointed || focused;
      rows.forEach((r) => {
        if (r === hard) r.dataset.active = "true";
        else if (!hard && r === soft) r.dataset.active = "soft";
        else r.dataset.active = "false";
      });
    };

    /* the soft state is a pure function of scroll position, recomputed on
       a frame rather than on every scroll event */
    let queued = false;
    let softRow = null;
    const measure = () => {
      queued = false;
      const line = window.innerHeight * SOFT_BAND;
      let best = null;
      let bestD = Infinity;
      for (const r of rows) {
        const b = r.getBoundingClientRect();
        if (b.bottom < 0 || b.top > window.innerHeight) continue;
        const d = Math.abs(b.top + b.height / 2 - line);
        if (d < bestD) {
          bestD = d;
          best = r;
        }
      }
      softRow = best;
      paint(softRow);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    const binds = [];
    rows.forEach((r) => {
      const enter = () => {
        pointed = r;
        paint(softRow);
      };
      const leave = () => {
        if (pointed === r) pointed = null;
        paint(softRow);
      };
      const fin = () => {
        focused = r;
        paint(softRow);
      };
      const fout = (e) => {
        if (r.contains(e.relatedTarget)) return;
        if (focused === r) focused = null;
        paint(softRow);
      };
      if (fine) {
        r.addEventListener("pointerenter", enter);
        r.addEventListener("pointerleave", leave);
      }
      r.addEventListener("focusin", fin);
      r.addEventListener("focusout", fout);
      binds.push([r, enter, leave, fin, fout]);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      binds.forEach(([r, enter, leave, fin, fout]) => {
        r.removeEventListener("pointerenter", enter);
        r.removeEventListener("pointerleave", leave);
        r.removeEventListener("focusin", fin);
        r.removeEventListener("focusout", fout);
      });
    };
  }, []);

  return null;
}
