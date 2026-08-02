/* The six service payloads.
 *
 * One template renders all of these; there is no per-page layout fork
 * anywhere in `/services/[slug]`, and now no per-page DATA fork either:
 * every page is hero plus one image, with no exceptions. Real estate's
 * third image (`page-01-pattern`) stays in `/public` and in the licence
 * table for future use, but nothing references it and it has no preload
 * or AVIF manifest entry.
 *
 * `hue` and `hueText` mirror the locked colour worlds in studio.css
 * (`--hue-NN` / `--hue-NN-text`). The pair is the lock: the raw hue is for
 * non-text only — index numerals at display size, hairline accents, the
 * CTA border, link underlines — and any text carrying a hue takes the
 * text token, which is the contrast-safe one. See §15.
 *
 * Copy is final and client-approved. Where the client still owes a fact it
 * is marked TODO(client) and the clause is omitted rather than guessed.
 */

export const SERVICES = [
  {
    slug: "real-estate-valuation",
    n: "01",
    hue: "#8A6D3F",
    hueText: "#BEB19B",
    title: ["Real estate ", "valuation"],
    em: 1, // the word set in italic
    plain: "Real estate valuation",
    summary:
      "Residential, commercial and industrial property — inspected, measured and benchmarked against local market evidence.",
    pageBody1:
      "Residential, commercial and industrial property: flats, plots, shops, offices, warehouses and factory premises. Every valuation begins with a physical inspection by a registered valuer. Boundaries, built-up area, construction quality and occupancy are measured on site and set against local market evidence. The report states its approach and assumptions in full, carries the valuer's name and IBBI registration, and is formatted to your bank's standard. Fifteen banks, tribunals and departments accept our reports.",
    pageBody2:
      "Flats and plots are measured against the sanctioned plan, shops and offices against carpet and built-up records, and factory premises against their layout and utilities. Where the purpose demands it, rental evidence and comparable sales from the same locality are placed in the report, so the reader can follow the road from evidence to number.",
    chips: [
      "Bank mortgage",
      "Court & settlement",
      "Capital gains",
      "Purchase decisions",
    ],
    /* TODO(client): confirm and extend */
    keepReady: [
      "Title documents or sale deed",
      "Sanctioned building plan",
      "Latest property tax receipt",
      "Prior valuation report, if any",
    ],
    hero: {
      src: "/images/slides/slide-01-real-estate.webp",
      alt: "A residential and commercial facade in strong raking light",
    },
    img2: {
      src: "/images/pages/page-01-interior.webp",
      alt: "An interior looking out over the city through a full-height window",
    },
    meta: "Registered valuer property valuation in Nagpur and Chhindwara. Residential, commercial and industrial reports accepted by banks, courts and the Income Tax Department.",
  },
  {
    slug: "plant-machinery-valuation",
    n: "02",
    hue: "#3F5C7A",
    hueText: "#9CA9B5",
    title: ["Plant & machinery ", "valuation"],
    em: 1,
    plain: "Plant & machinery valuation",
    summary:
      "Age, condition and market comparables for plant, machinery and equipment — from single assets to full facilities.",
    pageBody1:
      "Machinery, equipment and complete plant setups, from a single lathe to a full production line. A valuer inspects each asset in person and records make, capacity, age, condition and remaining useful life, then sets the findings against current market and replacement costs. Nothing is valued from a photograph. The signed report holds up in loan sanction, insurance and dispute, because every figure in it traces back to an inspection entry.",
    pageBody2:
      "Where records are incomplete, the machine itself becomes the record: nameplates, serial numbers and condition are photographed and entered against each line item. Depreciation is worked from observed condition and remaining life, not from a standard table alone.",
    chips: ["Loan collateral", "Insurance", "Disputes", "Asset purchase"],
    /* TODO(client): confirm */
    keepReady: [
      "Asset register or purchase invoices",
      "Machine specifications where available",
      "Site access for inspection",
      "Prior valuation report, if any",
    ],
    hero: {
      src: "/images/slides/slide-02-machinery.webp",
      alt: "A radial engine and propeller, close-up on the machined detail",
    },
    img2: {
      src: "/images/pages/page-02-workshop.webp",
      alt: "A lathe on a workshop floor, close in on the tooling",
    },
    meta: "Plant and machinery valuation by registered valuers across Madhya Pradesh and Maharashtra. Inspected in person, accepted by banks and insurers.",
  },
  {
    slug: "valuation-under-ibc",
    n: "03",
    hue: "#7A3F46",
    hueText: "#B69C9E",
    title: ["Valuation under ", "IBC"],
    em: 1,
    plain: "Valuation under IBC",
    summary:
      "CIRP and liquidation valuations under the Insolvency and Bankruptcy Code, built to survive committee and court review.",
    pageBody1:
      "Valuations for CIRP and liquidation under the Insolvency and Bankruptcy Code, prepared by IBBI-registered valuers as the Code requires. Fair value and liquidation value are determined separately, with method and assumptions recorded for the committee of creditors and the tribunal. Our reports have been accepted by the Debts Recovery Tribunal and resolution professionals across Madhya Pradesh and Maharashtra, and we stand behind them when questioned.",
    pageBody2:
      "Timelines under the Code are short, and we sequence inspection, working papers and the signed report to meet the committee's calendar. Every assumption is written down, because a valuation that cannot be questioned cannot be relied on.",
    chips: ["CIRP", "Liquidation", "Resolution professionals"],
    /* TODO(client): confirm */
    keepReady: [
      "Information memorandum or asset list",
      "Title and charge documents available with the RP",
      "Site access arrangements",
    ],
    hero: {
      src: "/images/slides/slide-03-ibc.webp",
      alt: "A colonnade of fluted columns on a courthouse portico",
    },
    img2: {
      src: "/images/pages/page-03-files.webp",
      alt: "Case files ranked along a shelf",
    },
    meta: "IBBI-registered valuation for CIRP and liquidation under the Insolvency and Bankruptcy Code. Fair value and liquidation value, accepted by tribunals and resolution professionals.",
  },
  {
    slug: "business-valuation",
    n: "04",
    hue: "#5C4A7A",
    hueText: "#A9A1B5",
    title: ["Business ", "valuation"],
    em: 1,
    plain: "Business valuation",
    summary:
      "Income, market and asset approaches to whole-business value — for transactions, disputes and planning.",
    pageBody1:
      "Whole-business value for transactions, disputes and planning, using income, market and asset approaches as the situation requires. We state which approach carried the conclusion and why, so the number can be examined rather than taken on faith. Financials are read alongside the assets we physically verify, which is what separates a valuation from an estimate.",
    pageBody2:
      "Where the business holds land, buildings or machinery, the same registered valuers verify them in person. The business number is then built on asset values that have already been defended once.",
    chips: ["Transactions", "Disputes", "Succession planning"],
    /* TODO(client): confirm */
    keepReady: [
      "Three years of audited financials",
      "Asset register",
      "Details of pending disputes or charges, if any",
    ],
    hero: {
      src: "/images/slides/slide-04-business.webp",
      alt: "A city skyline at dusk, towers reduced to silhouette",
    },
    img2: {
      src: "/images/pages/page-04-interior.webp",
      alt: "A concrete office interior, empty and lit from one side",
    },
    meta: "Business valuation for transactions, disputes and succession. Income, market and asset approaches, stated and defended.",
  },
  {
    slug: "financial-reporting-valuation",
    n: "05",
    hue: "#3F6E66",
    hueText: "#9CB1AC",
    title: ["Financial reporting ", "valuation"],
    em: 1,
    plain: "Financial reporting valuation",
    summary:
      "Ind-AS and IFRS fair-value measurements with the working papers auditors ask for.",
    pageBody1:
      "Fair value measurements under Ind-AS and IFRS, with working papers prepared for the audit that follows. Auditors receive the basis of valuation, the inputs used and their sources, documented to be checked line by line. Reports are accepted by the Income Tax Department and statutory auditors.",
    pageBody2:
      "Working papers follow the same discipline as the report: each input carries its source, each adjustment its reason. When the auditor asks how a figure was reached, the answer is already on file.",
    chips: ["Ind-AS", "IFRS", "Audit support"],
    /* TODO(client): confirm */
    keepReady: [
      "Trial balance and fixed asset register",
      "Prior year valuation working papers, if any",
      "Auditor's requirements list",
    ],
    hero: {
      src: "/images/slides/slide-05-financial.webp",
      alt: "A close crop of a written ledger page",
    },
    img2: {
      src: "/images/pages/page-05-tables.webp",
      alt: "A calculator resting on a printed table of figures",
    },
    meta: "Ind-AS and IFRS fair value measurement with audit-ready working papers. Accepted by statutory auditors and the Income Tax Department.",
  },
  {
    slug: "ma-support",
    n: "06",
    hue: "#7A5A3F",
    hueText: "#B6A89B",
    title: ["M&A ", "support"],
    em: 1,
    plain: "M&A support",
    summary:
      "Valuation support through restructuring and M&A — diligence, swap ratios and fairness opinions.",
    pageBody1:
      "Valuation support through mergers, acquisitions and restructuring: diligence on asset values, swap ratio workings and fairness opinions. Both sides of a transaction get the same rigour, a physically verified asset base and a stated method, signed by a registered valuer who answers for the number.",
    pageBody2:
      "Sensitive information moves under written confidentiality, and both sides receive identical documentation. Scope is agreed before work begins, so the opinion arrives when the deal needs it, not after.",
    chips: ["Diligence", "Swap ratios", "Fairness opinions"],
    /* TODO(client): confirm */
    keepReady: [
      "Deal outline and asset perimeters",
      "Financials of the entities involved",
      "Timeline and counterparty requirements",
    ],
    hero: {
      src: "/images/slides/slide-06-ma.webp",
      alt: "Two towers joined by a skybridge, seen from below",
    },
    img2: {
      src: "/images/pages/page-06-bridge.webp",
      alt: "A cable-stayed bridge deck seen from underneath",
    },
    meta: "Valuation support for mergers, acquisitions and restructuring. Diligence, swap ratios and fairness opinions by registered valuers.",
  },
];

/* ------------------------------------------------------------------ R-15
 * THE GUARDRAIL.
 *
 * `summary` is the register row's hover line and NOTHING else. It has a
 * fixed 280px column to live in, so its length is a layout constraint,
 * not a preference — and this assert is what stops that being learned
 * again by looking at a screenshot.
 *
 * The bug it exists to kill: the row was bound to the service page's
 * SECOND paragraph (193–344 characters) instead of the summary, and
 * nothing constrained the slot, so the text painted straight out of the
 * row's highlight panel. The page-only fields are named `pageBody1` and
 * `pageBody2` now precisely so that writing `summary` when you mean a
 * page paragraph is a thing you have to do on purpose.
 *
 * This runs at module scope, so it runs at build: a summary over the
 * limit fails `next build` rather than reaching a screenshot.
 */
/* 128, not the brief's 160 — and the difference is measured, not
   preferred. The slot is 280px of 13px mono at a 7.8px advance: 35
   characters a raw line, ~32 once words break, and the clamp is 4 lines.
   160 characters needs five to six lines in a four-line box, so a 160
   assert would have passed a summary the row then silently cut off,
   which is the exact failure this assert exists to prevent. The number
   the geometry allows is the number the assert enforces; if the column
   or the type ever changes, this changes with it. Longest today: 118. */
const SUMMARY_MAX = 128;
for (const s of SERVICES) {
  if (typeof s.summary !== "string" || !s.summary) {
    throw new Error(`services.js: "${s.slug}" has no summary (the register row's hover line).`);
  }
  if (s.summary.length > SUMMARY_MAX) {
    throw new Error(
      `services.js: "${s.slug}" summary is ${s.summary.length} characters; the register row's slot holds ${SUMMARY_MAX} at 280px over four lines. Put the long copy in pageBody1/pageBody2.`
    );
  }
}

export const bySlug = (slug) => SERVICES.find((s) => s.slug === slug);

/* 06 wraps back to 01 — the loop is the point of the NEXT row */
export const nextOf = (slug) => {
  const i = SERVICES.findIndex((s) => s.slug === slug);
  return SERVICES[(i + 1) % SERVICES.length];
};

/* The practical line. The turnaround clause is deliberately absent: the
   brief allows "7-10 days" only on the client's confirmation, and it has
   not been given, so the sentence ends without it rather than shipping a
   number the firm has not stood behind.
   TODO(client): typical days from site visit, which may differ per service. */
export const PRACTICAL =
  "Offices in Nagpur & Chhindwara · inspections across MP & Maharashtra · IBBI & Income Tax Dept. registered";

/* ------------------------------------------------------- the register
   /services is the catalogue. Six practices carry their own pages (the
   SERVICES array above); everything below is within scope and reachable
   by phone, which is exactly what the page says. No page, no numeral, no
   link — a list of what the firm does, not a menu of what it sells. */

export const REGISTER_INTRO =
  "Twelve services under one discipline: a registered valuer or chartered engineer inspects, measures and signs. Six practices carry their own pages below. The rest are within scope and a phone call away.";

/* Carried over from the legacy page, which is the only thing on it worth
   keeping: the places the firm actually travels to. */
export const CITIES = [
  "Nagpur",
  "Chhindwara",
  "Betul",
  "Seoni",
  "Balaghat",
  "Jabalpur",
  "Bhopal",
  "Indore",
  "Pandhurna",
];

export const ALSO_IN_SCOPE = [
  {
    title: "Agricultural land valuation",
    glyph: "agricultural",
    desc: "Soil class, irrigation and location, valued for acquisition, conversion and finance.",
  },
  {
    title: "Specialized assets",
    glyph: "specialized",
    desc: "Infrastructure, utilities and purpose-built properties valued on inspection and use.",
  },
  {
    title: "Fairness opinions",
    glyph: "fairness",
    desc: "Independent opinions for related-party and structured transactions, signed and defended.",
  },
  {
    title: "Valuation for insurance",
    glyph: "insurance",
    desc: "Reinstatement and indemnity values with the schedules insurers ask for.",
  },
  {
    title: "Regulatory valuations",
    glyph: "regulatory",
    desc: "Income Tax, Company Law and other statutory requirements, formatted to the rule that asks.",
  },
  {
    title: "Litigation support",
    glyph: "litigation",
    desc: "Reports and testimony for disputes, arbitration and court proceedings.",
  },
  {
    title: "Chartered Engineer certificates",
    glyph: "certificates",
    desc: "CE certification for statutory, banking and regulatory needs.",
  },
  {
    title: "Project cost estimation & vetting",
    glyph: "project",
    desc: "Independent build-up and review of project costs at every stage.",
  },
  {
    title: "Architectural & structural consulting",
    glyph: "architectural",
    desc: "Planning, design development and technical documentation.",
  },
];

/* Every figure is already on the home page's record section, which is where the
   row links. Nothing here is estimated. */
export const PROOF = [
  { figure: "02", label: "Offices" },
  { figure: "09", label: "Cities" },
  { figure: "15", label: "Institutions" },
];
