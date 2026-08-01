import { Newsreader } from "next/font/google";

/* THE READING FACE, declared once and imported by the segments that read.
 *
 * It began in the root layout, where every font is preloaded on every route
 * — the home page was downloading a reading face it never sets a glyph in.
 * Turning the preload off fixed that and broke something else: without it
 * the file arrives after first paint and the swap reflowed a paragraph
 * badly enough to put 0.127 of layout shift on a page that had been holding
 * zero. Declaring it per segment is what both answers were approximating.
 *
 * It lives here rather than inside `/services/layout.js` because a second
 * segment needs it: `/locations` sets its card bodies and its hero sub-line
 * in this face, and the first time that page was built without the segment
 * declaring it, every one of them silently rendered in the mono — the same
 * failure `.er-svc__read` had when it lived in a stylesheet the register did
 * not load. A shared voice belongs in a shared module.
 *
 * (This module was written for the territory build, went out with its
 * revert, and is back because the upgrade pass needs the same face on the
 * same page. The lesson outlived the layout.)
 */
export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
