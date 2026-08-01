"use client";

import { useEffect } from "react";

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
 * GSAP and ScrollTrigger are imported DYNAMICALLY. Statically they land in
 * the page's first chunk and are parsed before hydration finishes, and on
 * a throttled mobile profile that showed up as 93% of LCP spent in render
 * delay — the hero image had arrived (preload put its load delay at 0%)
 * and simply could not be painted, because the main thread was busy with
 * an animation library that exists to decorate the page after it appears.
 * Entrance motion has no business delaying the entrance.
 */

const ENTER = "power3.out";

export default function ServiceMotion() {
  useEffect(() => {
    const root = document.querySelector(".er-svc");
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

    let ctx = null;
    let dead = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then((mods) => {
      if (dead) return;
      const gsap = mods[0].default || mods[0];
      const { ScrollTrigger } = mods[1];
      gsap.registerPlugin(ScrollTrigger);
      ctx = build(gsap, ScrollTrigger, root);
    });

    return () => {
      dead = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}

function build(gsap, ScrollTrigger, root) {
  return gsap.context(() => {
      /* Hand the armed states over from CSS to GSAP before tweening any of
         them. GSAP reads a CSS `translateY(115%)` off the computed matrix
         as a pixel `y`, not as yPercent, so tweening yPercent alone
         animates nothing and the line stays clipped — which is exactly
         what happened here: the hero title rendered as an empty gap. Same
         trap, and the same fix, as the studio page's headline. */
      gsap.set(root.querySelectorAll("[data-svc-title] .er-line > span"), {
        yPercent: 115,
        y: 0,
      });

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
      /* 0.20s the numeral tracks in, the title unmasks */
      tl.fromTo(
        root.querySelectorAll("[data-svc-track]"),
        { opacity: 0, letterSpacing: "0.35em" },
        { opacity: 1, letterSpacing: "0.22em", duration: 0.7, ease: ENTER },
        0.2
      );
      tl.fromTo(
        root.querySelectorAll("[data-svc-title] .er-line > span"),
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9, ease: ENTER, stagger: 0.06 },
        0.2
      );
      /* 0.45s the hairline draws */
      tl.fromTo(
        root.querySelector("[data-svc-herorule]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: ENTER },
        0.45
      );

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
