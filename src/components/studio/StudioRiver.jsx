"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/* WI-7 — the clients river.
 *
 * The reviews drift upward on their own rather than on scroll: they are
 * content to graze, not a beat in the page's argument. Three rules keep
 * that from becoming a marquee — it moves slower than anyone reads, it
 * stops the moment you look at it, and under reduced motion it does not
 * move at all.
 *
 * Each column is one transform on one element. Nothing animates per card,
 * and the duplicate set that makes the loop seamless is hidden from
 * assistive tech so every quote is announced exactly once.
 */

/* TODO(content): only four reviews exist in the repo. The river is built
   to take the firm's full list — drop more entries in and the columns
   redistribute automatically. */
const REVIEWS = [
  { name: "Subhash Kamti", text: "Best valuer of Chhindwara." },
  {
    name: "Prateek Agrawal",
    text: "Good knowledge. Satisfactory work. Thank you for your service sir.",
  },
  {
    name: "Priyanka Singh",
    text: "The office staff is knowledgeable and responsive.",
  },
  { name: "Anukul Singh", text: "Best." },
];

/* Two lanes, drifting in opposite directions at slightly different speeds
   so the pair never reads as one moving block. Horizontal, matching the
   homepage's marquee — the earlier vertical column drift was correct to
   the written spec but the client wants these moving the way the homepage
   does, and at a speed you can actually see. */
const LANES = [
  { speed: 46, dir: -1 },
  { speed: 38, dir: 1 },
];
const HOVER_SPEED = 12; // slows, never stops

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

function Card({ review }) {
  return (
    <figure className="er-rvcard">
      <span className="er-rvcard__rule" />
      <blockquote className="er-rvcard__q">“{review.text}”</blockquote>
      <figcaption className="er-label er-label--faint er-rvcard__a">
        {review.name}
      </figcaption>
    </figure>
  );
}

/* deal the reviews round-robin so columns stay even as the list grows */
function columns(list, n) {
  const out = Array.from({ length: n }, () => []);
  list.forEach((r, i) => out[i % n].push(r));
  return out.filter((c) => c.length);
}

export default function StudioRiver() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);

  if (reduced) {
    /* no drift at all: the first eight, laid out and read, with the rest
       behind a plain disclosure */
    const first = REVIEWS.slice(0, 8);
    const rest = REVIEWS.slice(8);
    return (
      <div className="er-rvstatic">
        <ul className="er-rvgrid">
          {first.map((r) => (
            <li key={r.name}>
              <Card review={r} />
            </li>
          ))}
        </ul>
        {rest.length > 0 && (
          <details className="er-rvmore">
            <summary className="er-label">
              {rest.length} more {rest.length === 1 ? "review" : "reviews"}
            </summary>
            <ul className="er-rvgrid">
              {rest.map((r) => (
                <li key={r.name}>
                  <Card review={r} />
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    );
  }

  return <Lanes />;
}

function Lanes() {
  const refs = useRef([]);

  useEffect(() => {
    const tracks = refs.current.filter(Boolean);
    if (!tracks.length) return;

    const state = tracks.map((track, i) => ({
      track,
      x: LANES[i].dir < 0 ? 0 : -track.scrollWidth / 2,
      speed: LANES[i].speed,
      target: LANES[i].speed,
      dir: LANES[i].dir,
      half: track.scrollWidth / 2,
    }));

    const remeasure = () => {
      state.forEach((s) => {
        s.half = s.track.scrollWidth / 2;
      });
    };
    window.addEventListener("resize", remeasure);

    let raf = 0;
    let last = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.forEach((s) => {
        s.speed += (s.target - s.speed) * Math.min(1, dt * 4);
        s.x += s.dir * s.speed * dt;
        /* wrap in both directions — the set is rendered twice */
        if (s.half > 0) {
          if (s.x <= -s.half) s.x += s.half;
          if (s.x >= 0) s.x -= s.half;
        }
        s.track.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`;
      });
    };
    raf = requestAnimationFrame(frame);

    const binds = [];
    state.forEach((s) => {
      const lane = s.track.parentElement;
      const slow = () => {
        s.target = HOVER_SPEED;
      };
      const resume = () => {
        s.target = LANES[state.indexOf(s)].speed;
      };
      lane.addEventListener("pointerenter", slow);
      lane.addEventListener("pointerleave", resume);
      lane.addEventListener("focusin", slow);
      lane.addEventListener("focusout", resume);
      binds.push([lane, slow, resume]);
    });

    return () => {
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
      binds.forEach(([lane, slow, resume]) => {
        lane.removeEventListener("pointerenter", slow);
        lane.removeEventListener("pointerleave", resume);
        lane.removeEventListener("focusin", slow);
        lane.removeEventListener("focusout", resume);
      });
    };
  }, []);

  const rows = columns(REVIEWS, 2);

  return (
    <div className="er-river" data-river>
      {rows.map((row, i) => (
        <div className="er-rvlane" key={i} data-rvlane>
          <ul
            className="er-rvtrack"
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            {row.map((r) => (
              <li key={r.name}>
                <Card review={r} />
              </li>
            ))}
            {row.map((r) => (
              <li key={`dup-${r.name}`} aria-hidden="true">
                <Card review={r} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
