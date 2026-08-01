"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Entrance-only. The page is otherwise still.
 *
 * Nothing here pins and nothing travels sideways, and no canvas is
 * mounted on this route — this is a document, and the motion's whole job
 * is to let it arrive rather than to be looked at. Every block entrance
 * fires ONCE at 20% of the viewport and is then finished with.
 *
 * The one scrubbed thing is the reading fill: the paragraphs' words go
 * from the resting tone to full ink as the paragraph crosses the reading
 * band. It is scrubbed rather than fired because it is tied to where the
 * eye is, not to whether the block has arrived — and it is opacity only,
 * so it never triggers layout.
 *
 * The armed states live in CSS under `.er-js`, so a failure to reach this
 * file leaves a complete static page rather than an invisible one.
 *
 * GSAP is imported statically. It was dynamic for a while, on the
 * reasoning that an animation library should not delay the paint it
 * decorates — measured both ways on the production build and the scores
 * were identical, so the earlier claim that the split helped was noise.
 * Static is fewer moving parts, so static it is.
 *
 * The hero title and the eyebrow are NOT animated here: both are CSS
 * animations (see studio.css). A hero element that waits for this module
 * defines LCP whenever the module happens to arrive — and the eyebrow was
 * worse than late, it was a flash: it had no CSS armed state, so GSAP was
 * hiding an element the browser had already painted and then revealing it
 * again. Anything in the first viewport belongs in the stylesheet.
 */

const ENTER = "power3.out";

/* `rootSelector` lets the register reuse this verbatim. The hero pieces
   are all guarded, so a page without a hero image, a veil or a hero rule
   simply skips those steps rather than needing its own module. */
export default function ServiceMotion({ rootSelector = ".er-svc" }) {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    /* Reduced motion never loads the library at all: there is nothing for
       it to do, the words sit at full opacity by a `!important` in the
       stylesheet, and the armed states are dropped by removing the class
       that armed them. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("er-js");
      /* The word split is server-rendered, because the server cannot know
         this preference. With no fill to run there is nothing for it to
         do, so it is unwrapped back to a single text node. */
      root.querySelectorAll("[data-svc-read]").forEach((el) => {
        el.textContent = el.textContent;
      });
      return;
    }

    const ctx = build(gsap, ScrollTrigger, root);
    return () => ctx.revert();
  }, [rootSelector]);

  return null;
}

function build(gsap, ScrollTrigger, root) {
  return gsap.context(() => {
      /* ------------------------- the hero ------------------------- */
      /* 0.00s image settles out of 1.05 while the hue veil clears — this
         is the colour-world handoff from the slide the visitor clicked. */
      /* the class, not a data attribute — ServicePicture renders the <img>
         and only forwards a className to it */
      const heroImg = root.querySelector(".er-svchero__img");
      const veil = root.querySelector("[data-svc-veil]");
      const tl = gsap.timeline();

      if (heroImg) {
        tl.fromTo(
          heroImg,
          { scale: 1.05 },
          { scale: 1, duration: 1, ease: ENTER },
          0
        );
      }
      if (veil) {
        tl.fromTo(
          veil,
          { opacity: 0.2 },
          { opacity: 0, duration: 0.3, ease: "none" },
          0
        );
      }
      /* 0.45s the hairline draws */
      const heroRule = root.querySelector("[data-svc-herorule]");
      if (heroRule) {
        tl.fromTo(
          heroRule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: ENTER },
          0.45
        );
      }

      /* --------------------- the blocks below --------------------- */
      const once = (el, build) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          once: true,
          onEnter: build,
        });

      root.querySelectorAll("[data-svc-block]").forEach((block) => {
        once(block, () => {
          const t = gsap.timeline();
          const fades = block.querySelectorAll("[data-svc-fade]");
          if (fades.length) {
            t.to(fades, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: ENTER,
              stagger: 0.05, // the chips' 50ms, harmless elsewhere
            });
          }
          const rules = block.querySelectorAll("[data-svc-rule]");
          if (rules.length) {
            t.to(rules, { scaleX: 1, duration: 0.7, ease: ENTER }, 0.1);
          }
          /* the picture settles inside a mask that never moves */
          const imgs = block.querySelectorAll("[data-svc-mask] > img");
          if (imgs.length) {
            t.to(imgs, { scale: 1, duration: 0.9, ease: ENTER }, 0);
          }
        });
      });

    /* ---------------------- the reading fill --------------------- */
    /* One trigger per paragraph. The words are already in the markup —
       ReadingText splits on the server — so there is nothing to measure
       and nothing to build here beyond the tween.

       Begins when the paragraph's top reaches 85% of the viewport and is
       complete by 45%: the fill runs slightly ahead of where the eye
       lands, so a reader never catches up with it. */
    root.querySelectorAll("[data-svc-read]").forEach((para) => {
      const words = para.querySelectorAll("[data-w]");
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0.5 }, // the contrast floor, not the brief's 0.18 — see service.css
        {
          opacity: 1,
          ease: "none",
          stagger: { each: 0.01, from: "start" },
          scrollTrigger: {
            trigger: para,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        }
      );
    });

    ScrollTrigger.refresh();
  }, root);
}
