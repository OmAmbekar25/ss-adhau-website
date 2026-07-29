"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";

/* HERO v3 — full-bleed optical glass on true black.
   The photographic shatter plate is composited over itself: screen-blend
   bloom, warm/cool dispersion copies, and a colour-dodge flare masked to
   the light position, so wherever the light lands the shards blow out to
   white. The cursor moves the LIGHT (damped, with idle drift when the
   visitor rests) — never the glass. No WebGL. Copy is ours; the type is
   the v3 language: Cormorant Garamond, Archivo, IBM Plex Mono. */

const EASE = [0.16, 1, 0.3, 1];

const TRUST = [
  "IBBI Registered · Category I",
  "Income Tax Dept. Approved",
  "Chartered Engineers",
];

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

function Rise({ children, delay, reduced, className }) {
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const sectionRef = useRef(null);

  /* the light: damped pointer-follow; keeps wandering on its own when
     the visitor rests. Sets CSS custom properties, nothing re-renders. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (reduced) {
      el.style.setProperty("--px", "50%");
      el.style.setProperty("--py", "46%");
      el.style.setProperty("--shine", "50%");
      return;
    }

    let tx = 0.5;
    let ty = 0.46;
    let cx = tx;
    let cy = ty;
    let idle = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const set = (x, y) => {
      tx = x;
      ty = y;
      last = performance.now();
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    const onLeave = () => set(0.5, 0.46);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    const frame = (now) => {
      raf = requestAnimationFrame(frame);

      // once you stop, the light keeps moving on its own
      if (now - last > 2000) {
        idle += 0.0018;
        tx = 0.5 + Math.cos(idle) * 0.3;
        ty = 0.46 + Math.sin(idle * 0.66) * 0.2;
      }

      // damped — the light has weight
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;

      el.style.setProperty("--px", (cx * 100).toFixed(2) + "%");
      el.style.setProperty("--py", (cy * 100).toFixed(2) + "%");
      // the field shifts a few pixels against the light. no rotation.
      el.style.setProperty("--gx", ((cx - 0.5) * -22).toFixed(1) + "px");
      el.style.setProperty("--gy", ((cy - 0.5) * -16).toFixed(1) + "px");
      // the same light polishes the letterforms
      el.style.setProperty("--shine", (100 - cx * 100).toFixed(1) + "%");
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(el);
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="S S Adhau Valuers & Engineers"
      className="hv3"
    >
      {/* the glass stack — every layer is the same photograph */}
      <motion.div
        aria-hidden="true"
        className="hv3-stack"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <div className="hv3-g hv3-g--base" />
        <div className="hv3-g hv3-g--bloom" />
        <div className="hv3-g hv3-g--warm" />
        <div className="hv3-g hv3-g--cool" />
        <div className="hv3-g hv3-g--flare" />
        <div className="hv3-g hv3-g--sweep" />
        <div className="hv3-vignette" />
        <div className="hv3-veil" />
      </motion.div>

      <div className="hv3-stage">
        <div className="hv3-block">
          <Rise delay={0.2} reduced={reduced}>
            <div className="hv3-seal" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path
                    id="hv3-arc-top"
                    d="M 100,100 m -76,0 a 76,76 0 1,1 152,0"
                    fill="none"
                  />
                  <path
                    id="hv3-arc-bot"
                    d="M 100,100 m 76,0 a 76,76 0 1,1 -152,0"
                    fill="none"
                  />
                </defs>
                <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <text className="hv3-seal-arc">
                  <textPath href="#hv3-arc-top" startOffset="50%" textAnchor="middle">
                    Valuers &amp; Engineers
                  </textPath>
                </text>
                <text className="hv3-seal-arc">
                  <textPath href="#hv3-arc-bot" startOffset="50%" textAnchor="middle">
                    Nagpur · Chhindwara
                  </textPath>
                </text>
                <text className="hv3-seal-mono" x="100" y="116">
                  SSA
                </text>
              </svg>
            </div>
          </Rise>

          <Rise delay={0.35} reduced={reduced}>
            <p className="hv3-eyebrow">
              Registered Valuers · Chartered Engineers
            </p>
          </Rise>

          <Rise delay={0.5} reduced={reduced}>
            <h1 className="hv3-headline">
              Every Decision
              <br />
              Begins With
              <em>The Right Value.</em>
            </h1>
          </Rise>

          <Rise delay={0.75} reduced={reduced}>
            <div className="hv3-flourish" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
          </Rise>

          <Rise delay={0.9} reduced={reduced}>
            <p className="hv3-sub">
              Government-approved valuation experts delivering precise,
              compliant and <strong>defensible valuation reports</strong> for
              banks, financial institutions, courts, government bodies and
              businesses across Central India.
            </p>
          </Rise>

          <Rise delay={1.1} reduced={reduced}>
            <div className="hv3-actions">
              <Link className="hv3-btn" href="/contact">
                Request a Valuation
              </Link>
              <Link className="hv3-btn hv3-btn--bare" href="/services">
                Explore Our Services
              </Link>
            </div>
          </Rise>
        </div>
      </div>

      <Rise delay={1.3} reduced={reduced} className="hv3-foot">
        <div className="hv3-footrow">
          <ul className="hv3-meta" aria-label="Credentials">
            {TRUST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="hv3-hint" aria-hidden="true">
            Move to catch the light
          </p>
        </div>
      </Rise>

      <style jsx global>{`
        .hv3 {
          --hv3-white: #f2efe9;
          --hv3-dim: #9c9a93;
          --hv3-brass: #c9a063;
          --px: 50%;
          --py: 46%;
          --gx: 0px;
          --gy: 0px;
          --shine: 50%;
          --hv3-gutter: clamp(20px, 4.5vw, 68px);

          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          isolation: isolate;
          overflow: hidden;
          background: #000;
          color: var(--hv3-dim);
          font-family: var(--font-archivo), system-ui, sans-serif;
        }

        .hv3-stack {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        /* ---- the glass stack. every layer is the same image. ---- */
        .hv3-g {
          position: absolute;
          inset: -3%;
          background: url("/images/hero-glass.jpg") center/cover no-repeat;
          pointer-events: none;
          will-change: transform;
          transform: translate3d(var(--gx), var(--gy), 0);
        }
        .hv3-g--base {
          z-index: 1;
          filter: contrast(1.06) saturate(1.05);
        }
        .hv3-g--bloom {
          z-index: 2;
          mix-blend-mode: screen;
          opacity: 0.55;
          filter: blur(24px) brightness(1.8) saturate(1.2);
        }
        .hv3-g--warm {
          z-index: 3;
          mix-blend-mode: screen;
          opacity: 0.34;
          filter: sepia(1) saturate(4) hue-rotate(-18deg) brightness(1.15);
          transform: translate3d(calc(var(--gx) + 2px), calc(var(--gy) - 1.5px), 0) scale(1.004);
        }
        .hv3-g--cool {
          z-index: 3;
          mix-blend-mode: screen;
          opacity: 0.22;
          filter: sepia(1) saturate(4) hue-rotate(165deg) brightness(1.05);
          transform: translate3d(calc(var(--gx) - 2px), calc(var(--gy) + 1.5px), 0) scale(1.004);
        }
        .hv3-g--flare {
          z-index: 4;
          mix-blend-mode: color-dodge;
          opacity: 0.92;
          filter: brightness(1.35) contrast(1.35);
          -webkit-mask-image: radial-gradient(
            34vw 34vw at var(--px) var(--py),
            #000 0%,
            rgba(0, 0, 0, 0.5) 42%,
            transparent 74%
          );
          mask-image: radial-gradient(
            34vw 34vw at var(--px) var(--py),
            #000 0%,
            rgba(0, 0, 0, 0.5) 42%,
            transparent 74%
          );
        }
        .hv3-g--sweep {
          z-index: 5;
          mix-blend-mode: color-dodge;
          opacity: 0.6;
          filter: brightness(1.5) contrast(1.2);
          -webkit-mask-image: linear-gradient(
            102deg,
            transparent 38%,
            rgba(0, 0, 0, 0.85) 47%,
            #000 50%,
            rgba(0, 0, 0, 0.85) 53%,
            transparent 62%
          );
          mask-image: linear-gradient(
            102deg,
            transparent 38%,
            rgba(0, 0, 0, 0.85) 47%,
            #000 50%,
            rgba(0, 0, 0, 0.85) 53%,
            transparent 62%
          );
          -webkit-mask-size: 260% 100%;
          mask-size: 260% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          animation: hv3-sweep 11s linear infinite;
        }
        @keyframes hv3-sweep {
          from {
            -webkit-mask-position: 145% 0;
            mask-position: 145% 0;
          }
          to {
            -webkit-mask-position: -145% 0;
            mask-position: -145% 0;
          }
        }

        .hv3-vignette {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          background: radial-gradient(
            112% 96% at 50% 46%,
            transparent 0%,
            transparent 44%,
            rgba(0, 0, 0, 0.62) 82%,
            #000 100%
          );
        }
        .hv3-veil {
          position: absolute;
          inset: 0;
          z-index: 7;
          pointer-events: none;
          background: radial-gradient(
            54% 52% at 50% 48%,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(0, 0, 0, 0.42) 52%,
            transparent 80%
          );
        }

        /* ============ TYPE ============ */
        .hv3-stage {
          position: relative;
          z-index: 8;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(40px, 7vh, 96px) var(--hv3-gutter);
        }
        .hv3-block {
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hv3-seal {
          width: clamp(58px, 6vw, 80px);
          aspect-ratio: 1;
          color: var(--hv3-brass);
          opacity: 0.75;
          margin: 0 auto clamp(20px, 2.6vh, 30px);
          filter: drop-shadow(0 0 10px rgba(201, 160, 99, 0.35));
        }
        .hv3-seal svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .hv3-seal-arc {
          font-family: var(--font-plex-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          fill: currentColor;
        }
        .hv3-seal-mono {
          font-family: var(--font-cormorant), serif;
          font-size: 44px;
          letter-spacing: 0.04em;
          fill: currentColor;
          text-anchor: middle;
        }

        .hv3-eyebrow {
          font-family: var(--font-plex-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: var(--hv3-brass);
          margin-bottom: clamp(18px, 2.4vh, 28px);
        }

        .hv3-headline {
          font-family: var(--font-cormorant), serif;
          font-weight: 300;
          font-size: clamp(44px, 7.6vw, 118px);
          line-height: 0.98;
          letter-spacing: 0.005em;
          background: linear-gradient(
            105deg,
            #8f918c 0%,
            #ffffff 34%,
            #f2efe9 46%,
            #a9aba6 68%,
            #edeae3 100%
          );
          background-size: 220% 100%;
          background-position: var(--shine) 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 2px 24px rgba(0, 0, 0, 0.9))
            drop-shadow(0 0 46px rgba(242, 239, 233, 0.14));
        }
        .hv3-headline em {
          display: block;
          font-style: italic;
          font-weight: 300;
          font-size: 1.18em;
          letter-spacing: -0.008em;
          margin-top: -0.04em;
        }

        .hv3-flourish {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          width: min(300px, 52vw);
          margin: clamp(24px, 3.2vh, 38px) auto 0;
          color: var(--hv3-brass);
          opacity: 0.75;
        }
        .hv3-flourish span {
          flex: 1;
          height: 1px;
          background: currentColor;
          opacity: 0.5;
        }
        .hv3-flourish i {
          width: 5px;
          height: 5px;
          background: currentColor;
          rotate: 45deg;
          box-shadow: 0 0 8px currentColor;
        }

        .hv3-sub {
          margin: clamp(22px, 3vh, 32px) auto 0;
          max-width: 54ch;
          font-size: clamp(13.5px, 1vw, 16px);
          line-height: 1.7;
          color: var(--hv3-dim);
        }
        .hv3-sub strong {
          color: var(--hv3-white);
          font-weight: 500;
        }

        .hv3-actions {
          margin-top: clamp(28px, 3.8vh, 42px);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 14px 28px;
        }
        .hv3-btn {
          font-family: var(--font-plex-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 15px 28px;
          color: var(--hv3-white);
          border: 1px solid rgba(242, 239, 233, 0.22);
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          transition:
            border-color 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.5s,
            color 0.5s;
        }
        .hv3-btn:hover,
        .hv3-btn:focus-visible {
          border-color: var(--hv3-brass);
          color: var(--hv3-brass);
          background: rgba(0, 0, 0, 0.6);
        }
        .hv3-btn--bare {
          border: 0;
          border-bottom: 1px solid rgba(242, 239, 233, 0.3);
          padding: 15px 2px;
          background: none;
          backdrop-filter: none;
          color: rgba(242, 239, 233, 0.85);
        }
        .hv3-btn--bare:hover,
        .hv3-btn--bare:focus-visible {
          color: var(--hv3-white);
          border-bottom-color: rgba(242, 239, 233, 0.6);
          background: none;
        }

        .hv3-foot {
          position: relative;
          z-index: 8;
          padding: 0 var(--hv3-gutter) var(--hv3-gutter);
        }
        .hv3-footrow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px 34px;
          padding-top: 18px;
          border-top: 1px solid rgba(242, 239, 233, 0.1);
        }
        .hv3-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 26px;
          list-style: none;
          font-family: var(--font-plex-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          color: var(--hv3-dim);
        }
        .hv3-hint {
          font-family: var(--font-plex-mono), monospace;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--hv3-dim);
          animation: hv3-breathe 5.5s ease-in-out infinite;
        }
        @keyframes hv3-breathe {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.6;
          }
        }

        @media (max-width: 900px) {
          .hv3-headline {
            font-size: clamp(42px, 12vw, 82px);
          }
          .hv3-g--bloom {
            opacity: 0.42;
            filter: blur(16px) brightness(1.6);
          }
          .hv3-hint {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hv3-g--sweep {
            animation: none;
            opacity: 0.3;
          }
          .hv3-hint {
            animation: none;
            opacity: 0.4;
          }
        }
      `}</style>
    </section>
  );
}
