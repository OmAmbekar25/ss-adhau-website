"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* WI-8 — the Record arrives one piece at a time.
 *
 * It used to appear as a block, which is the one thing a section of
 * countable facts should not do: the figures are the point, and a block
 * gives the eye nowhere to land. The order is the order you would read it
 * in — eyebrow, headline, then each column assembling itself from its rule
 * upward, then the institutions cascading in.
 *
 * No count-up tickers: the numbers mask-reveal in place. A ticker turns a
 * measurement into a slot machine.
 *
 * Fires once, and force-completes if the visitor scrolls past faster than
 * the choreography runs — nothing may ever be left half-revealed.
 */

const QUERY = "(prefers-reduced-motion: reduce)";
const TOTAL = 2.2; // seconds, trigger to settled

export default function StudioRecord() {
  useEffect(() => {
    if (window.matchMedia(QUERY).matches) return;
    const sec = document.querySelector("[data-record]");
    if (!sec) return;

    const ctx = gsap.context(() => {
      const eyebrow = sec.querySelector("[data-rec-eyebrow]");
      const cols = gsap.utils.toArray("[data-rec-col]", sec);
      const orgLabel = sec.querySelector("[data-rec-orglabel]");
      const orgs = gsap.utils.toArray("[data-rec-org]", sec);

      const tl = gsap.timeline({ paused: true });

      /* 1 — the eyebrow tracks in */
      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, letterSpacing: "0.35em" },
          { opacity: 1, letterSpacing: "0.22em", duration: 0.6, ease: "power2.out" },
          0
        );
      }

      /* 2 — the headline's line masks */
      tl.to(
        sec.querySelectorAll(".er-line > span"),
        { yPercent: 0, duration: 0.9, ease: "power4.out" },
        0.15
      );

      /* 3 — each column assembles: rule draws, label fades, the figure
             mask-reveals upward, caption fades. 140ms between columns. */
      cols.forEach((col, i) => {
        const at = 0.5 + i * 0.14;
        const rule = col.querySelector(".er-rule");
        const label = col.querySelector("[data-rec-label]");
        const fig = col.querySelectorAll("[data-rec-fig] .er-line > span");
        const note = col.querySelector("[data-rec-note]");
        if (rule) tl.to(rule, { scaleX: 1, duration: 0.7, ease: "power3.out" }, at);
        if (label) tl.to(label, { opacity: 1, letterSpacing: "0.22em", duration: 0.4 }, at + 0.12);
        if (fig.length) tl.to(fig, { yPercent: 0, duration: 0.7, ease: "power4.out" }, at + 0.2);
        if (note) tl.to(note, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, at + 0.34);
      });

      /* 4 — the institutions cascade, 60ms apart, rules drawing with them */
      if (orgLabel) {
        tl.to(orgLabel, { opacity: 1, letterSpacing: "0.22em", duration: 0.4 }, 1.05);
      }
      if (orgs.length) {
        tl.to(
          orgs.map((o) => o.querySelector(".er-rule")).filter(Boolean),
          { scaleX: 1, duration: 0.45, ease: "power3.out", stagger: 0.06 },
          1.2
        );
        tl.to(
          orgs.map((o) => o.querySelector("[data-rec-orgname]")).filter(Boolean),
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.06 },
          1.26
        );
      }

      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top 78%",
        once: true,
        onEnter: () => tl.play(),
      });

      /* Scrolling past faster than the choreography runs must never strand
         a half-revealed row: leaving the section snaps whatever is still
         in flight to its end state. */
      const guard = ScrollTrigger.create({
        trigger: sec,
        start: "bottom top",
        onEnter: () => tl.progress(1),
        onLeaveBack: () => {
          if (tl.progress() > 0 && tl.progress() < 1) tl.progress(1);
        },
      });

      return () => {
        st.kill();
        guard.kill();
        tl.kill();
      };
    }, sec);

    return () => ctx.revert();
  }, []);

  return null;
}

export { TOTAL };
