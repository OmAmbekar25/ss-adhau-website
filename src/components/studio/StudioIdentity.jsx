"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* §5.6 — the identity beat. Slides travel horizontally while the visitor
   scrolls vertically, and the page's one particle field condenses into a
   formation per slide. Scatter while moving, order when still: the beat
   performs the argument the copy makes. */

const SLIDES = [
  { eyebrow: "Sec. 03 — Identity", head: ["We don’t estimate value."] },
  {
    head: ["We ", "measure", " it."],
    em: 1,
    captions: ["On site", "In person", "Signed"],
  },
  {
    labels: ["Inspection", "Market data", "Structure", "Compliance", "Defence"],
  },
  { head: ["From site to ", "signature", "."], em: 1 },
];

const N = SLIDES.length;

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

function Head({ slide }) {
  if (!slide.head) return null;
  return (
    <h2 className="er-display er-h2 er-id__head">
      <span className="er-line">
        <span>
          {slide.head.map((part, i) =>
            i === slide.em ? <em key={i}>{part}</em> : part
          )}
        </span>
      </span>
    </h2>
  );
}

export default function StudioIdentity() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const [index, setIndex] = useState(0);
  const idxRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();

    /* Desktop only. Below 901px the slides stack as ordinary sections —
       a horizontal track inside a vertical scroll is a fight on a phone. */
    mm.add("(min-width: 901px)", () => {
      const track = trackRef.current;
      const slides = gsap.utils.toArray(".er-idslide", track);

      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        /* scrub: 1 — the catch-up lag IS the weighted drag. `true` is too
           rigid and reads as a rail rather than a mass with inertia. */
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          /* xPercent is a share of the track's OWN width, and the track is
             N screens wide — so one screen of travel is 100/N percent, not
             100. Getting this wrong sent the slides four times too far. */
          gsap.set(track, { xPercent: -((100 * (N - 1)) / N) * p });

          const s = field();
          if (s) {
            s.setMode(1);
            s.setSlide(p * (N - 1));
            /* normalised, clamped: the field reads the track's speed and
               smears opposite it */
            s.setVelocity(gsap.utils.clamp(-1, 1, self.getVelocity() / 2600));
          }

          /* Shear is measured against each slide's OWN distance from
             centre, not against total travel — so the layers pull apart
             while a slide moves and sit back together when it centres. */
          const pos = p * (N - 1);
          const w = window.innerWidth;
          slides.forEach((slide, i) => {
            const local = gsap.utils.clamp(-1, 1, pos - i);
            slide.querySelectorAll(".er-id__layer").forEach((el) => {
              const rate = parseFloat(el.dataset.rate || "1");
              gsap.set(el, { x: (rate - 1) * local * w * 0.55 });
            });
          });

          if (fillRef.current) gsap.set(fillRef.current, { scaleX: p });
          const i = Math.round(p * (N - 1));
          if (i !== idxRef.current) {
            idxRef.current = i;
            setIndex(i);
          }
        },
      });

      /* the handover: the ribbon condenses into formation one across the
         approach, and re-forms on the way out — no popping at any position */
      const handover = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => {
          const s = field();
          if (s) s.setMode(self.progress);
        },
      });
      const exit = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const s = field();
          if (s) {
            s.setMode(1 - self.progress);
            s.setVelocity(0);
          }
        },
      });

      return () => {
        st.kill();
        handover.kill();
        exit.kill();
        const s = field();
        if (s) {
          s.setMode(0);
          s.setVelocity(0);
        }
      };
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section className="er-section er-idsec" aria-labelledby="er-identity" data-identity>
      <h2 id="er-identity" className="er-visually-hidden">
        Identity
      </h2>

      {!reduced && (
        <div ref={wrapRef} className="er-idwrap">
          <div ref={pinRef} className="er-idpin">
            <div ref={trackRef} className="er-idtrack">
              {SLIDES.map((slide, i) => (
                <article className="er-idslide" key={i}>
                  {slide.eyebrow && (
                    <p className="er-label er-label--faint er-id__layer" data-rate="0.92">
                      {slide.eyebrow}
                    </p>
                  )}
                  <div className="er-id__layer" data-rate="1">
                    <Head slide={slide} />
                    {slide.labels && (
                      <ul className="er-id__constellation">
                        {slide.labels.map((l) => (
                          <li key={l} className="er-label">
                            {l}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {slide.captions && (
                    <ul className="er-id__caps er-id__layer" data-rate="1.08">
                      {slide.captions.map((c) => (
                        <li key={c} className="er-label er-label--faint">
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <div className="er-idprog" aria-hidden="true">
              <span className="er-idprog__bar">
                <i ref={fillRef} />
              </span>
              <span className="er-idprog__n er-label">
                {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* mobile and reduced motion: the same four, stacked and read */}
      <div className={reduced ? "er-wrap" : "er-idstatic er-wrap"}>
        <ol className="er-idlist">
          {SLIDES.map((slide, i) => (
            <li key={i}>
              <span className="er-rule" />
              <p className="er-label er-label--faint">
                {String(i + 1).padStart(2, "0")} — Identity
              </p>
              {slide.head && (
                <p className="er-display er-idlist__h">
                  {slide.head.map((part, k) =>
                    k === slide.em ? <em key={k}>{part}</em> : part
                  )}
                </p>
              )}
              {slide.labels && (
                <p className="er-body">{slide.labels.join(" · ")}</p>
              )}
              {slide.captions && (
                <p className="er-body">{slide.captions.join(" · ")}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
