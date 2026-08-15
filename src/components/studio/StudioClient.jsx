"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { attachField } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ENTER = "power4.out"; // the expo-like entrance curve
/* §1.2 — the field inverts with the hero. It was silver on graphite:
   near-white filaments, mid-grey body, dim gauze, and brightness doing
   the work of opacity under additive blending. On white it is one ink,
   composited normally, with depth carried by alpha alone (0.65–0.85 in
   the shader) and ~8% of the points at the tornado's core carrying the
   brand orange. */
const INK = 0x0b0b0c;
const ACCENT = 0xf15524; // --brand-orange, measured off the firm's logo
/* §2.2 — the panel handover. The field is gone by the time the panel has
   covered 60% of the hero, so no particle is ever seen beside or through
   the incoming content. */
const FADE_BY = 0.6;
/* …and the renderer is released 500ms after full coverage, not instantly:
   a reader who overshoots the boundary and comes straight back should
   find the field still up rather than pay for a rebuild. */
const DISPOSE_GRACE = 500;

/* Where each section sits on the field's spine (see lib/studioScene.js):
   0 tornado · 1 ribbon · 2 site · 3 lattice · 4 page. Everything outside
   the method section rests at the ribbon; the method section walks it. */
const STORY_REST = 1;

function particleCount() {
  const w = window.innerWidth;
  if (w >= 1280) return 64000;
  if (w >= 768) return 30000;
  return 12000;
}

export default function StudioClient() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = document.querySelector(".er");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    let ribbon = null;
    let idleId = 0;
    let dead = false;
    let introPlayed = false;

    /* §2.2 — THE FIELD BELONGS TO THE HERO AND DIES WITH IT.
     *
     * `coverage` is how far the incoming panel has drawn itself over the
     * hero: 0 when its top edge is at the fold, 1 when it reaches the top
     * of the viewport. Everything the field does on scroll is a pure
     * function of that one number, so scrubbing backwards is exact.
     *
     * NOTE, and it is the significant one on this page: the field is now
     * hero-only. The method journey's five formations, the showcase's
     * colour worlds, the trusted-by band coupling and the closing
     * disperse all spoke to this scene and are inert from here on —
     * `attachField(null)` makes every one of them a guarded no-op rather
     * than an error. Accepted deliberately; logged in §15 with the call
     * sites named, to be rebuilt with the colour-rhythm brief. */
    let coverage = 0;
    let disposeTimer = 0;
    const fadeFor = (p) => 1 - Math.min(1, Math.max(0, p / FADE_BY));

    const releaseField = () => {
      if (!ribbon) return;
      attachField(null);
      ribbon.dispose();
      ribbon = null;
      if (canvasRef.current) delete canvasRef.current.dataset.ready;
    };

    /* The arrival: a spinning funnel that settles into the ribbon. The
       spin-down is handled inside the scene; this only drives the shape.
       Long and heavily eased — it should look like something coming to
       rest, not like a transition finishing. */
    const playIntro = () => {
      if (!ribbon || introPlayed) return;
      introPlayed = true;
      const form = { v: 0 };
      ribbon.setStory(0);
      gsap.to(form, {
        v: STORY_REST,
        duration: 5.2,
        ease: "power2.inOut",
        onUpdate: () => ribbon && ribbon.setStory(form.v),
      });
    };

    /* ---------------------------------------------------------------
       The field. Mounted after first paint so the headline is readable
       before the scene exists, and skipped entirely without WebGL.

       This function is now callable more than once: §2.2 disposes the
       renderer when the panel has covered the hero and re-initialises it
       on the way back up. The formation buffers are cached inside
       studioScene, so the second build uploads geometry rather than
       computing it.
       --------------------------------------------------------------- */
    const mountRibbon = () => {
      if (dead || ribbon || !canvasRef.current) return;
      import("@/lib/studioScene")
        .then(({ createStudioScene }) => {
          if (dead || ribbon || !canvasRef.current) return;
          ribbon = createStudioScene(canvasRef.current, {
            /* Reduced motion gets a genuinely sparser scatter rather than
               the full field held still — §2.4 asks for a composition,
               and 64,000 frozen dots is a texture. */
            count: reduced
              ? Math.round(particleCount() * 0.3)
              : particleCount(),
            core: INK,
            base: INK,
            faint: INK,
            accent: ACCENT,
          });
          if (!ribbon) return; // no WebGL — pure typography, as specified
          attachField(ribbon);

          canvasRef.current.dataset.ready = "true";
          if (reduced) {
            ribbon.setStory(STORY_REST); // no funnel — the settled ribbon
            ribbon.renderOnce();
          } else {
            /* On a re-init the field is arriving underneath a panel that
               is already partly drawn back down, so it must come up at
               the coverage the scroll is actually at — not at full
               strength, which would flash. */
            ribbon.setFade(fadeFor(coverage));
            ribbon.resume();
            if (introPlayed) ribbon.setStory(STORY_REST);
            else playIntro();
          }
        })
        .catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(mountRibbon, { timeout: 1800 });
    } else {
      idleId = window.setTimeout(mountRibbon, 400);
    }

    /* Reduced motion stops here: everything is already in its final state,
       the ribbon is a single frame, and no scroll machinery runs. */
    if (reduced) {
      html.classList.remove("er-loading");
      return () => {
        dead = true;
        releaseField();
      };
    }

    const ctx = gsap.context(() => {
      /* Hand the armed states over from CSS to GSAP before tweening any of
         them. GSAP reads a CSS `translateY(115%)` off the computed matrix as
         a pixel `y`, not as yPercent — so tweening yPercent alone would
         animate nothing and the line would stay clipped. Same visual
         position, so re-declaring it here cannot flash. */
      gsap.set(".er-line > span", { yPercent: 115, y: 0 });
      gsap.set(".er-fade", { opacity: 0, y: 24 });
      gsap.set(".er-track", { opacity: 0, letterSpacing: "0.35em" });
      gsap.set(".er-rule", { scaleX: 0 });

      /* ------------------------- reveals ------------------------- */
      const armed = (el, sel) => Array.from(el.querySelectorAll(sel));

      const build = (scope, delay = 0) => {
        const tl = gsap.timeline({ delay });
        const lines = armed(scope, ".er-line > span");
        const rules = armed(scope, ".er-rule");
        const tracks = armed(scope, ".er-track");
        const fades = armed(scope, ".er-fade");
        if (tracks.length)
          tl.to(
            tracks,
            { opacity: 1, letterSpacing: "0.22em", duration: 0.7, stagger: 0.06 },
            0
          );
        if (lines.length)
          tl.to(
            lines,
            { yPercent: 0, duration: 0.9, ease: ENTER, stagger: 0.08 },
            0.1
          );
        if (rules.length)
          tl.to(rules, { scaleX: 1, duration: 1.1, ease: ENTER, stagger: 0.06 }, 0.1);
        if (fades.length)
          tl.to(
            fades,
            { opacity: 1, y: 0, duration: 0.7, ease: ENTER, stagger: 0.07 },
            0.25
          );
        return tl;
      };

      /* hero runs on load, to the brief's timeline; everything else on
         entering the viewport, once */
      const hero = document.querySelector(".er-hero");
      const heroTl = build(hero, 0.15).paused(true);
      const navTl = build(document.querySelector(".er-nav"), 0).paused(true);

      document.querySelectorAll("main > section:not(.er-hero), .er-footer").forEach(
        (section) => {
          if (section.hasAttribute("data-journey")) return; // owns its own reveals
          if (section.querySelector("[data-manifesto]")) return;
          if (section.hasAttribute("data-record")) return; // WI-8 owns its own
          const tl = build(section).paused(true);
          ScrollTrigger.create({
            trigger: section,
            start: "top 78%",
            once: true,
            onEnter: () => tl.play(),
          });
        }
      );

      /* index rows get their own stagger */
      const rows = gsap.utils.toArray("[data-row]");
      if (rows.length) {
        gsap.set(rows, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: rows[0],
          start: "top 82%",
          once: true,
          onEnter: () =>
            gsap.to(rows, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: ENTER,
              stagger: 0.07,
            }),
        });
      }

      /* --------------------- manifesto: read by scrolling ---------- */
      const quote = document.querySelector("[data-manifesto]");
      if (quote) {
        const lines = quote.querySelectorAll(".er-line > span");
        const label = quote.parentElement.querySelector(".er-track");
        gsap.to(lines, {
          yPercent: 0,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: quote,
            start: "top 82%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        });
        if (label)
          ScrollTrigger.create({
            trigger: quote,
            start: "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(label, {
                opacity: 1,
                letterSpacing: "0.22em",
                duration: 0.7,
              }),
          });
      }

      /* The journey section owns its own pin and its own scene — see
         StudioJourney. Nothing to do here but stay out of its way. */

      /* --------------------------- nav ----------------------------- */
      const nav = document.querySelector(".er-nav");
      if (nav) {
        let last = window.scrollY;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: () => {
            const y = window.scrollY;
            nav.dataset.scrolled = String(y > 40);
            nav.dataset.hidden = String(y > last && y > 300);
            last = y;
          },
        });
      }

      /* ------------------ §2.2 the hero→panel handover -------------- */
      /* The panel is the section that follows the hero. Its own travel
         from the fold to the top of the viewport IS the transition, so
         the trigger measures exactly that and nothing computes a rect in
         the scroll path — ScrollTrigger caches the geometry and hands
         back a progress. */
      const panel = document.querySelector(".er-manifesto");
      if (panel) {
        ScrollTrigger.create({
          trigger: panel,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            coverage = self.progress;

            if (coverage >= 1) {
              /* Fully covered. Stop the loop first — the renderer is not
                 released until the grace period expires, so overshooting
                 the boundary and coming straight back costs nothing. */
              if (ribbon) ribbon.pause();
              if (!disposeTimer) {
                disposeTimer = window.setTimeout(() => {
                  disposeTimer = 0;
                  if (coverage >= 1) releaseField();
                }, DISPOSE_GRACE);
              }
              return;
            }

            if (disposeTimer) {
              window.clearTimeout(disposeTimer);
              disposeTimer = 0;
            }
            if (!ribbon) {
              mountRibbon(); // came back up after a disposal
              return;
            }
            ribbon.setFade(fadeFor(coverage));
            ribbon.resume();
          },
        });
      }

      /* The closing dissolution is the only other thing that touches the
         field — the section-by-section camera states are gone, because
         there is now one field and one spine rather than a scene being
         repositioned per section. */
      const closing = document.querySelector("[data-disperse]");
      if (closing) {
        ScrollTrigger.create({
          trigger: closing,
          start: "top 70%",
          end: "bottom bottom",
          onUpdate: (self) => ribbon && ribbon.setDisperse(self.progress),
        });
      }

      /* ---------------------- loader, then hero -------------------- */
      const loader = document.querySelector("[data-loader]");
      const startHero = () => {
        heroTl.play();
        /* nav arrives last, per the load timeline */
        gsap.delayedCall(0.7, () => navTl.play());
      };

      if (html.classList.contains("er-loading") && loader) {
        /* Tell the pre-paint failsafe to stand down: the loader is running
           for real, and a slow first compile must not cut it short. */
        html.setAttribute("data-er-loader", "run");
        const mark = loader.querySelector("[data-mark]");
        const counter = { v: 0 };
        const done = () => {
          html.classList.remove("er-loading");
          try {
            sessionStorage.setItem("er-seen", "1");
          } catch {}
          startHero();
        };
        gsap
          .timeline({ onComplete: done })
          /* the waterline rises through the mark */
          .to(counter, {
            v: 100,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: () => {
              if (mark) mark.style.setProperty("--p", `${counter.v.toFixed(1)}%`);
            },
          })
          .to(loader, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.0,
            ease: ENTER,
          });
      } else {
        startHero();
      }
    }, root);

    /* pointer parallax — desktop pointers only */
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e) => {
      if (!ribbon) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      ribbon.setPointer(nx, ny);          // whole-scene parallax
      ribbon.setMouse(nx, ny, true);      // local repulsion
    };
    const onOut = () => ribbon && ribbon.setMouse(0, 0, false);
    /* Fine pointers only. §3.5 is explicit that touch gets nothing: a
       finger occludes the effect and binding it would fight scrolling. */
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onOut);
    }

    const onVis = () => {
      if (!ribbon) return;
      /* Coming back to a visible tab must not restart a loop the panel
         has already stopped — the field is only alive while some of the
         hero is still on screen. */
      if (document.hidden || coverage >= 1) ribbon.pause();
      else ribbon.resume();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      dead = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      if (disposeTimer) window.clearTimeout(disposeTimer);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onOut);
      document.removeEventListener("visibilitychange", onVis);
      ctx.revert();
      releaseField();
    };
  }, []);

  return <div ref={canvasRef} className="er-canvas" aria-hidden="true" />;
}
