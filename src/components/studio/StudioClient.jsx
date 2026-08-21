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
/* The panel dip, expressed against the panel's whole two-viewport pass.
   Coverage completes at progress 0.5, so fading out by 60% of coverage is
   progress 0.3; the field returns as the panel clears the frame. */
const FADE_OUT_END = 0.3;
const FADE_IN_START = 0.72;
const FADE_IN_SPAN = 0.2;

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

/* ---------------------------------------------------------- THE BEAT
 * `beat` is the hero-transition candidate, opt-in and off on `/`.
 *
 * It is a prop rather than a forked component because the scroll
 * machinery below is 400 lines that both routes need to agree on — the
 * same reasoning that made the nav and footer components rather than
 * copies. The CANDIDATE PAGE is duplicated (markup is where a design
 * experiment needs to be free); this file is shared.
 *
 * The phase map is the survey's, expressed against `.er-beatspace` — one
 * viewport of sticky hold that exists purely to be scrolled through, so
 * the beat plays with nothing else moving and the panel hands off after
 * it. Sticky, not pinned: it costs nothing against §7's budget of two.
 *
 *   0.00 → 0.45   camera pushes toward the field
 *   0.00 → 0.30   hero copy fades out — gone before the climax
 *   0.30 → 0.95   the field disperses along aDrift — the decomposition
 *   then           the panel rises and its existing dip takes the alpha
 *
 * Text is gone before the decomposition climaxes, which is the one thing
 * every reference in the survey does (Apple, Motion.dev, Flowspark).
 * Every value is read straight from progress: no tweens, no one-shot
 * state, exact when scrubbed back up.
 */
const BEAT = {
  pushEnd: 0.45,
  copyEnd: 0.3,
  burstStart: 0.3,
  burstEnd: 0.95,
};
const span = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));

export default function StudioClient({ beat = false }) {
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

    /* THE FIELD IS SCOPED TO THE HERO AND THE METHOD JOURNEY. One scene,
     * created once, released only on unmount; where it is ALLOWED TO BE
     * VISIBLE is decided by the zone factors further down. `coverage` is
     * the inverse of that visibility and the only thing it decides is
     * whether the loop is worth running. Every scroll-driven value is a
     * pure function of progress, so scrubbing backwards is exact. */
    let coverage = 0;

    /* §0's structural assert, development only. The canvas is a
       page-level fixed layer and must stay one: the moment it becomes a
       child of a section, that section's transforms, stacking context and
       overflow all start applying to it, and the "field drifting through
       the services" class of bug becomes possible again. Cheap, runs
       once, and stripped from the production bundle. */
    if (process.env.NODE_ENV !== "production") {
      const host = canvasRef.current;
      if (host && host.closest("main")) {
        throw new Error(
          "[field] the particle canvas is inside <main>. It must be a " +
            "direct child of .er, above the sections, so no section can " +
            "own its stacking context. See StudioClient / §0."
        );
      }
    }

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

       It stays idempotent — guarded on `ribbon` — because a re-mount
       after a disposal was a real path once and the formation cache in
       studioScene makes it cheap if it is ever needed again.
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
        /* Search from the SECTION, not the quote's parent. On `/` the two
           are the same element; on the candidate the quote sits inside
           the film that times it, and a parent-scoped lookup found no
           label at all — the "Principle" eyebrow stayed at the opacity 0
           the armed state gives it and never appeared. */
        const label = quote.closest("section")?.querySelector(".er-track");
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

      /* ---------------- WHERE THE FIELD IS ALLOWED TO BE --------------
         Scoped to the HERO and the METHOD JOURNEY, and nowhere else
         (2026-08-16, client ruling). It is the hero's arrival and it is
         the five formations the journey narrates; past that it was
         ambient drift, and from this pass the services section is a row
         of tinted cards that a point field crossing them only muddies.

         Two zone factors, multiplied, each a pure function of its own
         trigger's progress — no tweens, no one-shot state, exact when
         scrubbed backwards in either direction. Multiplying rather than
         letting two triggers both write `setFade` is the point: two
         writers race, and whichever fired last would win.

           panelF  1 → 0 → 1   the hero handover. The field is gone by
                               60% of the panel's coverage, holds at
                               nothing while the panel owns the viewport,
                               and returns as the panel clears and the
                               journey arrives behind it.
           exitF   1 → 0       the journey's departure. Fades out as the
                               section's bottom edge rises through the
                               frame and stays out for everything below.

         The trigger spans the panel's ENTIRE pass — top-at-fold to
         bottom-at-top, two viewports — so one progress drives both halves
         of the dip. Coverage completes at the midpoint, which is why the
         fade-out lands at 0.3 and the fade-in sits in the last quarter. */
      /* The two zone triggers are created as MEASURERS ONLY — nothing is
         written from their own callbacks. A single always-on trigger
         reads both progresses on every scroll and applies the product.

         That indirection is not decoration. `onUpdate` fires only while
         the scroll is INSIDE a trigger's range, so any jump that clears a
         range in one frame — a programmatic `scrollTo`, an anchor link, a
         reload restoring a deep scroll position — skips it entirely and
         leaves that factor stale. The field kept drifting across the
         services section for exactly that reason: the exit window is 12%
         of a viewport and the jump stepped straight over it. Reading
         `.progress` instead is safe anywhere, because ScrollTrigger
         clamps it to 0 before start and 1 after end whether or not the
         callback ever ran. */
      const heroBlock = beat ? document.querySelector(".er-hero__block") : null;
      /* The beat plays across its OWN viewport of sticky hold, before the
         panel starts rising — so the decomposition is never happening
         inside a strip the panel is busy covering. Measurer only, like
         the two below: read on every scroll, never written from here. */
      const beatST =
        beat && document.querySelector(".er-beatspace")
          ? ScrollTrigger.create({
              trigger: ".er-beatspace",
              start: "top top",
              end: "bottom top",
            })
          : null;
      const panelST = document.querySelector(".er-manifesto")
        ? ScrollTrigger.create({
            trigger: ".er-manifesto",
            start: "top bottom",
            end: "bottom top",
          })
        : null;
      const exitST = document.querySelector("[data-showcase]")
        ? ScrollTrigger.create({
            trigger: "[data-showcase]",
            start: "top bottom",
            end: "top 88%",
          })
        : null;

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: () => {
          if (beat && !ribbon) return;
          const p = panelST ? panelST.progress : 0;
          const panelF =
            p <= FADE_OUT_END
              ? 1 - p / FADE_OUT_END
              : p < FADE_IN_START
                ? 0
                : Math.min(1, (p - FADE_IN_START) / FADE_IN_SPAN);
          const exitF = exitST ? 1 - exitST.progress : 1;

          /* THE HERO BEAT, candidate only. `q` runs 0..1 across the
             spacer — one viewport of sticky hold with nothing else moving
             — and the panel's own fade takes over after it. */
          let f = panelF * exitF;
          if (beat) {
            const q = beatST ? beatST.progress : 0;
            ribbon.setPush(span(q, 0, BEAT.pushEnd));
            ribbon.setDisperse(span(q, BEAT.burstStart, BEAT.burstEnd));
            /* The field outlives the copy on purpose: the decomposition
               is the moment, and it cannot be the moment if it is already
               fading while it happens. So the beat holds alpha at full
               and the panel's own dip is what finally takes it. */
            f = panelF * exitF;
            if (heroBlock) {
              heroBlock.style.opacity = String(1 - span(q, 0, BEAT.copyEnd));
            }
          }

          coverage = 1 - f;
          if (!ribbon) return;
          ribbon.setFade(f);
          /* Invisible means the loop stops — a real saving across the
             services, trusted, record, river and closing sections, and it
             costs nothing to reverse. The renderer stays: it is needed
             again on the way back up, and disposing on every pass would
             cost more than the pause saves.

             `renderOnce()` BEFORE the pause is load-bearing. Pausing does
             not clear the canvas, it just stops drawing to it — so
             setting the fade to zero and pausing in the same tick leaves
             the last frame that WAS drawn sitting there for good. On a
             smooth scroll the loop happens to render the fade out on its
             way down and it looks fine; on a jump the uniform changes and
             nothing ever redraws, which is why the certificate was still
             painted across the services section. One flush frame. */
          if (f <= 0.001) {
            ribbon.renderOnce();
            ribbon.pause();
          } else ribbon.resume();
        },
      });

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
        /* 1.9s + 1.0s was 2.9 seconds of decorative hold on a page that
           has already finished painting — FCP measures 136ms. The hero
           subcopy is the LCP element and it cannot paint until this
           overlay lifts, so the loader WAS the LCP: 3700ms median against
           a 2500ms gate. Halved to 0.7 + 0.4. The mark still fills and
           the sheet still lifts on the same curve; there is simply no
           dead time in the middle pretending to load something that is
           already there. Measured after: see §15. */
        gsap
          .timeline({ onComplete: done })
          /* the waterline rises through the mark */
          .to(counter, {
            v: 100,
            duration: 0.7,
            ease: "power2.inOut",
            onUpdate: () => {
              if (mark) mark.style.setProperty("--p", `${counter.v.toFixed(1)}%`);
            },
          })
          .to(loader, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.4,
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
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onOut);
      document.removeEventListener("visibilitychange", onVis);
      ctx.revert();
      releaseField();
    };
  }, [beat]);

  return <div ref={canvasRef} className="er-canvas" aria-hidden="true" />;
}
