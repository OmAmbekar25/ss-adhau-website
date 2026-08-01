"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./SmoothScroll";

/* Hash navigation, done through Lenis.
 *
 * The register's proof line links to `/#er-record`, which is a cross-page
 * navigation to a hash — and two things break it if it is left alone.
 *
 * The first is Lenis: it runs its own scroll position, so a native jump
 * sets `scrollTop` underneath it and Lenis glides the page straight back
 * to where it thought it was. Anything that moves the page has to move it.
 *
 * The second is the pins. The record section sits below three pinned
 * sections, and a pinned section's spacer is added by ScrollTrigger AFTER
 * layout — so the element's offset before ScrollTrigger has initialised is
 * not the offset it will have a moment later. Measuring first and jumping
 * to a stale number lands the reader in the wrong chapter. `refresh()`
 * settles the pins, then the target is measured, then Lenis takes it.
 *
 * Reduced motion never mounts Lenis, so the native jump is correct there
 * and this bows out.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const go = (hash, immediate) => {
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      const lenis = getLenis();
      if (!lenis) {
        el.scrollIntoView({ block: "start" });
        return;
      }
      /* the pins own the page's real height; settle them before measuring */
      ScrollTrigger.refresh();
      if (cancelled) return;
      lenis.scrollTo(el, { offset: 0, immediate, duration: immediate ? 0 : 1.1 });
    };

    /* On arrival: two frames for the layout, then once more after the
       lazy sections have had a chance to mount and change the height. */
    if (window.location.hash) {
      const hash = window.location.hash;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          go(hash, false);
          setTimeout(() => go(hash, true), 700);
        })
      );
    }

    const onHashChange = () => go(window.location.hash, false);
    /* Same-page anchors: the click is intercepted before the browser's own
       jump, so Lenis is the only thing that ever moves the page. */
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      go(url.hash, false);
    };

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
