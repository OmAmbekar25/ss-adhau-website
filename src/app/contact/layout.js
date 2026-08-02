import { newsreader } from "@/app/fonts/newsreader";

/* /contact reads: the lede under the title and the success line are set in
   the reading face. Same per-segment declaration as /services, /locations
   and /about — see the font module for why it is not in the root. */
export default function ContactLayout({ children }) {
  return <div className={newsreader.variable}>{children}</div>;
}
