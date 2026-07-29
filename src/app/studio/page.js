import Link from "next/link";
import "./studio.css";
import StudioClient from "@/components/studio/StudioClient";
import StudioJourney from "@/components/studio/StudioJourney";

/* Design candidate — see docs/entropy-resolved-brief.md. Kept out of the
   index while it is a candidate: it argues the same content as `/`, and two
   indexed pages making the same claims would compete with each other. */
export const metadata = {
  title: "S S Adhau — Registered Valuers & Chartered Engineers",
  description:
    "Government-approved valuation reports that survive banks, courts and regulators — across Central India.",
  robots: { index: false, follow: false },
};

/* ---------------------------------------------------------------- content
   Every figure below is verifiable from this repository: the offices and
   cities from src/components/OurPresence.jsx, the institutions from
   src/components/TrustedShowcase.jsx, the services from
   src/components/Services.jsx. Nothing is estimated.
   TODO(copy): the brief also asked for "years in practice" and "reports
   delivered". Both are omitted rather than guessed — send real numbers and
   they drop straight into the proof row.                              */

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  { title: "Real estate valuation", tag: "Residential · Commercial · Industrial" },
  { title: "Plant & machinery valuation", tag: "Age · Condition · Market" },
  { title: "Valuation under IBC", tag: "CIRP · Liquidation" },
  { title: "Business valuation", tag: "Income · Market · Asset" },
  { title: "Financial reporting valuation", tag: "Ind-AS · IFRS" },
  { title: "Merger & acquisition support", tag: "Restructuring" },
];

const PROOF = [
  { label: "Offices", figure: "02", note: "Nagpur & Chhindwara" },
  { label: "Cities served", figure: "09", note: "Madhya Pradesh & Maharashtra" },
  { label: "Institutions", figure: "15", note: "Banks, tribunals & departments" },
];

/* The institutions whose work the firm carries out — taken verbatim from
   src/components/TrustedShowcase.jsx, which is the site's existing record
   of them. Names only: the logos are colour artwork and this page is
   monochrome, and a name carries the claim better than a mark anyway. */
const INSTITUTIONS = [
  "Income Tax Department",
  "Debts Recovery Tribunal",
  "State Bank of India",
  "Union Bank of India",
  "Central Bank of India",
  "Bank of India",
  "Indian Bank",
  "Punjab National Bank",
  "Canara Bank",
  "UCO Bank",
  "Bank of Maharashtra",
  "IDBI Bank",
  "HDFC Bank",
  "LIC Housing Finance",
  "Madhya Pradesh Gramin Bank",
];

/* Real reviews, carried over from src/components/MarqueeCards.jsx. The
   @handles and stock avatars there are template leftovers, not the
   clients' own, so they are dropped rather than reproduced. */
const REVIEWS = [
  { name: "Subhash Kamti", text: "Best valuer of Chhindwara." },
  {
    name: "Prateek Agrawal",
    text: "Good knowledge. Satisfactory work. Thank you for your service sir.",
  },
  {
    name: "Priyanka Singh",
    text: "The office staff is knowledgeable and responsive.",
  },
  { name: "Anukul Singh", text: "Best." },
];

/* A headline line: the mask wrapper is authored, never split at runtime. */
function Line({ children }) {
  return (
    <span className="er-line">
      <span>{children}</span>
    </span>
  );
}

export default function StudioPage() {
  return (
    <div className="er">
      {/* Runs during parse, before first paint: arms the reveal states and
          decides whether this visit gets the loader. Doing it here rather
          than on hydration is what stops the page flashing fully-revealed
          and then hiding itself. No JS → no class → finished static page.
          The timeout is a failsafe against a broken hydration trapping the
          document behind the overlay — but it must not fire while the
          loader is legitimately running. It checks a flag the client sets
          when it takes over, so a slow first compile no longer eats the
          animation. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{
var h=document.documentElement;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
h.classList.add('er-js');
var seen=false;try{seen=sessionStorage.getItem('er-seen')==='1'}catch(e){}
if(!seen){h.classList.add('er-loading');
setTimeout(function(){
if(h.getAttribute('data-er-loader')!=='run')h.classList.remove('er-loading');
},6000);}
}catch(e){}})()`,
        }}
      />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      {/* The mark fills as the page loads. The logo is used as a mask, so
          only its silhouette survives — the page stays monochrome and the
          fill can be a single moving edge rather than a bar beside it. */}
      <div className="er-loader" data-loader>
        <span className="er-loader__mark" data-mark aria-hidden="true" />
      </div>

      <StudioClient />

      <header className="er-nav" data-hidden="false" data-scrolled="false">
        <Link className="er-wordmark" href="/">
          S S Adhau<sup>®</sup>
        </Link>
        <nav aria-label="Primary">
          <ul className="er-navlinks">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link className="er-navlink er-track" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="er-main">
        {/* ------------------------- 5.2 HERO ------------------------- */}
        <section className="er-hero">
          <p className="er-label er-hero__eyebrow er-track">
            Registered Valuers — Chartered Engineers
          </p>

          <h1 className="er-display er-h1 er-hero__title">
            <Line>Every decision begins</Line>
            <Line>
              with <em>the right value</em>.
            </Line>
          </h1>

          <p className="er-body er-hero__body er-fade">
            Government-approved valuation reports that survive banks, courts
            and regulators — across Central India.
          </p>

          <div className="er-satellites">
            <p className="er-label er-label--faint er-satellites__side er-fade">
              Nagpur · Chhindwara
            </p>
            <div className="er-satellites__mid er-fade">
              <p className="er-label er-label--faint">Scroll to descend</p>
              <i className="er-tick" aria-hidden="true" />
            </div>
            <p className="er-label er-label--faint er-satellites__side er-fade">
              IBBI · Income Tax Dept.
            </p>
          </div>
        </section>

        {/* ---------------------- 5.3 MANIFESTO ----------------------- */}
        <section className="er-section er-manifesto" aria-labelledby="er-principle">
          <p className="er-label er-label--faint er-section__label er-track">
            Sec. 01 — Principle
          </p>
          <blockquote className="er-manifesto__quote" data-manifesto>
            <h2 id="er-principle" className="er-display er-h2">
              <Line>A valuation is not</Line>
              <Line>
                <span className="er-dim">an</span> opinion.
              </Line>
              <Line>
                It is a <em>defensible</em>
              </Line>
              <Line>
                <em>position</em> — measured
              </Line>
              <Line>
                <span className="er-dim">on site,</span> argued
              </Line>
              <Line>
                <span className="er-dim">in numbers,</span> signed
              </Line>
              <Line>with a name.</Line>
            </h2>
          </blockquote>
        </section>

        {/* ------- 5.4 METHOD — the valuation journey, in this palette ---- */}
        <section
          className="er-section er-jsec"
          aria-labelledby="er-method"
          data-journey
        >
          <div className="er-wrap er-jhead">
            <p className="er-label er-label--faint er-track">Sec. 02 — Method</p>
            <h2 id="er-method" className="er-display er-h3">
              <Line>
                The method behind <em>the number</em>.
              </Line>
            </h2>
            <p className="er-body er-fade er-jhead__b">
              The same matter, re-formed five times: an enquiry becomes a
              surveyed site, becomes an analysis, becomes a document a bank or
              a court can act on.
            </p>
          </div>

          <StudioJourney />
        </section>

        {/* ---------------------- 5.5 INDEX ROWS ---------------------- */}
        <section className="er-section" aria-labelledby="er-index">
          <div className="er-wrap">
            <p className="er-label er-label--faint er-track">Sec. 03 — Index</p>
            <h2 id="er-index" className="er-display er-h3" style={{ margin: "24px 0 56px" }}>
              <Line>
                What we are asked <em>to value</em>.
              </Line>
            </h2>
            <ul className="er-rows">
              {SERVICES.map((service, i) => (
                <li className="er-row" key={service.title} data-row>
                  <Link className="er-row__a" href="/services">
                    <span className="er-row__i">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="er-row__t">{service.title}</h3>
                    <span className="er-row__tag">{service.tag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------ 5.6 PROOF ------------------------- */}
        <section className="er-section" aria-labelledby="er-proof">
          <div className="er-wrap">
            <p className="er-label er-label--faint er-track">Sec. 04 — Record</p>
            <h2 id="er-proof" className="er-display er-h3" style={{ margin: "24px 0 72px" }}>
              <Line>
                Measured, <em>and countable</em>.
              </Line>
            </h2>

            <div className="er-proof">
              {PROOF.map((item) => (
                <div key={item.label}>
                  <span className="er-rule" />
                  <p className="er-label er-label--faint er-track" style={{ marginTop: 20 }}>
                    {item.label}
                  </p>
                  <p className="er-display er-proof__fig">
                    <Line>{item.figure}</Line>
                  </p>
                  <p className="er-body er-fade" style={{ marginTop: 10, fontSize: 14 }}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            <p className="er-label er-label--faint er-track er-proof__note">
              Reports accepted by
            </p>
            <ul className="er-orgs">
              {INSTITUTIONS.map((name) => (
                <li className="er-org" key={name}>
                  <span className="er-rule" />
                  <span className="er-org__n">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------- 5.6b IN THEIR WORDS ----------------- */}
        <section className="er-section" aria-labelledby="er-words">
          <div className="er-wrap">
            <p className="er-label er-label--faint er-track">Sec. 05 — Clients</p>
            <h2 id="er-words" className="er-display er-h3" style={{ margin: "24px 0 64px" }}>
              <Line>
                In <em>their words</em>.
              </Line>
            </h2>

            <ul className="er-words">
              {REVIEWS.map((review) => (
                <li className="er-word" key={review.name}>
                  <span className="er-rule" />
                  <blockquote className="er-word__q er-display">
                    “{review.text}”
                  </blockquote>
                  <p className="er-label er-label--faint er-word__a er-fade">
                    {review.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------- 5.7 CTA + FOOTER --------------------- */}
        <section className="er-section er-cta" aria-labelledby="er-cta-h" data-disperse>
          <div className="er-wrap">
            <h2 id="er-cta-h" className="er-display er-h2">
              <Line>Get a number that</Line>
              <Line>
                <em>survives scrutiny</em>.
              </Line>
            </h2>
            <Link className="er-btn er-fade" href="/contact">
              Request a valuation <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

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
                  <a href="tel:+918793000929">+91 8793 000 929</a>
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
    </div>
  );
}
