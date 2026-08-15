"use client";

import { useEffect, useRef, useState } from "react";

/* §3.2 — THE WORDMARK SLIDESHOW.
 *
 * The navbar's one piece of motion: a fixed slot beside the mark that
 * rolls through the firm's two name lines. Vertical roll, 500ms on the
 * entrance curve, 3200ms dwell, looping while mounted.
 *
 * Two rules shape the implementation more than the animation does:
 *
 *   1. The slot never reflows. Its width and height are fixed in CSS
 *      (`--er-slot`, measured against the longer line), the lines are
 *      absolutely positioned inside it, and every line is `nowrap`. A
 *      font swap cannot move it and neither can a line change — the
 *      navbar's contribution to the page's 0.05 CLS budget is zero.
 *
 *   2. A screen reader never hears a rotating fragment. The cycling
 *      lines are `aria-hidden`; the firm's name is in the DOM once, as a
 *      single visually-hidden string, which is also what gives the link
 *      its accessible name.
 *
 * Under `prefers-reduced-motion` nothing here runs at all and the CSS
 * stacks both lines into an ordinary two-line wordmark. That is a better
 * design than the cycle, not a fallback, so it is built to look like one.
 */

const LINES = ["S S ADHAU", "VALUERS & ENGINEERS"];
const DWELL = 3200;
/* When the cycle is paused by a pointer or by focus, the timer does not
   die — it re-checks on a short beat, so the roll resumes promptly on
   leave rather than sitting out the remainder of a 3.2s dwell. */
const RETRY = 400;

export default function StudioLockup() {
  const [n, setN] = useState(0);
  const paused = useRef(false);
  const slotRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* "Hover or focus of the LOCKUP" means the mark and the slot
       together, which is the anchor wrapping both — not this span alone.
       Bound from here rather than by making the header a client
       component: the nav is shared by every document route and must not
       start shipping JS because the wordmark moves. */
    const host = slotRef.current?.closest("a") || slotRef.current;
    const hold = () => {
      paused.current = true;
    };
    const release = () => {
      paused.current = false;
    };
    if (host) {
      host.addEventListener("pointerenter", hold);
      host.addEventListener("pointerleave", release);
      host.addEventListener("focusin", hold);
      host.addEventListener("focusout", release);
    }

    let timer = 0;
    const schedule = (ms) => {
      timer = window.setTimeout(() => {
        if (paused.current) {
          schedule(RETRY);
          return;
        }
        setN((v) => v + 1);
        schedule(DWELL);
      }, ms);
    };
    schedule(DWELL);
    return () => {
      window.clearTimeout(timer);
      if (host) {
        host.removeEventListener("pointerenter", hold);
        host.removeEventListener("pointerleave", release);
        host.removeEventListener("focusin", hold);
        host.removeEventListener("focusout", release);
      }
    };
  }, []);

  const cur = n % LINES.length;
  /* -1 on the very first pass: there is no outgoing line yet, so nothing
     is asked to roll upward out of an empty slot. */
  const prev = n === 0 ? -1 : (n - 1) % LINES.length;

  return (
    <span ref={slotRef} className="er-lockup" aria-hidden="true">
      {LINES.map((line, i) => (
        <span
          key={line}
          className={`er-lockup__line er-lockup__line--${i + 1}`}
          data-state={i === cur ? "in" : i === prev ? "out" : ""}
        >
          {line}
        </span>
      ))}
    </span>
  );
}
