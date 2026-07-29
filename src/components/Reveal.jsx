"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";

const EASE_OUT = [0.16, 1, 0.3, 1];
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * useSyncExternalStore is the correct, SSR-safe way to read a browser
 * media query: server snapshot is always `false`, so the first client
 * render matches the server render exactly (no hydration mismatch), and
 * React swaps in the real client value right after hydration via its own
 * scheduled update — reliably, unlike a useState+matchMedia lazy
 * initializer, which produces a genuine server/client render mismatch
 * that Framer Motion's imperative style-setting doesn't recover from.
 */
export default function Reveal({
  children,
  index = 0,
  y = 16,
  className,
  amount = 0.3,
  as = "div",
}) {
  const reduced = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      animate={reduced ? { opacity: 1, y: 0 } : undefined}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.4, ease: EASE_OUT, delay: index * 0.07 }
      }
    >
      {children}
    </Tag>
  );
}
