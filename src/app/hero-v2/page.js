import Link from "next/link";
import "../studio.css";
import StudioClient from "@/components/studio/StudioClient";
import StudioBlossom from "@/components/studio/StudioBlossom";
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

/* HERO CANDIDATE — /hero-v2
 *
 * A DUPLICATE of the home page, existing so the hero transition can be
 * designed against the real page without putting `/` at risk. This is the
 * pattern the project already used once: `/studio` was built beside the
 * legacy home page, judged against it, and promoted when it won.
 *
 * The ONLY difference from `/` is `<StudioClient beat />`, which arms the
 * scroll beat — camera push, copy fade, field decomposition, hand-off to
 * the panel. Everything else here is `/`'s markup verbatim so the two are
 * compared on the hero and nothing else.
 *
 * `noindex` for exactly the reason `/studio` carried it: two pages making
 * the same claims must not compete in search while one is a candidate.
 * When this wins, its beat moves to `/` and this route is deleted — it is
 * not a second home page to maintain.
 */
export const metadata = {
  title: "Hero candidate — S S Adhau",
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

/* THE PRINCIPLE, AS ONE HORIZONTAL LINE. An array because the film
   writes it on a word at a time — a nested array is the italic cut. The
   em dash stands alone on purpose: it is the sentence's own pause, and a
   reveal that honours it reads as speech rather than as a ticker. */
const PRINCIPLE = [
  "A",
  "valuation",
  "is",
  "not",
  "an",
  "opinion.",
  "It",
  "is",
  "a",
  ["em", "defensible"],
  ["em", "position"],
  "\u2014",
  "measured",
  "on",
  "site,",
  "argued",
  "in",
  "numbers,",
  "signed",
  "with",
  "a",
  "name.",
];

/* A headline line: the mask wrapper is authored, never split at runtime. */
function Line({ children }) {
  return (
    <span className="er-line">
      <span>{children}</span>
    </span>
  );
}

export default function HeroCandidatePage() {
  return (
    /* `er-home` is what lets the stylesheet address THIS page's nav
       specifically. The lockup and the links take ink while the nav sits
       over the white hero and warm white once it is over graphite, and
       every other document route is already addressable by its own class
       (`er-svc`, `er-reg`, …) while the home page was not. */
    <div className="er er-home er-lab">
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
/* ONCE PER SESSION, which is the brief's behaviour. It was running on
   every load because this page was a candidate at /studio and each visit
   needed to show the loader; that reason died when it was promoted to /.
   §15 has said since 2026-07-29 that the guard should come back before
   launch. A returning visitor now goes straight to the hero. */
if(!sessionStorage.getItem('er-seen-lab')){h.classList.add('er-loading');
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
          itself changes.

          `crossOrigin="anonymous"` because the mask is fetched by CSS and
          a CSS image request is anonymous: without a matching credentials
          mode the preload is a SECOND request rather than a head start.
          The browser says so in dev ("credentials mode does not match")
          and the mask paid for the round trip twice. */}
      <link
        rel="preload"
        as="image"
        href="/brand/logo-mark.png"
        fetchPriority="high"
        crossOrigin="anonymous"
      />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      {/* §3.4 — the loader carries the SAME full-colour mark the navbar
          does, from the same file, on the same white the hero opens on.
          It used to be a silhouette filling with ink, which the mark rule
          no longer permits: the mark is never recoloured or masked. So
          the progress moves off the logo and onto a rule beneath it, in
          the brand orange. */}
      <div className="er-loader" data-loader>
        <span className="er-loader__mark" aria-hidden="true" />
        <span className="er-loader__bar" data-mark aria-hidden="true" />
      </div>

      <StudioClient beat />
      {/* Right after the field and before any content: both canvases sit
          at z-index 0, so tree order is what puts the wake above the dots
          and both of them under the type. */}
      <StudioFluid />
      <StudioQuiet />
      <StudioRecord />

      <StudioHeader />

      <main id="er-main">
        {/* ------------------------- 5.2 HERO -------------------------
            THE PAGE STACK. Hero, Principle, Method and the service
            showcase are siblings in one wrapper because that is the only
            arrangement in which each can be COVERED by the next: sticky
            is contained by its parent's box, so panels that need to hold
            while their successor rises over them have to share a parent.
            The wrapper ends after the showcase, and everything below it
            scrolls normally again.

            Tree order is the layering: these are all positioned at
            z-index auto, so each later sibling paints over the one before
            it without a single z-index needing to be authored. */}
        <div className="er-pagestage">
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

        {/* THE BEAT'S OWN TRAVEL. The hero is sticky, so on `/` the panel
            rising IS the whole of its scroll — which leaves the
            decomposition happening inside a strip that the panel is busy
            covering, and most of it is never seen. This spacer buys one
            viewport of sticky hold BEFORE the panel starts, which is the
            structure every reference in the survey actually has: hold,
            play the beat, then hand off. It carries nothing and is
            invisible; it exists to be scrolled through. */}
        <div className="er-beatspace" aria-hidden="true" />

        {/* ---------------------- 5.3 MANIFESTO ----------------------- */}
        <section className="er-section er-manifesto" aria-labelledby="er-principle">
          <p className="er-label er-label--faint er-section__label er-track">
            Principle
          </p>
          {/* The film and the line it carries. The copy stays HERE, on the
              page with the rest of the page's words, and is handed to the
              component that owns the timing — the film's clock is what
              writes the line on, so the two cannot live apart.

              One word per token because the reveal is per word. The dim
              spans the stacked version used are gone: dimming three of
              seven lines was a second reading order, and against a reveal
              that already has one it fights rather than adds. */}
          <StudioBlossom words={PRINCIPLE} />
        </section>

        {/* The Principle panel's own hold. Without it the Method panel
            began rising the instant Principle reached the top — the two
            boundaries landed on the same scroll position and the panel
            never had a frame to itself. Each panel in the stack gets one
            viewport of hold before its successor starts. Carries nothing;
            it exists to be scrolled through. */}
        <div className="er-hold" aria-hidden="true" />

        {/* ------- 5.4 METHOD — the valuation journey, in this palette ---- */}
        <section
          className="er-section er-jsec"
          aria-labelledby="er-method"
          data-journey
          data-panel
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
        </div>

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
