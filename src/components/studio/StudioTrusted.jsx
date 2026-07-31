"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field, onField } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* The horizontal beat. It used to carry four abstract slides; it now
   carries the thing those slides were only gesturing at — the institutions
   whose work this firm actually does. The mechanic is unchanged: the strip
   travels sideways while the visitor scrolls down, the page's one particle
   field condenses into a band behind it, and the field smears with the
   strip's velocity.

   It is a scroll-driven traverse with a beginning and an end, not a
   marquee: no autoplay, no loop, no duplicated set (§14). */

/* The record, verbatim from src/components/TrustedShowcase.jsx — the
   site's existing register of these institutions. */
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

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

/* The strip moves on its own. Unpinning it (WI-1's pin-budget resolution)
   was read too literally the first time: it removed the pin AND the
   motion, leaving a lane you had to drag. The pin stays gone — the budget
   holds — but the strip drifts continuously the way the homepage's does,
   slowing rather than stopping when you reach for it. */
const BASE_SPEED = 78; // px/s
const HOVER_SPEED = 22; // slows, never stops

/* No `priority` on any of these: the strip is several viewports down, and
   preloading it would compete with the hero. It also made hydration throw
   — the preload links belong to a subtree that is swapped out the moment
   the reduced-motion snapshot resolves. */
function Card({ org }) {
  return (
    <figure className="er-tcard">
      <span className="er-tcard__plate">
        <Image
          src={org.src}
          alt={org.name}
          width={320}
          height={160}
          quality={90}
          sizes="(max-width: 900px) 60vw, 22vw"
        />
      </span>
      <figcaption className="er-label er-label--faint er-tcard__n">
        {org.name}
      </figcaption>
    </figure>
  );
}

export default function StudioTrusted() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const trackRef = useRef(null);

  useEffect(() => {
    /* Read the query live as well as from the store. `useSyncExternalStore`
       hands back the server snapshot (false) for the hydration pass, so
       this effect can fire once with a stale value — long enough to build
       the pin, which reparents the section into a pin-spacer. React then
       re-renders with the true value and throws trying to remove children
       that no longer sit where it left them. */
    if (reduced || window.matchMedia(QUERY).matches) return;
    const mm = gsap.matchMedia();

    /* WI-1 pin-budget resolution: this strip gives up its pin so the
       service showcase can have one. The native lane that used to be the
       phone's behaviour is now the only behaviour at every width — logo
       cards do not need cinematic scrubbing, and a strip you can throw
       with a finger or a shift-wheel is better than one that holds the
       page hostage for two viewports. */
    /* ------------- phone: a native swipe, and an ambient band ----------- */
    mm.add("all", () => {
      const lane = document.querySelector(".er-tlane");
      if (!lane) return;

      /* An ambient band, not a coupled one: evenly spaced knots across the
         frame at the height the cards sit at, so the field reads as a
         horizon behind the strip and stays off the copy above it. */
      const measure = () => {
        const s = field();
        if (!s) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const plate = lane.querySelector(".er-tcard__plate");
        if (!plate) return;
        /* The section is not pinned here, so the card row has no fixed
           place in the frame — the band sits a little below centre and
           stays there while the whole section scrolls past it. */
        const step = vw / 4;
        const anchors = [-1.5, -0.5, 0.5, 1.5].map((n) => s.mapX(n * step));
        const w = plate.getBoundingClientRect().width;
        s.setBandAnchors(anchors, w * 0.5 * s.worldPerPx(), s.mapY(vh * 0.08));
      };
      measure();
      const unwait = onField(() => measure());
      window.addEventListener("resize", measure);

      /* The field stays in band mode for the whole section but never
         chases the cards: at this width the strip is a separate surface
         the finger controls, and coupling it to scroll would fight the
         browser's own momentum. Velocity is quartered to a drift. */
      const amb = ScrollTrigger.create({
        trigger: ".er-trsec",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const s = field();
          if (!s) return;
          /* in over the first fifth, out over the last */
          const p = self.progress;
          s.setMode(gsap.utils.clamp(0, 1, Math.min(p / 0.2, (1 - p) / 0.2)));
        },
        onLeave: () => field()?.setMode(0),
        onLeaveBack: () => field()?.setMode(0),
      });

      /* ---- the drift ----
         One transform on the track, wrapping at half its width because the
         set is rendered twice. The field's velocity coupling is keyed to
         this speed, so the dots still smear opposite the travel. */
      const track = trackRef.current;
      let raf = 0;
      let last = 0;
      let x = 0;
      let speed = BASE_SPEED;
      let target = BASE_SPEED;
      let half = 0;
      const remeasure = () => {
        half = track ? track.scrollWidth / 2 : 0;
      };
      remeasure();
      window.addEventListener("resize", remeasure);

      const frame = (now) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        speed += (target - speed) * Math.min(1, dt * 4);
        x -= speed * dt;
        if (half > 0 && x <= -half) x += half;
        if (track) track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
        const s = field();
        if (s) s.setVelocity(gsap.utils.clamp(-1, 1, speed / 260) * 0.55);
      };
      raf = requestAnimationFrame(frame);

      const slow = () => {
        target = HOVER_SPEED;
      };
      const resume = () => {
        target = BASE_SPEED;
      };
      lane.addEventListener("pointerenter", slow);
      lane.addEventListener("pointerleave", resume);
      lane.addEventListener("focusin", slow);
      lane.addEventListener("focusout", resume);

      return () => {
        unwait();
        window.removeEventListener("resize", measure);
        window.removeEventListener("resize", remeasure);
        lane.removeEventListener("pointerenter", slow);
        lane.removeEventListener("pointerleave", resume);
        lane.removeEventListener("focusin", slow);
        lane.removeEventListener("focusout", resume);
        if (raf) cancelAnimationFrame(raf);
        if (track) track.style.transform = "";
        amb.kill();
        const s = field();
        if (s) {
          s.setMode(0);
          s.setVelocity(0);
        }
      };
    });

    return () => mm.revert();
  }, [reduced]);

  const header = (
    <header className="er-trhead">
      <span className="er-rule er-trhead__rule" />
      <h2 id="er-trusted" className="er-display er-trhead__h">
        Trusted by India’s leading institutions
      </h2>
      <p className="er-body er-trhead__p">
        Valuation services trusted by public sector banks, government
        departments, courts, housing finance companies and financial
        institutions across India.
      </p>
    </header>
  );

  /* One stable <section> either way. The two presentations are siblings
     inside it, never alternative roots — React has to be able to reconcile
     across the reduced-motion snapshot flip without replacing the element
     the rest of the page's scroll machinery is measuring against. */
  return (
    <section className="er-section er-trsec" aria-labelledby="er-trusted">
      {/* reduced motion: no pin, no travel, no drift — the same fifteen
          marks laid out and read, which is all the section ever claimed */}
      {reduced ? (
        <div className="er-wrap">
          {header}
          <ul className="er-tgrid">
            {ORGS.map((org) => (
              <li key={org.name}>
                <Card org={org} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="er-trwrap">
          <div className="er-trpin">
            <div className="er-wrap">{header}</div>

            {/* One list, two presentations: the desktop track is
                transformed by ScrollTrigger, the phone lane is scrolled by
                the finger. */}
            <div className="er-tlane">
              {/* rendered twice so the wrap is seamless; the second pass
                  is decoration and is hidden from assistive tech, so each
                  institution is announced exactly once */}
              <ul ref={trackRef} className="er-ttrack">
                {ORGS.map((org) => (
                  <li key={org.name}>
                    <Card org={org} />
                  </li>
                ))}
                {ORGS.map((org) => (
                  <li key={`dup-${org.name}`} aria-hidden="true">
                    <Card org={org} />
                  </li>
                ))}
              </ul>
            </div>

            {/* A continuous drift has no start and no end, so the
                progress hairline goes with the traverse that had one. The
                count still states the size of the record. */}
            <p className="er-trprog er-trprog__n er-label" aria-hidden="true">
              {`${String(ORGS.length).padStart(2, "0")} Institutions`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
