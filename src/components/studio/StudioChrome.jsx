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

/* The mark and the wordmark are ONE link, in both places. They are one
   thing to a reader, and two adjacent links to the same destination is a
   nuisance to anyone tabbing through. `alt=""` because the wordmark
   beside it already says the name — the mark is decorative in this
   pairing, not unlabelled. */
function Mark({ size }) {
  return (
    <img
      className="er-mark"
      src="/images/mark-white.png"
      alt=""
      width={size}
      height={Math.round((162 / 160) * size)}
      decoding="async"
    />
  );
}

export function StudioHeader() {
  return (
    <>
      <StudioNav />
      <StudioNavScroll />
      <header className="er-nav" data-hidden="false" data-scrolled="false">
        <Link className="er-wordmark" href="/">
          <Mark size={26} />
          <span>
            S S Adhau<sup>®</sup>
          </span>
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
