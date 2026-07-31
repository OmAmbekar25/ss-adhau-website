"use client";

import { useEffect } from "react";

/* P-1 — the nav links live behind a hamburger.
 *
 * Hover is the nicety; the button is the contract. A pointer that can hover
 * gets the links on approach, but the same links open on click, on keyboard
 * focus, and close on Escape — so touch and keyboard are never left without
 * a way in.
 *
 * `aria-expanded` reports whether the links are actually reachable, which
 * is the only thing the attribute can honestly mean here. An earlier pass
 * tied it to the click state alone and it read "false" while the menu was
 * open on hover — and worse, a mouse click fired `focusin` first, so the
 * two handlers toggled against each other and the attribute never moved at
 * all. Focus only opens when it is keyboard focus (`:focus-visible`), so
 * clicking the button is a plain toggle.
 */

export default function StudioNav() {
  useEffect(() => {
    const wrap = document.querySelector("[data-navwrap]");
    const burger = document.querySelector("[data-burger]");
    const links = document.querySelector("[data-navlinks]");
    if (!wrap || !burger || !links) return;

    let pinned = false; // opened by click — survives pointer leave
    let hovering = false;
    let focused = false; // keyboard focus is inside the menu
    let closeId = 0;

    const paint = () => {
      const open = pinned || hovering || focused;
      wrap.dataset.open = open ? "true" : "false";
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    };

    const openHover = () => {
      window.clearTimeout(closeId);
      hovering = true;
      paint();
    };
    /* a short grace so crossing the gap between icon and links does not
       flicker the menu shut */
    const closeHover = () => {
      window.clearTimeout(closeId);
      closeId = window.setTimeout(() => {
        hovering = false;
        paint();
      }, 200);
    };

    const toggle = () => {
      pinned = !pinned;
      paint();
    };
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (!(pinned || hovering || focused)) return;
      pinned = false;
      hovering = false;
      focused = false;
      window.clearTimeout(closeId);
      paint();
      burger.focus();
    };
    /* Only keyboard focus opens it. A mouse click also focuses the button,
       and letting that open the menu would fight the click toggle. */
    const onFocusIn = (e) => {
      const kbd =
        e.target !== burger || (burger.matches && burger.matches(":focus-visible"));
      if (!kbd) return;
      focused = true;
      paint();
    };
    const onFocusOut = (e) => {
      if (wrap.contains(e.relatedTarget)) return;
      focused = false;
      paint();
    };

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      wrap.addEventListener("pointerenter", openHover);
      wrap.addEventListener("pointerleave", closeHover);
    }
    burger.addEventListener("click", toggle);
    wrap.addEventListener("focusin", onFocusIn);
    wrap.addEventListener("focusout", onFocusOut);
    document.addEventListener("keydown", onKey);
    paint();

    return () => {
      wrap.removeEventListener("pointerenter", openHover);
      wrap.removeEventListener("pointerleave", closeHover);
      burger.removeEventListener("click", toggle);
      wrap.removeEventListener("focusin", onFocusIn);
      wrap.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(closeId);
    };
  }, []);

  return null;
}
