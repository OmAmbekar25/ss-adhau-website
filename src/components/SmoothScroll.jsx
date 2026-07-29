"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    /* Lower lerp = a longer, heavier glide. This is the single most
       noticeable piece of motion on the site, so it is tuned deliberately:
       0.075 reads as weight, not as lag. */
    const lenis = new Lenis({ autoRaf: false, lerp: 0.075 });
    lenis.on("scroll", ScrollTrigger.update);

    const syncWithGsap = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(syncWithGsap);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(syncWithGsap);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
