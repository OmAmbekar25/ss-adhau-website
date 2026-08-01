"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CITIES,
  VIEW_BOX,
  MAP_W,
  MAP_H,
  GRATICULE,
  PATH_MP,
  PATH_MH,
  PATH_BORDER,
  arc,
  byId,
  mapsUrl,
} from "@/data/territory";

/* THE TERRITORY — one map, one card, three ways to move.
 *
 * The whole section is a single piece of state: which city is active. A
 * dot, an arrow button and an arrow key all set the same index, and the
 * map and the card both read it. There is no second source of truth and
 * nothing to keep in sync.
 *
 * NOT scroll-driven, deliberately. A scroll-advance variant was on the
 * table and is rejected: it takes the page's own scrolling away from the
 * reader to drive a deck of nine cards, and the reader wanted to reach the
 * footer. Wheel events are never intercepted here — see §15.
 *
 * All nine cards are in the DOM at all times. The inactive ones carry
 * `hidden="until-found"` plus `inert`: crawlers and in-page find still read
 * them, assistive tech does not walk into a card nobody asked for, and no
 * card has to be re-rendered to appear.
 */

const OFFICES = CITIES.filter((c) => c.kind === "office");

/* Reduced motion as a subscription rather than an effect that sets state:
   the same store this codebase already uses in StudioTrusted. An effect
   writing state on mount is a second render before first paint, which the
   linter is right to object to. */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(RM_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(RM_QUERY).matches;

export default function Territory({ initial = 0 }) {
  const [i, setI] = useState(initial);
  const [drawn, setDrawn] = useState(false); // the entrance has run
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const rootRef = useRef(null);
  const active = CITIES[i];

  /* --- deep link: /locations#seoni opens on that card ---------------- */
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      const n = CITIES.findIndex((c) => c.id === id);
      if (n >= 0) setI(n);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  /* --- the entrance, once, when the section is 70% up the viewport --- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    /* Reduced motion never observes and never sets state: `data-drawn` is
       reported as true below, and the stylesheet has everything present
       from the first paint. Setting it here would be a render nobody
       needs. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((n) => setI((n + CITIES.length) % CITIES.length), []);

  /* Arrow keys while the section holds focus. Bound to the section rather
     than the window: the page has other arrow-key users and none of them
     should move this deck. */
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    }
  };

  /* --- touch: drag the card to advance (mobile), arrows retained ----- */
  const touch = useRef(null);
  const onTouchStart = (e) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const t = touch.current;
    if (!t) return;
    touch.current = null;
    const dx = e.changedTouches[0].clientX - t.x;
    const dy = e.changedTouches[0].clientY - t.y;
    /* a vertical drag is the page scrolling, and must stay the page
       scrolling — only a clearly horizontal one moves the deck */
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(i + (dx < 0 ? 1 : -1));
  };

  const anchor = active.anchor ? byId(active.anchor) : null;

  return (
    <section
      className="er-terr"
      ref={rootRef}
      data-drawn={drawn || reduced}
      data-reduced={reduced}
      onKeyDown={onKeyDown}
      aria-labelledby="er-terr-h"
    >
      <h2 id="er-terr-h" className="er-sr-only">
        The territory: two offices and nine cities
      </h2>

      {/* ------------------------------ the map ---------------------- */}
      <div className="er-terr__map">
        <svg
          viewBox={VIEW_BOX}
          className="er-terr__svg"
          role="img"
          aria-label="Map of Madhya Pradesh and Maharashtra showing two offices and nine cities"
        >
          {GRATICULE.map((y) => (
            <line
              key={y}
              className="er-terr__grat"
              x1="0"
              y1={y}
              x2={MAP_W}
              y2={y}
            />
          ))}

          {/* the two states draw in parallel; pathLength normalises them so
              Maharashtra does not finish while Madhya Pradesh is halfway */}
          <path className="er-terr__state" d={PATH_MP} pathLength="1" />
          <path className="er-terr__state" d={PATH_MH} pathLength="1" />
          <path className="er-terr__border" d={PATH_BORDER} pathLength="1" />

          {/* the connection line, keyed on the active city so React mounts a
              NEW path per activation — that is what re-runs the draw */}
          {anchor ? (
            <path
              key={active.id}
              className="er-terr__line"
              d={arc(anchor, active)}
              pathLength="1"
            />
          ) : null}

          {CITIES.map((c, n) => (
            <g
              key={c.id}
              className="er-terr__city"
              data-kind={c.kind}
              data-active={n === i}
              style={{ "--n": n }}
            >
              {c.kind === "office" ? (
                <circle className="er-terr__ring" cx={c.x} cy={c.y} r="14" />
              ) : null}
              {/* one ring per activation, same keying trick as the line */}
              {n === i ? (
                <circle
                  key={`p-${c.id}-${i}`}
                  className="er-terr__ping"
                  cx={c.x}
                  cy={c.y}
                  r="5"
                />
              ) : null}
              <circle className="er-terr__dot" cx={c.x} cy={c.y} r="5" />
              <text
                className="er-terr__label"
                x={c.side === "left" ? c.x - 16 : c.x + 16}
                y={c.y + 5 + (c.dy || 0)}
                textAnchor={c.side === "left" ? "end" : "start"}
              >
                {c.name}
              </text>
              {/* the hit target is 24px and the dot stays 5px */}
              <circle
                className="er-terr__hit"
                cx={c.x}
                cy={c.y}
                r="24"
                role="button"
                tabIndex={0}
                aria-label={`Show ${c.name}`}
                aria-current={n === i ? "true" : undefined}
                onClick={() => setI(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setI(n);
                  }
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ----------------------------- the deck ---------------------- */}
      <div className="er-terr__deck">
        <div
          className="er-terr__cards"
          aria-live="polite"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {CITIES.map((c, n) => (
            <Card key={c.id} c={c} active={n === i} />
          ))}
        </div>

        <div className="er-terr__nav">
          <div className="er-terr__arrows">
            <button
              type="button"
              className="er-terr__arrow"
              onClick={() => go(i - 1)}
              aria-label="Previous city"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="er-terr__arrow"
              onClick={() => go(i + 1)}
              aria-label="Next city"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="er-label er-terr__count">
            {String(i + 1).padStart(2, "0")} / {String(CITIES.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}

function Card({ c, active }) {
  /* `hidden="until-found"` needs the attribute spelled out — React would
     turn hidden={true} into a bare `hidden`, which find-in-page cannot
     reveal and a crawler is likelier to skip. */
  const hiddenProps = active
    ? {}
    : { hidden: "until-found", inert: "" };
  return (
    <article className="er-terr__card" data-active={active} {...hiddenProps}>
      <p className="er-label er-terr__eyebrow">
        {c.kind === "office" ? "Office" : "Service area"}
      </p>
      <h3 className="er-terr__city-name">{c.name}</h3>
      <p className="er-terr__state-name">{c.state}</p>
      <p className="er-terr__fact">{c.fact}</p>
      <p className="er-terr__body">{c.body}</p>

      {c.address ? (
        <>
          <p className="er-terr__addr">{c.address}</p>
          <p className="er-terr__hours">Mon – Sat · 10:00 – 19:00</p>
        </>
      ) : null}

      <p className="er-terr__contact">
        <a href="tel:+918793000929">+91 8793 000 929</a>
        <span aria-hidden="true"> · </span>
        <a href="mailto:ssadhauvaluers@gmail.com">ssadhauvaluers@gmail.com</a>
      </p>

      <a
        className="er-label er-terr__maps"
        href={mapsUrl(c)}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Google Maps
        <span aria-hidden="true"> →</span>
      </a>
    </article>
  );
}

export { OFFICES };
