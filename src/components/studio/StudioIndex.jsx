"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field, story } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The index gets the funnel.
 *
 * "What we are asked to value" is the page's list of what the firm does,
 * and it was the one substantial section the field ignored — it sat as the
 * ambient ribbon behind six quiet rows. The tornado is what makes the
 * section arrive: as it comes into frame the cloth unwinds back into the
 * funnel it first formed out of, turning hard, and settles again on the
 * way out.
 *
 * No pin. The whole beat is a function of how far the section has crossed
 * the viewport, so it scrubs backwards exactly and the page's pin budget
 * of two is untouched. Behaviour is attached to markup the server already
 * rendered, so the rows stay in the DOM and keep working without JS.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

export default function StudioIndex() {
  useEffect(() => {
    if (window.matchMedia(QUERY).matches) return;

    const sec = document.querySelector("[data-index]");
    if (!sec) return;

    const ctx = gsap.context(() => {
      /* A bell: ribbon at both edges, full funnel as the section centres.
         `story` 1 -> 0 -> 1, never a tween, so any scroll position maps to
         exactly one state and reversing is exact. */
      const spin = ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          /* peaks at the midpoint, eased so the unwind has weight */
          const bell = 1 - Math.abs(p - 0.5) * 2;
          const t = gsap.utils.clamp(0, 1, bell * 1.45);
          story(1 - t * t * (3 - 2 * t));
        },
        onLeave: () => story(1),
        onLeaveBack: () => story(1),
      });

      /* Hovering or focusing a row leans on the funnel: it brightens and
         turns harder for as long as the row is held. The row's own
         highlight is CSS and already there — this is the half that makes
         the section feel connected to the thing behind it. */
      const rows = gsap.utils.toArray("[data-row]", sec);
      const set = (v) => field()?.setFocus(v);
      const on = () => set(1);
      const off = () => set(0);

      rows.forEach((row) => {
        row.addEventListener("pointerenter", on);
        row.addEventListener("pointerleave", off);
        row.addEventListener("focusin", on);
        row.addEventListener("focusout", off);
      });

      return () => {
        rows.forEach((row) => {
          row.removeEventListener("pointerenter", on);
          row.removeEventListener("pointerleave", off);
          row.removeEventListener("focusin", on);
          row.removeEventListener("focusout", off);
        });
        spin.kill();
        set(0);
        story(1);
      };
    }, sec);

    return () => ctx.revert();
  }, []);

  return null;
}
