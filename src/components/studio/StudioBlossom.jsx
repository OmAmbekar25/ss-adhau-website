"use client";

import { useEffect, useRef } from "react";

/* THE PRINCIPLE PANEL'S FILM.
 *
 * Blossom falling, client-supplied — the nature subject the panel was
 * asking for and the repository could not supply. The quote sits OVER it
 * and arrives when the film has finished playing.
 *
 * Three rules shape this more than the animation does.
 *
 * 1. THE TEXT MUST NEVER BE TRAPPED BEHIND THE VIDEO. A reveal keyed
 *    only to `ended` fails silently in every case where the video does
 *    not play: autoplay refused, codec unsupported, the file still
 *    downloading on a slow connection, reduced motion, no JS at all. So
 *    `ended` is one of five ways the quote can arrive, and a hard ceiling
 *    guarantees it regardless. This is the blank-screen failure the hero
 *    survey singles out, and it is the one thing here that must not fail.
 *
 * 2. IT MUST NOT COST LCP. `preload="none"` and the source is not even
 *    attached until the panel is close — the loader work took the home
 *    page to 1964ms and a 2MB file on the second screen must not undo
 *    it. Playing starts when the panel is actually approached, so the
 *    film is not already over by the time a reader arrives.
 *
 * 3. THE FILM RECEDES SO THE TYPE CAN LAND. On `ended` it eases back to
 *    a low opacity and holds its last frame. That is not a scrim over a
 *    picture — WI-5 ruled scrims out of this project — it is the film
 *    itself stepping back, which is what makes the quote legible on
 *    white whatever the footage happens to be doing in its last frame.
 */

const SRC = "/video/blossom.mp4";
/* The file is 8.0s. The ceiling is generous rather than tight: it is a
   backstop for a video that never fires `ended`, not a second timeline
   competing with the real one. */
const CEILING_MS = 11000;

export default function StudioBlossom() {
  const hostRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    if (!host) return;

    const reveal = () => host.setAttribute("data-revealed", "true");
    const settle = () => {
      host.setAttribute("data-played", "true");
      reveal();
    };

    /* No motion, no film: the quote is simply there, and the video is
       never asked to load at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      host.setAttribute("data-static", "true");
      reveal();
      return;
    }
    if (!video) {
      reveal();
      return;
    }

    let ceiling = 0;
    const arm = () => {
      if (ceiling) return;
      ceiling = window.setTimeout(reveal, CEILING_MS);
    };

    video.addEventListener("ended", settle);
    /* Anything that means the film will not finish reveals immediately —
       an unsupported codec, a stalled download, a decode failure. */
    video.addEventListener("error", settle);
    video.addEventListener("stalled", reveal);

    const start = () => {
      if (video.src) return;
      video.src = SRC;
      arm();
      const played = video.play();
      /* Autoplay can be refused even muted. If it is, the film is not
         going to finish, so the quote should not wait for it. */
      if (played && typeof played.catch === "function") played.catch(settle);
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
      video.removeEventListener("ended", settle);
      video.removeEventListener("error", settle);
      video.removeEventListener("stalled", reveal);
    };
  }, []);

  return (
    <div ref={hostRef} className="er-blossom" data-blossom>
      {/* No `src` here on purpose — it is attached on approach, so the
          file is never in front of the first paint. */}
      <video
        ref={videoRef}
        className="er-blossom__v"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
