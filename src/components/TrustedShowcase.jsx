"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const ORGS = [
  { src: "/logos/incometax.png", name: "Income Tax Department" },
  { src: "/logos/SBI.png", name: "State Bank of India" },
  { src: "/logos/DebtsRecovery.png", name: "Debts Recovery Tribunal" },
  { src: "/logos/unionbank.png", name: "Union Bank of India" },
  { src: "/logos/centralbank.png", name: "Central Bank of India" },
  { src: "/logos/boi.png", name: "Bank of India" },
  { src: "/logos/indianbanklogo.png", name: "Indian Bank" },
  { src: "/logos/punjab.png", name: "Punjab National Bank" },
  { src: "/logos/canara.png", name: "Canara Bank" },
  { src: "/logos/uco.png", name: "UCO Bank" },
  { src: "/logos/bankofmh.png", name: "Bank of Maharashtra" },
  { src: "/logos/LIChousing.png", name: "LIC Housing Finance" },
  { src: "/logos/hdfc.png", name: "HDFC Bank" },
  { src: "/logos/idbi.png", name: "IDBI Bank" },
  { src: "/logos/mpgb.jpg", name: "Madhya Pradesh Gramin Bank" },
];

const BASE_SPEED = 110; // px/s
const HOVER_SPEED = 30; // slows, never stops

export default function TrustedShowcase() {
  const laneRef = useRef(null);
  const trackRef = useRef(null);
  const glowRef = useRef(null);
  const itemRefs = useRef([]); // wrappers (position measurement)
  const visualRefs = useRef([]); // inner image blocks (styled per frame)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lane = laneRef.current;
    const track = trackRef.current;

    let x = 0;
    let speed = BASE_SPEED;
    let targetSpeed = BASE_SPEED;
    let half = 0;
    let laneW = 0;
    let centers = [];
    let hovered = null;
    let last = performance.now();
    let raf = 0;
    let running = false;
    const lastT = [];

    const measure = () => {
      half = track.scrollWidth / 2;
      laneW = lane.clientWidth;
      centers = itemRefs.current.map((el) =>
        el ? el.offsetLeft + el.offsetWidth / 2 : 0
      );
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // ease the lane speed toward its target (hover slow-down)
      speed += (targetSpeed - speed) * Math.min(1, dt * 4);
      x -= speed * dt;
      if (half > 0 && x <= -half) x += half;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

      // the spotlight itself breathes — light, not a static gradient
      const glow = glowRef.current;
      if (glow) {
        const breathe = Math.sin(now / 1600);
        glow.style.opacity = (0.65 + breathe * 0.2).toFixed(3);
        glow.style.transform = `translateX(-50%) scaleX(${(1 + breathe * 0.05).toFixed(3)})`;
      }

      // spotlight: every logo styled by its live distance from center.
      // Style writes are throttled: skip logos whose emphasis barely
      // changed, and only pay for drop-shadow near the center — filter
      // updates on 30 nodes per frame were the main scroll-jank source.
      const mid = laneW / 2;
      for (let i = 0; i < visualRefs.current.length; i++) {
        const vis = visualRefs.current[i];
        if (!vis || !centers.length) continue;
        // centers[] covers both copies (all 30 wrappers measured)
        const c = centers[i];
        if (c === undefined) continue;
        const d = Math.abs(c + x - mid) / (mid || 1);
        // wide plateau: the central ~60% of the lane is at full emphasis
        // (3-4 logos at once), fading only toward the masked edges
        let t = Math.min(1, Math.max(0, (0.9 - d) / 0.3));
        if (hovered === i) t = 1;
        const prev = lastT[i];
        if (prev !== undefined && Math.abs(prev - t) < 0.008 && hovered !== i)
          continue;
        lastT[i] = t;
        const grow = hovered === i ? 0.06 : 0;
        vis.style.opacity = (0.45 + 0.55 * t).toFixed(3);
        vis.style.transform = `scale(${(0.92 + 0.13 * t + grow).toFixed(3)}) translateZ(0)`;
        // no blur — logos stay crisp; gold glow only where it's visible
        const shadow =
          t > 0.35
            ? ` drop-shadow(0 0 ${(7 * t).toFixed(1)}px rgba(169,117,46,${(0.28 * t).toFixed(3)}))`
            : "";
        vis.style.filter =
          `grayscale(${(1 - t).toFixed(3)}) ` +
          `brightness(${(0.96 + 0.18 * t).toFixed(3)})` +
          shadow;
      }
    };

    const onEnter = () => (targetSpeed = HOVER_SPEED);
    const onLeave = () => {
      targetSpeed = BASE_SPEED;
      hovered = null;
    };
    lane.addEventListener("pointerenter", onEnter);
    lane.addEventListener("pointerleave", onLeave);

    const itemListeners = itemRefs.current.map((el, i) => {
      if (!el) return null;
      const enter = () => (hovered = i);
      const leave = () => (hovered = hovered === i ? null : hovered);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return { el, enter, leave };
    });

    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(lane);
    measure();

    // run the lane only while it's on screen — its rAF must not compete
    // with the hero's WebGL loop during the scroll handoff
    const start = () => {
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px 0px" }
    );
    io.observe(lane);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      lane.removeEventListener("pointerenter", onEnter);
      lane.removeEventListener("pointerleave", onLeave);
      itemListeners.forEach((l) => {
        if (!l) return;
        l.el.removeEventListener("pointerenter", l.enter);
        l.el.removeEventListener("pointerleave", l.leave);
      });
    };
  }, []);

  let refIdx = 0;

  return (
    <section className="relative overflow-hidden bg-noir pb-20 pt-10 md:pb-24 md:pt-12">
      {/* ambient depth — barely there */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(201,160,99,0.05), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Reveal index={0}>
          <div className="mx-auto h-px w-14 bg-brass" />
        </Reveal>
        <Reveal index={1}>
          <h2 className="mt-6 text-center text-3xl text-linen md:text-5xl">
            Trusted by India&apos;s leading institutions
          </h2>
        </Reveal>
        <Reveal index={2}>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-fog">
            Valuation services trusted by public sector banks, government
            departments, courts, housing finance companies and financial
            institutions across India.
          </p>
        </Reveal>
      </div>

      <Reveal index={3} className="mt-8 md:mt-10">
        <div
          ref={laneRef}
          className="relative"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 22%, black 78%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 22%, black 78%, transparent)",
          }}
        >
          {/* the living spotlight */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-y-0 left-1/2 w-[26rem] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(closest-side, rgba(169,117,46,0.09), transparent)",
            }}
          />

          <div
            ref={trackRef}
            className="flex w-max items-center will-change-transform"
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className="flex items-center"
              >
                {ORGS.map((org) => {
                  const i = refIdx++;
                  return (
                    <div
                      key={`${copy}-${org.name}`}
                      ref={(el) => (itemRefs.current[i] = el)}
                      className="group relative mx-3 flex flex-col items-center md:mx-6"
                    >
                      <div
                        ref={(el) => (visualRefs.current[i] = el)}
                        className="flex h-20 w-36 items-center justify-center rounded-xl bg-[#F5F2EA] p-2 sm:h-24 sm:w-44 lg:h-28 lg:w-52 lg:p-3"
                      >
                        <Image
                          src={org.src}
                          alt={copy === 0 ? org.name : ""}
                          width={320}
                          height={160}
                          quality={90}
                          className="max-h-16 w-auto max-w-full object-contain sm:max-h-20 lg:max-h-24"
                        />
                      </div>
                      <span className="pointer-events-none absolute -bottom-6 whitespace-nowrap text-[11px] font-medium tracking-wide text-fog opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {org.name}
                        <span className="mx-auto mt-0.5 block h-px w-0 bg-brass transition-[width] duration-300 group-hover:w-full" />
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
