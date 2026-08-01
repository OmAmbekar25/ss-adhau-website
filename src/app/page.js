import Link from "next/link";
import "./studio.css";
import StudioClient from "@/components/studio/StudioClient";
import StudioFluid from "@/components/studio/StudioFluid";
import StudioJourney from "@/components/studio/StudioJourney";
import StudioTrusted from "@/components/studio/StudioTrusted";
import StudioShowcase from "@/components/studio/StudioShowcase";
import StudioQuiet from "@/components/studio/StudioQuiet";
import StudioRiver from "@/components/studio/StudioRiver";
import StudioRecord from "@/components/studio/StudioRecord";
import {
  StudioHeader,
  StudioFooter,
  NAV,
} from "@/components/studio/StudioChrome";

/* THE HOME PAGE.
 *
 * This was `/studio`, built as a design candidate against the legacy home
 * page — see docs/entropy-resolved-brief.md. The candidate won: it is the
 * home page now, the legacy one is deleted rather than restyled, and
 * `/studio` is a permanent redirect here (next.config.mjs). The
 * `robots: { index: false }` that kept two pages from competing over the
 * same claims goes with the competition.
 */
export const metadata = {
  title:
    "S S Adhau — Registered Valuers & Chartered Engineers, Nagpur & Chhindwara",
  description:
    "Government-approved valuation reports that survive banks, courts and regulators — across Central India.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "S S Adhau — Registered Valuers & Chartered Engineers, Nagpur & Chhindwara",
    description:
      "Government-approved valuation reports that survive banks, courts and regulators — across Central India.",
    url: "/",
    type: "website",
    images: [{ url: "/images/og-home.png", width: 1200, height: 630 }],
  },
};

/* ---------------------------------------------------------------- content
   Every figure below is verifiable from this repository: the offices and
   cities from src/data/territory.js, the institutions from
   src/components/TrustedShowcase.jsx, the services from
   src/components/Services.jsx. Nothing is estimated.
   TODO(copy): the brief also asked for "years in practice" and "reports
   delivered". Both are omitted rather than guessed — send real numbers and
   they drop straight into the proof row.                              */


/* TODO(copy): the firm may trim these descriptions; they ship as written.
   Each row also carries a hue — see --hue-01..06 in studio.css. The six sit
   in one tonal band so moving between them reads as turning one dial. */
const SERVICES = [
  {
    title: "Real estate valuation",
    tag: "Residential · Commercial · Industrial",
    hue: "#8A6D3F",
    desc: "Residential, commercial and industrial property — inspected, measured and benchmarked against local market evidence.",
  },
  {
    title: "Plant & machinery valuation",
    tag: "Age · Condition · Market",
    hue: "#3F5C7A",
    desc: "Age, condition and market comparables for plant, machinery and equipment — from single assets to full facilities.",
  },
  {
    title: "Valuation under IBC",
    tag: "CIRP · Liquidation",
    hue: "#7A3F46",
    desc: "CIRP and liquidation valuations under the Insolvency and Bankruptcy Code, built to survive committee and court review.",
  },
  {
    title: "Business valuation",
    tag: "Income · Market · Asset",
    hue: "#5C4A7A",
    desc: "Income, market and asset approaches to whole-business value — for transactions, disputes and planning.",
  },
  {
    title: "Financial reporting valuation",
    tag: "Ind-AS · IFRS",
    hue: "#3F6E66",
    desc: "Ind-AS and IFRS fair-value measurements with the working papers auditors ask for.",
  },
  {
    title: "Merger & acquisition support",
    tag: "Restructuring",
    hue: "#7A5A3F",
    desc: "Valuation support through restructuring and M&A — diligence, swap ratios and fairness opinions.",
  },
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
/* Runs every load while this page is a candidate. Once-per-session is the
   brief's behaviour and should be restored before launch by reinstating
   the sessionStorage guard below. */
{h.classList.add('er-loading');
setTimeout(function(){
if(h.getAttribute('data-er-loader')!=='run')h.classList.remove('er-loading');
},6000);}
}catch(e){}})()`,
        }}
      />

      {/* The mark is the page's LCP element and it cannot paint at all
          until its mask decodes — and the mask is a `url()` inside the
          stylesheet, so the browser does not learn about it until the CSS
          has parsed. Profiling the production build put 26% of LCP in that
          discovery gap. Preloading closes it; nothing about the loader
          itself changes. */}
      <link
        rel="preload"
        as="image"
        href="/images/SSAdhauBG.png"
        fetchPriority="high"
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
      {/* Right after the field and before any content: both canvases sit
          at z-index 0, so tree order is what puts the wake above the dots
          and both of them under the type. */}
      <StudioFluid />
      <StudioQuiet />
      <StudioRecord />

      <StudioHeader />

      <main id="er-main">
        {/* ------------------------- 5.2 HERO ------------------------- */}
        <section className="er-hero">
          {/* data-quiet marks a block the field must stay calm behind —
              see StudioQuiet.jsx. Not a scrim: the points inside are dimmed
              and shrunk in the shader, never moved. */}
          <div className="er-hero__block" data-quiet>
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

          {/* The primary CTA used to sit only at the foot of the page and
              in the deliverable section. With that section gone it belongs
              here, above the fold, as well as in the closing block. */}
          <Link className="er-btn er-hero__cta er-fade" href="/contact">
            Request a valuation <span aria-hidden="true">→</span>
          </Link>
          </div>
        </section>

        {/* ---------------------- 5.3 MANIFESTO ----------------------- */}
        <section className="er-section er-manifesto" aria-labelledby="er-principle">
          <p className="er-label er-label--faint er-section__label er-track">
            Principle
          </p>
          <blockquote className="er-manifesto__quote" data-manifesto>
            <h2 id="er-principle" className="er-display er-h2 er-h2--serif" data-quiet>
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
            <p className="er-label er-label--faint er-track">Method</p>
            <h2 id="er-method" className="er-display er-h3" data-quiet>
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

        {/* ------------------- 5.5 SERVICE SHOWCASE ------------------- */}
        <StudioShowcase />

        <StudioTrusted />

        {/* ------------------------ 5.6 PROOF ------------------------- */}
        <section id="er-record" className="er-section" aria-labelledby="er-proof" data-record>
          <div className="er-wrap">
            <p className="er-label er-label--faint er-track" data-rec-eyebrow>
              Record
            </p>
            <h2 id="er-proof" className="er-display er-h3" data-quiet style={{ margin: "24px 0 72px" }}>
              <Line>
                Measured, <em>and countable</em>.
              </Line>
            </h2>

            <div className="er-proof">
              {PROOF.map((item) => (
                <div key={item.label} data-rec-col>
                  <span className="er-rule" />
                  <p
                    className="er-label er-label--faint er-track"
                    data-rec-label
                    style={{ marginTop: 20 }}
                  >
                    {item.label}
                  </p>
                  <p className="er-display er-proof__fig" data-rec-fig>
                    <Line>{item.figure}</Line>
                  </p>
                  <p
                    className="er-body er-fade"
                    data-rec-note
                    style={{ marginTop: 10, fontSize: 14 }}
                  >
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="er-label er-label--faint er-track er-proof__note"
              data-rec-orglabel
            >
              Reports accepted by
            </p>
            <ul className="er-orgs">
              {INSTITUTIONS.map((name) => (
                <li className="er-org" key={name} data-rec-org>
                  <span className="er-rule" />
                  <span className="er-org__n er-fade" data-rec-orgname>
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------- 5.6b IN THEIR WORDS ----------------- */}
        <section className="er-section" aria-labelledby="er-words">
          <div className="er-wrap">
            <p className="er-label er-label--faint er-track">Clients</p>
            <h2 id="er-words" className="er-display er-h3" data-quiet style={{ margin: "24px 0 64px" }}>
              <Line>
                In <em>their words</em>.
              </Line>
            </h2>

            <StudioRiver />
          </div>
        </section>

        {/* --------------------- 5.7 CTA + FOOTER --------------------- */}
        <section className="er-section er-cta" aria-labelledby="er-cta-h" data-disperse>
          <div className="er-wrap">
            <h2 id="er-cta-h" className="er-display er-h2" data-quiet>
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

      <StudioFooter />
    </div>
  );
}
