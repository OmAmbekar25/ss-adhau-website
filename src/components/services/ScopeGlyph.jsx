/* THE SCOPE GLYPHS — nine drawings, drawn here.
 *
 * No icon library. lucide was deleted with the legacy page and does not
 * come back through a side door: every one of these is a hand-written
 * path on a 24x24 grid, single stroke, no fill, no circle, no colour of
 * its own. They are hairlines, which is the only line language this site
 * has — the same 1px rules that rule the ledger, bent into a subject.
 *
 * Every path carries `pathLength="1"`, so a dash array of 1 is the whole
 * path whatever its real arc length. That is what lets one CSS rule draw
 * all nine at the same rate: without it a long path and a short path
 * would need different dash arrays, and the umbrella would finish while
 * the pylon was still halfway up.
 *
 * The stroke is 1.25 and does NOT scale with the box, so the drawings sit
 * at the same weight as the rules beside them.
 */

const GLYPHS = {
  /* three furrows in perspective, curving away */
  agricultural: [
    "M3 8.4C7.6 3.6 16.4 3.6 21 8.4",
    "M3 13C7.6 8.2 16.4 8.2 21 13",
    "M3 17.6C7.6 12.8 16.4 12.8 21 17.6",
  ],
  /* a transmission pylon. The crossarms overhang the legs — drawn flush
     they read as the bar of a capital A, which is what the first cut of
     this one was mistaken for */
  specialized: [
    "M12 3L5.2 21M12 3L18.8 21",
    "M6.8 10.2H17.2",
    "M5.2 15.4H18.8",
    "M8.6 10.2L16.7 15.4M15.4 10.2L7.3 15.4",
  ],
  /* a balance: one beam, two pans deep enough to be pans, and the post
     that holds them level */
  fairness: [
    "M3.5 7.2H20.5",
    "M7 7.2V9.6M17 7.2V9.6",
    "M3.2 9.6C3.2 13.6 10.8 13.6 10.8 9.6",
    "M13.2 9.6C13.2 13.6 20.8 13.6 20.8 9.6",
    "M12 7.2V19.4M8.8 19.4H15.2",
  ],
  /* an umbrella: the canopy over its own scallops, and the crook */
  insurance: [
    "M2.5 12.4A9.5 9.5 0 0 1 21.5 12.4",
    "M2.5 12.4C5.7 9.3 8.8 9.3 12 12.4C15.2 9.3 18.3 9.3 21.5 12.4",
    "M12 12.4V18.1A2.5 2.5 0 0 1 7 18.1",
  ],
  /* the section mark, built the way it is built: two interlocking S
     strokes rather than one, which is why the middle reads as crossed */
  regulatory: [
    "M15.2 7C15.2 5.2 13.8 4 12 4C10.2 4 8.8 5.2 8.8 6.8C8.8 10.4 15.2 10.6 15.2 14.2C15.2 15.8 13.8 17 12 17",
    "M8.8 17C8.8 18.8 10.2 20 12 20C13.8 20 15.2 18.8 15.2 17.2C15.2 13.6 8.8 13.4 8.8 9.8C8.8 8.2 10.2 7 12 7",
  ],
  /* a tribunal: pediment, entablature, two shafts, two steps */
  litigation: [
    "M3.4 6.2L12 2L20.6 6.2",
    "M4.6 8.6H19.4",
    "M9 8.6V15.6M15 8.6V15.6",
    "M6.2 18.4H17.8",
    "M4 21H20",
  ],
  /* a seal drawn as an octagon — the brief bans circles, and a seal is
     a circle by habit rather than by necessity — with two ribbons */
  certificates: [
    "M12 2.6L16.6 4.5L18.5 9.1L16.6 13.7L12 15.6L7.4 13.7L5.5 9.1L7.4 4.5Z",
    "M9.7 14.7L8.5 21.4L12 19.4L15.5 21.4L14.3 14.7",
  ],
  /* a cost build-up: four rising steps over the rule they are measured
     against */
  project: [
    "M3.5 17.5V12.6H8.5V9.6H13.5V6.6H18.5V17.5",
    "M2.5 20.5H21.5",
  ],
  /* a set square and a pair of compasses. The compasses' hinge is a cap
     ACROSS the apex, not a bar between the legs: drawn between them, the
     pair read as a second capital A sitting next to a triangle */
  architectural: [
    "M3.2 9.6V20.8H14.4Z",
    "M16.3 3.6H18.9",
    "M17.6 3.6L14.2 13.6M17.6 3.6L21 13.6",
  ],
};

export default function ScopeGlyph({ name }) {
  const paths = GLYPHS[name];
  if (!paths) return null;
  return (
    <svg
      className="er-ledger__glyph"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      focusable="false"
      data-glyph
    >
      {paths.map((d) => (
        <path key={d} d={d} pathLength="1" />
      ))}
    </svg>
  );
}
