"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The survey thread — the homepage's connective tissue.
 *
 * One brass hairline runs the length of the page with a diamond beacon
 * travelling it, and a station tick for every chapter. It is the same
 * language as the Locations map journey (a beacon working a route between
 * stations), which is the point: the visitor meets the metaphor here and
 * recognises it there.
 *
 * Chapters are read from `[data-chapter]` elements, so the rail can never
 * drift out of sync with the page's actual sections. Desktop only, and
 * absent entirely under reduced motion — it is orientation, not content.
 */

const TOP = 14; // % of viewport where the rail's travel begins
const SPAN = 72; // % of viewport it travels

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

export default function SurveyThread() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const rootRef = useRef(null);
  const beaconRef = useRef(null);
  const fillRef = useRef(null);
  const [chapters, setChapters] = useState([]);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);

  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const root = rootRef.current;
      let marks = [];

      const measure = () => {
        const els = Array.from(document.querySelectorAll("[data-chapter]"));
        const doc = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        marks = els.map((el) => ({
          label: el.dataset.chapter,
          at: gsap.utils.clamp(
            0,
            1,
            (el.offsetTop - window.innerHeight * 0.4) / doc
          ),
        }));
        setChapters(marks);
      };

      measure();
      ScrollTrigger.addEventListener("refresh", measure);

      const st = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          if (beaconRef.current)
            beaconRef.current.style.top = `${TOP + p * SPAN}%`;
          if (fillRef.current)
            fillRef.current.style.height = `${TOP + p * SPAN}%`;
          /* the thread only exists once the hero has been left behind */
          if (root)
            root.style.opacity = String(
              gsap.utils.clamp(0, 1, (window.scrollY - window.innerHeight * 0.5) / 260)
            );

          let idx = -1;
          for (let i = 0; i < marks.length; i++) if (p >= marks[i].at) idx = i;
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });

      return () => {
        st.kill();
        ScrollTrigger.removeEventListener("refresh", measure);
      };
    });

    return () => mm.revert();
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="st-root pointer-events-none fixed inset-y-0 left-[clamp(16px,2.4vw,38px)] z-40 hidden w-px opacity-0 lg:block"
    >
      {/* the unwalked route */}
      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(242,239,233,0.16)] to-transparent" />
      {/* the route already travelled */}
      <span
        ref={fillRef}
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-brass/50 to-brass/70"
        style={{ height: `${TOP}%` }}
      />

      {chapters.map((c, i) => (
        <span
          key={c.label}
          className={`st-tick absolute left-1/2 h-px -translate-x-1/2 transition-all duration-500 ${
            i <= active ? "w-[9px] bg-brass/80" : "w-[5px] bg-[rgba(242,239,233,0.22)]"
          }`}
          style={{ top: `${TOP + c.at * SPAN}%` }}
        />
      ))}

      {/* the beacon, and the chapter it is currently working */}
      <div
        ref={beaconRef}
        className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
        style={{ top: `${TOP}%` }}
      >
        <span className="st-beacon block size-[7px] shrink-0 rotate-45 bg-brass" />
        {/* set down the rail, like a dimension label on a drawing */}
        <span className="st-label font-mono text-[9px] uppercase tracking-[0.26em] text-fog/75">
          {chapters[active]?.label ?? ""}
        </span>
      </div>

      <style jsx>{`
        .st-root {
          transition: opacity 300ms linear;
        }
        .st-beacon {
          box-shadow: 0 0 10px 1px rgba(201, 160, 99, 0.55);
        }
        .st-label {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
