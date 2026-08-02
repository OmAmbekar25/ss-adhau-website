/* THE TEAM — five members, one record each.
 *
 * Migrated from the deleted /team/[slug] pages, which is the site's own
 * published record. Nothing here is invented: every degree, registration
 * and membership below appeared on those pages. What was NOT migrated is
 * the adjective padding around the facts ("distinguished leader",
 * "strategic insights") — the trust register states facts and lets them
 * argue.
 *
 * BIOS. Only Sunil's prose bio ships: the brief supplies it, cleaned. The
 * other four are TODO(client) by the client's own instruction, against the
 * template in the brief: 2-4 lines, degree + university, registrations or
 * memberships, what they lead or cover in the firm. No adjectives. The
 * KEY INFORMATION register is populated for everyone from the migrated
 * facts, so a dossier without a bio is still a dossier.
 *
 * PORTRAITS. None exist yet. Each member renders a monogram tile in the
 * exact frame the photo will occupy — /public/images/team/[slug].webp at
 * 520x694 — so the swap is a data change: set `img` and nothing else.
 *
 * `roster` is the right-hand credential line on the row: abbreviations
 * only, four tokens or fewer, uppercase set by CSS not by the data.
 *
 * `prefix` is separated from `name` because A-1 sets names in the display
 * serif and hangs the honorific beside them in mono — the serif signs the
 * name, and "Er." is a title, not part of the signature.
 *
 * `short` is the domain phrase for the row's hover line, which shares a
 * 340px slot with the credentials it replaces — `domain` is the dossier's
 * sentence, `short` is the one that has to fit beside a 64px signature.
 *
 * `registrations` is an ARRAY, one line per registration: the seal block
 * in the dossier sets them as lines, and a member with none omits the
 * block entirely rather than showing an empty seal.
 */

export const TEAM = [
  {
    slug: "sudhakar-adhau",
    n: "01",
    prefix: "Er.",
    name: "Sudhakar S. Adhau",
    initials: "SA",
    /* TODO(client): the legacy grid said "Associate & Principal Advisor",
       the legacy subpage said "Principal". Placeholder per the brief until
       the firm resolves it. */
    role: "Principal Advisor",
    roster: ["B.E.", "M.I.E.", "F.I.V", "C.Eng"],
    qualifications: "B.E. Civil · M.I.E. · F.I.V · C.Eng.",
    registrations: [
      "Category I Registered Valuer (Wealth Tax Act), Income Tax Department",
      "Fellow, Institution of Valuers",
      "Member, Institution of Engineers",
    ],
    domain: "Valuation practice and advisory",
    short: "valuation practice and advisory",
    bio: null, // TODO(client) — template: degree + university · registrations · what he leads. No adjectives.
    img: null,
  },
  {
    slug: "sunil-adhau",
    n: "02",
    prefix: "Er.",
    name: "Sunil Sudhakar Adhau",
    initials: "SA",
    role: "Associate & Partner",
    roster: ["B.E.", "M.Sc.", "A.M.I.E.", "C.Eng"],
    qualifications:
      "B.E. Civil · M.Sc. Real Estate Valuation · M.Sc. Plant & Machinery Valuation · A.M.I.E. · A.I.V · C.Eng.",
    registrations: [
      "IBBI Registered Valuer (Land & Building) under the Companies Act, 2013",
      "Category I (Immovable Properties), Income Tax Department, Govt. of India",
      "Member, IOV Registered Valuer Foundation",
    ],
    domain: "Business operations and valuation technology",
    short: "operations and valuation technology",
    bio: [
      "A graduate in Civil Engineering from Nagpur University, with full-time Master's degrees in Real Estate Valuation and in Plant and Machinery Valuation from Sardar Patel University, Gujarat.",
      "He has worked as an Independent Engineer for lenders, investors and property owners, and holds the registrations that make a valuation admissible rather than advisory.",
      "Within the firm he leads business operations and the adoption of technology across the valuation practice.",
    ],
    img: null,
  },
  {
    slug: "nishigandha-adhau",
    n: "03",
    prefix: "Er.",
    name: "Nishigandha Sunil Adhau",
    initials: "NA",
    role: "Associate",
    roster: ["B.E.", "M.Com."],
    qualifications: "B.E. Civil · M.Com. Real Estate Valuation",
    registrations: null,
    domain: "Valuation process, documentation and analysis",
    short: "process, documentation and analysis",
    bio: null, // TODO(client)
    img: null,
  },
  {
    slug: "prateek-agrawal",
    n: "04",
    prefix: "Er.",
    name: "Prateek Agrawal",
    initials: "PA",
    role: "Associate",
    roster: ["B.E.", "M.Tech", "C.Eng", "M.I.O.V"],
    qualifications: "B.E. Civil · M.Tech Structural Engineering · C.Eng. · M.I.O.V.",
    registrations: ["Chartered Engineer", "Member, Institution of Valuers"],
    domain: "Structural assessment and valuation support",
    short: "structural assessment",
    bio: null, // TODO(client)
    img: null,
  },
  {
    /* "Ar.", not "Er." — she is an architect (B.Arch.), and the legacy
       page says so. The brief's "Er." is treated as a transcription slip
       rather than an instruction to change her title; flagged in §15. */
    slug: "renuka-trivedi",
    n: "05",
    prefix: "Ar.",
    name: "Renuka Trivedi",
    initials: "RT",
    role: "Associate",
    roster: ["B.Arch."],
    qualifications: "B.Arch.",
    registrations: null,
    domain: "Architectural planning and design",
    short: "architectural planning and design",
    bio: null, // TODO(client)
    img: null,
  },
];

export const bySlug = (slug) => TEAM.find((m) => m.slug === slug);
