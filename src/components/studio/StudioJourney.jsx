"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import valuationBeats from "@/data/valuationBeats";
import { story } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const N = valuationBeats.length;

/* The journey no longer owns a scene. The page has one field (see
   lib/studioScene.js) and this section simply walks it along its spine:
   ribbon -> site -> lattice -> page, through fieldBus. */

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

export default function StudioJourney() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        onUpdate: (self) => {
          const p = self.progress;
          /* 1 = ribbon, 4 = the signed page. Compressed into the first
             82% of the scroll so the page is fully formed by the time the
             copy says certification — otherwise the caption arrives while
             the field is still halfway between lattice and sheet. */
          story(1 + 3 * Math.min(1, p / 0.82));
          const idx = Math.min(N - 1, Math.floor(p * N + 0.18));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
        onLeave: () => story(1),
        onLeaveBack: () => story(1),
      });
      ScrollTrigger.refresh();
      return () => st.kill();
    });

    return () => mm.revert();
  }, [reduced]);

  const beat = valuationBeats[active];

  return (
    <>
      {/* --------------------- desktop: the journey --------------------- */}
      {!reduced && (
        <div ref={wrapRef} className="er-jwrap">
          <div ref={pinRef} className="er-jpin">
            <div className="er-jscrim" aria-hidden="true" />

            <div className="er-jcopy">
              <p className="er-label er-label--faint">
                The valuation, end to end
              </p>

              <div key={active} className="er-jbeat">
                <p className="er-jbeat__i er-display">
                  {String(active + 1).padStart(2, "0")}
                  <span className="er-label er-label--faint">
                    {beat.caption}
                  </span>
                </p>
                <h3 className="er-display er-jbeat__t">{beat.title}</h3>
                <p className="er-body er-jbeat__b">{beat.description}</p>
              </div>

              <ol className="er-jrail">
                {valuationBeats.map((b, i) => (
                  <li key={b.title} data-on={i <= active} data-now={i === active}>
                    <span />
                    <em>
                      {String(i + 1).padStart(2, "0")} · {b.short}
                    </em>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ------- mobile and reduced motion: the same five, static ------- */}
      <div className={reduced ? "er-wrap" : "er-jstatic er-wrap"}>
        <ol className="er-jlist">
          {valuationBeats.map((b, i) => (
            <li key={b.title}>
              <span className="er-rule" />
              <p className="er-label er-label--faint">
                {String(i + 1).padStart(2, "0")} · {b.caption}
              </p>
              <h3 className="er-display er-jlist__t">{b.title}</h3>
              <p className="er-body">{b.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
