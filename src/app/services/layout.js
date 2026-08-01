import { Newsreader } from "next/font/google";

/* The third voice, declared for the routes that actually read.
 *
 * It began in the root layout, where every font is preloaded on every
 * route — the home page was downloading a reading face it never sets a glyph
 * in. Turning the preload off fixed that and broke something else: without
 * it the file arrives after first paint, and the swap reflowed the intro
 * paragraph badly enough to put 0.127 of layout shift on a page that had
 * been holding zero.
 *
 * Declaring it in this segment's layout is what the two answers were both
 * approximating. The routes under /services preload it and never shift;
 * every other route never hears of it.
 *
 * Latin subset, roman and italic at 400 and nothing else. No `axes`:
 * next/font rejects an axis list alongside a pinned weight, and the static
 * cuts are already drawn at a text optical size, which is what pinning
 * opsz was for.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export default function ServicesLayout({ children }) {
  return <div className={newsreader.variable}>{children}</div>;
}
