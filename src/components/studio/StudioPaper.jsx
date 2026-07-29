"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field, onField } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The deliverable, as an object.
 *
 * Everything else on this page is light on darkness. This one section puts
 * a physical sheet in the frame — opaque, shadowed, ink on paper — because
 * that is what a client actually receives. No pin: the sheet settles once
 * on entry and takes a few degrees of tilt off across the section's own
 * scroll. The particle field parts around its rectangle rather than
 * shining through it.
 */

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

/* TODO(asset): real report sample. Until the firm supplies a redactable
   page from an actual engagement, the sheet carries structure only — bars
   where the prose goes, and a figures fragment with no figures in it.
   Nothing here states a fact about a real valuation. */
const BODY_BARS = [
  [100, 96, 88, 62],
  [100, 91, 74],
  [100, 97, 93, 55],
  [100, 84, 96, 41],
];
const TABLE_ROWS = 4;

export default function StudioPaper() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const secRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (reduced || window.matchMedia(QUERY).matches) return;
    const sec = secRef.current;
    const sheet = sheetRef.current;
    if (!sec || !sheet) return;

    const ctx = gsap.context(() => {
      /* entry: it rises the last 48px and settles, and the shadow
         lengthens with it — a sheet coming to rest on a surface */
      gsap.set(sheet, { y: 48, opacity: 0, "--sheet-lift": 0 });
      ScrollTrigger.create({
        trigger: sec,
        start: "top 78%",
        once: true,
        onEnter: () =>
          gsap.to(sheet, {
            y: 0,
            opacity: 1,
            "--sheet-lift": 1,
            duration: 0.9,
            ease: "power4.out",
          }),
      });

      /* the tilt: four degrees off the vertical at the section's start,
         square to the viewer by its end. Transform only. */
      const tilt = ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.5);
          gsap.set(sheet, { rotateX: 4 * (1 - p) });
        },
      });

      /* the mask: measured from the sheet's own rect every update, so it
         tracks the tilt and any resize without a separate listener */
      const push = ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const s = field();
          if (!s) return;
          const r = sheet.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const nx = (x) => (x / vw) * 2 - 1;
          const ny = (y) => (y / vh) * 2 - 1;
          s.setPlate({
            x0: nx(r.left),
            y0: ny(r.top),
            x1: nx(r.right),
            y1: ny(r.bottom),
            /* ~80px of feather, in the field's own units */
            feather: 80 * s.worldPerPx(),
          });
          /* full strength while the sheet is in frame, easing off as the
             section leaves so the field closes back over the space */
          const p = self.progress;
          s.setPlateStrength(gsap.utils.clamp(0, 1, Math.min(p / 0.2, (1 - p) / 0.2)));
        },
        onLeave: () => field()?.setPlateStrength(0),
        onLeaveBack: () => field()?.setPlateStrength(0),
      });

      const unwait = onField(() => ScrollTrigger.refresh());

      return () => {
        unwait();
        tilt.kill();
        push.kill();
        const s = field();
        if (s) {
          s.setPlateStrength(0);
          s.setPlate(null);
        }
      };
    }, sec);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={secRef}
      className="er-section er-papersec"
      aria-labelledby="er-paper"
    >
      <div className="er-wrap er-paperwrap">
        <div className="er-papercopy">
          <p className="er-label er-label--faint er-track">
            Sec. 06 — The deliverable
          </p>
          <h2 id="er-paper" className="er-display er-h3 er-papercopy__h">
            Every engagement ends as paper: <em>measured, argued, signed</em>.
          </h2>
          <Link className="er-paperlink" href="/contact">
            Request a valuation <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="er-paperstage">
          <article
            ref={sheetRef}
            className="er-sheet"
            aria-label="Illustration of a valuation report"
          >
            <header className="er-sheet__head">
              <p className="er-sheet__mark">
                S S Adhau<sup>®</sup>
              </p>
              <p className="er-sheet__meta">
                Valuers &amp; Engineers
                <span>Ref. SSA/—/——</span>
              </p>
            </header>

            <div className="er-sheet__body" aria-hidden="true">
              <span className="er-sheet__title" />
              {BODY_BARS.map((para, i) => (
                <div className="er-sheet__para" key={i}>
                  {para.map((w, k) => (
                    <span key={k} style={{ width: `${w}%` }} />
                  ))}
                </div>
              ))}

              <p className="er-sheet__cap er-sheet__tcap">Schedule of figures</p>
              <table className="er-sheet__table">
                <tbody>
                  {Array.from({ length: TABLE_ROWS }, (_, i) => (
                    <tr key={i}>
                      <td>
                        <span style={{ width: `${74 - i * 9}%` }} />
                      </td>
                      <td>
                        <span style={{ width: `${52 + i * 8}%` }} />
                      </td>
                      <td>
                        <span style={{ width: `${66 - i * 6}%` }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="er-sheet__foot" aria-hidden="true">
              <div className="er-sheet__sign">
                <span className="er-sheet__scribble" />
                <span className="er-sheet__rule" />
                <span className="er-sheet__cap">Registered Valuer</span>
              </div>
              <span className="er-sheet__seal" />
            </footer>
          </article>
        </div>
      </div>
    </section>
  );
}
