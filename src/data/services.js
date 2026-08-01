/* The six service payloads.
 *
 * One template renders all of these; there is no per-page layout fork
 * anywhere in `/services/[slug]`. If a page needs something the others do
 * not have, it goes in this file as data — `img3` is the only such case,
 * and only real estate carries one.
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
    paragraph:
      "Residential, commercial and industrial property: flats, plots, shops, offices, warehouses and factory premises. Every valuation begins with a physical inspection by a registered valuer. Boundaries, built-up area, construction quality and occupancy are measured on site and set against local market evidence. The report states its approach and assumptions in full, carries the valuer's name and IBBI registration, and is formatted to your bank's standard. Fifteen banks, tribunals and departments accept our reports.",
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
    img3: {
      src: "/images/pages/page-01-pattern.webp",
      alt: "The zigzag of a balcony run seen head-on",
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
    paragraph:
      "Machinery, equipment and complete plant setups, from a single lathe to a full production line. A valuer inspects each asset in person and records make, capacity, age, condition and remaining useful life, then sets the findings against current market and replacement costs. Nothing is valued from a photograph. The signed report holds up in loan sanction, insurance and dispute, because every figure in it traces back to an inspection entry.",
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
    paragraph:
      "Valuations for CIRP and liquidation under the Insolvency and Bankruptcy Code, prepared by IBBI-registered valuers as the Code requires. Fair value and liquidation value are determined separately, with method and assumptions recorded for the committee of creditors and the tribunal. Our reports have been accepted by the Debts Recovery Tribunal and resolution professionals across Madhya Pradesh and Maharashtra, and we stand behind them when questioned.",
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
    paragraph:
      "Whole-business value for transactions, disputes and planning, using income, market and asset approaches as the situation requires. We state which approach carried the conclusion and why, so the number can be examined rather than taken on faith. Financials are read alongside the assets we physically verify, which is what separates a valuation from an estimate.",
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
    paragraph:
      "Fair value measurements under Ind-AS and IFRS, with working papers prepared for the audit that follows. Auditors receive the basis of valuation, the inputs used and their sources, documented to be checked line by line. Reports are accepted by the Income Tax Department and statutory auditors.",
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
    paragraph:
      "Valuation support through mergers, acquisitions and restructuring: diligence on asset values, swap ratio workings and fairness opinions. Both sides of a transaction get the same rigour, a physically verified asset base and a stated method, signed by a registered valuer who answers for the number.",
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
