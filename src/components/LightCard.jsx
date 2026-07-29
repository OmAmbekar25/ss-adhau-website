"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A panel that catches the light where the cursor is — the same idea as
 * the hero (the visitor moves the light, never the object), reduced to a
 * hairline: a brass edge glow and a faint warm wash, both driven by CSS
 * custom properties so nothing re-renders on pointer move.
 *
 * Reduced motion is handled in CSS: the light simply doesn't appear.
 */
export default function LightCard({ children, className }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty("--lit", "1");
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--lit", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("lc", className)}
    >
      <span aria-hidden="true" className="lc-edge" />
      <span aria-hidden="true" className="lc-wash" />
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        .lc {
          --lx: 50%;
          --ly: 0%;
          --lit: 0;
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .lc-edge,
        .lc-wash {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: var(--lit);
          transition: opacity 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        /* the border catches it first — brass lives in edges */
        .lc-edge {
          padding: 1px;
          border-radius: inherit;
          background: radial-gradient(
            260px circle at var(--lx) var(--ly),
            rgba(201, 160, 99, 0.9),
            transparent 62%
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
        }
        .lc-wash {
          background: radial-gradient(
            340px circle at var(--lx) var(--ly),
            rgba(201, 160, 99, 0.07),
            transparent 60%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .lc-edge,
          .lc-wash {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
