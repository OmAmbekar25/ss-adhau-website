import Link from "next/link";
import StudioNav from "./StudioNav";
import StudioNavScroll from "./StudioNavScroll";

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

export function StudioHeader() {
  return (
    <>
      <StudioNav />
      <StudioNavScroll />
      <header className="er-nav" data-hidden="false" data-scrolled="false">
        <Link className="er-wordmark" href="/">
          S S Adhau<sup>®</sup>
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

        <p className="er-bigmark er-display er-fade" aria-hidden="true">
          S S Adhau
        </p>

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
