"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import { REVIEWS, GOOGLE_REVIEWS_URL, DRIFT_MIN } from "@/data/reviews";

/* WI-7 / P-5 — the clients river.
 *
 * The reviews drift on their own rather than on scroll: they are content to
 * graze, not a beat in the page's argument. Three rules keep that from
 * becoming a marquee — it moves slower than anyone reads, it slows the
 * moment you reach for it, and under reduced motion it does not move.
 *
 * P-5 rebuilt the layout only; the mechanics above are unchanged. It is
 * three columns inside the page's own container instead of two lanes
 * spanning the viewport, so a card can never touch the container edge —
 * the mask is the column box, not the window. Each column is one transform
 * on one element; nothing animates per card, and the duplicate set that
 * makes the loop seamless is hidden from assistive tech so every quote is
 * announced exactly once.
 */

/* The list itself lives in src/data/reviews.js — H-2's unlock is a copy
   drop, and a file the client is expected to edit should not be buried in
   a component's mechanics. The counts below are the only thing this file
   knows about it. */

/* One loop per column, in seconds. Close enough to read as one river,
   different enough that the three never line up again. */
const LOOP = [26, 32, 29];
/* Static head-starts, so the cards never settle into rows across columns. */
const OFFSET = [0, 96, 48];
const HOVER_FACTOR = 0.26; // slows, never stops

const QUERY = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(QUERY).matches;

/* The layout is the narrower of two limits: what the viewport can hold,
   and what the copy can fill.

   Width — three above 1280, two above 768, one below. Decided in JS, not
   by hiding a column in CSS: a hidden third column would take a third of
   the reviews out of the page with it.

   Volume — three columns need nine reviews or the loops run mostly empty;
   five to eight fill two. At four or fewer there is nothing to drift, so
   the section stops pretending and renders as a still single column. That
   is the state the repo is in today. */
const WIDE = ["(min-width: 1280px)", "(min-width: 768px)"];
const subCols = (cb) => {
  const ms = WIDE.map((q) => window.matchMedia(q));
  ms.forEach((m) => m.addEventListener("change", cb));
  return () => ms.forEach((m) => m.removeEventListener("change", cb));
};
const byVolume = (n) => (n >= 9 ? 3 : n >= DRIFT_MIN ? 2 : 1);
const byWidth = () =>
  window.matchMedia(WIDE[0]).matches ? 3 : window.matchMedia(WIDE[1]).matches ? 2 : 1;
const getCols = () => Math.min(byWidth(), byVolume(REVIEWS.length));
/* below this the river does not drift at all */
const DRIFTS = REVIEWS.length >= DRIFT_MIN;

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
  return out;
}

/* The still spread: two columns dealt round-robin, the second dropped by
   48px so the tops do not rule a line across the page. Below 700 it is one
   column and the offset is not applied — a stagger needs something to
   stagger against. */
function Spread({ list }) {
  const cols = columns(list, Math.min(2, list.length));
  return (
    <div className="er-rvspread">
      {cols.map((col, i) => (
        <ul className="er-rvspread__col" key={i} data-col={i}>
          {col.map((r) => (
            <li key={r.name}>
              <Card review={r} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function StudioRiver() {
  const reduced = useSyncExternalStore(subRM, getRM, () => false);

  if (reduced || !DRIFTS) {
    /* No drift at all — either the visitor asked for none, or there is not
       enough copy for a loop to mean anything. The first eight are laid
       out and read, with the rest behind a plain disclosure.

       H-1 — TWO COLUMNS ACROSS THE CONTAINER, not one 620px column.
       Held to a reading measure, the quotes occupied the left half and the
       particle field showed through the right, which read as a section
       that had lost its other half. The field belongs BEHIND the words —
       it is full-bleed and fixed, and always was; what made it look
       "beside" them was the words refusing to cross the middle.

       The columns are real boxes, not grid cells: cells share a row, and
       a shared row lines the quotes up in a table. Dealt round-robin and
       offset at the top, they read as a spread. */
    const first = REVIEWS.slice(0, 8);
    const rest = REVIEWS.slice(8);
    return (
      <div className="er-rvstatic">
        <Spread list={first} />
        {rest.length > 0 && (
          <details className="er-rvmore">
            <summary className="er-label">
              {rest.length} more {rest.length === 1 ? "review" : "reviews"}
            </summary>
            <Spread list={rest} />
          </details>
        )}
        {/* H-3 — the quiet line, only while the list is short. Once the
            real reviews land the section speaks for itself and this comes
            out on its own. */}
        {!DRIFTS && (
          <a
            className="er-label er-rvgoogle"
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            More on Google <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    );
  }

  return <Columns />;
}

function Columns() {
  const n = useSyncExternalStore(subCols, getCols, () => 3);
  const refs = useRef([]);

  useEffect(() => {
    refs.current.length = n;
    const tracks = refs.current.filter(Boolean);
    if (!tracks.length) return;

    /* The loop distance is the height of one set — but never shorter than
       the mask, or the duplicate would be on screen at the same time as
       the original and the column would read as the same quote twice. */
    const measure = (s) => {
      const set = s.track.firstElementChild;
      const maskH = s.track.parentElement.clientHeight;
      s.span = Math.max(set.scrollHeight, maskH + 48);
      s.track.style.setProperty("--set", `${s.span}px`);
      s.rate = s.span / LOOP[refs.current.indexOf(s.track)];
    };

    const state = tracks.map((track) => ({
      track, y: 0, span: 1, rate: 0, factor: 1, live: 1,
    }));
    state.forEach(measure);

    const remeasure = () => state.forEach(measure);
    window.addEventListener("resize", remeasure);

    let raf = 0;
    let last = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.forEach((s) => {
        s.live += (s.factor - s.live) * Math.min(1, dt * 4);
        s.y -= s.rate * s.live * dt;
        if (s.y <= -s.span) s.y += s.span;
        s.track.style.transform = `translate3d(0, ${s.y.toFixed(2)}px, 0)`;
      });
    };
    raf = requestAnimationFrame(frame);

    const binds = [];
    state.forEach((s) => {
      const col = s.track.parentElement;
      const slow = () => {
        s.factor = HOVER_FACTOR;
      };
      const resume = () => {
        s.factor = 1;
      };
      col.addEventListener("pointerenter", slow);
      col.addEventListener("pointerleave", resume);
      col.addEventListener("focusin", slow);
      col.addEventListener("focusout", resume);
      binds.push([col, slow, resume]);
    });

    return () => {
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
      binds.forEach(([col, slow, resume]) => {
        col.removeEventListener("pointerenter", slow);
        col.removeEventListener("pointerleave", resume);
        col.removeEventListener("focusin", slow);
        col.removeEventListener("focusout", resume);
      });
    };
  }, [n]);

  const cols = columns(REVIEWS, n);

  return (
    <div className="er-river" data-river style={{ "--cols": n }}>
      {cols.map((col, i) => (
        <div className="er-rvcol" key={i} data-rvcol>
          <div
            className="er-rvtrack"
            style={{ top: `${OFFSET[i]}px` }}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            <ul className="er-rvset">
              {col.map((r) => (
                <li key={r.name}>
                  <Card review={r} />
                </li>
              ))}
            </ul>
            <ul className="er-rvset er-rvset--dup" aria-hidden="true">
              {col.map((r) => (
                <li key={`dup-${r.name}`}>
                  <Card review={r} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
