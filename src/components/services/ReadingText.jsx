import "./reading.css";

/* A paragraph that can be filled word by word without becoming a pile of
 * spans as far as assistive technology, selection or search are concerned.
 *
 * The split is done here, on the server, not at runtime: the words are
 * already in the markup when the page arrives, so nothing reflows on
 * hydration and a visitor with no JS reads a finished paragraph.
 *
 * No ARIA at all, and that is deliberate. The first version hid the split
 * behind `aria-hidden` spans and named the paragraph with `aria-label` —
 * which axe flagged as `aria-prohibited-attr`, correctly: a <p> has no
 * role that supports an accessible name, so the label was both invalid
 * and, on the readers that honoured it, the only thing standing between
 * the user and the text.
 *
 * Plain inline spans need none of it. They carry no role and no styling
 * that breaks the text run, so the accessibility tree sees exactly what a
 * <p> containing an <em> would: one paragraph of continuous text. The
 * whitespace between words lives INSIDE each span rather than in CSS, so
 * selection, copy and find-in-page all behave as if the split were not
 * there.
 */

export default function ReadingText({ text, className = "" }) {
  const words = text.split(" ");
  return (
    <p className={`er-svc__read ${className}`.trim()} data-svc-read>
      {words.map((w, i) => (
        <span key={i} data-w>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
