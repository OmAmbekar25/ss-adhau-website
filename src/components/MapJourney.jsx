"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LOCATIONS, OfficeCard } from "@/components/OurPresence";
import {
  MAP_W,
  MAP_H,
  MP_PATH,
  MH_PATH,
  CITY_XY,
  POLY_MP,
  POLY_MH,
} from "@/data/indiaMap";
import { createMap3D } from "@/lib/map3d";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const N = LOCATIONS.length;

/* Route through the real city coordinates (journey order), smoothed with
   Catmull-Rom → cubic bezier — the flowing curve. Used by the 2D
   mobile/static fallbacks; the 3D view builds the same curve in three.js
   (CatmullRomCurve3 over the same points). */
const pts = LOCATIONS.map((l) => {
  const [x, y] = CITY_XY[l.city];
  return { x, y };
});

function catmullRomPath(p) {
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}
const ROUTE_D = catmullRomPath(pts);

/* Point-to-point variant, kept per request — swap back if wanted. */
// const ROUTE_D = pts
//   .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
//   .join(" ");

/* Camera frames (shared meaning with the 3D view: k = zoom factor) */
const OVERVIEW = { cx: MAP_W / 2, cy: MAP_H / 2, k: 1 };
const ROUTE_VIEW = { cx: 528, cy: 494, k: 1.9 };
const CITY_ZOOM = 4.2;

/* Journey phases (as fractions of pin progress) */
const P_IN = 0.06;
const P_OUT = 0.92;

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

export default function MapJourney() {
  const reduced = useSyncExternalStore(subscribeRM, getRM, () => false);
  return reduced ? <StaticMap /> : <AnimatedMap />;
}

/* ------------------- 2D map (mobile + reduced motion) --------------- */

function MapSvg({ active, staticAll = false }) {
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-full w-full">
      <defs>
        <linearGradient id="mj-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A9752E" />
          <stop offset="100%" stopColor="#C89B52" />
        </linearGradient>
      </defs>

      <path d={MP_PATH} fill="#FFFFFF" stroke="#D8D5CC" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={MH_PATH} fill="#FBFAF7" stroke="#D8D5CC" strokeWidth="1" vectorEffect="non-scaling-stroke" />

      <path d={ROUTE_D} fill="none" stroke="url(#mj-fill)" strokeWidth="3" strokeLinecap="round" />

      {pts.map((p, i) => {
        const lit = staticAll || i <= active;
        return (
          <g key={LOCATIONS[i].city} transform={`translate(${p.x} ${p.y})`}>
            <circle
              r="6"
              fill={lit ? "#A9752E" : "#F7F6F2"}
              stroke={lit ? "#A9752E" : "#B9B5A9"}
              strokeWidth="1.5"
            />
            {lit && (
              <path
                d="M -2.6 0 L -0.9 2.2 L 3 -2.2"
                fill="none"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <text
              y="-14"
              textAnchor="middle"
              style={{ fill: "#1D2D5C", fontSize: 13, fontWeight: 500 }}
            >
              {LOCATIONS[i].city}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StaticMap() {
  return (
    <section className="bg-noir px-6 py-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="h-[70vh] overflow-hidden rounded-3xl border border-[rgba(242,239,233,0.12)] bg-[#F5F2EA]">
          <MapSvg staticAll active={N - 1} />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <OfficeCard key={loc.city} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Animated 3D journey ------------------------ */

function AnimatedMap() {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const glRef = useRef(null);
  const labelRefs = useRef([]);
  const counterRef = useRef(null);
  const overlayRef = useRef(null);
  const statNumRef = useRef(null);

  const [active, setActive] = useState(0);
  const [finale, setFinale] = useState(false);
  const activeRef = useRef(0);
  const finaleRef = useRef(false);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const map3d = createMap3D(glRef.current, {
        polyMP: POLY_MP,
        polyMH: POLY_MH,
        cityPts: pts,
        labelEls: labelRefs.current,
      });

      const cam = { ...OVERVIEW };
      const applyCam = () => map3d.setCamera(cam);
      applyCam();

      const tl = gsap.timeline({ paused: true });
      const cityFrame = (i) => ({
        cx: pts[i].x,
        cy: pts[i].y,
        k: CITY_ZOOM,
        ease: "power2.inOut",
        onUpdate: applyCam,
      });
      tl.to(cam, { ...cityFrame(0), duration: P_IN });
      const seg = (P_OUT - P_IN) / (N - 1);
      for (let i = 1; i < N; i++) tl.to(cam, { ...cityFrame(i), duration: seg });
      tl.to(cam, {
        ...ROUTE_VIEW,
        ease: "power2.inOut",
        onUpdate: applyCam,
        duration: 1 - P_OUT,
      });

      let waveTl = null;
      const playFinale = () => {
        if (finaleRef.current) return;
        finaleRef.current = true;
        setFinale(true);
        map3d.setActive(N - 1, true);
        waveTl = map3d.finaleWave();
        const tlF = gsap.timeline({ delay: 1.5 });
        tlF.to(overlayRef.current, { autoAlpha: 1, duration: 0.6, ease: "power3.out" });
        const counter = { v: 0 };
        tlF.to(
          counter,
          {
            v: N,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (statNumRef.current)
                statNumRef.current.textContent = Math.round(counter.v);
            },
          },
          "<0.2"
        );
      };
      const resetFinale = () => {
        if (!finaleRef.current) return;
        finaleRef.current = false;
        setFinale(false);
        if (waveTl) {
          waveTl.kill();
          waveTl = null;
        }
        map3d.setActive(activeRef.current, false);
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
      };

      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        snap: {
          snapTo: (value) => {
            const stops = [
              0,
              ...pts.map((_, i) => P_IN + (i * (P_OUT - P_IN)) / (N - 1)),
              1,
            ];
            return stops.reduce((a, b) =>
              Math.abs(b - value) < Math.abs(a - value) ? b : a
            );
          },
          duration: { min: 0.25, max: 0.7 },
          ease: "back.out(1.4)",
          directional: true,
        },
        onUpdate: (self) => {
          const p = self.progress;
          tl.progress(p);

          const q = gsap.utils.clamp(0, 1, (p - P_IN) / (P_OUT - P_IN));
          map3d.setProgress(q);

          const idx = Math.min(N - 1, Math.round(q * (N - 1)));
          if (idx !== activeRef.current) {
            const forward = idx > activeRef.current;
            activeRef.current = idx;
            setActive(idx);
            if (!finaleRef.current) {
              map3d.setActive(idx, false);
              if (forward) map3d.arriveAt(idx); // signal received
            }
            if (counterRef.current)
              counterRef.current.textContent = String(idx + 1).padStart(2, "0");
          }

          if (p > 0.985) playFinale();
          else if (p < 0.9) resetFinale();
        },
      });

      return () => {
        st.kill();
        tl.kill();
        map3d.dispose();
      };
    });

    return () => mm.revert();
  }, []);

  /* Mobile: static overview map + observed stacked cards */
  const mobileCardRefs = useRef([]);
  const [mobileActive, setMobileActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setMobileActive((cur) => Math.max(cur, Number(e.target.dataset.idx)));
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    mobileCardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const loc = LOCATIONS[active];

  return (
    <section aria-label="Interactive 3D map of our presence across nine cities">
      {/* ------------------------- Desktop ------------------------- */}
      <div ref={wrapperRef} className="hidden md:block md:h-[350vh]">
        <div ref={pinRef} className="relative h-screen overflow-hidden bg-noir">
          <div className="relative z-10 mx-auto grid h-full max-w-[1600px] grid-cols-[55%_45%] items-stretch">
            {/* Left — the 3D map */}
            <div className="relative h-full overflow-hidden">
              <div ref={glRef} className="absolute inset-0" />
              {/* projected city labels */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {LOCATIONS.map((l, i) => (
                  <span
                    key={l.city}
                    ref={(el) => (labelRefs.current[i] = el)}
                    className={`mj3-label absolute left-0 top-0 text-[13px] ${
                      finale || i === active
                        ? "mj3-label-on text-[#1D2D5C]"
                        : i < active
                          ? "text-[#1D2D5C]/80"
                          : "text-[#50627C]/70"
                    }`}
                  >
                    {l.city}
                    <span className="mj3-u" aria-hidden="true" />
                  </span>
                ))}
              </div>
            </div>

            {/* Right — active office */}
            <div className="relative flex h-full flex-col justify-center pl-8 pr-10 xl:pl-16">
              <div className="mb-8 flex items-baseline gap-3">
                <span
                  ref={counterRef}
                  className="font-display text-4xl font-bold text-linen"
                >
                  01
                </span>
                <span className="text-lg text-fog">
                  / {String(N).padStart(2, "0")}
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brass">
                Our presence
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold text-linen md:text-4xl">
                Nine cities. Two states. One standard.
              </h2>

              <div className="mt-10 max-w-lg" key={active}>
                <div className="mj-card-in">
                  <OfficeCard loc={loc} />
                </div>
              </div>
            </div>
          </div>

          {/* Finale overlay */}
          <div
            ref={overlayRef}
            className="invisible absolute inset-0 z-20 flex items-center justify-center bg-noir/85 opacity-0 backdrop-blur-md"
          >
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-fog">
                Serving
              </p>
              <p className="mt-2 font-display text-7xl font-bold text-linen md:text-8xl">
                <span ref={statNumRef}>0</span> cities
              </p>
              <p className="mt-4 text-lg text-fog">
                across Madhya Pradesh &amp; Maharashtra
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------- Mobile -------------------------- */}
      <div className="bg-noir px-6 py-16 md:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brass">
          Our presence
        </p>
        <h2 className="mt-3 text-3xl font-bold text-linen">
          Nine cities. Two states. One standard.
        </h2>

        <div className="mt-8 h-72 overflow-hidden rounded-3xl border border-[rgba(242,239,233,0.12)] bg-[#F5F2EA]">
          <MapSvg staticAll active={mobileActive} />
        </div>

        <div className="sticky top-0 z-10 -mx-6 mt-8 bg-noir/90 px-6 py-4 backdrop-blur">
          <div className="relative h-2 rounded-full bg-brand-line">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-accent to-[#C89B52] transition-[width] duration-500 ease-out"
              style={{ width: `${(mobileActive / (N - 1)) * 100}%` }}
            />
            {LOCATIONS.map((l, i) => (
              <span
                key={l.city}
                className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300 ${
                  i <= mobileActive
                    ? "border-brand-accent bg-brand-accent"
                    : "border-[rgba(242,239,233,0.12)] bg-noir"
                }`}
                style={{ left: `${(i / (N - 1)) * 100}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-linen">
            {LOCATIONS[mobileActive].city}
            <span className="ml-2 font-normal text-fog">
              {mobileActive + 1} / {N}
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          {LOCATIONS.map((l, i) => (
            <div key={l.city} data-idx={i} ref={(el) => (mobileCardRefs.current[i] = el)}>
              <OfficeCard loc={l} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .mj3-label {
          font-weight: 500;
          letter-spacing: 0.05em;
          opacity: 0.8;
          transition:
            letter-spacing 450ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 450ms,
            color 450ms;
        }
        .mj3-label-on {
          font-weight: 600;
          letter-spacing: 0;
          opacity: 1;
        }
        .mj3-u {
          display: block;
          height: 1.5px;
          width: 0;
          margin-top: 2px;
          background: #a9752e;
          transition: width 450ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mj3-label-on .mj3-u {
          width: 100%;
        }
        .mj-card-in {
          animation: mj-card-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes mj-card-in {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
