"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { TEAM } from "@/data/team";
import { getLenis } from "@/components/SmoothScroll";

/* THE ROSTER — five rows, one dossier open at a time, and the page's one
 * novel element: the floating portrait.
 *
 * The frame follows the cursor with a lerp of 0.12 and tilts up to 3 deg
 * with horizontal velocity — transform-only, driven by one rAF loop that
 * runs ONLY while the pointer is over the list. It is presentation, not
 * interface: pointer-events none, aria-hidden, and it never exists for
 * touch, keyboard or reduced motion — those readers get the same portrait
 * inside the opened dossier, which is also where it lives for everyone
 * until real photographs arrive.
 *
 * The rows are buttons (aria-expanded), the dossier is the register's
 * 0fr -> 1fr disclosure, and /about#sunil-adhau opens that row on load.
 */

const RM = "(prefers-reduced-motion: reduce)";
const subRM = (cb) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(RM).matches;

/* the portrait, in the exact frame the photograph will occupy — the swap
   is a data change, not a layout one */
function Portrait({ m, sizes }) {
  return m.img ? (
    <Image
      className="er-tr__photo"
      src={m.img}
      alt={`Portrait of ${m.name}`}
      width={520}
      height={694}
      sizes={sizes}
    />
  ) : (
    <span className="er-tr__mono" aria-hidden="true">
      {m.initials}
    </span>
  );
}

export default function TeamRoster() {
  const [open, setOpen] = useState(null);
  const [hover, setHover] = useState(null); // index for the floating frame
  const reduced = useSyncExternalStore(subRM, getRM, () => false);
  const listRef = useRef(null);
  const frameRef = useRef(null);
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0, raf: 0, on: false });

  /* --- deep link: /about#sunil-adhau opens that dossier ------------- */
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      const i = TEAM.findIndex((m) => m.slug === id);
      if (i >= 0) {
        setOpen(i);
        /* After the disclosure has its height — and through Lenis, which
           owns the scroll position on this site: a native scrollIntoView
           sets scrollTop underneath it and Lenis glides the page straight
           back. 450ms clears the 350ms height animation. */
        /* Two passes. The browser re-runs its native fragment scroll when
           the document finishes loading, which lands AFTER the first
           correction and puts the row back at the viewport's top edge —
           measured at -1px however the first scroll was made. The second
           pass runs once the load re-anchor has had its turn, and only
           moves if the row is not where it was put. */
        const place = (smooth) => {
          const el = document.getElementById(id);
          if (!el) return;
          const top = el.getBoundingClientRect().top;
          if (Math.abs(top - 140) < 40) return;
          const y = top + window.scrollY - 140;
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, smooth ? { duration: 0.9 } : { immediate: true });
          else window.scrollTo({ top: y });
        };
        setTimeout(() => place(true), 450);
        setTimeout(() => place(false), 1600);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  /* --- the floating frame ------------------------------------------- */
  /* Fine pointer only, and never under reduced motion. The loop starts on
     pointerenter and dies on pointerleave — no rAF while the list is not
     being pointed at. */
  useEffect(() => {
    const list = listRef.current;
    const frame = frameRef.current;
    if (!list || !frame) return;
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const s = state.current;
    const tick = () => {
      s.vx = s.vx * 0.85 + (s.tx - s.x) * 0.15;
      s.x += (s.tx - s.x) * 0.12;
      s.y += (s.ty - s.y) * 0.12;
      const tilt = Math.max(-3, Math.min(3, s.vx * 0.06));
      frame.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      if (s.on) s.raf = requestAnimationFrame(tick);
    };
    const move = (e) => {
      /* offset so the frame floats beside the cursor, not under it */
      s.tx = e.clientX + 28;
      s.ty = e.clientY - 174;
    };
    const enter = (e) => {
      move(e);
      /* arrive where the cursor already is rather than gliding in from
         the last visit's position */
      s.x = s.tx;
      s.y = s.ty;
      s.on = true;
      cancelAnimationFrame(s.raf);
      s.raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      s.on = false;
      cancelAnimationFrame(s.raf);
      setHover(null);
    };
    list.addEventListener("pointerenter", enter);
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerleave", leave);
    return () => {
      s.on = false;
      cancelAnimationFrame(s.raf);
      list.removeEventListener("pointerenter", enter);
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  const toggle = (i) => {
    const next = open === i ? null : i;
    setOpen(next);
    /* the URL follows the open dossier, so a copied link reopens it */
    const url = next === null ? "#" : `#${TEAM[next].slug}`;
    history.replaceState(null, "", url === "#" ? location.pathname : url);
  };

  return (
    <div className="er-tr">
      <ol className="er-tr__list" ref={listRef}>
        {TEAM.map((m, i) => (
          <li
            key={m.slug}
            id={m.slug}
            className="er-tr__row"
            data-open={open === i}
            data-svc-fade
          >
            <button
              type="button"
              className="er-tr__btn"
              aria-expanded={open === i}
              aria-controls={`dossier-${m.slug}`}
              onClick={() => toggle(i)}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(null)}
            >
              <span className="er-label er-tr__i">{m.n}</span>
              <span className="er-tr__name">{m.name}</span>
              <span className="er-label er-tr__cred">
                {m.roster.join(" · ")}
              </span>
              <span className="er-tr__sign" aria-hidden="true">
                +
              </span>
            </button>

            {/* ------------------------- dossier ------------------------ */}
            <div
              id={`dossier-${m.slug}`}
              className="er-tr__wrap"
              role="region"
              aria-label={`${m.name} — details`}
            >
              <div className="er-tr__innerclip">
                <div className="er-tr__dossier">
                  <figure className="er-tr__figure">
                    <Portrait m={m} sizes="(min-width: 1024px) 260px, 40vw" />
                  </figure>
                  <div className="er-tr__info">
                    <p className="er-label er-tr__role">{m.role}</p>
                    <dl className="er-tr__facts">
                      <div className="er-tr__fact">
                        <dt className="er-label">Role</dt>
                        <dd>{m.role}</dd>
                      </div>
                      <div className="er-tr__fact">
                        <dt className="er-label">Qualifications</dt>
                        <dd>{m.qualifications}</dd>
                      </div>
                      {m.registrations ? (
                        <div className="er-tr__fact">
                          <dt className="er-label">Registrations</dt>
                          <dd>{m.registrations}</dd>
                        </div>
                      ) : null}
                      <div className="er-tr__fact">
                        <dt className="er-label">Domain</dt>
                        <dd>{m.domain}</dd>
                      </div>
                    </dl>
                    {m.bio ? (
                      <div className="er-tr__bio">
                        {m.bio.map((p) => (
                          <p key={p.slice(0, 24)}>{p}</p>
                        ))}
                      </div>
                    ) : (
                      /* TODO(client) — bio pending; the register above is
                         the dossier until it arrives. Nothing is written
                         here that the firm has not said. */
                      null
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* ---------------------- the floating frame ---------------------- */}
      {/* fixed, transform-driven, below the nav (z 20) and above content;
          rendered only when something is hovered and inputs allow it */}
      <div
        ref={frameRef}
        className="er-tr__float"
        data-on={hover !== null && !reduced}
        aria-hidden="true"
      >
        {TEAM.map((m, i) => (
          <div key={m.slug} className="er-tr__floatcard" data-show={hover === i}>
            <Portrait m={m} sizes="260px" />
          </div>
        ))}
      </div>
    </div>
  );
}
