"use client";

import { cn } from "@/lib/utils";

/**
 * Renders children twice and translates the track to -50% on an infinite
 * linear loop. Pure CSS keyframes, no JS ticker. Pauses on hover.
 * Respects prefers-reduced-motion via the global rule in globals.css
 * (animation-duration is forced to ~0, so the loop stops on its own).
 */
export default function Marquee({
  children,
  className,
  duration = 30,
  reverse = false,
}) {
  return (
    <div className={cn("marquee-viewport overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max items-center"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .marquee-viewport:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
