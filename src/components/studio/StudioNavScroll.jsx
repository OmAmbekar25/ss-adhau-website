"use client";

import { useEffect } from "react";

/* Hide on the way down, show on the way up.
 *
 * On the studio page this lived inside StudioClient, alongside the
 * particle field — which is fine there and impossible here: a service page
 * needs the nav behaviour and must not pull three.js in to get it. Same
 * two data attributes, same thresholds, one scroll listener, no GSAP.
 */

export default function StudioNavScroll() {
  useEffect(() => {
    const nav = document.querySelector(".er-nav");
    if (!nav) return;

    let last = window.scrollY;
    let queued = false;
    const read = () => {
      queued = false;
      const y = window.scrollY;
      nav.dataset.scrolled = String(y > 40);
      nav.dataset.hidden = String(y > last && y > 300);
      last = y;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
