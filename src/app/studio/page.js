import Link from "next/link";
import "./studio.css";
import StudioClient from "@/components/studio/StudioClient";

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

const STEPS = [
  {
    title: "Purpose & documents",
    body: "The asset, the purpose of valuation — bank mortgage, IBC, tax, M&A — and the statutory framework that governs it. The purpose decides the method, so it is settled first.",
  },
  {
    title: "Site inspection",
    body: "A registered valuer attends the property and measures it. No desktop estimates, no photographs sent over WhatsApp: the report describes what was seen.",
  },
  {
    title: "Report & defence",
    body: "Market evidence and technical assessment are reconciled into a figure, certified under our registration — and stood behind when a bank, a court or a regulator asks how it was reached.",
  },
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
          The timeout is a failsafe: if hydration never happens, the loader
          must not be able to trap the document. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{
var h=document.documentElement;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
h.classList.add('er-js');
var seen=false;try{seen=sessionStorage.getItem('er-seen')==='1'}catch(e){}
if(!seen){h.classList.add('er-loading');
setTimeout(function(){h.classList.remove('er-loading')},2500);}
}catch(e){}})()`,
        }}
      />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <div className="er-loader" data-loader>
        <p className="er-label er-label--faint">
          <span data-count>00</span> — 100
        </p>
        <span className="er-loader__bar">
          <i data-bar />
        </span>
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

        {/* --------------------- 5.4 SPLIT / PROCESS ------------------ */}
        <section className="er-section" aria-labelledby="er-method" data-split>
          <div className="er-wrap er-split">
            <div className="er-split__sticky" data-split-left>
              <p className="er-label er-label--faint er-track">Sec. 02 — Method</p>
              <h2 id="er-method" className="er-display er-h3" style={{ marginTop: 24 }}>
                <Line>The method behind</Line>
                <Line>
                  <em>the number</em>.
                </Line>
              </h2>
              <div className="er-progress" style={{ marginTop: 48 }}>
                <i className="er-progress__fill" data-progress />
              </div>
            </div>

            <ol className="er-steps" data-steps>
              {STEPS.map((step, i) => (
                <li className="er-step" key={step.title} data-step data-active={i === 0}>
                  <span className="er-step__i">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="er-step__t">{step.title}</h3>
                    <p className="er-body er-step__b er-fade">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
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

            <p className="er-body er-proof__note er-fade">
              Work is carried out for the Income Tax Department, the Debts
              Recovery Tribunal, and for Union Bank of India, Central Bank of
              India, Bank of India, Indian Bank, Punjab National Bank, Canara
              Bank, UCO Bank, Bank of Maharashtra, State Bank of India, IDBI
              Bank, HDFC Bank, LIC Housing Finance and Madhya Pradesh Gramin
              Bank.
            </p>
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
