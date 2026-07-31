"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field, story } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The index gets the funnel, and one colour world per service.
 *
 * "What we are asked to value" is the page's list of what the firm does,
 * and it was the one substantial section the field ignored. Two things run
 * here:
 *
 *   the funnel — as the section crosses the frame the cloth unwinds back
 *   into the tornado it first formed out of, and settles again on the way
 *   out. No pin: it is a function of how far the section has travelled, so
 *   it scrubs backwards exactly and the page's budget of two is untouched.
 *
 *   the hue — exactly one row is active at a time, and its hue reaches the
 *   particle field, an ambient wash behind it, and the row's own furniture.
 *   Pointer and keyboard activate fully; scrolling with the pointer away
 *   from the list activates the row crossing the centre at half strength,
 *   colour only.
 *
 * Behaviour attaches to markup the server already rendered, so the rows
 * stay in the DOM and keep working without JS.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

const TINT_HOVER = 0.55;
const TINT_SOFT = 0.28;
const LEAVE_GRACE = 300; // ms before the list eases back to neutral

export default function StudioIndex() {
  useEffect(() => {
    const reduced = window.matchMedia(QUERY).matches;
    const sec = document.querySelector("[data-index]");
    if (!sec) return;

    const rows = Array.from(sec.querySelectorAll("[data-row]"));
    const wash = sec.querySelector("[data-wash]");
    if (!rows.length) return;

    /* ---------------------------------------------------------------
       The active row. One at a time, always. `held` is a pointer or
       keyboard activation and outranks `soft`, which is the scrolled-past
       state. Writing the state is one function so the two can never
       disagree about which row is lit.
       --------------------------------------------------------------- */
    let held = -1;
    let soft = -1;
    let graceId = 0;
    let raf = 0;

    const paint = () => {
      const active = held >= 0 ? held : soft;
      const strong = held >= 0;
      const hue = active >= 0 ? rows[active].dataset.hue : null;

      rows.forEach((row, i) => {
        const state = i === active ? (strong ? "true" : "soft") : "false";
        if (row.dataset.active !== state) row.dataset.active = state;
      });

      if (hue) sec.style.setProperty("--row-hue", hue);
      /* the hue property is left in place while fading out, so the wash
         and the field ease through colour rather than snapping to grey */

      if (wash) {
        wash.style.opacity = active < 0 ? "0" : strong ? "0.14" : "0.08";
        if (active >= 0) {
          const r = rows[active].getBoundingClientRect();
          const s = sec.getBoundingClientRect();
          wash.style.transform = `translate3d(0, ${
            r.top - s.top + r.height / 2
          }px, 0)`;
        }
      }

      const f = field();
      if (f) {
        f.setTint(hue, active < 0 ? 0 : strong ? TINT_HOVER : TINT_SOFT);
        /* holding a row also leans on the funnel — it turns harder and
           lifts in brightness, which is the coupling that makes the
           section feel connected to the field behind it */
        f.setFocus(strong ? 1 : 0);
      }
      if (active >= 0) startPump();
    };

    /* The scene's tint lapses if nothing restates it — that is what keeps
       it at zero in every other section. So restate it, but only while a
       row is actually lit: when nothing is, stopping the loop IS the fade,
       because lapsing is what returns the field to neutral. */
    const pump = () => {
      const active = held >= 0 ? held : soft;
      if (active < 0) {
        raf = 0;
        return;
      }
      field()?.setTint(
        rows[active].dataset.hue,
        held >= 0 ? TINT_HOVER : TINT_SOFT
      );
      raf = requestAnimationFrame(pump);
    };
    const startPump = () => {
      if (!raf) raf = requestAnimationFrame(pump);
    };

    const setHeld = (i) => {
      window.clearTimeout(graceId);
      held = i;
      paint();
    };
    /* the grace delay is what stops a flicker to neutral while the pointer
       crosses the gap between two rows */
    const releaseHeld = () => {
      window.clearTimeout(graceId);
      graceId = window.setTimeout(() => {
        held = -1;
        paint();
      }, LEAVE_GRACE);
    };

    const listeners = [];
    const bind = (el, type, fn) => {
      el.addEventListener(type, fn);
      listeners.push([el, type, fn]);
    };

    rows.forEach((row, i) => {
      bind(row, "pointerenter", () => setHeld(i));
      bind(row, "focusin", () => setHeld(i));
      bind(row, "focusout", releaseHeld);
    });
    const list = rows[0].parentElement;
    if (list) bind(list, "pointerleave", releaseHeld);

    /* Touch: the first tap activates, the second follows the link. The
       rows stay real links, so nothing is lost if this never runs. */
    if (!window.matchMedia("(pointer: fine)").matches) {
      rows.forEach((row, i) => {
        bind(row, "click", (e) => {
          if (held !== i) {
            e.preventDefault();
            setHeld(i);
          }
        });
      });
    }

    paint();

    const ctx = gsap.context(() => {
      if (reduced) return;

      /* the funnel: a bell over the section's own travel */
      const spin = ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const bell = 1 - Math.abs(p - 0.5) * 2;
          const t = gsap.utils.clamp(0, 1, bell * 1.45);
          story(1 - t * t * (3 - 2 * t));

          /* scroll-soft: the row crossing the viewport's centre, but only
             while nothing is being held */
          const mid = window.innerHeight / 2;
          let best = -1;
          let bestD = Infinity;
          rows.forEach((row, i) => {
            const r = row.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) return;
            const d = Math.abs(r.top + r.height / 2 - mid);
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          });
          if (best !== soft) {
            soft = best;
            paint();
          }
        },
        onLeave: () => {
          story(1);
          soft = -1;
          paint();
        },
        onLeaveBack: () => {
          story(1);
          soft = -1;
          paint();
        },
      });

      return () => spin.kill();
    }, sec);

    return () => {
      ctx.revert();
      listeners.forEach(([el, type, fn]) => el.removeEventListener(type, fn));
      window.clearTimeout(graceId);
      if (raf) cancelAnimationFrame(raf);
      held = -1;
      soft = -1;
      paint();
      field()?.setTint(null, 0);
      field()?.setFocus(0);
      story(1);
    };
  }, []);

  return null;
}
