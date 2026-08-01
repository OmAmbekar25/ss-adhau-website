/* The firm's five process steps.
   Two places told this story and one of them is gone: `ValuationJourney`
   and its `lib/reportScene.js` were deleted with the legacy home page, so
   the home page's `StudioJourney` is now the only reader. The file stays
   as data rather than being folded into the component — the steps are the
   firm's process, not one section's copy.
   Order matters — it maps 1:1 onto the five forms in lib/studioScene.js. */

const valuationBeats = [
  {
    title: "Enquiry & Scope",
    short: "Enquiry",
    caption: "Nothing is measured yet",
    description:
      "We understand the asset, the purpose of valuation (bank mortgage, IBC, tax, M&A, etc.), and the applicable regulatory framework.",
  },
  {
    title: "Site Inspection",
    short: "Inspection",
    caption: "The parcel, measured on location",
    description:
      "A registered valuer visits the site to physically inspect, measure, and document the property or asset in detail.",
  },
  {
    title: "Market & Technical Analysis",
    short: "Analysis",
    caption: "Readings ordered against the market",
    description:
      "Local market data is cross-checked against technical and engineering assessments to arrive at a defensible value.",
  },
  {
    title: "Report & Certification",
    short: "Certification",
    caption: "Stamped and signed",
    description:
      "A detailed valuation report is prepared and certified by our registered valuers, aligned with statutory standards.",
  },
  {
    title: "Delivery & Support",
    short: "Delivery",
    caption: "Originals issued, questions answered",
    description:
      "The report is delivered to you, with ongoing support for any clarification needed by banks, courts, or regulators.",
  },
];

export default valuationBeats;
