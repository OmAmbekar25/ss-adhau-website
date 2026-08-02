import { newsreader } from "@/app/fonts/newsreader";

/* /about reads: the story, the bios and the FAQ answers are all set in
   the reading face. Same per-segment declaration as /services and
   /locations — see the font module for the history. */
export default function AboutLayout({ children }) {
  return <div className={newsreader.variable}>{children}</div>;
}
