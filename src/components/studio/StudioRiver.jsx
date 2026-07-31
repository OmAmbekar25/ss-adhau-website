"use client";

import { useSyncExternalStore } from "react";

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

/* one full loop per column, in seconds — deliberately not equal, so the
   three never line up and read as a single moving block */
const SPEEDS = [28, 34, 31];

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

  const cols = columns(REVIEWS, 3);

  return (
    <div className="er-river" data-river>
      {cols.map((col, i) => (
        <div className="er-rvcol" key={i} data-rvcol>
          {/* one element, one transform. The list is rendered twice so the
              wrap is seamless; the second pass is decoration only. */}
          <div
            className="er-rvtrack"
            style={{ "--rv-dur": `${SPEEDS[i % SPEEDS.length]}s` }}
          >
            <ul className="er-rvlist">
              {col.map((r) => (
                <li key={r.name}>
                  <Card review={r} />
                </li>
              ))}
            </ul>
            <ul className="er-rvlist" aria-hidden="true">
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
