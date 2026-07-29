"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import valuationBeats from "@/data/valuationBeats";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const N = valuationBeats.length;

/* The same scene as the homepage journey, in this page's palette: no
   brass, no cream — ink and white only, on the studio's own near-black.
   One geometry, two dressings. */
const MONO = {
  ink: 0xd9d9d6,
  accent: 0xffffff,
  draw: 0xe8e8e6,
  hot: 0xffffff,
  bg: 0x050505,
};

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
  const glRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();

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

      import("@/lib/reportScene").then(({ createReportScene }) => {
        if (dead || !glRef.current) return;
        scene = createReportScene(glRef.current, MONO);
        if (!scene) return; // no WebGL — the static list below stands in

        el.addEventListener("pointermove", onPointer, { passive: true });
        el.addEventListener("pointerleave", onLeave, { passive: true });

        /* Two WebGL scenes live on this page. This one only runs while it
           is on screen, and the ribbon behind it is parked at the same
           time (see StudioClient), so they are never both drawing. */
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
  }, [reduced]);

  const beat = valuationBeats[active];

  return (
    <>
      {/* --------------------- desktop: the journey --------------------- */}
      {!reduced && (
        <div ref={wrapRef} className="er-jwrap">
          <div ref={pinRef} className="er-jpin">
            <div ref={glRef} aria-hidden="true" className="er-jgl" />
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
