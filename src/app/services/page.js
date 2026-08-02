import { Fragment } from "react";
import Link from "next/link";
import "@/app/studio.css";
import "./register.css";
import {
  StudioHeader,
  StudioFooter,
  PHONE,
  PHONE_HREF,
} from "@/components/studio/StudioChrome";
import ServiceMotion from "@/components/services/ServiceMotion";
import ReadingText from "@/components/services/ReadingText";
import RegisterRows from "@/components/services/RegisterRows";
import ScopeGlyph from "@/components/services/ScopeGlyph";
import {
  SERVICES,
  ALSO_IN_SCOPE,
  REGISTER_INTRO,
  CITIES,
} from "@/data/services";

/* THE REGISTER — the catalogue hub.
 *
 * This REPLACES the legacy /services page rather than restyling it. Gone
 * with it: the stock imagery, the pastel icon circles and every lucide
 * icon, the "Why Choose Us?" block and its six adjective cards, the
 * legacy nav and footer, and the "Delivering accurate and independent..."
 * copy. One thing survived, because it was the only specific and true
 * content on the page: the list of places the firm travels to.
 *
 * No canvas on this route, same as the service pages.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ssadhauvaluers.com";

export const metadata = {
  title: "Services — S S Adhau Valuers & Engineers",
  description:
    "Twelve valuation and engineering services across Madhya Pradesh and Maharashtra, each inspected, measured and signed by a registered valuer or chartered engineer.",
  alternates: { canonical: "/services" },
};

/* One ItemList of everything the firm does, with the six that have pages
   carrying their URLs. Nothing is asserted here that the page does not
   already say in words. */
function jsonLd() {
  const items = [
    ...SERVICES.map((s) => ({
      "@type": "Service",
      name: s.plain,
      url: `${SITE}/services/${s.slug}`,
      provider: { "@id": `${SITE}/#organization` },
    })),
    ...ALSO_IN_SCOPE.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.desc,
      provider: { "@id": `${SITE}/#organization` },
    })),
  ];
  /* The Organization itself is emitted by the root layout on every page
     (M-4), so this graph references it by @id rather than restating it —
     two definitions of one node is how they drift apart. */
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Valuation and engineering services",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item,
        })),
      },
    ],
  };
}

/* Two items to a row, and the odd one out keeps the left column. */
function pairs(list) {
  const out = [];
  for (let i = 0; i < list.length; i += 2) out.push(list.slice(i, i + 2));
  return out;
}

/* The rule is two halves that grow apart from the gutter, which is what
   makes it read as being ruled rather than faded in. The 96px gap between
   them is the grid's own middle track, so the rule breaks exactly where
   the columns do. The head rule closes the gap to nothing. */
function Rule({ head = false, mid = false }) {
  const cls =
    "er-ledger__rule" +
    (head ? " er-ledger__rule--head" : "") +
    (mid ? " er-ledger__rule--mid" : "");
  return (
    <span className={cls} data-ledger-rule aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

export default function ServicesRegister() {
  return (
    <div className="er er-reg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      {/* arms the entrance states before first paint — see ServicePage */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('er-js');}catch(e){}})()",
        }}
      />
      <ServiceMotion rootSelector=".er-reg" />
      <RegisterRows />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <StudioHeader />

      <main id="er-main">
        {/* ------------------------------ hero ---------------------- */}
        <div className="er-wrap">
          <section className="er-reghero" data-svc-block>
            <div>
              <p className="er-label er-reghero__eyebrow" data-svc-track>
                The register
              </p>
              {/* the serif's one string on this page */}
              <h1 className="er-display er-reghero__t" data-svc-title>
                <span className="er-line">
                  <span>Everything we are asked to value.</span>
                </span>
              </h1>
            </div>
            {/* R-1 — the right column, centred against the title block:
                nothing is left floating in empty space at 1280 and up. */}
            <div>
              <ReadingText text={REGISTER_INTRO} />
              <p className="er-label er-reghero__sat" data-svc-fade>
                {/* the separator is glued to the city before it, so a line
                    can never open on a stray middot */}
                {CITIES.join("\u00a0· ")}
              </p>
            </div>
          </section>
        </div>
        <div className="er-wrap">
          <span
            className="er-reghero__rule"
            data-svc-herorule
            aria-hidden="true"
          />
        </div>

        {/* -------------------------- the six ----------------------- */}
        {/* The index-row colour worlds, back from the studio page that
            retired them. See register.css for what the type lock changed
            on the way. */}
        <section
          className="er-reg__block"
          data-svc-block
          aria-labelledby="er-reg-six"
        >
          <div className="er-wrap">
            <h2 id="er-reg-six" className="er-sr-only">
              Practices with their own pages
            </h2>
            <ol className="er-rows">
              {SERVICES.map((s) => (
                <li
                  key={s.slug}
                  className="er-row"
                  data-row
                  data-active="false"
                  style={{ "--row-hue": s.hue, "--row-hue-text": s.hueText }}
                >
                  <Link className="er-row__a" href={`/services/${s.slug}`}>
                    <span className="er-label er-row__i">{s.n}</span>
                    <h3 className="er-row__t">{s.plain}</h3>
                    <span className="er-row__slot">
                      {/* One run of inline text, not one box per label:
                          as flex items the labels shrank below their own
                          width and overlapped. Each label is a nowrap
                          box inside the run, and the separator is glued
                          to the label before it by a no-break space, so
                          a line can only break AFTER a middot. */}
                      <span className="er-label er-row__tag">
                        <span className="er-row__tagline">
                          {s.chips.slice(0, 3).map((c, i, a) => (
                            <Fragment key={c}>
                              <b>{c}</b>
                              {i < a.length - 1 ? " · " : ""}
                            </Fragment>
                          ))}
                        </span>
                      </span>
                      {/* R-14 — the SUMMARY, never a page paragraph.
                          This slot is 280px wide and two-ish lines tall;
                          it was bound to `paragraph2` (193–344 chars) and
                          painted straight out of the row. `summary` is
                          asserted at build to stay under 160. */}
                      <span className="er-row__desc">{s.summary}</span>
                    </span>
                    <span
                      className="er-label er-row__explore"
                      aria-hidden="true"
                    >
                      Explore →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------- also within scope ------------------ */}
        <section
          className="er-reg__block er-reg__block--close"
          data-svc-block
          aria-labelledby="er-reg-also"
        >
          <div className="er-wrap">
            {/* R-11 — the section's head rule draws like the ledger's
                own, and is the only one without a gap: a gap belongs to a
                pair of columns, and this rule heads the whole section. */}
            <Rule head />
            <h2 id="er-reg-also" className="er-label" data-svc-fade>
              Also within scope
            </h2>

            {/* R-9 — one grid owns both columns, so the rule under the
                left item and the rule under the right item are the same
                rule. Two stacks of bordered list items drift apart the
                moment one description wraps; a ledger cannot. */}
            <div className="er-ledger">
              {pairs(ALSO_IN_SCOPE).map((pair) => (
                <Fragment key={pair[0].title}>
                  {pair.map((s, i) => (
                    <Fragment key={s.title}>
                      <div
                        className="er-ledger__item"
                        data-side={i === 0 ? "l" : "r"}
                        data-ledger-item
                      >
                        <ScopeGlyph name={s.glyph} />
                        <div>
                          <p className="er-ledger__t">{s.title}</p>
                          <p className="er-ledger__d">{s.desc}</p>
                        </div>
                      </div>
                      {/* Stacked, the pair's two items are vertical
                          neighbours with only the pair's own rule under
                          the second — so the first would run into the
                          second unruled. This rule exists for that case
                          and is not laid out at all above 820. */}
                      {i === 0 && pair.length === 2 ? <Rule mid /> : null}
                    </Fragment>
                  ))}
                  <Rule />
                </Fragment>
              ))}
            </div>

            <div className="er-regclose">
              {/* R-12 — a sentence, so it is set in the reading face and
                  not in the label's tracked caps */}
              <p className="er-regclose__line" data-svc-fade>
                If it can be inspected, it can be valued.
              </p>
              <a
                className="er-label er-regclose__cta"
                href={PHONE_HREF}
                data-svc-fade
              >
                {/* two unbreakable halves: the line may break between
                    them, never inside "Speak to a valuer" or the number */}
                <b>Speak to a valuer</b>
                <span aria-hidden="true">·</span>
                <b>{PHONE}</b>
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------------- proof ----------------------- */}
        {/* No "Why Choose Us". Four facts already on the record, linking
            to the section of the home page that sets them out. */}
        <section className="er-reg__block er-reg__block--proof" data-svc-block>
          <div className="er-wrap">
            <Link
              className="er-label er-regproof"
              href="/#er-record"
              data-svc-fade
            >
              <span>
                IBBI and Income Tax Dept. registered. Reports accepted by
                banks, tribunals and departments across Madhya Pradesh and
                Maharashtra.
              </span>
              <span className="er-regproof__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
