"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pins `visual` in place while `children` (the adjacent copy) scrolls past.
 * The container's height (driven by the copy column) sets how long the pin
 * lasts. No-ops under prefers-reduced-motion — both columns just sit in
 * normal flow.
 */
export default function Sticky({ visual, children, className }) {
  const containerRef = useRef(null);
  const visualRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        endTrigger: copyRef.current,
        end: "bottom bottom",
        pin: visualRef.current,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid grid-cols-1 gap-12 md:grid-cols-2",
        className
      )}
    >
      <div ref={visualRef} className="h-fit md:self-start">
        {visual}
      </div>
      <div ref={copyRef}>{children}</div>
    </div>
  );
}
