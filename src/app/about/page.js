import "@/app/studio.css";
import "./about.css";
import {
  StudioHeader,
  StudioFooter,
  PHONE,
  PHONE_HREF,
} from "@/components/studio/StudioChrome";
import ServiceMotion from "@/components/services/ServiceMotion";
import ReadingText from "@/components/services/ReadingText";
import TeamRoster from "@/components/about/TeamRoster";

/* ABOUT — the story, the team, the questions.
 *
 * This REPLACES the legacy /about page and its /team/[slug] subpages in
 * one pass. Gone with them: the stock photo, the icon bullets, the logo
 * wall (the homepage owns the logos now), and the member subpages — those
 * URLs 301 to /about#member-slug (next.config.mjs), where the inline
 * dossiers carry the same information.
 *
 * Everything on this page is an existing pattern; the one licensed
 * novelty is the roster's floating portrait. No canvas on this route.
 */

const STORY_1 =
  "S S Adhau Valuers and Engineers is a family practice in its second generation: registered valuers and chartered engineers working from Nagpur and Chhindwara. The firm's reports serve banks, tribunals and the Income Tax Department, and private owners across Madhya Pradesh and Maharashtra, from factory premises to the resorts of the Pench belt.";
/* TODO(client): founding year — "Founded by Er. Sudhakar S. Adhau in
   [YEAR]" joins STORY_1 when the year is confirmed. */
const STORY_2 =
  "The discipline has not changed since the first report: a physical inspection, a stated method, assumptions in writing, and a signature that answers for the number. What has grown is the range of assets asked of us, and the list of institutions that accept the answer.";

/* A-4 — the satellite under the title. The EST. clause is omitted until
   the founding year is confirmed; what is left is true today. */
const SATELLITE = "Nagpur & Chhindwara · Second generation";

/* A-4 — THE LINEAGE. Four nodes, every one a placeholder: the years and
   the captions are TODO(client), labelled as such on the page itself so
   nobody mistakes scaffolding for a claim. Nothing here is invented — a
   milestone the firm has not stated is not a milestone. */
/* `id` exists because `year` cannot be the key: every year is the same
   placeholder string until the client supplies the real ones, and four
   identical keys is a React collision. It stays after the years arrive —
   a key should be an identity, not a value that happens to be unique. */
const LINEAGE = [
  { id: "l1", year: "[YEAR]", caption: "[MILESTONE] — the first registration." },
  { id: "l2", year: "[YEAR]", caption: "[MILESTONE] — the second office opens." },
  {
    id: "l3",
    year: "[YEAR]",
    caption: "[MILESTONE] — the practice's first IBC work.",
  },
  {
    id: "l4",
    year: "[YEAR]",
    caption: "[MILESTONE] — the second generation joins.",
  },
];

/* The six Q&As, migrated from the legacy page. Answers are edited only to
   remove adjective padding; every factual claim is the original's. */
const FAQS = [
  {
    q: "What valuation services does SS Adhau provide?",
    a: "Valuation of movable, immovable and agricultural properties, for banks, financial institutions, corporates, legal matters and individual clients.",
  },
  {
    q: "Are your valuation reports compliant with legal standards?",
    a: "Yes. All reports are prepared in accordance with applicable regulatory guidelines, statutory requirements and industry standards.",
  },
  {
    q: "Who conducts the valuations?",
    a: "Qualified, government-registered valuers with multi-disciplinary expertise and an understanding of both technical and market factors.",
  },
  {
    q: "How do you ensure accuracy in valuation?",
    a: "Local market intelligence is combined with technical analysis, verified data sources and established valuation methodologies.",
  },
  {
    q: "Do you maintain confidentiality of client information?",
    a: "Yes. All client data and reports are handled with discretion and professional ethics.",
  },
  {
    q: "What is the typical turnaround time?",
    a: "Most assignments are completed within committed timelines, depending on the property type and complexity.",
  },
];

export const metadata = {
  title: "About — S S Adhau Valuers & Engineers",
  description:
    "A family practice in its second generation: registered valuers and chartered engineers in Nagpur and Chhindwara, serving banks, tribunals and the Income Tax Department across Madhya Pradesh and Maharashtra.",
  alternates: { canonical: "/about" },
};

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function AboutPage() {
  return (
    <div className="er er-about">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      {/* arms the entrance states before first paint — see the register */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('er-js');}catch(e){}})()",
        }}
      />
      <ServiceMotion rootSelector=".er-about" />

      <a className="er-skip" href="#er-main">
        Skip to content
      </a>

      <StudioHeader />

      <main id="er-main">
        {/* ---------------------------- our story -------------------- */}
        {/* A-4 — one block, two columns: the eyebrow, the serif title and
            the satellite hold the left; the two reading paragraphs the
            right. It was a title stacked on a single column of prose,
            which is what made the section read flat. */}
        <section className="er-abhero" data-svc-block>
          <div className="er-wrap">
            <div className="er-abstory">
              <div>
                <p className="er-label er-abhero__eyebrow" data-svc-track>
                  About
                </p>
                {/* the serif's one string on this page */}
                <h1 className="er-display er-abhero__t" data-svc-title>
                  <span className="er-line">
                    <span>
                      Our <em>story</em>.
                    </span>
                  </span>
                </h1>
                <p className="er-label er-abstory__sat" data-svc-fade>
                  {/* TODO(client): the EST. clause joins this line when the
                      founding year is confirmed — "EST. [YEAR] · " in
                      front. Omitted rather than guessed. */}
                  {SATELLITE}
                </p>
              </div>
              <div className="er-about__story">
                <ReadingText text={STORY_1} />
                <ReadingText text={STORY_2} />
              </div>
            </div>
          </div>
        </section>

        <section className="er-about__block er-about__block--lineage" data-svc-block>
          <div className="er-wrap">
            <span
              className="er-abhero__rule"
              data-svc-herorule
              aria-hidden="true"
            />

            {/* -------------------------- the lineage ---------------- */}
            {/* The register's scrubbed rule: it is drawn by the scroll.
                Four milestones, every one of them a placeholder — the
                structure ships so the copy can drop straight in. */}
            <div className="er-lineage" aria-labelledby="er-lineage-h">
              <h3 id="er-lineage-h" className="er-sr-only">
                The lineage
              </h3>
              <span
                className="er-lineage__rule"
                data-ledger-rule
                aria-hidden="true"
              >
                <i />
              </span>
              <ol className="er-lineage__nodes">
                {LINEAGE.map((node) => (
                  <li className="er-lineage__node" key={node.id} data-svc-fade>
                    <p className="er-label er-lineage__year">{node.year}</p>
                    <p className="er-lineage__cap">{node.caption}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* --------------------------- the team ---------------------- */}
        <section
          className="er-about__block"
          data-svc-block
          aria-labelledby="er-team-h"
        >
          <div className="er-wrap">
            <p className="er-label er-about__eyebrow" data-svc-fade>
              Meet the team
            </p>
            <h2 id="er-team-h" className="er-about__h" data-svc-fade>
              Five engineers. One signature standard.
            </h2>
            <TeamRoster />
          </div>
        </section>

        {/* ------------------------- the questions ------------------- */}
        <section
          className="er-about__block"
          data-svc-block
          aria-labelledby="er-faq-h"
        >
          <div className="er-wrap">
            <p className="er-label er-about__eyebrow" data-svc-fade>
              The questions
            </p>
            <h2 id="er-faq-h" className="er-about__h" data-svc-fade>
              Asked before. Answered in writing.
            </h2>
            {/* Native disclosure, grouped by `name` so the browser holds
                the one-open-at-a-time rule itself — no JS, keyboard
                operable by default, and the 0fr/1fr wrap animates the
                height exactly as the register's disclosures do. */}
            <div className="er-faq">
              {FAQS.map((f) => (
                <details className="er-faq__item" name="er-faq" key={f.q}>
                  <summary className="er-faq__sum">
                    {f.q}
                    <span className="er-faq__sign" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="er-faq__wrap">
                    <div className="er-faq__inner">
                      <p className="er-faq__a">{f.a}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------- closing ----------------------- */}
        <section className="er-about__block er-about__block--close" data-svc-block>
          <div className="er-wrap">
            <div className="er-abclose">
              <p className="er-abclose__line" data-svc-fade>
                The signature on the report is a person. You have now met
                them.
              </p>
              <a
                className="er-label er-abclose__cta"
                href={PHONE_HREF}
                data-svc-fade
              >
                <b>Speak to a valuer</b>
                <span aria-hidden="true">·</span>
                <b>{PHONE}</b>
              </a>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
