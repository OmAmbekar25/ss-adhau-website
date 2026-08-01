"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/* Data — only Nagpur & Chhindwara are physical offices. The rest are  */
/* service areas: no invented addresses, hours, or phone numbers.      */
/* ------------------------------------------------------------------ */

const PHONE = "+91 8793000929";
const EMAIL = "ssadhauvaluers@gmail.com";
const HOURS = "Mon – Sat · 10:00 AM – 7:00 PM";

export const LOCATIONS = [
  {
    city: "Chhindwara",
    region: "Madhya Pradesh",
    type: "office",
    address:
      "F - 02, First Floor, Jail Bagicha Complex, In Front of B.S.N.L Office, Parasia Road, Satkar Tiraha, Chhindwara (M.P.) - 480001",
    map: "https://maps.app.goo.gl/dFv8YyStPMFaygpUA",
  },
  { city: "Betul", region: "Madhya Pradesh", type: "area" },
  { city: "Seoni", region: "Madhya Pradesh", type: "area" },
  { city: "Balaghat", region: "Madhya Pradesh", type: "area" },
  { city: "Jabalpur", region: "Madhya Pradesh", type: "area" },
  { city: "Bhopal", region: "Madhya Pradesh", type: "area" },
  { city: "Indore", region: "Madhya Pradesh", type: "area" },
  {
    city: "Nagpur",
    region: "Maharashtra",
    type: "office",
    address:
      "Plot No. 54, Panchtara Society, behind Krishna Super Market 1 (near overbridge), Manish Nagar, Nagpur - 440015",
    map: "https://maps.app.goo.gl/AJYYMS3F3ok3SajR6",
  },
  { city: "Pandhurna", region: "Madhya Pradesh", type: "area" },
];

const N = LOCATIONS.length;

/* Serpentine metro path — stations alternate left/right, smooth S-curves */
const X_LEFT = 110;
const X_RIGHT = 290;
const Y_START = 60;
const Y_GAP = 140;

const stationPoints = LOCATIONS.map((_, i) => ({
  x: i % 2 === 0 ? X_LEFT : X_RIGHT,
  y: Y_START + i * Y_GAP,
}));

const PATH_D = stationPoints.reduce((d, p, i) => {
  if (i === 0) return `M ${p.x} ${p.y}`;
  const prev = stationPoints[i - 1];
  const bend = Y_GAP / 2;
  return `${d} C ${prev.x} ${prev.y + bend}, ${p.x} ${p.y - bend}, ${p.x} ${p.y}`;
}, "");

const VIEW_W = 400;
const VIEW_H = Y_START * 2 + (N - 1) * Y_GAP;

/* ------------------------------------------------------------------ */

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

export default function OurPresence() {
  const reduced = useSyncExternalStore(subscribeRM, getRM, () => false);
  return reduced ? <StaticPresence /> : <AnimatedPresence />;
}

/* ---------------- Reduced motion: calm static grid ----------------- */

function StaticPresence() {
  return (
    <section className="bg-noir px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <OfficeCard key={loc.city} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
        Our presence
      </p>
      <h2 className="mt-3 max-w-xl text-3xl text-linen md:text-5xl">
        Nine cities. Two states. One standard.
      </h2>
    </>
  );
}

/* ---------------------- The animated journey ----------------------- */

function AnimatedPresence() {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const svgWrapRef = useRef(null);
  const bgRef = useRef(null);
  const pathRef = useRef(null);
  const fillRef = useRef(null);
  const maskRef = useRef(null);
  const orbRef = useRef(null);
  const trailRefs = useRef([]);
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
      const path = pathRef.current;
      const total = path.getTotalLength();

      gsap.set([fillRef.current, maskRef.current], {
        strokeDasharray: total,
        strokeDashoffset: total,
      });

      const setOrbAt = (p) => {
        const pt = path.getPointAtLength(p * total);
        gsap.set(orbRef.current, { attr: { transform: `translate(${pt.x} ${pt.y})` } });
        trailRefs.current.forEach((el, i) => {
          if (!el) return;
          const tp = Math.max(0, p - (i + 1) * 0.012);
          const tpt = path.getPointAtLength(tp * total);
          gsap.set(el, {
            attr: { cx: tpt.x, cy: tpt.y },
            opacity: p > 0.001 ? 0.4 - i * 0.1 : 0,
          });
        });
      };
      setOrbAt(0);

      const playFinale = () => {
        if (finaleRef.current) return;
        finaleRef.current = true;
        setFinale(true);
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.out",
        });
        const counter = { v: 0 };
        tl.to(
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
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
      };

      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        snap: {
          snapTo: 1 / (N - 1),
          duration: { min: 0.25, max: 0.7 },
          ease: "back.out(1.4)",
          directional: true,
        },
        onUpdate: (self) => {
          const p = self.progress;

          const off = total * (1 - p);
          gsap.set([fillRef.current, maskRef.current], { strokeDashoffset: off });
          setOrbAt(p);

          // camera follows the orb
          const svgEl = svgWrapRef.current;
          const overflow = svgEl.scrollHeight - svgEl.parentElement.clientHeight;
          if (overflow > 0)
            gsap.set(svgEl, { y: -p * overflow });

          // background drifts slower — subtle parallax
          gsap.set(bgRef.current, { y: -p * 60 });

          const idx = Math.min(N - 1, Math.round(p * (N - 1)));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
            if (counterRef.current)
              counterRef.current.textContent = String(idx + 1).padStart(2, "0");
          }

          if (p > 0.995) playFinale();
          else if (p < 0.9) resetFinale();
        },
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  /* Mobile: no pin — sticky compact route + stacked cards, driven by
     IntersectionObserver instead of scroll-scrub. */
  const mobileCardRefs = useRef([]);
  const [mobileActive, setMobileActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.dataset.idx);
            setMobileActive((cur) => Math.max(cur, idx));
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    mobileCardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const loc = LOCATIONS[active];

  return (
    <section aria-label="Our presence across nine cities">
      {/* ------------------------- Desktop ------------------------- */}
      <div ref={wrapperRef} className="hidden md:block md:h-[300vh]">
        <div
          ref={pinRef}
          className="relative h-screen overflow-hidden bg-noir"
        >
          {/* blueprint background, 5% opacity, slower parallax */}
          <div
            ref={bgRef}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-20 inset-x-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1D2D5C 1px, transparent 1px), linear-gradient(#1D2D5C 0.5px, transparent 0.5px), linear-gradient(90deg, #1D2D5C 0.5px, transparent 0.5px)",
              backgroundSize: "28px 28px, 112px 112px, 112px 112px",
            }}
          />

          <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-[40%_60%] items-stretch px-10">
            {/* Left — metro route */}
            <div className="relative h-full overflow-hidden">
              <div ref={svgWrapRef} className="will-change-transform">
                <svg
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  className="w-full max-w-[400px]"
                  style={{ height: "auto" }}
                >
                  <defs>
                    <linearGradient id="route-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A9752E" />
                      <stop offset="100%" stopColor="#C89B52" />
                    </linearGradient>
                    <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="45%" stopColor="#E9C98F" />
                      <stop offset="100%" stopColor="#A9752E" />
                    </radialGradient>
                    <filter id="orb-glow" x="-200%" y="-200%" width="500%" height="500%">
                      <feGaussianBlur stdDeviation="8" />
                    </filter>
                    <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" />
                    </filter>
                    <mask id="fill-mask">
                      <path
                        ref={maskRef}
                        d={PATH_D}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    </mask>
                  </defs>

                  {/* muted route ahead */}
                  <path
                    ref={pathRef}
                    d={PATH_D}
                    fill="none"
                    stroke="#D8D5CC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* soft glow under filled route */}
                  <path
                    ref={fillRef}
                    d={PATH_D}
                    fill="none"
                    stroke="url(#route-fill)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    filter="url(#route-glow)"
                    opacity="0.6"
                  />
                  {/* crisp filled route (shares dashoffset via mask) */}
                  <path
                    d={PATH_D}
                    fill="none"
                    stroke="url(#route-fill)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    mask="url(#fill-mask)"
                  />

                  {/* stations */}
                  {stationPoints.map((p, i) => {
                    const state =
                      finale || i < active
                        ? "done"
                        : i === active
                          ? "active"
                          : "todo";
                    return (
                      <g
                        key={LOCATIONS[i].city}
                        transform={`translate(${p.x} ${p.y})`}
                        className="presence-station"
                        style={
                          finale ? { transitionDelay: `${i * 80}ms` } : undefined
                        }
                      >
                        {state === "active" && (
                          <circle
                            key={`ripple-${active}`}
                            className="presence-ripple"
                            r="10"
                            fill="none"
                            stroke="#A9752E"
                            strokeWidth="2"
                          />
                        )}
                        <circle
                          r={state === "active" ? 11 : 7}
                          fill={state === "todo" ? "#F7F6F2" : "#A9752E"}
                          stroke={state === "todo" ? "#B9B5A9" : "#A9752E"}
                          strokeWidth="2"
                          style={{
                            transition:
                              "r 400ms cubic-bezier(0.16,1,0.3,1), fill 400ms, stroke 400ms",
                          }}
                        />
                        {state === "done" && (
                          <path
                            className="presence-check"
                            d="M -3 0 L -1 2.5 L 3.5 -2.5"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                        <text
                          x={p.x === X_LEFT ? 22 : -22}
                          y="5"
                          textAnchor={p.x === X_LEFT ? "start" : "end"}
                          className="fill-brand-slate text-[13px] font-medium"
                          style={{
                            fill: state === "todo" ? "#9aa2ae" : "#1D2D5C",
                            fontWeight: state === "active" ? 600 : 500,
                            transition: "fill 400ms",
                          }}
                        >
                          {LOCATIONS[i].city}
                        </text>
                      </g>
                    );
                  })}

                  {/* particle trail */}
                  {[0, 1, 2].map((i) => (
                    <circle
                      key={i}
                      ref={(el) => (trailRefs.current[i] = el)}
                      r={3 - i * 0.7}
                      fill="#C89B52"
                      opacity="0"
                    />
                  ))}

                  {/* travelling orb */}
                  <g ref={orbRef}>
                    <circle r="16" fill="#A9752E" opacity="0.35" filter="url(#orb-glow)" />
                    <circle r="8" fill="url(#orb-core)" />
                    <circle r="3.5" fill="#FFF7E8" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Right — active office */}
            <div className="relative flex h-full flex-col justify-center pl-16">
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

              <SectionHeading />

              <div className="mt-10 max-w-lg" key={active}>
                <div className="presence-card-in">
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
        <SectionHeading />

        {/* compact sticky route */}
        <div className="sticky top-0 z-10 -mx-6 mt-8 bg-noir/90 px-6 py-4 backdrop-blur">
          <div className="relative h-2 rounded-full bg-brand-line">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brass to-[#E2C07E] transition-[width] duration-500 ease-out"
              style={{ width: `${(mobileActive / (N - 1)) * 100}%` }}
            />
            {LOCATIONS.map((l, i) => (
              <span
                key={l.city}
                className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300 ${
                  i <= mobileActive
                    ? "border-brass bg-brass"
                    : "border-[rgba(242,239,233,0.2)] bg-noir"
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
            <div
              key={l.city}
              data-idx={i}
              ref={(el) => (mobileCardRefs.current[i] = el)}
            >
              <OfficeCard loc={l} />
            </div>
          ))}
        </div>
      </div>

      {/* scoped animations */}
      <style jsx global>{`
        .presence-ripple {
          animation: presence-ripple 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes presence-ripple {
          from {
            r: 10;
            opacity: 0.7;
          }
          to {
            r: 26;
            opacity: 0;
          }
        }
        .presence-check {
          stroke-dasharray: 12;
          stroke-dashoffset: 12;
          animation: presence-check 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms forwards;
        }
        @keyframes presence-check {
          to {
            stroke-dashoffset: 0;
          }
        }
        .presence-card-in {
          animation: presence-card-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes presence-card-in {
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

/* -------------------------- Office card ---------------------------- */

export function OfficeCard({ loc }) {
  const isOffice = loc.type === "office";
  const mapHref =
    loc.map ||
    `https://www.google.com/maps/search/${encodeURIComponent(`${loc.city}, ${loc.region}`)}`;
  const chips = isOffice
    ? ["Regional office", "Registered valuers", "Chartered engineers"]
    : ["Service area", "On-site inspections", "Served from our offices"];

  return (
    <div className="rounded-3xl border border-[rgba(242,239,233,0.12)] bg-white/[0.04] p-7 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            {isOffice ? "Office" : "Service area"}
          </p>
          <h3 className="mt-1 text-3xl text-linen">
            {loc.city}
          </h3>
          <p className="text-sm text-fog">{loc.region}</p>
        </div>
        {/* photo placeholder */}
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brass/10 text-brass/60">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 4l9 6.5M5 9.5V20h14V9.5M9.5 20v-6h5v6" />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-fog"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-5 space-y-3 text-sm leading-relaxed text-fog">
        {isOffice ? (
          <p>{loc.address}</p>
        ) : (
          <p>
            Site inspections and valuations conducted on location, serviced
            from our Nagpur and Chhindwara offices.
          </p>
        )}
        <p>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="whitespace-nowrap hover:text-brass"
          >
            {PHONE}
          </a>
          <span className="mx-2 text-brand-line">·</span>
          <a href={`mailto:${EMAIL}`} className="break-all hover:text-brass">
            {EMAIL}
          </a>
        </p>
        {isOffice && <p>{HOURS}</p>}
      </div>

      <a
        href={mapHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-brass/60 px-5 text-xs font-semibold text-brass transition hover:bg-brass hover:text-noir"
      >
        View on Google Maps
      </a>
    </div>
  );
}
