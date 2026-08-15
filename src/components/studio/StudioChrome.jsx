import Link from "next/link";
import StudioNav from "./StudioNav";
import StudioNavScroll from "./StudioNavScroll";
import StudioLockup from "./StudioLockup";

/* The nav and footer, lifted out of the studio page so the service pages
   can carry the same two without carrying the page they came from.
 *
 * The extraction is the point: the brief asks the service pages for "the
 * identical component", and the only way to be sure of that is for there
 * to be one component. Copying the markup would have left two things that
 * agree today and drift on the next change.
 *
 * Nothing here pulls in the field, the fluid, GSAP or three — a service
 * page mounting the nav must not drag a particle system in behind it.
 */

export const NAV = [
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const PHONE = "+91 8793 000 929";
export const PHONE_HREF = "tel:+918793000929";
export const WHATSAPP_HREF = "https://wa.me/918793000929";

/* The mark and the wordmark are ONE link, in both places. They are one
   thing to a reader, and two adjacent links to the same destination is a
   nuisance to anyone tabbing through. `alt=""` because the wordmark
   beside it already says the name — the mark is decorative in this
   pairing, not unlabelled.
 *
 * §3.1 — FULL COLOUR, ALWAYS. R-4's white-from-alpha silhouette
 * (`mark-white.png`) is retired: the firm has a real mark with real
 * colours and this site had abandoned them. One file serves the nav, the
 * footer and the loader, so they cannot differ by a hex value.
 *
 * The brief asks for inline SVG "so it can inherit nothing and never be
 * filtered". No SVG of this mark exists — the only source in the repo is
 * the raster lockup — and R-4 already ruled against autotracing it. A
 * raster <img> meets the same requirement by construction: it inherits
 * no `color`, carries no filter and cannot be tinted by the cascade.
 * Cropped from the lockup's own roundel at 144px for a 36px slot.
 * TODO(client): swap in the real SVG when it arrives — see §5.1.
 */
function Mark({ size }) {
  return (
    <img
      className="er-mark"
      src="/brand/logo-mark.png"
      alt=""
      width={size}
      height={size}
      decoding="async"
      /* Same file is requested three ways on the home page: this <img>,
         the loader's CSS background, and the <link rel=preload>. A plain
         <img> request is credentialed and a CSS one is anonymous, so
         without this the preload matched the loader and MISSED the nav —
         "the request credentials mode does not match" in dev, and the
         mark downloaded twice. Same-origin, so anonymous costs nothing.
         Same defect the 2026-08-02 row fixed for the mask; it came back
         the moment the mark gained a second consumer. */
      crossOrigin="anonymous"
    />
  );
}

export function StudioHeader() {
  return (
    <>
      <StudioNav />
      <StudioNavScroll />
      <header className="er-nav" data-hidden="false" data-scrolled="false">
        {/* §3.1/§3.3 — the mark, then the cycling slot. The firm's name
            is in the DOM exactly once, as a single visually-hidden
            string: it is what a screen reader hears and what gives this
            link its accessible name, so no rotating fragment is ever
            announced. */}
        <Link className="er-wordmark" href="/">
          <Mark size={36} />
          <span className="er-sr-only">
            S S Adhau Valuers &amp; Engineers — home
          </span>
          <StudioLockup />
        </Link>
        <nav aria-label="Primary">
          {/* P-1 — the links live behind a hamburger. Hover reveals them
              on a fine pointer, but the button is the real control: it
              toggles on click, opens on keyboard focus and closes on
              Escape, so touch and keyboard are never left without a path. */}
          <div className="er-navwrap" data-navwrap>
            <ul className="er-navlinks" id="er-navlinks" data-navlinks>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link className="er-navlink" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="er-burger"
              data-burger
              aria-expanded="false"
              aria-controls="er-navlinks"
              aria-label="Menu"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export function StudioFooter() {
  return (
    <footer className="er-footer">
      <div className="er-wrap">
        {/* the mark and the small serif wordmark, above the columns and
            left-aligned — P-6's size, which is the footer's own */}
        <Link className="er-footmark" href="/">
          <Mark size={44} />
          <span className="er-display">S S Adhau</span>
        </Link>

        <div className="er-footcols">
          <div className="er-footcol">
            <h2>Index</h2>
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="er-footcol">
            <h2>Contact</h2>
            <ul>
              <li>
                <a href={PHONE_HREF}>{PHONE}</a>
              </li>
              <li>
                <a href="mailto:ssadhauvaluers@gmail.com">
                  ssadhauvaluers@gmail.com
                </a>
              </li>
              <li>Mon – Sat · 10:00 – 19:00</li>
            </ul>
          </div>
          <div className="er-footcol">
            <h2>Offices</h2>
            <ul>
              <li>Manish Nagar, Nagpur — 440015</li>
              <li>Parasia Road, Chhindwara — 480001</li>
            </ul>
          </div>
        </div>

        <div className="er-colophon">
          <p className="er-label er-label--faint">
            © {new Date().getFullYear()} S S Adhau Valuers &amp; Engineers
          </p>
          <p className="er-label er-label--faint">
            IBBI Registered · Income Tax Dept. Approved
          </p>
        </div>
      </div>
    </footer>
  );
}
