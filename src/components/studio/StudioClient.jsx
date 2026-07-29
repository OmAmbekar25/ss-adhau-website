"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ENTER = "power4.out"; // the expo-like entrance curve
const GLOW = 0xffffff;

/* Ribbon states (§3.2). Targets only — the scene eases toward them. */
const RIBBON = {
  hero: { camX: -0.18, camZ: 7.4, rotX: 0.4, bright: 0.62, disperse: 0 },
  manifesto: { camX: 1.7, camZ: 9.1, rotX: 0.54, bright: 0.3, disperse: 0 },
  journey: { camX: -2.1, camZ: 8.6, rotX: 0.32, bright: 0.36, disperse: 0 },
  rows: { camX: 0, camZ: 10.2, rotX: 1.3, bright: 0.24, disperse: 0 },
  close: { camX: 0, camZ: 8.2, rotX: 0.42, bright: 0.5, disperse: 1 },
};

/* Denser than the brief's 25–45k: the weave wanted more thread to read as
   cloth rather than gauze. Still one draw call, still DPR-capped, still
   scaled down hard on smaller machines. */
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

    /* The arrival: a spinning funnel that settles into the ribbon. The
       spin-down is handled inside the scene; this only drives the shape.
       Long and heavily eased — it should look like something coming to
       rest, not like a transition finishing. */
    const playIntro = () => {
      if (!ribbon || introPlayed) return;
      introPlayed = true;
      const form = { v: 0 };
      ribbon.setForm(0);
      gsap.to(form, {
        v: 1,
        duration: 5.2,
        ease: "power2.inOut",
        onUpdate: () => ribbon && ribbon.setForm(form.v),
      });
    };

    /* ---------------------------------------------------------------
       The ribbon. Mounted after first paint so the headline is readable
       before the scene exists, and skipped entirely without WebGL.
       --------------------------------------------------------------- */
    const mountRibbon = () => {
      import("@/lib/ribbonScene")
        .then(({ createRibbon }) => {
          if (dead || !canvasRef.current) return;
          ribbon = createRibbon(canvasRef.current, {
            count: particleCount(),
            accent: GLOW,
          });
          if (!ribbon) return; // no WebGL — pure typography, as specified

          canvasRef.current.dataset.ready = "true";
          ribbon.setState(RIBBON.hero);
          if (reduced) {
            ribbon.setForm(1); // no funnel — the settled ribbon, one frame
            ribbon.renderOnce();
          } else {
            ribbon.resume();
            if (introPlayed) ribbon.setForm(1);
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
        if (ribbon) ribbon.dispose();
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

      /* ------------------- ribbon scroll states -------------------- */
      const bind = (selector, state) => {
        const el = document.querySelector(selector);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive && ribbon) ribbon.setState(state);
          },
          onEnter: () => ribbon && ribbon.setState(state),
          onEnterBack: () => ribbon && ribbon.setState(state),
        });
      };
      bind(".er-hero", RIBBON.hero);
      bind(".er-manifesto", RIBBON.manifesto);
      bind("[data-journey]", RIBBON.journey);

      /* The journey draws its own full-screen, opaque scene. While it is on
         screen the ribbon is invisible behind it, so park it rather than
         paying for two WebGL scenes at once. */
      const journeySec = document.querySelector("[data-journey]");
      if (journeySec) {
        ScrollTrigger.create({
          trigger: journeySec,
          start: "top 90%",
          end: "bottom 10%",
          onToggle: (self) => {
            if (!ribbon) return;
            if (self.isActive) ribbon.pause();
            else if (!document.hidden) ribbon.resume();
          },
        });
      }
      bind(".er-rows", RIBBON.rows);
      bind("[data-disperse]", RIBBON.close);

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
      ribbon.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    const onVis = () => {
      if (!ribbon) return;
      document.hidden ? ribbon.pause() : ribbon.resume();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      dead = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ctx.revert();
      if (ribbon) ribbon.dispose();
    };
  }, []);

  return <div ref={canvasRef} className="er-canvas" aria-hidden="true" />;
}
