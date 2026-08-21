"use client";

import { useEffect, useRef } from "react";

/* THE PRINCIPLE PANEL'S FILM, AND THE LINE THAT RIDES IT.
 *
 * Client-supplied blossom — the nature subject the panel was asking for
 * and the repository could not supply. The quote is ONE HORIZONTAL LINE
 * laid across the picture, and it writes itself on as the film plays.
 *
 * The film and the line are one component because they are one beat: the
 * line's timing is the video's clock, not a timer running beside it. The
 * words are the page's, passed in — copy belongs on the page.
 *
 * Four rules shape this more than the animation does.
 *
 * 1. THE TEXT MUST NEVER BE TRAPPED BEHIND THE FILM. A reveal keyed only
 *    to playback fails silently in every case where the video does not
 *    play: autoplay refused, codec unsupported, the file still coming
 *    down a slow line, reduced motion, no JS at all. So playback is one
 *    of five ways the line arrives, and a hard ceiling guarantees it
 *    regardless. This is the blank-screen failure the hero survey singles
 *    out, and it is the one thing here that must not fail.
 *
 * 2. IT MUST NOT COST LCP. `preload="none"`, and the source is not even
 *    attached until the panel is close — the loader work took the home
 *    page to 1964ms and a megabyte on the second screen must not undo it.
 *
 * 3. THE CLOCK IS THE VIDEO'S. Progress is read off `currentTime` in a
 *    rAF, with wraps accumulated, so the line advances only while the
 *    film advances. If the film stalls the line stalls with it, and the
 *    ceiling — not a parallel timer — is what rescues it. The reveal is
 *    sized to exactly one pass of the loop: the last word lands as the
 *    film returns to its first frame.
 *
 * 4. THE FILM DOES NOT RECEDE. It loops at full strength underneath and
 *    the type is legible on it by CHOICE OF INK rather than by dimming
 *    the picture — see the colour note in studio.css, which is measured
 *    against the footage rather than picked by eye.
 */

/* WebM where it is taken (smaller), H.264 everywhere else. One dynamic
   `src` rather than `<source>` children, so the "attach nothing until the
   panel is near" path stays a single assignment. */
const SRC_WEBM = "/video/blossom-loop.webm";
const SRC_MP4 = "/video/blossom-loop.mp4";

/* The loop is 4.0s and the line is sized to it. Read off the element
   once it has metadata rather than hard-coded, so re-cutting the film
   re-times the line for free; this is only the fallback. */
const FALLBACK_S = 4;

/* A backstop for a film that never plays, not a second timeline
   competing with the real one — hence generous. */
const CEILING_MS = 9000;

export default function StudioBlossom({ words = [] }) {
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    const line = lineRef.current;
    if (!host || !line) return;

    const marks = Array.from(line.querySelectorAll("[data-mword]"));
    /* Words already in are not re-touched: `showTo` only walks the ones
       that changed, so a rAF costs nothing once the line has settled. */
    let shown = 0;
    const showTo = (n) => {
      const next = Math.max(0, Math.min(marks.length, n));
      for (let i = shown; i < next; i += 1) marks[i].setAttribute("data-in", "true");
      for (let i = next; i < shown; i += 1) marks[i].removeAttribute("data-in");
      shown = next;
    };
    const showAll = () => showTo(marks.length);

    /* No motion, no film: the line is simply there, and the video is
       never asked to load at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      host.setAttribute("data-static", "true");
      showAll();
      return;
    }
    if (!video) {
      showAll();
      return;
    }

    let ceiling = 0;
    let raf = 0;
    let base = 0;
    let prev = 0;
    let done = false;

    const finish = () => {
      done = true;
      showAll();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const span = video.duration > 0.1 ? video.duration : FALLBACK_S;
      const t = video.currentTime;
      /* `loop` restarts the clock, so a decrease is a wrap. Accumulated
         rather than read raw, so the line keeps advancing across the
         boundary instead of snapping back with the film. */
      if (t < prev) base += span;
      prev = t;
      const p = (base + t) / span;
      showTo(Math.floor(p * marks.length));
      if (p >= 1) finish();
    };

    const arm = () => {
      if (ceiling) return;
      ceiling = window.setTimeout(finish, CEILING_MS);
    };

    /* Anything that means the film will not run writes the line at once:
       an unsupported codec, a stalled download, a decode failure. */
    const bail = () => {
      if (!done) finish();
    };
    const onPlaying = () => {
      if (!done && !raf) raf = requestAnimationFrame(tick);
    };
    video.addEventListener("error", bail);
    video.addEventListener("stalled", bail);
    video.addEventListener("playing", onPlaying);

    const start = () => {
      if (video.src) return;
      const webm =
        typeof video.canPlayType === "function" &&
        video.canPlayType('video/webm; codecs="vp9"') !== "";
      video.src = webm ? SRC_WEBM : SRC_MP4;
      arm();
      const played = video.play();
      /* Autoplay can be refused even muted. If it is, the film is not
         going to run, so the line should not wait for it. */
      if (played && typeof played.catch === "function") played.catch(bail);
    };

    /* Load and play when the panel is genuinely near, not on page load. */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(host);

    return () => {
      io.disconnect();
      if (ceiling) window.clearTimeout(ceiling);
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener("error", bail);
      video.removeEventListener("stalled", bail);
      video.removeEventListener("playing", onPlaying);
    };
  }, [words]);

  return (
    <div ref={hostRef} className="er-blossom" data-blossom>
      {/* No `src` here on purpose — it is attached on approach, so the
          file is never in front of the first paint. */}
      <video
        ref={videoRef}
        className="er-blossom__v"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <blockquote ref={lineRef} className="er-manifesto__quote" data-manifesto>
        {/* One line, one element. The whole sentence is in the DOM from
            the first paint and the words are only made visible in turn —
            a screen reader and a no-JS reader both get the finished
            sentence, not a stutter. */}
        <h2 id="er-principle" className="er-display er-mline">
          {words.map((w, i) => {
            const em = Array.isArray(w);
            const text = em ? w[1] : w;
            return (
              <span className="er-mword" data-mword key={`${text}-${i}`}>
                {em ? <em>{text}</em> : text}
                {i < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </h2>
      </blockquote>
    </div>
  );
}
