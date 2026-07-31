"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { field, story } from "./fieldBus";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* WI-1 — the service showcase.
 *
 * The six services were a vertical list you scanned. They are now six full
 * slides you travel through: the section pins, downward scroll carries the
 * track sideways one viewport per service, and the pin releases after the
 * sixth. Smoothness is the acceptance criterion, so every moving part is a
 * transform driven from ONE scrub value — no layout reads in the handler,
 * nothing animating that is not transform or opacity.
 *
 * The colour worlds come free here. There is no hover state to manage: the
 * central slide is the active one, hue intensity is a function of how
 * centred it is, and dragging between two slides mixes their hues without
 * ever passing through grey.
 */

const SERVICES = [
  {
    n: "01",
    img: "/images/slides/slide-01-real-estate.webp",
    alt: "A residential and commercial facade in strong raking light",
    title: ["Real estate ", "valuation"],
    em: 1,
    hue: "#8A6D3F",
    tag: "Residential · Commercial · Industrial",
    desc: "Residential, commercial and industrial property — inspected, measured and benchmarked against local market evidence.",
  },
  {
    n: "02",
    img: "/images/slides/slide-02-machinery.webp",
    alt: "A radial engine and propeller, close-up on the machined detail",
    title: ["Plant & machinery ", "valuation"],
    em: 1,
    hue: "#3F5C7A",
    tag: "Age · Condition · Market",
    desc: "Age, condition and market comparables for plant, machinery and equipment — from single assets to full facilities.",
  },
  {
    n: "03",
    img: "/images/slides/slide-03-ibc.webp",
    alt: "A colonnade of fluted columns on a courthouse portico",
    title: ["Valuation under ", "IBC"],
    em: 1,
    hue: "#7A3F46",
    tag: "CIRP · Liquidation",
    desc: "CIRP and liquidation valuations under the Insolvency and Bankruptcy Code, built to survive committee and court review.",
  },
  {
    n: "04",
    img: "/images/slides/slide-04-business.webp",
    alt: "A city skyline at dusk, towers reduced to silhouette",
    title: ["Business ", "valuation"],
    em: 1,
    hue: "#5C4A7A",
    tag: "Income · Market · Asset",
    desc: "Income, market and asset approaches to whole-business value — for transactions, disputes and planning.",
  },
  {
    n: "05",
    img: "/images/slides/slide-05-financial.webp",
    alt: "A close crop of a written ledger page",
    title: ["Financial reporting ", "valuation"],
    em: 1,
    hue: "#3F6E66",
    tag: "Ind-AS · IFRS",
    desc: "Ind-AS and IFRS fair-value measurements with the working papers auditors ask for.",
  },
  {
    n: "06",
    img: "/images/slides/slide-06-ma.webp",
    alt: "Two towers joined by a skybridge, seen from below",
    title: ["Merger & acquisition ", "support"],
    em: 1,
    hue: "#7A5A3F",
    tag: "Restructuring",
    desc: "Valuation support through restructuring and M&A — diligence, swap ratios and fairness opinions.",
  },
];

const N = SERVICES.length;
const TINT_CENTRE = 0.45;

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

/* The photographs arrive already graded — desaturated, duotoned to the
   site tokens, grained, blacks crushed, and the slide's hue in the shadows
   at 8%. So nothing is re-graded here: a second pass in CSS would stack on
   top of the first and crush what the exports already resolved. The card
   contributes the mask, the parallax and the shadow only.
   Provenance for all six is in docs/asset-licenses.md. */
function Card({ service }) {
  return (
    <div className="er-sccard" data-sc-card>
      <div className="er-sccard__mask">
        <div className="er-sccard__img" data-sc-img>
          <Image
            src={service.img}
            alt={service.alt}
            width={1600}
            height={2000}
            sizes="(max-width: 900px) 88vw, min(46vw, 520px)"
            /* eager: the section pins on arrival, and a card still
               decoding while the track starts moving is exactly the
               stutter the smoothness criterion rules out */
            loading="eager"
            className="er-sccard__pic"
          />
        </div>
      </div>
    </div>
  );
}

function Body({ service }) {
  return (
    <>
      <p className="er-label er-sc__n" data-sc-n>
        {service.n}
      </p>
      <h3 className="er-display er-sc__t" data-sc-layer data-rate="1">
        {service.title.map((part, i) =>
          i === service.em ? <em key={i}>{part}</em> : part
        )}
      </h3>
      <p className="er-body er-sc__d" data-sc-layer data-rate="0.96">
        {service.desc}
      </p>
      <p className="er-label er-label--faint er-sc__tag">{service.tag}</p>
      <Link className="er-sc__link" href="/services">
        Explore this service <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}

export default function StudioShowcase() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (reduced || window.matchMedia(QUERY).matches) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      const sec = wrap.closest("[data-showcase]");
      const slides = gsap.utils.toArray(".er-scslide", track);
      const cards = slides.map((s) => s.querySelector("[data-sc-card]"));
      const imgs = slides.map((s) => s.querySelector("[data-sc-img]"));
      const washes = slides.map((s) => s.querySelector("[data-sc-wash]"));

      let raf = 0;
      let liveHue = null;
      let liveAmt = 0;

      /* the tint lapses unless restated — see studioScene.setTint */
      const pump = () => {
        if (liveAmt <= 0.001) {
          raf = 0;
          return;
        }
        field()?.setTint(liveHue, liveAmt);
        raf = requestAnimationFrame(pump);
      };
      const startPump = () => {
        if (!raf) raf = requestAnimationFrame(pump);
      };

      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        /* scrub: 1 — the catch-up lag IS the weight. `true` is rigid and
           reads as a rail rather than a mass with inertia. */
        scrub: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (N - 1), duration: 0.5, delay: 0.1 },
        onUpdate: (self) => {
          const p = self.progress;
          /* one number drives everything below it — no layout reads */
          const pos = p * (N - 1);
          gsap.set(track, { xPercent: -(100 / N) * (N - 1) * p });

          let bestI = 0;
          let bestC = -1;
          slides.forEach((slide, i) => {
            /* -1 .. 1, how far this slide is from centre */
            const local = gsap.utils.clamp(-1, 1, pos - i);
            const centred = 1 - Math.abs(local);
            if (centred > bestC) {
              bestC = centred;
              bestI = i;
            }
            /* parallax shear: layers pull apart while travelling and sit
               back together as the slide centres */
            slide.querySelectorAll("[data-sc-layer]").forEach((el) => {
              const rate = parseFloat(el.dataset.rate || "1");
              gsap.set(el, { x: (rate - 1) * local * 900 });
            });
            if (cards[i]) gsap.set(cards[i], { x: 0.06 * local * 900 });
            /* the image eases from 1.08 to 1.0 as its slide arrives */
            if (imgs[i]) gsap.set(imgs[i], { scale: 1 + 0.08 * (1 - centred) });
            if (washes[i]) gsap.set(washes[i], { opacity: 0.12 * centred });
          });

          const s = field();
          if (s) {
            liveHue = SERVICES[bestI].hue;
            liveAmt = TINT_CENTRE * Math.max(0, bestC);
            s.setTint(liveHue, liveAmt);
            startPump();
            s.setVelocity(gsap.utils.clamp(-1, 1, self.getVelocity() / 2600));
          }

          if (fillRef.current) gsap.set(fillRef.current, { scaleX: p });
          if (countRef.current) {
            const label = `${SERVICES[Math.round(pos)].n} / 0${N}`;
            if (countRef.current.textContent !== label) {
              countRef.current.textContent = label;
            }
          }
          sec.style.setProperty("--sc-hue", SERVICES[bestI].hue);
        },
        onLeave: () => {
          liveAmt = 0;
          field()?.setVelocity(0);
        },
        onLeaveBack: () => {
          liveAmt = 0;
          field()?.setVelocity(0);
        },
      });

      /* the funnel forms across the approach and settles on the way out */
      const inTl = ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "top top",
        scrub: true,
        onUpdate: (self) => story(1 - 0.85 * self.progress),
      });
      const outTl = ScrollTrigger.create({
        trigger: wrap,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => story(0.15 + 0.85 * self.progress),
      });

      return () => {
        st.kill();
        inTl.kill();
        outTl.kill();
        if (raf) cancelAnimationFrame(raf);
        liveAmt = 0;
        const s = field();
        if (s) {
          s.setTint(null, 0);
          s.setVelocity(0);
        }
        story(1);
      };
    });

    return () => mm.revert();
  }, [reduced]);

  const header = (
    <div className="er-wrap er-schead">
      <p className="er-label er-label--faint er-track">Sec. 03 — Index</p>
      <h2 id="er-index" className="er-display er-h3 er-schead__h" data-quiet>
        What we are asked <em>to value</em>.
      </h2>
    </div>
  );

  /* Mobile and reduced motion: the stacked fallback. One block per
     service, image card above the text, no pin and no horizontal travel. */
  if (reduced) {
    return (
      <section
        className="er-section er-scsec"
        aria-labelledby="er-index"
        data-showcase
      >
        {header}
        <ol className="er-scstack er-wrap">
          {SERVICES.map((s) => (
            <li key={s.n} style={{ "--sc-hue": s.hue }}>
              <Card service={s} />
              <div className="er-scstack__body">
                <Body service={s} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      className="er-section er-scsec"
      aria-labelledby="er-index"
      data-showcase
    >
      <div ref={wrapRef} className="er-scwrap">
        <div ref={pinRef} className="er-scpin">
          {header}

          <div ref={trackRef} className="er-sctrack">
            {SERVICES.map((s) => (
              <article
                className="er-scslide"
                key={s.n}
                style={{ "--sc-hue": s.hue }}
              >
                <div className="er-scslide__body">
                  <Body service={s} />
                </div>
                <div className="er-scslide__media">
                  <span
                    className="er-scwash"
                    data-sc-wash
                    aria-hidden="true"
                  />
                  <Card service={s} />
                </div>
              </article>
            ))}
          </div>

          <div className="er-scprog" aria-hidden="true">
            <span className="er-scprog__bar">
              <i ref={fillRef} />
            </span>
            <span ref={countRef} className="er-scprog__n er-label">
              01 / 06
            </span>
          </div>
        </div>
      </div>

      {/* the stacked list is the phone's only presentation */}
      <ol className="er-scstack er-wrap">
        {SERVICES.map((s) => (
          <li key={s.n} style={{ "--sc-hue": s.hue }}>
            <Card service={s} />
            <div className="er-scstack__body">
              <Body service={s} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
