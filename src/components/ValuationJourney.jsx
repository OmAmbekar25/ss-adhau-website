"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ClipboardList,
  MapPinned,
  BarChart3,
  FileCheck2,
  Send,
} from "lucide-react";
import valuationBeats from "@/data/valuationBeats";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Copy lives in src/data/valuationBeats.js — the studio page tells the
   same story and must not be able to drift from it. Icons are this
   page's own, so they are mapped on rather than stored with the copy. */
const ICONS = [ClipboardList, MapPinned, BarChart3, FileCheck2, Send];
const BEATS = valuationBeats.map((b, i) => ({ ...b, icon: ICONS[i] }));

const N = BEATS.length;

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

export default function ValuationJourney() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);

  return (
    <section
      id="process"
      aria-label="How a valuation is produced, from enquiry to signed report"
      className="bg-noir"
    >
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-24 text-center md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
          How we work
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl leading-tight text-linen md:text-5xl">
          From enquiry to a signed report.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-fog">
          The same matter, re-formed five times: an enquiry becomes a
          surveyed site, becomes an analysis, becomes a document a bank or a
          court can act on.
        </p>
      </div>

      {reduced ? <StaticSteps /> : <ScrollJourney />}
    </section>
  );
}

/* ---------------- reduced motion: the whole argument, static -------- */

function StaticSteps() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {BEATS.map((beat, i) => {
          const Icon = beat.icon;
          return (
            <li key={beat.title} className="flex flex-col items-center text-center">
              <div className="relative mb-5 flex size-16 items-center justify-center rounded-full border border-brass/40 bg-white/[0.04] text-brass">
                <Icon className="size-6" />
                <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-brass font-mono text-xs text-noir">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl text-linen">{beat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                {beat.description}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------- the journey ---------------- */

function ScrollJourney() {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const glRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* WebGL only above md — mobile gets the stacked steps below, which is
       a composition, not a degraded desktop. */
    mm.add("(min-width: 768px)", () => {
      let scene = null;
      let st = null;
      let io = null;
      let dead = false;
      const el = pinRef.current;

      const onPointer = (e) => {
        if (!scene) return;
        const r = el.getBoundingClientRect();
        scene.setPointer(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          ((e.clientY - r.top) / r.height) * 2 - 1
        );
      };
      const onLeave = () => scene && scene.setPointer(0, 0);

      /* three.js is never in the first-load bundle: it arrives with this
         section, on a machine that has already proved it can render it. */
      import("@/lib/reportScene").then(({ createReportScene }) => {
        if (dead || !glRef.current) return;
        scene = createReportScene(glRef.current);
        if (!scene) return; // no WebGL — the static steps stay visible

        el.addEventListener("pointermove", onPointer, { passive: true });
        el.addEventListener("pointerleave", onLeave, { passive: true });

        io = new IntersectionObserver(
          ([entry]) => (entry.isIntersecting ? scene.resume() : scene.pause()),
          { threshold: 0 }
        );
        io.observe(el);

        st = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          onUpdate: (self) => {
            const p = self.progress;
            scene.setProgress(p);
            const idx = Math.min(N - 1, Math.floor(p * N + 0.18));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        });
        ScrollTrigger.refresh();
      });

      return () => {
        dead = true;
        if (st) st.kill();
        if (io) io.disconnect();
        if (el) {
          el.removeEventListener("pointermove", onPointer);
          el.removeEventListener("pointerleave", onLeave);
        }
        if (scene) scene.dispose();
      };
    });

    return () => mm.revert();
  }, []);

  const beat = BEATS[active];

  return (
    <>
      {/* ---------------------- desktop ---------------------- */}
      <div ref={wrapRef} className="hidden md:block md:h-[460vh]">
        <div
          ref={pinRef}
          className="vj-pin relative h-screen overflow-hidden bg-noir"
        >
          <div ref={glRef} aria-hidden="true" className="absolute inset-0" />

          {/* contrast veil for the copy — the same device as the hero */}
          <div className="vj-scrim pointer-events-none absolute inset-0" />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-10 py-10 xl:px-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-brass/80">
              The valuation, end to end
            </p>

            <div className="max-w-lg" key={active}>
              <div className="vj-in">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-5xl leading-none text-linen">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
                    {beat.caption}
                  </span>
                </div>
                <h3 className="mt-5 text-3xl leading-tight text-linen xl:text-4xl">
                  {beat.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-fog">
                  {beat.description}
                </p>
              </div>
            </div>

            {/* the rail — five stations, the same language as the map */}
            <ol className="mt-10 flex items-center gap-4">
              {BEATS.map((b, i) => (
                <li key={b.title} className="flex-1">
                  <span
                    className={`block h-px w-full transition-colors duration-500 ${
                      i <= active ? "bg-brass" : "bg-[rgba(242,239,233,0.14)]"
                    }`}
                  />
                  <span
                    className={`mt-3 block font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${
                      i === active
                        ? "text-linen"
                        : i < active
                          ? "text-fog"
                          : "text-fog/45"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")} · {b.short}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* ---------------------- mobile ---------------------- */}
      <div className="md:hidden">
        <StaticSteps />
      </div>

      <style jsx global>{`
        .vj-scrim {
          background:
            linear-gradient(
              100deg,
              rgba(7, 6, 6, 0.86) 0%,
              rgba(7, 6, 6, 0.5) 34%,
              transparent 62%
            ),
            linear-gradient(
              to top,
              rgba(7, 6, 6, 0.9) 0%,
              transparent 38%
            );
        }
        .vj-in {
          animation: vj-in 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes vj-in {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
